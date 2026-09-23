#!/usr/bin/env python3
"""Legge le richieste che Kristina manda al bot Telegram e, se serve, le risponde.

Uso:
  python3 tools/leggi-richieste.py              elenca i messaggi nuovi (e li segna come letti)
  python3 tools/leggi-richieste.py --tutti      rilegge anche quelli già letti (24h)
  python3 tools/leggi-richieste.py --rispondi <chat_id> "testo"
  python3 tools/leggi-richieste.py --scarica    salva le foto ricevute in assets/img/ricevute/

Il token NON sta nel progetto: si trova in ~/.config/heels-bot/token
"""
import json, os, sys, pathlib, urllib.request, urllib.parse

CONF = pathlib.Path.home() / '.config' / 'heels-bot'
TOKEN_FILE, OFFSET_FILE = CONF / 'token', CONF / 'offset'
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

def main():
    args = sys.argv[1:]
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
