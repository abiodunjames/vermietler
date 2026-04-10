import React, { useState, useMemo, useEffect, useRef } from "react";
import { track } from "../../lib/analytics";

type Lang = "en" | "de";

const translations = {
  en: {
    eyebrow: "Tools & Calculators",
    title: "Rental Yield Calculator for Germany",
    subtitle: "Calculate gross yield, net yield, and cash-on-cash return for your German rental property investment.",
    inputTitle: "Property Details",
    inputSub: "Enter your investment parameters",
    purchasePrice: "Purchase price",
    monthlyRent: "Monthly cold rent (Kaltmiete)",
    monthlyRentHint: "The net rent excluding Nebenkosten. Check the local Mietspiegel for realistic estimates.",
    closingCosts: "Closing costs",
    closingCostsHint: "Typically 7–12% of purchase price. Use our closing cost calculator for an exact figure.",
    closingCostsLink: "/closing-cost-calculator",
    closingCostsLinkText: "Calculate exact closing costs →",
    annualCostsTitle: "Annual Costs (Non-recoverable)",
    annualCostsSub: "Costs you cannot pass on to tenants",
    hausgeld: "Non-recoverable Hausgeld",
    hausgeldHint: "The portion of Hausgeld not chargeable to tenants (Verwaltung, Instandhaltungsrücklage). Typically 30–50% of total Hausgeld.",
    maintenance: "Additional maintenance reserve",
    maintenanceHint: "Extra reserve beyond the WEG Instandhaltungsrücklage. €0 if you trust the WEG reserve is sufficient.",
    vacancy: "Vacancy allowance",
    vacancyHint: "Percentage of annual rent lost to vacancy between tenants. 2–5% is typical in German A-cities.",
    propertyTax: "Annual Grundsteuer",
    propertyTaxHint: "Check your local Finanzamt or the previous owner's Grundsteuerbescheid.",
    insurance: "Annual insurance (Gebäudeversicherung)",
    insuranceHint: "Building insurance not covered by Hausgeld. Set to €0 if included in Hausgeld.",
    financingTitle: "Financing",
    financingSub: "Leave blank for an all-cash purchase",
    loanAmount: "Loan amount",
    loanAmountHint: "Typically 70–90% of purchase price. Banks usually don't finance closing costs.",
    interestRate: "Interest rate (p.a.)",
    repaymentRate: "Initial repayment rate",
    perMonth: "/mo",
    perYear: "/yr",
    grossYield: "Gross rental yield",
    grossYieldDesc: "Annual rent ÷ purchase price",
    netYield: "Net rental yield",
    netYieldDesc: "Net income ÷ total investment",
    cashOnCash: "Cash-on-cash return",
    cashOnCashDesc: "Cash flow ÷ equity invested",
    monthlyPayment: "Monthly mortgage payment",
    monthlyCashFlow: "Monthly cash flow",
    annualRent: "Annual rental income",
    annualCosts: "Annual non-recoverable costs",
    annualNetIncome: "Annual net operating income",
    mortgagePayments: "Annual mortgage payments",
    annualCashFlow: "Annual cash flow (before tax)",
    totalInvestment: "Total investment",
    equityInvested: "Equity invested",
    purchasePriceLabel: "Purchase price",
    closingCostsLabel: "Closing costs",
    incomeBreakdown: "Income & Cost Breakdown",
    cashFlowBreakdown: "Cash Flow Analysis",
    monthlyView: "Monthly view",
    annualView: "Annual view",
    rentIncome: "Rent income",
    nonRecoverableCosts: "Non-recoverable costs",
    netOperatingIncome: "Net operating income",
    debtService: "Debt service",
    cashFlowLabel: "Cash flow",
    emptyTitle: "Enter details to calculate",
    emptySub: "Fill in the purchase price and monthly rent to see your rental yield.",
    estimateTitle: "Estimate only",
    estimateText: "These figures are illustrative and do not account for income tax, depreciation (AfA), or rent increases. Actual returns depend on your personal tax situation and property specifics. Consult a Steuerberater for tax-optimised calculations.",
    tabOverview: "Yield overview",
    tabCashflow: "Cash flow",
    yieldComparison: "Yield comparison",
    yieldComparisonSub: "How your property compares",
    goodYield: "A gross yield above 5% is generally considered good for German residential property.",
    benchmarkSavings: "Savings account (~2.5%)",
    benchmarkBonds: "German bonds (~3%)",
    benchmarkProperty: "Your property",
    benchmarkREIT: "German REITs (~4–6%)",
    benchmarkStocks: "DAX average (~7–8%)",
  },
  de: {
    eyebrow: "Tools & Rechner",
    title: "Mietrenditerechner für Immobilien",
    subtitle: "Berechnen Sie Bruttomietrendite, Nettomietrendite und Eigenkapitalrendite für Ihre Immobilien-Kapitalanlage.",
    inputTitle: "Immobiliendetails",
    inputSub: "Geben Sie Ihre Investitionsparameter ein",
    purchasePrice: "Kaufpreis",
    monthlyRent: "Monatliche Kaltmiete",
    monthlyRentHint: "Die Nettomiete ohne Nebenkosten. Prüfen Sie den lokalen Mietspiegel für realistische Werte.",
    closingCosts: "Kaufnebenkosten",
    closingCostsHint: "Typischerweise 7–12% des Kaufpreises. Nutzen Sie unseren Kaufnebenkostenrechner für eine genaue Berechnung.",
    closingCostsLink: "/de/kaufnebenkostenrechner",
    closingCostsLinkText: "Kaufnebenkosten berechnen →",
    annualCostsTitle: "Jährliche Kosten (nicht umlagefähig)",
    annualCostsSub: "Kosten, die nicht auf Mieter umgelegt werden können",
    hausgeld: "Nicht umlagefähiges Hausgeld",
    hausgeldHint: "Der Anteil des Hausgelds, der nicht auf Mieter umlegbar ist (Verwaltung, Instandhaltungsrücklage). Typischerweise 30–50% des Gesamthausgelds.",
    maintenance: "Zusätzliche Instandhaltungsrücklage",
    maintenanceHint: "Zusatzrücklage über die WEG-Instandhaltungsrücklage hinaus. 0 €, wenn die WEG-Rücklage ausreicht.",
    vacancy: "Leerstandsquote",
    vacancyHint: "Prozentsatz der Jahresmiete, der durch Leerstand verloren geht. 2–5% ist typisch in deutschen A-Städten.",
    propertyTax: "Jährliche Grundsteuer",
    propertyTaxHint: "Prüfen Sie den Grundsteuerbescheid des Finanzamts oder fragen Sie den Vorbesitzer.",
    insurance: "Jährliche Gebäudeversicherung",
    insuranceHint: "Gebäudeversicherung, die nicht im Hausgeld enthalten ist. 0 €, wenn im Hausgeld enthalten.",
    financingTitle: "Finanzierung",
    financingSub: "Leer lassen für einen Barkauf",
    loanAmount: "Darlehensbetrag",
    loanAmountHint: "Typischerweise 70–90% des Kaufpreises. Banken finanzieren in der Regel keine Kaufnebenkosten.",
    interestRate: "Sollzins (p.a.)",
    repaymentRate: "Anfängliche Tilgung",
    perMonth: "/Monat",
    perYear: "/Jahr",
    grossYield: "Bruttomietrendite",
    grossYieldDesc: "Jahresmiete ÷ Kaufpreis",
    netYield: "Nettomietrendite",
    netYieldDesc: "Nettoertrag ÷ Gesamtinvestition",
    cashOnCash: "Eigenkapitalrendite",
    cashOnCashDesc: "Cashflow ÷ Eigenkapital",
    monthlyPayment: "Monatliche Kreditrate",
    monthlyCashFlow: "Monatlicher Cashflow",
    annualRent: "Jährliche Mieteinnahmen",
    annualCosts: "Jährliche nicht umlagefähige Kosten",
    annualNetIncome: "Jährlicher Nettoertrag (NOI)",
    mortgagePayments: "Jährliche Kreditrate",
    annualCashFlow: "Jährlicher Cashflow (vor Steuer)",
    totalInvestment: "Gesamtinvestition",
    equityInvested: "Eingesetztes Eigenkapital",
    purchasePriceLabel: "Kaufpreis",
    closingCostsLabel: "Kaufnebenkosten",
    incomeBreakdown: "Einnahmen- & Kostenübersicht",
    cashFlowBreakdown: "Cashflow-Analyse",
    monthlyView: "Monatsansicht",
    annualView: "Jahresansicht",
    rentIncome: "Mieteinnahmen",
    nonRecoverableCosts: "Nicht umlagefähige Kosten",
    netOperatingIncome: "Nettobetriebsertrag",
    debtService: "Kapitaldienst",
    cashFlowLabel: "Cashflow",
    emptyTitle: "Eingaben zum Berechnen",
    emptySub: "Geben Sie den Kaufpreis und die Kaltmiete ein, um die Mietrendite zu sehen.",
    estimateTitle: "Nur eine Schätzung",
    estimateText: "Diese Zahlen sind illustrativ und berücksichtigen keine Einkommensteuer, Abschreibung (AfA) oder Mietsteigerungen. Die tatsächliche Rendite hängt von Ihrer persönlichen Steuersituation ab. Konsultieren Sie einen Steuerberater für steueroptimierte Berechnungen.",
    tabOverview: "Renditeübersicht",
    tabCashflow: "Cashflow",
    yieldComparison: "Renditevergleich",
    yieldComparisonSub: "Wie Ihre Immobilie abschneidet",
    goodYield: "Eine Bruttomietrendite über 5% gilt allgemein als gut für deutsche Wohnimmobilien.",
    benchmarkSavings: "Tagesgeld (~2,5%)",
    benchmarkBonds: "Bundesanleihen (~3%)",
    benchmarkProperty: "Ihre Immobilie",
    benchmarkREIT: "Deutsche REITs (~4–6%)",
    benchmarkStocks: "DAX-Durchschnitt (~7–8%)",
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

const TrendUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
    <rect x="18" y="3" width="4" height="18" /><rect x="10" y="8" width="4" height="13" /><rect x="2" y="13" width="4" height="8" />
  </svg>
);

const WalletIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z" />
    <path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
  </svg>
);

