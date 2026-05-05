import React, { useState, useMemo, useEffect, useRef } from "react";
import { track } from "../../lib/analytics";

type Lang = "en" | "de";
type AfaMethod = "linear2" | "linear25" | "linear3" | "degressive5" | "custom";

const translations = {
  en: {
    eyebrow: "Tools & Calculators",
    title: "Anlage V Tax Saving Calculator",
    subtitle: "Estimate your taxable rental result and the actual tax effect at your marginal rate. Models all major Werbungskosten lines from the Anlage V form.",

    incomeTitle: "Rental Income",
    incomeSub: "Income side of Anlage V (lines 9 to 14)",
    monthlyRent: "Monthly cold rent (Kaltmiete)",
    monthlyRentHint: "The Kaltmiete only. Operating cost prepayments are tax-neutral and not modelled here.",
    annualRent: "Annual rental income",

    afaTitle: "AfA (Depreciation)",
    afaSub: "Anlage V lines 33 to 35",
    buildingValue: "Depreciable building value",
    buildingValueHint: "Purchase price minus land share. Use our AfA calculator if you don't have this figure.",
    afaCalcLink: "/afa-calculator",
    afaCalcLinkText: "Calculate AfA basis →",
    afaMethod: "AfA method",
    afaMethodCustom: "Custom (€)",
    afaLinear2: "2.0% linear (built 1925 or later)",
    afaLinear25: "2.5% linear (built before 1925)",
    afaLinear3: "3.0% linear (new build, post-Sep 2023)",
    afaDegressive5: "5.0% degressive (new build, year 1)",
    afaDegressiveNote: "Degressive AfA shrinks each year. Year 1 figure shown.",
    annualAfa: "Annual AfA",

    costsTitle: "Other Werbungskosten",
    costsSub: "Anlage V lines 36 to 84",
    schuldzinsen: "Mortgage interest paid (annual)",
    schuldzinsenHint: "Interest only, never the principal repayment. From your bank's Steuerbescheinigung.",
    hausgeld: "Non-recoverable Hausgeld",
    hausgeldHint: "Verwaltung, Instandhaltungsrücklage, dedicated bank fees. The portion you cannot pass on to tenants.",
    repairs: "Repairs and maintenance (Erhaltungsaufwand)",
    repairsHint: "Immediately deductible repairs. Watch the 15% Anschaffungsnaher Aufwand rule for the first 3 years.",
    grundsteuer: "Grundsteuer (if paid directly)",
    grundsteuerHint: "Set to €0 if passed through via Betriebskosten.",
    insurance: "Building insurance",
    insuranceHint: "Set to €0 if covered via Hausgeld.",
    other: "Other deductible costs",
    otherHint: "Steuerberater portion, travel (€0.30/km), letting fees, GWG up to €800 net, etc.",

    taxTitle: "Your Tax Situation",
    taxSub: "Determines your real cash effect",
    taxRate: "Marginal income tax rate",
    taxRateHint: "Your personal Grenzsteuersatz. 0% up to €12,084, then progressive to 42% (~€66,761) and 45% (~€277,826).",
    includeSoli: "Include Solidaritätszuschlag (5.5% of tax)",
    includeKiSt: "Include Kirchensteuer (8 to 9%)",
    effectiveRate: "Effective marginal rate",

    resultTitle: "Tax Result",
    annualIncome: "Annual rental income",
    totalCosts: "Total Werbungskosten",
    netResult: "Vermietungsergebnis",
    netResultProfit: "Taxable rental profit",
    netResultLoss: "Rental loss (offsets other income)",
    taxEffect: "Tax effect at your marginal rate",
    taxOwed: "Additional tax on rental profit",
    taxSaving: "Tax saving from rental loss",
    monthlyEffect: "Monthly effect",
    afterTaxResult: "Annual after-tax result",

    breakdownTitle: "Werbungskosten Breakdown",
    breakdownSub: "Each line as it would appear in Anlage V",
    afaShare: "AfA",
    interestShare: "Schuldzinsen",
    hausgeldShare: "Hausgeld (non-recoverable)",
    repairsShare: "Erhaltungsaufwand",
    grundsteuerShare: "Grundsteuer",
    insuranceShare: "Versicherung",
    otherShare: "Other",

    projectionTitle: "10-Year Projection",
    projectionSub: "Assuming static income, costs, and tax rate. Degressive AfA shrinks each year.",
    year: "Year",
    income: "Income",
    afa: "AfA",
    otherCosts: "Other costs",
    netResultCol: "Result",
    taxEffectCol: "Tax effect",
    cumulativeSaving: "Cumulative tax effect",

    tabSummary: "Summary",
    tabBreakdown: "Breakdown",
    tabProjection: "10-year",

    emptyTitle: "Enter rent and AfA to calculate",
    emptySub: "Fill in the monthly rent and either AfA basis or custom AfA amount.",

    estimateTitle: "Estimate only",
    estimateText: "These figures are pre-Anlage-V illustrative. Actual filing involves the 15% Anschaffungsnaher Aufwand rule, GWG limits, and other detail rules. Consult a Steuerberater for binding advice.",
  },
  de: {
    eyebrow: "Tools & Rechner",
    title: "Anlage V Steuerersparnis-Rechner",
    subtitle: "Berechnen Sie das steuerpflichtige Vermietungsergebnis und die tatsächliche Steuerwirkung zu Ihrem Grenzsteuersatz. Bildet alle wichtigen Werbungskostenzeilen der Anlage V ab.",

    incomeTitle: "Mieteinnahmen",
    incomeSub: "Einnahmenseite der Anlage V (Zeilen 9 bis 14)",
    monthlyRent: "Monatliche Kaltmiete",
    monthlyRentHint: "Nur die Kaltmiete. Betriebskostenvorauszahlungen sind steuerneutral und hier nicht modelliert.",
    annualRent: "Jährliche Mieteinnahmen",

    afaTitle: "AfA (Abschreibung)",
    afaSub: "Anlage V Zeilen 33 bis 35",
    buildingValue: "Abschreibbarer Gebäudewert",
    buildingValueHint: "Kaufpreis minus Grundstücksanteil. Nutzen Sie unseren AfA-Rechner, falls dieser Wert nicht vorliegt.",
    afaCalcLink: "/de/afa-rechner",
    afaCalcLinkText: "AfA-Bemessungsgrundlage berechnen →",
    afaMethod: "AfA-Methode",
    afaMethodCustom: "Eigener Betrag (€)",
    afaLinear2: "2,0% linear (Baujahr ab 1925)",
    afaLinear25: "2,5% linear (Baujahr vor 1925)",
    afaLinear3: "3,0% linear (Neubau, ab 30.09.2023)",
    afaDegressive5: "5,0% degressiv (Neubau, Jahr 1)",
    afaDegressiveNote: "Degressive AfA sinkt jedes Jahr. Wert für Jahr 1 angezeigt.",
    annualAfa: "Jährliche AfA",

    costsTitle: "Sonstige Werbungskosten",
    costsSub: "Anlage V Zeilen 36 bis 84",
    schuldzinsen: "Schuldzinsen (jährlich)",
    schuldzinsenHint: "Nur Zinsen, niemals die Tilgung. Aus der Steuerbescheinigung der Bank.",
    hausgeld: "Nicht umlagefähiges Hausgeld",
    hausgeldHint: "Verwaltung, Instandhaltungsrücklage, Bankgebühren. Der Anteil, den Sie nicht auf Mieter umlegen können.",
    repairs: "Reparaturen und Erhaltungsaufwand",
    repairsHint: "Sofort absetzbare Erhaltungsaufwendungen. Bei Erwerb in den letzten 3 Jahren auf die 15%-Regel achten.",
    grundsteuer: "Grundsteuer (bei Direktzahlung)",
    grundsteuerHint: "0 €, wenn über Betriebskosten umgelegt.",
    insurance: "Gebäudeversicherung",
    insuranceHint: "0 €, wenn im Hausgeld enthalten.",
    other: "Sonstige absetzbare Kosten",
    otherHint: "Steuerberater-Anteil, Fahrten (0,30 €/km), Vermietungskosten, GWG bis 800 € netto etc.",

    taxTitle: "Ihre Steuersituation",
    taxSub: "Bestimmt Ihre tatsächliche Cash-Wirkung",
    taxRate: "Grenzsteuersatz",
    taxRateHint: "Ihr persönlicher Einkommensteuersatz. 0% bis 12.084 €, dann progressiv bis 42% (ab ca. 66.761 €) und 45% (ab ca. 277.826 €).",
    includeSoli: "Solidaritätszuschlag einbeziehen (5,5% der Steuer)",
    includeKiSt: "Kirchensteuer einbeziehen (8 bis 9%)",
    effectiveRate: "Effektiver Grenzsteuersatz",

    resultTitle: "Steuerergebnis",
    annualIncome: "Jährliche Mieteinnahmen",
    totalCosts: "Werbungskosten gesamt",
    netResult: "Vermietungsergebnis",
    netResultProfit: "Steuerpflichtiger Vermietungsgewinn",
    netResultLoss: "Vermietungsverlust (mindert übriges Einkommen)",
    taxEffect: "Steuerwirkung zu Ihrem Grenzsteuersatz",
    taxOwed: "Zusätzliche Steuer auf Vermietungsgewinn",
    taxSaving: "Steuerersparnis durch Vermietungsverlust",
    monthlyEffect: "Monatliche Wirkung",
    afterTaxResult: "Jahresergebnis nach Steuern",

    breakdownTitle: "Werbungskostenaufstellung",
    breakdownSub: "Jede Position wie in Anlage V einzutragen",
    afaShare: "AfA",
    interestShare: "Schuldzinsen",
    hausgeldShare: "Hausgeld (nicht umlagefähig)",
    repairsShare: "Erhaltungsaufwand",
    grundsteuerShare: "Grundsteuer",
    insuranceShare: "Versicherung",
    otherShare: "Sonstige",

    projectionTitle: "10-Jahres-Projektion",
    projectionSub: "Bei statischen Einnahmen, Kosten und Steuersatz. Degressive AfA sinkt jedes Jahr.",
    year: "Jahr",
    income: "Einnahmen",
    afa: "AfA",
    otherCosts: "Sonstige Kosten",
    netResultCol: "Ergebnis",
    taxEffectCol: "Steuerwirkung",
    cumulativeSaving: "Kumulierte Steuerwirkung",

    tabSummary: "Übersicht",
    tabBreakdown: "Aufstellung",
    tabProjection: "10 Jahre",

    emptyTitle: "Geben Sie Miete und AfA ein, um zu berechnen",
    emptySub: "Tragen Sie die Kaltmiete sowie die AfA-Bemessungsgrundlage oder einen eigenen AfA-Betrag ein.",

    estimateTitle: "Nur eine Schätzung",
    estimateText: "Diese Werte sind illustrativ und vor Anlage V. Die tatsächliche Erklärung berücksichtigt die 15%-Anschaffungsnaher-Regel, GWG-Grenzen und weitere Detailregeln. Konsultieren Sie für verbindliche Aussagen einen Steuerberater.",
  },
};

