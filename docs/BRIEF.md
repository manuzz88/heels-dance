# BRIEF DI DESIGN DEFINITIVO — «Galleria Brera»
## Sito vetrina di Kristina · Heels dance · Milano, Brera

Versione 1.0 · 11 settembre 2026 · Lead designer → team di implementazione (HTML/CSS/JS vanilla, nessun build step)

Questo documento è il contratto di design. Parte dal concept vincitore («Brera Contemporaneo — Galleria n.4») e vi innesta le idee migliori degli altri concept indicate dai giudici: la «cucitura» rossa che accompagna lo scroll, la décolleté disegnata da una sola linea, il monogramma K-stiletto, le etichette di sartoria, il nastro trilingue, il blocco CONFIG unico, le animazioni opt-in. Tutte le misure, i colori, i testi e i comportamenti sono definitivi: dove un dato reale manca, il sito mostra un segnaposto `[TODO: …]` e non un fatto inventato.

Convenzioni del documento:
- «Antracite», «Avorio», «Minio» ecc. sono i nomi dei colori della palette (§2).
- Le misure sono in px a titolo di riferimento e in rem/clamp() nel CSS (base 16px).
- «≥1024» significa `@media (min-width: 1024px)`; «<768» significa `@media (max-width: 767.98px)`.
- Tutto ciò che è marcato `[TODO: …]` è un dato non confermato: resta visibile in sviluppo e viene risolto dal blocco CONFIG (§12) prima del lancio.

---

## 1. Visione e mood

Una galleria di via Brera alle 18 di settembre: pareti avorio calde, un filetto antracite che corre lungo tutta la parete, un solo quadro con un rosso minio che brucia. L'heels dance non è raccontata come spettacolo ma come disciplina di postura, camminata e presenza: sensualità per sottrazione, con corpo. Il corpo lo mettono la Bodoni in corsivo (una sola parola per titolo), la décolleté disegnata da una linea sola che tocca terra in un punto rosso, e la cucitura rossa che scende con chi legge come la riga posteriore di una calza. Niente nero puro, niente bianco puro, niente neon: avorio, antracite, rosso di pittura. Il sito deve essere bello fermo, senza foto, come un manifesto tipografico; quando arriveranno le foto, le cornici numerate le accoglieranno senza spostare un pixel.

---

## 2. Palette definitiva

Rapporti di contrasto calcolati con la formula WCAG 2.x (luminanza relativa sRGB) tramite script Python, arrotondati a due decimali. Soglie: testo normale ≥ 4.5:1, testo grande (≥ 24px, o ≥ 18.66px bold) ≥ 3:1, componenti UI e focus ≥ 3:1 (WCAG 1.4.11).

### 2.1 Colori

| Ruolo | Nome | HEX | Uso |
|---|---|---|---|
| Sfondo principale | Avorio Brera | `#F3EFE7` | `body`, header, hero, sezioni chiare; colore del testo sulle superfici scure e sul bottone primario |
| Superficie secondaria | Lino | `#E8E2D6` | Card chiare, cornici-segnaposto, tabella orari/prezzi, sfondo dei marquee, chip «esempio». Differenza puramente tonale rispetto all'Avorio (1.12:1): mai portatrice di significato da sola |
| Superficie secondaria (stop chiaro) | Lino chiaro | `#EDE7DB` | Solo come stop superiore del gradiente delle cornici (§4.3): mai come colore di testo o di bordo |
| Testo principale | Antracite | `#1E1C1A` | Titoli, body, nav, bordi dei bottoni outline, guida della cucitura, mini-mappa, tratti SVG |
| Testo secondario | Fumo caldo | `#5E5852` | Sottotitoli, didascalie, note, colophon, testo di supporto. A 12–13px solo in maiuscolo con tracking |
| Accento primario | Rosso Minio | `#B02C16` | L'unica tinta forte: eyebrow, cartellini, punto del monogramma, punto a terra del tacco, quadrato dell'hero, bottone primario (testo Avorio), trace della cucitura, underline attivo della nav, focus ring su chiaro |
| Accento hover/pressed | Minio scuro | `#9C2612` | Solo stato hover/active del bottone primario e del link rosso |
| Velo duotono | Minio profondo | `#8A2211` | Solo come layer `mix-blend-mode: multiply` sulle foto future in modalità `.frame--duo` (§6.5). Mai come testo |
| Accento su scuro | Corallo | `#EC7A62` | Versione «accesa» dello stesso rosso, usata SOLO sulle superfici Grafite/Antracite: eyebrow, link, bottone primario (testo Antracite), focus ring su scuro. Mai su Avorio o Lino |
| Superficie scura | Grafite | `#2B2825` | Una sola sezione invertita (Le lezioni) e il footer |
| Superficie scura 2 | Antracite | `#1E1C1A` | Card sul Grafite (tono più scuro), sfondo del menu mobile in variante scura (non usata in v1) |
| Testo secondario su scuro | Sabbia | `#B5AEA3` | Testo di supporto, note e bordi interattivi sulle superfici scure |
| Filetti chiari | Filetto | `#CFC7B9` | Righe da 1px tra sezioni, griglia delle card, bordo delle cornici, punti della «Griglia», numerali ghost. Solo decorativo (1.46:1) |
| Filetti scuri | Filetto scuro | `#45403B` | Righe da 1px e bordi a riposo delle card sulle superfici Grafite/Antracite. Solo decorativo |

### 2.2 Rapporti di contrasto (calcolati)

| Coppia (testo su sfondo) | Rapporto | Esito |
|---|---|---|
| Antracite su Avorio | 14.81:1 | AAA |
| Antracite su Lino | 13.17:1 | AAA |
| Fumo su Avorio | 6.12:1 | AA (anche 12px maiuscolo) |
| Fumo su Lino | 5.44:1 | AA |
| Rosso Minio su Avorio | 5.69:1 | AA anche per testo normale (eyebrow 12–13px) |
| Rosso Minio su Lino | 5.06:1 | AA |
| Avorio su Rosso Minio (bottone primario) | 5.69:1 | AA |
| Avorio su Minio scuro (hover) | 6.78:1 | AA |
| Avorio su Minio profondo | 7.90:1 | AA (non usato come testo, solo riferimento) |
| Avorio su Antracite | 14.81:1 | AAA |
| Avorio su Grafite | 12.78:1 | AAA |
| Sabbia su Antracite | 7.72:1 | AAA |
| Sabbia su Grafite | 6.66:1 | AA |
| Corallo su Antracite | 6.09:1 | AA |
| Corallo su Grafite | 5.25:1 | AA |
| Antracite su Corallo (bottone primario su scuro) | 6.09:1 | AA |
| Antracite su Filetto (chip su filetto) | 10.13:1 | AAA |
| Grafite su Avorio | 12.78:1 | AAA |
| Rosso Minio come bordo/focus su Avorio | 5.69:1 | ≥ 3:1 UI ok |
| Corallo come bordo/focus su Grafite | 5.25:1 | ≥ 3:1 UI ok |
| Sabbia come bordo UI su Grafite | 6.66:1 | ≥ 3:1 UI ok |
| Rosso Minio su Filetto | 3.89:1 | solo UI/linee, MAI testo |

### 2.3 Coppie vietate («mai accoppiare»)

| Coppia | Rapporto | Regola |
|---|---|---|
| Rosso Minio su Sabbia | 2.97:1 | vietata |
| Corallo su Avorio o Lino | 2.43:1 | vietata (il Corallo vive solo sul buio) |
| Sabbia su Avorio (o viceversa) | 1.92:1 | vietata |
| Fumo su Filetto | 4.18:1 | vietata come testo |
| Filetto su Avorio/Lino | 1.46 / 1.30:1 | solo decorativo; mai unico bordo di un controllo interattivo |
| Lino su Avorio | 1.12:1 | solo superficie |

### 2.4 Regole d'uso del rosso (risolve l'incoerenza segnalata dai giudici)

1. Una sola SUPERFICIE rossa per schermata: nell'hero è il quadrato; nelle altre sezioni è il bottone primario. Mai due superfici rosse nello stesso viewport (quando il quadrato dell'hero è visibile, il bottone primario dell'hero è comunque ammesso perché fa parte della stessa composizione: è l'unica eccezione).
2. Il rosso come TESTO è ammesso solo in: eyebrow e cartellini (12–13px, Inter Tight 600 maiuscolo, 5.69:1), link in hover, il carattere «✱» separatore dei marquee (Bodoni, ≥ 20px).
3. Il rosso NON è mai colore di testo nei titoli h1/h2/h3 né nel lead del manifesto. La parola in corsivo dei titoli è sempre Antracite (o Avorio sul Grafite). Il concept prevedeva «una parola in corsivo rosso» nel manifesto: la regola è stata unificata, la parola resta Antracite e l'accento rosso del manifesto è il «✱» che chiude il lead e il punto rosso del numerale. Il «✱» è un segno decorativo (`<span aria-hidden="true">✱</span>` dentro la stringa `_html`), non testo: non viene letto dagli screen reader.
4. I «segni» rossi (punto 8px, filetto 1px, asterisco, underline) possono convivere con la superficie rossa.

### 2.5 Custom properties CSS

```css
:root {
  /* colori di base */
  --c-avorio: #F3EFE7;
  --c-lino: #E8E2D6;
  --c-antracite: #1E1C1A;
  --c-fumo: #5E5852;
  --c-minio: #B02C16;
  --c-minio-scuro: #9C2612;
  --c-minio-velo: #8A2211;
  --c-corallo: #EC7A62;
  --c-grafite: #2B2825;
  --c-sabbia: #B5AEA3;
  --c-filetto: #CFC7B9;
  --c-filetto-scuro: #45403B;

  /* token semantici (tema chiaro = default) */
  --bg: var(--c-avorio);
  --bg-2: var(--c-lino);
  --fg: var(--c-antracite);
  --fg-2: var(--c-fumo);
  --accent: var(--c-minio);
  --accent-hover: var(--c-minio-scuro);
  --on-accent: var(--c-avorio);
  --line: var(--c-filetto);        /* decorativo */
  --line-ui: var(--c-antracite);   /* bordi di controlli interattivi */
  --focus: var(--c-minio);
}

/* sezione invertita e footer */
.is-dark {
  --bg: var(--c-grafite);
  --bg-2: var(--c-antracite);
  --fg: var(--c-avorio);
  --fg-2: var(--c-sabbia);
  --accent: var(--c-corallo);
  --accent-hover: var(--c-avorio);
  --on-accent: var(--c-antracite);
  --line: var(--c-filetto-scuro);
  --line-ui: var(--c-sabbia);
  --focus: var(--c-corallo);
  background: var(--bg);
  color: var(--fg);
}
```

Regola: i componenti usano SOLO i token semantici (`--bg`, `--fg`, `--accent`…), mai i colori di base direttamente, così la sezione scura e il footer ereditano tutto con una classe. `<meta name="theme-color" content="#F3EFE7">`. Il sito ha un solo tema (chiaro): non implementare `prefers-color-scheme`.

---

## 3. Tipografia

### 3.1 Famiglie

| Ruolo | Famiglia Google | Pesi caricati | Copertura verificata | Fallback stack |
|---|---|---|---|---|
| Display (h1, h2, lead, numerali, «✱», voci del menu mobile) | Bodoni Moda (variabile: ital, opsz 6..96, wght) | 400, 500, italic 400 | latin, latin-ext (NESSUN cirillico) | `'Bodoni Moda', 'Playfair Display', 'Didot', 'Bodoni 72', Georgia, 'Times New Roman', serif` |
| Display in russo | Playfair Display | 400, italic 400 | latin, latin-ext, cyrillic (anche in italic) | `'Playfair Display', Georgia, 'Times New Roman', serif` |
| Testo (body, nav, h3, eyebrow, bottoni, chip, tabelle, marquee) | Inter Tight | 400, 500, 600 | latin, latin-ext, cyrillic, cyrillic-ext | `'Inter Tight', 'Inter', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif` |

