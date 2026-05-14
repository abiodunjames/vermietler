import React, { useState, useMemo } from "react";
import NumberInput from "./NumberInput";

type Lang = "en" | "de";

const translations = {
  en: {
    eyebrow: "Tools & Calculators",
    title: "Rental Property Investment Calculator",
    subtitle: "The complete buy-decision calculator. See yield, monthly cashflow, tax effect, and 10-year wealth projection on one screen.",
    propertyTitle: "Property & assumptions",
    propertySub: "Living area, depreciation, growth assumptions",
    livingArea: "Living area",
    livingAreaUnit: "m²",
    afaRate: "AfA rate",
    afaHint: "2% standard (pre-2023), 3% buildings completed 2023+, up to 8% with Sonder-AfA",
    buildingShare: "Building share of price",
    buildingShareHint: "Building portion eligible for AfA (rest is land). Typical: 70-85%.",
    taxRate: "Marginal tax rate",
    taxHint: "Your Grenzsteuersatz incl. Soli/Kirchensteuer (typically 30-45%).",
    growthRate: "Annual growth",
    growthHint: "Applied to rent, costs, and property value over the projection period.",

    investmentTitle: "Investment",
    investmentSub: "Purchase price and closing costs",
    purchasePrice: "Purchase price",
    closingCostPct: "Closing costs",
    closingCostHint: "% of purchase price (Grunderwerbsteuer, notary, registry, agent).",
    renovations: "Initial renovations",
    renovationsHint: "One-time costs (kitchen, bath, paint). Treated as part of investment.",

    rentTitle: "Rental income",
    rentSub: "Monthly Kaltmiete and Hausgeld",
    kaltmieteRate: "Kaltmiete per m²",
    rentUnit: "€/m²",
    hausgeldAllocable: "Hausgeld (allocable)",
    hausgeldHint: "Operating costs you can pass on to the tenant.",

    costsTitle: "Operating costs (non-allocable)",
    costsSub: "Monthly costs you cannot pass to tenant",
    wegManagement: "WEG management",
    wegReserve: "WEG maintenance reserve",
    rentalManagement: "Rental management",
    ownReserve: "Own maintenance reserve",
    otherCosts: "Other",

    financingTitle: "Financing",
    financingSub: "Loan terms",
    loanAmount: "Loan amount",
    loanAmountHint: "Total mortgage. Equity = purchase + closing + renovations - loan.",
    interestRate: "Interest rate",
    tilgung: "Initial Tilgung",
    tilgungHint: "Annual repayment rate (1-5% typical).",

    resultsTitle: "Year 1 results",
    kpiTitle: "Key metrics",
    pricePerSqm: "Price per m²",
    grossYield: "Gross yield",
    netYield: "Net yield",
    faktor: "Faktor",
    faktorHint: "Years of rent to break even (purchase ÷ annual rent)",
    eqYield: "Return on equity",
    eqYieldHint: "After-tax cashflow ÷ equity invested",

    cashflowTitle: "Monthly cashflow",
    warmmiete: "Warmmiete",
    operatingCosts: "Operating costs",
    interest: "Interest",
    principal: "Principal (Tilgung)",
    cashflowOperative: "Operating cashflow",
    taxes: "Tax effect",
    cashflowAfterTax: "Cashflow after tax",

    taxBreakdown: "Tax breakdown (monthly)",
    taxIncome: "Taxable warmmiete",
    taxHausgeldMgmt: "Hausgeld + management",
    taxInterest: "Interest",
    taxAfa: "AfA (depreciation)",
    taxableCashflow: "Taxable cashflow",
    taxAmount: "Tax",

    projectionTitle: "Year 10 projection",
    projectionSub: "Assuming uniform growth rate",
    propertyValue: "Property value",
    remainingDebt: "Remaining debt",
    netWealth: "Net wealth",
    projectedMonthlyCF: "Monthly cashflow (Year 10)",

    equityInvested: "Equity invested",
    totalInvestment: "Total investment",
    annualRent: "Annual Kaltmiete",
    monthlyAnnuity: "Monthly annuity",

    emptyTitle: "Enter details to calculate",
    emptySub: "Fill in price, rent, and loan terms to see results.",

    disclaimerTitle: "Important notice",
    disclaimerText: "This calculator provides illustrative projections only. Actual results depend on rent fluctuations, vacancy, unexpected repairs, interest rate changes at Zinsbindung end, and tax law changes. For binding investment decisions, consult a Steuerberater and Finanzberater.",
  },
  de: {
    eyebrow: "Tools & Rechner",
    title: "Renditeobjekt-Rechner",
    subtitle: "Der vollständige Kaufentscheidungs-Rechner. Rendite, monatlicher Cashflow, Steuereffekt und 10-Jahres-Vermögensprognose auf einem Bildschirm.",
    propertyTitle: "Immobilie & Annahmen",
    propertySub: "Wohnfläche, Abschreibung, Wachstumsannahmen",
    livingArea: "Wohnfläche",
    livingAreaUnit: "m²",
    afaRate: "AfA-Satz",
    afaHint: "2 % Standard (vor 2023), 3 % Gebäude ab 2023, bis zu 8 % mit Sonder-AfA",
    buildingShare: "Anteil Gebäude am Kaufpreis",
    buildingShareHint: "AfA-fähiger Gebäudeanteil (Rest ist Grund). Typisch: 70-85 %.",
    taxRate: "Grenzsteuersatz",
    taxHint: "Inkl. Soli/Kirchensteuer (typisch 30-45 %).",
    growthRate: "Jährliches Wachstum",
    growthHint: "Wird auf Miete, Kosten und Immobilienwert angewendet.",

    investmentTitle: "Investition",
    investmentSub: "Kaufpreis und Nebenkosten",
    purchasePrice: "Kaufpreis",
    closingCostPct: "Kaufnebenkosten",
    closingCostHint: "% des Kaufpreises (Grunderwerbsteuer, Notar, Grundbuch, Makler).",
    renovations: "Anfängliche Renovierung",
    renovationsHint: "Einmalige Kosten (Küche, Bad, Streichen). Teil der Investition.",

    rentTitle: "Mieteinnahmen",
    rentSub: "Monatliche Kaltmiete und Hausgeld",
    kaltmieteRate: "Kaltmiete pro m²",
    rentUnit: "€/m²",
    hausgeldAllocable: "Hausgeld (umlagefähig)",
    hausgeldHint: "Betriebskosten, die auf Mieter umlegbar sind.",

    costsTitle: "Bewirtschaftungskosten (nicht umlagefähig)",
    costsSub: "Monatlich, nicht auf Mieter umlegbar",
    wegManagement: "WEG-Verwaltung",
    wegReserve: "WEG-Instandhaltungsrücklage",
    rentalManagement: "Mietverwaltung",
    ownReserve: "Eigene Instandhaltungsrücklage",
    otherCosts: "Sonstige",

    financingTitle: "Finanzierung",
    financingSub: "Darlehenskonditionen",
    loanAmount: "Darlehenssumme",
    loanAmountHint: "Hypothek. Eigenkapital = Kaufpreis + Nebenkosten + Renovierung − Darlehen.",
    interestRate: "Zinssatz",
    tilgung: "Anfängliche Tilgung",
    tilgungHint: "Jährliche Tilgungsrate (1-5 % typisch).",

    resultsTitle: "Ergebnisse Jahr 1",
    kpiTitle: "Kennzahlen",
    pricePerSqm: "Kaufpreis pro m²",
    grossYield: "Bruttomietrendite",
    netYield: "Nettomietrendite",
    faktor: "Faktor",
    faktorHint: "Jahre Miete bis Break-even (Kaufpreis ÷ Jahreskaltmiete)",
    eqYield: "Eigenkapitalrendite",
    eqYieldHint: "Cashflow nach Steuern ÷ eingesetztes Eigenkapital",

    cashflowTitle: "Monatlicher Cashflow",
    warmmiete: "Warmmiete",
    operatingCosts: "Bewirtschaftungskosten",
    interest: "Zinsen",
    principal: "Tilgung",
    cashflowOperative: "Cashflow operativ",
    taxes: "Steuereffekt",
    cashflowAfterTax: "Cashflow nach Steuern",

    taxBreakdown: "Steuerberechnung (monatlich)",
    taxIncome: "Steuerpflichtige Warmmiete",
    taxHausgeldMgmt: "Hausgeld + Verwaltung",
    taxInterest: "Zinsen",
    taxAfa: "AfA",
    taxableCashflow: "zu versteuernder Cashflow",
    taxAmount: "Steuer",

    projectionTitle: "Prognose Jahr 10",
    projectionSub: "Bei gleichbleibender Wachstumsrate",
    propertyValue: "Wert der Immobilie",
    remainingDebt: "Restschuld",
    netWealth: "Netto-Vermögen",
    projectedMonthlyCF: "Monatlicher Cashflow (Jahr 10)",

    equityInvested: "Eingesetztes Eigenkapital",
    totalInvestment: "Gesamtinvestition",
    annualRent: "Jahreskaltmiete",
    monthlyAnnuity: "Monatliche Annuität",

    emptyTitle: "Eingaben zum Berechnen",
    emptySub: "Geben Sie Kaufpreis, Miete und Darlehen ein, um Ergebnisse zu sehen.",

    disclaimerTitle: "Wichtiger Hinweis",
    disclaimerText: "Dieser Rechner liefert nur illustrative Prognosen. Tatsächliche Ergebnisse hängen ab von Mietschwankungen, Leerstand, unerwarteten Reparaturen, Zinsänderungen nach Zinsbindung und Steueränderungen. Für verbindliche Investitionsentscheidungen konsultieren Sie einen Steuerberater und Finanzberater.",
  },
};