function fmtEur(n: number, locale: string): string {
  const abs = Math.abs(Math.round(n));
  const formatted = abs.toLocaleString(locale === "de-DE" ? "de-DE" : "en-US");
  return (n < 0 ? "-€" : "€") + formatted;
}

function fmtPct(n: number): string {
  return n.toFixed(2) + "%";
}

const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ReceiptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z" /><line x1="9" y1="7" x2="14" y2="7" /><line x1="9" y1="11" x2="14" y2="11" /><line x1="9" y1="15" x2="14" y2="15" />
  </svg>
);
const TaxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const CalcIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="10" y2="10" /><line x1="14" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="10" y2="14" /><line x1="14" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="10" y2="18" /><line x1="14" y1="18" x2="16" y2="18" />
  </svg>
);
const WarningIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function getAfaRate(method: AfaMethod): number {
  switch (method) {
    case "linear2": return 2.0;
    case "linear25": return 2.5;
    case "linear3": return 3.0;
    case "degressive5": return 5.0;
    default: return 0;
  }
}

export default function AnlageVCalculator({ lang = "en" }: { lang?: Lang }) {
  const t = translations[lang];
  const locale = lang === "de" ? "de-DE" : "en-US";
  const fmt = (n: number) => fmtEur(n, locale);

  const [rentRaw, setRentRaw] = useState(lang === "de" ? "1.400" : "1,400");
  const [rent, setRent] = useState(1400);

  const [bvRaw, setBvRaw] = useState(lang === "de" ? "280.000" : "280,000");
  const [buildingValue, setBuildingValue] = useState(280000);
  const [afaMethod, setAfaMethod] = useState<AfaMethod>("linear2");
  const [customAfaRaw, setCustomAfaRaw] = useState("0");
  const [customAfa, setCustomAfa] = useState(0);

  const [interestRaw, setInterestRaw] = useState(lang === "de" ? "9.500" : "9,500");
  const [interest, setInterest] = useState(9500);
  const [hausgeldRaw, setHausgeldRaw] = useState(lang === "de" ? "2.200" : "2,200");
  const [hausgeld, setHausgeld] = useState(2200);
  const [repairsRaw, setRepairsRaw] = useState("400");
  const [repairs, setRepairs] = useState(400);
  const [grundsteuerRaw, setGrundsteuerRaw] = useState("420");
  const [grundsteuer, setGrundsteuer] = useState(420);
  const [insuranceRaw, setInsuranceRaw] = useState("240");
  const [insurance, setInsurance] = useState(240);
  const [otherRaw, setOtherRaw] = useState("400");
  const [other, setOther] = useState(400);

  const [taxRate, setTaxRate] = useState(42);
  const [includeSoli, setIncludeSoli] = useState(true);
  const [includeKiSt, setIncludeKiSt] = useState(false);

  const [activeTab, setActiveTab] = useState<"summary" | "breakdown" | "projection">("summary");

  // Effective marginal rate: marginal income tax + Soli (5.5% of tax) + KiSt (8.5% of tax avg)
  const effectiveRate = useMemo(() => {
    let r = taxRate;
    if (includeSoli) r += taxRate * 0.055;
    if (includeKiSt) r += taxRate * 0.085;
    return r;
  }, [taxRate, includeSoli, includeKiSt]);

  const annualAfa = useMemo(() => {
    if (afaMethod === "custom") return customAfa;
    return buildingValue * getAfaRate(afaMethod) / 100;
  }, [afaMethod, buildingValue, customAfa]);

  const result = useMemo(() => {
    if (rent <= 0) return null;
    const annualIncome = rent * 12;
    const totalCosts = annualAfa + interest + hausgeld + repairs + grundsteuer + insurance + other;
    const netResult = annualIncome - totalCosts;
    // If netResult is negative (loss), tax saving is positive (cash benefit). If positive (profit), additional tax owed.
    const taxEffect = -netResult * effectiveRate / 100;
    const afterTax = netResult + taxEffect;
    return { annualIncome, totalCosts, netResult, taxEffect, afterTax };
  }, [rent, annualAfa, interest, hausgeld, repairs, grundsteuer, insurance, other, effectiveRate]);

  const projection = useMemo(() => {
    if (!result) return [];
    const rows: Array<{ year: number; income: number; afa: number; otherCosts: number; netResult: number; taxEffect: number; cumTaxEffect: number }> = [];
    const otherCostsAnnual = interest + hausgeld + repairs + grundsteuer + insurance + other;
    let bookValue = afaMethod === "degressive5" ? buildingValue : 0;
    const linearAnnual = afaMethod === "degressive5" ? buildingValue * getAfaRate("linear3") / 100 : annualAfa;
    let cumTaxEffect = 0;
    for (let y = 1; y <= 10; y++) {
      let yearAfa: number;
      if (afaMethod === "degressive5") {
        const degAfa = bookValue * 0.05;
        yearAfa = degAfa >= linearAnnual ? degAfa : linearAnnual;
        bookValue -= yearAfa;
      } else {
        yearAfa = annualAfa;
      }
      const netResult = result.annualIncome - yearAfa - otherCostsAnnual;
      const taxEffect = -netResult * effectiveRate / 100;
      cumTaxEffect += taxEffect;
      rows.push({ year: y, income: result.annualIncome, afa: yearAfa, otherCosts: otherCostsAnnual, netResult, taxEffect, cumTaxEffect });
    }
    return rows;
  }, [result, afaMethod, buildingValue, annualAfa, interest, hausgeld, repairs, grundsteuer, insurance, other, effectiveRate]);

  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current && result) {
      track("calculator_used", {
        calculator: "anlage_v",
        annual_rent: result.annualIncome,
        total_costs: result.totalCosts,
        net_result: result.netResult,
        tax_effect: result.taxEffect,
        afa_method: afaMethod,
        tax_rate: taxRate,
        lang,
      });
    }
    tracked.current = true;
  }, [rent, annualAfa, interest, hausgeld, repairs, grundsteuer, insurance, other, taxRate, afaMethod]);

  function num(raw: string, setter: (v: number) => void, rawSetter: (v: string) => void, max = 50000000) {
    rawSetter(raw);
    const v = parseInt(raw.replace(/\D/g, ""), 10);
    if (!isNaN(v) && v >= 0) setter(Math.min(v, max));
    else setter(0);
  }
  function blur(value: number, rawSetter: (v: string) => void) {
    if (value > 0) rawSetter(value.toLocaleString(locale));
  }

  const inputCls = "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";
  const selectCls = "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 appearance-none";

  function eurInput(value: number, raw: string, rawSetter: (v: string) => void, setter: (v: number) => void, hint?: string, max = 50000000) {
    return (
      <>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
          <input
            type="text"
            inputMode="numeric"
            className={inputCls + " pl-7"}
            value={raw}
            onChange={(e) => num(e.target.value, setter, rawSetter, max)}
            onBlur={() => blur(value, rawSetter)}
          />
        </div>
        {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
      </>
    );
  }

  return (
    <div className="mx-auto max-w-[1060px]">
      <div className="mb-8">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-brand-500">{t.eyebrow}</p>
        <h1 className="mb-2 font-display text-[30px] leading-[1.15] font-bold tracking-tight" style={{ color: "#253553" }}>
          {t.title}
        </h1>
        <p className="max-w-[560px] text-[15px] text-gray-500">{t.subtitle}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[420px_1fr]">
        {/* LEFT: Inputs */}
        <div className="space-y-5">
          {/* Income */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><HouseIcon /></div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.incomeTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.incomeSub}</p>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">{t.monthlyRent}</label>
              {eurInput(rent, rentRaw, setRentRaw, setRent, t.monthlyRentHint, 100000)}
              <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs">
                <span className="font-medium text-emerald-700">{t.annualRent}</span>
                <span className="font-mono font-semibold text-emerald-600">{fmt(rent * 12)}</span>
              </div>
            </div>
          </div>

          {/* AfA */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-500"><CalcIcon /></div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.afaTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.afaSub}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.afaMethod}</label>
                <select
                  className={selectCls}
                  value={afaMethod}
                  onChange={(e) => setAfaMethod(e.target.value as AfaMethod)}
                >
                  <option value="linear2">{t.afaLinear2}</option>
                  <option value="linear25">{t.afaLinear25}</option>
                  <option value="linear3">{t.afaLinear3}</option>
                  <option value="degressive5">{t.afaDegressive5}</option>
                  <option value="custom">{t.afaMethodCustom}</option>
                </select>
                {afaMethod === "degressive5" && (
                  <p className="mt-1 text-[11px] text-gray-400">{t.afaDegressiveNote}</p>
                )}
              </div>

              {afaMethod === "custom" ? (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">{t.annualAfa}</label>
                  {eurInput(customAfa, customAfaRaw, setCustomAfaRaw, setCustomAfa, undefined, 1000000)}
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">{t.buildingValue}</label>
                  {eurInput(buildingValue, bvRaw, setBvRaw, setBuildingValue)}
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[11px] text-gray-400">{t.buildingValueHint}</p>
                    <a href={t.afaCalcLink} className="shrink-0 text-[11px] font-medium text-brand-500 hover:underline">{t.afaCalcLinkText}</a>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-xs">
                <span className="font-medium text-brand-700">{t.annualAfa}</span>
                <span className="font-mono font-semibold text-brand-600">{fmt(annualAfa)}</span>
              </div>
            </div>
          </div>

          {/* Other Werbungskosten */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-500"><ReceiptIcon /></div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.costsTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.costsSub}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.schuldzinsen}</label>
                {eurInput(interest, interestRaw, setInterestRaw, setInterest, t.schuldzinsenHint)}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.hausgeld}</label>
                {eurInput(hausgeld, hausgeldRaw, setHausgeldRaw, setHausgeld, t.hausgeldHint, 100000)}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.repairs}</label>
                {eurInput(repairs, repairsRaw, setRepairsRaw, setRepairs, t.repairsHint, 1000000)}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.grundsteuer}</label>
                {eurInput(grundsteuer, grundsteuerRaw, setGrundsteuerRaw, setGrundsteuer, t.grundsteuerHint, 100000)}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.insurance}</label>
                {eurInput(insurance, insuranceRaw, setInsuranceRaw, setInsurance, t.insuranceHint, 100000)}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.other}</label>
                {eurInput(other, otherRaw, setOtherRaw, setOther, t.otherHint, 100000)}
              </div>
            </div>
          </div>

          {/* Tax */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><TaxIcon /></div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.taxTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.taxSub}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{t.taxRate}</span>
                  <span className="font-mono text-purple-600">{taxRate}%</span>
                </label>
                <input
                  type="range" min="0" max="45" step="1" value={taxRate}
                  onChange={(e) => setTaxRate(parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <p className="mt-1 text-[11px] text-gray-400">{t.taxRateHint}</p>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={includeSoli} onChange={(e) => setIncludeSoli(e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-purple-600" />
                <span className="text-xs text-gray-700">{t.includeSoli}</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={includeKiSt} onChange={(e) => setIncludeKiSt(e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-purple-600" />
                <span className="text-xs text-gray-700">{t.includeKiSt}</span>
              </label>
              <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 text-xs">
                <span className="font-medium text-purple-700">{t.effectiveRate}</span>
                <span className="font-mono font-semibold text-purple-600">{fmtPct(effectiveRate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-5">
          {!result ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-16 text-center shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"><CalcIcon /></div>
              <h3 className="text-base font-semibold text-gray-900">{t.emptyTitle}</h3>
              <p className="mt-1 text-sm text-gray-400">{t.emptySub}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[11px] font-medium text-gray-500">{t.annualIncome}</p>
                  <p className="mt-1 font-display text-xl font-bold tracking-tight text-emerald-600">{fmt(result.annualIncome)}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[11px] font-medium text-gray-500">{t.totalCosts}</p>
                  <p className="mt-1 font-display text-xl font-bold tracking-tight text-amber-600">{fmt(result.totalCosts)}</p>
                </div>
                <div className={`rounded-xl border p-4 ${result.netResult >= 0 ? "border-brand-200 bg-brand-50" : "border-purple-200 bg-purple-50"}`}>
                  <p className="text-[11px] font-medium text-gray-500">{t.netResult}</p>
                  <p className={`mt-1 font-display text-xl font-bold tracking-tight ${result.netResult >= 0 ? "text-brand-600" : "text-purple-600"}`}>
                    {fmt(result.netResult)}
                  </p>
                </div>
              </div>

              {/* Tax effect highlight */}
              <div className={`rounded-xl border-2 p-5 ${result.taxEffect >= 0 ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {result.netResult < 0 ? t.taxSaving : t.taxOwed}
                    </p>
                    <p className={`mt-1 font-display text-3xl font-bold tracking-tight ${result.taxEffect >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      {fmt(result.taxEffect)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {t.monthlyEffect}: {fmt(result.taxEffect / 12)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{t.afterTaxResult}</p>
                    <p className={`font-display text-xl font-semibold ${result.afterTax >= 0 ? "text-gray-900" : "text-gray-700"}`}>
                      {fmt(result.afterTax)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex border-b border-gray-100">
                  {(["summary", "breakdown", "projection"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 text-xs font-semibold transition ${activeTab === tab ? "border-b-2 border-brand-500 text-brand-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {tab === "summary" ? t.tabSummary : tab === "breakdown" ? t.tabBreakdown : t.tabProjection}
                    </button>
                  ))}
                </div>
                <div className="p-5">
                  {activeTab === "summary" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                        <span className="text-gray-500">{t.annualIncome}</span>
                        <span className="font-mono font-semibold text-emerald-600">+{fmt(result.annualIncome)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t.afaShare}</span>
                        <span className="font-mono text-red-500">-{fmt(annualAfa)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t.interestShare}</span>
                        <span className="font-mono text-red-500">-{fmt(interest)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t.hausgeldShare}</span>
                        <span className="font-mono text-red-500">-{fmt(hausgeld)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t.repairsShare} + {t.grundsteuerShare} + {t.insuranceShare} + {t.otherShare}</span>
                        <span className="font-mono text-red-500">-{fmt(repairs + grundsteuer + insurance + other)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-sm font-semibold">
                        <span className="text-gray-900">{t.netResult}</span>
                        <span className={`font-mono ${result.netResult >= 0 ? "text-brand-600" : "text-purple-600"}`}>
                          {fmt(result.netResult)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">× {fmtPct(effectiveRate)} {t.taxEffect}</span>
                        <span className={`font-mono font-semibold ${result.taxEffect >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {fmt(result.taxEffect)}
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === "breakdown" && (
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.breakdownTitle}</h3>
                      <p className="mb-4 text-[11px] text-gray-500">{t.breakdownSub}</p>
                      {(() => {
                        const items = [
                          { label: t.afaShare, value: annualAfa, color: "bg-brand-400" },
                          { label: t.interestShare, value: interest, color: "bg-purple-400" },
                          { label: t.hausgeldShare, value: hausgeld, color: "bg-amber-400" },
                          { label: t.repairsShare, value: repairs, color: "bg-emerald-400" },
                          { label: t.grundsteuerShare, value: grundsteuer, color: "bg-cyan-400" },
                          { label: t.insuranceShare, value: insurance, color: "bg-pink-400" },
                          { label: t.otherShare, value: other, color: "bg-gray-400" },
                        ].filter(i => i.value > 0);
                        const max = Math.max(...items.map(i => i.value), 1);
                        return (
                          <div className="space-y-2.5">
                            {items.map((it) => (
                              <div key={it.label}>
                                <div className="mb-1 flex items-center justify-between text-[11px]">
                                  <span className="text-gray-600 font-medium">{it.label}</span>
                                  <span className="font-mono text-gray-700">{fmt(it.value)} <span className="text-gray-400">({((it.value / result.totalCosts) * 100).toFixed(0)}%)</span></span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-100">
                                  <div className={`h-full rounded-full ${it.color}`} style={{ width: `${(it.value / max) * 100}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {activeTab === "projection" && (
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.projectionTitle}</h3>
                      <p className="mb-4 text-[11px] text-gray-500">{t.projectionSub}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400">
                              <th className="py-2 pr-3 text-left font-medium">{t.year}</th>
                              <th className="py-2 px-3 text-right font-medium">{t.afa}</th>
                              <th className="py-2 px-3 text-right font-medium">{t.netResultCol}</th>
                              <th className="py-2 px-3 text-right font-medium">{t.taxEffectCol}</th>
                              <th className="py-2 pl-3 text-right font-medium">{t.cumulativeSaving}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projection.map((row) => (
                              <tr key={row.year} className="border-b border-gray-50">
                                <td className="py-1.5 pr-3 font-mono text-gray-500">{row.year}</td>
                                <td className="py-1.5 px-3 text-right font-mono text-gray-700">{fmt(row.afa)}</td>
                                <td className={`py-1.5 px-3 text-right font-mono ${row.netResult >= 0 ? "text-brand-600" : "text-purple-600"}`}>{fmt(row.netResult)}</td>
                                <td className={`py-1.5 px-3 text-right font-mono ${row.taxEffect >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmt(row.taxEffect)}</td>
                                <td className={`py-1.5 pl-3 text-right font-mono font-semibold ${row.cumTaxEffect >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmt(row.cumTaxEffect)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="mt-0.5 shrink-0 text-amber-500"><WarningIcon /></div>
                <div>
                  <p className="text-xs font-semibold text-amber-800">{t.estimateTitle}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-amber-700/80">{t.estimateText}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
