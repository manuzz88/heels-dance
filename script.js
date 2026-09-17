/* ============================================================
   CONFIG — L'UNICO posto da modificare per personalizzare il sito.
   Regole:
   · tutto ciò che qui è '' (vuoto), [] o false è un dato NON ancora
     confermato: il sito mostra un segnaposto [TODO] (finché showTodos
     è true) e non inventa nulla;
   · i testi delle tre lingue stanno nei dizionari I18N più in basso
     (copiati integralmente da docs/copy.it.json, copy.en.json, copy.ru.json);
   · il nome "Kristina"/"Кристина" che compare nei testi viene sostituito
     ovunque con brand.firstName / brand.firstNameCyrillic.
   ============================================================ */
const CONFIG = {
  brand: {
    firstName: 'Kristina',          // grafia latina del nome: 'Kristina' oppure 'Cristina' (da confermare)
    firstNameCyrillic: 'Кристина',  // grafia cirillica (nei testi in russo, declinazioni comprese)
    monogram: 'K',                  // 'K' = monogramma K-stiletto (SVG); 'C' = lettera "C." in Bodoni con il punto rosso
    siteName: ''                    // og:site_name e nome nel JSON-LD. Vuoto = «{firstName} · Heels dance · Brera» (segue la grafia del nome)
  },

  contacts: {
    whatsappNumber: '',   // formato internazionale SENZA "+" né spazi, es. '393331234567'. Vuoto = il widget e i pulsanti WhatsApp non pubblicano nessun numero
    telegramUsername: '', // nome utente Telegram SENZA "@", es. 'kristina_heels'. Se vuoto si usa il numero qui sotto
    telegramPhone: '',    // numero per Telegram, stesso formato del WhatsApp. Vuoto = il pulsante Telegram sparisce
    showContactWidget: true,         // pulsante fisso in basso a destra per scrivere subito su WhatsApp/Telegram
    instagramHandle: '',  // senza "@", es. 'kristina.heels'. Vuoto = i link Instagram rimandano alla sezione Prenota
    email: ''             // es. 'ciao@esempio.it'. Vuoto = il pulsante email compare solo in sviluppo (con [TODO]) e sparisce in produzione
  },

  venue: {
    venueName: '',        // nome dello spazio in affitto, es. 'Studio Brera'. Vuoto = resta il segnaposto [TODO] del dizionario
    venueAddress: '',     // via e civico, es. 'Via Brera 1, 20121 Milano'. Mai mostrato se vuoto (l'indirizzo arriva su WhatsApp)
    venueNote: '',        // riga facoltativa, es. 'Primo piano, citofono 3'
    mapsQuery: 'Brera, Milano'  // testo cercato dal link "Apri in Google Maps", es. 'Studio Brera, Via Brera 1, Milano'
  },

  // ORARI · finché scheduleConfirmed è false la tabella mostra le righe di ESEMPIO dei dizionari con il badge "Esempio".
  // Quando gli orari sono definitivi: scheduleConfirmed: true e una riga per classe in schedule, ad esempio
  //   { day: 'tue', time: '19:00–20:00', classIndex: 0 }
  //   day        → 'mon' 'tue' 'wed' 'thu' 'fri' 'sat' 'sun' 'appointment', oppure { it: 'Martedì', en: 'Tuesday', ru: 'Вторник' }
  //   time       → testo, es. '19:00–20:00', oppure { it: 'Da concordare', en: 'To be arranged', ru: 'По договорённости' }
  //   classIndex → 0 Fondamenta · 1 Open · 2 Coreografia · 3 Privata (nome e livello arrivano dai dizionari, tradotti)
  //                in alternativa: class: { it, en, ru } e level: { it, en, ru }
  scheduleConfirmed: false,
  schedule: [],

  // PREZZI · finché pricingConfirmed è false il listino mostra le cifre di ESEMPIO dei dizionari con il badge "Esempio".
  // Quando i prezzi sono definitivi: pricingConfirmed: true e una riga per voce in pricing, ad esempio
  //   { index: 0, price: 15 }                       → voce 0 del listino dei dizionari (nome e dettaglio tradotti), prezzo in euro
  //   { index: 3, price: 180, featured: true }      → voce in evidenza (punto rosso)
  //   { name: { it, en, ru }, price: 25, detail: { it, en, ru } }  → voce nuova
  //   index → 0 Lezione di prova · 1 Lezione singola · 2 Carnet 5 · 3 Carnet 10 · 4 Mensile
  //   price → numero in euro (formattato per lingua: "15 €" / "€15") oppure testo libero, es. { it: 'Gratuita', en: 'Free', ru: 'Бесплатно' }
  pricingConfirmed: false,
  pricing: [],

  legal: {
    fiscalName: '',   // nome e cognome o denominazione, es. 'Kristina Rossi'. Sostituisce il nome nella riga © del footer
    vatNumber: ''     // P.IVA (o C.F.), es. '01234567890'. Vuoto = resta il segnaposto [TODO: P.IVA / C.F.]
  },

  // TESTIMONIANZE · la sezione "Voci" resta nascosta finché showTestimonials è false o testimonials è vuoto.
  // Solo recensioni vere, di persone reali che hanno autorizzato la pubblicazione:
  //   { quote: { it: '…', en: '…', ru: '…' }, name: 'Nome', level: { it: 'Principiante', en: 'Beginner', ru: 'Начинающая' } }
  showTestimonials: false,
  testimonials: [],

  showTodos: true,      // true in sviluppo: i [TODO: …] restano visibili (evidenziati). false prima del lancio: vengono rimossi dal testo
  defaultLang: 'it',    // lingua iniziale se non c'è una scelta salvata né #lang=xx nell'URL: 'it' | 'en' | 'ru'
  autoDetectLang: false, // true = se non c'è una scelta salvata né #lang=xx, usa la lingua del browser quando è it/en/ru (attenzione: anche i motori di ricerca vedrebbero l'inglese)

  site: {
    url: '',            // URL pubblico definitivo con la barra finale, es. 'https://www.esempio.it/' (serve per og:url, og:image e JSON-LD)
    ogImage: 'og-image.png'  // anteprima 1200×630 da generare al lancio (vedi docs/FOTO_DA_FORNIRE.md)
  }
};

/* Nomi dei giorni (per le righe di schedule scritte come 'tue', 'thu', …). */
const DAYS = {
  mon: { it: 'Lunedì', en: 'Monday', ru: 'Понедельник' },
  tue: { it: 'Martedì', en: 'Tuesday', ru: 'Вторник' },
  wed: { it: 'Mercoledì', en: 'Wednesday', ru: 'Среда' },
  thu: { it: 'Giovedì', en: 'Thursday', ru: 'Четверг' },
  fri: { it: 'Venerdì', en: 'Friday', ru: 'Пятница' },
  sat: { it: 'Sabato', en: 'Saturday', ru: 'Суббота' },
  sun: { it: 'Domenica', en: 'Sunday', ru: 'Воскресенье' }
};

/* Etichette di interfaccia non presenti nei JSON (solo per lettori di schermo): da far rivedere ai madrelingua. */
const UI_EXTRA = {
  pause: { it: 'Metti in pausa lo scorrimento', en: 'Pause the scrolling text', ru: 'Остановить бегущую строку' },
  play: { it: 'Riprendi lo scorrimento', en: 'Resume the scrolling text', ru: 'Возобновить бегущую строку' },
  todoTitle: { it: 'Da confermare', en: 'To be confirmed', ru: 'Уточняется' },
  newWindow: { it: '(si apre in una nuova finestra)', en: '(opens in a new window)', ru: '(откроется в новом окне)' }
};
/* Etichetta della partita IVA nella riga © del footer, per lingua. */
const VAT_LABEL = { it: '· P.IVA ', en: '· VAT ', ru: '· P.IVA ' };

/* La parola in corsivo di ogni titolo (brief §9.4): il testo resta quello dei dizionari, qui si indica solo quale parola va in <em>. */
const EMPHASIS = {
  it: { 'manifesto.headline': 'abitano', 'classes.headline': 'formule', 'first_class.headline': 'prima', 'about.headline': 'aspetta', 'schedule.headline': 'Quando.', 'pricing.headline': 'Quanto.', 'location.headline': 'Milano', 'testimonials.headline': 'sala', 'faq.headline': 'venire', 'contact.headline': 'provare' },
  en: { 'manifesto.headline': 'inhabit', 'classes.headline': 'formats', 'first_class.headline': 'first', 'about.headline': 'waiting', 'schedule.headline': 'When.', 'pricing.headline': 'much', 'location.headline': 'Milan', 'testimonials.headline': 'studio', 'faq.headline': 'come', 'contact.headline': 'try' },
  ru: { 'manifesto.headline': 'живут', 'classes.headline': 'формата', 'first_class.headline': 'первое', 'about.headline': 'ждёт', 'schedule.headline': 'Когда.', 'pricing.headline': 'Сколько.', 'location.headline': 'Милан', 'testimonials.headline': 'зала', 'faq.headline': 'прийти', 'contact.headline': 'попробовать' }
};

/* ============================================================
   I18N — dizionari IT / EN / RU (fonte: docs/copy.*.json, revisionati
   da madrelingua). Generati automaticamente: per modificare i testi
   aggiornare i JSON e rigenerare, oppure modificare qui con cura.
   ============================================================ */
