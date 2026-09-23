#!/usr/bin/env python3
"""Ponte fra Telegram e il sito: Kristina scrive, Gemini modifica, il sito si pubblica.

Di serie pubblica da solo: i controlli automatici sono la rete di sicurezza e l'anteprima
va a chi ha fatto la richiesta. Manuel riceve un messaggio solo quando qualcosa non funziona.
Per tornare all'approvazione con un tocco basta creare il file:
  touch ~/.config/heels-bot/chiedi-approvazione

Comandi:
  python3 tools/bot.py --registra    registra chi scrive per primo come amministratore (Manuel)
  python3 tools/bot.py --ciclo       un giro completo: legge richieste, propone, gestisce i pulsanti
  python3 tools/bot.py --stato       mostra la proposta in sospeso e gli autorizzati
  python3 tools/bot.py --autorizza <chat_id> <nome>
  python3 tools/bot.py --annulla     scarta la proposta in sospeso e ripulisce il progetto

Segreti (mai dentro il progetto): ~/.config/heels-bot/
  token        token del bot Telegram
  gemini-key   chiave dedicata dell'API Gemini
"""
import json, os, re, subprocess, sys, time, pathlib, urllib.request, urllib.parse, urllib.error

PROGETTO = pathlib.Path(__file__).resolve().parent.parent
CONF = pathlib.Path.home() / '.config' / 'heels-bot'
TOKEN_F, GEMINI_F = CONF / 'token', CONF / 'gemini-key'
OFFSET_F, ADMIN_F = CONF / 'offset', CONF / 'mio-chat-id'
AUTH_F, PENDENTE_F = CONF / 'autorizzati.json', CONF / 'pendente.json'
LOG_F = CONF / 'richieste.jsonl'
BUSSANO_F = CONF / 'in-attesa.json'      # chi ha scritto senza essere autorizzato
FOTO_DIR = PROGETTO / 'assets' / 'img' / 'ricevute'
APPROVA_F = CONF / 'chiedi-approvazione'   # se esiste, Manuel deve approvare; se manca, si pubblica da solo
SHOT = PROGETTO / 'tools' / 'verifica.py'
MODELLO = os.environ.get('HEELS_MODELLO', 'gemini-3.8-flash')

# File che vengono mandati al modello: bastano per quasi ogni richiesta.
FILE_CONTESTO = ['styles.css', 'index.html', 'docs/copy.it.json', 'docs/copy.en.json', 'docs/copy.ru.json']
MODIFICABILI = set(FILE_CONTESTO) | {'script.js'}

REGOLE = """Sei l'assistente tecnico del sito vetrina di Kristina, insegnante di heels dance a Milano (Brera).
Ricevi una richiesta scritta da Kristina o da Manuel, spesso in russo o in italiano, e proponi la modifica al codice.

COME È FATTO IL SITO
- Sito statico: index.html, styles.css, script.js. Nessun passaggio di compilazione.
- Tre lingue: italiano, inglese, russo. I testi stanno in docs/copy.it.json, copy.en.json, copy.ru.json
  e vengono ricopiati dentro script.js da uno script automatico: tu modifichi SEMPRE i file in docs/,
  mai i dizionari dentro script.js, e metti "rigenera": true.
- Un testo cambiato va cambiato in TUTTE E TRE le lingue, con la stessa chiave, traducendo tu.
- Colori, caratteri e misure stanno in styles.css in cima, nel blocco :root. Cambiare lì vale per tutto il sito.
- Le impostazioni (contatti, prezzi, date dei workshop, interruttori) stanno nel blocco CONFIG in cima a script.js.
  Per modificarle usa il file script.js, ma solo dentro CONFIG, mai i dizionari.
- Le sezioni della pagina stanno in index.html, ognuna dentro un commento maiuscolo. I numeri si calcolano da soli.

REGOLE FERREE
- Non inventare fatti su Kristina, sui prezzi o sugli orari: se un dato manca, chiedilo in "dubbi".
- Non toccare i caratteri in assets/fonts, le icone favicon, né i file dentro tools/.
- Il campo "cerca" deve comparire IDENTICO nel file indicato, spazi compresi, e una sola volta.
- Preferisci la modifica più piccola che risolve la richiesta.
- Se la richiesta è ambigua o pericolosa, non inventare: lascia "modifiche" vuoto e scrivi la domanda in "dubbi".

RISPOSTA
Rispondi SOLO con questo JSON:
{"modifiche": [{"file": "<percorso>", "cerca": "<testo esatto>", "sostituisci": "<testo nuovo>"}],
 "spiegazione": "<una frase in italiano, per Manuel>",
 "risposta_a_kristina": "<una frase nella lingua della richiesta>",
 "rigenera": <true se hai toccato docs/copy.*.json, altrimenti false>,
 "ancora": "<selettore CSS della parte di pagina toccata, per l'anteprima: per esempio \"#prezzi\", \"#date\", \"#kristina\", \".hero\". Stringa vuota se la modifica riguarda tutto il sito>",
 "dubbi": "<domanda da fare, stringa vuota se non serve>"}"""