function fmtEur(n: number, locale: string): string {
  const sign = n < 0 ? "-" : "";
  return sign + "€" + Math.abs(Math.round(n)).toLocaleString(locale === "de-DE" ? "de-DE" : "en-US");
}

function fmtPct(n: number): string {
  return n.toFixed(2) + "%";
}

function fmtNum(n: number, digits = 1): string {
  return n.toFixed(digits);
}

const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CoinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v12" /><path d="M9 9h6" /><path d="M9 15h6" />
  </svg>
);

const BarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const BankIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="9" /><path d="M3 11 L12 4 L21 11" /><line x1="9" y1="14" x2="9" y2="20" /><line x1="15" y1="14" x2="15" y2="20" />
  </svg>
);

const TrendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" /><path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0-3-3L9 12v3" />
  </svg>
);

const WarningIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function InvestmentCalculator({ lang = "en" }: { lang?: Lang }) {
  const t = translations[lang];
  const locale = lang === "de" ? "de-DE" : "en-US";

  // ── Property assumptions ──
  const [livingArea, setLivingArea] = useState(70);
  const [afaRate, setAfaRate] = useState(2);
  const [buildingShare, setBuildingShare] = useState(80);
  const [taxRate, setTaxRate] = useState(42);
  const [growthRate, setGrowthRate] = useState(2);

  // ── Investment ──
  const [purchasePriceRaw, setPurchasePriceRaw] = useState(lang === "de" ? "300.000" : "300,000");
  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [closingCostPct, setClosingCostPct] = useState(11);
  const [renovationsRaw, setRenovationsRaw] = useState("0");
  const [renovations, setRenovations] = useState(0);

  // ── Rent ──
  const [kaltmieteRate, setKaltmieteRate] = useState(12);
  const [hausgeldAllocable, setHausgeldAllocable] = useState(105);

  // ── Operating costs (non-allocable, monthly) ──
  const [wegManagement, setWegManagement] = useState(30);
  const [wegReserve, setWegReserve] = useState(7);
  const [rentalManagement, setRentalManagement] = useState(40);
  const [ownReserve, setOwnReserve] = useState(30);
  const [otherCosts, setOtherCosts] = useState(0);

  // ── Financing ──
  const [loanAmountRaw, setLoanAmountRaw] = useState(lang === "de" ? "240.000" : "240,000");
  const [loanAmount, setLoanAmount] = useState(240000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [tilgung, setTilgung] = useState(2);

  // ── Handlers ──
  function handlePriceChange(raw: string, setter: (s: string) => void, setVal: (n: number) => void, max = 50000000) {
    setter(raw);
    const v = parseInt(raw.replace(/\D/g, ""), 10);
    if (!isNaN(v) && v >= 0) setVal(Math.min(v, max));
    else setVal(0);
  }
  function handlePriceBlur(price: number, setRaw: (s: string) => void) {
    if (price > 0) setRaw(price.toLocaleString(locale));
  }

  const hasResults = purchasePrice > 0 && kaltmieteRate > 0 && livingArea > 0;

  const result = useMemo(() => {
    if (!hasResults) return null;

    // Investment totals
    const closingCosts = purchasePrice * (closingCostPct / 100);
    const totalInvestment = purchasePrice + closingCosts + renovations;
    const equity = Math.max(0, totalInvestment - loanAmount);

    // Rent
    const monthlyKaltmiete = kaltmieteRate * livingArea;
    const annualKaltmiete = monthlyKaltmiete * 12;
    const monthlyWarmmiete = monthlyKaltmiete + hausgeldAllocable;

    // Operating costs (non-allocable, monthly)
    const opCostsMonthly =
      hausgeldAllocable + wegManagement + wegReserve + rentalManagement + ownReserve + otherCosts;
    const opCostsAnnual = opCostsMonthly * 12;

    // For yield calc: net yield uses non-allocable portion (everything except umlagefähig)
    const nonAllocableMonthly = wegManagement + wegReserve + rentalManagement + ownReserve + otherCosts;
    const nonAllocableAnnual = nonAllocableMonthly * 12;

    // Financing (Annuitätendarlehen)
    const annualAnnuity = loanAmount * (interestRate / 100 + tilgung / 100);
    const monthlyAnnuity = annualAnnuity / 12;
    const monthlyInterestY1 = (loanAmount * interestRate) / 100 / 12;
    const monthlyPrincipalY1 = monthlyAnnuity - monthlyInterestY1;

    // AfA
    const afaBasis = (purchasePrice + closingCosts + renovations) * (buildingShare / 100);
    const afaAnnual = afaBasis * (afaRate / 100);
    const afaMonthly = afaAnnual / 12;

    // Tax calculation (monthly)
    const taxableMonthly =
      monthlyWarmmiete - (hausgeldAllocable + rentalManagement) - monthlyInterestY1 - afaMonthly;
    const taxMonthly = taxableMonthly * (taxRate / 100); // negative taxable → refund

    // Cashflow
    const cfOperative = monthlyWarmmiete - opCostsMonthly - monthlyInterestY1 - monthlyPrincipalY1;
    const cfAfterTax = cfOperative - taxMonthly;

    // KPIs
    const pricePerSqm = purchasePrice / livingArea;
    const grossYield = (annualKaltmiete / purchasePrice) * 100;
    const faktor = purchasePrice / annualKaltmiete;
    const netYield = ((annualKaltmiete - nonAllocableAnnual) / totalInvestment) * 100;
    const eqYieldPa = equity > 0 ? ((cfAfterTax * 12) / equity) * 100 : 0;

    // ── Year 10 projection ──
    const g = growthRate / 100;
    const years = 10;
    const months = years * 12;
    const monthlyR = interestRate / 100 / 12;

    // Closed-form remaining balance after `months`
    const pow = Math.pow(1 + monthlyR, months);
    const remainingDebt = Math.max(0, loanAmount * pow - monthlyAnnuity * ((pow - 1) / monthlyR));

    const propertyValueY10 = purchasePrice * Math.pow(1 + g, years);
    const netWealth = propertyValueY10 - remainingDebt;

    // Year 10 monthly cashflow (rent and costs compounded)
    const factor = Math.pow(1 + g, years);
    const warmmietteY10 = monthlyWarmmiete * factor;
    const opCostsY10 = opCostsMonthly * factor;
    const monthlyInterestY10 = (remainingDebt * interestRate) / 100 / 12;
    const monthlyPrincipalY10 = monthlyAnnuity - monthlyInterestY10;
    const afaMonthlyY10 = afaMonthly; // AfA stays constant
    const taxableY10 =
      warmmietteY10 - (hausgeldAllocable + rentalManagement) * factor - monthlyInterestY10 - afaMonthlyY10;
    const taxY10 = taxableY10 * (taxRate / 100);
    const cfOperativeY10 = warmmietteY10 - opCostsY10 - monthlyInterestY10 - monthlyPrincipalY10;
    const cfAfterTaxY10 = cfOperativeY10 - taxY10;

    return {
      closingCosts,
      totalInvestment,
      equity,
      monthlyKaltmiete,
      annualKaltmiete,
      monthlyWarmmiete,
      opCostsMonthly,
      nonAllocableMonthly,
      monthlyAnnuity,
      monthlyInterestY1,
      monthlyPrincipalY1,
      afaMonthly,
      taxableMonthly,
      taxMonthly,
      cfOperative,
      cfAfterTax,
      pricePerSqm,
      grossYield,
      faktor,
      netYield,
      eqYieldPa,
      remainingDebt,
      propertyValueY10,
      netWealth,
      warmmietteY10,
      opCostsY10,
      monthlyInterestY10,
      monthlyPrincipalY10,
      cfOperativeY10,
      taxY10,
      cfAfterTaxY10,
    };
  }, [
    purchasePrice, closingCostPct, renovations, livingArea, afaRate, buildingShare, taxRate, growthRate,
    kaltmieteRate, hausgeldAllocable, wegManagement, wegReserve, rentalManagement, ownReserve, otherCosts,
    loanAmount, interestRate, tilgung, hasResults,
  ]);

  const fmt = (n: number) => fmtEur(n, locale);
  const inputCls =
    "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";

  const Label = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
    <div>
      <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{children}</label>
      {hint && <p className="mb-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1160px]">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-brand-500">{t.eyebrow}</p>
        <h1 className="mb-2 font-display text-[30px] leading-[1.15] font-bold tracking-tight" style={{ color: "#253553" }}>
          {t.title}
        </h1>
        <p className="max-w-[680px] text-[15px] text-gray-500">{t.subtitle}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[460px_1fr]">
        {/* ── INPUTS (left column) ── */}
        <div className="flex flex-col gap-4">
          {/* Property */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <HouseIcon />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.propertyTitle}</div>
                <div className="text-[13px] text-gray-400">{t.propertySub}</div>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <Label>{t.livingArea}</Label>
              <NumberInput className={inputCls} value={livingArea} onChange={setLivingArea} min={0} max={2000} suffix="m²" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label hint={t.afaHint}>{t.afaRate}</Label>
                  <NumberInput className={inputCls} value={afaRate} onChange={setAfaRate} min={0} max={10} suffix="%" />
                </div>
                <div>
                  <Label hint={t.buildingShareHint}>{t.buildingShare}</Label>
                  <NumberInput className={inputCls} value={buildingShare} onChange={setBuildingShare} min={0} max={100} suffix="%" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label hint={t.taxHint}>{t.taxRate}</Label>
                  <NumberInput className={inputCls} value={taxRate} onChange={setTaxRate} min={0} max={50} suffix="%" />
                </div>
                <div>
                  <Label hint={t.growthHint}>{t.growthRate}</Label>
                  <NumberInput className={inputCls} value={growthRate} onChange={setGrowthRate} min={0} max={10} suffix="%" />
                </div>
              </div>
            </div>
          </div>

          {/* Investment */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <CoinIcon />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.investmentTitle}</div>
                <div className="text-[13px] text-gray-400">{t.investmentSub}</div>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-gray-700">{t.purchasePrice}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={purchasePriceRaw}
                    onChange={(e) => handlePriceChange(e.target.value, setPurchasePriceRaw, setPurchasePrice)}
                    onBlur={() => handlePriceBlur(purchasePrice, setPurchasePriceRaw)}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div>
                <Label hint={t.closingCostHint}>{t.closingCostPct}</Label>
                <NumberInput className={inputCls} value={closingCostPct} onChange={setClosingCostPct} min={0} max={20} suffix="%" />
              </div>
              <div>
                <Label hint={t.renovationsHint}>{t.renovations}</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={renovationsRaw}
                    onChange={(e) => handlePriceChange(e.target.value, setRenovationsRaw, setRenovations, 500000)}
                    onBlur={() => {
                      if (renovations > 0) setRenovationsRaw(renovations.toLocaleString(locale));
                    }}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rent */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <BarIcon />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.rentTitle}</div>
                <div className="text-[13px] text-gray-400">{t.rentSub}</div>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <Label>{t.kaltmieteRate}</Label>
                <NumberInput className={inputCls} value={kaltmieteRate} onChange={setKaltmieteRate} min={0} max={50} suffix="€/m²" />
              </div>
              <div>
                <Label hint={t.hausgeldHint}>{t.hausgeldAllocable}</Label>
                <NumberInput className={inputCls} value={hausgeldAllocable} onChange={setHausgeldAllocable} min={0} max={2000} suffix="€/m" />
              </div>
            </div>
          </div>

          {/* Operating costs */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <CoinIcon />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.costsTitle}</div>
                <div className="text-[13px] text-gray-400">{t.costsSub}</div>
              </div>
            </div>
            <div className="space-y-3 p-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.wegManagement}</Label>
                  <NumberInput className={inputCls} value={wegManagement} onChange={setWegManagement} min={0} max={500} suffix="€" />
                </div>
                <div>
                  <Label>{t.wegReserve}</Label>
                  <NumberInput className={inputCls} value={wegReserve} onChange={setWegReserve} min={0} max={500} suffix="€" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.rentalManagement}</Label>
                  <NumberInput className={inputCls} value={rentalManagement} onChange={setRentalManagement} min={0} max={500} suffix="€" />
                </div>
                <div>
                  <Label>{t.ownReserve}</Label>
                  <NumberInput className={inputCls} value={ownReserve} onChange={setOwnReserve} min={0} max={500} suffix="€" />
                </div>
              </div>
              <div>
                <Label>{t.otherCosts}</Label>
                <NumberInput className={inputCls} value={otherCosts} onChange={setOtherCosts} min={0} max={1000} suffix="€" />
              </div>
            </div>
          </div>

          {/* Financing */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                <BankIcon />
              </div>
              <div>
                <div className="font-display text-[15px] font-semibold text-gray-900">{t.financingTitle}</div>
                <div className="text-[13px] text-gray-400">{t.financingSub}</div>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <Label hint={t.loanAmountHint}>{t.loanAmount}</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={loanAmountRaw}
                    onChange={(e) => handlePriceChange(e.target.value, setLoanAmountRaw, setLoanAmount)}
                    onBlur={() => handlePriceBlur(loanAmount, setLoanAmountRaw)}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.interestRate}</Label>
                  <NumberInput className={inputCls} value={interestRate} onChange={setInterestRate} min={0} max={15} suffix="%" />
                </div>
                <div>
                  <Label hint={t.tilgungHint}>{t.tilgung}</Label>
                  <NumberInput className={inputCls} value={tilgung} onChange={setTilgung} min={0.5} max={10} suffix="%" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RESULTS (right column) ── */}
        <div className="flex flex-col gap-4">
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
              {/* Hero: KPIs */}
              <div className="relative overflow-hidden rounded-xl p-6 shadow-lg" style={{ background: "linear-gradient(135deg,#253553 0%,#1e3a8a 100%)" }}>
                <div className="absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full" style={{ background: "rgba(96,165,250,0.08)" }} />
                <p className="relative mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-brand-300">{t.kpiTitle}</p>
                <div className="relative grid grid-cols-2 gap-x-6 gap-y-4 mt-3 sm:grid-cols-3">
                  <div>
                    <p className="mb-0.5 text-[11px] text-white/45 uppercase tracking-wider">{t.grossYield}</p>
                    <p className="font-display text-[22px] font-bold text-white">{fmtPct(result.grossYield)}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] text-white/45 uppercase tracking-wider">{t.netYield}</p>
                    <p className="font-display text-[22px] font-bold text-white">{fmtPct(result.netYield)}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] text-white/45 uppercase tracking-wider">{t.faktor}</p>
                    <p className="font-display text-[22px] font-bold text-white">{fmtNum(result.faktor)}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] text-white/45 uppercase tracking-wider">{t.pricePerSqm}</p>
                    <p className="font-display text-[22px] font-bold text-white">{fmt(result.pricePerSqm)}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] text-white/45 uppercase tracking-wider">{t.equityInvested}</p>
                    <p className="font-display text-[22px] font-bold text-white">{fmt(result.equity)}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] text-white/45 uppercase tracking-wider">{t.eqYield}</p>
                    <p className={`font-display text-[22px] font-bold ${result.eqYieldPa >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                      {fmtPct(result.eqYieldPa)}
                    </p>
                  </div>
                </div>
                <div className="relative mt-5 grid grid-cols-2 gap-6 border-t border-white/10 pt-4 text-[12px] text-white/55">
                  <div>{t.totalInvestment}: <span className="font-mono text-white/85">{fmt(result.totalInvestment)}</span></div>
                  <div>{t.monthlyAnnuity}: <span className="font-mono text-white/85">{fmt(result.monthlyAnnuity)}</span></div>
                </div>
              </div>

              {/* Year 1 cashflow */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                    <BarIcon />
                    {t.cashflowTitle}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-medium ${result.cfAfterTax >= 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                    {fmt(result.cfAfterTax)}/m
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  <Row label={t.warmmiete} value={fmt(result.monthlyWarmmiete)} positive />
                  <Row label={t.operatingCosts} value={"-" + fmt(result.opCostsMonthly)} />
                  <Row label={t.interest} value={"-" + fmt(result.monthlyInterestY1)} />
                  <Row label={t.principal} value={"-" + fmt(result.monthlyPrincipalY1)} />
                  <RowTotal label={t.cashflowOperative} value={fmt(result.cfOperative)} sign={result.cfOperative} />
                  <Row label={t.taxes} value={(result.taxMonthly < 0 ? "+" : "-") + fmt(Math.abs(result.taxMonthly))} positive={result.taxMonthly < 0} />
                  <RowTotal label={t.cashflowAfterTax} value={fmt(result.cfAfterTax)} sign={result.cfAfterTax} bold />
                </div>
              </div>

              {/* Tax breakdown */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                    <CoinIcon />
                    {t.taxBreakdown}
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  <Row label={t.taxIncome} value={fmt(result.monthlyWarmmiete)} positive />
                  <Row label={t.taxHausgeldMgmt} value={"-" + fmt(hausgeldAllocable + rentalManagement)} />
                  <Row label={t.taxInterest} value={"-" + fmt(result.monthlyInterestY1)} />
                  <Row label={t.taxAfa} value={"-" + fmt(result.afaMonthly)} />
                  <RowTotal label={t.taxableCashflow} value={fmt(result.taxableMonthly)} sign={result.taxableMonthly} />
                  <Row label={`${t.taxAmount} (${taxRate}%)`} value={(result.taxMonthly < 0 ? "+" : "-") + fmt(Math.abs(result.taxMonthly))} positive={result.taxMonthly < 0} />
                </div>
              </div>

              {/* Year 10 projection */}
              <div className="overflow-hidden rounded-xl border border-brand-200 bg-brand-25 shadow-sm">
                <div className="border-b border-brand-100 bg-white px-5 py-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                    <TrendIcon />
                    {t.projectionTitle}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{t.projectionSub}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 p-5">
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{t.propertyValue}</p>
                    <p className="font-display text-xl font-bold text-gray-900">{fmt(result.propertyValueY10)}</p>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{t.remainingDebt}</p>
                    <p className="font-display text-xl font-bold text-gray-900">{fmt(result.remainingDebt)}</p>
                  </div>
                  <div className="rounded-lg bg-brand-500 p-4 text-white">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">{t.netWealth}</p>
                    <p className="font-display text-xl font-bold">{fmt(result.netWealth)}</p>
                  </div>
                </div>
                <div className="border-t border-brand-100 bg-white px-5 py-4">
                  <p className="mb-3 text-[12px] font-semibold text-gray-700">{t.projectedMonthlyCF}</p>
                  <div className="divide-y divide-gray-50">
                    <Row label={t.warmmiete} value={fmt(result.warmmietteY10)} positive />
                    <Row label={t.operatingCosts} value={"-" + fmt(result.opCostsY10)} />
                    <Row label={t.interest} value={"-" + fmt(result.monthlyInterestY10)} />
                    <Row label={t.principal} value={"-" + fmt(result.monthlyPrincipalY10)} />
                    <RowTotal label={t.cashflowOperative} value={fmt(result.cfOperativeY10)} sign={result.cfOperativeY10} />
                    <Row label={t.taxes} value={(result.taxY10 < 0 ? "+" : "-") + fmt(Math.abs(result.taxY10))} positive={result.taxY10 < 0} />
                    <RowTotal label={t.cashflowAfterTax} value={fmt(result.cfAfterTaxY10)} sign={result.cfAfterTaxY10} bold />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-800">
                <div className="mt-0.5 shrink-0"><WarningIcon /></div>
                <div>
                  <p className="mb-0.5 font-semibold">{t.disclaimerTitle}</p>
                  {t.disclaimerText}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`font-mono ${positive ? "text-emerald-700" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function RowTotal({ label, value, sign, bold }: { label: string; value: string; sign: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-5 py-3 text-sm">
      <span className={bold ? "font-semibold text-gray-800" : "text-gray-700"}>{label}</span>
      <span className={`font-mono ${bold ? "text-base" : "text-sm"} ${sign >= 0 ? "font-semibold text-emerald-700" : "font-semibold text-red-700"}`}>{value}</span>
    </div>
  );
}
