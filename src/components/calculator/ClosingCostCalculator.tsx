import React, { useState, useMemo } from "react";

type Lang = "en" | "de";

/* ── State tax rates (updated 2026) ── */
const states = [
  { id: "bw", name: { en: "Baden-Württemberg", de: "Baden-Württemberg" }, rate: 5.0 },
  { id: "by", name: { en: "Bavaria (Bayern)", de: "Bayern" }, rate: 3.5 },
  { id: "be", name: { en: "Berlin", de: "Berlin" }, rate: 6.0 },
  { id: "bb", name: { en: "Brandenburg", de: "Brandenburg" }, rate: 6.5 },
  { id: "hb", name: { en: "Bremen", de: "Bremen" }, rate: 5.5 },
  { id: "hh", name: { en: "Hamburg", de: "Hamburg" }, rate: 5.5 },
  { id: "he", name: { en: "Hesse (Hessen)", de: "Hessen" }, rate: 6.0 },
  { id: "mv", name: { en: "Mecklenburg-Vorpommern", de: "Mecklenburg-Vorpommern" }, rate: 6.0 },
  { id: "ni", name: { en: "Lower Saxony (Niedersachsen)", de: "Niedersachsen" }, rate: 5.0 },
  { id: "nw", name: { en: "North Rhine-Westphalia (NRW)", de: "Nordrhein-Westfalen" }, rate: 6.5 },
  { id: "rp", name: { en: "Rhineland-Palatinate", de: "Rheinland-Pfalz" }, rate: 5.0 },
  { id: "sl", name: { en: "Saarland", de: "Saarland" }, rate: 6.5 },
  { id: "sn", name: { en: "Saxony (Sachsen)", de: "Sachsen" }, rate: 5.5 },
  { id: "st", name: { en: "Saxony-Anhalt", de: "Sachsen-Anhalt" }, rate: 5.0 },
  { id: "sh", name: { en: "Schleswig-Holstein", de: "Schleswig-Holstein" }, rate: 6.5 },
  { id: "th", name: { en: "Thuringia (Thüringen)", de: "Thüringen" }, rate: 5.0 },
];

