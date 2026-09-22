# Guida al sito · per Kristina

Questa guida ti serve per scaricare il sito sul tuo computer, modificarlo come preferisci
e rimetterlo online. Non serve saper programmare: serve solo sapere dove stanno le cose
e come tornare indietro se qualcosa non va.

Il sito è fatto di poche parti e non ha nessuna impalcatura complicata. Si apre con un doppio
clic e si vede subito nel browser. Questo lo rende facile da modificare.

---

## 1. Prima di iniziare: tre cose da creare o installare

**Un account GitHub.** È il posto dove vive il sito. Vai su [github.com](https://github.com),
premi *Sign up* e registrati con la tua email. È gratuito. Poi manda a Manuel il tuo nome
utente: ti aggiunge al progetto e da quel momento puoi pubblicare le tue modifiche.

**VS Code.** È il programma con cui si modificano i file. Scaricalo da
[code.visualstudio.com](https://code.visualstudio.com). Colora il testo, segnala gli errori
e ha una funzione di ricerca che userai continuamente.

**GitHub Desktop.** Scarica il sito sul tuo computer e rimette online le modifiche premendo
un pulsante, senza dover scrivere comandi. Si scarica da
[desktop.github.com](https://desktop.github.com).

---

## 2. Scaricare il sito

1. Apri GitHub Desktop e accedi con il tuo account.
2. Menu *File*, poi *Clone repository*.
3. Nell'elenco scegli `heels-dance`.
4. Scegli una cartella sul tuo computer e premi *Clone*.

Ora hai tutto il sito sul tuo computer. Da qui in poi non dovrai più scaricarlo: basterà
premere *Fetch origin* ogni tanto per prendere eventuali modifiche fatte da altri.

*Alternativa veloce, solo per dare un'occhiata:* sulla pagina del progetto su GitHub premi
il pulsante verde *Code*, poi *Download ZIP*. Ma con lo ZIP non puoi pubblicare: per lavorare
davvero usa GitHub Desktop.

---

## 3. Vedere il sito sul tuo computer

Apri la cartella che hai scaricato e fai doppio clic su `index.html`. Si apre nel browser.
È il sito vero, identico a quello online.

Ogni volta che modifichi un file e lo salvi, ricarica la pagina nel browser per vedere il
risultato. Non serve nient'altro.

> Consiglio: in VS Code installa l'estensione *Live Server*. Aggiunge un pulsante *Go Live*
> in basso a destra: la pagina si ricarica da sola a ogni salvataggio. Comodo ma non obbligatorio.

---

## 4. La tua prima modifica (dieci minuti)

Facciamo insieme la cosa più semplice, per capire il meccanismo.

1. In VS Code apri la cartella del sito: menu *File*, *Open Folder*.
2. Apri il file `styles.css`.
3. Premi `Ctrl+F` e cerca `--c-minio`.
4. Trovi una riga con un codice colore, `#B02C16`. È il rosso di tutto il sito.
5. Cambialo, per esempio in `#7A1FA2`, che è un viola.
6. Salva con `Ctrl+S` e ricarica la pagina nel browser.

Tutto il sito è diventato viola: i titoletti, i pulsanti, la linea, il punto. Questo perché
i colori sono dichiarati in un punto solo e riutilizzati ovunque.

Rimetti `#B02C16` se il rosso ti piaceva, oppure tieniti il viola. Ora sai come funziona.

---

## 5. Dove sta ogni cosa

La cartella contiene pochi file. Questi sono quelli che ti interessano.

| File | Cosa contiene | Difficoltà |
|---|---|---|
| `script.js` | I testi in tre lingue e le impostazioni (contatti, prezzi, date) | Facile per i testi |
| `styles.css` | Colori, caratteri, dimensioni, disposizione | Media |
| `index.html` | La struttura della pagina, le sezioni e il loro ordine | Media |
| `assets/img/` | Le fotografie | Facile |
| `docs/` | Documentazione, non finisce sul sito | — |

### I testi

Stanno tutti in `script.js`, in un elenco che comincia con `const I18N`. Dentro ci sono tre
blocchi: `"it"` per l'italiano, `"en"` per l'inglese, `"ru"` per il russo.

Per cambiare una frase: premi `Ctrl+F`, incolla la frase che vedi sul sito, e modificala.
Ricorda di cambiarla in tutte e tre le lingue, altrimenti resta vecchia quando qualcuno
cambia lingua.

**Regola d'oro:** cambia solo il testo tra virgolette. Non toccare le virgolette, le virgole
e le parentesi attorno. Se ne cancelli una per sbaglio il sito smette di funzionare, e dovrai
tornare indietro (vedi il capitolo 8).

Gli stessi testi sono anche in `docs/copy.it.json`, `copy.en.json` e `copy.ru.json`. Quelli
sono una copia ordinata, utile da leggere. Se modifichi solo `script.js` il sito funziona
comunque: cerca solo di tenerli allineati quando puoi.

### Le impostazioni

Sempre in `script.js`, all'inizio del file, c'è un blocco chiamato `CONFIG`. Ogni riga ha
un commento in italiano che spiega cosa fa. Lì dentro metti:

- Il numero WhatsApp e Telegram
- Il profilo Instagram
- Il nome e l'indirizzo della sala
- I prezzi
- Le date dei workshop
- La partita IVA per il fondo pagina

Quando i prezzi e gli orari saranno quelli veri, metti `true` al posto di `false` nelle righe
`pricingConfirmed` e `scheduleConfirmed`: sparisce l'etichetta «Esempio».

Quando il sito sarà pronto per essere diffuso, metti `showTodos: false`: spariscono tutti gli
spazi gialli tratteggiati con le cose da confermare.

### I colori e i caratteri

In `styles.css`, nelle prime righe, c'è un elenco che comincia con `:root {`. Sono i colori e
i caratteri di tutto il sito, dichiarati una volta sola.

| Nome | Cos'è |
|---|---|
| `--c-avorio` | Lo sfondo chiaro |
| `--c-antracite` | Il testo scuro |
| `--c-minio` | Il rosso degli accenti |
| `--c-grafite` | Lo sfondo della sezione scura e del fondo pagina |
| `--font-display` | Il carattere dei titoli |
| `--font-text` | Il carattere del testo normale |
| `--font-display-ru` | Il carattere dei titoli in russo |

Cambiare qui dentro ridipinge il sito in modo coerente. È il posto migliore da cui partire
se vuoi darle un'aria diversa.

### Le sezioni

In `index.html` ogni sezione è un blocco che comincia con un commento in maiuscolo, per esempio
`<!-- ========= 05 · PROSSIME DATE ========= -->`. Per spostare una sezione più in alto o più in basso,
seleziona tutto il blocco fino alla riga `</section>` e spostalo. I numeri delle sezioni si
riscrivono da soli, non devi contarli tu.

### Le foto

Stanno in `assets/img/`. Per sostituirne una, salva la tua con lo stesso identico nome del file
che vuoi sostituire. In `docs/FOTO_DA_FORNIRE.md` trovi le proporzioni giuste per ogni posizione.

---

## 6. Farti aiutare dall'intelligenza artificiale

Questo è il modo più comodo di lavorare se non conosci il codice.

In VS Code puoi installare un assistente, per esempio Claude o GitHub Copilot. Poi gli scrivi
a parole cosa vuoi, anche in russo:

- «Sposta la sezione dei prezzi sopra quella delle date»
- «Fai i titoli più piccoli sul telefono»
- «Aggiungi un pulsante per Telegram nel fondo pagina»
- «Cambia tutti i testi in modo che diano del lei invece che del tu»

L'assistente modifica i file, tu guardi il risultato nel browser. Se non ti piace, torni
indietro. È così che si personalizza un sito oggi senza studiare per mesi.

Un consiglio: chiedigli **una cosa per volta** e guarda il risultato prima di chiedere la
successiva. Se gli chiedi cinque modifiche insieme e qualcosa si rompe, non sai quale è stata.

---

## 7. Rimettere online le modifiche

1. Apri GitHub Desktop. Vedi l'elenco di tutti i file che hai cambiato.
2. In basso a sinistra scrivi due parole su cosa hai fatto, per esempio «cambiati i prezzi».
3. Premi *Commit to main*.
4. Premi *Push origin* in alto.

Dopo circa due minuti il sito online è aggiornato. Ricarica la pagina per vederlo.

---

## 8. Tornare indietro quando qualcosa si rompe

Questa è la parte più importante della guida. Non puoi fare danni permanenti.

**Hai sbagliato ma non hai ancora pubblicato:** in GitHub Desktop, nella scheda *Changes*,
clicca con il tasto destro sul file e scegli *Discard changes*. Il file torna com'era.

**Hai già pubblicato:** vai nella scheda *History*, clicca con il tasto destro sulla modifica
sbagliata e scegli *Revert changes*. Poi premi *Push origin*. Il sito torna come prima.

**Il sito è diventato una pagina bianca:** quasi sempre è una virgola o una parentesi cancellata
per sbaglio in `script.js`. Apri il sito nel browser, premi `F12`, guarda la scheda *Console*:
c'è scritto in quale riga sta l'errore. Oppure torna semplicemente indietro con *Revert*.

---

## 9. Regole per stare tranquilla

- **Una modifica per volta**, poi guarda il risultato. Così sai sempre cosa l'ha causata.
- **Pubblica spesso e poco.** Tanti piccoli passi si correggono; un unico cambiamento enorme no.
- **Non toccare** la cartella `assets/fonts/` né i file `favicon`, a meno che tu non voglia
  cambiare proprio quelli.
- **Controlla sul telefono**, non solo sul computer. Metà delle persone guarderà il sito da lì.
- **Controlla le tre lingue** dopo aver cambiato i testi: i pulsanti IT, EN e RU in alto a destra.

---

## 10. Quando sei bloccata

Scrivi a Manuel. Digli cosa volevi fare e cosa è successo, e se puoi manda una fotografia
dello schermo. Quasi tutti i problemi si risolvono in pochi minuti se si capisce da dove nascono.

Nel dubbio: *Revert* e si riparte da com'era prima. Il sito non è mai perso.
