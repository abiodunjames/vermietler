import React, { useState, useMemo } from "react";

type Lang = "en" | "de";
type BuildingType = "post2023" | "post1924" | "pre1925" | "denkmal";
type Method = "linear" | "degressive";

const translations = {
  en: {
    eyebrow: "Tools & Calculators",
    title: "Depreciation Calculator (AfA) for German Rental Property",
    subtitle: "Calculate your annual tax deduction from property depreciation — linear vs degressive AfA, by tax bracket.",
    inputTitle: "Property Details",
    inputSub: "Enter your property parameters",
    purchasePrice: "Purchase price",
    landShare: "Land share",
    landShareHint: "The land portion is not depreciable. Typically 20–40% depending on location. Your notary contract or Gutachten will state the split.",
    buildingValue: "Depreciable building value",
    buildingType: "Building type",
    typePost2023: "New build — completed after 30 Sep 2023",
    typePost1924: "Existing — completed 1925 or later",
    typePre1925: "Historic — completed before 1925",
    typeDenkmal: "Listed heritage (Denkmalschutz)",
    method: "Depreciation method",
    methodLinear: "Linear",
    methodDegressive: "Degressive",
    methodHint: "Degressive AfA (5% declining) is only available for buildings completed after 30 Sep 2023 (§ 7 Abs. 5a EStG).",
    taxTitle: "Your Tax Situation",
    taxSub: "Determines your actual tax savings",
    taxRate: "Marginal tax rate",
    taxRateHint: "Your personal income tax bracket. In Germany: 0% up to €12,084, then progressive up to 42% (from ~€66,761) and 45% (from ~€277,826). Add Soli (5.5% of tax) if applicable.",
    includeKiSt: "Include Kirchensteuer (8–9%)",
    effectiveRate: "Effective marginal rate",
    resultsTitle: "Annual Depreciation & Tax Savings",
    annualAfa: "Annual AfA deduction",
    annualSaving: "Annual tax saving",
    monthlySaving: "Monthly tax saving",
    afaRate: "AfA rate",
    usefulLife: "Useful life",
    years: "years",
    perYear: "/yr",
    perMonth: "/mo",
    totalTitle: "Lifetime Depreciation",
    totalAfa: "Total AfA over useful life",
    totalSaving: "Total tax savings",
    avgAnnualSaving: "Avg. annual saving",
    comparisonTitle: "Linear vs Degressive Comparison",
    comparisonSub: "First 10 years of depreciation",
    comparisonNote: "Degressive AfA applies 5% to the remaining book value each year — deductions shrink over time but are much larger in the early years when cash flow matters most.",
    year: "Year",
    linearAfa: "Linear AfA",
    degressiveAfa: "Degressive AfA",
    degressiveSaving: "Degressive saving",
    linearSaving: "Linear saving",
    cumulative: "Cumulative",
    difference: "Difference",
    degressiveAdvantage: "Degressive advantage in year",
    switchNote: "You can switch from degressive to linear mid-way (one-time, irrevocable). Optimal switch point is when the linear amount exceeds the degressive amount.",
    optimalSwitch: "Optimal switch to linear",
    inYear: "in year",
    afterYear: "after year",
    tabSummary: "Summary",
    tabComparison: "Comparison",
    tabSchedule: "Schedule",
    emptyTitle: "Enter details to calculate",
    emptySub: "Fill in the purchase price and building type to see your AfA deduction and tax savings.",
    estimateTitle: "Estimate only",
    estimateText: "These figures are illustrative and assume stable tax rates. Actual tax savings depend on your total income, deductions, and personal circumstances. Consult a Steuerberater for binding tax advice.",
    scheduleTitle: "Depreciation schedule",
    bookValue: "Book value",
    taxSaving: "Tax saving",
    renovationCosts: "Renovation costs (§ 7h/7i)",
    renovationHint: "For Denkmalschutz properties: eligible renovation costs can be depreciated at 9% p.a. for 8 years + 7% p.a. for 4 years (total 100% over 12 years).",
    denkmalNote: "Denkmalschutz enhanced depreciation applies only to approved renovation costs, not to the purchase price of the building itself. The building portion depreciates at the standard rate for its age.",
    legalBasis: "Legal basis",
    legalLinear: "§ 7 Abs. 4 EStG — Linear depreciation",
    legalDegressive: "§ 7 Abs. 5a EStG — Degressive depreciation (from 2023)",
    legalDenkmal: "§§ 7h/7i EStG — Enhanced Denkmalschutz depreciation",
  },
  de: {
    eyebrow: "Tools & Rechner",
    title: "AfA-Rechner für Mietimmobilien",
    subtitle: "Berechnen Sie Ihre jährliche Steuerersparnis durch Gebäudeabschreibung — lineare vs. degressive AfA, nach Steuersatz.",
    inputTitle: "Immobiliendetails",
    inputSub: "Geben Sie Ihre Immobilienparameter ein",
    purchasePrice: "Kaufpreis",
    landShare: "Grundstücksanteil",
    landShareHint: "Der Grundstücksanteil ist nicht abschreibbar. Typisch 20–40% je nach Lage. Ihr Notarvertrag oder Gutachten nennt die Aufteilung.",
    buildingValue: "Abschreibbarer Gebäudewert",
    buildingType: "Gebäudetyp",
    typePost2023: "Neubau — Fertigstellung nach 30.09.2023",
    typePost1924: "Bestand — Fertigstellung ab 1925",
    typePre1925: "Altbau — Fertigstellung vor 1925",
    typeDenkmal: "Denkmalschutz-Immobilie",
    method: "Abschreibungsmethode",
    methodLinear: "Linear",
    methodDegressive: "Degressiv",
    methodHint: "Degressive AfA (5% vom Restwert) ist nur für Gebäude mit Fertigstellung nach dem 30.09.2023 verfügbar (§ 7 Abs. 5a EStG).",
    taxTitle: "Ihre Steuersituation",
    taxSub: "Bestimmt Ihre tatsächliche Steuerersparnis",
    taxRate: "Grenzsteuersatz",
    taxRateHint: "Ihr persönlicher Einkommensteuersatz. In Deutschland: 0% bis 12.084 €, dann progressiv bis 42% (ab ~66.761 €) und 45% (ab ~277.826 €). Ggf. Soli (5,5% der Steuer) addieren.",
    includeKiSt: "Kirchensteuer einbeziehen (8–9%)",
    effectiveRate: "Effektiver Grenzsteuersatz",
    resultsTitle: "Jährliche Abschreibung & Steuerersparnis",
    annualAfa: "Jährliche AfA-Absetzung",
    annualSaving: "Jährliche Steuerersparnis",
    monthlySaving: "Monatliche Steuerersparnis",
    afaRate: "AfA-Satz",
    usefulLife: "Nutzungsdauer",
    years: "Jahre",
    perYear: "/Jahr",
    perMonth: "/Monat",
    totalTitle: "Abschreibung über Nutzungsdauer",
    totalAfa: "Gesamt-AfA über Nutzungsdauer",
    totalSaving: "Gesamte Steuerersparnis",
    avgAnnualSaving: "Ø jährliche Ersparnis",
    comparisonTitle: "Linear vs. Degressiv im Vergleich",
    comparisonSub: "Erste 10 Jahre der Abschreibung",
    comparisonNote: "Degressive AfA wendet 5% auf den Restbuchwert an — die Absetzungen sinken über die Zeit, sind aber in den ersten Jahren deutlich höher, wenn der Cashflow am wichtigsten ist.",
    year: "Jahr",
    linearAfa: "Lineare AfA",
    degressiveAfa: "Degressive AfA",
    degressiveSaving: "Degressive Ersparnis",
    linearSaving: "Lineare Ersparnis",
    cumulative: "Kumuliert",
    difference: "Differenz",
    degressiveAdvantage: "Degressiver Vorteil in Jahr",
    switchNote: "Sie können einmalig und unwiderruflich von degressiv auf linear wechseln. Der optimale Wechselzeitpunkt ist, wenn der lineare Betrag den degressiven übersteigt.",
    optimalSwitch: "Optimaler Wechsel zu linear",
    inYear: "in Jahr",
    afterYear: "nach Jahr",
    tabSummary: "Übersicht",
    tabComparison: "Vergleich",
    tabSchedule: "Abschreibungsplan",
    emptyTitle: "Eingaben zum Berechnen",
    emptySub: "Geben Sie den Kaufpreis und Gebäudetyp ein, um Ihre AfA und Steuerersparnis zu sehen.",
    estimateTitle: "Nur eine Schätzung",
    estimateText: "Diese Zahlen sind illustrativ und setzen stabile Steuersätze voraus. Die tatsächliche Steuerersparnis hängt von Ihrem Gesamteinkommen, Abzügen und persönlichen Umständen ab. Konsultieren Sie einen Steuerberater für verbindliche Steuerberatung.",
    scheduleTitle: "Abschreibungsplan",
    bookValue: "Buchwert",
    taxSaving: "Steuerersparnis",
    renovationCosts: "Sanierungskosten (§ 7h/7i)",
    renovationHint: "Für Denkmalschutz: Förderfähige Sanierungskosten können mit 9% p.a. über 8 Jahre + 7% p.a. über 4 Jahre abgeschrieben werden (100% in 12 Jahren).",
    denkmalNote: "Die erhöhte Denkmalschutz-AfA gilt nur für anerkannte Sanierungskosten, nicht für den Kaufpreis des Gebäudes selbst. Der Gebäudeanteil wird zum Regelsatz des Baualters abgeschrieben.",
    legalBasis: "Rechtsgrundlage",
    legalLinear: "§ 7 Abs. 4 EStG — Lineare Abschreibung",
    legalDegressive: "§ 7 Abs. 5a EStG — Degressive Abschreibung (ab 2023)",
    legalDenkmal: "§§ 7h/7i EStG — Erhöhte Denkmalschutz-AfA",
  },
};

