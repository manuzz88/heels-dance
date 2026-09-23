#!/usr/bin/env python3
"""Legge le richieste che Kristina manda al bot Telegram e, se serve, le risponde.

Uso:
  python3 tools/leggi-richieste.py              elenca i messaggi nuovi (e li segna come letti)
  python3 tools/leggi-richieste.py --tutti      rilegge anche quelli già letti (24h)
  python3 tools/leggi-richieste.py --rispondi <chat_id> "testo"
  python3 tools/leggi-richieste.py --scarica    salva le foto ricevute in assets/img/ricevute/
  python3 tools/leggi-richieste.py --raccogli   modo automatico: archivia tutto e inoltra a Manuel
                                                (da far girare ogni ora con cron: non usa Claude)
  python3 tools/leggi-richieste.py --archivio   mostra l'archivio completo delle richieste

Il token NON sta nel progetto: si trova in ~/.config/heels-bot/token
"""
import json, os, sys, pathlib, urllib.request, urllib.parse

CONF = pathlib.Path.home() / '.config' / 'heels-bot'
TOKEN_FILE, OFFSET_FILE = CONF / 'token', CONF / 'offset'
ARCHIVIO = CONF / 'richieste.jsonl'
MIO_CHAT = CONF / 'mio-chat-id'   # chat di Manuel: il bot gli inoltra le richieste
DEST = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'img' / 'ricevute'

def token():
    if not TOKEN_FILE.exists():
        sys.exit(f"Manca il token. Crealo con:\n  echo 'IL_TUO_TOKEN' > {TOKEN_FILE}")
    return TOKEN_FILE.read_text(encoding='utf-8').strip()

def api(method, **params):
    url = f'https://api.telegram.org/bot{token()}/{method}'
    data = urllib.parse.urlencode(params).encode() if params else None
    with urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=40) as r:
        out = json.load(r)
    if not out.get('ok'):
        sys.exit(f'Errore Telegram: {out}')
    return out['result']

def scarica_file(file_id, nome):
    info = api('getFile', file_id=file_id)
    url = f"https://api.telegram.org/file/bot{token()}/{info['file_path']}"
    DEST.mkdir(parents=True, exist_ok=True)
    dest = DEST / (nome + pathlib.Path(info['file_path']).suffix)
    urllib.request.urlretrieve(url, dest)
    return dest


def raccogli():
    """Modo automatico: scarica tutto, archivia, salva le foto, inoltra a Manuel.
    Pensato per girare ogni ora con cron. Non stampa niente se non c'è nulla di nuovo."""
    offset = int(OFFSET_FILE.read_text().strip() or 0) if OFFSET_FILE.exists() else 0
    upd = api('getUpdates', offset=offset, timeout=0)
    if not upd:
        return
    mio = MIO_CHAT.read_text(encoding='utf-8').strip() if MIO_CHAT.exists() else ''
    ultimo, nuovi = offset, 0
    with ARCHIVIO.open('a', encoding='utf-8') as f:
        for u in upd:
            ultimo = max(ultimo, u['update_id'] + 1)
            m = u.get('message') or u.get('edited_message')
            if not m:
                continue
            voce = {'update_id': u['update_id'], 'message_id': m['message_id'], 'date': m.get('date'),
                    'chat_id': m['chat']['id'], 'da': m.get('from', {}).get('first_name', '?'),
                    'testo': m.get('text') or m.get('caption') or '', 'tipo': 'testo'}
            if m.get('photo'):
                best = max(m['photo'], key=lambda p: p.get('file_size', 0))
                voce['tipo'] = 'foto'
                try: voce['file'] = str(scarica_file(best['file_id'], f"tg-{m['message_id']}"))
                except Exception as e: voce['errore'] = str(e)
            elif m.get('voice'):
                voce['tipo'] = 'vocale'
                try: voce['file'] = str(scarica_file(m['voice']['file_id'], f"tg-{m['message_id']}"))
                except Exception as e: voce['errore'] = str(e)
            elif m.get('document') and str(m['document'].get('mime_type','')).startswith('image/'):
                voce['tipo'] = 'immagine'
                try: voce['file'] = str(scarica_file(m['document']['file_id'], f"tg-{m['message_id']}"))
                except Exception as e: voce['errore'] = str(e)
            f.write(json.dumps(voce, ensure_ascii=False) + chr(10))
            nuovi += 1
            if mio and str(m['chat']['id']) != mio:
                try: api('forwardMessage', chat_id=mio, from_chat_id=m['chat']['id'], message_id=m['message_id'])
                except SystemExit: pass
    OFFSET_FILE.write_text(str(ultimo))
    if nuovi:
        print(f'{nuovi} richieste archiviate in {ARCHIVIO}')

def mostra_archivio():
    if not ARCHIVIO.exists():
        print('Archivio vuoto.'); return
    for riga in ARCHIVIO.read_text(encoding='utf-8').splitlines():
        v = json.loads(riga)
        import datetime
        quando = datetime.datetime.fromtimestamp(v.get('date') or 0).strftime('%d/%m %H:%M')
        print(f"\n─── {quando} · {v.get('da')} · chat {v.get('chat_id')} · {v.get('tipo')}")
        if v.get('testo'): print(v['testo'])
        if v.get('file'): print('file:', v['file'])

def main():
    args = sys.argv[1:]
    if '--raccogli' in args:
        raccogli(); return
    if '--archivio' in args:
        mostra_archivio(); return
    if args and args[0] == '--rispondi':
        api('sendMessage', chat_id=args[1], text=args[2])
        print('risposta inviata'); return
    rileggi = '--tutti' in args
    scarica = '--scarica' in args
    offset = 0 if rileggi else int(OFFSET_FILE.read_text().strip() or 0) if OFFSET_FILE.exists() else 0
    upd = api('getUpdates', offset=offset, timeout=0)
    if not upd:
        print('Nessun messaggio nuovo.'); return
    ultimo = offset
    for u in upd:
        ultimo = max(ultimo, u['update_id'] + 1)
        m = u.get('message') or u.get('edited_message')
        if not m: continue
        chi = m.get('from', {})
        nome = ' '.join(x for x in (chi.get('first_name'), chi.get('last_name')) if x) or chi.get('username', '?')
        print(f"\n─── da {nome} (chat {m['chat']['id']}) · messaggio {m['message_id']}")
        if m.get('text'): print(m['text'])
        if m.get('caption'): print('didascalia:', m['caption'])
        if m.get('voice'): print('[messaggio vocale, durata', m['voice'].get('duration'), 'secondi]')
        if m.get('photo'):
            best = max(m['photo'], key=lambda p: p.get('file_size', 0))
            print(f"[foto {best['width']}x{best['height']}]")
            if scarica: print('salvata in', scarica_file(best['file_id'], f"tg-{m['message_id']}"))
        if m.get('document'):
            d = m['document']; print(f"[file {d.get('file_name')} · {d.get('mime_type')}]")
            if scarica and str(d.get('mime_type','')).startswith('image/'):
                print('salvato in', scarica_file(d['file_id'], f"tg-{m['message_id']}"))
    if not rileggi:
        OFFSET_FILE.write_text(str(ultimo))
    print(f"\n{len(upd)} aggiornamenti letti.")

if __name__ == '__main__':
    main()
