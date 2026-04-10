import React, { useState, useMemo, useEffect, useRef } from "react";
import { track } from "../../lib/analytics";

type Lang = "en" | "de";

/* ── Official Mietspiegel links for major cities ── */
const mietspiegelLinks = [
  { city: "Berlin", url: "https://www.berlin.de/mietspiegel/" },
  { city: "München", url: "https://stadt.muenchen.de/infos/mietspiegel.html" },
  { city: "Hamburg", url: "https://www.hamburg.de/mietspiegel/" },
  { city: "Köln", url: "https://www.stadt-koeln.de/leben-in-koeln/wohnen/mietspiegel/" },
  { city: "Frankfurt", url: "https://frankfurt.de/mietspiegel" },
  { city: "Stuttgart", url: "https://www.stuttgart.de/mietspiegel" },
  { city: "Düsseldorf", url: "https://www.duesseldorf.de/wohnen/mietspiegel" },
  { city: "Leipzig", url: "https://www.leipzig.de/mietspiegel" },
  { city: "Dresden", url: "https://www.dresden.de/mietspiegel" },
  { city: "Hannover", url: "https://www.hannover.de/mietspiegel" },
  { city: "Nürnberg", url: "https://www.nuernberg.de/mietspiegel" },
  { city: "Freiburg", url: "https://www.freiburg.de/mietspiegel" },
];