const I18N = {
  "it": {
    "meta": {
      "title": "Heels dance a Brera, Milano · Lezioni con Kristina",
      "description": "Lezioni di heels dance a Milano, zona Brera: postura, camminata, floorwork e coreografia sui tacchi. Anche per chi parte da zero. Prenota su WhatsApp.",
      "og_title": "Sui tacchi, con carattere. Heels dance a Brera, Milano",
      "og_description": "Lezioni di heels dance con Kristina a Milano, zona Brera. Tecnica. Presenza. Musicalità. Anche per chi parte da zero. Prenota su WhatsApp."
    },
    "nav": {
      "classes": "Lezioni",
      "first_class": "Prima volta",
      "about": "Kristina",
      "schedule": "Orari",
      "pricing": "Prezzi",
      "location": "Dove",
      "faq": "Domande",
      "contact": "Contatti",
      "book": "Prenota"
    },
    "hero": {
      "eyebrow": "Heels dance · Milano, Brera",
      "headline_line1": "Sui tacchi,",
      "headline_line2": "con carattere.",
      "subheadline": "Lezioni di heels dance con Kristina, nel quartiere delle gallerie. Tecnica. Presenza. Musicalità. Non serve saper ballare. Serve voler provare.",
      "cta_primary": "Scrivimi su WhatsApp",
      "cta_secondary": "Vieni a provare",
      "marquee": [
        "Heels dance",
        "Brera · Milano",
        "Tecnica · Presenza · Musicalità",
        "Tutti i livelli, tutti i corpi",
        "IT · EN · RU"
      ],
      "scroll_hint": "Scorri"
    },
    "manifesto": {
      "eyebrow": "Manifesto",
      "headline": "I tacchi non si portano: si abitano.",
      "paragraphs": [
        "Sui tacchi, il corpo cambia asse. Il peso va in avanti, la schiena si allunga, lo sguardo si alza. L’heels dance parte da qui: da una camminata, poi da una posa, poi da una frase di musica. Si parte dal piede, si arriva allo sguardo.",
        "Non è una danza nata in un posto solo. Viene dal jazz e dai videoclip, dal vogue e dal waacking, dalla scena ballroom di Harlem e dai club di Los Angeles, dal burlesque e dal contemporaneo. In sala tutta questa storia diventa una cosa semplice: tenere il tempo, occupare lo spazio, decidere dove guardare. La sensualità non è il compito. È quello che resta quando la tecnica è a posto."
      ],
      "pillars": [
        {
          "title": "Tecnica",
          "text": "Postura, appoggio, allineamento. Imparare a stare sui tacchi prima di muoversi, e a muoversi prima di ballare. La camminata viene sempre prima della coreografia."
        },
        {
          "title": "Presenza",
          "text": "Occupare lo spazio. Tenere lo sguardo. Decidere ogni gesto, anche quello che sembra non contare. In sala non conta quanto sai fare. Conta se ci sei."
        },
        {
          "title": "Musicalità",
          "text": "Ascoltare prima di contare. Ogni frase di musica ha un peso, un accento, un respiro: il corpo li segue e li rende visibili."
        }
      ]
    },
    "classes": {
      "eyebrow": "Le lezioni",
      "headline": "Una tecnica, quattro formule.",
      "intro": "Ogni lezione dura 60 minuti [TODO: confermare la durata con Kristina] e segue la stessa struttura: riscaldamento senza tacchi, tecnica, floorwork, coreografia, stretching. Cambia il livello, cambia il ritmo, non cambia la cura. La lezione è in italiano; quando serve, spiego in inglese o in russo [TODO: confermare le lingue della lezione].",
      "items": [
        {
          "name": "Fondamenta",
          "level": "Base",
          "duration": "60 min [TODO: confermare]",
          "description": "Per chi non ha mai messo un tacco in sala, o non ha mai ballato. Postura, appoggio del piede, camminata lenta e veloce, bevel, prime isolazioni. Alla fine, una frase coreografica breve: prima contata, poi in musica.",
          "tags": [
            "Principianti assoluti",
            "Tacco 5–7 cm"
          ]
        },
        {
          "name": "Open",
          "level": "Tutti i livelli",
          "duration": "60 min [TODO: confermare]",
          "description": "Una lezione sola per chi inizia e per chi balla già. Tecnica di camminata, lavoro a terra con le ginocchiere, una combinazione nuova ogni settimana. Ogni persona la porta al proprio livello: stessi passi, intensità diversa.",
          "tags": [
            "Senza prerequisiti",
            "Ogni settimana"
          ]
        },
        {
          "name": "Coreografia",
          "level": "Intermedio",
          "duration": "60 min [TODO: confermare]",
          "description": "Per chi ha già i fondamenti e vuole il dettaglio: texture, dinamiche, hair whip, cambi di direzione, floorwork completo. Ritmo più rapido, una coreografia che cresce su più lezioni fino a essere ballata per intero.",
          "tags": [
            "Dopo Fondamenta",
            "Posti limitati"
          ]
        },
        {
          "name": "Privata",
          "level": "Su misura",
          "duration": "60 min [TODO: confermare]",
          "description": "Uno a uno, o in due. Un obiettivo preciso: correggere la camminata, preparare un video, sciogliere la paura di cadere. Orario e luogo da concordare.",
          "tags": [
            "1:1 o in coppia",
            "Su appuntamento"
          ]
        }
      ]
    },
    "first_class": {
      "eyebrow": "La prima volta",
      "headline": "Come funziona la prima lezione.",
      "intro": "Un’ora [TODO: confermare la durata], cinque tempi. Arrivi, ti cambi e il resto lo facciamo insieme.",
      "steps": [
        {
          "title": "Arrivo e riscaldamento",
          "text": "Dieci minuti prima, per cambiarti e ambientarti. Si comincia senza tacchi, in calzini o a piedi nudi: mobilità di caviglie, bacino e colonna, attivazione del core."
        },
        {
          "title": "Tecnica",
          "text": "Si mettono le scarpe. Postura, peso sull’avampiede, allineamento del ginocchio, bevel, camminata lenta e veloce. La base di tutto quello che viene dopo."
        },
        {
          "title": "Floorwork",
          "text": "Con le ginocchiere (la prima volta bastano leggings lunghi): discese, scivolate, risalite da terra. Con calma, un passaggio per volta, senza saltare niente."
        },
        {
          "title": "Coreografia",
          "text": "Una frase di trenta, quaranta secondi. Prima contata, poi in musica, poi ballata in piccoli gruppi. Sbagliare fa parte del programma."
        },
        {
          "title": "Stretching e domande",
          "text": "Si torna a terra, si allunga, si fanno domande. Ti dico com’è andata e cosa portare la volta dopo."
        }
      ],
      "reassurance": "Non serve saper ballare. Non servono nemmeno le scarpe con il tacco: la prima volta vanno bene sneaker pulite o calzini. Se hai un tacco basso e spesso con il cinturino, portalo."
    },
    "about": {
      "eyebrow": "Kristina",
      "headline": "Chi ti aspetta in sala.",
      "paragraphs": [
        "Sono nata in Russia e vivo a Milano. [TODO: formazione di Kristina: dove ha studiato danza, con chi, in quali stili]. Insegno heels dance perché è la disciplina in cui tecnica e presenza si incontrano, e perché è quella in cui ho imparato di più.",
        "Le mie lezioni partono dalla camminata, perché chi cammina bene balla meglio, e finiscono con una coreografia, perché è lì che si vede se hai ascoltato. Correggo molto, spiego di più. [TODO: percorso di Kristina come ballerina e insegnante, in una o due frasi]."
      ],
      "highlights": [
        {
          "label": "Formazione",
          "value": "[TODO]"
        },
        {
          "label": "Stili",
          "value": "[TODO]"
        },
        {
          "label": "Lingue della lezione",
          "value": "[TODO]"
        }
      ],
      "quote": "Si parte dal piede, si arriva allo sguardo."
    },
    "schedule": {
      "eyebrow": "Orari",
      "headline": "Quando.",
      "note": "Orari di esempio, in aggiornamento: il calendario definitivo ti arriva con la conferma su WhatsApp. Posti limitati, prenotazione obbligatoria.",
      "items": [
        {
          "day": "Martedì",
          "time": "19:00–20:00",
          "class": "Fondamenta",
          "level": "Base"
        },
        {
          "day": "Martedì",
          "time": "20:15–21:15",
          "class": "Open",
          "level": "Tutti i livelli"
        },
        {
          "day": "Giovedì",
          "time": "19:30–20:30",
          "class": "Coreografia",
          "level": "Intermedio"
        },
        {
          "day": "Sabato",
          "time": "11:00–12:00",
          "class": "Open",
          "level": "Tutti i livelli"
        },
        {
          "day": "Su appuntamento",
          "time": "Da concordare",
          "class": "Privata",
          "level": "Su misura"
        }
      ]
    },
    "pricing": {
      "eyebrow": "Prezzi",
      "headline": "Quanto.",
      "note": "Prezzi indicativi, in via di definizione. Le cifre definitive te le confermo su WhatsApp prima della tua prima lezione.",
      "items": [
        {
          "name": "Lezione di prova",
          "price": "15 €",
          "detail": "Una lezione, qualsiasi livello. Vale una volta sola.",
          "featured": false
        },
        {
          "name": "Lezione singola",
          "price": "22 €",
          "detail": "Quando vuoi, senza vincoli. Prenota entro il giorno prima.",
          "featured": false
        },
        {
          "name": "Carnet 5 lezioni",
          "price": "100 €",
          "detail": "20 € a lezione. Validità 2 mesi.",
          "featured": false
        },
        {
          "name": "Carnet 10 lezioni",
          "price": "180 €",
          "detail": "18 € a lezione. Validità 4 mesi.",
          "featured": true
        },
        {
          "name": "Mensile",
          "price": "75 €",
          "detail": "Una lezione a settimana, quattro al mese, stesso corso.",
          "featured": false
        }
      ],
      "footnote": "[TODO: Metodi di pagamento: contanti, bonifico, altro.] [TODO: Eventuale tessera associativa e certificato medico: dipende dall’inquadramento dell’attività.] Le lezioni private hanno un prezzo a parte, su richiesta."
    },
    "location": {
      "eyebrow": "Dove",
      "headline": "Brera, Milano.",
      "paragraphs": [
        "Le lezioni si tengono in una sala del quartiere di Brera, tra le vie acciottolate, le gallerie e i cortili dell’Accademia. Una Milano più lenta, dove si cammina: il posto giusto per imparare a farlo sui tacchi.",
        "L’indirizzo esatto ti arriva alla prenotazione, insieme all’orario e a cosa portare. Lo spazio non è una scuola con l’insegna: è una sala che, per il tempo della lezione, diventa nostra."
      ],
      "address_label": "[TODO: nome e indirizzo dello spazio]",
      "address_note": "L’indirizzo esatto viene comunicato alla prenotazione.",
      "directions": [
        "Metro: Lanza M2, Cairoli M1, Montenapoleone M3. Da nord, Moscova M2 e poi corso Garibaldi. [TODO: verificare le fermate una volta noto l’indirizzo della sala]",
        "Tram e bus fermano in via Cusani e in via Pontaccio: verifica le linee su atm.it, i percorsi cambiano con i cantieri. [TODO: verificare le vie delle fermate con l’indirizzo definitivo]",
        "In auto no: Brera è dentro Area C e i parcheggi sono pochi. In bici o con BikeMi sì."
      ],
      "maps_cta": "Apri in Google Maps"
    },
    "gallery": {
      "eyebrow": "La parete",
      "headline": "Studio, Brera.",
      "note": "Primi scatti in sala. Altre foto e un video in arrivo."
    },
    "testimonials": {
      "eyebrow": "Voci",
      "headline": "Voci dalla sala.",
      "placeholder_note": "Nota interna, non pubblica: questa sezione resta nascosta finché non ci sono recensioni vere, scritte da persone reali e autorizzate alla pubblicazione. Nessuna testimonianza inventata, nessun nome di fantasia."
    },
    "faq": {
      "eyebrow": "Domande",
      "headline": "Prima di venire.",
      "items": [
        {
          "q": "Non ho mai ballato. Posso venire?",
          "a": "Sì. Fondamenta e Open partono dalla camminata, non dalla coreografia. Non serve saper ballare. Serve voler provare."
        },
        {
          "q": "Che scarpe servono?",
          "a": "Per iniziare: tacco spesso o a blocco, 5–7 centimetri, con cinturino alla caviglia o allacciatura, suola sottile con un po’ di aderenza. Per ora meglio evitare tacchi a spillo e plateau molto alti, e lascia a casa le scarpe da sera: non sono fatte per muoversi. Ai tacchi alti e alle scarpe da danza vere e proprie si arriva dopo, quando la camminata è a posto. Se non hai ancora un paio adatto, vieni in sneaker o in calzini e lo compri dopo la prima lezione, quando sai cosa cercare."
        },
        {
          "q": "Le ginocchiere servono davvero?",
          "a": "Sì. Nel floorwork si sta in ginocchio, si scivola, si rotola. Consiglio ginocchiere da danza sottili, non quelle da pallavolo. Per la prima lezione bastano leggings lunghi che coprono il ginocchio."
        },
        {
          "q": "Cosa mi metto?",
          "a": "Qualcosa di aderente: leggings, shorts, body, top. Devo vedere le linee del corpo per correggerle. Evita i pantaloni larghi (il tacco ci resta impigliato), i gioielli ingombranti e le creme o gli oli sulla pelle prima della lezione. In borsa: scarpe, ginocchiere, acqua, un asciugamano."
        },
        {
          "q": "È solo per donne?",
          "a": "No. L’heels dance è per chiunque voglia salire sui tacchi: donne, uomini, persone di ogni genere, età e corpo. [TODO: confermare con Kristina se citare coreografi come Yanis Marshall o i Kazaky, che hanno portato gli uomini sui tacchi davanti al pubblico di mezzo mondo.] In sala conta la camminata, non l’anagrafe."
        },
        {
          "q": "Ho paura di cadere.",
          "a": "È normale, e si lavora proprio su questo. Si parte con un tacco basso e spesso, ci si scalda senza scarpe, si rinforzano gambe e caviglie. Nessuno ti chiede un tacco da dodici centimetri. Prima si impara a stare, poi a camminare, poi a ballare."
        },
        {
          "q": "Devo essere sensuale?",
          "a": "No. La sensualità, se arriva, è una conseguenza della tecnica, non un compito. In sala si lavora sul peso, sul core, sulle linee, sullo sguardo. Il resto viene da sé, e quanto mostrarne lo decidi tu."
        },
        {
          "q": "In che lingua è la lezione?",
          "a": "In italiano. Parlo anche inglese e russo e, quando serve, spiego nella lingua di chi ho davanti [TODO: confermare le lingue della lezione]. Se preferisci, scrivimi nella tua lingua: rispondo in tutte e tre."
        },
        {
          "q": "Come prenoto, e se non posso venire?",
          "a": "Scrivimi su WhatsApp: ti confermo posto, orario e indirizzo. I posti sono limitati, la prenotazione è obbligatoria. Se non puoi venire, avvisami il prima possibile [TODO: indicare le ore di preavviso richieste]. [TODO: politica di recupero della lezione, da concordare con Kristina]"
        },
        {
          "q": "Serve un certificato medico?",
          "a": "Dipende da com’è organizzata l’attività [TODO: libera professione o associazione sportiva]. Ti dico tutto alla prenotazione. In ogni caso, se hai avuto infortuni alle caviglie, alle ginocchia o alle anche, o se sei in gravidanza, parlane prima con il tuo medico e poi con me."
        }
      ]
    },
    "contact": {
      "eyebrow": "Prenota",
      "headline": "Vieni a provare.",
      "text": "Un messaggio, e ti rispondo con posto, orario e indirizzo. Dimmi come ti chiami e se hai già ballato: il resto lo vediamo in sala.",
      "whatsapp_cta": "Scrivimi su WhatsApp",
      "whatsapp_prefilled": "Ciao Kristina, ho visto il sito e vorrei provare una lezione di heels dance a Brera. Mi chiamo [nome], livello [principiante/intermedio]. Quando posso venire?",
      "instagram_cta": "Seguimi su Instagram",
      "email_cta": "Scrivimi un’email [TODO: confermare se Kristina vuole pubblicare un indirizzo email; altrimenti rimuovere il pulsante]",
      "response_note": "Rispondo di solito entro un giorno [TODO: confermare i tempi di risposta]. Durante le lezioni il telefono resta in borsa."
    },
    "footer": {
      "tagline": "Heels dance a Brera, Milano. Tecnica. Presenza. Musicalità.",
      "legal": "© 2026 Kristina · Heels dance · Brera, Milano [TODO: · P.IVA / C.F.]",
      "privacy": "Questo sito non usa cookie, non ha moduli, non traccia le visite e non carica risorse da terze parti: le prenotazioni avvengono su WhatsApp e Instagram, secondo le rispettive informative.",
      "credits": "Sito fatto a mano a Milano."
    },
    "ui": {
      "lang_switch_label": "Lingua",
      "menu_open": "Menu",
      "menu_close": "Chiudi",
      "example_badge": "Esempio, non definitivo",
      "back_to_top": "Torna su",
      "skip_link": "Vai al contenuto",
      "photo_placeholder": "Foto in arrivo",
      "video_placeholder": "Video in arrivo",
      "nav_main": "Menu principale",
      "nav_footer": "Menu del piè di pagina",
      "gallery_label": "Galleria",
      "col_day": "Giorno",
      "col_time": "Ora",
      "col_class": "Lezione",
      "col_level": "Livello",
      "col_plan": "Formula",
      "col_price": "Prezzo",
      "end": "fine",
      "widget_label": "Scrivi a Kristina",
      "widget_open": "Scrivi a Kristina",
      "widget_close": "Chiudi",
      "widget_whatsapp": "WhatsApp",
      "widget_telegram": "Telegram",
      "widget_note": "Ti risponde Kristina"
    },
    "photos": {
      "cap01": "Kristina — In sala",
      "cap02": "Kristina — Ritratto",
      "alt02": "Kristina, ritratto a mezza figura in luce calda",
      "cap04": "Dettaglio — Tacchi e ginocchiere",
      "cap05": "In sala — La camminata",
      "cap06": "Dettaglio — La posa",
      "cap08": "Brera · Milano",
      "alt01": "Kristina in posa sui tacchi durante una lezione di heels dance",
      "alt04": "Stivaletti col tacco e ginocchiere sul parquet, durante la camminata",
      "alt05": "Gambe sui tacchi durante la camminata, sul parquet della sala",
      "alt06": "Dettaglio della posa, mano sul fianco, senza volto",
      "alt08": "Pianta astratta del quartiere di Brera"
    }
  },
  "en": {
    "meta": {
      "title": "Heels dance in Brera, Milan · Classes with Kristina",
      "description": "Heels dance classes in Milan, Brera: posture, walks, floorwork and choreography in heels. Complete beginners welcome. Book on WhatsApp.",
      "og_title": "In heels, with attitude. Heels dance in Brera, Milan",
      "og_description": "Heels dance classes with Kristina in Milan, Brera. Technique. Presence. Musicality. Complete beginners welcome. Book on WhatsApp."
    },
    "nav": {
      "classes": "Classes",
      "first_class": "First time",
      "about": "Kristina",
      "schedule": "Schedule",
      "pricing": "Prices",
      "location": "Where",
      "faq": "FAQ",
      "contact": "Contact",
      "book": "Book"
    },
    "hero": {
      "eyebrow": "Heels dance · Milan, Brera",
      "headline_line1": "In heels,",
      "headline_line2": "with attitude.",
      "subheadline": "Heels dance classes with Kristina, in the art gallery district. Technique. Presence. Musicality. You don’t need to know how to dance. You just need to want to try.",
      "cta_primary": "Message me on WhatsApp",
      "cta_secondary": "Come try a class",
      "marquee": [
        "Heels dance",
        "Brera · Milan",
        "Technique · Presence · Musicality",
        "All levels, all bodies",
        "IT · EN · RU"
      ],
      "scroll_hint": "Scroll"
    },
    "manifesto": {
      "eyebrow": "Manifesto",
      "headline": "You don’t wear heels. You inhabit them.",
      "paragraphs": [
        "In heels, the body finds a new axis. The weight shifts forward, the spine lengthens, the gaze lifts. That is where heels dance begins: with a walk, then a pose, then a phrase of music. It starts at the feet and ends in the eyes.",
        "It isn’t a dance born in one place. It comes from jazz and music videos, from vogue and waacking, from the Harlem ballroom scene and the clubs of Los Angeles, from burlesque and contemporary. In the studio, all that history comes down to something simple: keeping time, taking up space, deciding where to look. Sensuality isn’t the goal. It’s what’s left once the technique is right."
      ],
      "pillars": [
        {
          "title": "Technique",
          "text": "Posture, weight placement, alignment. Learning to stand in heels before you move, and to move before you dance. The walk always comes before the choreography."
        },
        {
          "title": "Presence",
          "text": "Taking up space. Holding the gaze. Deciding every gesture, even the ones that seem not to matter. In the studio, it’s not about how much you can do. It’s about whether you’re there."
        },
        {
          "title": "Musicality",
          "text": "Listening before counting. Every phrase of music has a weight, an accent, a breath: the body follows them and makes them visible."
        }
      ]
    },
    "classes": {
      "eyebrow": "Classes",
      "headline": "One technique, four formats.",
      "intro": "Every class runs 60 minutes [TODO: confirm duration with Kristina] and follows the same structure: warm-up without heels, technique, floorwork, choreography, stretching. The level changes, the pace changes, the attention doesn’t. Classes are taught in Italian; when needed, I explain in English or Russian [TODO: confirm class languages].",
      "items": [
        {
          "name": "Foundations",
          "level": "Beginner",
          "duration": "60 min [TODO: confirm]",
          "description": "For anyone who has never danced in heels, or never danced at all. Posture, foot placement, slow and fast walks, bevel, first isolations. To finish, a short choreographic phrase: counted first, then to music.",
          "tags": [
            "Complete beginners",
            "5–7 cm heel"
          ]
        },
        {
          "name": "Open",
          "level": "All levels",
          "duration": "60 min [TODO: confirm]",
          "description": "One open-level class for those just starting and those who already dance. Walking technique, floorwork with knee pads, a new combination every week. Everyone takes it to their own level: same steps, different intensity.",
          "tags": [
            "No prerequisites",
            "Every week"
          ]
        },
        {
          "name": "Choreography",
          "level": "Intermediate",
          "duration": "60 min [TODO: confirm]",
          "description": "For those who already have the foundations and want the detail: texture, dynamics, hair whips, changes of direction, full floorwork. A faster pace, and a piece of choreography that builds over several classes until it’s danced from start to finish.",
          "tags": [
            "After Foundations",
            "Limited spots"
          ]
        },
        {
          "name": "Private",
          "level": "Tailored",
          "duration": "60 min [TODO: confirm]",
          "description": "One-on-one, or as a pair. One clear goal: fixing your walk, preparing a video, getting over the fear of falling. Time and place by arrangement.",
          "tags": [
            "1:1 or in pairs",
            "By appointment"
          ]
        }
      ]
    },
    "first_class": {
      "eyebrow": "Your first time",
      "headline": "How your first class works.",
      "intro": "One hour [TODO: confirm duration], five parts. You arrive, you change, and the rest we do together.",
      "steps": [
        {
          "title": "Arrival and warm-up",
          "text": "Come ten minutes early to change and settle in. We start without heels, in socks or barefoot: ankle, hip and spine mobility, core activation."
        },
        {
          "title": "Technique",
          "text": "Shoes on. Posture, weight on the ball of the foot, knee alignment, bevel, slow and fast walks. The base for everything that follows."
        },
        {
          "title": "Floorwork",
          "text": "With knee pads (for your first class, long leggings are enough): getting down to the floor, slides, getting back up. Calmly, one step at a time, skipping nothing."
        },
        {
          "title": "Choreography",
          "text": "A thirty- to forty-second phrase. Counted first, then to music, then danced in small groups. Getting it wrong is part of the plan."
        },
        {
          "title": "Stretching and questions",
          "text": "Back down to the floor to stretch and ask questions. I’ll tell you how it went and what to bring next time."
        }
      ],
      "reassurance": "You don’t need to know how to dance. You don’t even need heels: for your first class, clean sneakers or socks are fine. If you have a pair of low, chunky heels with an ankle strap, bring them."
    },
    "about": {
      "eyebrow": "Kristina",
      "headline": "Who’s waiting for you in the studio.",
      "paragraphs": [
        "I was born in Russia and live in Milan. [TODO: Kristina’s training: where she studied dance, with whom, in which styles]. I teach heels dance because it’s the discipline where technique and presence meet, and because it’s the one that has taught me the most.",
        "My classes start with the walk, because if you walk well, you dance better, and end with choreography, because that’s where it shows whether you’ve been listening. I correct a lot, and explain even more. [TODO: Kristina’s path as a dancer and teacher, in one or two sentences]."
      ],
      "highlights": [
        {
          "label": "Training",
          "value": "[TODO]"
        },
        {
          "label": "Styles",
          "value": "[TODO]"
        },
        {
          "label": "Class languages",
          "value": "[TODO]"
        }
      ],
      "quote": "It starts at the feet and ends in the eyes."
    },
    "schedule": {
      "eyebrow": "Schedule",
      "headline": "When.",
      "note": "Sample schedule, still being finalised: the final timetable comes with your WhatsApp confirmation. Limited spots, booking required.",
      "items": [
        {
          "day": "Tuesday",
          "time": "19:00–20:00",
          "class": "Foundations",
          "level": "Beginner"
        },
        {
          "day": "Tuesday",
          "time": "20:15–21:15",
          "class": "Open",
          "level": "All levels"
        },
        {
          "day": "Thursday",
          "time": "19:30–20:30",
          "class": "Choreography",
          "level": "Intermediate"
        },
        {
          "day": "Saturday",
          "time": "11:00–12:00",
          "class": "Open",
          "level": "All levels"
        },
        {
          "day": "By appointment",
          "time": "To be arranged",
          "class": "Private",
          "level": "Tailored"
        }
      ]
    },
    "pricing": {
      "eyebrow": "Prices",
      "headline": "How much.",
      "note": "Indicative prices, still being finalised. I’ll confirm the final figures on WhatsApp before your first class.",
      "items": [
        {
          "name": "Trial class",
          "price": "€15",
          "detail": "One class, any level. Valid once only.",
          "featured": false
        },
        {
          "name": "Single class",
          "price": "€22",
          "detail": "Whenever you like, no commitment. Book by the day before.",
          "featured": false
        },
        {
          "name": "5-class pass",
          "price": "€100",
          "detail": "€20 per class. Valid for 2 months.",
          "featured": false
        },
        {
          "name": "10-class pass",
          "price": "€180",
          "detail": "€18 per class. Valid for 4 months.",
          "featured": true
        },
        {
          "name": "Monthly pass",
          "price": "€75",
          "detail": "One class a week, four a month, same class.",
          "featured": false
        }
      ],
      "footnote": "[TODO: Payment methods: cash, bank transfer, other.] [TODO: Membership card and medical certificate, if required: depends on how the activity is set up.] Private classes are priced separately, on request."
    },
    "location": {
      "eyebrow": "Where",
      "headline": "Brera, Milan.",
      "paragraphs": [
        "Classes take place in a studio in the Brera district, among the cobbled streets, the art galleries and the courtyards of the Accademia. A slower Milan, a Milan you walk through: the right place to learn how to do it in heels.",
        "You’ll get the exact address when you book, along with the time and what to bring. The space isn’t a school with a sign over the door: it’s a studio that, for the length of the class, becomes ours."
      ],
      "address_label": "[TODO: name and address of the space]",
      "address_note": "The exact address is shared when you book.",
      "directions": [
        "Metro: Lanza M2, Cairoli M1, Montenapoleone M3. Coming from the north, Moscova M2 and then along corso Garibaldi. [TODO: check the stops once the studio address is known]",
        "Trams and buses stop on via Cusani and via Pontaccio: check the lines on atm.it, as routes change with roadworks. [TODO: check the stop streets against the final address]",
        "Not by car: Brera is inside Area C and parking is scarce. By bike or BikeMi, yes."
      ],
      "maps_cta": "Open in Google Maps"
    },
    "gallery": {
      "eyebrow": "The wall",
      "headline": "Studio, Brera.",
      "note": "First shots from the studio. More photos and a video coming soon."
    },
    "testimonials": {
      "eyebrow": "Voices",
      "headline": "Voices from the studio.",
      "placeholder_note": "Internal note, not public: this section stays hidden until there are real reviews, written by real people who have authorised publication. No invented testimonials, no made-up names."
    },
    "faq": {
      "eyebrow": "FAQ",
      "headline": "Before you come.",
      "items": [
        {
          "q": "I’ve never danced. Can I come?",
          "a": "Yes. Foundations and Open start with the walk, not the choreography. You don’t need to know how to dance. You just need to want to try."
        },
        {
          "q": "What shoes do I need?",
          "a": "To start: a chunky or block heel, 5–7 centimetres, with an ankle strap or laces, and a thin sole with a bit of grip. For now, avoid stilettos and very high platforms, and leave your going-out shoes at home: they’re not made for moving in. Higher heels and proper dance shoes come later, once your walk is right. If you don’t have a suitable pair yet, come in sneakers or socks and buy them after your first class, when you know what to look for."
        },
        {
          "q": "Do I really need knee pads?",
          "a": "Yes. In floorwork you kneel, slide and roll. I recommend thin dance knee pads, not volleyball ones. For your first class, long leggings that cover the knee are enough."
        },
        {
          "q": "What do I wear?",
          "a": "Something fitted: leggings, shorts, a bodysuit, a top. I need to see the lines of your body to correct them. Avoid wide-leg trousers (heels get caught in them), bulky jewellery, and lotions or oils on your skin before class. In your bag: shoes, knee pads, water, a towel."
        },
        {
          "q": "Is it only for women?",
          "a": "No. Heels dance is for anyone who wants to step into heels: women, men, people of every gender, age and body. [TODO: confirm with Kristina whether to mention choreographers such as Yanis Marshall or Kazaky, who have put men in heels in front of audiences around the world.] In the studio, it’s the walk that counts, not what’s on your ID."
        },
        {
          "q": "I’m afraid of falling.",
          "a": "That’s normal, and it’s exactly what we work on. You start with a low, chunky heel, warm up without shoes, and strengthen your legs and ankles. No one is asking you for a twelve-centimetre heel. First you learn to stand, then to walk, then to dance."
        },
        {
          "q": "Do I have to be sensual?",
          "a": "No. Sensuality, if it comes, is a consequence of technique, not the goal. In the studio we work on weight, core, lines, gaze. The rest comes on its own, and how much of it you show is up to you."
        },
        {
          "q": "What language is the class in?",
          "a": "Italian. I also speak English and Russian and, when needed, I explain in the language of whoever is in front of me [TODO: confirm class languages]. If you prefer, message me in your own language: I reply in all three."
        },
        {
          "q": "How do I book, and what if I can’t make it?",
          "a": "Message me on WhatsApp: I’ll confirm your spot, the time and the address. Spots are limited and booking is required. If you can’t make it, let me know as early as possible [TODO: hours of notice required]. [TODO: make-up class policy, to be agreed with Kristina]"
        },
        {
          "q": "Do I need a medical certificate?",
          "a": "It depends on how the activity is set up [TODO: freelance or sports association]. I’ll tell you everything when you book. Either way, if you’ve had ankle, knee or hip injuries, or if you’re pregnant, talk to your doctor first, then to me."
        }
      ]
    },
    "contact": {
      "eyebrow": "Book",
      "headline": "Come try a class.",
      "text": "One message, and I’ll reply with your spot, the time and the address. Tell me your name and whether you’ve danced before: the rest we’ll sort out in the studio.",
      "whatsapp_cta": "Message me on WhatsApp",
      "whatsapp_prefilled": "Hi Kristina, I found your website and I’d like to try a heels dance class in Brera. My name is [name], level [beginner/intermediate]. When can I come?",
      "instagram_cta": "Follow me on Instagram",
      "email_cta": "Send me an email [TODO: confirm whether Kristina wants to publish an email address; otherwise remove the button]",
      "response_note": "I usually reply within a day [TODO: confirm response times]. During classes, my phone stays in my bag."
    },
    "footer": {
      "tagline": "Heels dance in Brera, Milan. Technique. Presence. Musicality.",
      "legal": "© 2026 Kristina · Heels dance · Brera, Milan [TODO: · VAT number / tax code]",
      "privacy": "This site uses no cookies, has no forms, doesn’t track visits and loads no third-party resources: bookings happen on WhatsApp and Instagram, under their respective privacy policies.",
      "credits": "Handmade in Milan."
    },
    "ui": {
      "lang_switch_label": "Language",
      "menu_open": "Menu",
      "menu_close": "Close",
      "example_badge": "Sample, not final",
      "back_to_top": "Back to top",
      "skip_link": "Skip to content",
      "photo_placeholder": "Photo coming soon",
      "video_placeholder": "Video coming soon",
      "nav_main": "Main menu",
      "nav_footer": "Footer menu",
      "gallery_label": "Gallery",
      "col_day": "Day",
      "col_time": "Time",
      "col_class": "Class",
      "col_level": "Level",
      "col_plan": "Plan",
      "col_price": "Price",
      "end": "the end",
      "widget_label": "Message Kristina",
      "widget_open": "Message Kristina",
      "widget_close": "Close",
      "widget_whatsapp": "WhatsApp",
      "widget_telegram": "Telegram",
      "widget_note": "Kristina answers you"
    },
    "photos": {
      "cap01": "Kristina — In the studio",
      "cap02": "Kristina — Portrait",
      "alt02": "Kristina, half-length portrait in warm light",
      "cap04": "Detail — Heels and knee pads",
      "cap05": "In the studio — The walk",
      "cap06": "Detail — The pose",
      "cap08": "Brera · Milan",
      "alt01": "Kristina posing in heels during a heels dance class",
      "alt04": "Heeled ankle boots and knee pads on the wooden floor, during the walk",
      "alt05": "Legs in heels during the walk, on the studio floor",
      "alt06": "Close-up of the pose, hand on the hip, face not visible",
      "alt08": "Abstract map of the Brera district"
    }
  },
  "ru": {
    "meta": {
      "title": "Heels dance в Брере, Милан · Занятия с Кристиной",
      "description": "Занятия heels dance в Милане, район Брера: осанка, походка, партер и хореография на каблуках. Можно начать с нуля. Запись в WhatsApp.",
      "og_title": "На каблуках, с характером. Heels dance в Брере, Милан",
      "og_description": "Занятия heels dance с Кристиной в Милане, район Брера. Техника. Присутствие. Музыкальность. Можно начать с нуля. Запись в WhatsApp."
    },
    "nav": {
      "classes": "Занятия",
      "first_class": "Первый раз",
      "about": "Кристина",
      "schedule": "Расписание",
      "pricing": "Цены",
      "location": "Где",
      "faq": "Вопросы",
      "contact": "Контакты",
      "book": "Записаться"
    },
    "hero": {
      "eyebrow": "Heels dance · Милан, Брера",
      "headline_line1": "На каблуках,",
      "headline_line2": "с характером.",
      "subheadline": "Занятия heels dance с Кристиной в квартале галерей. Техника. Присутствие. Музыкальность. Уметь танцевать не нужно. Нужно захотеть попробовать.",
      "cta_primary": "Написать в WhatsApp",
      "cta_secondary": "Прийти попробовать",
      "marquee": [
        "Heels dance",
        "Брера · Милан",
        "Техника · Присутствие · Музыкальность",
        "Все уровни, любое тело",
        "IT · EN · RU"
      ],
      "scroll_hint": "Листайте"
    },
    "manifesto": {
      "eyebrow": "Манифест",
      "headline": "Каблуки не носят — в них живут.",
      "paragraphs": [
        "На каблуках у тела меняется ось. Вес уходит вперёд, спина вытягивается, взгляд поднимается. Heels dance начинается отсюда: с походки, потом с позы, потом с музыкальной фразы. От стопы — к взгляду.",
        "Этот танец родился не в одном месте. Его корни — в джазе и видеоклипах, в воге и вакинге, в болрум-сцене Гарлема и клубах Лос-Анджелеса, в бурлеске и контемпорари. В зале вся эта история превращается во что-то простое: держать ритм, занимать пространство, решать, куда смотреть. Чувственность — не задача. Это то, что остаётся, когда техника поставлена."
      ],
      "pillars": [
        {
          "title": "Техника",
          "text": "Осанка, опора, выстраивание линий. Научиться стоять на каблуках, потом двигаться и только потом танцевать. Сначала походка, потом хореография — всегда."
        },
        {
          "title": "Присутствие",
          "text": "Занимать пространство. Держать взгляд. Осознанно делать каждый жест — даже тот, что кажется неважным. В зале важно не то, сколько вы умеете. Важно, здесь ли вы."
        },
        {
          "title": "Музыкальность",
          "text": "Слушать раньше, чем считать. У каждой музыкальной фразы есть вес, акцент, дыхание: тело следует за ними и делает их видимыми."
        }
      ]
    },
    "classes": {
      "eyebrow": "Занятия",
      "headline": "Одна техника, четыре формата.",
      "intro": "Каждое занятие длится 60 минут [TODO: уточнить длительность у Кристины] и построено одинаково: разминка без каблуков, техника, партер, хореография, растяжка. Меняется уровень, меняется темп — не меняется внимание к каждому. Занятие идёт на итальянском; когда нужно, объясняю по-английски или по-русски [TODO: уточнить языки занятия].",
      "items": [
        {
          "name": "Основы",
          "level": "Базовый",
          "duration": "60 мин [TODO: уточнить]",
          "description": "Для тех, кто никогда не выходил в зал на каблуках — или никогда не танцевал. Осанка, постановка стопы, медленная и быстрая походка, бевел, первые изоляции. В конце — короткая хореографическая фраза: сначала под счёт, потом под музыку.",
          "tags": [
            "С абсолютного нуля",
            "Каблук 5–7 см"
          ]
        },
        {
          "name": "Open",
          "level": "Все уровни",
          "duration": "60 мин [TODO: уточнить]",
          "description": "Одно занятие и для тех, кто только начинает, и для тех, кто уже танцует. Техника походки, партер в наколенниках, новая связка каждую неделю. Каждый делает её на своём уровне: те же шаги, разная интенсивность.",
          "tags": [
            "Без подготовки",
            "Каждую неделю"
          ]
        },
        {
          "name": "Хореография",
          "level": "Средний",
          "duration": "60 мин [TODO: уточнить]",
          "description": "Для тех, у кого уже есть база и кому нужны детали: текстуры, динамика, hair whip, смены направления, полный партер. Темп выше, хореография растёт от занятия к занятию, пока вы не станцуете её целиком.",
          "tags": [
            "После «Основ»",
            "Мест немного"
          ]
        },
        {
          "name": "Индивидуальное",
          "level": "Под ваши цели",
          "duration": "60 мин [TODO: уточнить]",
          "description": "Один на один или вдвоём. Одна конкретная цель: поправить походку, подготовить видео, снять страх упасть. Время и место — по договорённости.",
          "tags": [
            "1:1 или в паре",
            "По записи"
          ]
        }
      ]
    },
    "first_class": {
      "eyebrow": "Первый раз",
      "headline": "Как проходит первое занятие.",
      "intro": "Час [TODO: уточнить длительность], пять частей. Вы приходите, переодеваетесь — остальное делаем вместе.",
      "steps": [
        {
          "title": "Начало и разминка",
          "text": "Приходите за десять минут — переодеться и освоиться. Начинаем без каблуков, в носках или босиком: подвижность голеностопа, тазобедренных суставов и позвоночника, включение кора."
        },
        {
          "title": "Техника",
          "text": "Надеваем туфли. Осанка, вес на передней части стопы, положение колена, бевел, медленная и быстрая походка. База всего, что будет дальше."
        },
        {
          "title": "Партер",
          "text": "В наколенниках (в первый раз хватит длинных леггинсов): спуски на пол, скольжения, подъёмы. Спокойно, по одному элементу, ничего не пропуская."
        },
        {
          "title": "Хореография",
          "text": "Фраза на тридцать-сорок секунд. Сначала под счёт, потом под музыку, потом — маленькими группами. Ошибаться — часть программы."
        },
        {
          "title": "Растяжка и вопросы",
          "text": "Возвращаемся на пол, тянемся, разбираем вопросы. Я расскажу, как всё прошло и что взять с собой в следующий раз."
        }
      ],
      "reassurance": "Уметь танцевать не нужно. Даже туфли на каблуке не нужны: в первый раз подойдут чистые кроссовки или носки. Если есть туфли на невысоком устойчивом каблуке с ремешком — возьмите их с собой."
    },
    "about": {
      "eyebrow": "Кристина",
      "headline": "Кто ждёт вас в зале.",
      "paragraphs": [
        "Я родилась в России и живу в Милане. [TODO: образование Кристины: где училась танцу, у кого, в каких стилях]. Я преподаю heels dance, потому что это направление, где встречаются техника и присутствие, — и потому что именно оно дало мне больше всего.",
        "Мои занятия начинаются с походки, потому что тот, кто хорошо ходит, и танцует лучше, и заканчиваются хореографией, потому что именно там видно, слушали ли вы. Я много исправляю и ещё больше объясняю. [TODO: путь Кристины как танцовщицы и преподавателя, в одном-двух предложениях]."
      ],
      "highlights": [
        {
          "label": "Образование",
          "value": "[TODO]"
        },
        {
          "label": "Стили",
          "value": "[TODO]"
        },
        {
          "label": "Языки занятия",
          "value": "[TODO]"
        }
      ],
      "quote": "От стопы — к взгляду."
    },
    "schedule": {
      "eyebrow": "Расписание",
      "headline": "Когда.",
      "note": "Расписание примерное, ещё уточняется: окончательный календарь вы получите вместе с подтверждением в WhatsApp. Мест немного, запись обязательна.",
      "items": [
        {
          "day": "Вторник",
          "time": "19:00–20:00",
          "class": "Основы",
          "level": "Базовый"
        },
        {
          "day": "Вторник",
          "time": "20:15–21:15",
          "class": "Open",
          "level": "Все уровни"
        },
        {
          "day": "Четверг",
          "time": "19:30–20:30",
          "class": "Хореография",
          "level": "Средний"
        },
        {
          "day": "Суббота",
          "time": "11:00–12:00",
          "class": "Open",
          "level": "Все уровни"
        },
        {
          "day": "По записи",
          "time": "По договорённости",
          "class": "Индивидуальное",
          "level": "Под ваши цели"
        }
      ]
    },
    "pricing": {
      "eyebrow": "Цены",
      "headline": "Сколько.",
      "note": "Цены ориентировочные, ещё уточняются. Окончательные суммы подтвержу в WhatsApp перед вашим первым занятием.",
      "items": [
        {
          "name": "Пробное занятие",
          "price": "15 €",
          "detail": "Одно занятие, любой уровень. Действует один раз.",
          "featured": false
        },
        {
          "name": "Разовое занятие",
          "price": "22 €",
          "detail": "Когда хотите, без обязательств. Запись не позднее чем за день.",
          "featured": false
        },
        {
          "name": "Абонемент на 5 занятий",
          "price": "100 €",
          "detail": "20 € за занятие. Действует 2 месяца.",
          "featured": false
        },
        {
          "name": "Абонемент на 10 занятий",
          "price": "180 €",
          "detail": "18 € за занятие. Действует 4 месяца.",
          "featured": true
        },
        {
          "name": "Месячный абонемент",
          "price": "75 €",
          "detail": "Одно занятие в неделю, четыре в месяц, одна и та же группа.",
          "featured": false
        }
      ],
      "footnote": "[TODO: Способы оплаты: наличные, перевод, другое.] [TODO: Членская карта и медицинская справка, если потребуются: зависит от правовой формы деятельности.] Индивидуальные занятия оплачиваются отдельно, цена по запросу."
    },
    "location": {
      "eyebrow": "Где",
      "headline": "Брера, Милан.",
      "paragraphs": [
        "Занятия проходят в зале в квартале Брера — среди мощёных улочек, галерей и двориков Академии. Другой, неспешный Милан, где ходят пешком: самое подходящее место, чтобы научиться делать это на каблуках.",
        "Точный адрес вы получите при записи — вместе со временем и списком того, что взять с собой. Это не школа с вывеской: это зал, который на время занятия становится нашим."
      ],
      "address_label": "[TODO: название и адрес зала]",
      "address_note": "Точный адрес сообщается при записи.",
      "directions": [
        "Метро: Lanza M2, Cairoli M1, Montenapoleone M3. С севера — Moscova M2, дальше по corso Garibaldi. [TODO: проверить станции, когда будет известен адрес зала]",
        "Трамваи и автобусы останавливаются на via Cusani и via Pontaccio: проверяйте маршруты на atm.it, из-за дорожных работ они меняются. [TODO: проверить улицы остановок по окончательному адресу]",
        "На машине — нет: Брера внутри зоны Area C, парковок мало. На велосипеде или BikeMi — да."
      ],
      "maps_cta": "Открыть в Google Maps"
    },
    "gallery": {
      "eyebrow": "Стена",
      "headline": "Студия, Брера.",
      "note": "Первые снимки из зала. Скоро ещё фотографии и видео."
    },
    "testimonials": {
      "eyebrow": "Отзывы",
      "headline": "Голоса из зала.",
      "placeholder_note": "Внутренняя заметка, не для публикации: этот раздел остаётся скрытым, пока нет настоящих отзывов, написанных реальными людьми и разрешённых к публикации. Никаких выдуманных отзывов, никаких вымышленных имён."
    },
    "faq": {
      "eyebrow": "Вопросы",
      "headline": "Перед тем как прийти.",
      "items": [
        {
          "q": "У меня нет танцевального опыта. Можно прийти?",
          "a": "Да. «Основы» и Open начинаются с походки, а не с хореографии. Уметь танцевать не нужно. Нужно захотеть попробовать."
        },
        {
          "q": "Какие туфли нужны?",
          "a": "Для начала: широкий или блочный каблук 5–7 сантиметров, ремешок на щиколотке или шнуровка, тонкая, но не скользкая подошва. Шпильки и высокие платформы пока лучше отложить, а вечерние туфли оставьте дома: они не созданы для движения. К высоким каблукам и настоящей танцевальной обуви приходят позже, когда походка поставлена. Если подходящей пары ещё нет — приходите в кроссовках или носках и купите после первого занятия, когда будете знать, что искать."
        },
        {
          "q": "Наколенники правда нужны?",
          "a": "Да. В партере вы стоите на коленях, скользите, перекатываетесь. Советую тонкие танцевальные наколенники, не волейбольные. Для первого занятия хватит длинных леггинсов, закрывающих колено."
        },
        {
          "q": "Что надеть?",
          "a": "Что-то облегающее: леггинсы, шорты, боди, топ. Мне нужно видеть линии тела, чтобы их исправлять. Избегайте широких брюк (за них цепляется каблук), объёмных украшений, а также кремов и масел на коже перед занятием. В сумке: туфли, наколенники, вода, полотенце."
        },
        {
          "q": "Это только для женщин?",
          "a": "Нет. Heels dance — для всех, кто хочет встать на каблуки: женщин, мужчин, людей любого гендера, возраста и телосложения. [TODO: уточнить у Кристины, упоминать ли хореографов, таких как Янис Маршалл или Kazaky, которые вывели мужчин на каблуках на сцену перед публикой по всему миру.] В зале важна походка, а не паспорт."
        },
        {
          "q": "Я боюсь упасть.",
          "a": "Это нормально, и именно над этим мы работаем. Начинаем с невысокого устойчивого каблука, разминаемся без обуви, укрепляем ноги и голеностоп. Никто не требует от вас каблука в двенадцать сантиметров. Сначала учимся стоять, потом ходить, потом танцевать."
        },
        {
          "q": "Чувственность обязательна?",
          "a": "Нет. Чувственность, если она приходит, — следствие техники, а не задание. В зале мы работаем над весом, кором, линиями, взглядом. Остальное приходит само — а сколько показывать, решаете вы."
        },
        {
          "q": "На каком языке занятие?",
          "a": "На итальянском. Я также говорю по-английски и по-русски и, когда нужно, объясняю на языке того, кто передо мной [TODO: уточнить языки занятия]. Если удобнее, пишите мне на своём языке: отвечаю на всех трёх."
        },
        {
          "q": "Как записаться и что делать, если я не смогу прийти?",
          "a": "Напишите мне в WhatsApp: я подтвержу место, время и адрес. Мест немного, запись обязательна. Если не сможете прийти, предупредите как можно раньше [TODO: за сколько часов предупреждать]. [TODO: правила отработки пропущенного занятия, согласовать с Кристиной]"
        },
        {
          "q": "Нужна медицинская справка?",
          "a": "Зависит от того, как оформлена деятельность [TODO: частная практика или спортивная ассоциация]. Расскажу всё при записи. В любом случае, если у вас были травмы голеностопа, коленей или тазобедренных суставов или если вы беременны, сначала поговорите со своим врачом, а потом со мной."
        }
      ]
    },
    "contact": {
      "eyebrow": "Запись",
      "headline": "Приходите попробовать.",
      "text": "Одно сообщение — и я отвечу, есть ли место, когда и куда прийти. Напишите, как вас зовут и танцевали ли раньше: остальное разберём в зале.",
      "whatsapp_cta": "Написать в WhatsApp",
      "whatsapp_prefilled": "Здравствуйте, Кристина! Пишу вам с сайта: хочу попробовать занятие heels dance в Брере. Меня зовут [имя], уровень [начинающий/средний]. Когда можно прийти?",
      "instagram_cta": "Подписаться в Instagram",
      "email_cta": "Написать на email [TODO: уточнить, хочет ли Кристина публиковать адрес электронной почты; иначе убрать кнопку]",
      "response_note": "Обычно отвечаю в течение дня [TODO: уточнить сроки ответа]. Во время занятий телефон остаётся в сумке."
    },
    "footer": {
      "tagline": "Heels dance в Брере, Милан. Техника. Присутствие. Музыкальность.",
      "legal": "© 2026 Кристина · Heels dance · Брера, Милан [TODO: · P.IVA / C.F.]",
      "privacy": "Этот сайт не использует cookie, не содержит форм, не отслеживает посещения и не загружает ресурсы со сторонних серверов: запись проходит в WhatsApp и Instagram согласно их политикам конфиденциальности.",
      "credits": "Сайт сделан вручную в Милане."
    },
    "ui": {
      "lang_switch_label": "Язык",
      "menu_open": "Меню",
      "menu_close": "Закрыть",
      "example_badge": "Пример, не окончательно",
      "back_to_top": "Наверх",
      "skip_link": "К содержанию",
      "photo_placeholder": "Здесь будет фото",
      "video_placeholder": "Здесь будет видео",
      "nav_main": "Главное меню",
      "nav_footer": "Меню в подвале",
      "gallery_label": "Галерея",
      "col_day": "День",
      "col_time": "Время",
      "col_class": "Занятие",
      "col_level": "Уровень",
      "col_plan": "Тариф",
      "col_price": "Цена",
      "end": "конец",
      "widget_label": "Написать Кристине",
      "widget_open": "Написать Кристине",
      "widget_close": "Закрыть",
      "widget_whatsapp": "WhatsApp",
      "widget_telegram": "Telegram",
      "widget_note": "Кристина ответит вам"
    },
    "photos": {
      "cap01": "Кристина — В зале",
      "cap02": "Кристина — Портрет",
      "alt02": "Кристина, поясной портрет в тёплом свете",
      "cap04": "Деталь — Каблуки и наколенники",
      "cap05": "В зале — Проходка",
      "cap06": "Деталь — Поза",
      "cap08": "Брера · Милан",
      "alt01": "Кристина в позе на каблуках во время занятия heels dance",
      "alt04": "Ботильоны на каблуке и наколенники на паркете во время проходки",
      "alt05": "Ноги на каблуках во время проходки, на паркете зала",
      "alt06": "Крупный план позы, рука на бедре, лицо не видно",
      "alt08": "Абстрактная схема квартала Брера"
    }
  }
};

