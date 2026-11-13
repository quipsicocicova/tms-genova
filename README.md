# Centro TMS Genova

Landing responsive in italiano, realizzata con HTML, CSS e JavaScript, con Vite per sviluppo e build. Include un modulo contatti con endpoint Node `/api/contact`, senza analytics o mappe incorporate. Il servizio email deve essere configurato prima di poter inviare richieste: in assenza di configurazione, il modulo mostra un avviso e il numero dello studio, senza fingere un invio riuscito.

## Avvio

```bash
npm install
npm run dev -- --port 5186
```

Aprire http://localhost:5186. Per esporre il server su rete locale, Vite è già configurato con `--host 0.0.0.0`.

```bash
npm run build
npm run preview -- --port 5186
```

La cartella `dist/` contiene il frontend. Per mantenere funzionante il modulo in produzione serve anche un backend Node che monti `createContactHandler` da `server/contact.mjs` su `/api/contact`, oppure un servizio equivalente. Il solo hosting statico non invia messaggi. Il sito non è stato pubblicato online.

## Foto

Le tre immagini provvisorie provengono dalla pagina di neurostimolazione indicata dall’utente:
https://www.drcipriani.com/neurostimolazione-tms/

- `public/images/trattamento.jpg`: immagine principale, dettaglio bobina; preferibile una foto orizzontale con soggetto centrale, adatta anche a ritaglio verticale.
- `public/images/studio.jpg`: immagine della sezione percorso; può diventare una foto accogliente dello studio o del professionista. La foto attuale mostra principalmente il dispositivo.
- `public/images/neuronavigazione.jpg`: dettaglio tecnico; formato orizzontale.

Sostituire i file mantenendo gli stessi nomi oppure aggiornare i percorsi in `index.html`. Aggiornare anche i testi `alt`, le dimensioni intrinseche e, se necessario, `object-position` in `src/style.css`. Accertare i diritti di riutilizzo e le eventuali liberatorie prima della pubblicazione. Le immagini sono locali e non dipendono dall’hotlink al sito originale.

## Contenuti

Testi adattati dalla pagina sopra, senza promesse di guarigione. La descrizione del sistema MagPro R30, Theta Burst e neuronavigazione è riportata anche nelle pagine del sito originale dedicate allo studio e ai servizi. La lista delle condizioni segue la pagina di neurostimolazione e non implica identica evidenza o appropriatezza per tutte le indicazioni.

Indirizzo: Salita Santa Caterina 6/2, Genova.
Email: centrotmsgenova@gmail.com.

Non è stato inserito un calendario di prenotazione. Telefono fornito dall’utente: 010 375 3411. Costo indicativo fornito dall’utente: circa 150 € a seduta, variabile in base al protocollo, con cicli indicativi di 10–20 sedute. Il testo hero aggiornato su richiesta dell’utente va verificato clinicamente prima della pubblicazione, in particolare le espressioni «indolore» e «a lungo termine».

## Attivazione del modulo contatti

Configurare nell’ambiente server (oppure in `.env.local`, escluso dal versionamento) `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. Non usare il prefisso `VITE_`: le credenziali non devono essere esposte al browser. Riavviare il server dopo la configurazione. Usare credenziali SMTP/app password del fornitore, mai condivise in chat. La destinazione è fissata a `centrotmsgenova@gmail.com`; l’email del visitatore diventa il Reply-To, non il mittente.

Il backend verifica origine, dimensioni, campi, honeypot e frequenza delle richieste, richiede TLS per SMTP e non salva né registra i messaggi su disco. La conferma compare solo dopo che il server SMTP accetta il messaggio; questo non garantisce la consegna finale. La protezione di frequenza è in memoria per singolo processo: in produzione dietro proxy o con più istanze prevedere protezioni infrastrutturali adeguate. I test del percorso di successo frontend usano una risposta simulata: non è stato effettuato un invio email reale.

Prima di attivare il servizio pubblicamente, aggiungere l’informativa privacy approvata con titolare, finalità, base giuridica, destinatari e conservazione, verificando anche il fornitore email. Il modulo invita a non inserire dati sanitari. Non è stata inventata un’informativa o una casella di consenso priva di contenuti legali definiti.

## Prima di pubblicare

- Far approvare testi clinici e indicazioni dal responsabile sanitario.
- Confermare denominazione del centro e inserire i dati professionali/fiscali e le informazioni obbligatorie applicabili (responsabile, iscrizione all’Ordine, partita IVA, ecc.).
- Predisporre l’informativa privacy coerente con il titolare e il trattamento delle richieste email; non è stata inventata un’informativa senza questi dati.
- I font DM Sans e Lora sono caricati da Google Fonts: valutare hosting locale per eliminare le richieste a terzi. Sono presenti font di fallback.
- Confermare l’uso delle fotografie o sostituirle con quelle del centro.
- Configurare dominio, HTTPS ed eventuali metadati social/canonical solo quando sarà noto il dominio definitivo.

## Verifiche

```bash
npx playwright install chromium
npm test
```

Test Chromium per immagini, contatti, FAQ, menu mobile, tasto Escape e assenza di overflow orizzontale a 320, 390, 760, 768 e 1024 px. Screenshot generati in `screenshots/desktop.png` e `screenshots/mobile.png`. Non costituiscono una certificazione completa di accessibilità o una verifica clinica/legale.