# ---------------------------------------------------------------- utilità
def leggi(p, default=''):
    return p.read_text(encoding='utf-8').strip() if p.exists() else default

def tg(metodo, **params):
    token = leggi(TOKEN_F)
    if not token:
        sys.exit(f'Manca il token in {TOKEN_F}')
    dati = urllib.parse.urlencode({k: (json.dumps(v) if isinstance(v, (dict, list)) else v)
                                   for k, v in params.items() if v is not None}).encode()
    url = f'https://api.telegram.org/bot{token}/{metodo}'
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=dati), timeout=60) as r:
            out = json.load(r)
    except urllib.error.HTTPError as e:
        out = json.loads(e.read().decode())
    if not out.get('ok'):
        print('Telegram:', out.get('description'), file=sys.stderr)
        return None
    return out['result']

def tg_foto(chat_id, percorso, didascalia, tastiera=None):
    """sendPhoto con multipart, senza dipendenze esterne."""
    token, conf = leggi(TOKEN_F), b'----heels' + str(time.time()).encode()
    campi = {'chat_id': str(chat_id), 'caption': didascalia[:1024], 'parse_mode': 'HTML'}
    if tastiera:
        campi['reply_markup'] = json.dumps(tastiera)
    corpo = b''
    for k, v in campi.items():
        corpo += b'--' + conf + b'\r\nContent-Disposition: form-data; name="' + k.encode() + b'"\r\n\r\n' + str(v).encode() + b'\r\n'
    dati = pathlib.Path(percorso).read_bytes()
    corpo += (b'--' + conf + b'\r\nContent-Disposition: form-data; name="photo"; filename="anteprima.jpg"\r\n'
              b'Content-Type: image/jpeg\r\n\r\n') + dati + b'\r\n--' + conf + b'--\r\n'
    req = urllib.request.Request(f'https://api.telegram.org/bot{token}/sendPhoto', data=corpo,
                                 headers={'Content-Type': 'multipart/form-data; boundary=' + conf.decode()})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r).get('ok')
    except urllib.error.HTTPError as e:
        print('sendPhoto:', e.read()[:200], file=sys.stderr)
        return False

def salva_foto(file_id, nome):
    token = leggi(TOKEN_F)
    with urllib.request.urlopen(f'https://api.telegram.org/bot{token}/getFile?file_id={file_id}', timeout=60) as r:
        info = json.load(r)['result']
    FOTO_DIR.mkdir(parents=True, exist_ok=True)
    dest = FOTO_DIR / (nome + pathlib.Path(info['file_path']).suffix)
    urllib.request.urlretrieve(f"https://api.telegram.org/file/bot{token}/{info['file_path']}", dest)
    return dest