const translations = {
  en: {
    eyebrow: "Tools & Calculators",
    title: "Property Closing Cost Calculator",
    subtitle: "Estimate all transaction costs when purchasing a property in Germany — including transfer tax, notary, land registry, and agent fees.",
    propertyDetails: "Property Details",
    propertyDetailsSub: "Enter your purchase parameters",
    purchasePrice: "Purchase Price",
    purchasePriceHint: "Enter the agreed purchase price in euros.",
    selectState: "German State (Bundesland)",
    selectStatePlaceholder: "— Select your state —",
    selectStateHint: "Property transfer tax (Grunderwerbsteuer) rates differ by state.",
    agentCommission: "Agent Commission (Maklerprovision)",
    agentHint: "Since Dec 2020, buyer's share is capped at seller's share. Typically 3.57% each (7.14% total, split 50/50).",
    notaryRegistry: "Notary & Land Registry",
    notaryFee: "Notary fee",
    landRegistry: "Land registry",
    notaryHint: "Standard rates: ~1.5% notary, ~0.5% land registry. Adjust if you have a precise quote.",
    taxRatesTitle: "Transfer Tax Rates by State",
    taxRatesSub: "Grunderwerbsteuer 2026",
    emptyTitle: "Enter details to calculate",
    emptySub: "Fill in the purchase price and select a state to see your closing costs.",
    totalCapital: "Total Required Capital",
    totalSub: "Purchase price + all closing costs",
    summaryPrice: "Purchase Price",
    summaryCosts: "Closing Costs",
    summaryPct: "Costs as % of Price",
    costBreakdown: "Cost Breakdown",
    transferTax: "Grunderwerbsteuer",
    transferTaxDesc: "Property Transfer Tax — paid to the state government",
    notaryName: "Notarkosten",
    notaryDesc: "Notary fees — includes authentication & contract drafting",
    registryName: "Grundbucheintrag",
    registryDesc: "Land registry entry — ownership transfer registration",
    agentName: "Maklerprovision (Buyer's Share)",
    agentDesc: "Agent commission — buyer's portion (50% of total)",
    totalClosing: "Total Closing Costs",
    ofPurchasePrice: "of purchase price",
    costProportion: "Cost Proportion",
    shareOfTotal: "Share of total closing costs",
    barTransferTax: "Transfer Tax",
    barNotary: "Notary Fees",
    barRegistry: "Land Registry",
    barAgent: "Agent Commission",
    agentLawTitle: "Agent Fee Law (Dec 2020)",
    agentLawText: "Since December 2020, buyers cannot be charged more than what the seller pays in agent commission. If the seller pays 3.57%, the buyer's maximum is also 3.57%. The calculator shows the buyer's share only.",
    estimateTitle: "Estimate only",
    estimateText: "These figures are illustrative. Exact notary costs depend on the GNotKG fee schedule and transaction complexity. Always confirm with your notary and tax advisor before exchange.",
    rulesEyebrow: "Understanding the Costs",
    rulesTitle: "Rules & Regulations",
    rule1Title: "Grunderwerbsteuer (3.5%–6.5%)",
    rule1Text: "Germany's property transfer tax varies significantly by state, from Bayern's 3.5% to 6.5% in Brandenburg, NRW, Saarland, and Schleswig-Holstein. It's levied on the purchase price and must be paid within one month of the tax assessment notice. Only after payment does the notary release the Unbedenklichkeitsbescheinigung to complete the land registry transfer.",
    rule2Title: "Notarkosten (~1.0%–2.0%)",
    rule2Text: "German law requires all property sales to be notarised (§ 311b BGB). Notary fees are set by the Gerichts- und Notarkostengesetz (GNotKG) and are not negotiable — they scale with the purchase price. Costs cover the purchase contract (Kaufvertrag), the conveyance deed, and any mortgage charges (Grundschuld) registration. Budget ~1.5% as a solid estimate.",
    rule3Title: "Grundbucheintrag (~0.3%–0.5%)",
    rule3Text: "The land registry (Grundbuch) entry formally records your ownership at the Amtsgericht. The Grundbuchamt charges a statutory fee based on the property value — typically around 0.5% of the purchase price. If you're financing with a mortgage, the bank's Grundschuld (land charge) registration adds a further fee on the loan amount.",
    rule4Title: "Maklerprovision — 2020 Reform",
    rule4Text: "The Gesetz über die Verteilung der Maklerkosten (Dec 2020) mandates that buyers cannot pay more in agent commission than the seller pays. In practice, both parties typically pay 3.57% each (incl. 19% VAT), totalling 7.14% split equally. Private seller listings (Privatverkauf) often have zero buyer commission.",
    rule5Title: "New Construction Exception",
    rule5Text: "For newly constructed properties bought directly from a developer (Bauträger), the purchase price includes VAT (19%), but Grunderwerbsteuer is still due on the full amount. However, separately invoiced construction work arranged after the sale agreement may be exempt — this requires careful tax structuring.",
    rule6Title: "Share Deals & Tax Avoidance",
    rule6Text: "Purchasing a company that owns a property (Anteilskauf / Share Deal) used to allow Grunderwerbsteuer avoidance below 95% ownership. The 2021 reform lowered the threshold to 90% and extended the holding period to 10 years. These structures now require very careful legal structuring.",
  },
  de: {
    eyebrow: "Tools & Rechner",
    title: "Kaufnebenkostenrechner",
    subtitle: "Berechnen Sie alle Transaktionskosten beim Immobilienkauf in Deutschland — einschließlich Grunderwerbsteuer, Notar, Grundbuch und Maklergebühren.",
    propertyDetails: "Immobiliendetails",
    propertyDetailsSub: "Geben Sie Ihre Kaufparameter ein",
    purchasePrice: "Kaufpreis",
    purchasePriceHint: "Geben Sie den vereinbarten Kaufpreis in Euro ein.",
    selectState: "Bundesland",
    selectStatePlaceholder: "— Bundesland wählen —",
    selectStateHint: "Die Grunderwerbsteuer variiert je nach Bundesland.",
    agentCommission: "Maklerprovision",
    agentHint: "Seit Dez. 2020 darf der Käuferanteil den Verkäuferanteil nicht übersteigen. Üblich sind je 3,57% (7,14% gesamt, 50/50 geteilt).",
    notaryRegistry: "Notar & Grundbuch",
    notaryFee: "Notargebühren",
    landRegistry: "Grundbuchkosten",
    notaryHint: "Standardsätze: ~1,5% Notar, ~0,5% Grundbuch. Passen Sie die Werte an, wenn Sie ein genaues Angebot haben.",
    taxRatesTitle: "Grunderwerbsteuersätze nach Bundesland",
    taxRatesSub: "Grunderwerbsteuer 2026",
    emptyTitle: "Eingaben zum Berechnen",
    emptySub: "Geben Sie den Kaufpreis ein und wählen Sie ein Bundesland, um die Nebenkosten zu sehen.",
    totalCapital: "Gesamtkapitalbedarf",
    totalSub: "Kaufpreis + alle Kaufnebenkosten",
    summaryPrice: "Kaufpreis",
    summaryCosts: "Kaufnebenkosten",
    summaryPct: "Nebenkosten in %",
    costBreakdown: "Kostenaufstellung",
    transferTax: "Grunderwerbsteuer",
    transferTaxDesc: "Grunderwerbsteuer — wird an das Finanzamt gezahlt",
    notaryName: "Notarkosten",
    notaryDesc: "Notargebühren — inkl. Beurkundung & Vertragsentwurf",
    registryName: "Grundbucheintrag",
    registryDesc: "Grundbucheintrag — Eintragung des Eigentumswechsels",
    agentName: "Maklerprovision (Käuferanteil)",
    agentDesc: "Maklerprovision — Käuferanteil (50% der Gesamtprovision)",
    totalClosing: "Kaufnebenkosten gesamt",
    ofPurchasePrice: "des Kaufpreises",
    costProportion: "Kostenanteile",
    shareOfTotal: "Anteil an den gesamten Kaufnebenkosten",
    barTransferTax: "Grunderwerbsteuer",
    barNotary: "Notarkosten",
    barRegistry: "Grundbuchkosten",
    barAgent: "Maklerprovision",
    agentLawTitle: "Maklergesetz (Dez. 2020)",
    agentLawText: "Seit Dezember 2020 dürfen Käufer nicht mehr Maklerprovision zahlen als der Verkäufer. Zahlt der Verkäufer 3,57%, ist das auch das Maximum für den Käufer. Der Rechner zeigt nur den Käuferanteil.",
    estimateTitle: "Nur eine Schätzung",
    estimateText: "Diese Zahlen sind illustrativ. Die genauen Notarkosten richten sich nach dem GNotKG und der Transaktionskomplexität. Bitte bestätigen Sie die Kosten mit Ihrem Notar und Steuerberater.",
    rulesEyebrow: "Die Kosten verstehen",
    rulesTitle: "Regeln & Vorschriften",
    rule1Title: "Grunderwerbsteuer (3,5%–6,5%)",
    rule1Text: "Die Grunderwerbsteuer variiert erheblich je nach Bundesland — von 3,5% in Bayern bis 6,5% in Brandenburg, NRW, Saarland und Schleswig-Holstein. Sie wird auf den Kaufpreis erhoben und muss innerhalb eines Monats nach dem Steuerbescheid gezahlt werden. Erst nach Zahlung stellt der Notar die Unbedenklichkeitsbescheinigung für die Grundbuchumschreibung aus.",
    rule2Title: "Notarkosten (~1,0%–2,0%)",
    rule2Text: "Das deutsche Recht verlangt die notarielle Beurkundung aller Immobilienverkäufe (§ 311b BGB). Die Notargebühren sind im GNotKG geregelt und nicht verhandelbar — sie richten sich nach dem Kaufpreis. Die Kosten umfassen den Kaufvertrag, die Auflassung und ggf. die Grundschuldbestellung. ~1,5% ist ein solider Richtwert.",
    rule3Title: "Grundbucheintrag (~0,3%–0,5%)",
    rule3Text: "Der Grundbucheintrag dokumentiert Ihr Eigentum beim Amtsgericht. Das Grundbuchamt erhebt eine gesetzliche Gebühr basierend auf dem Immobilienwert — üblicherweise ca. 0,5% des Kaufpreises. Bei einer Hypothekenfinanzierung kommt die Grundschuldeintragung als weitere Gebühr hinzu.",
    rule4Title: "Maklerprovision — Reform 2020",
    rule4Text: "Das Gesetz über die Verteilung der Maklerkosten (Dez. 2020) schreibt vor, dass Käufer nicht mehr Provision zahlen dürfen als der Verkäufer. In der Praxis zahlen beide Seiten üblicherweise je 3,57% (inkl. 19% MwSt.), insgesamt 7,14%. Bei Privatverkäufen entfällt die Käuferprovision oft ganz.",
    rule5Title: "Neubau-Ausnahme",
    rule5Text: "Bei Neubauten direkt vom Bauträger enthält der Kaufpreis bereits 19% MwSt., die Grunderwerbsteuer fällt aber trotzdem auf den vollen Betrag an. Separat in Rechnung gestellte Bauleistungen nach Kaufvertrag können jedoch befreit sein — dies erfordert sorgfältige steuerliche Gestaltung.",
    rule6Title: "Share Deals & Steuervermeidung",
    rule6Text: "Der Erwerb einer immobilienbesitzenden Gesellschaft (Anteilskauf / Share Deal) ermöglichte früher die Vermeidung der Grunderwerbsteuer unter 95% Beteiligung. Die Reform 2021 senkte die Schwelle auf 90% und verlängerte die Haltefrist auf 10 Jahre. Diese Strukturen erfordern nun sehr sorgfältige rechtliche Gestaltung.",
  },
};

