"use client";

import { useEffect, useMemo, useState } from "react";

const engineStages = [
  {
    id: "base",
    number: "01",
    label: "Base",
    question: "Quanto vale oggi?",
    description:
      "Una fascia economica coerente, comparabile e distinta per donatori occasionali e regolari.",
    evidence: ["€420 ultimi 12 mesi", "3 donazioni", "Mini middle"],
    output: "Mini middle",
    tone: "red",
  },
  {
    id: "state",
    number: "02",
    label: "Stato",
    question: "Dove si trova la relazione?",
    description:
      "Un solo stato prevalente: nuovo, stabile, in crescita, in calo, lapsed, riattivato o regolare.",
    evidence: ["Valore +62%", "Frequenza in aumento", "Attivo 0-12"],
    output: "In crescita",
    tone: "magenta",
  },
  {
    id: "signals",
    number: "03",
    label: "Segnali",
    question: "Che cosa sta succedendo?",
    description:
      "Trend, engagement, canali, pressione, interessi e relazioni diventano segnali leggibili e versionati.",
    evidence: ["2 aperture email", "1 evento", "Pressione bassa"],
    output: "Digital engaged",
    tone: "blue",
  },
  {
    id: "action",
    number: "04",
    label: "Azione",
    question: "Che cosa facciamo adesso?",
    description:
      "Un obiettivo prioritario con journey, canale, timing, owner e motivazione disponibili al team.",
    evidence: ["Email + follow-up", "Ask €35/mese", "Owner: donor care"],
    output: "Upgrade a regolare",
    tone: "green",
  },
];

const teamModels = [
  {
    code: "A",
    name: "RFM Avanzata",
    role: "Modello fondativo",
    objective: "Redemption e riattivazione",
    thesis: "Recency, Frequency e Monetary restano la base, ma vengono aperte, prioritizzate e integrate con lifecycle e comportamento per generare segmenti dinamici.",
    metric: "RFM+",
    metricLabel: "Da fascia economica a comportamento osservabile",
    detailLabel: "OUTPUT OPERATIVI",
    outputs: ["Segmentazione evoluta", "Lapsed Small / Middle", "Priorità di riattivazione"],
    tone: "red",
  },
  {
    code: "B",
    name: "Propensione ai Regolari",
    role: "Scoring di conversione",
    objective: "Conversione e retention",
    thesis: "Il modello distingue con chiarezza chi è già regolare — perché dona attraverso un metodo di pagamento ricorrente — dai donatori one-off da accompagnare alla conversione. La propensione non viene dedotta solo da monetary e frequency: il segnale centrale è la fedeltà dimostrata nel tempo.",
    metric: "FEDELTÀ",
    metricLabel: "Continuità, stabilità e risposta alla relazione guidano lo score; importo e frequenza restano segnali da contestualizzare.",
    detailLabel: "SEGNALI CHE ALIMENTANO LO SCORE",
    outputs: ["Continuità storica", "Stabilità del sostegno", "Risposta ai contatti"],
    tone: "magenta",
  },
  {
    code: "C",
    name: "Engagement Online",
    role: "Digitalizzazione e multicanalità",
    objective: "Ottimizzazione e sinergia",
    thesis: "Il database viene letto per reale raggiungibilità e comportamento, distinguendo Solo Postale, Solo Digital, Multicanale Caldo e Digital Silente.",
    metric: "+8.600",
    metricLabel: "donatori digitali attivi nel 2025 secondo l’analisi del team",
    detailLabel: "LETTURE OPERATIVE",
    outputs: ["Cluster di contact mix", "Journey per canale", "Pressione coordinata"],
    tone: "blue",
  },
  {
    code: "D",
    name: "Modello HVD",
    role: "High Value Donor",
    objective: "Arricchimento e upgrade discovery",
    thesis: "Capacità contributiva, segnali relazionali e comportamento donativo convergono in un indice di potenziale unico e riproducibile.",
    metric: "96–99°",
    metricLabel: "percentile proposto per il cluster HVD attivo",
    detailLabel: "AREE DEL MODELLO CHE GENERANO LO SCORE",
    outputs: ["Network aziendale", "Geo-intelligence", "RFM puntuale e cumulato"],
    tone: "green",
  },
  {
    code: "E",
    name: "Lasciti Lookalike",
    role: "Propensione di lungo periodo",
    objective: "Profilazione e trend discovery",
    thesis: "Il profilo di chi ha già scelto un lascito diventa il riferimento per trovare somiglianze anagrafiche, geografiche e di fedeltà nella base VIDAS.",
    metric: "149.107",
    metricLabel: "donatori unici dal 2015 disponibili come patrimonio storico",
    detailLabel: "OUTPUT OPERATIVI",
    outputs: ["Profilo seed", "Lookalike scoring", "Candidati a maggiore affinità"],
    tone: "yellow",
  },
  {
    code: "F",
    name: "Memorie",
    role: "Segmentazione relazionale",
    objective: "Targetizzazione ottimizzata",
    thesis: "Le donazioni legate ad assistiti e persone care richiedono una lettura dedicata: il contesto della relazione guida esclusioni, caring e linguaggio.",
    metric: "1:1",
    metricLabel: "una relazione sensibile, non un segmento promozionale",
    detailLabel: "OUTPUT OPERATIVI",
    outputs: ["Tag relazionali", "Auto-identificazione", "Journey e caring dedicati"],
    tone: "cyan",
  },
];

const currentJourneyMonths = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const currentJourneyChannels = [
  { id: "postal", name: "Postale", note: "12 campagne HM", active: currentJourneyMonths.map((_, index) => index) },
  { id: "email", name: "Email", note: "Presenza continuativa", active: currentJourneyMonths.map((_, index) => index) },
  { id: "phone", name: "Telefono", note: "Focus di fine anno", active: [10, 11] },
];

const currentJourneySegments = [
  {
    id: "small",
    name: "Small",
    monetary: "0–99€",
    recency: "0–24",
    volume: "29.000",
    letter: "A",
    headline: "L’impatto della tua prima donazione.",
    message: "Messaggio focalizzato sull’impatto della prima donazione.",
    ask: "Importo suggerito calibrato sulla mediana del segmento.",
    objective: "Rinnovo della donazione",
  },
  {
    id: "mini-middle",
    name: "Mini Middle",
    monetary: "100–249€",
    recency: "0–18",
    volume: "12.000",
    letter: "B",
    headline: "La fedeltà può diventare crescita.",
    message: "Riconoscimento della fedeltà e messaggio di upgrade verso la fascia superiore.",
    ask: "Importo suggerito contestualizzato sul profilo del donatore.",
    objective: "Upgrade di fascia",
  },
  {
    id: "middle",
    name: "Middle",
    monetary: "250–999€",
    recency: "0–18",
    volume: "4.800",
    letter: "C",
    headline: "Un sostegno qualificato merita una relazione diversa.",
    message: "Tono più relazionale e riconoscimento del ruolo di sostenitore qualificato.",
    ask: "Proposta personalizzata e coerente con il valore espresso.",
    objective: "Upgrade verso Pre Major",
  },
];

const journeyMonths = [
  "Lug 27", "Ago 27", "Set 27", "Ott 27", "Nov 27", "Dic 27",
  "Gen 28", "Feb 28", "Mar 28", "Apr 28", "Mag 28", "Giu 28",
  "Lug 28", "Ago 28", "Set 28", "Ott 28", "Nov 28", "Dic 28",
];