const translations = {
  en: {
    eyebrow: "Tools & Calculators",
    title: "Mietpreisbremse Calculator",
    subtitle: "Check how Germany's rent brake limits your rental income. Compare the legally permitted rent to market rent and calculate your Rüge refund risk.",
    inputTitle: "Rental Details",
    inputSub: "Enter your property and rent parameters",
    mietspiegelLabel: "Ortsübliche Vergleichsmiete (Mietspiegel)",
    mietspiegelHint: "The local comparable rent per m² from your city's Mietspiegel. Look it up on your city's official website (links below).",
    mietspiegelLinksLabel: "Find your Mietspiegel",
    bremseAreaLabel: "Mietpreisbremse applies?",
    bremseYes: "Yes — tight housing market (angespannter Wohnungsmarkt)",
    bremseNo: "No — not a designated area",
    bremseHint: "Check if your municipality has an active Mietpreisbremse-Verordnung. Most major cities are covered.",
    mietspiegelUnit: "€/m²",
    apartmentSize: "Apartment Size",
    apartmentSizeHint: "Living area in square metres (Wohnfläche).",
    apartmentSizeUnit: "m²",
    marketRent: "Market Rent (Actual / Planned)",
    marketRentHint: "The rent per m² you charge or plan to charge.",
    marketRentUnit: "€/m²",
    monthsRented: "Months Since Rüge",
    monthsRentedHint: "How many months the tenant could claim a refund for (from Rüge date). Enter 0 if no Rüge yet.",
    exemptionLabel: "Exemption Status",
    exemptionHint: "Select if an exemption from the Mietpreisbremse applies to your property.",
    exemptionNone: "No exemption",
    exemptionNeubau: "New build (first use after Oct 2014)",
    exemptionModernisation: "Comprehensive modernisation",
    exemptionVormiete: "Previous rent above cap (Vormiete)",
    permittedRent: "Maximum Permitted Rent",
    permittedSub: "Ortsübliche Vergleichsmiete + 10%",
    monthlyPermitted: "Monthly permitted Kaltmiete",
    monthlyMarket: "Monthly market rent",
    monthlyDifference: "Monthly difference",
    annualLoss: "Annual Income Difference",
    annualLossSub: "Rent you cannot legally collect per year",
    rugeRisk: "Rüge Refund Risk",
    rugeSub: "Total refund liability if tenant files a Rüge",
    rugeExplain: "Refundable from Rüge date onward",
    perMonth: "/month",
    perYear: "/year",
    complianceStatus: "Compliance Status",
    statusCompliant: "Compliant",
    statusCompliantText: "Your rent is within the Mietpreisbremse limit. No Rüge risk.",
    statusOver: "Above Limit",
    statusOverText: "Your rent exceeds the permitted maximum. A tenant Rüge would require you to reduce the rent and refund the excess.",
    statusExempt: "Exempt",
    statusExemptText: "Your property is exempt from the Mietpreisbremse. You can set the rent freely.",
    statusNoBremsePre: "Not Applicable",
    statusNoBremseText: "The Mietpreisbremse does not apply in this area. You can set the rent freely at re-letting.",
    yieldImpact: "Yield Impact",
    yieldImpactSub: "How the rent cap affects your investment return",
    grossYieldMarket: "Gross yield at market rent",
    grossYieldCapped: "Gross yield at permitted rent",
    yieldDifference: "Yield difference",
    purchasePrice: "Purchase Price (optional)",
    purchasePriceHint: "Enter to see gross yield impact.",
    over5Years: "5-year cumulative difference",
    over10Years: "10-year cumulative difference",
    emptyTitle: "Enter details to calculate",
    emptySub: "Fill in the Mietspiegel value and apartment size to see your Mietpreisbremse analysis.",
    disclaimerTitle: "Important notice",
    disclaimerText: "This calculator provides estimates based on the Mietpreisbremse rules (§§ 556d–556g BGB). The actual ortsübliche Vergleichsmiete depends on your specific apartment's characteristics (age, condition, features, micro-location) as classified by the local Mietspiegel. Always verify with the official Mietspiegel for your city and consult a legal advisor for binding assessments.",
    rulesEyebrow: "Understanding the Rules",
    rulesTitle: "How the Mietpreisbremse Works",
    rule1Title: "The 10% Cap (§ 556d BGB)",
    rule1Text: "When re-letting an existing apartment in a designated tight housing market, the new rent may not exceed the ortsübliche Vergleichsmiete (local comparable rent from the Mietspiegel) by more than 10%. This is the core rule of the Mietpreisbremse, in effect since June 2015.",
    rule2Title: "Neubau Exemption (§ 556f BGB)",
    rule2Text: "Apartments first used and rented after October 1, 2014 are permanently exempt from the Mietpreisbremse. This applies to all subsequent re-lettings — making new builds significantly more attractive for investors in rent-controlled areas.",
    rule3Title: "Comprehensive Modernisation",
    rule3Text: "A comprehensive modernisation (umfassende Modernisierung) before re-letting exempts the apartment. The work must be so extensive that the apartment is essentially comparable to a new build — typically requiring investment of about one-third of new build costs.",
    rule4Title: "The Rüge Process",
    rule4Text: "The Mietpreisbremse only takes effect when the tenant files a formal Rüge (written complaint). The tenant can then reclaim excess rent from the Rüge date onward. Since 2020, a simple notification is sufficient — no detailed calculations required.",
    rule5Title: "Vormiete Exception (§ 556e BGB)",
    rule5Text: "If the previous tenant's rent already exceeded the Mietpreisbremse cap, you can charge the new tenant the same amount. This preserves the status quo but does not allow further increases above the previous rent.",
    rule6Title: "Disclosure Obligation (§ 556g BGB)",
    rule6Text: "Since 2019, landlords must proactively disclose if the rent exceeds the cap and state the legal basis (exemption). Failure to disclose means you cannot rely on the exemption until the information is provided — and must refund the excess collected before disclosure.",
  },
  de: {
    eyebrow: "Tools & Rechner",
    title: "Mietpreisbremse-Rechner",
    subtitle: "Prüfen Sie, wie die Mietpreisbremse Ihre Mieteinnahmen begrenzt. Vergleichen Sie die zulässige Miete mit der Marktmiete und berechnen Sie Ihr Rüge-Rückzahlungsrisiko.",
    inputTitle: "Mietdetails",
    inputSub: "Geben Sie Ihre Immobilien- und Mietparameter ein",
    mietspiegelLabel: "Ortsübliche Vergleichsmiete (Mietspiegel)",
    mietspiegelHint: "Die lokale Vergleichsmiete pro m² aus dem Mietspiegel Ihrer Stadt. Nachschlagen auf der offiziellen Website Ihrer Stadt (Links unten).",
    mietspiegelLinksLabel: "Mietspiegel finden",
    bremseAreaLabel: "Mietpreisbremse gilt?",
    bremseYes: "Ja — angespannter Wohnungsmarkt",
    bremseNo: "Nein — kein ausgewiesenes Gebiet",
    bremseHint: "Prüfen Sie, ob Ihre Gemeinde eine aktive Mietpreisbremse-Verordnung hat. Die meisten Großstädte sind betroffen.",
    mietspiegelUnit: "€/m²",
    apartmentSize: "Wohnungsgröße",
    apartmentSizeHint: "Wohnfläche in Quadratmetern.",
    apartmentSizeUnit: "m²",
    marketRent: "Marktmiete (tatsächlich / geplant)",
    marketRentHint: "Die Miete pro m², die Sie verlangen oder planen zu verlangen.",
    marketRentUnit: "€/m²",
    monthsRented: "Monate seit Rüge",
    monthsRentedHint: "Für wie viele Monate könnte der Mieter eine Rückzahlung fordern (ab Rüge-Datum). 0 eingeben, wenn keine Rüge vorliegt.",
    exemptionLabel: "Ausnahme-Status",
    exemptionHint: "Wählen Sie, ob eine Ausnahme von der Mietpreisbremse für Ihre Immobilie gilt.",
    exemptionNone: "Keine Ausnahme",
    exemptionNeubau: "Neubau (Erstbezug nach Okt. 2014)",
    exemptionModernisation: "Umfassende Modernisierung",
    exemptionVormiete: "Vormiete über der Obergrenze",
    permittedRent: "Maximal zulässige Miete",
    permittedSub: "Ortsübliche Vergleichsmiete + 10 %",
    monthlyPermitted: "Monatliche zulässige Kaltmiete",
    monthlyMarket: "Monatliche Marktmiete",
    monthlyDifference: "Monatliche Differenz",
    annualLoss: "Jährliche Einkommensdifferenz",
    annualLossSub: "Miete, die Sie pro Jahr nicht rechtmäßig verlangen können",
    rugeRisk: "Rüge-Rückzahlungsrisiko",
    rugeSub: "Gesamte Rückzahlungspflicht bei Mieter-Rüge",
    rugeExplain: "Erstattungsfähig ab Rüge-Datum",
    perMonth: "/Monat",
    perYear: "/Jahr",
    complianceStatus: "Compliance-Status",
    statusCompliant: "Konform",
    statusCompliantText: "Ihre Miete liegt innerhalb der Mietpreisbremse-Grenze. Kein Rüge-Risiko.",
    statusOver: "Über der Grenze",
    statusOverText: "Ihre Miete überschreitet das zulässige Maximum. Eine Mieter-Rüge würde Sie zur Mietsenkung und Rückzahlung des Überschusses verpflichten.",
    statusExempt: "Ausgenommen",
    statusExemptText: "Ihre Immobilie ist von der Mietpreisbremse befreit. Sie können die Miete frei festsetzen.",
    statusNoBremsePre: "Nicht anwendbar",
    statusNoBremseText: "Die Mietpreisbremse gilt in diesem Gebiet nicht. Sie können die Miete bei Wiedervermietung frei festsetzen.",
    yieldImpact: "Rendite-Auswirkung",
    yieldImpactSub: "Wie die Mietobergrenze Ihre Investitionsrendite beeinflusst",
    grossYieldMarket: "Bruttorendite bei Marktmiete",
    grossYieldCapped: "Bruttorendite bei zulässiger Miete",
    yieldDifference: "Rendite-Differenz",
    purchasePrice: "Kaufpreis (optional)",
    purchasePriceHint: "Eingeben, um die Bruttorendite-Auswirkung zu sehen.",
    over5Years: "Kumulative Differenz über 5 Jahre",
    over10Years: "Kumulative Differenz über 10 Jahre",
    emptyTitle: "Eingaben zum Berechnen",
    emptySub: "Geben Sie den Mietspiegel-Wert und die Wohnungsgröße ein, um Ihre Mietpreisbremse-Analyse zu sehen.",
    disclaimerTitle: "Wichtiger Hinweis",
    disclaimerText: "Dieser Rechner liefert Schätzungen basierend auf den Mietpreisbremse-Regeln (§§ 556d–556g BGB). Die tatsächliche ortsübliche Vergleichsmiete hängt von den spezifischen Merkmalen Ihrer Wohnung ab (Alter, Zustand, Ausstattung, Mikrolage), wie im lokalen Mietspiegel klassifiziert. Überprüfen Sie immer den offiziellen Mietspiegel Ihrer Stadt und konsultieren Sie einen Rechtsberater für verbindliche Einschätzungen.",
    rulesEyebrow: "Die Regeln verstehen",
    rulesTitle: "So funktioniert die Mietpreisbremse",
    rule1Title: "Die 10%-Obergrenze (§ 556d BGB)",
    rule1Text: "Bei der Wiedervermietung einer bestehenden Wohnung in einem ausgewiesenen angespannten Wohnungsmarkt darf die neue Miete die ortsübliche Vergleichsmiete (lokale Vergleichsmiete aus dem Mietspiegel) um höchstens 10 % übersteigen. Das ist die Kernregel der Mietpreisbremse, in Kraft seit Juni 2015.",
    rule2Title: "Neubau-Ausnahme (§ 556f BGB)",
    rule2Text: "Wohnungen, die nach dem 1. Oktober 2014 erstmals genutzt und vermietet wurden, sind dauerhaft von der Mietpreisbremse befreit. Dies gilt für alle weiteren Wiedervermietungen — was Neubauten für Investoren in Mietpreisbremse-Gebieten deutlich attraktiver macht.",
    rule3Title: "Umfassende Modernisierung",
    rule3Text: "Eine umfassende Modernisierung vor der Wiedervermietung befreit die Wohnung. Die Arbeiten müssen so umfangreich sein, dass die Wohnung im Wesentlichen einem Neubau entspricht — typischerweise mit Investitionen von etwa einem Drittel der Neubaukosten.",
    rule4Title: "Das Rüge-Verfahren",
    rule4Text: "Die Mietpreisbremse greift erst, wenn der Mieter eine formelle Rüge (schriftliche Beanstandung) einreicht. Der Mieter kann dann überhöhte Miete ab dem Rüge-Datum zurückfordern. Seit 2020 genügt eine einfache Mitteilung — keine detaillierten Berechnungen erforderlich.",
    rule5Title: "Vormiete-Ausnahme (§ 556e BGB)",
    rule5Text: "Wenn die Miete des vorherigen Mieters bereits über der Mietpreisbremse-Obergrenze lag, dürfen Sie dem neuen Mieter denselben Betrag berechnen. Dies bewahrt den Status quo, erlaubt aber keine weiteren Erhöhungen über die Vormiete hinaus.",
    rule6Title: "Auskunftspflicht (§ 556g BGB)",
    rule6Text: "Seit 2019 müssen Vermieter proaktiv offenlegen, wenn die Miete die Obergrenze überschreitet, und die Rechtsgrundlage (Ausnahme) angeben. Wird die Auskunft nicht erteilt, können Sie sich erst nach Nachholung der Information auf die Ausnahme berufen — und müssen den zuvor erhobenen Überschuss erstatten.",
  },
};