function fmtEur(n: number, locale: string): string {
  return "€" + Math.round(n).toLocaleString(locale === "de-DE" ? "de-DE" : "en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(2) + "%";
}

/* ── Icons (inline SVG) ── */
const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const InfoCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
    <rect x="18" y="3" width="4" height="18" /><rect x="10" y="8" width="4" height="13" /><rect x="2" y="13" width="4" height="8" />
  </svg>
);

const WarningTriangle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" /><path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3" />
  </svg>
);

/* ── Rule icons ── */
const ruleIcons = [
  <svg key="r1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  <svg key="r2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  <svg key="r3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  <svg key="r4" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  <svg key="r5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>,
  <svg key="r6" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
];

const ruleColors = [
  { bg: "bg-brand-50", text: "text-brand-500" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
  { bg: "bg-amber-50", text: "text-amber-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-red-50", text: "text-red-500" },
];

const accentColors = ["bg-brand-500", "bg-purple-600", "bg-cyan-600", "bg-amber-500"];
const barColors = ["#2563eb", "#7c3aed", "#0891b2", "#d97706"];

/* ── Main Component ── */
export default function ClosingCostCalculator({ lang = "en" }: { lang?: Lang }) {
  const t = translations[lang];
  const locale = lang === "de" ? "de-DE" : "en-US";

  const [priceRaw, setPriceRaw] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [agentPct, setAgentPct] = useState(3.57);
  const [notaryPct, setNotaryPct] = useState(1.5);
  const [registryPct, setRegistryPct] = useState(0.5);

  const selectedState = states.find((s) => s.id === selectedStateId);
  const taxRate = selectedState?.rate ?? 0;
  const hasResults = price > 0 && taxRate > 0;

  const result = useMemo(() => {
    if (!hasResults) return null;
    const taxAmt = price * taxRate / 100;
    const notaryAmt = price * notaryPct / 100;
    const registryAmt = price * registryPct / 100;
    const agentAmt = price * agentPct / 100;
    const closingTotal = taxAmt + notaryAmt + registryAmt + agentAmt;
    const grandTotal = price + closingTotal;
    const closingPctOfPrice = (closingTotal / price) * 100;
    return { taxAmt, notaryAmt, registryAmt, agentAmt, closingTotal, grandTotal, closingPctOfPrice };
  }, [price, taxRate, notaryPct, registryPct, agentPct, hasResults]);

  function handlePriceChange(raw: string) {
    setPriceRaw(raw);
    const v = parseInt(raw.replace(/\D/g, ""), 10);
    if (!isNaN(v) && v >= 0) setPrice(Math.min(v, 50000000));
    else setPrice(0);
  }

  function handlePriceBlur() {
    if (price > 0) setPriceRaw(price.toLocaleString(locale));
  }

  function handleAgentSlider(val: string) {
    setAgentPct(Math.min(Math.max(parseFloat(val) || 0, 0), 7.14));
  }

  const fmt = (n: number) => fmtEur(n, locale);
  const inputCls = "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";

  return (
    <div className="mx-auto max-w-[1060px]">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-brand-500">{t.eyebrow}</p>
        <h1 className="mb-2 font-display text-[30px] leading-[1.15] font-bold tracking-tight" style={{ color: "#253553" }}>
          {t.title}
        </h1>
        <p className="max-w-[560px] text-[15px] text-gray-500">{t.subtitle}</p>
      </div>

      {/* Layout grid */}
      <div className="grid items-start gap-6 lg:grid-cols-[420px_1fr]">
        {/* ── LEFT: Inputs ── */}
        <div className="flex flex-col gap-4">
          {/* Input card */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <HouseIcon />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.propertyDetails}</div>
                <div className="text-[13px] text-gray-400">{t.propertyDetailsSub}</div>
              </div>
            </div>
            <div className="space-y-5 p-6">
              {/* Purchase price */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.purchasePrice}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="350.000"
                    value={priceRaw}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    onBlur={handlePriceBlur}
                    className={`${inputCls} pl-9`}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.purchasePriceHint}</p>
              </div>

              {/* State */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.selectState}</label>
                <select
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                  className={`${inputCls} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10`}
                >
                  <option value="">{t.selectStatePlaceholder}</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name[lang]} — {s.rate.toFixed(1)}%
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">{t.selectStateHint}</p>
              </div>

              <hr className="border-gray-100" />

              {/* Agent commission */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.agentCommission}</label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={7.14}
                    step={0.01}
                    value={agentPct}
                    onChange={(e) => handleAgentSlider(e.target.value)}
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-brand-500 outline-none [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(37,99,235,0.35)]"
                  />
                  <span className="min-w-[52px] whitespace-nowrap rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-center font-mono text-xs font-medium text-brand-600">
                    {agentPct.toFixed(2)}%
                  </span>
                </div>
                <div className="relative mt-2">
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    max={7.14}
                    value={agentPct}
                    onChange={(e) => handleAgentSlider(e.target.value)}
                    className={`${inputCls} pr-10`}
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">%</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.agentHint}</p>
              </div>

              {/* Notary & Land Registry */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.notaryRegistry}</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-xs text-gray-500">{t.notaryFee}</p>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.1}
                        min={0.5}
                        max={3}
                        value={notaryPct}
                        onChange={(e) => setNotaryPct(Math.max(0, Math.min(parseFloat(e.target.value) || 0, 3)))}
                        className={`${inputCls} pr-10`}
                      />
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">%</span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-500">{t.landRegistry}</p>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.1}
                        min={0.1}
                        max={1.5}
                        value={registryPct}
                        onChange={(e) => setRegistryPct(Math.max(0, Math.min(parseFloat(e.target.value) || 0, 1.5)))}
                        className={`${inputCls} pr-10`}
                      />
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">%</span>
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.notaryHint}</p>
              </div>
            </div>
          </div>

          {/* State tax rates card */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <InfoCircle />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.taxRatesTitle}</div>
                <div className="text-[13px] text-gray-400">{t.taxRatesSub}</div>
              </div>
            </div>
            <div className="px-5 py-4">
              {states.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-gray-50 py-1.5 text-xs last:border-b-0">
                  <span className="text-gray-600">{s.name[lang]}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                      selectedStateId === s.id
                        ? "border border-brand-100 bg-brand-50 text-brand-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {s.rate.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="flex flex-col gap-4">
          {!hasResults ? (
            /* Empty state */
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-400">
                  <EditIcon />
                </div>
                <div className="mb-2 text-[15px] font-semibold text-gray-700">{t.emptyTitle}</div>
                <div className="max-w-[220px] text-[13px] text-gray-400">{t.emptySub}</div>
              </div>
            </div>
          ) : result && (
            <>
              {/* Total hero card */}
              <div className="relative overflow-hidden rounded-xl p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #253553 0%, #1e3a8a 100%)" }}>
                <div className="absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full" style={{ background: "rgba(96,165,250,0.08)" }} />
                <p className="relative mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-brand-300">{t.totalCapital}</p>
                <p className="relative mb-1 font-display text-[38px] leading-none font-bold tracking-tight text-white max-sm:text-[28px]">
                  {fmt(result.grandTotal)}
                </p>
                <p className="relative text-[13px] text-white/50">{t.totalSub}</p>
                <div className="relative mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-5">
                  <div className="flex-1">
                    <p className="mb-0.5 text-[11px] text-white/45">{t.summaryPrice}</p>
                    <p className="font-mono text-sm font-medium text-white">{fmt(price)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-[11px] text-white/45">{t.summaryCosts}</p>
                    <p className="font-mono text-sm font-medium text-white">{fmt(result.closingTotal)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-[11px] text-white/45">{t.summaryPct}</p>
                    <p className="font-mono text-sm font-medium text-white">{fmtPct(result.closingPctOfPrice)}</p>
                  </div>
                </div>
              </div>

              {/* Breakdown card */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                    <ListIcon />
                    {t.costBreakdown}
                  </div>
                  <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 font-mono text-xs font-medium text-brand-700">
                    {fmt(result.closingTotal)}
                  </span>
                </div>

                {/* Line items */}
                {[
                  { name: t.transferTax, desc: t.transferTaxDesc, amount: result.taxAmt, pct: taxRate, color: accentColors[0], show: true },
                  { name: t.notaryName, desc: t.notaryDesc, amount: result.notaryAmt, pct: notaryPct, color: accentColors[1], show: true },
                  { name: t.registryName, desc: t.registryDesc, amount: result.registryAmt, pct: registryPct, color: accentColors[2], show: true },
                  { name: t.agentName, desc: t.agentDesc, amount: result.agentAmt, pct: agentPct, color: accentColors[3], show: agentPct > 0 },
                ].filter((li) => li.show).map((li) => (
                  <div key={li.name} className="flex items-stretch border-b border-gray-50 px-5 py-4 transition last:border-b-0 hover:bg-brand-25">
                    <div className={`mr-4 w-[3px] shrink-0 self-stretch rounded-full ${li.color}`} />
                    <div className="flex-1">
                      <div className="mb-0.5 text-sm font-medium text-gray-800">{li.name}</div>
                      <div className="text-xs text-gray-400">{li.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-gray-900">{fmt(li.amount)}</div>
                      <div className="mt-0.5 text-[11px] text-gray-400">{fmtPct(li.pct)} {t.ofPurchasePrice}</div>
                    </div>
                  </div>
                ))}

                {/* Total row */}
                <div className="flex items-center justify-between border-t-2 border-gray-200 bg-gray-50 px-5 py-4">
                  <span className="text-sm font-semibold text-gray-700">{t.totalClosing}</span>
                  <span className="font-mono text-base font-bold text-gray-900">{fmt(result.closingTotal)}</span>
                </div>
              </div>

              {/* Bar chart card */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                    <BarChartIcon />
                    {t.costProportion}
                  </div>
                </div>
                <div className="p-5">
                  <p className="mb-4 text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400">{t.shareOfTotal}</p>
                  {(() => {
                    const items = [
                      { label: t.barTransferTax, amt: result.taxAmt },
                      { label: t.barNotary, amt: result.notaryAmt },
                      { label: t.barRegistry, amt: result.registryAmt },
                    ];
                    if (agentPct > 0) items.push({ label: t.barAgent, amt: result.agentAmt });
                    const maxAmt = Math.max(...items.map((i) => i.amt));
                    return items.map((item, i) => (
                      <div key={item.label} className="mb-3 flex items-center gap-3">
                        <div className="min-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-600">{item.label}</div>
                        <div className="h-5 flex-1 overflow-hidden rounded-sm bg-gray-100">
                          <div
                            className="h-full rounded-sm transition-all duration-500"
                            style={{ width: `${maxAmt > 0 ? (item.amt / maxAmt * 100).toFixed(1) : 0}%`, background: barColors[i] }}
                          />
                        </div>
                        <div className="min-w-[72px] text-right font-mono text-[11px] text-gray-500">{fmt(item.amt)}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Agent fee notice */}
              {agentPct > 0 && (
                <div className="flex gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4 text-[13px] leading-relaxed text-brand-700">
                  <div className="mt-0.5 shrink-0"><InfoCircle /></div>
                  <div>
                    <p className="mb-0.5 font-semibold">{t.agentLawTitle}</p>
                    {t.agentLawText}
                  </div>
                </div>
              )}

              {/* Estimate warning */}
              <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-800">
                <div className="mt-0.5 shrink-0"><WarningTriangle /></div>
                <div>
                  <p className="mb-0.5 font-semibold">{t.estimateTitle}</p>
                  {t.estimateText}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Rules & Regulations ── */}
      <div className="mt-8">
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.1em] uppercase text-brand-500">{t.rulesEyebrow}</p>
          <p className="font-display text-[22px] font-bold tracking-tight" style={{ color: "#253553" }}>{t.rulesTitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { title: t.rule1Title, text: t.rule1Text },
            { title: t.rule2Title, text: t.rule2Text },
            { title: t.rule3Title, text: t.rule3Text },
            { title: t.rule4Title, text: t.rule4Text },
            { title: t.rule5Title, text: t.rule5Text },
            { title: t.rule6Title, text: t.rule6Text },
          ]).map((rule, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-xs">
              <div className={`mb-3 flex h-[30px] w-[30px] items-center justify-center rounded-lg ${ruleColors[i].bg} ${ruleColors[i].text}`}>
                {ruleIcons[i]}
              </div>
              <div className="mb-1 text-[13px] font-semibold text-gray-800">{rule.title}</div>
              <div className="text-xs leading-relaxed text-gray-500">{rule.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
