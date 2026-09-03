import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the corrected VIDAS proposal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ProsperData Engine per gara VIDAS — Proposta strategica e operativa<\/title>/i);
  assert.match(html, /La visione di VIDAS/);
  assert.match(html, /VIDAS sta avviando una riflessione strategica/);
  assert.match(html, /Quattro cambiamenti/);
  assert.match(html, /Evoluzione del database e del comportamento dei donatori/);
  assert.match(html, /Crescita delle attività digitali e multicanale/);
  assert.match(html, /Maggiore personalizzazione delle strategie di engagement/);
  assert.match(html, /Obiettivi di crescita sulle fasce middle e major donor/);
  assert.match(html, /Trasformiamo i dati in valore/);
  assert.match(html, /<em>“Trasformiamo i dati in valore\.”<\/em>/);
  assert.doesNotMatch(html, /DAL BRIEF ALLA RISPOSTA/);
  assert.doesNotMatch(html, /TRE FOCALIZZAZIONI/);
  assert.doesNotMatch(html, /definizione del modello attuale/);
  assert.doesNotMatch(html, /fasce economiche oggi in uso/);
  assert.doesNotMatch(html, /deliverable principali/);
  assert.match(html, /Sette capitoli/);
  assert.match(html, /Un’unica progressione/);
  assert.match(html, /Il sistema nel quotidiano/);
  assert.match(html, /Fase 3 · Il sistema entra nel lavoro quotidiano/);
  assert.doesNotMatch(html, /RFM Lapsed<\/strong><small>Un esempio concreto/);
  assert.match(html, /Comprendere\. Modellare/);
  assert.match(html, /Attivare\. Migliorare/);
  assert.match(html, /Leggiamo dati, KPI/);
  assert.match(html, /KPI e obiettivi/);
  assert.match(html, /Processi di donor care/);
  assert.match(html, /FOCUS OPERATIVO · DONOR CARE/);
  assert.match(html, /Ricostruiamo il processo/);
  assert.match(html, /Segnale e ingresso/);
  assert.match(html, /Presa in carico/);
  assert.match(html, /Esito e tracciamento/);
  assert.match(html, /Interviste VIDAS/);
  assert.match(html, /ESEMPIO ILLUSTRATIVO/);
  assert.match(html, /ProsperData Engine integra queste letture/);
  assert.match(html, /I KPI definiscono cosa conta/);
  assert.match(html, /FASE 1 · ANALISI DEI KPI/);
  assert.match(html, /Obiettivi, formule, fonti, baseline, frequenze e owner/);
  assert.match(html, /FASE 2 · PROSPERDATA ENGINE/);
  assert.match(html, /la priorità di azione e le ragioni che la determinano/);
  assert.match(html, /Redemption e riattivazione/);
  assert.match(html, /Conversione e retention/);
  assert.match(html, /Ottimizzazione e sinergia/);
  assert.match(html, /Arricchimento e upgrade discovery/);
  assert.match(html, /Profilazione e trend discovery/);
  assert.match(html, /Targetizzazione ottimizzata/);
  assert.match(html, /Qui presentiamo un contact plan 2027–2028/);
  assert.match(html, /permette di comprenderne meglio il funzionamento/);
  assert.match(html, /stabilisce le priorità e restituisce le informazioni utili per le next best actions/);
  assert.match(html, /NEXT BEST ACTIONS/);
  assert.doesNotMatch(html, /un solo next best action spiegabile/);
  assert.doesNotMatch(html, /non dispone di una funzione interna dedicata/);
  assert.doesNotMatch(html, /Il brief definisce una progressione chiara/);
  assert.doesNotMatch(html, /La proposta in sette passaggi/);
  assert.doesNotMatch(html, /Prima di disegnare il nuovo/);
  assert.doesNotMatch(html, /una sola priorità operativa, con reason code spiegabile/);
  assert.doesNotMatch(html, /I modelli vengono scritti in Mentor/);
  assert.match(html, /I risultati dell’Engine/);
  assert.match(html, /entrano in Mentor/);
  assert.match(html, /ASSESSMENT VIDAS/);
  assert.match(html, /LABEL E SCORE/);
  assert.match(html, /Mentor ed Engine si alimentano reciprocamente/);
  assert.match(html, /ETL · DATI/);
  assert.match(html, /I risultati dell’Engine entrano in Mentor\. Qlik li rende leggibili\./);
  assert.match(html, /I dati elaborati da ProsperData Engine vengono condivisi in Mentor sotto forma di label, score, audience e alert utilizzabili dal team VIDAS/);
  assert.doesNotMatch(html, /MONITORAGGIO · CICLO DI APPRENDIMENTO/);
  assert.doesNotMatch(html, /6\.1 · IMPLEMENTAZIONE SU CRM/);
  assert.match(html, />6\.1<\/span><p>Cronoprogramma · Gantt di progetto/);
  assert.doesNotMatch(html, />6\.2<\/span><p>Cronoprogramma · Gantt di progetto/);
  assert.match(html, />6\.2<\/span><p>Impegno di VIDAS/);
  assert.match(html, /IMPEGNO COMPLESSIVO INDICATIVO/);
  assert.match(html, /≈ 130/);
  assert.match(html, /≈ 70 ore/);
  assert.match(html, /Partecipazione alle interviste/);
  assert.match(html, /Descrizione dei processi attuali/);
  assert.match(html, /Validazione delle informazioni acquisite/);
  assert.match(html, /Supervisione dell’integrazione/);
  assert.doesNotMatch(html, /Come si lavora ogni mese/);
  assert.doesNotMatch(html, /Ogni mese VIDAS vede/);
  assert.match(html, /Il monitoraggio non chiude il progetto: riapre il ciclo/);
  assert.match(html, /HVD non è una fascia economica/);
  assert.match(html, /LA STRATEGIA IN QUATTRO PASSAGGI/);
  assert.match(html, /Network aziendale/);
  assert.match(html, /Geo-intelligence/);
  assert.match(html, /96–99°/);
  assert.match(html, /Uscita dai 12 mailing standard/);
  assert.match(html, /ORIZZONTE MINIMO DELLA STRATEGIA/);
  assert.match(html, /Cronoprogramma · Gantt di progetto/);
  assert.match(html, /Febbraio 2027 - dicembre 2028/);
  assert.doesNotMatch(html, /I primi pilot/);
  assert.match(html, /Esperienze rilevanti nel nonprofit/);
  assert.match(html, /Mailplan strategici e operativi/);
  assert.match(html, />8<\/strong><span>organizzazioni<\/span><p>Mailplan strategici e operativi/);
  assert.match(html, />9<\/strong><span>organizzazioni<\/span><p>Modellistica Lapsed/);
  assert.match(html, /Il modello Lapsed supera la selezione interna/);
  assert.match(html, /Propensione al ritorno · Priorità 1 \/ Priorità 2/);
  assert.match(html, /Tutti i 6 modelli sono pienamente dettagliati/);
  assert.match(html, /Il glossario completo dei KPI è inserito/);
  assert.match(html, /Tutte le case history sono dettagliate/);
  assert.match(html, /Il dettaglio dello schema della Fase 3/);
  assert.equal((html.match(/ProsperData Engine per gara VIDAS — Allegato tecnico/g) ?? []).length, 4);
  assert.match(html, /ProsperData Engine per gara VIDAS — Proposta strategica e operativa/);
  assert.doesNotMatch(html, /Propensione al ritorno P1 \/ P2/);
  assert.match(html, /1,82%/);
  assert.match(html, /\+56,9%/);
  assert.match(html, /Tre risultati collegati dello stesso confronto/);
  assert.match(html, /Dal prospect al break-even/);
  assert.match(html, /245\.000/);
  assert.match(html, /18–24/);
  assert.match(html, /Case history presentate in forma anonima/);
  assert.doesNotMatch(html, /I TRE DELIVERABLE RICHIESTI DA VIDAS/);
  assert.doesNotMatch(html, /Il brief trova risposta/);
  assert.doesNotMatch(html, /tre risultati verificabili/);
  assert.doesNotMatch(html, /deliverables-recap/);
  assert.match(html, /€ 81\.750/);
  assert.doesNotMatch(html, /90\.000/);
  assert.match(html, /RIPARTIZIONE PROPOSTA/);
  assert.match(html, /Tre fasi\.<br\s*\/>Sei attività\./);
  assert.doesNotMatch(html, /da validare/i);
  assert.doesNotMatch(html, /con Fiorenza/);
  assert.doesNotMatch(html, /conteggio delle ore interne/);
  assert.match(html, /€ 20\.500/);
  assert.match(html, /€ 56\.250/);
  assert.match(html, /€ 13\.250/);
  const budgetFees = [...html.matchAll(/data-budget-fee="(\d+)"/g)].map((match) => Number(match[1]));
  assert.deepEqual(budgetFees, [18750, 1750, 26500, 13250, 16500, 5000]);
  assert.equal(budgetFees.reduce((total, fee) => total + fee, 0), 81750);
  assert.match(html, /data-monthly-service-fee="700"/);
  assert.match(html, /Fee mensile del servizio/);
  assert.match(html, /A partire da ottobre 2027 · minimo 12 mesi/);
  assert.match(html, /Qlik e attività aggiuntive\./);
  const budgetStart = html.indexOf('id="budget"');
  const budgetHtml = html.slice(budgetStart, html.indexOf('<footer', budgetStart));
  assert.match(budgetHtml, /€ 5\.000<em class="budget-vat"> \+ IVA<\/em>/);
  const displayedFees = [...budgetHtml.matchAll(/€ ([\d.]+)<em class="budget-vat"> \+ IVA<\/em>/g)];
  assert.equal(displayedFees.length, 12);
  assert.equal((budgetHtml.match(/€ /g) || []).length, displayedFees.length);
  assert.ok(budgetHtml.indexOf('class="budget-total"') < budgetHtml.indexOf('class="budget-service"'));
  assert.match(html, /Assessment, analisi dei processi e donor journey attuale/);
  assert.match(html, /€ 18\.750/);
  assert.match(html, /Sviluppo dell(?:'|&#x27;|&#39;)integrazione dell(?:'|&#x27;|&#39;)automazione con Mentor/);
  assert.doesNotMatch(html, /Integrazione e automazione con Mentor/);
  assert.doesNotMatch(html, /data-budget-fee="5500"/);
  assert.doesNotMatch(html, /Sette attività/);
  assert.match(html, /non un piano di fatturazione/);
  assert.match(html, /quotati separatamente, a pacchetto o su base oraria/);
  assert.doesNotMatch(html, /Articolazione per fase e condizioni finali saranno definite/);
  assert.doesNotMatch(html, /156/);
  assert.doesNotMatch(html, /208/);
  assert.match(html, /Competenze trasversali dedicate al progetto VIDAS/);
  assert.match(html, /<span>KIWI<\/span><strong>Marco Bellati<\/strong>/);

  assert.doesNotMatch(html, />81%?</);
  assert.doesNotMatch(html, /Protezione deliverability/);
  assert.doesNotMatch(html, />245k</);
  assert.doesNotMatch(html, /La qualità della decisione/);
});

test("keeps the source reconciled with the team review", async () => {
  const [page, layout, packageJson, previewFiles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../app/_sites-preview", import.meta.url)),
  ]);

  assert.match(page, /ProsperData/);
  assert.match(page, /VIDAS/);
  assert.doesNotMatch(page, /journey-kpi__systems/);
  assert.doesNotMatch(page, /operating-architecture|operating-loop/);
  assert.match(page, /metric: "FEDELTÀ"/);
  assert.match(page, /AREE DEL MODELLO CHE GENERANO LO SCORE/);
  assert.doesNotMatch(page, /metric: "81%"/);
  assert.doesNotMatch(page, /Protezione deliverability/);
  assert.match(layout, /ProsperData Engine per gara VIDAS — Proposta strategica e operativa/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.deepEqual(previewFiles, []);
});