/* ============================================================
   LOGICA — nessuna dipendenza esterna. Tutto quello che segue legge
   CONFIG e I18N; non c'è bisogno di modificarlo.
   ============================================================ */
(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const LANGS = ['it', 'en', 'ru'];
  const LOCALES = { it: 'it-IT', en: 'en-GB', ru: 'ru-RU' };
  const OG_LOCALES = { it: 'it_IT', en: 'en_GB', ru: 'ru_RU' };
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = mqReduce.matches;
  const isJs = root.classList.contains('js');
  let lang = CONFIG.defaultLang || 'it';

  /* ---------- utilità ---------- */
  const $ = (s, c) => (c || doc).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || doc).querySelectorAll(s));
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage non disponibile */ } }
  };
  function get(obj, path) {
    return String(path).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const TODO_RE = /\[TODO[^\]]*\]/g;

  /* Rimuove i segnaposto [TODO: …] e normalizza spazi e punteggiatura doppia. */
  function stripTodos(s) {
    return String(s)
      .replace(TODO_RE, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .replace(/([,.;!?])(?:\s*\1)+/g, '$1')
      .replace(/:\s*\./g, '.')
      .replace(/,\s*\./g, '.')
      .replace(/\(\s*\)/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /* Sostituisce la grafia del nome (latina e cirillica, con le declinazioni russe). */
  function names(s) {
    s = String(s);
    const fn = CONFIG.brand.firstName || 'Kristina';
    if (fn !== 'Kristina') s = s.replace(/\bKristina\b/g, fn);
    const cy = CONFIG.brand.firstNameCyrillic || 'Кристина';
    if (cy !== 'Кристина') {
      s = s.replace(/Кристина(?![А-Яа-яЁё])/g, cy);
      if (/а$/.test(cy)) s = s.replace(/Кристин(?=(?:ой|ы|е|у)(?![А-Яа-яЁё]))/g, cy.slice(0, -1));
    }
    return s;
  }

  /* Testo grezzo dal dizionario (con fallback all'italiano) e nome già sostituito. */
  function t(key, l) {
    const d = I18N[l || lang] || I18N.it;
    let v = get(d, key);
    if (v == null) v = get(I18N.it, key);
    if (v == null) return '';
    return names(v);
  }
  /* Testo pulito per attributi e link (mai con [TODO]). */
  function tClean(key, l) { return stripTodos(t(key, l)); }

  /* HTML sicuro: i [TODO] diventano <mark class="todo"> oppure vengono rimossi. */
  function renderTodos(s) {
    if (CONFIG.showTodos) {
      return esc(s).replace(TODO_RE, m => '<mark class="todo" title="' + esc(pick(UI_EXTRA.todoTitle)) + '">' + m + '</mark>');
    }
    const clean = stripTodos(s);
    return esc(clean || '—');
  }
  function emphasize(htmlStr, word) {
    if (!word) return htmlStr;
    const w = esc(word);
    const i = htmlStr.indexOf(w);
    if (i < 0) return htmlStr;
    return htmlStr.slice(0, i) + '<em>' + w + '</em>' + htmlStr.slice(i + w.length);
  }
  function pick(v, l) {
    if (v == null) return '';
    if (typeof v === 'object') return v[l || lang] || v.it || '';
    return String(v);
  }
  function formatPrice(p, l) {
    if (typeof p === 'number') {
      try { return new Intl.NumberFormat(LOCALES[l || lang], { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p); } catch (e) { return p + ' €'; }
    }
    return pick(p, l);
  }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function siteName() { return CONFIG.brand.siteName ? names(CONFIG.brand.siteName) : (CONFIG.brand.firstName || 'Kristina') + ' · Heels dance · Brera'; }
  /* Tipografia russa: il tiretto non può iniziare una riga. */
  function ruDash(str, l) { return (l || lang) === 'ru' ? String(str).replace(/ —/g, '\u00A0—') : str; }

  /* ---------- link da CONFIG ---------- */
  function whatsappHref(l) {
    const n = String(CONFIG.contacts.whatsappNumber || '').replace(/\D/g, '');
    if (!n) return '#prenota';
    const msg = stripTodos(names(get(I18N[l || lang], 'contact.whatsapp_prefilled') || ''));
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(msg);
  }
  function telegramHref() {
    const u = String(CONFIG.contacts.telegramUsername || '').replace(/^@/, '').trim();
    if (u) return 'https://t.me/' + encodeURIComponent(u);
    const n = String(CONFIG.contacts.telegramPhone || '').replace(/\D/g, '');
    return n ? 'https://t.me/+' + n : '';
  }
  function instagramHref() {
    const h = String(CONFIG.contacts.instagramHandle || '').replace(/^@/, '').trim();
    return h ? 'https://www.instagram.com/' + encodeURIComponent(h) + '/' : '#prenota';
  }
  function mapsHref() {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.venue.mapsQuery || 'Brera, Milano');
  }
  function setExternal(a, external) {
    let n = a.querySelector('[data-ext-note]');
    if (external) {
      a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener noreferrer');
      if (!n) { n = doc.createElement('span'); n.className = 'visually-hidden'; n.setAttribute('data-ext-note', ''); a.appendChild(n); }
      n.textContent = ' ' + pick(UI_EXTRA.newWindow);
    } else {
      a.removeAttribute('target'); a.removeAttribute('rel');
      if (n) n.remove();
    }
  }

  /* ---------- applicazione della lingua ---------- */
  function applyLang(l, opts) {
    opts = opts || {};
    if (!I18N[l]) l = CONFIG.defaultLang || 'it';
    lang = l;
    root.setAttribute('lang', l);
    const em = EMPHASIS[l] || {};

    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      let raw = t(key, l);
      if (el.hasAttribute('data-legal')) raw = legalLine(raw, l);
      if (el.hasAttribute('data-venue') && CONFIG.venue.venueName) { el.innerHTML = venueHtml(); return; }
      /* in produzione un valore fatto solo di [TODO] non stampa «—»: sparisce la riga intera (fatto, nome dello spazio) */
      if (!CONFIG.showTodos) {
        const wrap = el.closest('.facts__item') || (el.hasAttribute('data-venue') ? el : null);
        if (wrap) { wrap.hidden = !stripTodos(raw); if (wrap.hidden) return; }
      }
      let out = ruDash(renderTodos(raw), l);
      if (el.hasAttribute('data-em')) out = emphasize(out, em[key]);
      el.innerHTML = out;
    });
    $$('.facts').forEach(dl => { dl.hidden = $$('.facts__item', dl).every(i => i.hidden); });

    $$('[data-i18n-attr]').forEach(el => {
      el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
        const idx = pair.indexOf(':');
        if (idx < 0) return;
        const attr = pair.slice(0, idx).trim();
        const key = pair.slice(idx + 1).trim();
        const val = tClean(key, l);
        if (val) el.setAttribute(attr, val);
      });
    });

    /* metadati */
    doc.title = tClean('meta.title', l);
    setMeta('name', 'description', tClean('meta.description', l));
    setMeta('property', 'og:title', tClean('meta.og_title', l));
    setMeta('property', 'og:description', tClean('meta.og_description', l));
    setMeta('property', 'og:locale', OG_LOCALES[l]);
    $$('meta[property="og:locale:alternate"]').forEach(m => m.remove());
    LANGS.filter(x => x !== l).forEach(x => { const m = doc.createElement('meta'); m.setAttribute('property', 'og:locale:alternate'); m.setAttribute('content', OG_LOCALES[x]); doc.head.appendChild(m); });
    setMeta('property', 'og:site_name', siteName());
    renderJsonLd(l);
    setMeta('name', 'twitter:title', tClean('meta.og_title', l));
    setMeta('name', 'twitter:description', tClean('meta.og_description', l));

    /* switch lingua (tre istanze sincronizzate) */
    $$('.lang__btn').forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)));
    positionLangInks();

    /* link che dipendono da CONFIG e dalla lingua */
    $$('[data-config-href="whatsapp"]').forEach(a => { a.setAttribute('href', whatsappHref(l)); setExternal(a, !!CONFIG.contacts.whatsappNumber); });
    applyContacts();
    if (!CONFIG.showTodos) $$('[data-dev-note]').forEach(el => el.remove());
    /* bottone Pausa: lo stato lo dice aria-pressed, l'etichetta resta fissa (ARIA APG) */
    $$('[data-ui-pause]').forEach(b => { b.setAttribute('aria-label', UI_EXTRA.pause[l] || UI_EXTRA.pause.it); });
    const menu = $('#menu');
    if (menu && menu.getAttribute('role') === 'dialog') menu.setAttribute('aria-label', tClean('ui.menu_open', l));
    const brand = $('[data-brand-label]');
    if (brand) brand.setAttribute('aria-label', (CONFIG.brand.firstName || 'Kristina') + ' · ' + tClean('ui.back_to_top', l));

    renderSchedule(l);
    renderPricing(l);
    renderTestimonials(l);
    buildMarquees();
    if (!opts.silent) store.set('hd-lang', l);
    if (!opts.instant && isJs && !reduce) {
      root.classList.add('is-switching');
      void root.offsetWidth;
      root.classList.remove('is-switching');
    }
    doc.dispatchEvent(new CustomEvent('hd:lang', { detail: { lang: l } }));
    return l;
  }
  window.setLang = function (l) { return applyLang(l); };

  function setMeta(attr, name, content) {
    let m = $('meta[' + attr + '="' + name + '"]');
    if (!m) { m = doc.createElement('meta'); m.setAttribute(attr, name); doc.head.appendChild(m); }
    m.setAttribute('content', content == null ? '' : content);
  }

  function legalLine(raw, l) {
    let s = String(raw).replace(/©\s*\d{4}/, '© ' + new Date().getFullYear());
    if (CONFIG.legal.fiscalName) {
      s = s.replace(CONFIG.brand.firstName || 'Kristina', CONFIG.legal.fiscalName);
      s = s.replace(CONFIG.brand.firstNameCyrillic || 'Кристина', CONFIG.legal.fiscalName);
    }
    if (CONFIG.legal.vatNumber) s = s.replace(TODO_RE, (VAT_LABEL[l || lang] || VAT_LABEL.it) + CONFIG.legal.vatNumber);
    return s;
  }
  function venueHtml() {
    const v = CONFIG.venue;
    let h = esc(v.venueName);
    if (v.venueAddress) h += '<br>' + esc(v.venueAddress);
    if (v.venueNote) h += '<br><span class="small">' + esc(v.venueNote) + '</span>';
    return h;
  }

  /* ---------- CONFIG → DOM ---------- */
  function applyConfig() {
    /* monogramma: grafia "C" → lettera con punto */
    if ((CONFIG.brand.monogram || 'K').toUpperCase() !== 'K') {
      $$('svg.monogram').forEach(svg => {
        const span = doc.createElement('span');
        span.className = 'monogram monogram--text';
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = esc(CONFIG.brand.monogram.charAt(0).toUpperCase()) + '<i></i>';
        svg.replaceWith(span);
      });
    }
    /* contatti */
    applyContacts();
    /* promemoria in sviluppo per i contatti mancanti */
    if (CONFIG.showTodos) {
      const cta = $('.book__cta');
      const missing = [];
      if (!CONFIG.contacts.whatsappNumber) missing.push('numero WhatsApp');
      if (!CONFIG.contacts.instagramHandle) missing.push('handle Instagram');
      if (cta && missing.length) {
        const p = doc.createElement('p');
        p.className = 'small';
        p.setAttribute('data-dev-note', '');
        p.setAttribute('lang', 'it');
        p.innerHTML = '<mark class="todo" title="' + esc(pick(UI_EXTRA.todoTitle)) + '">[TODO: ' + esc(missing.join(' e ')) + ' in CONFIG]</mark>';
        cta.insertAdjacentElement('afterend', p);
      }
    }
    /* badge "Esempio" e note; in produzione (showTodos: false) orari e prezzi non confermati NON vengono pubblicati */
    $$('[data-example="schedule"]').forEach(el => { el.hidden = !!CONFIG.scheduleConfirmed; });
    $$('[data-example="pricing"]').forEach(el => { el.hidden = !!CONFIG.pricingConfirmed; });
    const orari = $('#orari'), prezzi = $('#prezzi');
    if (orari) orari.hidden = !CONFIG.showTodos && !(CONFIG.scheduleConfirmed && Array.isArray(CONFIG.schedule) && CONFIG.schedule.length > 0);
    if (prezzi) prezzi.hidden = !CONFIG.showTodos && !(CONFIG.pricingConfirmed && Array.isArray(CONFIG.pricing) && CONFIG.pricing.length > 0);
    /* testimonianze */
    const dicono = $('#dicono');
    if (dicono) dicono.hidden = !(CONFIG.showTestimonials && Array.isArray(CONFIG.testimonials) && CONFIG.testimonials.length > 0);
    /* metadati assoluti */
    if (CONFIG.site.url) {
      const base = CONFIG.site.url.replace(/\/?$/, '/');
      setMeta('property', 'og:url', base);
      setMeta('property', 'og:image', base + (CONFIG.site.ogImage || 'og-image.png'));
      setMeta('property', 'og:image:width', '1200');
      setMeta('property', 'og:image:height', '630');
      setMeta('name', 'twitter:card', 'summary_large_image');
      setMeta('name', 'twitter:image', base + (CONFIG.site.ogImage || 'og-image.png'));
      let can = $('link[rel="canonical"]');
      if (!can) { can = doc.createElement('link'); can.setAttribute('rel', 'canonical'); doc.head.appendChild(can); }
      can.setAttribute('href', base);
    }
    renumber();
  }

  function applyContacts() {
    $$('[data-config-href="instagram"]').forEach(a => { a.setAttribute('href', instagramHref()); setExternal(a, !!CONFIG.contacts.instagramHandle); });
    $$('[data-config-href="telegram"]').forEach(a => { const h = telegramHref(); a.setAttribute('href', h || '#prenota'); setExternal(a, !!h); });
    $$('[data-config-show="telegram"]').forEach(el => { el.hidden = !telegramHref(); });
    $$('[data-config-show="contact-widget"]').forEach(el => {
      el.hidden = CONFIG.contacts.showContactWidget === false || (!CONFIG.contacts.whatsappNumber && !telegramHref());
    });
    $$('[data-config-href="maps"]').forEach(a => { a.setAttribute('href', mapsHref()); setExternal(a, true); });
    const email = String(CONFIG.contacts.email || '').trim();
    $$('[data-config-href="email"]').forEach(a => { a.setAttribute('href', email ? 'mailto:' + email : '#prenota'); setExternal(a, false); });
    $$('[data-config-show="email"]').forEach(el => { el.hidden = !email && !CONFIG.showTodos; });
    $$('[data-config-show="instagram"]').forEach(el => { el.hidden = !CONFIG.contacts.instagramHandle && !CONFIG.showTodos; });
    $$('[data-config-show="whatsapp"]').forEach(el => { el.hidden = !CONFIG.contacts.whatsappNumber && !CONFIG.showTodos; });
  }

  function renderSchedule(l) {
    const body = $('#schedule-body');
    if (!body || !Array.isArray(CONFIG.schedule) || !CONFIG.schedule.length) return;
    body.innerHTML = CONFIG.schedule.map(row => {
      let day;
      if (row.day && typeof row.day === 'object') day = pick(row.day, l);
      else if (DAYS[row.day]) day = DAYS[row.day][l];
      else if (row.day === 'appointment') day = tClean('schedule.items.4.day', l);
      else day = String(row.day || '');
      const time = pick(row.time, l);
      const cls = typeof row.classIndex === 'number' ? get(I18N[l], 'classes.items.' + row.classIndex) : null;
      const name = cls ? cls.name : pick(row.class, l);
      const level = cls ? cls.level : pick(row.level, l);
      return '<tr role="row"><th scope="row" role="rowheader">' + esc(day) + '</th><td role="cell" class="table__time">' + esc(time) + '</td><td role="cell">' + esc(name) + '</td><td role="cell">' + (level ? '<span class="chip">' + esc(level) + '</span>' : '') + '</td></tr>';
    }).join('');
  }

  function renderPricing(l) {
    const body = $('#pricing-body');
    if (!body || !Array.isArray(CONFIG.pricing) || !CONFIG.pricing.length) return;
    body.innerHTML = CONFIG.pricing.map(row => {
      const ref = typeof row.index === 'number' ? get(I18N[l], 'pricing.items.' + row.index) : null;
      const name = row.name ? pick(row.name, l) : (ref ? ref.name : '');
      const detail = row.detail ? pick(row.detail, l) : (ref && typeof row.index === 'number' && row.name == null ? ref.detail : '');
      const price = row.price != null ? formatPrice(row.price, l) : (ref ? ref.price : '');
      const featured = row.featured != null ? !!row.featured : !!(ref && ref.featured);
      return '<tr role="row" data-featured="' + featured + '"><th scope="row" role="rowheader"><span>' + esc(stripTodos(name)) + '</span>' + (detail ? '<span class="table__detail">' + ruDash(esc(stripTodos(detail)), l) + '</span>' : '') + '</th><td role="cell" class="table__price">' + esc(price) + '</td></tr>';
    }).join('');
  }

  function renderTestimonials(l) {
    const list = $('#testimonials-list');
    const section = $('#dicono');
    if (!list || !section || section.hidden) return;
    list.innerHTML = CONFIG.testimonials.map((q, i) => {
      const quote = pick(q.quote, l);
      const level = pick(q.level, l);
      return '<figure class="quotes__item"><blockquote><p>' + ruDash(esc(quote), l) + '</p></blockquote><figcaption class="quotes__meta"><span class="cartellino"><span class="cartellino__n">' + pad2(i + 1) + '</span><span>' + esc(q.name || '') + '</span></span>' + (level ? '<span class="chip">' + esc(level) + '</span>' : '') + '</figcaption></figure>';
    }).join('');
  }

  const JOB_TITLE = { it: 'Insegnante di heels dance', en: 'Heels dance teacher', ru: 'Преподаватель heels dance' };
  function renderJsonLd(l) {
    const el = $('#jsonld');
    if (!el) return;
    l = l || lang;
    const base = CONFIG.site.url ? CONFIG.site.url.replace(/\/?$/, '/') : '';
    const name = CONFIG.brand.firstName || 'Kristina';
    const person = {
      '@type': 'Person', '@id': base + '#kristina', name: name,
      jobTitle: JOB_TITLE[l] || JOB_TITLE.it, knowsLanguage: ['it', 'en', 'ru'],
      address: { '@type': 'PostalAddress', addressLocality: 'Milano', addressRegion: 'MI', addressCountry: 'IT' }
    };
    const school = {
      '@type': 'DanceSchool', '@id': base + '#scuola',
      name: siteName(), inLanguage: LOCALES[l],
      description: tClean('meta.description', l),
      founder: { '@id': base + '#kristina' },
      address: { '@type': 'PostalAddress', addressLocality: 'Milano', addressRegion: 'MI', addressCountry: 'IT' },
      areaServed: 'Milano', knowsLanguage: ['it', 'en', 'ru']
    };
    if (base) { person.url = base; school.url = base; school.image = base + (CONFIG.site.ogImage || 'og-image.png'); }
    if (CONFIG.contacts.instagramHandle) { person.sameAs = [instagramHref()]; school.sameAs = [instagramHref()]; }
    if (CONFIG.contacts.whatsappNumber) school.telephone = '+' + String(CONFIG.contacts.whatsappNumber).replace(/\D/g, '');
    if (CONFIG.contacts.email) school.email = CONFIG.contacts.email;
    if (CONFIG.venue.venueAddress) school.address.streetAddress = CONFIG.venue.venueAddress;
    /* Nessun oggetto Course finché prezzi e orari non sono confermati: Google richiede offers, courseSchedule e courseWorkload. */
    el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, school] });
  }

  /* Numerazione delle sezioni visibili (eyebrow, numerale ghost, nav, menu). */
  function renumber() {
    let n = 0;
    $$('main [data-numbered]').forEach(sec => {
      const visible = !sec.hidden;
      const label = visible ? pad2(++n) : '—';
      $$('.eyebrow__n', sec).forEach(s => { s.textContent = label; });
      $$('.numeral', sec).forEach(s => { s.setAttribute('data-count', label); if (!s.classList.contains('is-counting')) s.textContent = label; });
      $$('[data-nav-n="' + sec.id + '"]').forEach(s => { s.textContent = label; });
      $$('a[href="#' + sec.id + '"]').forEach(a => { const li = a.closest('li'); if (li) li.hidden = !visible; });
    });
  }
  /* La parete: tab stop (e ruolo di regione) solo dove scorre davvero, cioè sotto i 768px. */
  function updateWallFocus() {
    $$('[data-wall]').forEach(w => {
      if (w.scrollWidth > w.clientWidth + 1) w.setAttribute('tabindex', '0'); else w.removeAttribute('tabindex');
    });
  }

  /* ---------- switch lingua ---------- */
  function positionLangInks() {
    $$('.lang').forEach(group => {
      const ink = $('.lang__ink', group);
      const btn = $('.lang__btn[aria-pressed="true"]', group);
      if (!ink || !btn) return;
      ink.style.left = (btn.offsetLeft + 10) + 'px';
      ink.style.width = Math.max(0, btn.offsetWidth - 20) + 'px';
      ink.classList.add('is-on');
    });
  }
  $$('.lang__btn').forEach(b => b.addEventListener('click', () => applyLang(b.getAttribute('data-lang'))));

  /* ---------- marquee ---------- */
  function buildMarquees() {
    $$('.marquee').forEach(m => {
      const tracks = $$('.marquee__track', m);
      if (tracks.length < 2) return;
      const first = tracks[0];
      let items = [];
      if (first.hasAttribute('data-i18n-list')) {
        items = (get(I18N[lang], first.getAttribute('data-i18n-list')) || []).map(s => ({ text: stripTodos(names(s)) }));
      } else if (first.getAttribute('data-marquee-track') === 'nastro') {
        items = LANGS.map(l => ({ text: stripTodos(names(get(I18N[l], 'contact.headline') || '')), lang: l }));
      } else {
        return;
      }
      const set = items.map(it => '<span' + (it.lang ? ' lang="' + it.lang + '"' : '') + '>' + ruDash(esc(it.text), it.lang || lang) + '</span><span class="marquee__star">*</span>').join('');
      first.innerHTML = set;
      let reps = 1;
      const need = (window.innerWidth || 1440) * 1.1;
      while (first.scrollWidth < need && reps < 10) { first.insertAdjacentHTML('beforeend', set); reps++; }
      tracks[1].innerHTML = first.innerHTML;
      const speed = parseFloat(m.getAttribute('data-speed')) || 50;
      const dur = Math.max(12, Math.round(first.scrollWidth / speed));
      m.style.setProperty('--dur', dur + 's');
    });
  }

  /* controllo "Pausa" (persistente) */
  function initPause() {
    const off = store.get('hd-motion') === 'off';
    root.classList.toggle('is-motion-off', off);
    $$('[data-ui-pause]').forEach(b => {
      b.setAttribute('aria-pressed', String(off));
      b.addEventListener('click', () => {
        const nowOff = !root.classList.contains('is-motion-off');
        root.classList.toggle('is-motion-off', nowOff);
        store.set('hd-motion', nowOff ? 'off' : 'on');
        $$('[data-ui-pause]').forEach(x => { x.setAttribute('aria-pressed', String(nowOff)); });
      });
    });
    doc.addEventListener('visibilitychange', () => root.classList.toggle('is-hidden', doc.hidden));
    /* «riduci movimento» attivato a pagina aperta: JS si allinea al CSS senza ricaricare */
    const onReduce = e => { reduce = e.matches; if (reduce) { revealAll(); root.classList.add('is-motion-off'); } };
    if (mqReduce.addEventListener) mqReduce.addEventListener('change', onReduce); else if (mqReduce.addListener) mqReduce.addListener(onReduce);
  }

  /* ---------- menu mobile ---------- */
  function initMenu() {
    const menu = $('#menu'), btn = $('#menu-btn'), close = $('#menu-close');
    if (!menu || !btn) return;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', tClean('ui.menu_open'));
    const focusables = () => $$('a[href], button:not([disabled])', menu).filter(el => el.offsetParent !== null);
    function onKey(e) {
      if (e.key === 'Escape') { closeMenu(true); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    function openMenu() {
      menu.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      doc.body.style.overflow = 'hidden';
      doc.addEventListener('keydown', onKey);
      (close || focusables()[0]).focus();
    }
    function closeMenu(returnFocus) {
      if (!menu.classList.contains('is-open')) return;
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      doc.body.style.overflow = '';
      doc.removeEventListener('keydown', onKey);
      if (returnFocus) btn.focus();
    }
    btn.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu(true) : openMenu()));
    if (close) close.addEventListener('click', () => closeMenu(true));
    $$('.menu__link', menu).forEach(a => a.addEventListener('click', () => closeMenu(false)));
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = e => { if (e.matches) closeMenu(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }

  /* ---------- accordion FAQ (button + aria-expanded) ---------- */
  function initFaq() {
    $$('.faq__item').forEach((item, i) => {
      const btn = $('.faq__btn', item), panel = $('.faq__a', item);
      if (!btn || !panel) return;
      const open = i === 0;
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      btn.addEventListener('click', () => toggleFaq(btn, panel));
    });
  }
  function toggleFaq(btn, panel) {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    if (reduce || typeof panel.animate !== 'function') { panel.hidden = isOpen; return; }
    const easing = 'cubic-bezier(.22, 1, .36, 1)';
    if (panel._anim) { panel._anim.cancel(); panel._anim = null; }
    if (isOpen) {
      const h = panel.offsetHeight;
      const a = panel.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: easing });
      panel._anim = a;
      a.onfinish = () => { panel.hidden = true; panel._anim = null; };
    } else {
      panel.hidden = false;
      const h = panel.offsetHeight;
      const a = panel.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 300, easing: easing });
      panel._anim = a;
      a.onfinish = () => { panel._anim = null; };
    }
  }

  /* ---------- rivelazioni, numerali, opere a linea ---------- */
  const drawn = new WeakSet();
  function prepareDraw(svg) {
    if (!isJs || reduce || drawn.has(svg)) return;
    $$('path.draw-line', svg).forEach(p => {
      let len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      if (!len) return;
      p.style.transition = 'none';
      p.style.strokeDasharray = len + ' ' + len;
      p.style.strokeDashoffset = String(len);
      void p.getBoundingClientRect();
      p.style.transition = '';
    });
  }
  function draw(svg) {
    if (drawn.has(svg)) return;
    drawn.add(svg);
    $$('path.draw-line', svg).forEach(p => { p.style.strokeDashoffset = '0'; });
  }
  function countNumeral(el) {
    const target = el.getAttribute('data-count') || el.textContent;
    if (!/^\d+$/.test(target) || el.classList.contains('is-counting')) { return; }
    el.classList.add('is-counting');
    const n = parseInt(target, 10);
    let i = 0;
    const tick = () => {
      el.textContent = pad2(i);
      if (i < n) { i++; window.setTimeout(tick, 60); } else { el.classList.remove('is-counting'); }
    };
    tick();
  }
  function revealEl(el) {
    el.classList.add('is-in');
    if (el.classList.contains('numeral')) countNumeral(el);
    if (el.classList.contains('draw')) draw(el);
    $$('svg.draw', el).forEach(draw);
  }
  let revealTargets = [];
  function revealAll() { revealTargets.forEach(revealEl); }
  function initReveal() {
    revealTargets = $$('.reveal, .reveal-group, .timeline, .numeral, main svg.draw:not(.hero__heel)');
    if (!isJs || reduce || !('IntersectionObserver' in window)) { revealAll(); return; }
    $$('main svg.draw:not(.hero__heel)').forEach(prepareDraw);
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting || en.intersectionRatio > 0) { revealEl(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
    revealTargets.forEach(el => io.observe(el));
    /* un controllo che riceve il focus da tastiera non può restare invisibile (WCAG 2.4.7) */
    doc.addEventListener('focusin', e => {
      const t = e.target && e.target.closest ? e.target.closest('.reveal, .reveal-group, .timeline') : null;
      if (t) { revealEl(t); io.unobserve(t); }
    });
  }

  /* ---------- hero: linea-tacco e parallasse ---------- */
  let heroFrame = null, parallaxOn = false;
  function initHero() {
    const heel = $('.hero__heel');
    heroFrame = $('.hero__frame');
    if (heel && isJs && !reduce) {
      prepareDraw(heel);
      window.setTimeout(() => { heel.classList.add('is-drawn'); draw(heel); }, 700);
    } else if (heel) {
      heel.classList.add('is-drawn');
    }
    if (heroFrame && isJs && !reduce) {
      heroFrame.addEventListener('animationend', () => {
        heroFrame.style.animation = 'none';
        heroFrame.style.opacity = '1';
        parallaxOn = true;
      }, { once: true });
    }
  }

  /* ---------- scroll: header, cucitura, scroll-spy, back-to-top ---------- */
  function initScroll() {
    const header = $('#header'), seam = $('.seam'), totop = $('#totop'), ink = $('.nav__ink');
    const links = $$('.nav__link');
    const targets = links.map(a => ({ a: a, el: $(a.getAttribute('href')) })).filter(x => x.el);
    let ticking = false, target = 0, current = 0, activeId = null;
    function measure() {
      if (seam) seam.style.setProperty('--seam-h', seam.offsetHeight + 'px');
    }
    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      let active = null;
      links.forEach(a => {
        const on = a.getAttribute('href') === '#' + id;
        if (on) { a.setAttribute('aria-current', 'true'); active = a; } else { a.removeAttribute('aria-current'); }
      });
      if (ink) {
        if (active) { ink.style.left = active.offsetLeft + 'px'; ink.style.width = active.offsetWidth + 'px'; ink.classList.add('is-on'); }
        else { ink.classList.remove('is-on'); }
      }
    }
    function update() {
      ticking = false;
      const y = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;
      const max = Math.max(1, root.scrollHeight - vh);
      if (header) header.classList.toggle('is-scrolled', y > 80);
      if (totop) totop.classList.toggle('is-visible', y > vh * 2);
      let id = null;
      const line = y + vh * 0.4;
      targets.forEach(x => { if (x.el.offsetTop <= line) id = x.el.id; });
      if (y + vh >= root.scrollHeight - 2) { id = targets.length ? targets[targets.length - 1].el.id : id; revealAll(); }
      setActive(id);
      if (!reduce) {
        target = Math.min(1, Math.max(0, y / max));
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.0015) current = target;
        if (seam) { seam.style.setProperty('--p', current.toFixed(4)); seam.classList.toggle('is-knot', current >= 0.985); }
      }
      if (parallaxOn && heroFrame && window.innerWidth >= 1024) {
        const p = Math.min(1, y / vh);
        heroFrame.style.transform = 'translateY(' + (-12 + 24 * p).toFixed(1) + 'px)';
      }
      if (current !== target && !ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
    measure();
    if (reduce) {
      if (seam) { seam.style.setProperty('--p', '1'); seam.classList.add('is-knot'); }
      current = target = 1;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    /* scorrimento morbido sulle ancore interne (solo senza "riduci movimento"); window.scrollTo resta istantaneo */
    doc.addEventListener('click', e => {
      const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = id === 'top' ? doc.body : doc.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        const brandLink = $('.header__brand');
        if (brandLink) brandLink.focus({ preventScroll: true });
      } else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (id !== 'top') {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      }
      try { window.history.pushState(null, '', '#' + id); } catch (err) { /* file:// */ }
    });
    let rt;
    window.addEventListener('resize', () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => { measure(); positionLangInks(); buildMarquees(); updateWallFocus(); activeId = null; onScroll(); }, 150);
    });
    update();
  }

  /* ---------- lingua iniziale ---------- */
  function detectLang() {
    const m = window.location.hash.match(/^#lang=(it|en|ru)$/i);
    if (m) return m[1].toLowerCase();
    const saved = store.get('hd-lang');
    if (saved && I18N[saved]) return saved;
    if (CONFIG.autoDetectLang === true) {
      const navs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
      for (let i = 0; i < navs.length; i++) {
        const c = String(navs[i]).slice(0, 2).toLowerCase();
        if (I18N[c]) return c;
      }
    }
    return CONFIG.defaultLang || 'it';
  }

  /* ---------- controlli di sviluppo (console) ---------- */
  function keysOf(o, p) {
    p = p || '';
    return Object.keys(o).reduce((acc, k) => {
      const v = o[k];
      return acc.concat(v !== null && typeof v === 'object' ? keysOf(v, p + k + '.') : [p + k]);
    }, []);
  }
  function checkI18N() {
    let ok = true;
    const ref = keysOf(I18N.it);
    LANGS.forEach(l => {
      const ks = keysOf(I18N[l]);
      const missing = ref.filter(k => ks.indexOf(k) < 0);
      const extra = ks.filter(k => ref.indexOf(k) < 0);
      if (missing.length || extra.length) { ok = false; console.warn('[i18n] ' + l + ' — chiavi mancanti:', missing, 'in più:', extra); }
    });
    $$('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      LANGS.forEach(l => { if (get(I18N[l], k) == null) { ok = false; console.warn('[i18n] chiave assente nel dizionario ' + l + ': ' + k); } });
    });
    return ok;
  }
  function checkConfig() {
    const empty = [];
    const walk = (o, p) => Object.keys(o).forEach(k => {
      const v = o[k];
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) walk(v, p + k + '.');
      else if (v === '' || (Array.isArray(v) && !v.length)) empty.push(p + k);
    });
    walk(CONFIG, 'CONFIG.');
    if (!CONFIG.scheduleConfirmed) empty.push('CONFIG.scheduleConfirmed (orari di esempio)');
    if (!CONFIG.pricingConfirmed) empty.push('CONFIG.pricingConfirmed (prezzi di esempio)');
    /* chiavi dei dizionari che contengono ancora [TODO]: vanno riscritte a mano prima di showTodos: false */
    LANGS.forEach(l => keysOf(I18N[l]).forEach(k => { if (TODO_RE.test(String(get(I18N[l], k)))) empty.push('I18N.' + l + '.' + k + ' [TODO]'); TODO_RE.lastIndex = 0; }));
    return empty;
  }
  window.checkI18N = checkI18N;
  window.checkConfig = checkConfig;
  if (CONFIG.showTodos) window.HD = { CONFIG: CONFIG, I18N: I18N, applyLang: applyLang, stripTodos: stripTodos };

  /* ---------- avvio ---------- */

  /* ---------- widget di contatto (WhatsApp / Telegram) ---------- */
  function initContactWidget() {
    const wrap = $('#cw'), btn = $('#cw-toggle'), panel = $('#cw-panel');
    if (!wrap || !btn || !panel) return;
    function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    function open() {
      panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
      const first = panel.querySelector('a:not([hidden])');
      if (first) first.focus();
    }
    btn.addEventListener('click', () => { panel.hidden ? open() : close(); });
    doc.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); }
    });
    doc.addEventListener('click', e => {
      if (!panel.hidden && !wrap.contains(e.target)) close();
    });
    panel.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  }

  function init() {
    applyConfig();
    initPause();
    applyLang(detectLang(), { instant: true, silent: true });
    initMenu();
    initFaq();
    initHero();
    initReveal();
    initScroll();
    initContactWidget();
    positionLangInks();
    updateWallFocus();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => { buildMarquees(); positionLangInks(); });
    window.addEventListener('hashchange', () => {
      const m = window.location.hash.match(/^#lang=(it|en|ru)$/i);
      if (m) applyLang(m[1].toLowerCase());
    });
    if (CONFIG.showTodos) {
      checkI18N();
      const empty = checkConfig();
      if (empty.length) console.info('[CONFIG] campi da compilare prima del lancio:\n · ' + empty.join('\n · '));
    }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
