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
    thesis: "Recency, Frequency e Monetary restano la base, ma vengono aperte, prioritizzate e integrate con lifecycle e comportamento per generare segmenti dinamici.",
    metric: "RFM+",
    metricLabel: "Da fascia economica a comportamento osservabile",
    outputs: ["Segmentazione evoluta", "Lapsed Small / Middle", "Priorità di riattivazione"],
    tone: "red",
  },
  {
    code: "B",
    name: "Propensione ai Regolari",
    role: "Scoring di conversione",
    thesis: "Uno scoring statistico individua i donatori one-off con frequenza e stabilità compatibili con la conversione a sostegno ricorrente.",
    metric: "81%",
    metricLabel: "del Middle telefonico sostenuto da Multi + Pluri nei dati ProsperData",
    outputs: ["Frequenza mobile > 3", "Target TM prioritari", "DEM personalizzate di supporto"],
    tone: "magenta",
  },
  {
    code: "C",
    name: "Engagement Online",
    role: "Digitalizzazione e multicanalità",
    thesis: "Il database viene letto per reale raggiungibilità e comportamento, distinguendo Solo Postale, Solo Digital, Multicanale Caldo e Digital Silente.",
    metric: "+8.600",
    metricLabel: "donatori digitali attivi nel 2025 secondo l’analisi del team",
    outputs: ["Cluster di contact mix", "Journey per canale", "Protezione deliverability"],
    tone: "blue",
  },
  {
    code: "D",
    name: "Modello HVD",
    role: "High Value Donor",
    thesis: "Capacità contributiva, segnali relazionali e comportamento donativo convergono in un indice di potenziale unico e riproducibile.",
    metric: "96–99°",
    metricLabel: "percentile proposto per il cluster HVD attivo",
    outputs: ["Network aziendale", "Geo-intelligence", "RFM puntuale e cumulato"],
    tone: "green",
  },
  {
    code: "E",
    name: "Lasciti Lookalike",
    role: "Propensione di lungo periodo",
    thesis: "Il profilo di chi ha già scelto un lascito diventa il riferimento per trovare somiglianze anagrafiche, geografiche e di fedeltà nella base VIDAS.",
    metric: "149.107",
    metricLabel: "donatori unici dal 2015 disponibili come patrimonio storico",
    outputs: ["Profilo seed", "Lookalike scoring", "Candidati a maggiore affinità"],
    tone: "yellow",
  },
  {
    code: "F",
    name: "Memorie",
    role: "Segmentazione relazionale",
    thesis: "Le donazioni legate ad assistiti e persone care richiedono una lettura dedicata: il contesto della relazione guida esclusioni, caring e linguaggio.",
    metric: "1:1",
    metricLabel: "una relazione sensibile, non un segmento promozionale",
    outputs: ["Tag relazionali", "Auto-identificazione", "Journey e caring dedicati"],
    tone: "cyan",
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

const phases = [
  {
    code: "00",
    title: "Mobilitare",
    duration: "2 settimane",
    months: "Febbraio",
    body: "Data contract, team, accessi, privacy e decision log.",
  },
  {
    code: "01",
    title: "Analisi & Assessment",
    duration: "6 settimane",
    months: "Febbraio - marzo",
    body: "Database, strumenti, donor journey, KPI, baseline e SWOT integrata.",
  },
  {
    code: "02",
    title: "Modelli & Segmenti",
    duration: "8 settimane",
    months: "Aprile - maggio",
    body: "Sei modelli DataProsper, integrazione, score, KPI e donor journey.",
  },
  {
    code: "03",
    title: "Implementazione su CRM",
    duration: "10 settimane",
    months: "Giugno - agosto",
    body: "Mentor, Qlik, pipeline dati, pilot, UAT e formazione operativa.",
  },
  {
    code: "04",
    title: "Monitoraggio continuo",
    duration: "5 mesi",
    months: "Settembre - gennaio",
    body: "Performance per segmento, tuning, governance e handover.",
  },
];

const team = [
  ["Fabio Molari", "Data & analytics lead", "DP"],
  ["Cinzia Rosolin", "Target analysis", "DP"],
  ["Marco Bellati", "VIDAS continuity · business & data", "KDS"],
  ["Giovanni Bocchi", "Data science lead", "KDS"],
  ["Francesco Cuccio", "Data architecture", "KDS"],
  ["Marie Amadei", "Strategic advisor", "ADV"],
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
  const [activeJourney, setActiveJourney] = useState(0);
  const [journeyDetail, setJourneyDetail] = useState<{ title: string; text: string } | null>(null);
  useReveal();

  const stage = engineStages[activeStage];
  const model = teamModels[activeModel];
  const journey = donorJourneys[activeJourney];
  const progress = useMemo(() => `${((activeStage + 1) / engineStages.length) * 100}%`, [activeStage]);

  return (
    <main id="top">
      <header className="site-header">
        <BrandLockup light />
        <nav aria-label="Navigazione principale">
          <a href="#vidas">La sfida</a>
          <a href="#proposal">La proposta</a>
          <a href="#engine">Il sistema</a>
          <a href="#journey">Journey</a>
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

      <section className="signal-band" aria-label="Evidenze dal brief">
        <div className="signal-band__intro">
          <small>DAL BRIEF VIDAS</small>
          <span>La base è forte.</span>
          <strong>La complessità è cresciuta.</strong>
        </div>
        <div className="signal-stat">
          <strong>38%</strong>
          <span>retention postal + email</span>
          <small>vs 24% media database</small>
        </div>
        <div className="signal-stat">
          <strong>~30%</strong>
          <span>del database non apre</span>
          <small>mai o da 12 mesi</small>
        </div>
        <div className="signal-stat">
          <strong>7%</strong>
          <span>overlap realmente attivo</span>
          <small>postal + email che apre</small>
        </div>
      </section>

      <section className="story-map section" id="story" aria-labelledby="story-title">
        <div className="story-map__header" data-reveal>
          <span>COME LEGGERE LA PROPOSTA</span>
          <h2 id="story-title">Sette capitoli.<br />Un’unica progressione.</h2>
          <p>Ogni capitolo risponde alla domanda aperta da quello precedente.</p>
        </div>
        <nav className="story-map__chapters" aria-label="Indice della proposta" data-reveal>
          {[
            ["01", "La sfida VIDAS", "Perché il modello deve evolvere", "#vidas"],
            ["02", "La proposta", "Come affrontiamo il progetto", "#proposal"],
            ["03", "Il sistema", "Modelli ed Engine", "#engine"],
            ["04", "Un esempio", "RFM Lapsed", "#rfm-lapsed"],
            ["05", "I Journey", "Dalla segmentazione alla relazione", "#journey"],
            ["06", "La delivery", "Mentor, Qlik e monitoraggio", "#delivery"],
            ["07", "Perché noi", "Partnership, continuità e team", "#why-us"],
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
          <h2>Prima comprendiamo.<br />Poi modelliamo.<br />Infine attiviamo.</h2>
          <p>
            La risposta al brief è un percorso in quattro fasi cumulative. Ogni fase produce un output utilizzabile dalla successiva e porta VIDAS dalla diagnosi alla capacità operativa interna.
          </p>
        </div>
        <div className="proposal-phases" data-reveal>
          {[
            ["01", "Analisi & Assessment", "Capire cosa accade oggi", "Database e strumenti · donor journey attuale · dettaglio campagne · SWOT integrata"],
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

      <section className="engine-section" id="engine">
        <div className="section engine-section__intro">
          <div className="section-kicker section-kicker--light" data-reveal>
            <span>03</span>
            <p>Il cuore della proposta</p>
          </div>
          <h2 data-reveal>I modelli osservano.<br />L’Engine decide.</h2>
          <p data-reveal>
            I sei modelli DataProsper producono letture complementari. ProsperData Engine le combina in quattro livelli e restituisce al team una sola priorità operativa, con reason code spiegabile.
          </p>
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
              La proposta DataProsper articola sei letture complementari del donatore. ProsperData Engine non le sostituisce: governa le sovrapposizioni, assegna le priorità e trasforma ogni modello in una decisione operativa.
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
                <small>{item.role}</small>
              </button>
            ))}
          </div>

          <article className="model-detail" role="tabpanel" data-model-tone={model.tone} data-model-code={model.code}>
            <div className="model-detail__topline">
              <span>FASE 2 · MODELLO {model.code}</span>
              <small>Proposta DataProsper per VIDAS</small>
            </div>
            <h3>{model.code}. {model.name}</h3>
            <p className="model-detail__thesis">{model.thesis}</p>
            <div className="model-detail__metric">
              <strong>{model.metric}</strong>
              <span>{model.metricLabel}</span>
            </div>
            <div className="model-detail__outputs">
              <span>OUTPUT DEL MODELLO</span>
              <ul>
                {model.outputs.map((output) => <li key={output}>{output}</li>)}
              </ul>
            </div>
            {activeModel === 0 && (
              <a className="text-link" href="#rfm-lapsed">
                Apri il modello Lapsed <span aria-hidden="true">↓</span>
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
            Un donatore può essere contemporaneamente RFM Middle, ad alta propensione alla regolarizzazione e digitalmente ingaggiato. ProsperData Engine combina queste letture, stabilisce la priorità e restituisce un solo next best action spiegabile.
          </p>
          <div className="model-governance__formula" aria-label="Sei modelli producono una priorità e una decisione">
            <span>6 MODELLI</span><i>→</i><span>1 PRIORITÀ</span><i>→</i><strong>1 DECISIONE</strong>
          </div>
        </div>
      </section>

      <section className="rfm-lapsed section" id="rfm-lapsed">
        <div className="section-kicker" data-reveal>
          <span>04</span>
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
            <strong>Propensione al ritorno P1 / P2</strong>
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

      <section className="journey section" id="journey">
        <div className="section-kicker" data-reveal>
          <span>05</span>
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
          <div className="journey-kpi__systems"><span>CRM MENTOR</span><i>+</i><span>BI QLIK</span></div>
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

      <section className="method implementation section" id="delivery">
        <div className="section-kicker" data-reveal>
          <span>06</span>
          <p>Dalla strategia all’operatività</p>
        </div>
        <div className="implementation__header" data-reveal>
          <h2>Il sistema entra<br />nel lavoro quotidiano.</h2>
          <p>ProsperData Engine non sostituisce l’ecosistema VIDAS. Traduce modelli e journey in campi, audience, dashboard e routine governabili dentro Mentor e Qlik.</p>
        </div>
        <div className="pipeline" data-reveal>
          <div className="pipeline__column">
            <span>Fonti VIDAS</span>
            <strong>Mentor CRM</strong>
            <strong>Donazioni</strong>
            <strong>Campagne</strong>
            <strong>Email / digital</strong>
            <strong>Eventi e relazioni</strong>
          </div>
          <div className="pipeline__connector"><i /><i /><i /></div>
          <div className="pipeline__column pipeline__column--engine">
            <span>ProsperData Engine</span>
            <strong>Data quality</strong>
            <strong>Metriche comuni</strong>
            <strong>Stati e segnali</strong>
            <strong>Score e regole</strong>
            <strong>Reason code</strong>
          </div>
          <div className="pipeline__connector"><i /><i /><i /></div>
          <div className="pipeline__column">
            <span>Attivazione</span>
            <strong>Campi Mentor</strong>
            <strong>Data mart</strong>
            <strong>Dashboard Qlik</strong>
            <strong>Audience</strong>
            <strong>Alert e liste</strong>
          </div>
        </div>
        <div className="method__headline" data-reveal>
          <span>6.1 · METODO ANALITICO</span>
          <h2>Explainable first.</h2>
          <h2 className="outline">Predittivo quando serve.</h2>
          <p>Ogni salto di sofisticazione deve superare gate di qualità, lift, stabilità e utilizzabilità.</p>
        </div>
        <div className="ladder" data-reveal>
          <div><span>01</span><strong>Regole</strong><small>Soglie, recency, lifecycle</small></div>
          <div><span>02</span><strong>Score</strong><small>RFM, trend, engagement</small></div>
          <div><span>03</span><strong>Propensity</strong><small>Backtest e baseline</small></div>
          <div><span>04</span><strong>Ottimizzazione</strong><small>Priorità sotto vincoli</small></div>
        </div>
        <div className="gate-line" data-reveal>
          {['Copertura', 'Qualità', 'Lift', 'Stabilità', 'Actionability', 'Fairness'].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="roadmap">
        <div className="section roadmap__header">
          <div className="section-kicker section-kicker--light" data-reveal>
            <span>6.2</span>
            <p>Roadmap di delivery</p>
          </div>
          <h2 data-reveal>Valore presto.<br />Stabilità entro l’anno.</h2>
          <p data-reveal>Febbraio 2027 - gennaio 2028</p>
        </div>
        <div className="phase-list section">
          {phases.map((phase) => (
            <article key={phase.code} data-reveal>
              <div className="phase-list__number">{phase.code}</div>
              <div className="phase-list__name">
                <strong>{phase.title}</strong>
                <span>{phase.months}</span>
              </div>
              <div className="phase-list__body">{phase.body}</div>
              <div className="phase-list__duration">{phase.duration}</div>
            </article>
          ))}
        </div>
        <div className="milestones section" data-reveal>
          <span>Data ready</span><span>Design approvato</span><span>Pilot go</span><span>Operating ready</span>
        </div>
      </section>

      <section className="pilot section">
        <div className="section-kicker" data-reveal>
          <span>6.3</span>
          <p>I primi pilot</p>
        </div>
        <div className="pilot__header" data-reveal>
          <h2>Dimostrare valore.<br />Cambiare il modo di lavorare.</h2>
          <p>La selezione finale segue la baseline. Tre use case iniziali combinano rilevanza, apprendibilità e misurabilità.</p>
        </div>
        <div className="pilot-grid" data-reveal>
          <article>
            <span>MODELLO A · REACTIVATION</span>
            <h3>RFM Lapsed</h3>
            <p>Selezionare gli ex-donatori con il più alto potenziale di ritorno.</p>
            <small>Holdout · reactivation rate · ROI</small>
          </article>
          <article>
            <span>MODELLO B · CONVERSION</span>
            <h3>Propensione Regolari</h3>
            <p>Trasformare frequenza mobile e fiducia in sostegno continuativo.</p>
            <small>TM + DEM · conversione · tenuta</small>
          </article>
          <article>
            <span>MODELLO D · VALUE</span>
            <h3>High Value Donor</h3>
            <p>Portare fuori dal massivo i profili con capacità e potenziale elevati.</p>
            <small>Caring · meeting · upgrade</small>
          </article>
        </div>
      </section>

      <section className="governance section">
        <div className="section-kicker" data-reveal>
          <span>6.4</span>
          <p>Operating model e governance</p>
        </div>
        <h2 data-reveal>La qualità della decisione<br />diventa una disciplina mensile.</h2>
        <div className="governance-grid" data-reveal>
          {[
            ["Governance", "Steering · ownership · version log · change control"],
            ["Model ops", "Freshness · drift · lift · calibrazione"],
            ["Data quality", "Completezza · anomalie · reconciliation · incident log"],
            ["Privacy by design", "Minimizzazione · finalità · aggregazione · controllo umano"],
          ].map(([title, body]) => (
            <div key={title}><span>{title}</span><p>{body}</p></div>
          ))}
        </div>
        <div className="guardrail" data-reveal>
          <strong>Guardrail</strong>
          <p>Nessun dato sensibile o arricchimento non documentato. Feature trasparenti, base giuridica verificata e override umano sempre disponibile.</p>
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
          <p>Il nostro vantaggio competitivo</p>
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

      <section className="proof">
        <div className="section proof__grid">
          <div className="proof__statement" data-reveal>
            <p>7.3 · Evidenze DataProsper</p>
            <h2>Dalla diagnosi alla scelta operativa.</h2>
            <span>Casi anonimizzati. Non costituiscono proiezioni di risultato per VIDAS.</span>
          </div>
          <div className="proof__case" data-reveal>
            <span>Cohort acquisition</span>
            <strong>245k</strong><small>invii</small>
            <strong>9.159</strong><small>nuovi donatori</small>
            <strong>37%</strong><small>attivi 0-24</small>
            <p>Break-even raggiunto entro 24 mesi.</p>
          </div>
          <div className="proof__case proof__case--blue" data-reveal>
            <span>Loyalty analysis</span>
            <strong>340.866</strong><small>donatori analizzati</small>
            <strong>12,1%</strong><small>donatori loyal</small>
            <strong>35,6%</strong><small>del valore</small>
            <p>Priorità: loyalty e seconda donazione.</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="section">
          <div className="team-section__header" data-reveal>
            <div>
              <p>7.4 · IL TEAM · DATAPROSPER + KIWI DATA SCIENCE</p>
              <h2>Fundraising, data science e continuità VIDAS nello stesso tavolo.</h2>
            </div>
            <div className="partner-logos">
              <img src="/dataprosper.png" alt="DataProsper" />
              <img src="/kiwi.png" alt="Kiwi Data Science" />
            </div>
          </div>
          <div className="team-list" data-reveal>
            {team.map(([name, role, org]) => (
              <div key={name}>
                <span>{org}</span>
                <strong>{name}</strong>
                <small>{role}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="investment section">
        <div className="section-kicker" data-reveal>
          <span>7.5</span>
          <p>Perimetro</p>
        </div>
        <div className="investment__headline" data-reveal>
          <h2>Un perimetro chiaro.<br />Verificato fase per fase.</h2>
          <p>Il progetto è suddiviso in cinque moduli operativi. Al termine di ciascuno, VIDAS verifica output e priorità prima di avviare il successivo. La valorizzazione economica sarà completata prima dell’invio formale.</p>
        </div>
        <div className="investment__total" data-reveal>
          <span>Impegno complessivo</span>
          <strong>156—208</strong>
          <small>giorni persona</small>
        </div>
        <details className="investment__details" data-reveal>
          <summary>Vedi la stima per modulo</summary>
          <div>
            {[
              ["M0", "Mobilitazione e data contract", "6-8 gg"],
              ["M1", "Analisi multidimensionale e baseline", "35-45 gg"],
              ["M2", "Segment engine e validazione", "50-65 gg"],
              ["M3", "Mentor/Qlik, pilot, UAT e rilascio", "45-60 gg"],
              ["M4", "Stabilizzazione, training e governance", "20-30 gg"],
            ].map(([code, item, effort]) => (
              <p key={code}><span>{code}</span><strong>{item}</strong><small>{effort}</small></p>
            ))}
          </div>
        </details>
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