function fmtEur(n: number, locale: string): string {
  return "€" + Math.round(n).toLocaleString(locale === "de-DE" ? "de-DE" : "en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(2) + "%";
}

/* ── Icons ── */
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const InfoCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const WarningTriangle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" /><path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
    <rect x="18" y="3" width="4" height="18" /><rect x="10" y="8" width="4" height="13" /><rect x="2" y="13" width="4" height="8" />
  </svg>
);

/* ── Rule icons ── */
const ruleIcons = [
  <svg key="r1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  <svg key="r2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  <svg key="r3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  <svg key="r4" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  <svg key="r5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
  <svg key="r6" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
];

const ruleColors = [
  { bg: "bg-brand-50", text: "text-brand-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-amber-50", text: "text-amber-500" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
  { bg: "bg-red-50", text: "text-red-500" },
];

type Exemption = "none" | "neubau" | "modernisation" | "vormiete";

/* ── Main Component ── */
export default function MietpreisbremseCalculator({ lang = "en" }: { lang?: Lang }) {
  const t = translations[lang];
  const locale = lang === "de" ? "de-DE" : "en-US";

  const [mietspiegelRaw, setMietspiegelRaw] = useState("");
  const [mietspiegel, setMietspiegel] = useState(0);
  const [sizeRaw, setSizeRaw] = useState("70");
  const [size, setSize] = useState(70);
  const [marketRentRaw, setMarketRentRaw] = useState("");
  const [marketRent, setMarketRent] = useState(0);
  const [hasBremse, setHasBremse] = useState(true);
  const [monthsRented, setMonthsRented] = useState(0);
  const [exemption, setExemption] = useState<Exemption>("none");
  const [priceRaw, setPriceRaw] = useState("");
  const [price, setPrice] = useState(0);
  const [showLinks, setShowLinks] = useState(false);

  const isNoBremse = !hasBremse;
  const hasResults = mietspiegel > 0 && size > 0 && marketRent > 0;

  function handleMietspiegelChange(raw: string) {
    setMietspiegelRaw(raw);
    const v = parseFloat(raw.replace(",", "."));
    if (!isNaN(v) && v >= 0) setMietspiegel(Math.min(v, 50));
    else setMietspiegel(0);
  }

  function handleSizeChange(raw: string) {
    setSizeRaw(raw);
    const v = parseFloat(raw.replace(",", "."));
    if (!isNaN(v) && v >= 0) setSize(Math.min(v, 500));
    else setSize(0);
  }

  function handleMarketRentChange(raw: string) {
    setMarketRentRaw(raw);
    const v = parseFloat(raw.replace(",", "."));
    if (!isNaN(v) && v >= 0) setMarketRent(Math.min(v, 100));
    else setMarketRent(0);
  }

  function handlePriceChange(raw: string) {
    setPriceRaw(raw);
    const v = parseInt(raw.replace(/\D/g, ""), 10);
    if (!isNaN(v) && v >= 0) setPrice(Math.min(v, 50000000));
    else setPrice(0);
  }

  function handlePriceBlur() {
    if (price > 0) setPriceRaw(price.toLocaleString(locale));
  }

  const result = useMemo(() => {
    if (!hasResults) return null;

    const cappedPerSqm = mietspiegel * 1.1;
    const monthlyPermitted = cappedPerSqm * size;
    const monthlyMarket = marketRent * size;
    const isExempt = exemption !== "none" || isNoBremse;
    const isCompliant = isExempt || marketRent <= cappedPerSqm;
    const monthlyDiff = isExempt ? 0 : Math.max(0, monthlyMarket - monthlyPermitted);
    const annualDiff = monthlyDiff * 12;
    const rugeRefund = monthlyDiff * monthsRented;
    const diff5y = annualDiff * 5;
    const diff10y = annualDiff * 10;

    const yieldMarket = price > 0 ? (monthlyMarket * 12 / price) * 100 : 0;
    const yieldCapped = price > 0 ? ((isExempt ? monthlyMarket : monthlyPermitted) * 12 / price) * 100 : 0;
    const yieldDiff = yieldMarket - yieldCapped;

    return {
      cappedPerSqm,
      monthlyPermitted,
      monthlyMarket,
      isExempt,
      isCompliant,
      monthlyDiff,
      annualDiff,
      rugeRefund,
      diff5y,
      diff10y,
      yieldMarket,
      yieldCapped,
      yieldDiff,
    };
  }, [mietspiegel, size, marketRent, monthsRented, exemption, price, hasResults, isNoBremse]);

  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current && result) {
      track("calculator_used", {
        calculator: "mietpreisbremse",
        is_compliant: result.isCompliant,
        monthly_diff: result.monthlyDiff,
        lang,
      });
    }
    tracked.current = true;
  }, [mietspiegel, size, marketRent, monthsRented, exemption, price]);

  const fmt = (n: number) => fmtEur(n, locale);
  const inputCls = "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";
  const selectCls = `${inputCls} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10`;

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
        {/* ── Input card ── */}
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <ShieldIcon />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.inputTitle}</div>
                <div className="text-[13px] text-gray-400">{t.inputSub}</div>
              </div>
            </div>
            <div className="space-y-5 p-6">
              {/* Mietspiegel */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.mietspiegelLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder={lang === "de" ? "z.B. 9,50" : "e.g. 9.50"}
                    value={mietspiegelRaw}
                    onChange={(e) => handleMietspiegelChange(e.target.value)}
                    className={`${inputCls} pr-16`}
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">{t.mietspiegelUnit}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.mietspiegelHint}</p>
                {/* Mietspiegel links */}
                <button
                  type="button"
                  onClick={() => setShowLinks(!showLinks)}
                  className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  {t.mietspiegelLinksLabel}
                  <svg className={`h-3 w-3 transition-transform ${showLinks ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </button>
                {showLinks && (
                  <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {mietspiegelLinks.map((link) => (
                        <a
                          key={link.city}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-600 hover:text-brand-700 hover:underline truncate"
                        >
                          {link.city} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mietpreisbremse area toggle */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.bremseAreaLabel}</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHasBremse(true)}
                    className={`flex-1 rounded-lg border-[1.5px] px-3 py-2 text-sm font-medium transition ${hasBremse ? "border-brand-400 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                  >
                    {t.bremseYes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasBremse(false)}
                    className={`flex-1 rounded-lg border-[1.5px] px-3 py-2 text-sm font-medium transition ${!hasBremse ? "border-brand-400 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                  >
                    {t.bremseNo}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.bremseHint}</p>
              </div>

              {/* Apartment size */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.apartmentSize}</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={sizeRaw}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    className={`${inputCls} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">{t.apartmentSizeUnit}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.apartmentSizeHint}</p>
              </div>

              <hr className="border-gray-100" />

              {/* Market rent */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.marketRent}</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={marketRentRaw}
                    onChange={(e) => handleMarketRentChange(e.target.value)}
                    className={`${inputCls} pr-16`}
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">{t.marketRentUnit}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.marketRentHint}</p>
              </div>

              {/* Exemption */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.exemptionLabel}</label>
                <select value={exemption} onChange={(e) => setExemption(e.target.value as Exemption)} className={selectCls}>
                  <option value="none">{t.exemptionNone}</option>
                  <option value="neubau">{t.exemptionNeubau}</option>
                  <option value="modernisation">{t.exemptionModernisation}</option>
                  <option value="vormiete">{t.exemptionVormiete}</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">{t.exemptionHint}</p>
              </div>

              {/* Months since Rüge */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.monthsRented}</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={monthsRented}
                  onChange={(e) => setMonthsRented(Math.max(0, Math.min(parseInt(e.target.value) || 0, 120)))}
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-gray-400">{t.monthsRentedHint}</p>
              </div>

              <hr className="border-gray-100" />

              {/* Purchase price (optional) */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.purchasePrice}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={lang === "de" ? "300.000" : "300,000"}
                    value={priceRaw}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    onBlur={handlePriceBlur}
                    className={`${inputCls} pl-9`}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">{t.purchasePriceHint}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:row-end-3">
          {!hasResults ? (
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
              {/* Compliance status card */}
              {result.isExempt ? (
                <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="mt-0.5 shrink-0 text-emerald-600"><CheckCircle /></div>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-emerald-800">{isNoBremse ? t.statusNoBremsePre : t.statusExempt}</p>
                    <p className="text-[13px] leading-relaxed text-emerald-700">{isNoBremse ? t.statusNoBremseText : t.statusExemptText}</p>
                  </div>
                </div>
              ) : result.isCompliant ? (
                <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="mt-0.5 shrink-0 text-emerald-600"><CheckCircle /></div>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-emerald-800">{t.statusCompliant}</p>
                    <p className="text-[13px] leading-relaxed text-emerald-700">{t.statusCompliantText}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
                  <div className="mt-0.5 shrink-0 text-red-600"><AlertCircle /></div>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-red-800">{t.statusOver}</p>
                    <p className="text-[13px] leading-relaxed text-red-700">{t.statusOverText}</p>
                  </div>
                </div>
              )}

              {/* Permitted rent hero card */}
              <div className="relative overflow-hidden rounded-xl p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #253553 0%, #1e3a8a 100%)" }}>
                <div className="absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full" style={{ background: "rgba(96,165,250,0.08)" }} />
                <p className="relative mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-brand-300">{t.permittedRent}</p>
                <p className="relative mb-1 font-display text-[38px] leading-none font-bold tracking-tight text-white max-sm:text-[28px]">
                  {fmt(result.monthlyPermitted)}
                </p>
                <p className="relative text-[13px] text-white/50">{t.permittedSub} — {result.cappedPerSqm.toFixed(2)} €/m²</p>

                <div className="relative mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-5">
                  <div className="flex-1">
                    <p className="mb-0.5 text-[11px] text-white/45">{t.monthlyPermitted}</p>
                    <p className="font-mono text-sm font-medium text-white">{fmt(result.monthlyPermitted)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-[11px] text-white/45">{t.monthlyMarket}</p>
                    <p className="font-mono text-sm font-medium text-white">{fmt(result.monthlyMarket)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-[11px] text-white/45">{t.monthlyDifference}</p>
                    <p className={`font-mono text-sm font-medium ${result.monthlyDiff > 0 ? "text-red-300" : "text-emerald-300"}`}>
                      {result.monthlyDiff > 0 ? `-${fmt(result.monthlyDiff)}` : fmt(0)}{t.perMonth}
                    </p>
                  </div>
                </div>
              </div>

              {/* Annual loss & Rüge risk */}
              {result.monthlyDiff > 0 && !result.isExempt && (
                <>
                  {/* Annual difference card */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                        <BarChartIcon />
                        {t.annualLoss}
                      </div>
                      <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 font-mono text-xs font-medium text-red-700">
                        -{fmt(result.annualDiff)}{t.perYear}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="mb-4 text-xs text-gray-500">{t.annualLossSub}</p>
                      {/* Bar comparison */}
                      {(() => {
                        const items = [
                          { label: t.monthlyMarket, amt: result.monthlyMarket * 12, color: "#94a3b8" },
                          { label: t.monthlyPermitted, amt: result.monthlyPermitted * 12, color: "#2563eb" },
                        ];
                        const maxAmt = Math.max(...items.map((i) => i.amt));
                        return items.map((item) => (
                          <div key={item.label} className="mb-3 flex items-center gap-3">
                            <div className="min-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-600">{item.label}</div>
                            <div className="h-5 flex-1 overflow-hidden rounded-sm bg-gray-100">
                              <div
                                className="h-full rounded-sm transition-all duration-500"
                                style={{ width: `${maxAmt > 0 ? (item.amt / maxAmt * 100).toFixed(1) : 0}%`, background: item.color }}
                              />
                            </div>
                            <div className="min-w-[80px] text-right font-mono text-[11px] text-gray-500">{fmt(item.amt)}{t.perYear}</div>
                          </div>
                        ));
                      })()}

                      {/* Long-term projections */}
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="mb-1 text-[11px] text-gray-500">{t.over5Years}</p>
                          <p className="font-mono text-sm font-semibold text-red-600">-{fmt(result.diff5y)}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="mb-1 text-[11px] text-gray-500">{t.over10Years}</p>
                          <p className="font-mono text-sm font-semibold text-red-600">-{fmt(result.diff10y)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rüge refund risk */}
                  {monthsRented > 0 && (
                    <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-red-100 px-5 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-red-800">
                          <WarningTriangle />
                          {t.rugeRisk}
                        </div>
                        <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 font-mono text-xs font-medium text-red-700">
                          {fmt(result.rugeRefund)}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-gray-500">{t.rugeSub}</p>
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                          <span className="text-sm text-red-700">{fmt(result.monthlyDiff)} × {monthsRented} {lang === "de" ? "Monate" : "months"}</span>
                          <span className="font-mono text-lg font-bold text-red-800">{fmt(result.rugeRefund)}</span>
                        </div>
                        <p className="mt-2 text-[11px] text-gray-400">{t.rugeExplain}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Yield impact (if purchase price provided) */}
              {price > 0 && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                      <BarChartIcon />
                      {t.yieldImpact}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="mb-4 text-xs text-gray-500">{t.yieldImpactSub}</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t.grossYieldMarket}</span>
                        <span className="font-mono text-sm font-semibold text-gray-900">{fmtPct(result.yieldMarket)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t.grossYieldCapped}</span>
                        <span className="font-mono text-sm font-semibold text-brand-600">{fmtPct(result.yieldCapped)}</span>
                      </div>
                      {result.yieldDiff > 0.001 && (
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <span className="text-sm font-medium text-gray-700">{t.yieldDifference}</span>
                          <span className="font-mono text-sm font-semibold text-red-600">-{fmtPct(result.yieldDiff)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-800">
                <div className="mt-0.5 shrink-0"><WarningTriangle /></div>
                <div>
                  <p className="mb-0.5 font-semibold">{t.disclaimerTitle}</p>
                  {t.disclaimerText}
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