URL unico (verificato l'11/09/2026: HTTP 200, `font-display: swap`, blocchi `unicode-range` cyrillic presenti per Inter Tight e Playfair Display, assenti per Bodoni Moda):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Inter+Tight:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap">
```

Note:
- Non usare il parametro `text=` (taglierebbe i glifi delle altre lingue).
- Il vincolo di progetto è «Google Fonts con fallback»: in v1 si carica da Google. Opzione consigliata prima del lancio (privacy): scaricare i `.woff2` e servirli da `assets/fonts/` con `@font-face` (licenza OFL, nessun build step). In entrambi i casi la pagina Privacy nomina Google Fonts finché è caricato da remoto.
- `font-optical-sizing: auto` su tutto; per i numerali ghost forzare `font-variation-settings: 'opsz' 96`.
- Bodoni Moda mai sotto 20px: tutto ciò che è più piccolo è Inter Tight.
- `:lang(ru)`: tutto ciò che è in Bodoni passa a Playfair Display (vedi §3.4).

### 3.2 Scala fluida (390px → 1440px, base 16px)

Valori calcolati: 390 / 768 / 1024 / 1440 / 1920 px.

```css
:root {
  --fs-h1:      clamp(3rem, 1rem + 7vw, 7.5rem);          /* 48 / 69.8 / 87.7 / 116.8 / 120 */
  --fs-h2:      clamp(1.9rem, 1rem + 3.2vw, 4.25rem);     /* 30.4 / 40.6 / 48.8 / 62.1 / 68 */
  --fs-h3:      clamp(1.25rem, 1rem + 0.9vw, 1.75rem);    /* 20 / 22.9 / 25.2 / 28 / 28 */
  --fs-lead:    clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem);   /* 24 / 28.4 / 31.9 / 36 / 36 */
  --fs-body:    clamp(1rem, 0.92rem + 0.3vw, 1.125rem);   /* 16 / 17 / 17.8 / 18 / 18 */
  --fs-small:   clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem); /* 13 / 13.6 / 14 / 14 / 14 */
  --fs-eyebrow: clamp(0.75rem, 0.7rem + 0.1vw, 0.8125rem); /* 12 / 12 / 12.2 / 12.6 / 13 */
  --fs-num:     clamp(4.5rem, 2rem + 8vw, 10rem);         /* 72 / 93 / 114 / 147 / 160 */
  --fs-nav:     0.875rem;                                  /* 14 */
  --fs-menu:    clamp(2.25rem, 1.5rem + 3vw, 3.5rem);     /* voci del menu mobile, Bodoni */
}
```

### 3.3 Stili tipografici

| Stile | Famiglia / peso | Dimensione | Interlinea | Tracking | Trasformazioni / note |
|---|---|---|---|---|---|
| Eyebrow (con numero di sezione) | Inter Tight 600 | `--fs-eyebrow` | 1.2 | +0.14em | maiuscolo; colore `--accent`; formato «01 — Cos'è» |
| h1 | Bodoni Moda 400 | `--fs-h1` | 0.95 | −0.01em | `padding-top: .08em` (fix accenti tagliati); `text-wrap: balance`; una parola in italic 400 |
| h2 | Bodoni Moda 400 | `--fs-h2` | 1.05 | −0.005em | `text-wrap: balance`; una parola in italic al massimo |
| h3 | Inter Tight 500 | `--fs-h3` | 1.2 | 0 | sentence case |
| Lead (manifesto) | Bodoni Moda italic 400 | `--fs-lead` | 1.3 | 0 | max-width 30ch; `font-variation-settings: 'opsz' 36` |
| Body | Inter Tight 400 | `--fs-body` | 1.55 | 0 | max-width 62ch; paragrafi separati da 1em |
| Small / didascalie | Inter Tight 400 | `--fs-small` | 1.45 | 0 | colore `--fg-2` |
| Cartellino | Inter Tight 500 | 12px (0.75rem) | 1.2 | +0.10em | maiuscolo; «n.03 — Studio, Brera» |
| Chip (etichetta di sartoria) | Inter Tight 600 | 12px | 1 | +0.14em | maiuscolo; mai sotto 12px |
| Nav | Inter Tight 500 | `--fs-nav` | 1 | +0.04em | sentence case; numero di sezione in Fumo davanti alla voce su ≥1200 |
| Bottone | Inter Tight 600 | 15px (0.9375rem) | 1 | +0.01em | sentence case |
| Numerale ghost | Bodoni Moda 400, opsz 96 | `--fs-num` | 0.8 | −0.02em | colore Filetto; `aria-hidden="true"` |
| Marquee | Inter Tight 500 | 13px (0.8125rem) | 1 | +0.14em | maiuscolo; separatore «✱» in Bodoni 20px Rosso Minio |
| Tabelle | Inter Tight 400/500 | `--fs-body` | 1.4 | 0 | `font-variant-numeric: tabular-nums` |
| Menu mobile | Bodoni Moda 400 | `--fs-menu` | 1.05 | 0 | una voce per riga |

Corsivo: solo Bodoni italic, solo UNA parola per titolo (mai due), mai in Inter Tight (che non viene caricata in italic). Maiuscoletto: non si usa il vero small-caps; «maiuscoletto» nel brief significa maiuscolo con tracking (eyebrow, chip, cartellini). Virgolette: « » solo nel manifesto; apostrofi tipografici (’) ovunque. Accenti obbligatori: è, perché, più, città, musicalità, sì, sé stessa.

### 3.4 Russo e inglese

```css
:lang(ru) h1, :lang(ru) h2, :lang(ru) .lead, :lang(ru) .menu__link, :lang(ru) .numeral, :lang(ru) .marquee__star {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
}
:lang(ru) h1 { line-height: 1.02; letter-spacing: 0; font-size: clamp(3rem, 0.9rem + 6.3vw, 6.75rem); } /* 48 / ~63 / ~79 / 105 / 108 */
:lang(ru) h2 { line-height: 1.1; letter-spacing: 0; }
:lang(ru) .lead { line-height: 1.35; }
:lang(ru) { hyphens: auto; overflow-wrap: anywhere; }
:lang(en) h2, :lang(en) h3 { text-wrap: balance; }
```

Motivazioni misurate: Playfair ha x-height maggiore e ascendenti più lunghi di Bodoni; a 1440 l'h1 russo «На каблуках, / с характером.» a 117px arriva a toccare la linea-tacco dell'hero, a 105px resta libero; a 390 a 48px sta su due righe. Le stringhe EN/RU sono più lunghe del 10–25%: nessun contenitore ha altezza fissa, i bottoni hanno larghezza fluida (`padding-inline` e non `width`), h2/h3 con `text-wrap: balance`, e si accetta che un h1 russo vada su tre righe sotto i 360px.

---

## 4. Sistema di layout

### 4.1 Contenitore e griglia

```css
:root {
  --gutter: clamp(1.25rem, 0.5rem + 5vw, 6rem);   /* 27.5 / 46 / 59 / 80 / 96 px */
  --col-gap: clamp(0.75rem, 1.5vw, 1.5rem);       /* 12 → 24 px */
  --container: 1440px;
  --header-h: 64px;                                /* 56px sotto i 768 */
}
.container { max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--col-gap); }
```

- ≥1024: griglia a 12 colonne; le sezioni usano span esplicite (es. `grid-column: 1 / 6`).
- 768–1023: 12 colonne, ma i blocchi a due colonne diventano 6+6 o si impilano; la galleria diventa a 2 colonne.
- <768: una colonna (`grid-column: 1 / -1` su tutto), offset a zero, galleria in scroll orizzontale.
- Sotto i 390 non si progetta: si verifica che nulla trabocchi (nessun `min-width` superiore a 100%).

### 4.2 Spaziatura (scala su base 8px)

```css
:root {
  --s-1: 0.25rem; --s-2: 0.5rem; --s-3: 0.75rem; --s-4: 1rem; --s-5: 1.5rem;
  --s-6: 2rem; --s-7: 3rem; --s-8: 4rem; --s-9: 6rem;
  --space-section: clamp(4rem, 2.5rem + 6vw, 9rem);  /* 64 / 86 / 101 / 126 / 144 px: padding-block delle sezioni */
  --space-block: clamp(2rem, 1.5rem + 2vw, 3.5rem);   /* tra eyebrow+titolo e contenuto */
}
```

Ritmo verticale: eyebrow → 16px → titolo → `--space-block` → contenuto. Le sezioni sono separate da un filetto 1px (`--line`) a tutta larghezza, non da spazio doppio.

### 4.3 Raggi, filetti, ombre

- Raggi: 0 su tutto (bottoni, card, cornici, chip, tabella). Unica eccezione: il punto rosso e la ghiera del «nodo» (cerchi).
- Filetti: 1px `--line` decorativi; 1px `--line-ui` per bordi di controlli; 2px `--accent` per la nota a margine della bio e l'underline attivo della nav.
- Ombre: nessuna. La profondità è data dalle superfici (Avorio/Lino/Grafite) e dai filetti. L'unica «ombra» ammessa è `box-shadow` usata come anello di focus o come ghiera del nodo.
- Sfondo delle cornici: `linear-gradient(180deg, #EDE7DB 0%, #E8E2D6 100%)` (Antracite su #EDE7DB = 13.80:1, Fumo 5.70:1, Minio 5.30:1).

### 4.4 Regole responsive per breakpoint

| | 390 (mobile) | 768 (tablet) | 1024 (desktop) | 1440+ (large) |
|---|---|---|---|---|
| Header | 56px, monogramma + switch lingua + bottone Menu | 56px, + CTA visibile | 64px, nav completa 6 voci + switch + CTA | idem, numeri di sezione davanti alle voci (≥1200) |
| Hero | in flusso: eyebrow, h1, sub, CTA, poi «quadro» alto clamp(240px, 42svh, 360px) | come mobile ma quadro 30vw | griglia: h1 col 1–10, quadro col 9–12 ancorato in basso a destra | identico, `--gutter` 80–96px |
| Manifesto | 1 colonna | 1 colonna, lead più largo | 5/7 | 5/7 |
| Lezioni | card impilate | 2+1 | 3 card | 3 card |
| Timeline | verticale | verticale | orizzontale 4 tappe | orizzontale |
| Kristina | ritratto sopra, testo sotto | 5/7 | 5/7 | 5/7 |
| Galleria | scroll orizzontale con scroll-snap, cornici larghe 78vw | griglia 2 colonne | parete a 3 colonne con offset | idem |
| Orari / Prezzi | tabella a righe impilate (`display: block`) | tabella | tabella su Lino, col 1–8; nota col 9–12 | idem |
| Dove | testo sopra, mappa sotto | 6/6 | 5/7 | 5/7 |
| FAQ | 1 colonna | 1 colonna max 70ch | col 2–11 | col 3–10 |
| Prenota | bottoni impilati a tutta larghezza | affiancati | affiancati | affiancati |
| Footer | 1 colonna | 2 colonne | 4 colonne | 4 colonne |
| Cucitura | 1px a `left: 10px` | idem | 1px centrata nel gutter (`left: calc(var(--gutter)/2)`) | idem |

`overflow-x: clip` su `body` e sulle sezioni con numerali ghost: il body non scorre mai orizzontalmente.

---

## 5. Sezioni della one-page (in ordine)

Numerazione: le sezioni con eyebrow numerato hanno `data-numbered`; la numerazione «01 — …» è generata da JS in base alle sezioni visibili (così, se Testimonianze è nascosta, la sequenza resta senza buchi). Fallback senza JS: i numeri statici scritti nell'HTML corrispondono alla sequenza con Testimonianze nascosta (stato di lancio), e la sezione Testimonianze porta il numero «—». Nei paragrafi che seguono i numeri sono quelli dello stato di lancio (Testimonianze nascosta): «09 — Domande», «10 — Prenota». Quando `features.testimonials` è attivo, JS rinumera in «09 — Dicono», «10 — Domande», «11 — Prenota» (sezioni, numerali ghost, nav e menu).

### 5.0 Header / nav

- Scopo: orientare, cambiare lingua, prenotare da qualsiasi punto.
- Contenuto: monogramma K-stiletto (link a `#top`, `aria-label="Kristina — torna all'inizio"`); nav con 6 ancore: Lezioni `#lezioni` · Kristina `#kristina` · Orari `#orari` · Prezzi `#prezzi` · Dove `#dove` · Domande `#domande`; switch lingua IT | EN | RU; CTA secondaria «Prenota» (outline) che punta a `#prenota`.
- Visivo: barra `position: sticky; top: 0; z-index: 50` (sopra la cucitura, che sta a z-index 40), in flusso (occupa i primi 64px della pagina), altezza `--header-h`, sfondo `rgba(243,239,231,.92)` con `backdrop-filter: blur(8px)` (unico blur del sito), filetto 1px Antracite sotto (è la «guida della parete»: lo stesso filetto prosegue nell'hero). Da sinistra: monogramma 28px; al centro le voci in Inter Tight 500 14px con 28px di distanza; a destra lo switch (§8.6) e il bottone «Prenota» (§8.1, secondario, altezza 40px nell'header). Voce attiva (scroll-spy): underline 2px Rosso Minio a `text-underline-offset: .5em`; hover: underline 1px Antracite.
- Mobile (<1024): monogramma + switch + bottone «Menu» (44×44, icona a due linee da 18px, `aria-expanded`, `aria-controls="menu"`); apre l'overlay (§8.7).
- Animazioni: nessuna al caricamento. Dopo 80px di scroll aggiunge `.is-scrolled` (filetto sotto da Antracite a Filetto e altezza invariata: nessun salto di layout). Underline attivo che «scorre» tra le voci: transizione di `left/width` su un pseudo-elemento, 240ms.

### 5.1 Hero — «il quadro appeso» (100svh meno l'header)

- Scopo: dire in tre secondi cosa, dove, con chi; far prenotare.
- Contenuto IT: eyebrow «Heels dance · Brera, Milano»; h1 «Sui tacchi, / *con carattere.*»; sub «Lezioni di heels dance a Milano per imparare tecnica, presenza e musicalità. Con Kristina, in italiano, inglese e russo.»; CTA primaria «Scrivimi su WhatsApp» (link wa.me precompilato) + CTA secondaria «Instagram» (↗); il quadrato rosso con cartellino «n.01 — Heels, Brera»; la linea-tacco; colophon «Brera · Milano | Dal [TODO: mese 2026] | Scorri ↓».
- Wireframe desktop (≥1024), contenitore `min-height: calc(100svh - var(--header-h))` (l'header sticky è in flusso), `padding-top: 24px`, griglia 12 colonne, `align-content: end`: hero e colophon stanno nella prima schermata.
  - LIVELLO 0: due filetti Antracite 1px a tutta larghezza: uno a 24px dal bordo superiore dell'hero (cioè a 88px dal bordo del viewport, 24px sotto il filetto dell'header), uno a 96px dal basso.
  - LIVELLO 1 «l'opera»: rettangolo Rosso Minio, `aspect-ratio: 4/5`, `width: clamp(120px, 22vw, 320px)`, `position: absolute; right: var(--gutter); bottom: 96px` (poggia sul filetto basso). Cartellino in basso a sinistra dentro il quadrato: Inter Tight 500 11px maiuscolo +0.10em Avorio «n.01 — Heels, Brera». È lo SLOT-01 (§6): quando arriverà la foto entrerà qui.
  - LIVELLO 2 «la linea-tacco»: SVG inline (§6.3 «Décolleté») `height: 70vh; width: auto`, `position: absolute; bottom: 96px; right: calc(var(--gutter) + clamp(120px, 22vw, 320px) - 40px)`: la gamba scende a sinistra del quadrato e la punta della scarpa entra di ~40px nel rosso; il punto rosso a terra (r=4) tocca esattamente il filetto basso. Stroke 1.5px Antracite, `vector-effect: non-scaling-stroke`. z-index 3 (sopra il quadrato).
  - LIVELLO 3 tipografia: eyebrow col 1–12; h1 col 1–10 Bodoni `--fs-h1` Antracite, due righe, seconda riga in italic («con carattere.» tutto in corsivo: è l'unica riga-corsivo del sito; la parola-contrappunto è «carattere»); sub Inter Tight 400 `clamp(1.0625rem, 1rem + .35vw, 1.25rem)` Fumo, col 1–6, max 46ch; CTA affiancate con 12px di gap, `margin-bottom: 56px` (sopra il filetto basso). z-index 2: il testo passa sopra il quadrato se l'h1 è più largo delle 8 colonne (a 1440 l'h1 IT non tocca il quadrato; l'h1 RU è ridotto al 90% proprio per non toccare la linea-tacco).
  - LIVELLO 4 colophon: 24px sotto il filetto basso, tre voci Inter Tight 500 12px maiuscolo +0.14em Fumo con `justify-content: space-between`; la freccia «↓» è un SVG 12px.
- Mobile (<768): `align-content: start`, `min-height: auto`, `padding-top: 40px` (il filetto alto resta a 24px dal bordo dell'hero); ordine in flusso: eyebrow, h1 (48px, 2 righe), sub, CTA impilate a tutta larghezza (WhatsApp sopra), poi il blocco `.hero__quadro` in flusso, alto `clamp(240px, 42svh, 360px)`, `position: relative`, con il quadrato (`width: 36vw`) in basso a destra e la linea-tacco (`height: 100%`) alla sua sinistra; il filetto basso è il `border-bottom` di questo blocco. Colophon a due voci soltanto: «Brera · Milano» e «Scorri ↓» (la voce «Dal …» si nasconde sotto i 768 perché è già nel sub-blocco Orari). Nessuna sovrapposizione fra testo e quadro su mobile.
- Animazioni (solo `prefers-reduced-motion: no-preference`): t=0 i due filetti si disegnano da sinistra (`scaleX 0→1`, origin left, 900ms, `--ease`); t=200ms h1 riga per riga con `clip-path: inset(0 0 100% 0) → inset(0)` 700ms, sfasate di 120ms; t=500ms il quadrato sale di 24px e passa da opacity 0 a 1 (800ms); t=700ms la linea-tacco si disegna (`stroke-dasharray/dashoffset` con lunghezza da `getTotalLength()`, 1400ms ease-out) e alla fine il punto rosso appare (`scale 0→1`, 200ms); t=1200ms sub, CTA e colophon in fade. Dopo il caricamento: respiro del punto rosso (`scale 1→1.15`, 3s, alternate, infinito: si ferma con il controllo globale «Pausa» §7.3) e parallasse lentissima del quadrato allo scroll (`translateY` max ±12px, solo ≥1024). Le CTA sono nel DOM, visibili e cliccabili dal primo frame anche durante le animazioni (nessuna `visibility: hidden`: solo opacity con `pointer-events` attivi).
- Reduced motion: composizione statica completa (filetti pieni, h1 visibile, quadrato al 100%, linea disegnata con il punto), nessuna transizione, parallasse e respiro disattivati.

### 5.2 Marquee-filetto (strip)

- Scopo: cerniera tra hero e contenuti; dire le parole del brand.
- Contenuto (si traduce con la lingua): «HEELS DANCE ✱ BRERA ✱ MILANO ✱ TECNICA ✱ PRESENZA ✱ MUSICALITÀ ✱ ». EN: «HEELS DANCE ✱ BRERA ✱ MILAN ✱ TECHNIQUE ✱ PRESENCE ✱ MUSICALITY ✱». RU: «ХАЙ ХИЛС ✱ БРЕРА ✱ МИЛАН ✱ ТЕХНИКА ✱ ПРИСУТСТВИЕ ✱ МУЗЫКАЛЬНОСТЬ ✱».
- Visivo: riga alta 48px su Lino tra due filetti 1px Antracite, testo Inter Tight 500 13px maiuscolo +0.14em Antracite, «✱» Bodoni 20px Rosso Minio con 20px di margine ai lati. Bottone «Pausa» (§8.5) a destra, 44×44, sovrapposto con sfondo Lino.
- Mobile: identica (il marquee è per natura a tutta larghezza).
- Animazioni: `translateX(0 → -50%)` 40s lineare infinito su due copie del track (la seconda `aria-hidden="true"`); pausa in hover (pointer: fine), in `focus-within` e con il controllo Pausa. Reduced motion: statico, una sola copia, `overflow: hidden`, bottone Pausa nascosto.

### 5.3 Manifesto — «01 — Cos'è l'heels dance» (`#manifesto`)

- Scopo: definire la disciplina in modo concreto e non cliché.
- Contenuto IT: eyebrow «01 — Cos'è»; h2 «I tacchi non si portano: si *abitano*.»; lead (Bodoni italic, chiave `manifesto.lead_html`, con il «✱» finale in `<span aria-hidden="true">`): «L'heels dance è una disciplina di postura, camminata e presenza. Si parte dal piede, si arriva allo sguardo. ✱»; tre definizioni in Inter Tight separate da filetti: «Tecnica — Peso sull'avampiede, caviglie stabili, linee pulite: prima si impara a stare, poi a camminare.» / «Presenza — Occupare lo spazio con intenzione. La sensualità è una conseguenza, non un compito.» / «Musicalità — Accenti, pause, cambi di peso: la coreografia arriva quando il corpo tiene il tempo.»; una riga finale in small Fumo: «Nasce tra jazz, hip hop, vogue e waacking, e deve molto alle comunità nere e LGBTQ+ che l'hanno resa quello che è. Aperta a tutti i corpi e a tutti i generi, a chi non ha mai ballato.»
- Wireframe desktop: numerale ghost «01» (`--fs-num`, Filetto, `aria-hidden`) assoluto in alto a sinistra, sbordante di 0.15em fuori dal margine; eyebrow e h2 col 1–5; lead + definizioni col 6–12. Le tre definizioni sono un `<dl>`: `dt` Inter Tight 500 `--fs-h3`, `dd` body Fumo, filetto 1px sopra ogni coppia.
- Mobile: una colonna: numerale ghost dietro l'eyebrow, ridotto a 72px.
- Animazioni: reveal standard (§7.2); il numerale conta da 00 a 01 con tick di 60ms; il filetto sotto l'h2 cresce con `scaleX` (§7.2 «linea sotto h2»).

### 5.4 Le lezioni — «02 — Lezioni» (`#lezioni`, sezione invertita `.is-dark` su Grafite)

- Scopo: presentare i formati; far capire che si può iniziare da zero.
- Contenuto IT: eyebrow «02 — Lezioni» (Corallo); h2 «Le *lezioni*.»; intro body Sabbia «Una classe settimanale a livello open, dove chi inizia e chi balla già lavorano sulla stessa combinazione, ognuno al proprio ritmo.» Tre card (Antracite su Grafite):
  1. «01 · Open level» — h3 «Heels open level» — testo «La classe settimanale: riscaldamento, tecnica di camminata, una combinazione coreografica. Aperta a tutti i livelli.» — chip: «60 min [TODO]», «Livello open», «IT · EN · RU» — link ghost «Prenota una prova →» (`#prenota`).
  2. «02 · Fondamenti» — h3 «Heels fondamenti» — testo «Per chi parte da zero: postura, bevel, camminata lenta e veloce, isolazioni. Senza coreografia complessa.» — chip: «[TODO: durata]», «Principianti» — nota small «[TODO: confermare con Kristina se il formato è attivo]».
  3. «03 · Privata» — h3 «Lezione privata» — testo «Un'ora sola con Kristina, su tecnica o su una coreografia che vuoi preparare. Anche in due.» — chip: «60 min», «Su appuntamento» — link «Chiedi disponibilità →».
- Wireframe desktop: filetto Corallo 1px in alto e in basso alla sezione che «entra» da sinistra allo scroll; eyebrow + h2 + intro col 1–7; griglia di 3 card col 1–12 con `gap: var(--col-gap)`; ogni card `padding: 28px`, bordo 1px Filetto scuro (hover: Sabbia), numerale «01» Bodoni 500 2rem Avorio in alto a sinistra, un piccolo SVG geometrico diverso in alto a destra (cerchio 24px outline / angolo / tre linee: gli stessi lessici delle opere §6.4, in Sabbia), h3 Avorio, testo Sabbia, chip (§8.4 variante scura), link ghost in Corallo in basso.
- Mobile: card impilate a tutta larghezza; su 768 la terza card occupa tutta la riga.
- Animazioni: card in reveal scaglionato di 90ms; hover (pointer: fine): bordo Sabbia, numerale da Avorio a Corallo (200ms), nessuno spostamento.

### 5.5 La lezione e la prima volta — «03 — Come funziona» (`#lezione`)

- Scopo: togliere la paura; dire cosa succede in sala e cosa portare (i due contenuti più cercati).
- Contenuto IT: eyebrow «03 — Come funziona»; h2 «Non serve saper ballare. Serve *volerlo*.»; timeline in 4 tappe:
  1. «Riscaldamento» — «Dieci minuti senza tacchi, a piedi nudi o in calze: mobilità di caviglie, anche e schiena.»
  2. «Tecnica» — «Postura, bevel, camminata lenta e veloce, isolazioni. Il peso sull'avampiede, lo sguardo avanti.»
  3. «Coreografia» — «Una frase di 30–60 secondi, prima a conteggi e poi in musica. Si ripete finché diventa tua.»
  4. «Chiusura» — «Floorwork leggero, stretching, due parole su come è andata.»
  Poi il blocco «La prima lezione: cosa portare» (h3) con lista a chip + riga di spiegazione:
  - chip «Tacco 5–7 cm» (icona `heel-block` 12px) — «Tacco largo o block, con cinturino alla caviglia o allacciato. Non servono tacchi da passerella: uno stivaletto autunnale va benissimo.»
  - chip «Prima volta» — «Puoi venire in sneaker o in calze: le scarpe si mettono dopo il riscaldamento e c'è tempo per scegliere quelle giuste.»
  - chip «Abbigliamento» — «Comodo e aderente, per vedere le linee. Evita pantaloni larghi: i tacchi ci si impigliano.»
  - chip «Ginocchiere» — «Consigliate per il lavoro a terra [TODO: confermare con Kristina]; in alternativa leggings lunghi.»
  - chip «In borsa» — «Acqua e un asciugamano. Niente creme sul corpo prima della lezione.»
- Wireframe desktop: eyebrow + h2 col 1–8; timeline col 1–12: quattro tappe su una riga collegate da una «linea che cammina» orizzontale 1px Antracite con un cerchio Antracite 10px sotto ogni titolo (`h3` Inter Tight 500, testo body Fumo); l'ultima tappa termina con il punto rosso 8px. Sotto, «Cosa portare» col 1–5 (h3 + nota small «Un consiglio, non una regola: se hai dubbi scrivi a Kristina prima di comprare scarpe.») e la lista col 6–12 come `<dl>` con chip in `dt` e testo in `dd`, filetti fra le voci.
- Mobile: timeline verticale (linea a sinistra, cerchi sulla linea, testi a destra con 20px di rientro); «Cosa portare» in colonna unica.
- Animazioni: la linea della timeline cresce con `scaleX` (desktop) o `scaleY` (mobile) 1400ms all'ingresso; i cerchi appaiono in sequenza (120ms) al passaggio della linea; il punto rosso finale appare per ultimo.

### 5.6 Kristina — «04 — Chi insegna» (`#kristina`)

- Scopo: presentare la persona senza inventare nulla.
- Contenuto IT: eyebrow «04 — Chi insegna»; ritratto SLOT-02 (cornice 4:5 con opera «Silhouette»); h2 «Kristina» (da CONFIG: `brand.firstName`); sottotitolo Inter Tight 500 «Insegnante di heels dance · Milano»; riga small Fumo «Кристина · da [TODO: città] a Milano»; chip lingue «Italiano» «English» «Русский»; bio body (80–120 parole) con i fatti in segnaposto: «[TODO: formazione e percorso, da confermare con Kristina]. Insegna heels dance a Milano, in zona Brera, in italiano, inglese e russo. [TODO: da quando balla / da quando insegna]. La sua lezione parte dal piede e arriva allo sguardo: tecnica prima, poi presenza.»; una citazione Bodoni italic `--fs-lead` con filetto rosso 2px a sinistra (la «nota a margine»): «[TODO: una frase di Kristina, nelle sue parole]».
- Wireframe desktop: ritratto col 1–5 (`aspect-ratio: 4/5`, cornice §6), cartellino «02 / Kristina» sotto la cornice; testo col 7–12, allineato in alto; la citazione chiude la colonna di testo.
- Mobile: ritratto (larghezza 100%, max 420px) sopra, testo sotto.
- Animazioni: reveal standard; l'opera SVG nel ritratto si disegna (`stroke-dashoffset`) all'ingresso.

### 5.7 Galleria — «05 — La parete» (`#galleria`)

- Scopo: dare ritmo visivo ora, accogliere foto e video dopo; linkare Instagram.
- Contenuto: eyebrow «05 — La parete»; h2 «Studio, *Brera*.»; riga small «Foto e video in arrivo — intanto, le opere. [TODO: rimuovere al primo scatto]»; cinque cornici (SLOT-03…07) con cartellino: «n.01 — Video, studio [TODO]», «n.02 — Dettaglio, tacco», «n.03 — La classe», «n.04 — Mani, posa», «n.05 — Brera, cortile»; link ghost «Segui su Instagram ↗».
- Wireframe desktop: parete a 3 colonne su griglia 12: n.01 (9:16) col 1–4 con `margin-top: 0`; n.02 (4:5) col 5–8 `margin-top: 6rem`; n.03 (4:5) col 9–12 `margin-top: 2rem`; seconda riga: n.04 (1:1) col 3–6 `margin-top: -3rem`; n.05 (3:2) col 7–12. Ogni cornice: bordo 1px Filetto, sfondo gradiente Lino, opera SVG con `preserveAspectRatio="xMidYMid slice"`, `figcaption` cartellino 12px sotto (fuori dalla cornice) con numero a sinistra e testo a destra.
- Mobile: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 16px; padding-inline: var(--gutter)`; ogni `figure` `flex: 0 0 78vw; scroll-snap-align: start`; le proporzioni restano quelle dichiarate; indicatore «scorri →» in small a destra dell'h2. Su 768: griglia a 2 colonne senza offset.
- Animazioni: reveal scaglionato 90ms; hover (pointer: fine): opera `scale(1.03)` 900ms, cartellino sottolineato in Rosso Minio; con foto: `img scale(1.03)`, opera ferma.

### 5.8 Orari — «06 — Quando» (`#orari`)

- Scopo: dire giorno e ora; dichiarare che sono esempi finché non confermati.
- Contenuto IT: eyebrow «06 — Quando»; h2 «Gli *orari*.»; badge «Esempio» (§8.3) accanto all'h2 finché `CONFIG.schedule.isExample === true`; tabella Giorno / Ora / Formato / Livello / Lingua con righe da CONFIG (esempio: «Martedì — 19:30–20:45 — Open level — Tutti i livelli — IT · EN · RU» e «Giovedì — 19:00–20:00 — Fondamenti — Principianti — IT · EN · RU»); nota small: «Posti limitati, prenotazione obbligatoria. Orari indicativi: la conferma arriva su WhatsApp.» Sotto: «Nuove classi da [TODO: mese 2026]».
- Wireframe desktop: tabella su Lino col 1–8 (`padding: 24px`; righe con filetto 1px; giorno Inter Tight 500; ora `tabular-nums`; livello e lingua come chip); nota e badge col 9–12.
- Mobile: la tabella diventa una lista di card: ogni riga è un blocco Lino con giorno in h3, ora in body 500 e chip sotto (`display: block` sui `tr/td`, intestazioni in `data-label` mostrate come small).
- Animazioni: reveal; hover riga (pointer: fine): sfondo Avorio e filetto rosso a sinistra 2px.

### 5.9 Prezzi — «07 — Quanto» (`#prezzi`)

- Scopo: mostrare i prezzi (differenziante rispetto ai concorrenti milanesi) o, se non confermati, esempi dichiarati.
- Contenuto IT: eyebrow «07 — Quanto»; h2 «I *prezzi*.» + badge «Esempio»; tabella tipografica su Lino: «Lezione di prova — [TODO: € / gratuita]», «Lezione singola — 20 €», «Pacchetto 5 lezioni — 90 € · validità 2 mesi», «Pacchetto 10 lezioni — 170 € · validità 4 mesi», «Lezione privata — 60 € / ora»; note small: «Prezzi indicativi da confermare [TODO]. Nessuna quota associativa [TODO: confermare inquadramento]. Pagamento [TODO: contanti / bonifico / Satispay].» Nessuna card, nessuna icona: è il listino di una galleria.
- Wireframe desktop: tabella col 1–8 (nome in body 500, prezzo in Bodoni 500 `--fs-h3` allineato a destra con `tabular-nums`, dettaglio in small Fumo sotto il nome); col 9–12 la nota e la CTA ghost «Prenota la prova →».
- Mobile: righe a due colonne (nome/prezzo) con dettaglio sotto.
- Animazioni: reveal; hover riga come Orari.

### 5.10 Dove — «08 — Dove» (`#dove`)

- Scopo: localizzare a Brera senza inventare l'indirizzo.
- Contenuto IT: eyebrow «08 — Dove»; h2 «Brera, *Milano*.»; riga Inter Tight 500 «[TODO: nome dello spazio]»; body «L'indirizzo esatto dello spazio ti arriva su WhatsApp alla conferma della lezione. Siamo tra le vie di ciottoli e i cortili di Brera, a due passi dalla Pinacoteca.» ; `<dl>`: «Metro — Lanza M2 · Montenapoleone M3 · Cairoli M1 (percorsi tram soggetti a cantieri: verifica su atm.it)», «Bici — stazione BikeMi 57 “Brera”», «Auto — zona Area C: sconsigliata»; link secondario «Apri in Google Maps ↗» → `https://www.google.com/maps/search/?api=1&query=` + `encodeURIComponent(CONFIG.venue.mapsQuery)` (fallback `Brera, Milano`).
- Wireframe desktop: testo col 1–5; mini-mappa SVG (§6.4 «Mini-mappa») col 7–12 dentro una cornice Lino 4:3 con cartellino «n.06 — Brera, pianta astratta»; il punto rosso pulsa (respiro 3s) e ha un anello outline.
- Mobile: testo sopra, mappa sotto (100%, `aspect-ratio: 4/3`).
- Animazioni: le strade della mappa si disegnano (`stroke-dashoffset`, 1200ms) all'ingresso; poi il punto respira (si ferma con Pausa e con reduced motion).
- Vietato: scrivere «l'unico corso a Brera», promettere parcheggio o minuti a piedi.

### 5.11 Testimonianze — «— Dicono» (`#dicono`, nascosta al lancio; diventa «09 — Dicono» quando attiva)

- Scopo: predisporre lo spazio per recensioni vere; mai mostrare recensioni inventate.
- Stato: `<section id="dicono" hidden data-feature="testimonials">`; JS toglie `hidden` solo se `CONFIG.features.testimonials === true` E `CONFIG.testimonials.length > 0`.
- Contenuto: eyebrow «— Dicono» nell'HTML statico (JS la rinumera «09 — Dicono» quando la sezione è attiva); h2 «Dopo la *prima* lezione.»; 3 citazioni da CONFIG (`{ quote, name, level, lang }`) in Bodoni italic `--fs-lead` con nome in cartellino e chip del livello; niente stelle, niente loghi.
- Wireframe: tre colonne (4/4/4) con filetto a sinistra di ogni citazione; mobile impilate.
- Animazioni: reveal standard.

### 5.12 Domande frequenti — «09 — Domande» (`#domande`)

- Scopo: rispondere ai dubbi della prima lezione.
- Contenuto IT (accordion `<details>`; le risposte con [TODO] restano segnaposto):
  1. «Serve esperienza?» — «No. Si parte da postura e camminata: la prima combinazione è pensata per chi non ha mai ballato. Chi balla già lavora sulla stessa frase con più dettaglio.»
  2. «Che tacchi porto?» — «Un tacco largo o block da 5–7 cm, con cinturino alla caviglia o allacciato. Gli stiletti sottili arrivano dopo, quando le caviglie sono pronte.»
  3. «Posso venire senza tacchi la prima volta?» — «Sì: sneaker pulite o calze. Il riscaldamento è comunque senza scarpe.»
  4. «Cosa indosso?» — «Qualcosa di comodo e aderente, per vedere le linee. Niente pantaloni larghi, niente gioielli ingombranti.»
  5. «È solo per donne?» — «No. L'heels dance è per tutti i corpi e tutti i generi. In sala conta la camminata, non il resto.»
  6. «In che lingua è la lezione?» — «Italiano, inglese o russo: Kristina cambia lingua a seconda di chi c'è in sala.»
  7. «Come prenoto e come disdico?» — «Scrivi su WhatsApp con nome e livello; ti confermo posto, orario e indirizzo. Disdette: [TODO: regola di Kristina, es. entro 24 ore].»
  8. «Ho un dolore alla caviglia o al ginocchio, posso venire?» — «Parlane prima con il medico e avvisa Kristina: si può lavorare con tacco più basso o in calze. [TODO: confermare]»
- Wireframe desktop: col 3–10; ogni `details` con filetto 1px sopra; `summary` Inter Tight 500 `--fs-h3` con indicatore «+» (SVG 16px, due linee) a destra che ruota di 45° in «×» (Rosso Minio) da aperto; risposta body Fumo con `padding-block: 8px 24px`.
- Mobile: colonna unica, `summary` a 44px minimi di altezza.
- Animazioni: apertura con altezza animata via Web Animations API (misura `scrollHeight`, 300ms), rotazione dell'icona 300ms; con reduced motion apertura istantanea.

### 5.13 Nastro trilingue + Prenota — «10 — Prenota» (`#prenota`)

- Scopo: convertire. Una sola azione primaria ripetuta al massimo tre volte nel sito (hero, header, qui).
- Nastro (sopra la sezione): marquee su Lino con contenuto FISSO in tre lingue nello stesso track, che non cambia con lo switch: «PRENOTA LA TUA PROVA ✱ BOOK YOUR TRIAL ✱ ЗАПИШИСЬ НА ПРОБНЫЙ УРОК ✱ » (60s per ciclo, con bottone Pausa; `aria-hidden` sul testo perché la stessa informazione è nell'h2).
- Contenuto IT: eyebrow «10 — Prenota»; h2 (dimensione h1 ridotta: `--fs-h2` × 1.3) «Vieni a *provare*.»; body «Scrivi a Kristina con nome e livello: ricevi conferma di posto, orario e indirizzo esatto dello spazio a Brera.»; CTA primaria «Scrivimi su WhatsApp» (wa.me precompilato, testo verbatim §12.3); CTA secondaria «Scrivimi su Instagram ↗» (`https://www.instagram.com/{handle}/`); link ghost «oppure per email: {email}» (`mailto:`); riga small: «Rispondo di solito entro [TODO: tempo] · Lezioni in italiano, inglese e russo».
- Wireframe desktop: tutto su Avorio, col 1–8 allineato a sinistra; a destra (col 9–12) il monogramma K-stiletto in outline a 200px, Filetto, `aria-hidden`.
- Mobile: bottoni impilati a tutta larghezza (WhatsApp sopra), monogramma nascosto.
- Animazioni: reveal standard; il punto rosso del monogramma respira (stesso keyframe dell'hero).

### 5.14 Footer (`.is-dark` su Grafite)

- Scopo: chiudere con i dati legali e ripetere gli accessi.
- Contenuto: monogramma K-stiletto grande (Avorio, punto Corallo); colonna 1: «Kristina · Heels dance · Brera, Milano» + «© {anno da JS} {CONFIG.legal.fiscalName}» + «P.IVA {CONFIG.legal.vat}» (o «[TODO: dati fiscali]»); colonna 2: link di sezione (le stesse 6 ancore); colonna 3: contatti (WhatsApp, Instagram, email) come link ghost in Corallo; colonna 4: switch lingua ripetuto + link «Privacy» (`privacy.html`) + riga small «Nessun cookie, nessun tracciamento.» Nessun «sito realizzato da».
- Wireframe desktop: filetto Corallo 1px in alto (l'ultima «linea che cammina»); 4 colonne (3/3/3/3) con `padding-block: var(--space-section) var(--s-7)`; il monogramma occupa 120px in alto a sinistra sopra le colonne; in basso a destra, il punto finale della cucitura «annoda» (§9.1).
- Mobile: una colonna; monogramma 64px.
- Animazioni: solo il filetto in alto che entra da sinistra.

### 5.15 Elementi fissi

- Cucitura (§9.1): `position: fixed`, sempre presente da ≥ 390.
- Back-to-top (§8.8): appare dopo 2 viewport di scroll.
- Skip link: «Salta al contenuto» come primo elemento del `<body>`, visibile solo al focus (in alto a sinistra, sfondo Antracite, testo Avorio, 44px).

---

## 6. Sistema dei segnaposto foto/video

### 6.1 Principio

Ogni media è una «cornice» (`<figure class="frame" data-ratio="4/5">`) con `aspect-ratio` dichiarato, bordo 1px Filetto, sfondo gradiente Lino, un'«opera» SVG inline dentro e un cartellino come `figcaption`. Le foto vere entreranno nella stessa cornice senza cambiare ratio, bordo o cartellino (CLS 0). Sopra ogni cornice, nell'HTML, un commento indica cosa serve:

```html
<!-- SLOT-02 · FOTO 4:5 · min 1200×1500 px · verticale · ritratto di Kristina, mezza figura, luce naturale, molto spazio sopra la testa -->
<figure class="frame" data-slot="02" data-ratio="4/5">
  <svg class="frame__art" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">…opera «Silhouette»…</svg>
  <!-- quando arriva la foto: <img class="frame__media" src="assets/img/kristina-ritratto.jpg" alt="Kristina in piedi sui tacchi in studio, a Brera" width="1200" height="1500" loading="lazy" decoding="async"> -->
  <figcaption class="cartellino"><span class="cartellino__n">n.02</span> <span data-i18n="gallery.cap02">Kristina — Studio, Brera</span></figcaption>
</figure>
```

CSS essenziale:

```css
.frame { position: relative; margin: 0; border: 1px solid var(--line); background: linear-gradient(180deg, #EDE7DB, #E8E2D6); overflow: hidden; contain: paint; }
.frame[data-ratio="4/5"] { aspect-ratio: 4 / 5; }
.frame[data-ratio="9/16"] { aspect-ratio: 9 / 16; }
.frame[data-ratio="1/1"] { aspect-ratio: 1 / 1; }
.frame[data-ratio="3/2"] { aspect-ratio: 3 / 2; }
.frame[data-ratio="4/3"] { aspect-ratio: 4 / 3; }
.frame__art, .frame__media { position: absolute; inset: 0; width: 100%; height: 100%; }
.frame__media { object-fit: cover; }
.frame.has-media .frame__art { opacity: 0; }         /* l'opera resta sotto come fallback di caricamento */
.frame--duo .frame__media { filter: grayscale(1) contrast(1.05); }
.frame--duo::after { content: ""; position: absolute; inset: 0; background: var(--c-minio-velo); mix-blend-mode: multiply; opacity: .10; pointer-events: none; }
.cartellino { margin-top: 8px; font: 500 .75rem/1.2 'Inter Tight', sans-serif; letter-spacing: .10em; text-transform: uppercase; color: var(--fg-2); display: flex; gap: 12px; }
```

Classe `.has-media` aggiunta dall'autore quando inserisce `<img>`/`<video>`; `alt` obbligatorio (descrittivo, in lingua: `data-i18n-attr="alt:gallery.alt02"`). Video: `<video class="frame__media" muted playsinline loop preload="none" poster="…">`, `autoplay` solo se `prefers-reduced-motion: no-preference` (aggiunto da JS), altrimenti resta il poster.

### 6.2 Elenco degli slot

| Slot | Dove | Ratio | Dimensione consigliata | Orientamento | Cosa dovrebbe ritrarre | Opera segnaposto ora |
|---|---|---|---|---|---|---|
| SLOT-01 | Hero, «il quadro» | 4:5 | 1600×2000 px (min 1200×1500) | verticale | Kristina a figura intera sui tacchi, in movimento o in bevel, fondo neutro chiaro o muro di Brera; il soggetto nel terzo destro (a sinistra passa la linea-tacco) | Il quadrato Rosso Minio pieno con cartellino «n.01». Con la foto: `.hero__quadro.has-media` → l'immagine sostituisce il rosso; il cartellino resta su una fascia Avorio in basso; il bordo diventa 2px Rosso Minio |
| SLOT-02 | Kristina, ritratto | 4:5 | 1200×1500 px | verticale | Ritratto a mezza figura, sguardo in camera, luce laterale naturale, spazio sopra la testa | Opera «Silhouette» (décolleté + gamba) |
| SLOT-03 | Galleria n.01 | 9:16 | 1080×1920 px, video 6–10 s in loop, muto | verticale | Camminata attraverso la sala, ripresa frontale, tacchi in primo piano | Opera «Verticale» + triangolo play outline 48px + scritta «VIDEO — [TODO]» in cartellino |
| SLOT-04 | Galleria n.02 | 4:5 | 1200×1500 px | verticale | Dettaglio: scarpa col tacco sul parquet, bevel, caviglia | Opera «Angolo» |
| SLOT-05 | Galleria n.03 | 4:5 | 1200×1500 px | verticale | La classe da dietro, in fila, durante la camminata | Opera «Arco» |
| SLOT-06 | Galleria n.04 | 1:1 | 1200×1200 px | quadrato | Mani e posa, dettaglio di braccia, senza volto | Opera «Griglia» |
| SLOT-07 | Galleria n.05 | 3:2 | 1500×1000 px | orizzontale | Esterno a Brera: cortile, ciottoli, un tacco in primo piano | Opera «Silhouette» ritagliata (crop editoriale, `slice`) |
| SLOT-08 | Dove, mini-mappa | 4:3 | — (resta SVG) | orizzontale | Non è una foto: pianta astratta; in futuro può ospitare una foto dell'ingresso | Opera «Mini-mappa» |
| SLOT-09 | `og-image.png` | 1.91:1 | 1200×630 px PNG < 300 KB | orizzontale | Esportazione raster del design dell'hero (titolo Bodoni, quadrato rosso, linea-tacco) | ECCEZIONE dichiarata al vincolo «solo SVG inline»: le anteprime WhatsApp/Telegram/Instagram non srotolano SVG. Si genera una volta (screenshot 1200×630 dell'`og.html` di servizio, o da Figma) |
| SLOT-10 | Favicon | 1:1 | `favicon.svg` (K-stiletto) + `favicon-512.png` + `apple-touch-icon.png` 180×180 | — | Monogramma su Avorio | Seconda ECCEZIONE raster: i PNG servono ai sistemi che ignorano il favicon SVG |

Linee guida per lo shooting da riportare in `docs/FOTO_DA_FORNIRE.md`: luce naturale o laterale, fondi neutri (muro, parquet, cortile), niente flash frontale, niente filtri Instagram; verranno uniformate con `.frame--duo` se scattate in condizioni diverse.

### 6.3 Gli SVG di firma (path definitivi, validati a video)

Tutti con `aria-hidden="true" focusable="false"`, colori tramite `currentColor` dove possibile, `vector-effect="non-scaling-stroke"` sui tratti da 1.5px.

**Décolleté con gamba (una sola linea)** — viewBox `0 0 320 520`. Linea Antracite 1.5px; il tacco è ripassato in Rosso Minio; il punto a terra è rosso r=4.

```html
<svg viewBox="0 0 320 520" aria-hidden="true" focusable="false">
  <path class="line" d="M108 60 C84 150 98 240 138 330 C142 352 130 374 126 396 L117 512 L124 512 C130 470 138 432 152 402 C180 406 220 438 266 466 C288 478 304 482 316 488 C312 470 294 450 268 436 C236 420 206 402 190 382 C176 362 170 344 168 326 C168 236 178 150 162 60" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
  <path class="heel" d="M126 396 L117 512 L124 512 C130 470 138 432 152 402" fill="none" stroke="#B02C16" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  <circle class="dot" cx="120.5" cy="512" r="4" fill="#B02C16"/>
</svg>
```

Lettura: dall'alto la parte posteriore del polpaccio scende con una curva piena fino alla caviglia, il tallone della scarpa, il tacco a spillo (sottile, 7 unità alla base, a punta), poi la suola risale nell'arco, scende alla punta, e la linea torna indietro sul collo del piede e sale lungo lo stinco. Usi: hero (altezza 70vh), ritratto SLOT-02 (`transform="translate(90,-40) scale(0.95)"` nel viewBox 400×500), SLOT-07 in crop (solo la parte bassa: `viewBox="60 300 320 220"`), separatore piccolo nel nastro (12px: qui si usa invece `heel-outline.svg` già in `assets/`, più leggibile in piccolo).

**Monogramma K-stiletto** — viewBox `0 0 64 64`: asta spessa (contrasto didone), braccio superiore a filetto, gamba inferiore sostituita da un tacco a spillo pieno che si assottiglia fino alla punta, punto rosso alla punta. Validato a 160, 64 e 32px.

```html
<svg class="monogram" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <rect x="14" y="8" width="7" height="48" fill="currentColor"/>
  <path d="M21 34 L46 8" stroke="currentColor" stroke-width="1.6" fill="none"/>
  <path d="M21 30 L29 27 L49 55.5 L47.5 56.5 Z" fill="currentColor"/>
  <circle class="monogram__dot" cx="48.5" cy="57" r="3" fill="var(--accent)"/>
</svg>
```

Fallback nome: se `CONFIG.brand.monogram` è «C» (grafia «Cristina»), il monogramma diventa la lettera «C.» in Bodoni Moda 500 (testo SVG `<text>` o semplice `<span>`), con il punto rosso come `::after` (cerchio 6px): la gamba-stiletto esiste solo per la K. La stessa K vale per il russo (К cirillica).

**Asterisco separatore** «✱» (U+2731) in Bodoni Moda 400 (Playfair in RU), 20px, Rosso Minio; se il glifo manca nel font si usa «*» in Bodoni: entrambi con `aria-hidden`.

Asset già presenti in `assets/` e riusati: `heel-outline.svg` (viewBox 0 0 240 200) come icona-separatore nel nastro (12px, alternata al «✱» ogni quattro voci) e come icona 16px accanto al link Instagram nel footer. Nessun cursore personalizzato in v1: il cursore resta quello nativo (decisione presa per accessibilità e per evitare i problemi di `mix-blend-mode` su Safari segnalati dai giudici). `heel-block.svg` (pieno) come icona 12px della chip «Tacco 5–7 cm» (è il tacco block consigliato a chi inizia). `heel-stiletto.svg` resta per usi futuri (post, og-image), non compare in pagina in v1.

### 6.4 Le cinque opere + la mini-mappa (viewBox `0 0 400 500`, `preserveAspectRatio="xMidYMid slice"`)

Lessico comune: linee Antracite 1.5px + un solo elemento Rosso Minio. Tutte validate a video.

- (a) «Angolo»: `<path d="M280 70 V400 H60" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="280" cy="400" r="5" fill="#B02C16"/>` — la geometria del tacco visto di profilo (spillo + suola).
- (b) «Verticale»: `<path d="M90 60 V440 M150 60 V440 M250 60 V440" stroke="currentColor" stroke-width="1.5"/><path d="M250 440 L300 472" stroke="#B02C16" stroke-width="1.5"/>` — il ritmo dei passi.
- (c) «Arco»: `<path d="M60 380 A140 210 0 0 1 340 380" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M140 170 H260" stroke="#B02C16" stroke-width="1.5"/>` — la curva del collo del piede con la tangente rossa.
- (d) «Griglia»: 36 cerchi r=2.5 in Sabbia (`#B5AEA3`) su 6 colonne (x = 50, 110, 170, 230, 290, 350) × 6 righe (y = 100, 160, 220, 280, 340, 400) e un `<rect x="230" y="220" width="60" height="60" fill="#B02C16"/>` — lo schema di una coreografia con una sola cella occupata.
- (e) «Silhouette»: il gruppo `<g transform="translate(90,-40) scale(0.95)">` con la décolleté (§6.3).
- «Mini-mappa» (viewBox `0 0 400 300`, `xMidYMid slice`): sette strade come curve morbide 1px Antracite — `M0 70 C80 66 150 80 240 60 S380 40 400 44` · `M0 150 C90 140 160 160 260 150 S360 130 400 140` · `M0 240 C120 226 220 250 400 230` · `M110 0 C104 80 120 160 100 300` · `M230 0 C240 90 224 200 236 300` · `M320 0 C312 100 330 180 316 300` · `M150 60 C200 110 250 130 300 150` — più `<circle cx="236" cy="150" r="14" fill="none" stroke="#B02C16" stroke-width="1"/>` e `<circle cx="236" cy="150" r="5" fill="#B02C16"/>`. È dichiaratamente astratta (cartellino «pianta astratta»): non rappresenta le vie reali.

Le card della sezione Lezioni riusano tre lessici in piccolo (24px, Sabbia): cerchio outline, angolo, tre linee.

### 6.5 Modalità duotono per le foto future

`.frame--duo` (opzionale, per uniformare scatti diversi): `filter: grayscale(1) contrast(1.05)` sull'immagine + un layer `#8A2211` in `mix-blend-mode: multiply` al 10% + (facoltativo) un layer Avorio in `screen` al 6%. Attivabile per singola cornice. Non si applica al video.

---

## 7. Movimento

### 7.1 Principi

- Easing unico: `--ease: cubic-bezier(.22, 1, .36, 1)`. Durate: 200ms micro (hover, colore) · 600–900ms rivelazioni · 1200–1400ms linee che si disegnano.
- Solo `transform`, `opacity`, `clip-path`, `stroke-dashoffset`: mai animare layout, `box-shadow` o `filter`.
- Pattern OPT-IN: tutte le animazioni vivono dentro `@media (prefers-reduced-motion: no-preference)`; fuori da quel blocco il sito è già nello stato finale (opacity 1, transform none, linee disegnate).
- IntersectionObserver unico (`threshold: 0.15`, `rootMargin: 0px 0px -10% 0px`) che aggiunge `.is-in` e fa `unobserve` dopo la prima rivelazione. Nessun listener di scroll tranne quello (passivo, con `requestAnimationFrame`) della cucitura e dello scroll-spy.
- `document.hidden` → le animazioni infinite si mettono in pausa (`animation-play-state: paused` su `html.is-hidden`).
- Tutti gli stati iniziali nascosti (`.reveal` a opacity 0, righe dell'h1 con clip, filetti a `scaleX(0)`, quadrato a opacity 0, linee con `stroke-dashoffset`) sono applicati SOLO sotto `html.js`: la prima riga dell'`<head>` è `<script>document.documentElement.classList.add('js')</script>`. Senza JavaScript la pagina è quindi visibile per intero anche con le animazioni abilitate nel sistema (coerente con la checklist, voce 21).

### 7.2 Elenco

| # | Elemento | Trigger | Animazione | Durata / easing | Reduced motion |
|---|---|---|---|---|---|
| 1 | Filetti dell'hero | load | `scaleX 0→1`, origin left | 900ms `--ease` | pieni |
| 2 | h1 hero | load +200ms | riga per riga `clip-path: inset(0 0 100% 0) → inset(0)`, stagger 120ms | 700ms `--ease` | visibile |
| 3 | Quadrato rosso | load +500ms | `translateY(24px)→0` + opacity | 800ms `--ease` | visibile |
| 4 | Linea-tacco | load +700ms | `stroke-dashoffset: L→0` (L = `getTotalLength()`), poi punto `scale 0→1` | 1400ms ease-out + 200ms | disegnata |
| 5 | Sub, CTA, colophon | load +1200ms | opacity 0→1 (`pointer-events` sempre attivi) | 500ms | visibili |
| 6 | Respiro del punto rosso (hero, monogramma Prenota, mappa) | idle | `scale 1→1.15` alternate infinito | 3s ease-in-out | fermo; si ferma anche con «Pausa» |
| 7 | Parallasse del quadrato | scroll, ≥1024 | `translateY` ±12px in funzione dello scroll dell'hero | rAF, lerp 0.1 | disattivata |
| 8 | Reveal standard (`.reveal`) | viewport | opacity 0→1 + `translateY(16px)→0`; titoli con clip dal basso | 700ms `--ease`, stagger 90ms nelle liste | visibili |
| 9 | Linea sotto h2 | viewport | pseudo-elemento 1px Antracite (Corallo su scuro) largo 100% che cresce `scaleX 0→1` | 1000ms `--ease` | piena |
| 10 | Numerali ghost | viewport | contano da 00 al valore (tick 60ms per cifra) + `scale .96→1` | ~600ms | valore finale |
| 11 | Cucitura | scroll | trace `scaleY(progress)`, punto `translateY(progress × altezza)`, nodo a progress ≥ .985 | rAF, lerp 0.12 | trace piena, punto in fondo con nodo, nessun listener |
| 12 | Marquee (×2) | idle | `translateX(0→-50%)` lineare infinito | 40s (strip), 60s (nastro) | statico, una copia |
| 13 | Timeline «La lezione» | viewport | linea `scaleX/scaleY 0→1`, cerchi in sequenza 120ms, punto finale | 1400ms | piena |
| 14 | Opere SVG a linea (Silhouette, Angolo, Arco, Verticale, mappa) | viewport | `stroke-dashoffset` | 1200ms ease-out | disegnate |
| 15 | Card lezioni | hover (pointer: fine) | bordo → Sabbia, numerale → Corallo | 200ms | cambio colore istantaneo ok |
| 16 | Bottone primario | hover | sfondo → Minio scuro, testo `translateY(-1px)`, linea Avorio sotto l'etichetta `scaleX 0→1` | 200ms | solo colore |
| 17 | Bottone secondario | hover | riempimento Antracite, testo Avorio | 200ms | solo colore |
| 18 | Link ghost | hover | underline da Antracite a Rosso Minio + `text-underline-offset` +0.05em | 200ms | solo colore |
| 19 | Cornici | hover | opera o foto `scale(1.03)`, cartellino sottolineato | 900ms | nessuno |
| 20 | Nav | scroll-spy | underline che scorre tra le voci | 240ms | istantaneo |
| 21 | Switch lingua | click | crossfade dei testi (`html.is-switching` → opacity .0→1 su `[data-i18n]`) | 200ms | istantaneo |
| 22 | FAQ | toggle | altezza via WAAPI + icona ruota 45° | 300ms | istantaneo |
| 23 | Menu mobile | open/close | pannello opacity + `translateY(-8px)→0`; voci stagger 40ms | 250ms | istantaneo |
| 24 | Back-to-top | scroll > 2 viewport | opacity + `translateY(8px)→0` | 200ms | istantaneo |
| 25 | Header | scroll > 80px | filetto Antracite → Filetto | 200ms | istantaneo |

### 7.3 Comportamento con `prefers-reduced-motion: reduce` e controllo «Pausa»

```css
/* stato base = finale (nessuna animazione) */
.reveal { opacity: 1; transform: none; }
@media (prefers-reduced-motion: no-preference) {
  html.js .reveal { opacity: 0; transform: translateY(16px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
  html.js .reveal.is-in { opacity: 1; transform: none; }
  /* …tutte le keyframes e le transizioni; ogni stato iniziale nascosto porta il prefisso html.js… */
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
html.is-motion-off .marquee__track, html.is-motion-off .breath, html.is-hidden .marquee__track, html.is-hidden .breath { animation-play-state: paused; }
```

JS: `const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;` se `reduce` è vero non si registrano IntersectionObserver, listener di scroll, parallasse né autoplay dei video; le classi `.is-in` vengono aggiunte a tutti gli elementi subito. Il controllo «Pausa» (bottone in ogni marquee, `aria-pressed`) imposta `html.is-motion-off`, ferma tutte le animazioni infinite del sito (marquee, respiri) e persiste in `localStorage('hd-motion')`. Con reduced motion i bottoni Pausa non compaiono (non c'è nulla da fermare). Questo soddisfa WCAG 2.2.2 per ogni movimento autonomo che dura più di 5 secondi.

---

## 8. Componenti

### 8.1 Bottoni

Base: `display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 24px; font: 600 .9375rem/1 'Inter Tight'; letter-spacing: .01em; text-decoration: none; border: 1px solid transparent; border-radius: 0; cursor: pointer; transition: background-color .2s, color .2s, border-color .2s;` Larghezza fluida (mai `width` fissa); su mobile nelle CTA `width: 100%`. Icone (WhatsApp, Instagram, freccia ↗) come SVG 16px inline `aria-hidden`.

- Primario `.btn--primary`: `background: var(--accent); color: var(--on-accent); border-color: var(--accent)`. Hover: `background: var(--accent-hover)`; etichetta `translateY(-1px)`; pseudo-elemento 1px `--on-accent` sotto l'etichetta `scaleX 0→1`. Active: `translateY(0)`. Su scuro: Corallo con testo Antracite; hover Avorio.
- Secondario `.btn--secondary`: `background: transparent; color: var(--fg); border-color: var(--line-ui)`. Hover: `background: var(--fg); color: var(--bg)`. Nell'header: `min-height: 40px; padding: 0 18px`.
- Ghost `.btn--ghost`: testo `--fg` con `text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .2em`; hover `text-decoration-color: var(--accent)`; freccia «→» o «↗» come SVG.
- Focus (tutti): `outline: 2px solid var(--focus); outline-offset: 3px` in `:focus-visible`.
- Disabled: non esiste (nessun form).

### 8.2 Card

`.card`: `background: var(--bg-2); border: 1px solid var(--line); padding: 28px; display: flex; flex-direction: column; gap: 16px; min-height: 100%`. Struttura: `.card__num` (Bodoni 500 2rem) + `.card__glyph` (SVG 24px, `margin-left: auto`) sulla prima riga; `h3`; `p`; `.chips`; `.btn--ghost` in fondo (`margin-top: auto`). Hover: `border-color: var(--line-ui)`; nessuna traslazione, nessuna ombra. Focus interno: il link ghost.

### 8.3 Badge «Esempio»

`<span class="badge" data-i18n="ui.example">Esempio</span>`: Inter Tight 600 12px maiuscolo +0.14em, colore Fumo, `border: 1px dashed var(--c-fumo)`, `padding: 4px 8px`, allineato a metà dell'h2 (`vertical-align: middle; margin-left: 12px`). Accompagnato da una nota `small` sotto la tabella («Orari indicativi: la conferma arriva su WhatsApp.»). Visibile solo se il flag `isExample` è vero; in produzione, con dati confermati, JS lo rimuove insieme alla nota. Su scuro: colore Sabbia, bordo Sabbia.

### 8.4 Chip (etichetta di sartoria)

`.chip`: `display: inline-flex; align-items: center; gap: 6px; min-height: 24px; padding: 3px 8px; border: 1px solid var(--line-ui); font: 600 .75rem/1 'Inter Tight'; letter-spacing: .14em; text-transform: uppercase; color: var(--fg); border-radius: 0;` Icona facoltativa 12px (`heel-block`). Contenitore `.chips { display: flex; flex-wrap: wrap; gap: 8px; }`. Su scuro: bordo Sabbia, testo Avorio. Non sono interattive (nessun hover).

### 8.5 Marquee

```html
<div class="marquee" data-speed="40">
  <div class="marquee__viewport" aria-hidden="true">
    <div class="marquee__track"><span>HEELS DANCE</span><span class="marquee__star">✱</span>…</div>
    <div class="marquee__track" aria-hidden="true">…copia identica…</div>
  </div>
  <button class="marquee__pause" type="button" aria-pressed="false" data-i18n-attr="aria-label:ui.pause">
    <svg …icona pausa/play 16px…></svg>
  </button>
</div>
```

CSS: `.marquee { position: relative; overflow: hidden; border-block: 1px solid var(--line-ui); background: var(--bg-2); height: 48px; display: flex; align-items: center; }` · `.marquee__viewport { display: flex; width: max-content; }` · `.marquee__track { display: flex; align-items: center; gap: 20px; padding-right: 20px; white-space: nowrap; animation: marquee var(--dur, 40s) linear infinite; }` · `@keyframes marquee { to { transform: translateX(-100%); } }` (con due track identici affiancati, `-100%` del singolo track equivale al loop continuo) · `.marquee:hover .marquee__track, .marquee:focus-within .marquee__track, html.is-motion-off .marquee__track { animation-play-state: paused; }` · `.marquee__pause { position: absolute; right: var(--gutter); top: 50%; translate: 0 -50%; width: 44px; height: 44px; background: var(--bg-2); border: 1px solid var(--line-ui); }`. Il testo dei marquee è decorativo (`aria-hidden` sul viewport): la stessa informazione è sempre presente altrove nella pagina.

### 8.6 Switch lingua

```html
<div class="lang" role="group" aria-label="Lingua / Language / Язык">
  <button type="button" class="lang__btn" data-lang="it" lang="it" aria-pressed="true" aria-label="Italiano">IT</button>
  <span class="lang__sep" aria-hidden="true"></span>
  <button type="button" class="lang__btn" data-lang="en" lang="en" aria-pressed="false" aria-label="English">EN</button>
  <span class="lang__sep" aria-hidden="true"></span>
  <button type="button" class="lang__btn" data-lang="ru" lang="ru" aria-pressed="false" aria-label="Русский">RU</button>
</div>
```

Visivo: tre etichette Inter Tight 500 13px +0.10em Fumo, separate da filetti verticali 1px × 14px (Filetto); voce attiva Antracite con underline 2px Rosso Minio che «scorre» da una voce all'altra (pseudo-elemento posizionato su `left/width` via JS, 240ms). Ogni bottone ha area di 44×32 minimo (padding 8px 10px). Nel footer (scuro): Sabbia / Avorio / Corallo. Sotto i 390 resta identico (tre lettere).

### 8.7 Menu mobile

Bottone «Menu» (44×44, `aria-expanded`, `aria-controls="menu"`, `aria-label` tradotto). Pannello `<div id="menu" class="menu" role="dialog" aria-modal="true" aria-label="Menu">`: `position: fixed; inset: 0; z-index: 60; background: var(--c-avorio); padding: calc(var(--header-h) + 24px) var(--gutter) 40px; display: grid; align-content: space-between;` Voci in Bodoni `--fs-menu` Antracite, una per riga, numero di sezione in eyebrow Rosso Minio davanti; sotto: switch lingua, CTA primaria «Scrivimi su WhatsApp» a tutta larghezza, contatti in small. Chiusura: bottone «Chiudi» (stesso posto del bottone Menu, icona «×»), tasto Esc, click su una voce. Focus trap attivo solo da aperto; al chiudersi il focus torna al bottone Menu; `body { overflow: hidden }` da aperto. Animazione §7.2 #23.

### 8.8 Back-to-top

`<a href="#top" class="totop" aria-label="Torna all'inizio">` con freccia ↑ SVG 16px; `position: fixed; right: 16px; bottom: 16px; width: 44px; height: 44px; background: var(--c-avorio); border: 1px solid var(--c-antracite); color: var(--c-antracite);` Appare (`.is-visible`) dopo 2 viewport di scroll; `scroll-behavior: smooth` solo con no-preference. Su ≥1024: `right: 24px; bottom: 24px`.

### 8.9 Accordion FAQ

`<details class="faq"><summary class="faq__q">…<svg class="faq__icon">…</svg></summary><div class="faq__a"><p>…</p></div></details>`. `summary` con `list-style: none` (e `::-webkit-details-marker { display: none }`), `min-height: 44px; padding-block: 16px; cursor: pointer; display: flex; justify-content: space-between; gap: 16px;` Focus visibile con outline rosso. JS: intercetta il click sul `summary`, apre/chiude animando l'altezza di `.faq__a` (WAAPI, 300ms) e poi sincronizza l'attributo `open`; con reduced motion o senza JS, comportamento nativo. L'icona ruota di 45° (`transform`) e diventa Rosso Minio da aperto (`details[open] .faq__icon`).

### 8.10 Tabella

`.table { width: 100%; border-collapse: collapse; }` · `th` Inter Tight 500 12px maiuscolo +0.10em Fumo con filetto sotto · `td` body con `padding: 14px 0; border-bottom: 1px solid var(--line); font-variant-numeric: tabular-nums;` · prezzo in Bodoni 500 `--fs-h3` allineato a destra · hover riga (pointer: fine): `background: var(--c-avorio); box-shadow: inset 2px 0 0 var(--accent)`. Sotto i 768: `thead` visivamente nascosto (ma presente), `tr` come blocco Lino con `padding: 16px`, `td::before { content: attr(data-label) }` in small.

### 8.11 Cartellino e numerale ghost

Cartellino: vedi §6.1. Numerale: `<span class="numeral" aria-hidden="true" data-count="01">01</span>` con `position: absolute; top: calc(var(--space-section) - .3em); left: -0.15em; font: 400 var(--fs-num)/.8 'Bodoni Moda'; color: var(--c-filetto); pointer-events: none; user-select: none;` La sezione ha `position: relative; overflow: clip`. Su scuro: colore Filetto scuro.

---

## 9. Dettagli di firma (implementazione)

### 9.1 La cucitura (linea che cammina)

Una sola linea verticale fissa che accompagna tutto lo scroll: guida Antracite, tratto percorso Rosso Minio, punto rosso in testa, nodo finale nel footer. È il filo che parte dal punto rosso sotto il tacco nell'hero e finisce annodato nel colophon.

```html
<div class="seam" aria-hidden="true">
  <span class="seam__guide"></span>
  <span class="seam__trace"></span>
  <span class="seam__dot"></span>
</div>
```

```css
.seam { position: fixed; top: var(--header-h); bottom: 24px; left: 10px; width: 1px; z-index: 40; pointer-events: none; }
@media (min-width: 1024px) { .seam { left: calc(var(--gutter) / 2); bottom: 32px; } }
.seam__guide { position: absolute; inset: 0; background: var(--c-antracite); opacity: .9; }
.seam__trace { position: absolute; inset: 0; background: var(--c-minio); transform-origin: top; transform: scaleY(var(--p, 0)); }
.seam__dot { position: absolute; left: 50%; top: 0; width: 8px; height: 8px; margin-left: -4px; margin-top: -4px; border-radius: 50%; background: var(--c-minio); transform: translateY(calc(var(--p, 0) * var(--seam-h, 0px))); }
.seam.is-knot .seam__dot { box-shadow: 0 0 0 3px var(--c-avorio), 0 0 0 4px var(--c-minio); } /* il nodo: 6px + ghiera */
```

JS: `--seam-h` = altezza del track (ricalcolata su `resize`); su scroll (listener passivo → flag → rAF) `p = scrollY / (document.documentElement.scrollHeight - innerHeight)`, con lerp 0.12 verso il valore target; `.is-knot` quando `p ≥ .985`. Sulla sezione scura (Lezioni, footer) la linea resta Antracite/Minio: passa sul Grafite come un filo cucito. Con reduced motion: `--p: 1` fisso, classe `.is-knot`, nessun listener. Nel footer, accanto al punto d'arrivo, un cartellino verticale «fine» in Inter Tight 11px (opzionale, solo ≥1024).

### 9.2 Il cartellino di galleria

Ogni cornice, card, tabella e sezione porta un cartellino numerato («n.03 — Studio, Brera», «02 / Kristina», «01 — Cos'è»). I numeri di sezione sono generati da JS su `[data-numbered]` in ordine DOM, formattati a due cifre, e riportati anche nei link della nav su ≥1200 (`<span class="nav__n">02</span> Lezioni`) e nel menu mobile. Le sezioni hanno inoltre il numerale ghost (§8.11) con lo stesso numero.

### 9.3 Il monogramma K-stiletto e il punto rosso

Un solo simbolo in tre luoghi: il punto rosso del monogramma (header, Prenota, footer, favicon), il punto a terra sotto il tacco nell'hero, la testa della cucitura. Stesso raggio proporzionale (r=3 su 64, r=4 su 520, 8px reali sulla cucitura), stesso colore, stesso respiro di 3s (dove attivo). `favicon.svg` = monogramma su fondo Avorio (`<rect>` pieno + gruppo), più i PNG di fallback (§6.2).

### 9.4 La parola in corsivo

In ogni titolo Bodoni c'è esattamente una parola in italic 400 (mai due), sempre nel colore del testo: «Sui tacchi, / *con carattere.*» (l'unica eccezione a «una parola»: qui è tutta la seconda riga, per equilibrio visivo), «I tacchi non si portano: si *abitano*.», «Le *lezioni*.», «Non serve saper ballare. Serve *volerlo*.», «Studio, *Brera*.», «Gli *orari*.», «I *prezzi*.», «Brera, *Milano*.», «Dopo la *prima* lezione.», «Vieni a *provare*.». In EN e RU la parola in corsivo è quella semanticamente equivalente (EN: «In heels, / *with character.*», RU: «На каблуках, / *с характером.*»), impostata nel dizionario con `<em>` (chiave con suffisso `_html`).

### 9.5 Lo switch lingua a filetti

IT | EN | RU separati da filetti verticali, con la sottolineatura rossa che scorre (§8.6): la stessa grammatica dei filetti di sezione e della nav. Identico nell'header, nel menu mobile e nel footer (un solo componente, tre istanze sincronizzate).

---

## 10. Accessibilità

- Landmark: `<header>` (con `<nav aria-label="Principale">`), `<main id="main">`, `<footer>`; sezioni con `aria-labelledby` sull'h2; skip link «Salta al contenuto» come primo figlio del body.
- Heading: un solo `h1` (hero); ogni sezione un `h2`; `h3` per card, tappe, «Cosa portare», FAQ (le `summary` contengono un `h3`); nessun salto di livello; la dimensione visiva si dà con classi, non con il livello.
- Focus: `:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px }` su tutto; mai `outline: none` senza sostituto; ordine di tab = ordine visivo; il menu mobile intrappola il focus solo da aperto e lo restituisce al bottone.
- Target: ogni controllo ≥ 44×44 CSS px (bottoni, switch lingua, Pausa, Menu, back-to-top, `summary`); i link inline nel testo sono esenti ma hanno `padding-block: 2px`.
- Contrasto: come §2; nessun testo sotto 12px; nessun testo su gradiente salvo i cartellini sul quadrato rosso (Avorio su Minio 5.69:1) e, con foto, i cartellini sempre FUORI dalla foto (in `figcaption`, mai sovrapposti).
- ARIA: accordion nativo `<details>` (nessun ARIA aggiuntivo necessario); menu mobile con `aria-expanded`/`aria-controls` sul bottone e `role="dialog" aria-modal="true"` sul pannello; switch lingua `role="group"` + `aria-pressed`; Pausa `aria-pressed`; marquee `aria-hidden`; link esterni con `rel="noopener"` e testo visivamente nascosto «(si apre in una nuova finestra)» (`.visually-hidden`); SVG decorativi `aria-hidden="true" focusable="false"`; SVG informativi (icona WhatsApp da sola) con `role="img"` e `<title>`.
- Testi alternativi: le opere SVG sono decorative (nessun alt); le foto future hanno `alt` descrittivo tradotto via `data-i18n-attr`; il video ha una `figcaption` che ne descrive il contenuto e `aria-label`.
- Movimento: §7.3 (opt-in, reduced motion, Pausa globale); nessun flash; nessun autoplay audio.
- Lingua: `<html lang="it">` aggiornato dallo switch; i frammenti in altra lingua (nome cirillico «Кристина» nel sito italiano, il nastro trilingue) portano `lang` proprio (`<span lang="ru">`).
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">` senza `maximum-scale`/`user-scalable=no`; zoom 200% e 400% senza perdita (unità rem, nessuna altezza fissa).
- `forced-colors: active`: bordi dei bottoni con `border: 1px solid` reale (non solo colore di sfondo), cucitura e opere in `currentColor`.
- Senza JS: tutto il contenuto è visibile in italiano, le CTA funzionano (il link WhatsApp statico nell'HTML è già precompilato in italiano), il menu mobile è un elenco visibile sotto l'header (`.menu` non è `fixed` finché `html.js` non è presente), le FAQ sono `details` nativi, i numeri di sezione sono quelli statici.

---

## 11. Internazionalizzazione (IT / EN / RU)

### 11.1 Struttura dei dizionari (in `script.js`, sotto CONFIG)

```js
const I18N = {
  it: {
    meta: { title: 'Heels Dance a Milano, Brera – Lezioni con Kristina', description: 'Lezioni di heels dance a Milano, zona Brera: tecnica, postura, camminate e coreografie sui tacchi, anche per chi parte da zero. In italiano, inglese e russo. Prenota su WhatsApp.', ogLocale: 'it_IT' },
    nav: { lessons: 'Lezioni', kristina: '{firstName}', schedule: 'Orari', prices: 'Prezzi', where: 'Dove', faq: 'Domande', book: 'Prenota', menu: 'Menu', close: 'Chiudi', skip: 'Salta al contenuto' },
    hero: { eyebrow: 'Heels dance · Brera, Milano', title_html: 'Sui tacchi,<br><em>con carattere.</em>', sub: 'Lezioni di heels dance a Milano per imparare tecnica, presenza e musicalità. Con {firstName}, in italiano, inglese e russo.', ctaWa: 'Scrivimi su WhatsApp', ctaIg: 'Instagram', plate: 'n.01 — Heels, Brera', colophon1: 'Brera · Milano', colophon2: 'Dal {startMonth}', scroll: 'Scorri' },
    strip: { items: ['Heels dance', 'Brera', 'Milano', 'Tecnica', 'Presenza', 'Musicalità'] },
    manifesto: { eyebrow: 'Cos’è', title_html: 'I tacchi non si portano: si <em>abitano</em>.', lead_html: 'L’heels dance è una disciplina di postura, camminata e presenza. Si parte dal piede, si arriva allo sguardo. <span aria-hidden="true">✱</span>', def: [ { t: 'Tecnica', d: '…' }, { t: 'Presenza', d: '…' }, { t: 'Musicalità', d: '…' } ], note: '…' },
    lessons: { … }, method: { … }, about: { … }, gallery: { … }, schedule: { …, days: { mon: 'Lunedì', … } }, prices: { … }, where: { … }, testimonials: { … }, faq: { items: [ { q: '…', a: '…' }, … ] }, book: { … }, footer: { … },
    ui: { example: 'Esempio', pause: 'Metti in pausa lo scorrimento', play: 'Riprendi lo scorrimento', newWindow: '(si apre in una nuova finestra)', toTop: 'Torna all’inizio', language: 'Lingua', todo: '[TODO: da confermare]' },
    wa: { message: 'Ciao {firstName}, ho visto il sito e vorrei prenotare una lezione di heels dance a Brera. Sono [nome], livello [principiante/intermedio]. Quando posso venire?' }
  },
  en: { … },
  ru: { … }
};
```

Regole:
- Chiavi identiche nelle tre lingue (un test in console `checkI18N()` segnala le chiavi mancanti: le stringhe mancanti mostrano il valore italiano e loggano un avviso).
- Le stringhe che contengono markup hanno suffisso `_html` e vengono iniettate con `innerHTML` (solo `<em>`, `<br>`, `<span lang>`; mai testo esterno); tutte le altre con `textContent`.
- Segnaposto `{firstName}`, `{firstNameCyrillic}`, `{startMonth}`, `{email}`, `{instagram}`, `{responseTime}` risolti da CONFIG con `format(str, vars)`; in RU `{firstName}` viene sostituito da `brand.firstNameCyrillic`.
- Elementi: `data-i18n="hero.sub"` per il testo; `data-i18n-attr="aria-label:ui.toTop;title:ui.toTop"` per gli attributi; `data-i18n-list="strip.items"` per liste (marquee, chip) che JS ricostruisce.
- Contenuto statico dell'HTML = versione italiana completa (SEO e no-JS).

### 11.2 Regole redazionali per lingua

- IT: seconda persona singolare, frasi brevi, niente esclamativi, niente emoji, niente Title Case; «heels dance» e «open level» restano in inglese, il resto in italiano («lezione», «prenota», «pacchetto», «lezione di prova», «lezione singola»; mai «drop-in»).
- EN: asciutto, ritmo britannico («Bring your heels. We’ll handle the rest.»); «Milan» (non Milano) nei testi, «Brera» invariato; h1 «In heels, / *with character.*»; CTA «Message me on WhatsApp».
- RU: lo stile si chiama «хай хилс» / «High Heels» / «танцы на каблуках», MAI «стрип-пластика» o «Frame Up»; registro «вы» coerente in tutto il sito e nel messaggio WhatsApp; nessuna forma verbale al passato con genere rivolta al visitatore (usare presente/infinito); h1 «На каблуках, / *с характером.*»; CTA «Написать в WhatsApp»; l'eyebrow «Хай хилс · Брера, Милан».
- Il nastro trilingue (§5.13) non si traduce: è identico in tutte le lingue.

### 11.3 Comportamento dello switch

1. Al caricamento: `localStorage.getItem('hd-lang')` → altrimenti la prima di `navigator.languages` che inizia con `en`/`ru` → altrimenti `it`. Nessun redirect, nessun cookie.
2. `setLang(code)`: aggiorna `document.documentElement.lang`, tutti i `[data-i18n]`, `[data-i18n-attr]`, `[data-i18n-list]`, `document.title`, `<meta name="description">`, `<meta property="og:title|og:description|og:locale">`, gli `aria-pressed` dei tre switch, i link WhatsApp (`href` ricostruito con `encodeURIComponent(I18N[code].wa.message)`), il testo dei giorni della tabella orari e la formattazione dei prezzi (`Intl.NumberFormat(code === 'it' ? 'it-IT' : code === 'en' ? 'en-GB' : 'ru-RU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })`), poi salva `hd-lang`.
3. Crossfade 200ms (§7.2 #21); i contenitori non hanno altezze fisse, quindi il layout può cambiare altezza: è accettato (nessun `min-height` artificiale).
4. Il bottone della lingua attiva ha `aria-pressed="true"`; le tre istanze dello switch sono sincronizzate.

### 11.4 Nota SEO (decisione consapevole)

Il progetto richiede lo switch JS su una sola URL: Google indicizza di fatto solo l'italiano (usa il contenuto visibile, non `lang`). È accettato per la v1. Percorso v2, se servirà posizionamento in EN/RU: tre file statici (`/`, `/en/`, `/ru/`) che condividono `styles.css` e `script.js`, con `hreflang` reciproco e `x-default`, generati a mano dallo stesso dizionario. Non implementare in v1; non aggiungere `hreflang` in v1 (sarebbe falso).

### 11.5 Head della pagina (IT, statico)

```html
<title>Heels Dance a Milano, Brera – Lezioni con Kristina</title>
<meta name="description" content="Lezioni di heels dance a Milano, zona Brera: tecnica, postura, camminate e coreografie sui tacchi, anche per chi parte da zero. In italiano, inglese e russo. Prenota su WhatsApp.">
<link rel="canonical" href="https://[TODO:dominio]/">
<meta name="theme-color" content="#F3EFE7">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-512.png" sizes="512x512" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kristina · Heels dance · Brera">
<meta property="og:title" content="Heels Dance a Milano, Brera – Lezioni con Kristina">
<meta property="og:description" content="Lezioni di heels dance a Milano, zona Brera: tecnica, postura e coreografie sui tacchi, anche per principianti. In italiano, inglese e russo.">
<meta property="og:url" content="https://[TODO:dominio]/">
<meta property="og:image" content="https://[TODO:dominio]/og-image.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Heels Dance a Milano, Brera – Kristina">
<meta property="og:locale" content="it_IT"><meta property="og:locale:alternate" content="en_GB"><meta property="og:locale:alternate" content="ru_RU">
<meta name="twitter:card" content="summary_large_image">
```

JSON-LD (un solo blocco, `@graph` con `Person` + `Course`/`CourseInstance`; NIENTE `LocalBusiness`, `location` e `offers` finché spazio e prezzi non sono confermati; niente `aggregateRating`):

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
 {"@type":"Person","@id":"https://[TODO:dominio]/#kristina","name":"Kristina [TODO: grafia e cognome]","jobTitle":"Insegnante di heels dance","knowsLanguage":["it","en","ru"],"url":"https://[TODO:dominio]/","image":"https://[TODO:dominio]/og-image.png","sameAs":["https://www.instagram.com/[TODO:username]/"],"address":{"@type":"PostalAddress","addressLocality":"Milano","addressRegion":"MI","addressCountry":"IT"}},
 {"@type":"Course","@id":"https://[TODO:dominio]/#corso-heels","name":"Corso di Heels Dance a Milano, Brera","description":"Lezioni di heels dance a Milano, zona Brera: tecnica, postura, camminate e coreografie sui tacchi. Aperto a principianti.","url":"https://[TODO:dominio]/#lezioni","inLanguage":["it","en","ru"],"provider":{"@id":"https://[TODO:dominio]/#kristina"},"hasCourseInstance":{"@type":"CourseInstance","courseMode":"Onsite","instructor":{"@id":"https://[TODO:dominio]/#kristina"}}}
]}
</script>
```

`robots.txt` (`User-agent: *` / `Allow: /` / `Sitemap: https://[TODO:dominio]/sitemap.xml`) e `sitemap.xml` con la sola URL della home e `privacy.html`.

---

## 12. CONFIG (blocco unico in cima a `script.js`)

### 12.1 Struttura

```js
/* ============================================================
   CONFIG — l'unico posto da modificare per personalizzare il sito.
   Tutto ciò che è null, '' o [] mostra un segnaposto [TODO] finché
   features.devLabels è true; in produzione (devLabels false) l'elemento
   corrispondente viene nascosto o sostituito dal testo di fallback.
   ============================================================ */
const CONFIG = {
  brand: {
    firstName: 'Kristina',          // grafia latina da confermare: 'Kristina' | 'Cristina'
    firstNameCyrillic: 'Кристина',
    monogram: 'K',                  // 'K' → K-stiletto SVG; 'C' → lettera C. in Bodoni con punto rosso
    siteName: 'Kristina · Heels dance · Brera'
  },
  contacts: {
    whatsapp: '',                   // solo cifre con prefisso, es. '393331234567' (niente +, spazi, zero iniziale)
    instagram: '',                  // username senza @, es. 'kristina.heels'
    email: ''                       // es. 'ciao@esempio.it'
  },
  venue: {
    name: '',                       // nome dello spazio (TODO)
    street: '', cap: '',            // indirizzo esatto (TODO) — mai mostrato se vuoto
    area: 'Brera', city: 'Milano',
    mapsQuery: 'Brera, Milano',     // sostituire con 'Nome spazio, Via X 1, Milano' quando noto
    addressOnBooking: true          // true = "l'indirizzo esatto ti arriva alla conferma"
  },
  schedule: {
    isExample: true,                // true = badge "Esempio" + nota
    slots: [
      { day: 'tue', start: '19:30', end: '20:45', format: 'open',  level: 'all',      langs: ['it','en','ru'] },
      { day: 'thu', start: '19:00', end: '20:00', format: 'basics', level: 'beginner', langs: ['it','en','ru'] }
    ],
    startMonth: { it: '[TODO: mese] 2026', en: '[TODO: month] 2026', ru: '[TODO: месяц] 2026' }
  },
  pricing: {
    isExample: true,
    currency: 'EUR',
    items: [
      { id: 'trial',   price: null, validity: null },   // null → "[TODO]" o "su richiesta"
      { id: 'single',  price: 20,   validity: null },
      { id: 'pack5',   price: 90,   validity: 2 },      // validità in mesi
      { id: 'pack10',  price: 170,  validity: 4 },
      { id: 'private', price: 60,   validity: null, perHour: true }
    ],
    membershipFee: null,            // quota associativa: null = nessuna (da confermare con l'inquadramento)
    paymentNote: { it: '', en: '', ru: '' }
  },
  legal: {
    fiscalName: '',                 // nome e cognome o denominazione (TODO)
    vat: '',                        // P.IVA (TODO) — riga nascosta se vuota e devLabels false
    fiscalAddress: ''               // sede (TODO)
  },
  features: {
    testimonials: false,            // true solo con recensioni vere in testimonials[]
    gallery: true,
    devLabels: true,                // mostra i [TODO] in pagina; false in produzione
    smoothScroll: true
  },
  testimonials: [],                 // { quote: {it,en,ru}, name: '', level: 'beginner' }
  responseTime: { it: '[TODO: es. 24 ore]', en: '[TODO]', ru: '[TODO]' },
  site: { url: 'https://[TODO:dominio]/', ogImage: 'og-image.png' }
};
```

### 12.2 Come viene iniettato

- All'avvio `applyConfig()` gira prima di `setLang()`:
  - `[data-config="contacts.email"]` → `textContent` (con fallback `[TODO: email]` se vuoto e `devLabels`, altrimenti elemento nascosto con `hidden`);
  - `[data-config-href="whatsapp"]` → `href = 'https://wa.me/' + contacts.whatsapp + '?text=' + encodeURIComponent(message)`; se `contacts.whatsapp` è vuoto il link punta a `#prenota` e mostra il badge `[TODO: numero]`;
  - `[data-config-href="instagram"]` → `https://www.instagram.com/${instagram}/`; `[data-config-href="email"]` → `mailto:`; `[data-config-href="maps"]` → `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
  - tabella orari e listino ricostruiti da `schedule.slots` e `pricing.items` (righe generate, etichette dai dizionari: `schedule.days.tue`, `schedule.formats.open`, `prices.items.pack5`);
  - badge «Esempio» e note mostrati se `isExample`;
  - sezione Testimonianze: `hidden` rimosso solo con `features.testimonials && testimonials.length`;
  - monogramma: `brand.monogram === 'K'` → SVG K-stiletto; altrimenti `<span class="monogram monogram--text">C<i></i></span>`;
  - anno del footer: `new Date().getFullYear()`;
  - JSON-LD: `name` e `sameAs` aggiornati da JS (facoltativo: il blocco statico resta la fonte per i crawler).
- Il messaggio WhatsApp viene ricostruito a ogni cambio lingua (`I18N[lang].wa.message` con `{firstName}` risolto).
- `checkConfig()` in console elenca i campi vuoti come promemoria prima del lancio.

### 12.3 Messaggi WhatsApp precompilati (verbatim)

- IT: «Ciao {firstName}, ho visto il sito e vorrei prenotare una lezione di heels dance a Brera. Sono [nome], livello [principiante/intermedio]. Quando posso venire?»
- EN: «Hi {firstName}, I found your website and I’d like to book a heels dance class in Brera. I’m [name], level [beginner/intermediate]. When can I come?»
- RU: «Здравствуйте, {firstNameCyrillic}! Пишу с вашего сайта: хочу записаться на урок хай хилс в Брере. Меня зовут [имя], уровень [начинающий/средний]. Когда можно прийти?»

Il link statico nell'HTML (per no-JS) usa la versione italiana con `contacts.whatsapp` da inserire a mano una volta (commento `<!-- CONFIG: numero -->`). Il numero vive quindi in DUE posti (HTML statico e CONFIG): `docs/TODO.md` lo elenca come modifica doppia.

---

## 13. Struttura file e checklist di accettazione

### 13.1 Struttura consigliata

```
index.html            one-page (contenuto italiano completo nell'HTML)
privacy.html          pagina privacy minima (stesso header/footer, stesso CSS)
styles.css            tutto il CSS (token, tipografia, layout, componenti, motion opt-in)
script.js             CONFIG · I18N · applyConfig · setLang · seam · reveal · marquee · menu · faq · scroll-spy
favicon.svg           monogramma K-stiletto
favicon-512.png       fallback raster (eccezione dichiarata)
apple-touch-icon.png  180×180 (eccezione dichiarata)
og-image.png          1200×630 (eccezione dichiarata)
robots.txt · sitemap.xml
assets/
  heel-outline.svg · heel-block.svg · heel-stiletto.svg   (esistenti)
  img/                (vuota: foto future, nomi in FOTO_DA_FORNIRE.md)
  fonts/              (vuota in v1; woff2 se si passa al self-hosting)
docs/
  BRIEF.md            questo documento
  copy.it.json · copy.en.json · copy.ru.json   (testi sorgente, stessa struttura di I18N)
  FOTO_DA_FORNIRE.md  slot, ratio, dimensioni, soggetto, nome file atteso
  TODO.md             elenco dei [TODO] da chiudere prima del lancio
```

Nessun build step: si apre `index.html` dal file system e funziona (percorsi relativi, niente moduli ES cross-origin: `script.js` classico con `defer`). Hosting: Cloudflare Pages (consigliato, gratuito, illimitato per asset statici) o Netlify Drop per le anteprime; NON Vercel Hobby (vietato per uso commerciale) e GitHub Pages solo con repository pubblico.

### 13.2 Checklist di accettazione (verificabile)

Design e contenuto
1. La palette usa solo gli HEX di §2; nessun colore fuori tabella nel CSS (grep degli esadecimali).
2. Nessuna coppia della lista «mai accoppiare» (§2.3) compare nel CSS; ogni testo rispetta AA (verifica con DevTools su un campione: eyebrow, small, chip, bottone primario, testo su Grafite).
3. Una sola superficie rossa per schermata; il rosso non è mai colore di h1/h2/h3.
4. Bodoni Moda non compare sotto i 20px; nessun testo sotto i 12px.
5. Le tre lingue si caricano dai dizionari senza chiavi mancanti (`checkI18N()` in console non segnala nulla); accenti italiani corretti in tutto il copy (cerca «E'» e «perche» → zero risultati).
6. Nessun fatto inventato: anni di esperienza, credenziali, recensioni, indirizzo, prezzi confermati assenti o marcati `[TODO]`; `checkConfig()` elenca i campi vuoti.
7. La sezione Testimonianze è `hidden` e resta tale con `features.testimonials=false`; la numerazione delle sezioni non ha buchi.
8. I badge «Esempio» compaiono su Orari e Prezzi con `isExample=true` e spariscono con `false`.
9. Le cinque cornici della galleria e il ritratto mostrano le opere SVG corrette (a–e), con cartellino e commento HTML dello slot.
10. Il monogramma K-stiletto è nell'header, in Prenota, nel footer e nel favicon; con `monogram='C'` diventa «C.».

Layout e responsive
11. A 390, 768, 1024 e 1440 nessuno scroll orizzontale del body (`document.documentElement.scrollWidth === innerWidth`).
12. Hero a 390: nessuna sovrapposizione tra testo e quadro; a 1440 l'h1 (IT, EN e RU) non copre la linea-tacco.
13. Galleria a 390: scroll orizzontale con snap; a 1024 parete a 3 colonne con gli offset indicati.
14. Tabelle Orari/Prezzi leggibili a 390 (righe impilate con etichette).
15. Zoom 200% e 400%: nessun contenuto tagliato, nessun testo sovrapposto.

Interazione e accessibilità
16. Navigazione completa da tastiera: skip link, nav, switch lingua, Pausa, menu mobile (trap + Esc + ritorno del focus), FAQ, back-to-top; focus sempre visibile.
17. Tutti i target interattivi ≥ 44×44 px (verifica con DevTools sui bottoni, switch, Pausa, summary).
18. Lighthouse mobile: Performance ≥ 90, Accessibilità 100, Best practice ≥ 95, SEO ≥ 95; nessun errore in console.
19. Con «riduci movimento» attivo nel sistema: nessuna animazione, marquee statici senza bottone Pausa, cucitura completa, punto rosso fermo, video (se presenti) senza autoplay.
20. Con Pausa premuto: marquee e respiri fermi; lo stato persiste al ricaricamento.
21. Senza JavaScript: contenuto italiano completo, link WhatsApp statico funzionante, FAQ apribili, menu visibile.
22. Screen reader (VoiceOver o NVDA): un solo h1, ordine dei heading corretto, landmark presenti, marquee ignorati, switch lingua annunciato con stato, link esterni annunciati come nuova finestra.

Link, SEO, legale
23. Link WhatsApp: `https://wa.me/39…?text=` con messaggio codificato che cambia con la lingua, numero identico nel link statico dell'HTML e in CONFIG; Instagram senza «@»; Maps con `api=1&query=`.
24. `<title>`, meta description, `og:*` e `lang` cambiano con lo switch; `og-image.png` 1200×630 raggiungibile con URL assoluto; anteprima verificata su WhatsApp e Telegram.
25. JSON-LD valido (Rich Results Test / Schema Markup Validator) senza `location`/`offers` segnaposto.
26. Footer: anno generato da JS, dati fiscali da CONFIG o `[TODO]`, link Privacy funzionante, nessun «sito realizzato da», nessun cookie banner (nessun cookie di profilazione, nessun embed).
27. Nessuna immagine esterna o stock; le uniche risorse remote sono i font Google (preconnect presente) e la privacy li dichiara.
28. Font: Bodoni Moda / Inter Tight / Playfair Display caricati con l'URL di §3.1; in RU i titoli usano Playfair (nessun fallback di sistema visibile).
29. CLS misurato = 0 sugli slot (aspect-ratio dichiarati) sia con opere SVG sia con foto di prova.
30. `docs/TODO.md` contiene tutti i `[TODO]` presenti nel sito e nel CONFIG; prima del lancio `features.devLabels=false` e nessun `[TODO]` è visibile in pagina.