function fmtEur(n: number, locale: string): string {
  return "€" + Math.round(n).toLocaleString(locale === "de-DE" ? "de-DE" : "en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(2) + "%";
}

/* ── Icons ── */
const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TaxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const WarningTriangle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Depreciation logic ── */
function getLinearRate(type: BuildingType): number {
  switch (type) {
    case "post2023": return 3.0;
    case "post1924": return 2.0;
    case "pre1925": return 2.5;
    case "denkmal": return 2.0; // building itself at standard rate
  }
}

function getUsefulLife(type: BuildingType): number {
  switch (type) {
    case "post2023": return 33;
    case "post1924": return 50;
    case "pre1925": return 40;
    case "denkmal": return 50;
  }
}

interface ScheduleRow {
  year: number;
  afa: number;
  cumAfa: number;
  bookValue: number;
  taxSaving: number;
}

function buildLinearSchedule(buildingValue: number, rate: number, life: number, effectiveRate: number): ScheduleRow[] {
  const annualAfa = buildingValue * rate / 100;
  const rows: ScheduleRow[] = [];
  let cumAfa = 0;
  for (let y = 1; y <= life; y++) {
    const remaining = buildingValue - cumAfa;
    const afa = Math.min(annualAfa, remaining);
    if (afa <= 0) break;
    cumAfa += afa;
    rows.push({
      year: y,
      afa,
      cumAfa,
      bookValue: buildingValue - cumAfa,
      taxSaving: afa * effectiveRate / 100,
    });
  }
  return rows;
}

function buildDegressiveSchedule(buildingValue: number, linearRate: number, effectiveRate: number): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  let bookValue = buildingValue;
  let cumAfa = 0;
  const linearAnnual = buildingValue * linearRate / 100;

  for (let y = 1; y <= 50 && bookValue > 0; y++) {
    const degressiveAfa = bookValue * 0.05;
    // Switch to linear when linear exceeds degressive
    const afa = degressiveAfa >= linearAnnual ? degressiveAfa : Math.min(linearAnnual, bookValue);
    cumAfa += afa;
    bookValue -= afa;
    if (bookValue < 0.5) bookValue = 0;
    rows.push({
      year: y,
      afa,
      cumAfa,
      bookValue,
      taxSaving: afa * effectiveRate / 100,
    });
    if (bookValue <= 0) break;
  }
  return rows;
}