const donorJourneys = [
  {
    id: "regulars",
    name: "Donatori Regolari",
    focus: "Retention e continuità",
    objective: "Consolidare la fedeltà, prevenire il churn e proporre upgrade coerenti senza trasformare ogni contatto in una richiesta.",
    kpis: ["Retention", "Churn", "Upgrade importo"],
    rows: [
      { channel: "Postale (DM)", type: "postal", touchpoints: [
        { month: 5, label: "Lettera caring di Natale con firma della Presidenza." },
        { month: 11, label: "Rendiconto d’impatto annuale cartaceo dedicato." },
        { month: 17, label: "Campagna natalizia personalizzata con ringraziamento." },
      ] },
      { channel: "Digital (DEM)", type: "digital", touchpoints: [
        { month: 2, label: "DEM di ringraziamento e impatto." },
        { month: 5, label: "Video auguri di Natale dal personale VIDAS." },
        { month: 8, label: "Aggiornamento sui progetti di assistenza." },
        { month: 11, label: "Newsletter d’impatto interattiva." },
        { month: 14, label: "DEM d’autunno sull’assistenza medica." },
        { month: 17, label: "Auguri di buone feste multicanale." },
      ] },
      { channel: "One-to-One / TM", type: "one2one", touchpoints: [
        { month: 4, label: "Telefonata di caring senza ask monetario." },
        { month: 16, label: "Chiamata di upgrade dell’importo mensile." },
      ] },
    ],
  },
  {
    id: "small-middle",
    name: "Small & Middle",
    focus: "Upgrade e multicanalità",
    objective: "Coordinare DM, rinforzo digitale e telemarketing per far crescere valore e frequenza senza duplicare la pressione.",
    kpis: ["Upgrade", "Second gift", "Conversione regular"],
    rows: [
      { channel: "Postale (DM)", type: "postal", touchpoints: [
        { month: 4, label: "Campagna autunno con lettera personalizzata." },
        { month: 5, label: "Grande campagna di Natale VIDAS." },
        { month: 9, label: "Campagna di Pasqua cartacea." },
        { month: 16, label: "Campagna autunno 2028." },
        { month: 17, label: "Campagna di Natale 2028." },
      ] },
      { channel: "Digital (DEM)", type: "digital", touchpoints: [
        { month: 4, label: "DEM di rinforzo entro 48 ore dal mailing." },
        { month: 5, label: "Auguri e percorso di donazione rapido." },
        { month: 9, label: "Sinergia digitale alla campagna di Pasqua." },
        { month: 16, label: "DEM di supporto autunnale." },
        { month: 17, label: "Rinforzo digitale natalizio." },
      ] },
      { channel: "One-to-One / TM", type: "one2one", touchpoints: [
        { month: 10, label: "Campagna telefonica di conversione in regolare per donatori plurimi." },
      ] },
    ],
  },
  {
    id: "hvd",
    name: "High Value Donors",
    focus: "Relazione ad personam",
    objective: "Portare Big, Top e VIP fuori dal ciclo massivo, costruendo riconoscimento, accesso e relazione continuativa con la missione.",
    kpis: ["Retention HVD", "Meeting", "Upgrade"],
    rows: [
      { channel: "Postale (DM)", type: "postal", touchpoints: [
        { month: 5, label: "Lettera istituzionale di Natale con firma autografa." },
        { month: 17, label: "Ringraziamento esclusivo di fine anno." },
      ] },
      { channel: "Digital (DEM)", type: "digital", touchpoints: [
        { month: 0, label: "Aggiornamento privato dalla Direzione." },
        { month: 6, label: "Save the date per evento dedicato." },
        { month: 12, label: "Report d’impatto riservato." },
      ] },
      { channel: "One-to-One", type: "one2one", touchpoints: [
        { month: 3, label: "Invito ad personam a evento o visita in Hospice." },
        { month: 5, label: "Telefonata di auguri personalizzata." },
        { month: 11, label: "Incontro relazionale sui grandi progetti." },
        { month: 17, label: "Auguri telefonici di fine anno." },
      ] },
    ],
  },
  {
    id: "lapsed",
    name: "Lapsed / Ex-donatori",
    focus: "Riattivazione selettiva",
    objective: "Usare la priorità prodotta dal Modello A per concentrare i contatti sui profili con maggiore probabilità di ritorno.",
    kpis: ["Reactivation rate", "ROI", "Costo per riattivato"],
    rows: [
      { channel: "Postale (DM)", type: "postal", touchpoints: [
        { month: 5, label: "Pacchetto speciale di riattivazione natalizio." },
        { month: 17, label: "Campagna Natale 2028 per ex-donatori." },
      ] },
      { channel: "Digital (DEM)", type: "digital", touchpoints: [
        { month: 4, label: "Campagna email di re-engagement." },
        { month: 16, label: "DEM d’autunno mirata alla riattivazione." },
      ] },
      { channel: "One-to-One / TM", type: "one2one", touchpoints: [
        { month: 6, label: "Campagna TM sul cluster profilato ad alto valore." },
      ] },
    ],
  },
  {
    id: "prospect",
    name: "Prospect & Lead",
    focus: "Benvenuto e conversione",
    objective: "Trasformare il primo interesse in conoscenza della missione, fiducia e prima donazione attraverso un welcome journey progressivo.",
    kpis: ["First gift", "Tempo alla conversione", "Costo acquisizione"],
    rows: [
      { channel: "Postale (DM)", type: "postal", touchpoints: [
        { month: 17, label: "Primo invito postale natalizio per lead digitali caldi." },
      ] },
      { channel: "Digital / ADV", type: "digital", touchpoints: [
        { month: 0, label: "Welcome 1: chi siamo e la nostra missione." },
        { month: 1, label: "Welcome 2: storia di un’assistenza." },
        { month: 2, label: "Welcome 3: il valore del tuo aiuto e prima richiesta." },
        { month: 6, label: "Lead generation digitale." },
        { month: 12, label: "Nuovo ciclo di acquisizione e benvenuto." },
      ] },
      { channel: "One-to-One / TM", type: "one2one", touchpoints: [
        { month: 3, label: "Chiamata di ringraziamento e benvenuto." },
      ] },
    ],
  },
];

const ganttMonths = [
  "Feb 27", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
  "Gen 28", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
];

const ganttRows = [
  {
    phase: "F1",
    title: "Assessment",
    detail: "KPI, fonti disponibili, database, interviste e baseline",
    start: 0,
    span: 3,
    tone: "cyan",
  },
  {
    phase: "F1",
    title: "Fotografia donor journey",
    detail: "Target, canali, campagne e pressione",
    start: 0,
    span: 3,
    tone: "cyan",
  },
  {
    phase: "F1",
    title: "SWOT",
    detail: "Sintesi quantitativa e qualitativa",
    start: 0,
    span: 3,
    tone: "cyan",
  },
  {
    phase: "F2",
    title: "Analisi e prototipazione dei modelli",
    detail: "Procedure ETL, analisi dei modelli e prototipi",
    start: 2,
    span: 3,
    tone: "blue",
  },
  {
    phase: "F2",
    title: "Elaborazione segmenti",
    detail: "Priorità, sovrapposizioni e KPI",
    start: 3,
    span: 3,
    tone: "blue",
  },
  {
    phase: "F2",
    title: "Donor journey per segmenti",
    detail: "Touchpoint, tempi, obiettivi e KPI",
    start: 4,
    span: 4,
    tone: "blue",
  },
  {
    phase: "F3",
    title: "Integrazione e automazione con Mentor",
    detail: "ETL, audience, alert, estrazioni e donor care",
    start: 6,
    span: 4,
    tone: "red",
  },
  {
    phase: "F4",
    title: "Sviluppo Qlik",
    detail: "Dashboard e lettura condivisa dei KPI",
    start: 9,
    span: 14,
    tone: "yellow",
  },
  {
    phase: "F4",
    title: "Monitoraggio",
    detail: "Performance, apprendimento e revisione periodica",
    start: 9,
    span: 14,
    tone: "green",
  },
];

const team = [
  {
    name: "Marco Bellati",
    role: "Responsabile Data Quality · continuità VIDAS",
    org: "DataProsper",
    image: "/team/marco-bellati.jpg",
  },
  {
    name: "Fiorenza Castelvetere",
    role: "Strategist",
    org: "DataProsper",
    image: "/team/fiorenza-castelvetere.jpg",
  },
  {
    name: "Fabio Molari",
    role: "Direttore dati e analisi",
    org: "DataProsper",
    image: "/team/fabio-molari.jpg",
  },
  {
    name: "Antonio Schirone",
    role: "Direttore creativo",
    org: "DataProsper",
    image: "/team/antonio-schirone.jpg",
  },
  {
    name: "Marie Amadei",
    role: "Advisor",
    org: "DataProsper",
    image: "/team/marie-amadei.jpg",
  },
  {
    name: "Sebastiano Moneta",
    role: "Founder",
    org: "DataProsper",
    image: "/team/sebastiano-moneta.jpg",
  },
];