/* ── Main Component ── */
export default function RentalYieldCalculator({ lang = "en" }: { lang?: Lang }) {
  const t = translations[lang];
  const locale = lang === "de" ? "de-DE" : "en-US";
  const fmt = (n: number) => fmtEur(n, locale);

  // Property inputs
  const [priceRaw, setPriceRaw] = useState(lang === "de" ? "350.000" : "350,000");
  const [price, setPrice] = useState(350000);
  const [rentRaw, setRentRaw] = useState(lang === "de" ? "1.200" : "1,200");
  const [rent, setRent] = useState(1200);
  const [closingPct, setClosingPct] = useState(10);

  // Annual costs
  const [hausgeldRaw, setHausgeldRaw] = useState(lang === "de" ? "1.800" : "1,800");
  const [hausgeld, setHausgeld] = useState(1800);
  const [maintenanceRaw, setMaintenanceRaw] = useState("0");
  const [maintenance, setMaintenance] = useState(0);
  const [vacancyPct, setVacancyPct] = useState(3);
  const [taxRaw, setTaxRaw] = useState("600");
  const [propertyTax, setPropertyTax] = useState(600);
  const [insuranceRaw, setInsuranceRaw] = useState("0");
  const [insurance, setInsurance] = useState(0);

  // Financing
  const [loanRaw, setLoanRaw] = useState(lang === "de" ? "280.000" : "280,000");
  const [loan, setLoan] = useState(280000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [repaymentRate, setRepaymentRate] = useState(2.0);

  const [activeTab, setActiveTab] = useState<"overview" | "cashflow">("overview");

  const result = useMemo(() => {
    if (price <= 0 || rent <= 0) return null;

    const annualRent = rent * 12;
    const closingCostsAmt = price * closingPct / 100;
    const totalInvestment = price + closingCostsAmt;
    const vacancyLoss = annualRent * vacancyPct / 100;
    const effectiveRent = annualRent - vacancyLoss;
    const annualCosts = hausgeld + maintenance + propertyTax + insurance;
    const netOperatingIncome = effectiveRent - annualCosts;

    // Gross yield
    const grossYield = (annualRent / price) * 100;

    // Net yield (before financing)
    const netYield = (netOperatingIncome / totalInvestment) * 100;

    // Mortgage
    const monthlyMortgage = loan > 0
      ? loan * (interestRate + repaymentRate) / 100 / 12
      : 0;
    const annualMortgage = monthlyMortgage * 12;

    // Cash flow
    const annualCashFlow = netOperatingIncome - annualMortgage;
    const monthlyCashFlow = annualCashFlow / 12;

    // Equity & cash-on-cash
    const equity = totalInvestment - loan;
    const cashOnCash = equity > 0 ? (annualCashFlow / equity) * 100 : 0;

    return {
      annualRent,
      closingCostsAmt,
      totalInvestment,
      vacancyLoss,
      effectiveRent,
      annualCosts,
      netOperatingIncome,
      grossYield,
      netYield,
      monthlyMortgage,
      annualMortgage,
      annualCashFlow,
      monthlyCashFlow,
      equity,
      cashOnCash,
    };
  }, [price, rent, closingPct, hausgeld, maintenance, vacancyPct, propertyTax, insurance, loan, interestRate, repaymentRate]);

  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current && result) {
      track("calculator_used", {
        calculator: "rental_yield",
        purchase_price: price,
        monthly_rent: rent,
        gross_yield: result.grossYield,
        net_yield: result.netYield,
        cash_on_cash: result.cashOnCash,
        lang,
      });
    }
    tracked.current = true;
  }, [price, rent, closingPct, hausgeld, maintenance, vacancyPct, propertyTax, insurance, loan, interestRate, repaymentRate]);

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

  function yieldColor(val: number): string {
    if (val >= 5) return "text-emerald-600";
    if (val >= 3) return "text-amber-600";
    return "text-red-500";
  }

  function yieldBg(val: number): string {
    if (val >= 5) return "bg-emerald-50 border-emerald-200";
    if (val >= 3) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  }

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

              {/* Monthly rent */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.monthlyRent}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + " pl-7"}
                    value={rentRaw}
                    onChange={(e) => handleNumberInput(e.target.value, setRent, setRentRaw, 100000)}
                    onBlur={() => formatOnBlur(rent, setRentRaw)}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{t.monthlyRentHint}</p>
              </div>

              {/* Closing costs */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{t.closingCosts}</span>
                  <span className="font-mono text-brand-500">{fmtPct(closingPct)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={closingPct}
                  onChange={(e) => setClosingPct(parseFloat(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">{t.closingCostsHint}</p>
                  <a href={t.closingCostsLink} className="shrink-0 text-[11px] font-medium text-brand-500 hover:underline">
                    {t.closingCostsLinkText}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Annual costs */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <BarChartIcon />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.annualCostsTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.annualCostsSub}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Hausgeld */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.hausgeld}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-300">{t.perYear}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + " pl-7 pr-12"}
                    value={hausgeldRaw}
                    onChange={(e) => handleNumberInput(e.target.value, setHausgeld, setHausgeldRaw, 100000)}
                    onBlur={() => formatOnBlur(hausgeld, setHausgeldRaw)}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{t.hausgeldHint}</p>
              </div>

              {/* Maintenance */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.maintenance}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-300">{t.perYear}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + " pl-7 pr-12"}
                    value={maintenanceRaw}
                    onChange={(e) => handleNumberInput(e.target.value, setMaintenance, setMaintenanceRaw, 100000)}
                    onBlur={() => formatOnBlur(maintenance, setMaintenanceRaw)}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{t.maintenanceHint}</p>
              </div>

              {/* Vacancy */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{t.vacancy}</span>
                  <span className="font-mono text-amber-500">{fmtPct(vacancyPct)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={vacancyPct}
                  onChange={(e) => setVacancyPct(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <p className="mt-1 text-[11px] text-gray-400">{t.vacancyHint}</p>
              </div>

              {/* Property tax */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.propertyTax}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-300">{t.perYear}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + " pl-7 pr-12"}
                    value={taxRaw}
                    onChange={(e) => handleNumberInput(e.target.value, setPropertyTax, setTaxRaw, 100000)}
                    onBlur={() => formatOnBlur(propertyTax, setTaxRaw)}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{t.propertyTaxHint}</p>
              </div>

              {/* Insurance */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.insurance}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-300">{t.perYear}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + " pl-7 pr-12"}
                    value={insuranceRaw}
                    onChange={(e) => handleNumberInput(e.target.value, setInsurance, setInsuranceRaw, 100000)}
                    onBlur={() => formatOnBlur(insurance, setInsuranceRaw)}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{t.insuranceHint}</p>
              </div>
            </div>
          </div>

          {/* Financing */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <WalletIcon />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t.financingTitle}</h2>
                <p className="text-[11px] text-gray-400">{t.financingSub}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Loan amount */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t.loanAmount}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls + " pl-7"}
                    value={loanRaw}
                    onChange={(e) => handleNumberInput(e.target.value, setLoan, setLoanRaw)}
                    onBlur={() => formatOnBlur(loan, setLoanRaw)}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">{t.loanAmountHint}</p>
              </div>

              {/* Interest rate */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{t.interestRate}</span>
                  <span className="font-mono text-purple-600">{fmtPct(interestRate)}</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Repayment rate */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{t.repaymentRate}</span>
                  <span className="font-mono text-purple-600">{fmtPct(repaymentRate)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={repaymentRate}
                  onChange={(e) => setRepaymentRate(parseFloat(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
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
              {/* Yield cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`rounded-xl border p-4 ${yieldBg(result.grossYield)}`}>
                  <p className="text-[11px] font-medium text-gray-500">{t.grossYield}</p>
                  <p className={`mt-1 font-display text-2xl font-bold tracking-tight ${yieldColor(result.grossYield)}`}>
                    {fmtPct(result.grossYield)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{t.grossYieldDesc}</p>
                </div>
                <div className={`rounded-xl border p-4 ${yieldBg(result.netYield)}`}>
                  <p className="text-[11px] font-medium text-gray-500">{t.netYield}</p>
                  <p className={`mt-1 font-display text-2xl font-bold tracking-tight ${yieldColor(result.netYield)}`}>
                    {fmtPct(result.netYield)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{t.netYieldDesc}</p>
                </div>
                <div className={`rounded-xl border p-4 ${loan > 0 ? yieldBg(result.cashOnCash) : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-[11px] font-medium text-gray-500">{t.cashOnCash}</p>
                  <p className={`mt-1 font-display text-2xl font-bold tracking-tight ${loan > 0 ? yieldColor(result.cashOnCash) : "text-gray-300"}`}>
                    {loan > 0 ? fmtPct(result.cashOnCash) : "—"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{t.cashOnCashDesc}</p>
                </div>
              </div>

              {/* Monthly summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-medium text-gray-400">{t.monthlyPayment}</p>
                  <p className="mt-1 font-display text-xl font-bold tracking-tight text-gray-900">
                    {loan > 0 ? fmt(result.monthlyMortgage) : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-medium text-gray-400">{t.monthlyCashFlow}</p>
                  <p className={`mt-1 font-display text-xl font-bold tracking-tight ${result.monthlyCashFlow >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {fmt(result.monthlyCashFlow)}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 px-4 py-3 text-xs font-semibold transition ${activeTab === "overview" ? "border-b-2 border-brand-500 text-brand-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {t.tabOverview}
                  </button>
                  <button
                    onClick={() => setActiveTab("cashflow")}
                    className={`flex-1 px-4 py-3 text-xs font-semibold transition ${activeTab === "cashflow" ? "border-b-2 border-brand-500 text-brand-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {t.tabCashflow}
                  </button>
                </div>

                <div className="p-5">
                  {activeTab === "overview" ? (
                    <div className="space-y-5">
                      {/* Investment summary */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.totalInvestment}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.purchasePriceLabel}</span>
                            <span className="font-medium text-gray-900">{fmt(price)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.closingCostsLabel} ({fmtPct(closingPct)})</span>
                            <span className="font-medium text-gray-900">{fmt(result.closingCostsAmt)}</span>
                          </div>
                          <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-semibold">
                            <span className="text-gray-900">{t.totalInvestment}</span>
                            <span className="text-gray-900">{fmt(result.totalInvestment)}</span>
                          </div>
                          {loan > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">{t.equityInvested}</span>
                              <span className="font-medium text-brand-600">{fmt(result.equity)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Yield comparison bars */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.yieldComparison}</h3>
                        <div className="space-y-2.5">
                          {[
                            { label: t.benchmarkSavings, val: 2.5, color: "bg-gray-300" },
                            { label: t.benchmarkBonds, val: 3.0, color: "bg-gray-400" },
                            { label: t.benchmarkProperty, val: result.grossYield, color: "bg-brand-500" },
                            { label: t.benchmarkREIT, val: 5.0, color: "bg-purple-400" },
                            { label: t.benchmarkStocks, val: 7.5, color: "bg-emerald-400" },
                          ].map((b) => (
                            <div key={b.label}>
                              <div className="mb-1 flex items-center justify-between text-[11px]">
                                <span className={b.label === t.benchmarkProperty ? "font-semibold text-brand-600" : "text-gray-500"}>{b.label}</span>
                                <span className={b.label === t.benchmarkProperty ? "font-semibold text-brand-600" : "font-medium text-gray-600"}>{fmtPct(b.val)}</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full ${b.color} transition-all duration-500`}
                                  style={{ width: `${Math.min((b.val / 10) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-[11px] text-gray-400">{t.goodYield}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Cash flow waterfall */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.annualView}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.rentIncome}</span>
                            <span className="font-medium text-emerald-600">+{fmt(result.annualRent)}</span>
                          </div>
                          {result.vacancyLoss > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">{t.vacancy} ({fmtPct(vacancyPct)})</span>
                              <span className="font-medium text-red-500">-{fmt(result.vacancyLoss)}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.nonRecoverableCosts}</span>
                            <span className="font-medium text-red-500">-{fmt(result.annualCosts)}</span>
                          </div>
                          <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-semibold">
                            <span className="text-gray-700">{t.netOperatingIncome}</span>
                            <span className={result.netOperatingIncome >= 0 ? "text-emerald-600" : "text-red-500"}>
                              {fmt(result.netOperatingIncome)}
                            </span>
                          </div>
                          {loan > 0 && (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{t.debtService}</span>
                                <span className="font-medium text-red-500">-{fmt(result.annualMortgage)}</span>
                              </div>
                              <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-semibold">
                                <span className="text-gray-900">{t.cashFlowLabel}</span>
                                <span className={result.annualCashFlow >= 0 ? "text-emerald-600" : "text-red-500"}>
                                  {fmt(result.annualCashFlow)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Monthly breakdown */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.monthlyView}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.rentIncome}</span>
                            <span className="font-medium text-emerald-600">+{fmt(rent)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{t.nonRecoverableCosts}</span>
                            <span className="font-medium text-red-500">-{fmt((result.annualCosts + result.vacancyLoss) / 12)}</span>
                          </div>
                          {loan > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">{t.debtService}</span>
                              <span className="font-medium text-red-500">-{fmt(result.monthlyMortgage)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-semibold">
                            <span className="text-gray-900">{t.cashFlowLabel}</span>
                            <span className={result.monthlyCashFlow >= 0 ? "text-emerald-600" : "text-red-500"}>
                              {fmt(result.monthlyCashFlow)}{t.perMonth}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Visual waterfall bar */}
                      <div>
                        <div className="flex h-8 w-full overflow-hidden rounded-lg">
                          {result.netOperatingIncome > 0 && result.annualRent > 0 && (
                            <>
                              {loan > 0 && result.annualMortgage > 0 && (
                                <div
                                  className="bg-purple-400"
                                  style={{ width: `${(result.annualMortgage / result.annualRent) * 100}%` }}
                                  title={t.debtService}
                                />
                              )}
                              <div
                                className="bg-amber-400"
                                style={{ width: `${((result.annualCosts + result.vacancyLoss) / result.annualRent) * 100}%` }}
                                title={t.nonRecoverableCosts}
                              />
                              <div
                                className={result.annualCashFlow >= 0 ? "bg-emerald-400" : "bg-red-400"}
                                style={{ width: `${Math.max((Math.abs(result.annualCashFlow) / result.annualRent) * 100, 2)}%` }}
                                title={t.cashFlowLabel}
                              />
                            </>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
                          {loan > 0 && <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-purple-400" />{t.debtService}</span>}
                          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-amber-400" />{t.nonRecoverableCosts}</span>
                          <span className="flex items-center gap-1"><span className={`inline-block h-2 w-2 rounded-sm ${result.annualCashFlow >= 0 ? "bg-emerald-400" : "bg-red-400"}`} />{t.cashFlowLabel}</span>
                        </div>
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