def git(*args, check=True):
    r = subprocess.run(['git', '-C', str(PROGETTO), *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f'git {" ".join(args)}: {r.stderr.strip()}')
    return r.stdout.strip()

def autorizzati():
    try:
        return json.loads(AUTH_F.read_text(encoding='utf-8'))
    except Exception:
        return {}

def admin():
    return leggi(ADMIN_F)


# ---------------------------------------------------------------- Gemini
def chiedi_a_gemini(richiesta, chi):
    key = leggi(GEMINI_F)
    if not key:
        raise RuntimeError(f'Manca la chiave Gemini in {GEMINI_F}')
    contesto = []
    for rel in FILE_CONTESTO:
        p = PROGETTO / rel
        if p.exists():
            contesto.append(f'===== FILE: {rel} =====\n{p.read_text(encoding="utf-8")}')
    cfg = re.search(r'const CONFIG = \{.*?\n\};', (PROGETTO / 'script.js').read_text(encoding='utf-8'), re.S)
    if cfg:
        contesto.append(f'===== FILE: script.js (solo il blocco CONFIG) =====\n{cfg.group(0)}')
    oggi = time.strftime('%d/%m/%Y')
    corpo = {
        'systemInstruction': {'parts': [{'text': REGOLE + f'\nOggi è il {oggi}.'}]},
        'contents': [{'role': 'user', 'parts': [{'text': '\n\n'.join(contesto) +
                     f'\n\n===== RICHIESTA (da {chi}) =====\n{richiesta}'}]}],
        'generationConfig': {'temperature': 0.1, 'maxOutputTokens': 8000, 'responseMimeType': 'application/json'},
    }
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{MODELLO}:generateContent?key={key}'
    req = urllib.request.Request(url, data=json.dumps(corpo).encode(), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=300) as r:
        out = json.load(r)
    testo = out['candidates'][0]['content']['parts'][0]['text']
    uso = out.get('usageMetadata', {})
    return json.loads(testo), uso


# ---------------------------------------------------------------- modifiche
def applica(modifiche, rigenera):
    """Applica le sostituzioni. Solleva un errore se qualcosa non torna."""
    toccati = []
    for m in modifiche:
        rel = m['file'].lstrip('./')
        if rel not in MODIFICABILI:
            raise RuntimeError(f'file non modificabile: {rel}')
        p = PROGETTO / rel
        testo = p.read_text(encoding='utf-8')
        n = testo.count(m['cerca'])
        if n == 0:
            raise RuntimeError(f'in {rel} non trovo il testo da sostituire')
        if n > 1:
            raise RuntimeError(f'in {rel} il testo da sostituire compare {n} volte')
        p.write_text(testo.replace(m['cerca'], m['sostituisci'], 1), encoding='utf-8')
        toccati.append(rel)
    if rigenera and (PROGETTO / 'docs' / 'genera-script.js').exists():
        r = subprocess.run(['node', 'docs/genera-script.js'], cwd=PROGETTO, capture_output=True, text=True)
        if r.returncode != 0:
            raise RuntimeError('la rigenerazione dei dizionari è fallita: ' + r.stderr[:200])
        toccati.append('script.js')
    return toccati

def verifica(ancora=None):
    """Controlla che il sito regga: JSON validi, JavaScript valido, niente errori né sbordamenti."""
    problemi = []
    for rel in ('docs/copy.it.json', 'docs/copy.en.json', 'docs/copy.ru.json'):
        try:
            json.loads((PROGETTO / rel).read_text(encoding='utf-8'))
        except Exception as e:
            problemi.append(f'{rel} non è più valido: {e}')
    r = subprocess.run(['node', '-e', "new Function(require('fs').readFileSync('script.js','utf8'))"],
                       cwd=PROGETTO, capture_output=True, text=True)
    if r.returncode != 0:
        problemi.append('script.js contiene un errore: ' + r.stderr.strip().splitlines()[-1][:160])
    if problemi:
        return problemi, None
    cmd = [sys.executable, str(SHOT)] + ([ancora] if ancora else [])
    r = subprocess.run(cmd, cwd=PROGETTO, capture_output=True, text=True, timeout=420)
    try:
        esito = json.loads(r.stdout[r.stdout.index('{'):])
    except Exception:
        return ['non sono riuscito a controllare la pagina: ' + (r.stderr or r.stdout)[-200:]], None
    problemi += esito.get('problemi', [])
    return problemi, esito.get('anteprima')



def pubblica(descrizione, richiesta, da):
    """Registra e pubblica. Ritorna None se è andata, altrimenti il motivo."""
    git('add', '-A')
    subprocess.run(['git', '-C', str(PROGETTO), '-c', 'user.name=Manuel Lazzaro', 'commit', '-q', '-m',
                    f'Richiesta di {da}: {descrizione[:120]}\n\nTesto della richiesta: {richiesta[:250]}'],
                   capture_output=True)
    r = subprocess.run(['git', '-C', str(PROGETTO), 'push', '-q', 'origin', 'main'], capture_output=True, text=True)
    return None if r.returncode == 0 else (r.stderr or r.stdout)[-200:]

def proponi(richiesta, chi, chat_id):
    if PENDENTE_F.exists():
        tg('sendMessage', chat_id=chat_id, text='Sto ancora finendo la richiesta precedente. Riprova fra poco.')
        return
    if git('status', '--porcelain'):
        tg('sendMessage', chat_id=admin() or chat_id,
           text='Il progetto ha modifiche non pubblicate sul computer: non elaboro richieste finché non è pulito.')
        return
    esito, uso = chiedi_a_gemini(richiesta, chi)
    modifiche = esito.get('modifiche') or []
    if not modifiche:
        # nessuna modifica: è una domanda, un saluto o una richiesta poco chiara
        tg('sendMessage', chat_id=chat_id,
           text=esito.get('dubbi') or esito.get('risposta_a_kristina') or 'Non ho capito cosa cambiare. Me lo riscrivi?')
        return
    try:
        toccati = applica(modifiche, esito.get('rigenera'))
    except Exception as e:
        git('checkout', '--', '.', check=False)
        tg('sendMessage', chat_id=chat_id, text='Non sono riuscito a fare questa modifica. Provi a dirmelo in un altro modo?')
        tg('sendMessage', chat_id=admin() or chat_id, text=f'[tecnico] modifica non applicata · {chi}: {richiesta[:120]}\n{e}')
        return
    problemi, anteprima = verifica(esito.get('ancora') or None)
    if problemi:
        git('checkout', '--', '.', check=False)
        tg('sendMessage', chat_id=chat_id,
           text='Ho provato ma il sito non reggeva, quindi ho annullato tutto. Il sito è rimasto com\'era.')
        tg('sendMessage', chat_id=admin() or chat_id,
           text='[tecnico] modifica scartata dai controlli:\n· ' + '\n· '.join(problemi[:4]))
        return

    didascalia = f'<b>{esito.get("spiegazione","")}</b>\nFile toccati: {", ".join(toccati)}'
    if esito.get('dubbi'):
        didascalia += f'\n\nDubbio: {esito["dubbi"]}'

    if APPROVA_F.exists():
        pid = str(int(time.time()))
        PENDENTE_F.write_text(json.dumps({
            'id': pid, 'richiesta': richiesta, 'da': chi, 'chat_id': chat_id,
            'spiegazione': esito.get('spiegazione', ''), 'risposta': esito.get('risposta_a_kristina', ''),
            'file': toccati, 'token': uso.get('totalTokenCount')}, ensure_ascii=False), encoding='utf-8')
        tastiera = {'inline_keyboard': [[{'text': '✅ Pubblica', 'callback_data': f'ok:{pid}'},
                                         {'text': '❌ Annulla', 'callback_data': f'no:{pid}'}]]}
        testo = f'<b>Richiesta di {chi}</b>\n<i>{richiesta[:300]}</i>\n\n' + didascalia
        dest = admin() or chat_id
        if anteprima and pathlib.Path(anteprima).exists():
            tg_foto(dest, anteprima, testo, tastiera)
        else:
            tg('sendMessage', chat_id=dest, text=testo, parse_mode='HTML', reply_markup=tastiera)
        return

    # pubblicazione diretta: l'anteprima va a chi ha chiesto, non a Manuel
    errore = pubblica(esito.get('spiegazione', ''), richiesta, chi)
    if errore:
        git('checkout', '--', '.', check=False)
        tg('sendMessage', chat_id=chat_id, text='Non sono riuscito a mettere online la modifica.')
        tg('sendMessage', chat_id=admin() or chat_id, text=f'[tecnico] pubblicazione fallita: {errore}')
        return
    risposta = esito.get('risposta_a_kristina') or esito.get('spiegazione') or 'Fatto.'
    risposta += '\n\nhttps://manuzz88.github.io/heels-dance/'
    if anteprima and pathlib.Path(anteprima).exists():
        tg_foto(chat_id, anteprima, risposta)
    else:
        tg('sendMessage', chat_id=chat_id, text=risposta)


def decidi(pid, ok, chat_id, message_id):
    try:
        p = json.loads(PENDENTE_F.read_text(encoding='utf-8'))
    except Exception:
        return
    if p['id'] != pid:
        return
    if ok:
        git('add', '-A')
        subprocess.run(['git', '-C', str(PROGETTO), '-c', 'user.name=Manuel Lazzaro', 'commit', '-q', '-m',
                        f'Richiesta di {p["da"]}: {p["spiegazione"][:120]}\n\nRichiesta originale: {p["richiesta"][:200]}'],
                       capture_output=True)
        r = subprocess.run(['git', '-C', str(PROGETTO), 'push', '-q', 'origin', 'main'], capture_output=True, text=True)
        if r.returncode != 0:
            tg('sendMessage', chat_id=chat_id, text='Pubblicazione fallita: ' + r.stderr[-200:])
            return
        tg('editMessageCaption', chat_id=chat_id, message_id=message_id,
           caption=f'✅ Pubblicato.\n{p["spiegazione"]}', parse_mode='HTML')
        if p['chat_id'] != int(chat_id):
            tg('sendMessage', chat_id=p['chat_id'], text=p.get('risposta') or 'Готово! Посмотрите сайт.')
    else:
        git('checkout', '--', '.')
        tg('editMessageCaption', chat_id=chat_id, message_id=message_id,
           caption=f'❌ Annullato.\n{p["spiegazione"]}', parse_mode='HTML')
    PENDENTE_F.unlink(missing_ok=True)


# ---------------------------------------------------------------- ciclo
def ciclo(registra=False):
    offset = int(leggi(OFFSET_F, '0') or 0)
    upd = tg('getUpdates', offset=offset, timeout=0) or []
    if not upd:
        return
    auth, capo = autorizzati(), admin()
    ultimo = offset
    for u in upd:
        ultimo = max(ultimo, u['update_id'] + 1)
        cq = u.get('callback_query')
        if cq:
            tg('answerCallbackQuery', callback_query_id=cq['id'])
            if str(cq['from']['id']) != capo:
                continue
            azione, _, pid = cq['data'].partition(':')
            decidi(pid, azione == 'ok', cq['message']['chat']['id'], cq['message']['message_id'])
            continue
        m = u.get('message')
        if not m:
            continue
        if m.get('photo') and str(m['chat']['id']) in auth:
            best = max(m['photo'], key=lambda x: x.get('file_size', 0))
            try:
                dove = salva_foto(best['file_id'], f"tg-{m['message_id']}")
                tg('sendMessage', chat_id=m['chat']['id'],
                   text='Foto ricevuta. Dimmi dove va e la metto sul sito.')
                if capo:
                    tg('sendMessage', chat_id=capo, text=f'[foto] {m["from"].get("first_name")} ha mandato una foto: {dove}')
            except Exception as e:
                tg('sendMessage', chat_id=m['chat']['id'], text='Non sono riuscito a scaricare la foto.')
                if capo:
                    tg('sendMessage', chat_id=capo, text=f'[tecnico] foto non scaricata: {e}')
            continue
        if not m.get('text'):
            continue
        chat_id, nome = m['chat']['id'], m['from'].get('first_name', '?')
        if registra and not capo:
            ADMIN_F.write_text(str(chat_id))
            auth[str(chat_id)] = nome
            AUTH_F.write_text(json.dumps(auth, ensure_ascii=False))
            tg('sendMessage', chat_id=chat_id, text=f'Registrato: sei tu l\'amministratore ({nome}).')
            capo = str(chat_id)
            continue
        if str(chat_id) not in auth:
            try:
                attesa = json.loads(BUSSANO_F.read_text(encoding='utf-8'))
            except Exception:
                attesa = {}
            if str(chat_id) not in attesa:
                attesa[str(chat_id)] = nome
                BUSSANO_F.write_text(json.dumps(attesa, ensure_ascii=False), encoding='utf-8')
                if capo:
                    tg('sendMessage', chat_id=capo,
                       text=f'{nome} ha scritto al bot ma non è autorizzata.\nPer autorizzarla:\n'
                            f'python3 tools/bot.py --autorizza {chat_id} {nome}')
            tg('sendMessage', chat_id=chat_id, text='Ciao! Devo ancora essere autorizzato a risponderti. Un attimo di pazienza.')
            continue
        with LOG_F.open('a', encoding='utf-8') as f:
            f.write(json.dumps({'data': m.get('date'), 'da': nome, 'chat_id': chat_id, 'testo': m['text']}, ensure_ascii=False) + '\n')
        tg('sendMessage', chat_id=chat_id, text='Ricevuto, ci lavoro.')
        try:
            proponi(m['text'], nome, chat_id)
        except Exception as e:
            git('checkout', '--', '.', check=False)
            tg('sendMessage', chat_id=capo or chat_id, text=f'Errore mentre elaboravo: {str(e)[:300]}')
    OFFSET_F.write_text(str(ultimo))


def main():
    a = sys.argv[1:]
    if '--registra' in a:
        ciclo(registra=True)
    elif '--ciclo' in a:
        ciclo()
    elif '--autorizza' in a:
        i = a.index('--autorizza')
        auth = autorizzati(); auth[a[i+1]] = a[i+2] if len(a) > i+2 else 'ospite'
        AUTH_F.write_text(json.dumps(auth, ensure_ascii=False)); print('autorizzati:', auth)
    elif '--annulla' in a:
        git('checkout', '--', '.', check=False); PENDENTE_F.unlink(missing_ok=True); print('proposta annullata')
    elif '--stato' in a:
        print('amministratore:', admin() or 'non registrato')
        print('autorizzati:', autorizzati())
        print('in sospeso:', leggi(PENDENTE_F, 'nessuna')[:400])
    else:
        print(__doc__)

if __name__ == '__main__':
    main()