const teamProposalReasons = [
  {
    code: "01",
    signal: "Il fattore Marco Bellati",
    title: "Conosce l’infrastruttura d’origine del database VIDAS.",
    body: "Marco Bellati conosce la logica di transizione verso il CRM attuale. Questa continuità riduce concretamente il rischio di incompatibilità tecnica segnalato nel brief, in particolare rispetto all’applicabilità quotidiana su CRM Mentor e BI Qlik.",
    proof: "Continuità tecnica · CRM Mentor e BI Qlik",
  },
  {
    code: "02",
    signal: "Perché siamo diversi",
    title: "Non siamo semplici fornitori di liste prospect.",
    body: "Conosciamo storicamente il database VIDAS grazie alle analisi annuali condotte con ProsperData. Nel tempo abbiamo accumulato una conoscenza profonda dei pattern comportamentali dei donatori, che permette di iniziare il progetto da un livello di consapevolezza già avanzato.",
    proof: "Conoscenza storica · analisi ProsperData",
  },
];

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function BrandLockup({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand-lockup ${light ? "brand-lockup--light" : ""}`} href="#top" aria-label="ProsperData Engine, torna all'inizio">
      <span className="brand-lockup__prosper">ProsperData</span>
      <span className="brand-lockup__engine">Engine</span>
    </a>
  );
}

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeModel, setActiveModel] = useState(0);
  const [activeCurrentSegment, setActiveCurrentSegment] = useState(0);
  const [activeJourney, setActiveJourney] = useState(0);
  const [journeyDetail, setJourneyDetail] = useState<{ title: string; text: string } | null>(null);
  useReveal();

  const stage = engineStages[activeStage];
  const model = teamModels[activeModel];
  const currentSegment = currentJourneySegments[activeCurrentSegment];
  const journey = donorJourneys[activeJourney];
  const progress = useMemo(() => `${((activeStage + 1) / engineStages.length) * 100}%`, [activeStage]);

  return (
    <main id="top">
      <header className="site-header">
        <BrandLockup light />
        <nav aria-label="Navigazione principale">
          <a href="#vidas">La sfida</a>
          <a href="#proposal">La proposta</a>
          <a href="#engine">L’Engine</a>
          <a href="#journey">Journey</a>
          <a href="#operations">Il sistema</a>
          <a href="#delivery">Delivery</a>
          <a href="#why-us">Perché noi</a>
        </nav>
        <div className="header-vidas" aria-label="Proposta per VIDAS 2027">
          <img src="/vidas.png" alt="VIDAS" />
          <span>Proposta · 2027</span>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__ghost" aria-hidden="true">ENGINE</div>
        <div className="hero__copy" data-reveal>
          <p className="eyebrow eyebrow--light">Gara analisi e segmentazione donatori VIDAS · Luglio 2026</p>
          <div className="hero__vidas-lockup">
            <img src="/vidas.png" alt="VIDAS" />
            <span>Brief Analisi e Segmentazione VIDAS</span>
          </div>
          <h1 id="hero-title">
            ProsperData
            <span>Engine</span>
          </h1>
          <p className="hero__descriptor">Sistema di intelligence, segmentazione e attivazione</p>
          <p className="hero__lead">
            La risposta di DataProsper e Kiwi Data Science al brief VIDAS: un’architettura donor-level che trasforma dati, stati e segnali in decisioni operative per fundraising, donor care e CRM.
          </p>
          <a className="text-link text-link--light" href="#story">
            Scopri la proposta <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="engine-orbit" aria-label="Le quattro componenti del motore">
          <div className="engine-orbit__ring engine-orbit__ring--outer" />
          <div className="engine-orbit__ring engine-orbit__ring--inner" />
          <div className="engine-orbit__core">
            <span>VIDAS</span>
            <strong>DONOR</strong>
            <small>DECISION ENGINE</small>
          </div>
          {engineStages.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`orbit-node orbit-node--${index + 1}`}
              onClick={() => setActiveStage(index)}
              aria-label={`Apri ${item.label}`}
            >
              <span>{item.number}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hero__index">
          <span>01</span>
          <div />
          <span>ProsperData Engine × VIDAS</span>
        </div>
      </section>

      <section className="brief-premise section" aria-labelledby="brief-premise-title">
        <div className="section-kicker" data-reveal>
          <span>00</span>
          <p>Premessa · Contesto e obiettivo</p>
        </div>

        <div className="brief-premise__opening" data-reveal>
          <h2 id="brief-premise-title">La visione di VIDAS<br />e il brief</h2>
          <div className="brief-premise__summary">
            <p>VIDAS sta avviando una riflessione strategica sull’evoluzione del proprio modello di fundraising data-driven, con l’obiettivo di rafforzare la capacità di analisi del database donatori e migliorare l’efficacia delle strategie di raccolta fondi.</p>
          </div>
        </div>

        <div className="brief-premise__changes" data-reveal>
          <div className="brief-premise__changes-title">
            <span>PERCHÉ IL MODELLO DEVE EVOLVERE</span>
            <h3>Quattro cambiamenti<br />da affrontare insieme.</h3>
          </div>
          <ol className="brief-premise__changes-list">
            <li><span>01</span><strong>Evoluzione del database e del comportamento dei donatori</strong></li>
            <li><span>02</span><strong>Crescita delle attività digitali e multicanale</strong></li>
            <li><span>03</span><strong>Maggiore personalizzazione delle strategie di engagement</strong></li>
            <li><span>04</span><strong>Obiettivi di crescita sulle fasce middle e major donor</strong></li>
          </ol>
        </div>

        <div className="brief-premise__dataprosper-quote" data-reveal>
          <blockquote>
            <p><em>“Trasformiamo i dati in valore.”</em></p>
            <footer>DataProsper</footer>
          </blockquote>
        </div>
      </section>

      <section className="story-map section" id="story" aria-labelledby="story-title">
        <div className="story-map__header" data-reveal>
          <div className="story-map__heading">
            <span>LA PROPOSTA IN SINTESI</span>
            <h2 id="story-title">Sette capitoli.<br />Un’unica progressione.</h2>
          </div>
          <p>Dalla sfida di VIDAS alla messa a terra: ogni capitolo prepara il successivo.</p>
        </div>
        <nav className="story-map__chapters" aria-label="Indice della proposta" data-reveal>
          {[
            ["01", "La sfida VIDAS", "Perché il modello deve evolvere", "#vidas"],
            ["02", "La proposta", "Come affrontiamo il progetto", "#proposal"],
            ["03", "ProsperData Engine", "Sei modelli, una priorità operativa", "#engine"],
            ["04", "Donor Journey", "Dalla segmentazione alla relazione", "#journey"],
            ["05", "Il sistema nel quotidiano", "Engine, Mentor e Qlik", "#operations"],
            ["06", "La delivery", "Sviluppo, rilascio e monitoraggio", "#delivery"],
            ["07", "Perché DataProsper", "Partnership, continuità e team", "#why-us"],
          ].map(([code, title, body, href]) => (
            <a href={href} key={code}>
              <span>{code}</span>
              <strong>{title}</strong>
              <small>{body}</small>
            </a>
          ))}
        </nav>
      </section>

      <section className="vidas-brief section" id="vidas">
        <div className="section-kicker" data-reveal>
          <span>01</span>
          <p>La sfida VIDAS</p>
        </div>

        <div className="vidas-brief__headline" data-reveal>
          <h2>VIDAS non sta chiedendo<br />più segmenti.</h2>
          <h2 className="outline">Sta chiedendo una nuova<br />capacità decisionale.</h2>
        </div>

        <div className="vidas-brief__context" data-reveal>
          <p>
            VIDAS ha avviato una riflessione strategica per far evolvere il proprio modello di fundraising data-driven. La segmentazione definita nel 2020 ha reso la raccolta più chiara, semplice e utilizzabile. Oggi quella base va potenziata, non rinnegata.
          </p>
          <p>
            Il salto richiesto è passare dalle esigenze di campagna a una lettura continuativa del donatore. Senza una funzione interna dedicata all’analisi avanzata, il nuovo framework deve essere rigoroso ma anche sostenibile nell’operatività quotidiana.
          </p>
        </div>

        <div className="brief-reasons" data-reveal>
          <div className="brief-reasons__label">
            <span>PERCHÉ ORA</span>
            <strong>Quattro cambiamenti,<br />una sola esigenza.</strong>
          </div>
          <article>
            <span>01</span>
            <p>Il database e i comportamenti dei donatori si sono evoluti.</p>
          </article>
          <article>
            <span>02</span>
            <p>Digitale e multicanale hanno aumentato segnali e complessità.</p>
          </article>
          <article>
            <span>03</span>
            <p>Engagement, retention e donor journey richiedono più personalizzazione.</p>
          </article>
          <article>
            <span>04</span>
            <p>La crescita middle e major richiede una pipeline più leggibile.</p>
          </article>
        </div>

        <div className="brief-snapshot" data-reveal>
          <div className="brief-snapshot__intro">
            <span>SNAPSHOT DEL BRIEF</span>
            <h3>La struttura attuale<br />da cui partiamo.</h3>
            <p>Volumi indicativi condivisi da VIDAS.</p>
          </div>
          {[
            ["~29k", "Small", "0–99€"],
            ["~12k", "Mini middle", "100–249€"],
            ["~4.800", "Middle", "250–999€"],
            ["~630", "Big", "1.000–4.999€"],
            ["~72", "Top", "5.000–10.000€"],
            ["~12", "VIP", ">10.000€"],
          ].map(([value, label, range]) => (
            <div className="brief-snapshot__stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{range}</small>
            </div>
          ))}
        </div>

        <div className="brief-insight" data-reveal>
          <span>IL NODO DA SCIOGLIERE</span>
          <strong>Una fascia monetaria dice quanto.<br />Non dice cosa sta succedendo.</strong>
          <p>Lo stesso segmento può contenere un nuovo donatore, una relazione in crescita e una relazione che sta rallentando. Per decidere serve una lettura comportamentale, non un’altra tabella di fasce.</p>
        </div>
      </section>

      <section className="proposal section" id="proposal">
        <div className="section-kicker" data-reveal>
          <span>02</span>
          <p>La nostra proposta</p>
        </div>
        <div className="proposal__header" data-reveal>
          <h2>Comprendere. Modellare.<br />Attivare. Migliorare.</h2>
          <p>
            La risposta al brief è un percorso in quattro fasi cumulative. Ogni fase produce un output utilizzabile dalla successiva e porta VIDAS dalla diagnosi alla capacità operativa interna.
          </p>
        </div>
        <div className="proposal-phases" data-reveal>
          {[
            ["01", "Analisi & Assessment", "Capire cosa accade oggi", "KPI e obiettivi · processi di donor care · database e strumenti · interviste · donor journey attuale · SWOT integrata"],
            ["02", "Modelli & Segmenti", "Costruire nuove letture", "Sei modelli DataProsper · integrazione delle sovrapposizioni · KPI per segmento"],
            ["03", "Implementazione su CRM", "Trasformare insight in operatività", "Campi e regole Mentor · dashboard Qlik · audience · pilot · formazione"],
            ["04", "Monitoraggio Continuo", "Imparare dai risultati", "Performance · lift · drift · calibrazione · governance · handover"],
          ].map(([code, title, claim, body]) => (
            <article key={code}>
              <span>FASE {code}</span>
              <h3>{title}</h3>
              <strong>{claim}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="proposal-outcomes" data-reveal>
          <span>I TRE RISULTATI RICHIESTI DA VIDAS</span>
          <div><strong>01</strong><p>Analisi multidimensionale</p></div>
          <div><strong>02</strong><p>Segmentazione evoluta</p></div>
          <div><strong>03</strong><p>Operativizzazione in Mentor e Qlik</p></div>
        </div>
      </section>

      <section className="phase-one phase-one--journey section" id="phase-one">
        <div className="section-kicker" data-reveal>
          <span>2.1</span>
          <p>Fase 1 · Assessment e fotografia del donor journey attuale</p>
        </div>
        <div className="phase-one__header" data-reveal>
          <h2>Leggiamo dati, KPI<br />e lavoro reale.</h2>
          <p>L’assessment mette in relazione qualità e dimensioni del database, KPI attuali e attesi, informazioni disponibili e pratiche operative. In parallelo analizziamo i processi di donor care per capire come VIDAS gestisce oggi la relazione: dalla presa in carico al follow-up, fino alla registrazione degli esiti.</p>
        </div>

        <div className="assessment-scope" data-reveal>
          <article><span>01</span><strong>KPI e obiettivi</strong><p>Definizioni, fonti, baseline, frequenze e responsabilità per retention, upgrade, riattivazione e fundraising.</p></article>
          <article><span>02</span><strong>Patrimonio informativo</strong><p>Donazioni, campagne, modalità di pagamento, canali e dati relazionali disponibili.</p></article>
          <article><span>03</span><strong>Processi di donor care</strong><p>Trigger, presa in carico, ruoli, passaggi tra team, follow-up, strumenti utilizzati ed esiti tracciati.</p></article>
          <article><span>04</span><strong>Strumenti e flussi</strong><p>Database e procedure ETL. Interviste VIDAS con fundraising, CRM, comunicazione e donor care.</p></article>
        </div>

        <div className="donor-care-assessment" data-reveal>
          <div className="donor-care-assessment__lead">
            <span>FOCUS OPERATIVO · DONOR CARE</span>
            <strong>Non osserviamo solo i touchpoint.<br />Ricostruiamo il processo.</strong>
            <p>L’obiettivo è capire dove la relazione funziona, dove si interrompe e quali informazioni devono diventare KPI, segnali e regole per l’Engine.</p>
          </div>
          <div className="donor-care-assessment__steps" aria-label="Ambiti di analisi dei processi di donor care">
            <article><span>01</span><strong>Segnale e ingresso</strong><p>Come nasce una richiesta o un’opportunità di relazione.</p></article>
            <i aria-hidden="true">→</i>
            <article><span>02</span><strong>Presa in carico</strong><p>Chi interviene, con quali strumenti, tempi e criteri.</p></article>
            <i aria-hidden="true">→</i>
            <article><span>03</span><strong>Esito e tracciamento</strong><p>Che cosa viene registrato e come alimenta le decisioni successive.</p></article>
          </div>
        </div>

        <div className="illustrative-note" data-reveal>
          <span>ESEMPIO ILLUSTRATIVO</span>
          <p>Le visualizzazioni che seguono mostrano il metodo di osservazione. Segmenti, volumi, pressioni e touchpoint saranno verificati durante l’assessment con il team VIDAS.</p>
        </div>

        <div className="current-segment-tabs" role="tablist" aria-label="Seleziona il segmento attuale" data-reveal>
          {currentJourneySegments.map((segment, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeCurrentSegment === index}
              className={activeCurrentSegment === index ? "is-active" : ""}
              key={segment.id}
              onClick={() => setActiveCurrentSegment(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{segment.name}</strong>
              <small>{segment.monetary} · {segment.volume}</small>
            </button>
          ))}
        </div>

        <div className="current-journey" role="tabpanel" data-reveal>
          <aside className="current-journey__profile">
            <span>SEGMENTO ATTUALE</span>
            <h3>{currentSegment.name}</h3>
            <dl>
              <div><dt>Monetary</dt><dd>{currentSegment.monetary}</dd></div>
              <div><dt>Recency</dt><dd>{currentSegment.recency} mesi</dd></div>
              <div><dt>Volumi</dt><dd>{currentSegment.volume}</dd></div>
              <div><dt>Area</dt><dd>Individui</dd></div>
            </dl>
          </aside>

          <div className="current-journey__rhythm">
            <div className="rhythm-months" aria-hidden="true">
              <span />
              <div className="rhythm-months__labels">
                {currentJourneyMonths.map((month) => <small key={month}>{month}</small>)}
              </div>
            </div>
            {currentJourneyChannels.map((channel) => (
              <div className={`rhythm-track rhythm-track--${channel.id}`} key={channel.id}>
                <div className="rhythm-track__label">
                  <strong>{channel.name}</strong>
                  <small>{channel.note}</small>
                </div>
                <div className="rhythm-track__line">
                  {currentJourneyMonths.map((month, monthIndex) => {
                    const isActive = channel.active.includes(monthIndex);
                    const label = channel.id === "postal"
                      ? `HM${String(monthIndex + 1).padStart(2, "0")}`
                      : channel.id === "email" ? "@" : "TEL";
                    return (
                      <span className={isActive ? "is-active" : ""} key={`${channel.id}-${month}`}>
                        {isActive ? label : ""}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="current-journey__reading">
              <span>CHE COSA RENDE VISIBILE</span>
              <p>La pressione reale sul donatore, la compresenza dei canali e i momenti in cui una campagna può essere coordinata, differenziata o alleggerita.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="phase-one phase-one--campaign section">
        <div className="section-kicker section-kicker--light" data-reveal>
          <span>2.2</span>
          <p>Fase 1 · Dettaglio per campagna e target</p>
        </div>
        <div className="phase-one__header phase-one__header--light" data-reveal>
          <h2>La stessa campagna.<br />Tre relazioni diverse.</h2>
          <p>Il secondo livello scende dentro la singola campagna. ASK, lettera e messaggio cambiano in funzione del valore e del profilo del segmento: è qui che la segmentazione diventa personalizzazione reale.</p>
        </div>

        <div className="illustrative-note illustrative-note--light" data-reveal>
          <span>ESEMPIO ILLUSTRATIVO</span>
          <p>Il dettaglio mostra come la stessa campagna possa cambiare per target. Messaggi, ASK e obiettivi saranno definiti sulla base delle evidenze emerse nella Fase 1.</p>
        </div>

        <div className="campaign-switcher" role="tablist" aria-label="Confronta la personalizzazione per segmento" data-reveal>
          {currentJourneySegments.map((segment, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeCurrentSegment === index}
              className={activeCurrentSegment === index ? "is-active" : ""}
              key={segment.id}
              onClick={() => setActiveCurrentSegment(index)}
            >
              {segment.name}
            </button>
          ))}
        </div>

        <div className="campaign-story" role="tabpanel" data-reveal>
          <article className="campaign-letter">
            <div className="campaign-letter__top">
              <span>VIDAS</span>
              <small>HM01 · GENNAIO</small>
            </div>
            <div className="campaign-letter__code">{currentSegment.letter}</div>
            <div className="campaign-letter__copy">
              <small>LETTERA {currentSegment.letter} · {currentSegment.name.toUpperCase()}</small>
              <h3>{currentSegment.headline}</h3>
              <p>{currentSegment.message}</p>
            </div>
            <div className="campaign-letter__footer">Messaggio dedicato · ASK calibrato</div>
          </article>

          <div className="campaign-logic">
            <div className="campaign-logic__intro">
              <span>LOGICA DI PERSONALIZZAZIONE</span>
              <strong>{currentSegment.name}</strong>
            </div>
            <dl>
              <div><dt>Valore</dt><dd>{currentSegment.monetary}</dd></div>
              <div><dt>Recency</dt><dd>{currentSegment.recency} mesi</dd></div>
              <div><dt>ASK</dt><dd>{currentSegment.ask}</dd></div>
              <div><dt>Obiettivo</dt><dd>{currentSegment.objective}</dd></div>
            </dl>
          </div>
        </div>

        <div className="campaign-principle" data-reveal>
          <span>IL PRINCIPIO OPERATIVO</span>
          <strong>La segmentazione senza personalizzazione del messaggio non genera valore aggiunto misurabile.</strong>
        </div>
      </section>

      <section className="phase-one phase-one--swot section">
        <div className="section-kicker" data-reveal>
          <span>2.3</span>
          <p>Fase 1 · Analisi SWOT integrata</p>
        </div>
        <div className="phase-one__header" data-reveal>
          <h2>La fotografia diventa<br />una decisione condivisa.</h2>
          <p>L’analisi del database e l’assessment del piano comunicativo non restano due esercizi separati. Confluiscono in una sintesi unica, leggibile e azionabile.</p>
        </div>

        <div className="swot-synthesis" data-reveal>
          <article className="swot-source swot-source--quant">
            <span>EVIDENZE QUANTITATIVE</span>
            <h3>Che cosa dicono i dati</h3>
            <ul>
              <li>Tasso di retention</li>
              <li>Valore medio per segmento</li>
              <li>Tasso di apertura DEM</li>
            </ul>
          </article>

          <div className="swot-core" aria-label="Sintesi SWOT integrata">
            <i className="swot-core__letter swot-core__letter--s">S</i>
            <i className="swot-core__letter swot-core__letter--w">W</i>
            <i className="swot-core__letter swot-core__letter--o">O</i>
            <i className="swot-core__letter swot-core__letter--t">T</i>
            <span>SINTESI</span>
            <strong>SWOT<br />integrata</strong>
            <small>Una sola base decisionale</small>
          </div>

          <article className="swot-source swot-source--qual">
            <span>EVIDENZE QUALITATIVE</span>
            <h3>Che cosa mostra il journey</h3>
            <ul>
              <li>Coerenza dei messaggi</li>
              <li>Pressione e ruolo dei canali</li>
              <li>Opportunità non sfruttate</li>
            </ul>
          </article>
        </div>

        <div className="swot-output" data-reveal>
          <span>OUTPUT DELLA FASE 1</span>
          <strong>Priorità strategiche che orientano segmenti, modelli, journey e KPI della Fase 2.</strong>
          <small>Il sistema parte da qui ↓</small>
        </div>
      </section>

      <section className="engine-section" id="engine">
        <div className="section engine-section__intro">
          <div className="section-kicker section-kicker--light" data-reveal>
            <span>3.1</span>
            <p>Il cuore della proposta · Architettura decisionale</p>
          </div>
          <h2 data-reveal>I KPI definiscono cosa conta.<br />L’Engine decide come agire.</h2>
          <p data-reveal>
            Nella fase iniziale analizziamo con VIDAS i KPI esistenti e quelli necessari: definizioni, fonti, baseline, frequenze di aggiornamento e responsabilità. Su questa base i sei modelli leggono il database; ProsperData Engine integra queste letture e produce score e label, indicando per ogni donatore la priorità di azione e le ragioni che la determinano.
          </p>
          <div className="engine-kpi-bridge" data-reveal aria-label="Dall’analisi dei KPI all’attivazione dell’Engine">
            <article>
              <span>FASE 1 · ANALISI DEI KPI</span>
              <strong>Obiettivi, formule, fonti, baseline, frequenze e owner.</strong>
            </article>
            <div aria-hidden="true"><small>CRITERI CONDIVISI</small><i>→</i></div>
            <article>
              <span>FASE 2 · PROSPERDATA ENGINE</span>
              <strong>Score, label, priorità e azioni per ogni donatore.</strong>
            </article>
          </div>
        </div>

        <div className="engine-console section" data-tone={stage.tone}>
          <div className="engine-tabs" role="tablist" aria-label="Livelli del motore">
            {engineStages.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeStage === index}
                className={activeStage === index ? "is-active" : ""}
                key={item.id}
                onClick={() => setActiveStage(index)}
              >
                <span>{item.number}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="engine-console__progress" aria-hidden="true">
            <div style={{ width: progress }} />
          </div>

          <div className="engine-console__content" role="tabpanel">
            <div className="engine-console__question">
              <p>{stage.label}</p>
              <h3>{stage.question}</h3>
              <span>{stage.description}</span>
            </div>

            <div className="donor-record">
              <div className="donor-record__head">
                <span className="donor-record__id">A1</span>
                <div>
                  <strong>Donatore #A1027</strong>
                  <small>Record illustrativo · refresh mensile</small>
                </div>
                <span className="confidence">Confidence · alta</span>
              </div>
              <div className="donor-record__signals">
                {stage.evidence.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="donor-record__output">
                <small>OUTPUT</small>
                <strong>{stage.output}</strong>
              </div>
              <p className="reason-code">
                <span>Reason code</span>
                Frequenza in aumento + valore crescente + buona risposta email + pressione bassa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="models-section" id="models">
        <div className="models-section__header section">
          <div className="section-kicker section-kicker--light" data-reveal>
            <span>3.2</span>
            <p>Le sei letture DataProsper</p>
          </div>
          <div className="models-section__headline" data-reveal>
            <h2>Sei modelli specialistici.<br />Un’unica regia per VIDAS.</h2>
            <p>
              La proposta DataProsper articola sei letture complementari del donatore, ciascuna associata a un obiettivo operativo esplicito. ProsperData Engine governa le sovrapposizioni, assegna le priorità e trasforma i risultati dei modelli in decisioni attivabili.
            </p>
          </div>
        </div>

        <div className="model-stage section">
          <div className="model-index" role="tablist" aria-label="I sei modelli DataProsper">
            {teamModels.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeModel === index}
                className={activeModel === index ? "is-active" : ""}
                key={item.code}
                onClick={() => setActiveModel(index)}
              >
                <span>{item.code}</span>
                <strong>{item.name}</strong>
                <small>Obiettivo · {item.objective}</small>
              </button>
            ))}
          </div>

          <article className="model-detail" role="tabpanel" data-model-tone={model.tone} data-model-code={model.code}>
            <div className="model-detail__topline">
              <span>FASE 2 · MODELLO {model.code}</span>
              <small>{model.role}</small>
            </div>
            <h3>{model.code}. {model.name}</h3>
            <p className="model-detail__thesis">{model.thesis}</p>
            <div className="model-detail__objective">
              <span>OBIETTIVO</span>
              <strong>{model.objective}</strong>
            </div>
            <div className="model-detail__metric">
              <strong>{model.metric}</strong>
              <span>{model.metricLabel}</span>
            </div>
            <div className="model-detail__outputs">
              <span>{model.detailLabel}</span>
              <ul>
                {model.outputs.map((output) => <li key={output}>{output}</li>)}
              </ul>
              {model.code === "D" && <p>Ogni area produce uno score dedicato; gli score vengono poi ponderati in un unico indice di potenziale HVD.</p>}
            </div>
            {activeModel === 0 && (
              <a className="text-link" href="#rfm-lapsed">
                Apri il modello Lapsed <span aria-hidden="true">↓</span>
              </a>
            )}
            {model.code === "D" && (
              <a className="text-link" href="#hvd-strategy">
                Apri la strategia HVD <span aria-hidden="true">↓</span>
              </a>
            )}
          </article>
        </div>

        <div className="model-governance section" data-reveal>
          <div>
            <span>FASE 2 · ELABORAZIONE DEI SEGMENTI</span>
            <strong>La complessità dell’integrazione.</strong>
          </div>
          <p>
            Un donatore può essere contemporaneamente RFM Middle, ad alta propensione alla regolarizzazione e digitalmente ingaggiato. ProsperData Engine combina queste letture, stabilisce le priorità e restituisce le informazioni utili per le next best actions.
          </p>
          <div className="model-governance__formula" aria-label="Sei modelli definiscono le priorità e producono informazioni utili per le next best actions">
            <span>6 MODELLI</span><i>→</i><span>PRIORITÀ</span><i>→</i><strong>NEXT BEST ACTIONS</strong>
          </div>
        </div>
      </section>

      <section className="rfm-lapsed section" id="rfm-lapsed">
        <div className="section-kicker" data-reveal>
          <span>3.3</span>
          <p>Un esempio concreto · Modello A</p>
        </div>
        <div className="rfm-lapsed__header" data-reveal>
          <div>
            <span>FASE 2 · MODELLO A</span>
            <h2>A. RFM Avanzata —<br />Il Modello per i Lapsed</h2>
          </div>
          <p>
            Non tutti gli ex-donatori hanno lo stesso potenziale. Il modello combina comportamento storico, risposta alle campagne e dati di contesto per concentrare la riattivazione sui profili con maggiore capacità e probabilità di ritorno.
          </p>
        </div>

        <div className="lapsed-segments" data-reveal>
          <div className="lapsed-segments__label">
            <span>DA SEGMENTAZIONE<br />A PRIORITÀ</span>
          </div>
          <article>
            <span>LAPSED SMALL</span>
            <strong>1–249€</strong>
            <small>Recency 13+ · Riattivazione</small>
          </article>
          <article>
            <span>LAPSED MIDDLE</span>
            <strong>250–2.999€</strong>
            <small>Recency 13+ · Riattivazione prioritaria</small>
          </article>
          <div className="lapsed-segments__outcome">
            <span>OUTPUT</span>
            <strong>Propensione al ritorno · Priorità 1 / Priorità 2</strong>
          </div>
        </div>

        <div className="lapsed-process" data-reveal>
          <div className="lapsed-process__intro">
            <span>IL PROCESSO</span>
            <h3>Dal database storico<br />alla selezione chirurgica.</h3>
            <p>Ogni passaggio produce l’input verificabile per quello successivo.</p>
          </div>
          {[
            ["01", "Normalizzazione", "Costruzione del database di riferimento"],
            ["02", "Analisi", "Storico campagne, risposte e riattivazioni"],
            ["03", "Enrichment", "Arricchimento con fonti ammissibili"],
            ["04", "Sintesi", "Caratteristiche rilevanti e score composito"],
            ["05", "Selezione", "Segmenti con il maggiore potenziale"],
          ].map(([code, title, text]) => (
            <article key={code}>
              <span>{code}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="lapsed-data" data-reveal>
          <div className="lapsed-data__header">
            <span>DATA MIX PER I LAPSED</span>
            <h3>Quattro letture.<br />Un solo profilo di ritorno.</h3>
          </div>
          <article>
            <span>01</span>
            <h4>RFM storico VIDAS</h4>
            <p>Recency, frequenza, valore, trend e comportamento transazionale.</p>
          </article>
          <article>
            <span>02</span>
            <h4>Microzona ISTAT</h4>
            <p>Contesto socio-economico e territoriale, dove disponibile e pertinente.</p>
          </article>
          <article>
            <span>03</span>
            <h4>Dati anagrafici</h4>
            <p>Variabili utilizzabili, sottoposte a verifica di qualità, fairness e privacy.</p>
          </article>
          <article>
            <span>04</span>
            <h4>Fonti esterne</h4>
            <p>Dati autorizzati e comparabili per arricchire il profilo oltre la storia VIDAS.</p>
          </article>
        </div>

        <div className="lapsed-selection" data-reveal>
          <span>ENRICHMENT + SELEZIONE</span>
          <strong>Non una lista di comodo.<br />Un target qualificato per la riattivazione.</strong>
          <p>
            La selezione finale combina evidenze interne ed enrichment, assegna reason code leggibili e abilita campagne mirate: solo i profili con il potenziale più alto entrano nel pilot.
          </p>
          <div>
            <span>Dati VIDAS</span><i>+</i><span>Enrichment</span><i>→</i><span>Score di ritorno</span><i>→</i><strong>Pilot lapsed</strong>
          </div>
        </div>
      </section>

      <section className="hvd-strategy" id="hvd-strategy" aria-labelledby="hvd-strategy-title">
        <div className="hvd-strategy__hero section">
          <div className="section-kicker section-kicker--light" data-reveal>
            <span>3.4</span>
            <p>Modello D · High Value Donor</p>
          </div>

          <div className="hvd-strategy__headline" data-reveal>
            <h2 id="hvd-strategy-title">HVD non è una fascia economica.<br />È una strategia di relazione.</h2>
            <p>
              Oggi Big, Top e VIP possono mescolare valore cumulato annuo e singole donazioni elevate. Il modello HVD separa questi segnali, stima il potenziale reale e concentra il caring sui profili che richiedono una relazione dedicata.
            </p>
          </div>

          <div className="hvd-strategy__shift" data-reveal>
            <article>
              <span>IL LIMITE ATTUALE</span>
              <strong>Quanto ha donato non basta a dire quanto vale la relazione.</strong>
            </article>
            <i aria-hidden="true">→</i>
            <article>
              <span>LA STRATEGIA HVD</span>
              <strong>Potenziale, contesto relazionale e comportamento guidano una priorità unica.</strong>
            </article>
          </div>
        </div>

        <div className="hvd-strategy__body section">
          <div className="hvd-strategy__body-head" data-reveal>
            <span>LA STRATEGIA IN QUATTRO PASSAGGI</span>
            <h3>Dal database a una relazione ad personam.</h3>
          </div>

          <div className="hvd-strategy__steps" data-reveal>
            <article>
              <span className="hvd-step__number">01</span>
              <small>CALCOLARE IL POTENZIALE</small>
              <h4>Tre macro-score producono un indice HVD.</h4>
              <ul>
                <li><strong>Network aziendale</strong> · ruolo e potenziale professionale</li>
                <li><strong>Geo-intelligence</strong> · capacità contributiva territoriale</li>
                <li><strong>RFM</strong> · comportamento cumulato e dono puntuale</li>
              </ul>
            </article>

            <article>
              <span className="hvd-step__number">02</span>
              <small>QUALIFICARE LA RELAZIONE</small>
              <h4>I tag spiegano il contesto, non solo il valore.</h4>
              <p>Donazioni in memoria, familiari di assistiti, lutto ed eventi commemorativi guidano linguaggio, esclusioni e caring.</p>
            </article>

            <article>
              <span className="hvd-step__number">03</span>
              <small>CLASSIFICARE TUTTA LA BASE</small>
              <h4>Il percentile trasforma lo score in una priorità.</h4>
              <div className="hvd-percentiles" aria-label="Classificazione HVD per percentile">
                <div className="is-hvd"><strong>96–99°</strong><span>HVD attivo</span></div>
                <div><strong>90–95°</strong><span>Pre-HVD</span></div>
                <div><strong>50–89°</strong><span>Middle potential</span></div>
                <div><strong>0–49°</strong><span>Base</span></div>
              </div>
            </article>

            <article>
              <span className="hvd-step__number">04</span>
              <small>ATTIVARE IL CARING</small>
              <h4>Gli HVD escono dal circuito massivo.</h4>
              <ul>
                <li>Uscita dai 12 mailing standard</li>
                <li>Comunicazione e momenti ad personam</li>
                <li>Firma della Presidenza e riconoscimento</li>
              </ul>
            </article>
          </div>

          <div className="hvd-strategy__horizon" data-reveal>
            <strong>2 anni</strong>
            <div>
              <span>ORIZZONTE MINIMO DELLA STRATEGIA</span>
              <p>I progressi si valutano su KPI annuali — retention HVD, meeting, upgrade e grandi doni — non sulla risposta alla singola campagna.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="journey section" id="journey">
        <div className="section-kicker" data-reveal>
          <span>04</span>
          <p>Dai segmenti alla relazione</p>
        </div>
        <div className="journey__header" data-reveal>
          <div>
            <span>FASE 2</span>
            <h2>Sviluppo del Donor Journey<br />per i Nuovi Segmenti</h2>
          </div>
          <p>
            Il donor journey non è un semplice piano di comunicazione: è il progetto della relazione tra VIDAS e ogni tipologia di donatore nel tempo. Ogni segmento riceve un percorso costruito sui suoi comportamenti, motivazioni e potenziale di crescita.
          </p>
        </div>

        <div className="journey-principles" data-reveal>
          {[
            ["01", "Definizione Touchpoint", "Postale, email, telefono e digitale: priorità e sequenza dipendono dal profilo."],
            ["02", "Timing e Frequenza", "La pressione viene calibrata per evitare sovra-esposizione e silenzi nei momenti chiave."],
            ["03", "Obiettivi per Tappa", "Primo contatto, retention, upgrade, regolarizzazione o riattivazione: ogni interazione ha uno scopo."],
            ["04", "KPI e Monitoraggio", "Metriche specifiche per segmento e tappa, misurabili e revisionate nel tempo."],
          ].map(([code, title, body]) => (
            <article key={code}>
              <span>{code}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>

        <div className="journey-kpi" data-reveal>
          <div>
            <span>FASE 2 · OBIETTIVI E KPI PER SEGMENTO</span>
            <strong>La segmentazione diventa operativa solo quando ogni segmento ha un obiettivo misurabile.</strong>
          </div>
          <p>
            KPI e soglie vengono definiti con il team VIDAS e resi rilevabili negli strumenti quotidiani. Il journey è un documento vivo: risultati reali e cicli di revisione alimentano il miglioramento continuo.
          </p>
        </div>

        <div className="illustrative-note" data-reveal>
          <span>IPOTESI DI NUOVO DONOR JOURNEY</span>
          <p>Qui presentiamo un contact plan 2027–2028 che rende concreta la logica del modello e permette di comprenderne meglio il funzionamento. Target, touchpoint, frequenze e KPI sono esemplificativi e saranno progettati e validati con VIDAS.</p>
        </div>

        <div className="journey-planner" data-reveal>
          <div className="journey-planner__top">
            <div>
              <span>CONTACT PLAN STRATEGICO</span>
              <strong>2027—2028</strong>
            </div>
            <div className="journey-legend" aria-label="Legenda dei canali">
              <span><i className="postal" />Postale</span>
              <span><i className="digital" />Digital</span>
              <span><i className="one2one" />One-to-One / TM</span>
            </div>
          </div>

          <div className="journey-targets" role="tablist" aria-label="Seleziona il target del donor journey">
            {donorJourneys.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeJourney === index}
                className={activeJourney === index ? "is-active" : ""}
                key={item.id}
                onClick={() => {
                  setActiveJourney(index);
                  setJourneyDetail(null);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <small>{item.focus}</small>
              </button>
            ))}
          </div>

          <div className="journey-timeline" role="tabpanel">
            <div
              className="journey-timeline__grid"
              style={{ gridTemplateColumns: `180px repeat(${journeyMonths.length}, minmax(52px, 1fr))` }}
            >
              <div className="journey-timeline__corner">CANALI / TOUCHPOINT</div>
              {journeyMonths.map((month) => <div className="journey-timeline__month" key={month}>{month}</div>)}
              {journey.rows.map((row) => (
                <div className="journey-timeline__row" key={row.channel}>
                  <div className="journey-timeline__channel">{row.channel}</div>
                  {journeyMonths.map((month, monthIndex) => {
                    const touchpoint = row.touchpoints.find((item) => item.month === monthIndex);
                    return (
                      <div className="journey-timeline__cell" key={`${row.channel}-${month}`}>
                        {touchpoint && (
                          <button
                            type="button"
                            className={`journey-touchpoint ${row.type}`}
                            title={touchpoint.label}
                            aria-label={`${month}: ${touchpoint.label}`}
                            onClick={() => setJourneyDetail({ title: `${journey.name} · ${month}`, text: touchpoint.label })}
                          >
                            {row.type === "postal" ? "P" : row.type === "digital" ? "D" : "1:1"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="journey-detail" aria-live="polite">
            <div>
              <span>{journey.focus}</span>
              <strong>{journeyDetail?.title ?? journey.name}</strong>
              <p>{journeyDetail?.text ?? journey.objective}</p>
            </div>
            <div>
              <span>KPI DEL JOURNEY</span>
              <ul>{journey.kpis.map((kpi) => <li key={kpi}>{kpi}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="method implementation operations section" id="operations">
        <div className="section-kicker" data-reveal>
          <span>05</span>
          <p>Fase 3 · Il sistema entra nel lavoro quotidiano</p>
        </div>
        <div className="implementation__header" data-reveal>
          <h2>Il sistema entra<br />nel lavoro quotidiano.</h2>
          <p>Il sistema non procede in linea retta. Mentor è insieme fonte dei dati e ambiente di attivazione: invia il patrimonio informativo all’Engine tramite ETL e riceve label, score, audience e alert. Qlik legge i risultati e chiude il ciclo, riportando le revisioni verso assessment, KPI e modelli.</p>
        </div>
        <div className="system-map" data-reveal aria-label="Architettura ciclica tra assessment, KPI, Mentor, ProsperData Engine e Qlik">
          <section className="system-map__band system-map__band--design" aria-labelledby="system-design-title">
            <div className="system-map__band-heading">
              <span>FASE 1–2 · PROGETTAZIONE</span>
              <h3 id="system-design-title">Dagli obiettivi ai criteri del modello.</h3>
            </div>
            <div className="system-map__design-flow">
              <article>
                <span>FASE 1 · ASSESSMENT VIDAS</span>
                <strong>Definire ciò che conta.</strong>
                <p>KPI e obiettivi, informazioni disponibili, dimensioni del database, donor care e pratiche operative.</p>
              </article>
              <div className="system-map__arrow" aria-hidden="true"><small>DEFINISCE</small><i>→</i></div>
              <article>
                <span>FASE 2 · KPI E MODELLI</span>
                <strong>Tradurre gli obiettivi.</strong>
                <p>Analisi del modello, procedure ETL, prototipazione e criteri di validazione.</p>
              </article>
              <div className="system-map__arrow" aria-hidden="true"><small>PRODUCE</small><i>→</i></div>
              <article className="system-map__criteria">
                <span>INPUT PER L’ENGINE</span>
                <strong>Criteri e prototipi validati.</strong>
                <p>Le regole definite nelle prime due fasi guidano le elaborazioni successive.</p>
              </article>
            </div>
          </section>

          <section className="system-map__band system-map__band--runtime" aria-labelledby="system-runtime-title">
            <div className="system-map__band-heading system-map__band-heading--light">
              <span>FASE 3 · CICLO OPERATIVO</span>
              <h3 id="system-runtime-title">Mentor ed Engine si alimentano reciprocamente.</h3>
            </div>
            <div className="system-map__runtime-flow">
              <article className="system-map__mentor">
                <span>MENTOR CRM</span>
                <strong>Patrimonio e operatività.</strong>
                <ul><li>Dati e storico</li><li>Audience e alert</li><li>Estrazioni e donor care</li></ul>
              </article>
              <div className="system-map__exchange" aria-label="Scambio bidirezionale tra Mentor e ProsperData Engine">
                <div><span>ETL · DATI</span><i aria-hidden="true">→</i></div>
                <div><i aria-hidden="true">←</i><span>LABEL E SCORE · AUDIENCE E ALERT</span></div>
              </div>
              <article className="system-map__engine">
                <span>PROSPERDATA ENGINE</span>
                <strong>Elaborare e assegnare.</strong>
                <ul><li>Data quality</li><li>Applicazione dei modelli</li><li>Score, regole e label</li></ul>
              </article>
            </div>
          </section>

          <section className="system-map__band system-map__band--learning" aria-labelledby="system-learning-title">
            <div className="system-map__band-heading system-map__band-heading--learning">
              <h3 id="system-learning-title">I risultati dell’Engine entrano in Mentor. Qlik li rende leggibili.</h3>
              <p>I dati elaborati da ProsperData Engine vengono condivisi in Mentor sotto forma di label, score, audience e alert utilizzabili dal team VIDAS. Qlik rende KPI e risultati leggibili, alimentando un monitoraggio continuo.</p>
            </div>
            <div className="system-map__learning-flow">
              <article><span>01</span><strong>Risultati in Mentor</strong><p>Attivazioni, risposte ed esiti operativi.</p></article>
              <i aria-hidden="true">→</i>
              <article className="system-map__qlik"><span>02</span><strong>Qlik</strong><p>Dashboard, KPI e scostamenti.</p></article>
              <i aria-hidden="true">→</i>
              <article><span>03</span><strong>Monitoraggio</strong><p>Lettura delle performance e dei segnali.</p></article>
              <i aria-hidden="true">→</i>
              <article className="system-map__revision"><span>04 · REVISIONI</span><strong>Assessment, KPI e modelli</strong><p>Le evidenze aggiornano criteri, priorità e ciclo successivo.</p></article>
            </div>
            <div className="system-map__return">
              <i aria-hidden="true">↺</i>
              <div><strong>Il monitoraggio non chiude il progetto: riapre il ciclo.</strong><p>Ogni revisione alimenta nuovamente Fase 1, Fase 2 e ProsperData Engine.</p></div>
            </div>
          </section>
        </div>
      </section>

      <section className="roadmap" id="delivery">
        <div className="section roadmap__header">
          <div className="section-kicker section-kicker--light" data-reveal>
            <span>6.1</span>
            <p>Cronoprogramma · Gantt di progetto</p>
          </div>
          <h2 data-reveal>Dal setup<br />al monitoraggio continuo.</h2>
          <p data-reveal>Febbraio 2027 - dicembre 2028</p>
        </div>
        <div className="gantt section" data-reveal>
          <div className="gantt__months" aria-hidden="true" style={{ gridTemplateColumns: `330px repeat(${ganttMonths.length}, minmax(54px, 1fr))` }}>
            <span />
            {ganttMonths.map((month, index) => <strong key={`${month}-${index}`}>{month}</strong>)}
          </div>
          <div className="gantt__body">
            {ganttRows.map((row) => (
              <div className="gantt__row" key={`${row.phase}-${row.title}`}>
                <div className="gantt__label">
                  <span>{row.phase}</span>
                  <div><strong>{row.title}</strong><small>{row.detail}</small></div>
                </div>
                <div className="gantt__track" style={{ gridTemplateColumns: `repeat(${ganttMonths.length}, minmax(54px, 1fr))`, backgroundSize: `calc(100% / ${ganttMonths.length}) 100%` }} aria-label={`${row.title}: ${ganttMonths[row.start]} - ${ganttMonths[row.start + row.span - 1]}`}>
                  <i className={`gantt__bar gantt__bar--${row.tone}`} style={{ gridColumn: `${row.start + 1} / span ${row.span}` }}><b>{row.span > 2 ? `${row.span} mesi` : ""}</b></i>
                </div>
              </div>
            ))}
          </div>
          <div className="gantt__milestones">
            <span>FEB · AVVIO E ACCESSI</span>
            <span>APR · ASSESSMENT E SWOT CONDIVISI</span>
            <span>OTT · ENGINE E MENTOR INTEGRATI</span>
            <span>2028 · QLIK E MONITORAGGIO CONTINUO</span>
          </div>
        </div>
      </section>

      <section className="vidas-commitment section" aria-labelledby="vidas-commitment-title">
        <div className="section-kicker" data-reveal>
          <span>6.2</span>
          <p>Impegno di VIDAS</p>
        </div>
        <div className="vidas-commitment__header" data-reveal>
          <div>
            <h2 id="vidas-commitment-title">Un impegno distribuito.<br />Per validare insieme ciò che conta.</h2>
            <p>Il coinvolgimento del team VIDAS accompagna le tre fasi con intensità diverse: più operativo nell’assessment, progressivamente focalizzato su supervisione e validazione.</p>
          </div>
          <div className="vidas-commitment__total">
            <span>IMPEGNO COMPLESSIVO INDICATIVO</span>
            <strong>≈ 130</strong>
            <small>ore distribuite sulle tre fasi</small>
          </div>
        </div>
        <div className="vidas-commitment__phases" data-reveal>
          <article className="vidas-commitment__phase vidas-commitment__phase--primary">
            <div><span>FASE 1</span><strong>≈ 70 ore</strong></div>
            <h3>Assessment e processi attuali</h3>
            <p>Ore distribuite nell’arco di tre mesi e su più risorse, con una persona dedicata per ciascuna area coinvolta.</p>
            <ul>
              <li>Partecipazione alle interviste</li>
              <li>Descrizione dei processi attuali</li>
              <li>Validazione delle informazioni acquisite</li>
            </ul>
          </article>
          <article className="vidas-commitment__phase">
            <div><span>FASE 2</span><strong>≈ 30 ore</strong></div>
            <h3>Supervisione e validazione</h3>
            <p>Confronto sugli output intermedi, verifica delle ipotesi e validazione di KPI, criteri e modelli.</p>
          </article>
          <article className="vidas-commitment__phase vidas-commitment__phase--blue">
            <div><span>FASE 3</span><strong>≈ 30 ore</strong></div>
            <h3>Supervisione dell’integrazione</h3>
            <p>Presidio del raccordo con Mentor e Qlik, verifica dei flussi e validazione della messa a terra operativa.</p>
          </article>
        </div>
      </section>

      <section className="why-us-intro section" id="why-us">
        <div className="section-kicker section-kicker--light" data-reveal>
          <span>07</span>
          <p>Perché noi</p>
        </div>
        <div className="why-us-intro__header" data-reveal>
          <h2>Sappiamo da dove<br />viene VIDAS.</h2>
          <p>Sappiamo dove può arrivare. La proposta nasce da una partnership strategica tra due realtà complementari, unite da una visione comune: trasformare i dati in strategie di fundraising efficaci e misurabili.</p>
        </div>
        <div className="why-us-signals" data-reveal>
          <div><span>01</span><strong>Database VIDAS</strong><small>Conoscenza storica già maturata</small></div>
          <div><span>02</span><strong>ProsperData</strong><small>Analisi annuali già condotte</small></div>
          <div><span>03</span><strong>CRM Mentor</strong><small>Continuità con l’operatività quotidiana</small></div>
          <div><span>04</span><strong>BI Qlik</strong><small>Applicabilità e monitoraggio</small></div>
        </div>
      </section>

      <section className="partnership section">
        <div className="section-kicker" data-reveal>
          <span>7.1</span>
          <p>Chi siamo</p>
        </div>
        <div className="partnership__header" data-reveal>
          <h2>Due competenze complementari.<br />Una visione comune.</h2>
          <p>DataProsper e KiwiDataScience uniscono conoscenza profonda del settore nonprofit e competenza tecnica nell’analisi dei dati: una combinazione difficilmente replicabile da un singolo fornitore.</p>
        </div>
        <div className="partnership-flow" data-reveal>
          <article>
            <span>DATAPROSPER</span>
            <h3>Analisi avanzata per il fundraising</h3>
            <p>Specialisti nell’analisi di database donatori, nei modelli statistici comportamentali e nello sviluppo di algoritmi di segmentazione per il non profit.</p>
          </article>
          <div className="partnership-flow__core">
            <small>PARTNERSHIP STRATEGICA</small>
            <strong>ProsperData<br />Engine</strong>
            <span>Dati trasformati in strategie<br />efficaci e misurabili.</span>
          </div>
          <article>
            <span>KIWI DATA SCIENCE</span>
            <h3>Data science applicata</h3>
            <p>Scoring predittivo, machine learning e integrazione dei dati su piattaforme CRM, con rigore metodologico e innovazione tecnologica al servizio della missione.</p>
          </article>
        </div>
        <div className="partnership-promises" data-reveal>
          <span>Fundraising nonprofit</span>
          <span>Modelli comportamentali</span>
          <span>Data science</span>
          <span>Integrazione CRM</span>
        </div>
      </section>

      <section className="why-us-advantage section">
        <div className="section-kicker" data-reveal>
          <span>7.2</span>
          <p>Il vantaggio competitivo di DataProsper</p>
        </div>
        <div className="why-us-advantage__header" data-reveal>
          <h2>La continuità storica<br />è il vantaggio.</h2>
          <p>Non partiamo da un database astratto. Partiamo da una storia già conosciuta, da analisi già realizzate e dalla comprensione della transizione verso gli strumenti attuali di VIDAS.</p>
        </div>
        <div className="why-us-reasons" data-reveal>
          {teamProposalReasons.map((reason) => (
            <article key={reason.code}>
              <div><span>{reason.code}</span><small>{reason.signal}</small></div>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
              <strong>{reason.proof}</strong>
            </article>
          ))}
        </div>
        <div className="continuity-spotlight" data-reveal>
          <div>
            <span>PERCHÉ SIAMO DIVERSI</span>
            <strong>Partiamo già avanti: sappiamo da dove viene VIDAS, sappiamo dove può arrivare.</strong>
          </div>
          <p>La conoscenza storica del database e dei pattern comportamentali dei donatori è un asset differenziale che nessun competitor può replicare.</p>
        </div>
      </section>

      <section className="experience-section section">
        <div className="section-kicker" data-reveal>
          <span>PROOF</span>
          <p>Esperienze rilevanti nel nonprofit</p>
        </div>
        <div className="experience-section__header" data-reveal>
          <h2>Modelli già applicati.<br />Non solo ipotizzati.</h2>
          <p>La proposta per VIDAS nasce da esperienze operative maturate su database, mailplan, modelli di riattivazione, high value donor e campagne multicanale nel settore nonprofit.</p>
        </div>
        <div className="experience-credentials" data-reveal aria-label="Esperienza DataProsper nel nonprofit">
          <article><strong>8</strong><span>organizzazioni</span><p>Mailplan strategici e operativi</p></article>
          <article><strong>9</strong><span>organizzazioni</span><p>Modellistica Lapsed</p></article>
          <article><strong>3</strong><span>organizzazioni</span><p>Modelli HVD</p></article>
          <article><strong>1</strong><span>organizzazione</span><p>Lasciti Lookalike</p></article>
        </div>

        <div className="case-history-intro" data-reveal>
          <span>DUE EVIDENZE OPERATIVE</span>
          <p>I nomi delle organizzazioni non vengono esposti. Metodo, scala e risultati restano quelli osservati nei progetti.</p>
        </div>
        <div className="case-history-grid" data-reveal>
          <article className="case-history case-history--lapsed">
            <div className="case-history__heading">
              <span>CASE 01 · RIATTIVAZIONE</span>
              <h3>Il modello Lapsed supera la selezione interna.</h3>
              <p>Su donatori inattivi da oltre 60 mesi, la selezione DataProsper è stata confrontata con il modello già utilizzato dall’organizzazione.</p>
            </div>
            <div className="case-history__metrics" role="group" aria-label="Tre risultati collegati dello stesso confronto">
              <div><strong>1,82%</strong><span>response rate medio</span><small>vs 1,16% della selezione interna</small></div>
              <div><strong>+56,9%</strong><span>riattivazioni stimate</span><small>a parità di confronto</small></div>
              <div><strong>+35%</strong><span>raccolta</span><small>rispetto alla selezione standard</small></div>
            </div>
            <div className="case-history__footer">
              <span>4 mailing</span><i aria-hidden="true">·</i><span>160.000 invii</span><i aria-hidden="true">·</i><span>4 varianti di messaggio</span>
            </div>
          </article>

          <article className="case-history case-history--mailplan">
            <div className="case-history__heading">
              <span>CASE 02 · CICLO DI VITA</span>
              <h3>Dal prospect al break-even.</h3>
              <p>Un Contact Plan integrato ha collegato acquisizione, welcome e coltivazione dei nuovi donatori, leggendo il ritorno su un orizzonte pluriennale.</p>
            </div>
            <div className="case-history__path" aria-label="Progressione del caso mailplan">
              <div><small>ACQUISIZIONE</small><strong>245.000</strong><span>invii prospect</span></div>
              <i aria-hidden="true">→</i>
              <div><small>PORTAFOGLIO</small><strong>9.159</strong><span>nuovi donatori</span></div>
              <i aria-hidden="true">→</i>
              <div><small>RISULTATO</small><strong>18–24</strong><span>mesi al break-even</span></div>
            </div>
            <div className="case-history__outcome">
              <span>IL PUNTO STRATEGICO</span>
              <p>L’acquisizione non viene valutata sul primo invio, ma sulla capacità del journey di generare valore nel tempo.</p>
            </div>
          </article>
        </div>

        <div className="experience-capabilities" data-reveal>
          <div>
            <span>ATTIVAZIONE MULTICANALE</span>
            <strong>Dalla segmentazione alla relazione.</strong>
          </div>
          <ul aria-label="Capacità di attivazione multicanale">
            <li>Direct mail</li>
            <li>Digitale</li>
            <li>Telemarketing</li>
            <li>QR e raccolta dati</li>
            <li>Donor care</li>
          </ul>
        </div>
        <p className="case-history-note" data-reveal>Case history presentate in forma anonima nel rispetto degli accordi di riservatezza.</p>
      </section>

      <section className="team-section">
        <div className="section">
          <div className="team-section__header" data-reveal>
            <div>
              <p>7.3 · IL TEAM DATAPROSPER</p>
              <h2>Competenze trasversali dedicate al progetto VIDAS.</h2>
            </div>
            <div className="partner-logos">
              <img src="/dataprosper.png" alt="DataProsper" />
              <img src="/kiwi.png" alt="Kiwi Data Science" />
            </div>
          </div>
          <div className="team-list" data-reveal>
            {team.map((member, index) => (
              <article className="team-card" key={member.name}>
                <div className="team-card__portrait">
                  <img src={member.image} alt={`Ritratto di ${member.name}`} />
                  <span className="team-card__number">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="team-card__copy">
                  <span>{member.org}</span>
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="deliverables-recap section" aria-labelledby="deliverables-title">
        <div className="deliverables-recap__header" data-reveal>
          <span>I TRE DELIVERABLE RICHIESTI DA VIDAS</span>
          <h2 id="deliverables-title">Il brief trova risposta<br />in tre risultati verificabili.</h2>
        </div>
        <div className="deliverables-recap__list" data-reveal>
          <article><span>01</span><div><strong>Analisi della performance multidimensionale</strong><p>Assessment, database, KPI, donor journey attuale e SWOT integrata.</p><small>CAPITOLO 02</small></div></article>
          <article><span>02</span><div><strong>Proposta evolutiva di segmentazione</strong><p>ProsperData Engine, modelli specialistici e donor journey per i nuovi segmenti.</p><small>CAPITOLI 03 E 04</small></div></article>
          <article><span>03</span><div><strong>Messa a terra operativa</strong><p>Integrazione fra Engine, Mentor e Qlik, delivery e monitoraggio.</p><small>CAPITOLI 05 E 06</small></div></article>
        </div>
      </section>

      <section className="investment section">
        <div className="section-kicker" data-reveal>
          <span>7.4</span>
          <p>Proposta economica</p>
        </div>
        <div className="investment__headline" data-reveal>
          <h2>Una base economica chiara.<br />Da validare sul perimetro finale.</h2>
          <p>La valorizzazione economica sarà consolidata sulla base dei tre deliverable, delle attività di integrazione e del cronoprogramma condiviso con VIDAS.</p>
        </div>
        <div className="investment__budget" data-reveal>
          <div>
            <span>BUDGET DI RIFERIMENTO</span>
            <strong>€ 90.000</strong>
            <small>attività di consulenza</small>
          </div>
          <div>
            <span>STATO DELLA PROPOSTA</span>
            <h3>Base di lavoro da validare.</h3>
            <p>Il valore indica il riferimento economico attuale. Articolazione per fase e condizioni finali saranno definite nella proposta economica conclusiva.</p>
          </div>
        </div>
        <div className="investment__scope" data-reveal>
          <span>IL BUDGET SEGUE IL PERIMETRO</span>
          <div>
            <strong>Analisi multidimensionale</strong>
            <strong>Segmentazione evoluta</strong>
            <strong>Messa a terra operativa</strong>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__copy">
          <BrandLockup light />
          <h2>Dal primo dato<br />alla prima decisione.</h2>
          <p>Workshop di mobilitazione · accesso ai dati · Data Ready Gate</p>
        </div>
        <div className="site-footer__mark" aria-hidden="true">
          <span>READY</span>
          <strong>→</strong>
        </div>
        <div className="site-footer__bottom">
          <span>DataProsper + Kiwi Data Science</span>
          <span>Proposta tecnica VIDAS 2027 · Bozza riservata</span>
        </div>
      </footer>
    </main>
  );
}
