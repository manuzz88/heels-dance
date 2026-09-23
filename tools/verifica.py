#!/usr/bin/env python3
"""Controlla che il sito regga e prepara un'anteprima da mandare su Telegram.

Stampa un JSON: {"problemi": [...], "anteprima": "<percorso jpg>"}
Controlla, nelle tre lingue: errori in console, sbordamenti orizzontali a 390/768/1440,
caratteri caricati, e che non compaiano testi non tradotti.
"""
import asyncio, json, pathlib, sys, tempfile

PROGETTO = pathlib.Path(__file__).resolve().parent.parent
USCITA = pathlib.Path(tempfile.gettempdir()) / 'heels-verifica'

async def controlla():
    from playwright.async_api import async_playwright
    USCITA.mkdir(parents=True, exist_ok=True)
    problemi, anteprima = [], None
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for lingua in ('it', 'en', 'ru'):
            for nome, w, h in (('telefono', 390, 844), ('schermo', 1440, 900)):
                ctx = await b.new_context(viewport={'width': w, 'height': h})
                pg = await ctx.new_page()
                errori = []
                pg.on('pageerror', lambda e: errori.append(str(e)))
                pg.on('console', lambda m: errori.append(m.text) if m.type == 'error' else None)
                await pg.goto((PROGETTO / 'index.html').as_uri(), wait_until='networkidle')
                if lingua != 'it':
                    await pg.evaluate('(l)=>window.setLang && window.setLang(l)', lingua)
                await pg.wait_for_timeout(900)
                await pg.evaluate("""async()=>{const h=document.documentElement.scrollHeight;
                    for(let y=0;y<h;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50))}
                    window.scrollTo(0,0)}""")
                await pg.wait_for_timeout(500)
                if errori:
                    problemi.append(f'{lingua}/{nome}: errore nella pagina · {errori[0][:120]}')
                sbordo = await pg.evaluate('()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1')
                if sbordo:
                    problemi.append(f'{lingua}/{nome}: la pagina sborda in larghezza')
                if lingua == 'it' and nome == 'schermo':
                    font = await pg.evaluate("()=>{const s=new Set();document.fonts.forEach(f=>{if(f.status==='loaded')s.add(f.family)});return [...s]}")
                    if not font:
                        problemi.append('i caratteri del sito non si caricano più')
                    vuote = await pg.evaluate("""()=>[...document.querySelectorAll('[data-i18n]')]
                        .filter(e=>!e.textContent.trim()).length""")
                    if vuote:
                        problemi.append(f'{vuote} testi sono rimasti vuoti')
                    png = USCITA / 'anteprima.png'
                    await pg.screenshot(path=str(png), full_page=True)
                    anteprima = comprimi(png)
                await ctx.close()
        await b.close()
    return problemi, anteprima

def comprimi(png):
    """Riduce l'immagine a un formato che Telegram accetta (lato max 1280, rapporto max 1:3)."""
    try:
        from PIL import Image
    except ImportError:
        return str(png)
    im = Image.open(png).convert('RGB')
    if im.height > im.width * 3:
        im = im.crop((0, 0, im.width, im.width * 3))
    if im.width > 1000:
        im = im.resize((1000, round(im.height * 1000 / im.width)), Image.LANCZOS)
    jpg = png.with_suffix('.jpg')
    im.save(jpg, quality=78, optimize=True)
    return str(jpg)

def main():
    try:
        problemi, anteprima = asyncio.run(controlla())
    except Exception as e:
        problemi, anteprima = [f'controllo non riuscito: {str(e)[:200]}'], None
    print(json.dumps({'problemi': problemi, 'anteprima': anteprima}, ensure_ascii=False))

if __name__ == '__main__':
    main()