function buildDenkmalSchedule(renovationCosts: number, effectiveRate: number): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  let cumAfa = 0;
  // 9% for years 1-8, 7% for years 9-12
  for (let y = 1; y <= 12; y++) {
    const rate = y <= 8 ? 0.09 : 0.07;
    const afa = renovationCosts * rate;
    cumAfa += afa;
    rows.push({
      year: y,
      afa,
      cumAfa,
      bookValue: renovationCosts - cumAfa,
      taxSaving: afa * effectiveRate / 100,
    });
  }
  return rows;
}

/* ── Main Component ── */
export default function DepreciationCalculator({ lang = "en" }: { lang?: Lang }) {
  const t = translations[lang];
  const locale = lang === "de" ? "de-DE" : "en-US";
  const fmt = (n: number) => fmtEur(n, locale);

  const [priceRaw, setPriceRaw] = useState(lang === "de" ? "350.000" : "350,000");
  const [price, setPrice] = useState(350000);
  const [landPct, setLandPct] = useState(25);
  const [buildingType, setBuildingType] = useState<BuildingType>("post2023");
  const [method, setMethod] = useState<Method>("degressive");
  const [taxRate, setTaxRate] = useState(42);
  const [includeKiSt, setIncludeKiSt] = useState(false);
  const [renovRaw, setRenovRaw] = useState(lang === "de" ? "100.000" : "100,000");
  const [renovCosts, setRenovCosts] = useState(100000);
  const [activeTab, setActiveTab] = useState<"summary" | "comparison" | "schedule">("summary");

  const buildingValue = price * (100 - landPct) / 100;
  const effectiveRate = includeKiSt ? taxRate * 1.085 : taxRate; // ~8.5% avg KiSt
  const canDegressive = buildingType === "post2023";
  const activeMethod = canDegressive ? method : "linear";
  const linearRate = getLinearRate(buildingType);
  const usefulLife = getUsefulLife(buildingType);

  const result = useMemo(() => {
    if (price <= 0) return null;

    const linearSchedule = buildLinearSchedule(buildingValue, linearRate, usefulLife, effectiveRate);
    const degressiveSchedule = canDegressive
      ? buildDegressiveSchedule(buildingValue, linearRate, effectiveRate)
      : null;
    const denkmalSchedule = buildingType === "denkmal" && renovCosts > 0
      ? buildDenkmalSchedule(renovCosts, effectiveRate)
      : null;

    const activeSchedule = activeMethod === "degressive" && degressiveSchedule
      ? degressiveSchedule
      : linearSchedule;

    const annualAfa = activeSchedule[0]?.afa ?? 0;
    const annualSaving = annualAfa * effectiveRate / 100;
    const totalAfa = activeSchedule.reduce((s, r) => s + r.afa, 0);
    const totalSaving = totalAfa * effectiveRate / 100;
    const totalYears = activeSchedule.length;

    // Find optimal switch point for degressive
    let optimalSwitchYear = 0;
    if (degressiveSchedule) {
      const linearAnnual = buildingValue * linearRate / 100;
      let bv = buildingValue;
      for (let y = 1; y <= 50; y++) {
        const degAfa = bv * 0.05;
        if (degAfa < linearAnnual) {
          optimalSwitchYear = y;
          break;
        }
        bv -= degAfa;
      }
    }

    // Denkmal totals
    const denkmalTotalAfa = denkmalSchedule?.reduce((s, r) => s + r.afa, 0) ?? 0;
    const denkmalTotalSaving = denkmalTotalAfa * effectiveRate / 100;

    return {
      linearSchedule,
      degressiveSchedule,
      denkmalSchedule,
      activeSchedule,
      annualAfa,
      annualSaving,
      totalAfa,
      totalSaving,
      totalYears,
      optimalSwitchYear,
      denkmalTotalAfa,
      denkmalTotalSaving,
    };
  }, [price, landPct, buildingType, activeMethod, taxRate, includeKiSt, renovCosts, buildingValue, linearRate, usefulLife, effectiveRate, canDegressive]);

  function handleNumberInput(raw: string, setter: (v: number) => void, rawSetter: (v: string) => void, max = 50000000) {
    rawSetter(raw);
    const v = parseInt(raw.replace(/\D/g, ""), 10);
    if (!isNaN(v) && v >= 0) setter(Math.min(v, max));
    else setter(0);
  }

  function formatOnBlur(value: number, rawSetter: (v: string) => void) {
    if (value > 0) rawSetter(value.toLocaleString(locale));
  }

  const inputCls = "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";
  const selectCls = "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 appearance-none";

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
        <div className="space-y-5">
          {/* Property details */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <HouseIcon />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.inputTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.inputSub}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Purchase price */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.purchasePrice}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + " pl-7"}
                    value={priceRaw}
                    onChange={(e) => handleNumberInput(e.target.value, setPrice, setPriceRaw)}
                    onBlur={() => formatOnBlur(price, setPriceRaw)}
                  />
                </div>
              </div>

              {/* Land share */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{t.landShare}</span>
                  <span className="font-mono text-brand-500">{landPct}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={landPct}
                  onChange={(e) => setLandPct(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">{t.landShareHint}</p>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-xs">
                  <span className="font-medium text-brand-700">{t.buildingValue}</span>
                  <span className="font-mono font-semibold text-brand-600">{fmt(buildingValue)}</span>
                </div>
              </div>

              {/* Building type */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.buildingType}</label>
                <select
                  className={selectCls}
                  value={buildingType}
                  onChange={(e) => {
                    const v = e.target.value as BuildingType;
                    setBuildingType(v);
                    if (v !== "post2023") setMethod("linear");
                  }}
                >
                  <option value="post2023">{t.typePost2023}</option>
                  <option value="post1924">{t.typePost1924}</option>
                  <option value="pre1925">{t.typePre1925}</option>
                  <option value="denkmal">{t.typeDenkmal}</option>
                </select>
              </div>

              {/* Method (only for post-2023) */}
              {canDegressive && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">{t.method}</label>
                  <div className="flex gap-2">
                    {(["linear", "degressive"] as Method[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`flex-1 rounded-lg border-[1.5px] px-3 py-2 text-xs font-semibold transition ${
                          method === m
                            ? "border-brand-400 bg-brand-50 text-brand-700"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {m === "linear" ? t.methodLinear : t.methodDegressive}
                        <span className="block mt-0.5 font-mono text-[10px] opacity-70">
                          {m === "linear" ? `${linearRate}% p.a.` : "5% p.a."}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-400">{t.methodHint}</p>
                </div>
              )}

              {/* Renovation costs for Denkmalschutz */}
              {buildingType === "denkmal" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">{t.renovationCosts}</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className={inputCls + " pl-7"}
                      value={renovRaw}
                      onChange={(e) => handleNumberInput(e.target.value, setRenovCosts, setRenovRaw)}
                      onBlur={() => formatOnBlur(renovCosts, setRenovRaw)}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">{t.renovationHint}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tax situation */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <TaxIcon />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.taxTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.taxSub}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Tax rate slider */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{t.taxRate}</span>
                  <span className="font-mono text-emerald-600">{taxRate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="45"
                  step="1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400">
                  <span>0%</span>
                  <span>14%</span>
                  <span>42%</span>
                  <span>45%</span>
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{t.taxRateHint}</p>
              </div>

              {/* Kirchensteuer toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeKiSt}
                  onChange={(e) => setIncludeKiSt(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 accent-emerald-600"
                />
                <span className="text-xs text-gray-700">{t.includeKiSt}</span>
              </label>

              {/* Effective rate */}
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs">
                <span className="font-medium text-emerald-700">{t.effectiveRate}</span>
                <span className="font-mono font-semibold text-emerald-600">{fmtPct(effectiveRate)}</span>
              </div>
            </div>
          </div>

          {/* Legal basis info */}
          <div className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mt-0.5 shrink-0 text-gray-400"><InfoCircle /></div>
            <div className="text-[11px] leading-relaxed text-gray-500">
              <p className="font-semibold text-gray-600 mb-1">{t.legalBasis}</p>
              <p>{t.legalLinear}</p>
              {canDegressive && <p>{t.legalDegressive}</p>}
              {buildingType === "denkmal" && <p>{t.legalDenkmal}</p>}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="space-y-5">
          {!result ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-16 text-center shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <TrendUpIcon />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{t.emptyTitle}</h3>
              <p className="mt-1 text-sm text-gray-400">{t.emptySub}</p>
            </div>
          ) : (
            <>
              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[11px] font-medium text-gray-500">{t.annualAfa}</p>
                  <p className="mt-1 font-display text-xl font-bold tracking-tight text-emerald-600">
                    {fmt(result.annualAfa)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{t.afaRate}: {activeMethod === "degressive" ? "5%" : `${linearRate}%`}</p>
                </div>
                <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
                  <p className="text-[11px] font-medium text-gray-500">{t.annualSaving}</p>
                  <p className="mt-1 font-display text-xl font-bold tracking-tight text-brand-600">
                    {fmt(result.annualSaving)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{t.perYear}</p>
                </div>
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                  <p className="text-[11px] font-medium text-gray-500">{t.monthlySaving}</p>
                  <p className="mt-1 font-display text-xl font-bold tracking-tight text-purple-600">
                    {fmt(result.annualSaving / 12)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{t.perMonth}</p>
                </div>
              </div>

              {/* Denkmal bonus */}
              {buildingType === "denkmal" && result.denkmalSchedule && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <InfoCircle />
                    <p className="text-xs font-semibold text-amber-800">{t.renovationCosts}</p>
                  </div>
                  <p className="text-[11px] text-amber-700 mb-2">{t.denkmalNote}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-700">{t.totalSaving} ({t.renovationCosts})</span>
                    <span className="font-mono font-semibold text-amber-800">{fmt(result.denkmalTotalSaving)}</span>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex border-b border-gray-100">
                  {(["summary", "comparison", "schedule"] as const)
                    .filter((tab) => tab !== "comparison" || canDegressive)
                    .map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 text-xs font-semibold transition ${
                        activeTab === tab
                          ? "border-b-2 border-brand-500 text-brand-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab === "summary" ? t.tabSummary : tab === "comparison" ? t.tabComparison : t.tabSchedule}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {activeTab === "summary" && (
                    <div className="space-y-5">
                      {/* Lifetime totals */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.totalTitle}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.buildingValue}</span>
                            <span className="font-medium text-gray-900">{fmt(buildingValue)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.afaRate}</span>
                            <span className="font-medium text-gray-900">
                              {activeMethod === "degressive" ? `5% ${t.methodDegressive}` : `${linearRate}% ${t.methodLinear}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.usefulLife}</span>
                            <span className="font-medium text-gray-900">{result.totalYears} {t.years}</span>
                          </div>
                          <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.totalAfa}</span>
                            <span className="font-semibold text-gray-900">{fmt(result.totalAfa)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.totalSaving}</span>
                            <span className="font-semibold text-emerald-600">{fmt(result.totalSaving)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.avgAnnualSaving}</span>
                            <span className="font-medium text-brand-600">{fmt(result.totalSaving / result.totalYears)}{t.perYear}</span>
                          </div>
                        </div>
                      </div>

                      {/* Visual bar: first 10 years */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {t.annualSaving} — {lang === "de" ? "Erste 10 Jahre" : "First 10 years"}
                        </h3>
                        <div className="space-y-1.5">
                          {result.activeSchedule.slice(0, 10).map((row) => (
                            <div key={row.year} className="flex items-center gap-2">
                              <span className="w-5 text-right text-[10px] font-mono text-gray-400">{row.year}</span>
                              <div className="flex-1 h-5 rounded bg-gray-100">
                                <div
                                  className="h-full rounded bg-emerald-400 transition-all duration-500 flex items-center justify-end pr-1.5"
                                  style={{ width: `${Math.min((row.taxSaving / (result.activeSchedule[0]?.taxSaving || 1)) * 100, 100)}%` }}
                                >
                                  <span className="text-[9px] font-mono font-medium text-white">{fmt(row.taxSaving)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Optimal switch point for degressive */}
                      {canDegressive && activeMethod === "degressive" && result.optimalSwitchYear > 0 && (
                        <div className="flex items-start gap-2.5 rounded-lg border border-brand-200 bg-brand-50 p-3">
                          <div className="mt-0.5 shrink-0 text-brand-500"><InfoCircle /></div>
                          <div className="text-[11px] text-brand-700">
                            <span className="font-semibold">{t.optimalSwitch}:</span> {t.afterYear} {result.optimalSwitchYear - 1} ({t.inYear} {result.optimalSwitchYear})
                            <p className="mt-1 text-brand-600/70">{t.switchNote}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "comparison" && canDegressive && result.degressiveSchedule && (
                    <div className="space-y-5">
                      <p className="text-[11px] text-gray-500">{t.comparisonNote}</p>

                      {/* Comparison table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400">
                              <th className="py-2 pr-3 text-left font-medium">{t.year}</th>
                              <th className="py-2 px-3 text-right font-medium">{t.linearAfa}</th>
                              <th className="py-2 px-3 text-right font-medium">{t.degressiveAfa}</th>
                              <th className="py-2 px-3 text-right font-medium">{t.difference}</th>
                              <th className="py-2 pl-3 text-right font-medium">{t.degressiveSaving}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.degressiveSchedule.slice(0, 15).map((degRow, i) => {
                              const linRow = result.linearSchedule[i];
                              if (!linRow) return null;
                              const diff = degRow.afa - linRow.afa;
                              return (
                                <tr key={degRow.year} className="border-b border-gray-50">
                                  <td className="py-1.5 pr-3 font-mono text-gray-500">{degRow.year}</td>
                                  <td className="py-1.5 px-3 text-right font-mono text-gray-600">{fmt(linRow.afa)}</td>
                                  <td className="py-1.5 px-3 text-right font-mono text-gray-900 font-medium">{fmt(degRow.afa)}</td>
                                  <td className={`py-1.5 px-3 text-right font-mono font-medium ${diff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                                    {diff >= 0 ? "+" : ""}{fmt(diff)}
                                  </td>
                                  <td className="py-1.5 pl-3 text-right font-mono text-brand-600">{fmt(degRow.taxSaving)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Cumulative comparison */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.cumulative} — 10 {t.years}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-gray-200 p-3 text-center">
                            <p className="text-[10px] text-gray-400">{t.linearSaving} (10 {t.years})</p>
                            <p className="mt-1 font-display text-lg font-bold text-gray-600">
                              {fmt(result.linearSchedule.slice(0, 10).reduce((s, r) => s + r.taxSaving, 0))}
                            </p>
                          </div>
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                            <p className="text-[10px] text-gray-400">{t.degressiveSaving} (10 {t.years})</p>
                            <p className="mt-1 font-display text-lg font-bold text-emerald-600">
                              {fmt(result.degressiveSchedule.slice(0, 10).reduce((s, r) => s + r.taxSaving, 0))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "schedule" && (
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.scheduleTitle}</h3>
                      <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 bg-white">
                            <tr className="border-b border-gray-100 text-gray-400">
                              <th className="py-2 pr-2 text-left font-medium">{t.year}</th>
                              <th className="py-2 px-2 text-right font-medium">{t.annualAfa}</th>
                              <th className="py-2 px-2 text-right font-medium">{t.cumulative}</th>
                              <th className="py-2 px-2 text-right font-medium">{t.bookValue}</th>
                              <th className="py-2 pl-2 text-right font-medium">{t.taxSaving}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.activeSchedule.map((row) => (
                              <tr key={row.year} className="border-b border-gray-50">
                                <td className="py-1.5 pr-2 font-mono text-gray-500">{row.year}</td>
                                <td className="py-1.5 px-2 text-right font-mono text-gray-900">{fmt(row.afa)}</td>
                                <td className="py-1.5 px-2 text-right font-mono text-gray-500">{fmt(row.cumAfa)}</td>
                                <td className="py-1.5 px-2 text-right font-mono text-gray-500">{fmt(row.bookValue)}</td>
                                <td className="py-1.5 pl-2 text-right font-mono text-emerald-600">{fmt(row.taxSaving)}</td>
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
                <div className="mt-0.5 shrink-0 text-amber-500"><WarningTriangle /></div>
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
