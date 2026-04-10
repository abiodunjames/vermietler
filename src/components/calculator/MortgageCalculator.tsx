import React, { useState, useMemo, useEffect, useRef } from "react";
import { calculate, type MortgageInput } from "./mortgage-math";
import { track } from "../../lib/analytics";

type Lang = "en" | "de";
type Tab = "breakdown" | "amortization";

const translations = {
  en: {
    eyebrow: "Tools & Calculators",
    title: "Mortgage Calculator for Germany",
    subtitle: "Calculate your monthly payments, total interest, and full amortization schedule for a German Annuitätendarlehen.",
    inputTitle: "Loan Parameters",
    inputSub: "Enter your mortgage details",
    loanAmount: "Loan amount",
    interestRate: "Interest rate (p.a.)",
    repaymentRate: "Initial repayment rate",
    fixedPeriod: "Fixed rate period",
    extraPayment: "Extra annual payment",
    years: "years",
    monthlyPayment: "Monthly payment",
    totalInterest: "Total interest paid",
    totalCost: "Total cost of loan",
    remainingBalance: "Remaining balance",
    afterFixedPeriod: "after fixed rate period",
    payoffDate: "Payoff date",
    tabBreakdown: "Payment breakdown",
    tabAmortization: "Amortization",
    breakdownTitle: "Monthly payment breakdown",
    amortizationTitle: "Amortization schedule breakdown",
    amortizationDesc: "This table lists how much principal and interest is paid in each scheduled mortgage payment.",
    firstPayment: "First payment",
    lastPayment: "Last payment",
    principalLabel: "Principal",
    interestLabel: "Interest",
    principalPaid: "Principal paid",
    interestPaid: "Interest paid",
    extraLabel: "Extra payments",
    balanceLabel: "Remaining balance",
    dateLabel: "Date",
    expandAll: "Expand all years",
    perMonth: "/mo",
    asOf: "As of",
    jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
    jul: "Jul", aug: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
    infoRepayment: "Typical German mortgages use 1–5% initial repayment rate instead of a fixed loan term.",
    infoFixed: "After the fixed rate period ends, you refinance the remaining balance at the then-current market rate.",
    loanAmountLabel: "Loan Amount",
    monthlyPaymentLabel: "Monthly Payment",
    totalLabel: "Total Cost",
  },
  de: {
    eyebrow: "Tools & Rechner",
    title: "Tilgungsrechner für Immobilienfinanzierung",
    subtitle: "Berechnen Sie Ihre monatliche Rate, Gesamtzinsen und den vollständigen Tilgungsplan für Ihr Annuitätendarlehen.",
    inputTitle: "Darlehensparameter",
    inputSub: "Geben Sie Ihre Finanzierungsdetails ein",
    loanAmount: "Darlehensbetrag",
    interestRate: "Sollzins (p.a.)",
    repaymentRate: "Anfängliche Tilgung",
    fixedPeriod: "Zinsbindung",
    extraPayment: "Jährliche Sondertilgung",
    years: "Jahre",
    monthlyPayment: "Monatliche Rate",
    totalInterest: "Gezahlte Zinsen gesamt",
    totalCost: "Gesamtkosten",
    remainingBalance: "Restschuld",
    afterFixedPeriod: "nach Zinsbindung",
    payoffDate: "Enddatum",
    tabBreakdown: "Kostenübersicht",
    tabAmortization: "Tilgungsplan",
    breakdownTitle: "Monatliche Kostenübersicht",
    amortizationTitle: "Tilgungsplan",
    amortizationDesc: "Diese Tabelle zeigt, wie viel Tilgung und Zinsen in jeder Rate gezahlt werden.",
    firstPayment: "Erste Rate",
    lastPayment: "Letzte Rate",
    principalLabel: "Tilgung",
    interestLabel: "Zinsen",
    principalPaid: "Tilgung gezahlt",
    interestPaid: "Zinsen gezahlt",
    extraLabel: "Sondertilgung",
    balanceLabel: "Restschuld",
    dateLabel: "Datum",
    expandAll: "Alle Jahre aufklappen",
    perMonth: "/Monat",
    asOf: "Stand",
    jan: "Jan", feb: "Feb", mar: "Mär", apr: "Apr", may: "Mai", jun: "Jun",
    jul: "Jul", aug: "Aug", sep: "Sep", oct: "Okt", nov: "Nov", dec: "Dez",
    infoRepayment: "Deutsche Annuitätendarlehen verwenden eine anfängliche Tilgungsrate von 1–5% statt einer festen Laufzeit.",
    infoFixed: "Nach Ablauf der Zinsbindung wird die Restschuld zum dann geltenden Marktzins refinanziert.",
    loanAmountLabel: "Darlehensbetrag",
    monthlyPaymentLabel: "Monatliche Rate",
    totalLabel: "Gesamtkosten",
  },
};

function fmtNum(n: number, locale: string): string {
  return n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtEur(n: number, locale: string): string {
  return "€" + Math.round(n).toLocaleString(locale);
}

function fmtK(n: number): string {
  if (n >= 1000000) return `€${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `€${Math.round(n / 1000)}K`;
  return `€${Math.round(n)}`;
}

/* ── Icons ── */
const BankIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7h20L12 2z" /><rect x="4" y="10" width="2" height="8" /><rect x="9" y="10" width="2" height="8" />
    <rect x="14" y="10" width="2" height="8" /><rect x="19" y="10" width="2" height="8" /><rect x="2" y="18" width="20" height="2" />
  </svg>
);

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const ChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

/* ── Donut Chart ── */
function DonutChart({ principal, interest, monthlyPayment, locale, perMonth }: {
  principal: number; interest: number; monthlyPayment: number; locale: string; perMonth: string;
}) {
  const total = principal + interest;
  if (total === 0) return null;
  const pPct = principal / total;
  const size = 200;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const pLen = c * pPct;
  const iLen = c * (1 - pPct);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[220px]">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#60a5fa" strokeWidth="28"
          strokeDasharray={`${pLen} ${iLen}`} strokeDashoffset={c * 0.25} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2563eb" strokeWidth="28"
          strokeDasharray={`${iLen} ${pLen}`} strokeDashoffset={c * 0.25 - pLen} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-gray-900">€{fmtNum(monthlyPayment, locale)}</p>
        <p className="text-xs text-gray-400">{perMonth}</p>
      </div>
    </div>
  );
}

/* ── Amortization Line Chart ── */
function AmortizationChart({ schedule, startYear, principalPaidLabel, interestPaidLabel, asOfLabel, locale }: {
  schedule: { year: number; principal: number; interest: number; extraPayments: number; endBalance: number }[];
  startYear: number;
  principalPaidLabel: string;
  interestPaidLabel: string;
  asOfLabel: string;
  locale: string;
}) {
  if (schedule.length === 0) return null;

  let cumP = 0, cumI = 0;
  const data = schedule.map((yr) => {
    cumP += yr.principal + yr.extraPayments;
    cumI += yr.interest;
    return { year: startYear + yr.year - 1, cumPrincipal: cumP, cumInterest: cumI };
  });

  const maxVal = Math.max(data[data.length - 1].cumPrincipal, data[data.length - 1].cumInterest);

  const W = 560, H = 280;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const xScale = (i: number) => pad.left + (i / (data.length - 1)) * plotW;
  const yScale = (v: number) => pad.top + plotH - (v / maxVal) * plotH;

  const pPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(d.cumPrincipal).toFixed(1)}`).join(" ");
  const iPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(d.cumInterest).toFixed(1)}`).join(" ");

  const yTicks = [0, 1, 2, 3, 4].map((i) => (maxVal / 4) * i);
  const xLabelStep = Math.max(1, Math.floor(data.length / 4));
  const xLabels = data.filter((_, i) => i === 0 || i === data.length - 1 || i % xLabelStep === 0);

  const currentP = data.length > 0 ? data[0].cumPrincipal : 0;
  const currentI = data.length > 0 ? data[0].cumInterest : 0;

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {yTicks.map((tick) => (
          <React.Fragment key={tick}>
            <line x1={pad.left} x2={W - pad.right} y1={yScale(tick)} y2={yScale(tick)}
              stroke="#e5e7eb" strokeWidth="1" />
            <text x={pad.left - 8} y={yScale(tick) + 4} textAnchor="end"
              className="fill-gray-400" style={{ fontSize: "10px" }}>{fmtK(tick)}</text>
          </React.Fragment>
        ))}
        {xLabels.map((d) => {
          const i = data.indexOf(d);
          return (
            <text key={d.year} x={xScale(i)} y={H - 10} textAnchor="middle"
              className="fill-gray-500" style={{ fontSize: "11px", fontWeight: 500 }}>{d.year}</text>
          );
        })}
        <path d={iPath} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" />
        <path d={pPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      <div className="flex flex-col items-center gap-1 text-sm">
        <p className="text-xs text-gray-400">{asOfLabel} {data[0]?.year}</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand-600" />
            <span className="text-gray-600">{principalPaidLabel}</span>
            <span className="font-semibold tabular-nums text-gray-900">€{fmtNum(currentP, locale)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-gray-600">{interestPaidLabel}</span>
            <span className="font-semibold tabular-nums text-gray-900">€{fmtNum(currentI, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Info Tooltip ── */
function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative cursor-help">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-gray-200 shadow-lg group-hover:block">
        {text}
      </span>
    </span>
  );
}

/* ── Main Calculator ── */
export default function MortgageCalculator({ lang = "en" }: { lang?: Lang }) {
  const t = translations[lang];
  const locale = lang === "de" ? "de-DE" : "en-US";
  const fmt = (n: number) => fmtNum(n, locale);
  const startYear = new Date().getFullYear();
  const startMonth = new Date().getMonth();

  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [repaymentRate, setRepaymentRate] = useState(2.0);
  const [fixedRatePeriod, setFixedRatePeriod] = useState(10);
  const [extraAnnualPayment, setExtraAnnualPayment] = useState(0);
  const [tab, setTab] = useState<Tab>("breakdown");
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
  const [expandAll, setExpandAll] = useState(false);

  const [loanAmountRaw, setLoanAmountRaw] = useState("300.000");
  const [extraPaymentRaw, setExtraPaymentRaw] = useState("0");

  function handleLoanAmount(raw: string) {
    setLoanAmountRaw(raw);
    const v = parseInt(raw.replace(/\D/g, ""), 10);
    if (!isNaN(v) && v >= 0) setLoanAmount(Math.min(v, 10000000));
  }
  function handleLoanAmountBlur() {
    const clamped = Math.max(10000, Math.min(loanAmount, 10000000));
    setLoanAmount(clamped);
    setLoanAmountRaw(clamped.toLocaleString(locale));
  }
  function handleInterestRate(v: number) {
    if (isNaN(v)) return;
    setInterestRate(Math.max(0, Math.min(v, 15)));
  }
  function handleRepaymentRate(v: number) {
    if (isNaN(v)) return;
    setRepaymentRate(Math.max(0.5, Math.min(v, 15)));
  }
  function handleExtraPayment(raw: string) {
    setExtraPaymentRaw(raw);
    const v = parseInt(raw.replace(/\D/g, ""), 10);
    setExtraAnnualPayment(isNaN(v) ? 0 : Math.min(v, 1000000));
  }
  function handleExtraPaymentBlur() {
    setExtraPaymentRaw(extraAnnualPayment.toLocaleString(locale));
  }

  const result = useMemo(() => calculate({
    loanAmount, interestRate, repaymentRate, fixedRatePeriod, extraAnnualPayment,
  }), [loanAmount, interestRate, repaymentRate, fixedRatePeriod, extraAnnualPayment]);

  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) {
      track("calculator_used", {
        calculator: "mortgage",
        loan_amount: loanAmount,
        interest_rate: interestRate,
        repayment_rate: repaymentRate,
        fixed_period: fixedRatePeriod,
        monthly_payment: result.monthlyPayment,
        lang,
      });
    }
    tracked.current = true;
  }, [loanAmount, interestRate, repaymentRate, fixedRatePeriod, extraAnnualPayment]);

  const payoffYears = Math.floor(result.payoffMonths / 12);
  const lastPaymentYear = startYear + payoffYears;
  const lastPaymentMonth = (startMonth + (result.payoffMonths % 12)) % 12;
  const monthNames = [t.jan, t.feb, t.mar, t.apr, t.may, t.jun, t.jul, t.aug, t.sep, t.oct, t.nov, t.dec];

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      next.has(year) ? next.delete(year) : next.add(year);
      return next;
    });
  }

  function toggleExpandAll() {
    if (expandAll) {
      setExpandedYears(new Set());
    } else {
      setExpandedYears(new Set(result.schedule.map((s) => s.year)));
    }
    setExpandAll(!expandAll);
  }

  const inputCls = "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";

  const tabCls = (active: boolean) =>
    `cursor-pointer px-5 py-2.5 text-sm font-semibold transition border-b-2 ${active ? "border-brand-500 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"}`;

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

      <div className="grid items-start gap-6 lg:grid-cols-[420px_1fr]">
        {/* ── Left: Inputs ── */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
              <BankIcon />
            </div>
            <div>
              <div className="font-display text-[15px] font-semibold text-gray-900">{t.inputTitle}</div>
              <div className="text-[13px] text-gray-400">{t.inputSub}</div>
            </div>
          </div>
          <div className="space-y-5 p-6">
            {/* Loan amount */}
            <div>
              <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.loanAmount}</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">€</span>
                <input type="text" inputMode="numeric"
                  value={loanAmountRaw}
                  onChange={(e) => handleLoanAmount(e.target.value)}
                  onBlur={handleLoanAmountBlur}
                  className={`${inputCls} pl-9`} />
              </div>
              {loanAmount < 10000 && <p className="mt-1 text-xs text-red-500">Min €10,000</p>}
              <div className="mt-2 flex items-center gap-3">
                <input type="range" min={50000} max={1000000} step={10000} value={loanAmount}
                  onChange={(e) => { const v = Number(e.target.value); setLoanAmount(v); setLoanAmountRaw(v.toLocaleString(locale)); }}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-brand-500 outline-none [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(37,99,235,0.35)]" />
                <span className="min-w-[72px] whitespace-nowrap rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-center font-mono text-xs font-medium text-brand-600">
                  {fmtEur(loanAmount, locale)}
                </span>
              </div>
            </div>

            {/* Interest rate */}
            <div>
              <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.interestRate}</label>
              <div className="relative">
                <input type="number" step={0.1} min={0} max={15} value={interestRate}
                  onChange={(e) => handleInterestRate(Number(e.target.value))}
                  className={`${inputCls} pr-10`} />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">%</span>
              </div>
              {interestRate <= 0 && <p className="mt-1 text-xs text-red-500">Must be greater than 0</p>}
            </div>

            {/* Repayment rate */}
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <label className="text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.repaymentRate}</label>
                <InfoTooltip text={t.infoRepayment} />
              </div>
              <div className="relative">
                <input type="number" step={0.5} min={0.5} max={15} value={repaymentRate}
                  onChange={(e) => handleRepaymentRate(Number(e.target.value))}
                  className={`${inputCls} pr-10`} />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">%</span>
              </div>
              {repaymentRate < 0.5 && <p className="mt-1 text-xs text-red-500">Min 0.5%</p>}
            </div>

            <hr className="border-gray-100" />

            {/* Fixed period */}
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <label className="text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.fixedPeriod}</label>
                <InfoTooltip text={t.infoFixed} />
              </div>
              <select value={fixedRatePeriod} onChange={(e) => setFixedRatePeriod(Number(e.target.value))}
                className={`${inputCls} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10`}>
                {[5, 10, 15, 20, 25, 30].map((y) => <option key={y} value={y}>{y} {t.years}</option>)}
              </select>
            </div>

            {/* Extra payment */}
            <div>
              <label className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-gray-700">{t.extraPayment}</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-gray-400">€</span>
                <input type="text" inputMode="numeric"
                  value={extraPaymentRaw}
                  onChange={(e) => handleExtraPayment(e.target.value)}
                  onBlur={handleExtraPaymentBlur}
                  className={`${inputCls} pl-9`} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="flex flex-col gap-4">
          {/* Total hero card */}
          <div className="relative overflow-hidden rounded-xl p-6 shadow-lg" style={{ background: "linear-gradient(135deg, #253553 0%, #1e3a8a 100%)" }}>
            <div className="absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full" style={{ background: "rgba(96,165,250,0.08)" }} />
            <p className="relative mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-brand-300">{t.monthlyPayment}</p>
            <p className="relative mb-1 font-display text-[38px] leading-none font-bold tracking-tight text-white max-sm:text-[28px]">
              €{fmt(result.monthlyPayment)}
            </p>
            <p className="relative text-[13px] text-white/50">{t.perMonth}</p>
            <div className="relative mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-5">
              <div className="flex-1">
                <p className="mb-0.5 text-[11px] text-white/45">{t.loanAmountLabel}</p>
                <p className="font-mono text-sm font-medium text-white">{fmtEur(loanAmount, locale)}</p>
              </div>
              <div className="flex-1">
                <p className="mb-0.5 text-[11px] text-white/45">{t.totalInterest}</p>
                <p className="font-mono text-sm font-medium text-white">{fmtEur(result.totalInterest, locale)}</p>
              </div>
              <div className="flex-1">
                <p className="mb-0.5 text-[11px] text-white/45">{t.totalLabel}</p>
                <p className="font-mono text-sm font-medium text-white">{fmtEur(result.totalPaid, locale)}</p>
              </div>
            </div>
          </div>

          {/* Remaining balance callout */}
          {fixedRatePeriod < payoffYears && (
            <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-800">
              <div className="mt-0.5 shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <p className="mb-0.5 font-semibold">{t.remainingBalance} {t.afterFixedPeriod} ({fixedRatePeriod} {t.years})</p>
                <p className="font-mono text-lg font-bold text-amber-900">€{fmt(result.remainingBalance)}</p>
              </div>
            </div>
          )}

          {/* Tabbed results card */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="relative z-10 flex border-b border-gray-200">
              <button type="button" onClick={() => setTab("breakdown")} className={tabCls(tab === "breakdown")}>{t.tabBreakdown}</button>
              <button type="button" onClick={() => setTab("amortization")} className={tabCls(tab === "amortization")}>{t.tabAmortization}</button>
            </div>

            {/* ── Payment Breakdown Tab ── */}
            {tab === "breakdown" && (
              <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                    <ListIcon />
                    {t.breakdownTitle}
                  </div>
                  <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 font-mono text-xs font-medium text-brand-700">
                    {fmtEur(result.totalPaid, locale)}
                  </span>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { label: t.loanAmount, value: `€${fmt(loanAmount)}` },
                    { label: t.totalInterest, value: `€${fmt(result.totalInterest)}` },
                    { label: t.totalCost, value: `€${fmt(result.totalPaid)}` },
                    { label: t.payoffDate, value: `${monthNames[lastPaymentMonth]} ${lastPaymentYear}` },
                  ].map((kpi) => (
                    <div key={kpi.label}>
                      <p className="text-[11px] font-medium text-gray-500">{kpi.label}</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">{kpi.value}</p>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100" />

                {/* Donut chart + legend */}
                <div className="grid items-center gap-6 sm:grid-cols-2">
                  <DonutChart principal={loanAmount} interest={result.totalInterest}
                    monthlyPayment={result.monthlyPayment} locale={locale} perMonth={t.perMonth} />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-brand-600" />
                        <span className="text-sm text-gray-700">{t.principalLabel}</span>
                      </div>
                      <span className="font-mono text-sm font-semibold tabular-nums text-gray-900">€{fmt(loanAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-blue-400" />
                        <span className="text-sm text-gray-700">{t.interestLabel}</span>
                      </div>
                      <span className="font-mono text-sm font-semibold tabular-nums text-gray-900">€{fmt(result.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Amortization Tab ── */}
            {tab === "amortization" && (
              <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                      <ChartIcon />
                      {t.amortizationTitle}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{t.amortizationDesc}</p>
                  </div>
                </div>

                {/* Date range */}
                <div className="flex items-center gap-4">
                  <div className="rounded-lg border border-gray-200 px-4 py-2">
                    <p className="text-[11px] text-gray-400">{t.firstPayment}</p>
                    <p className="text-sm font-bold text-gray-900">{monthNames[startMonth]} {startYear}</p>
                  </div>
                  <span className="text-lg text-gray-300">&rarr;</span>
                  <div>
                    <p className="text-[11px] text-gray-400">{t.lastPayment}</p>
                    <p className="text-sm font-bold text-gray-900">{monthNames[lastPaymentMonth]} {lastPaymentYear}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t.expandAll}</span>
                    <button type="button" onClick={toggleExpandAll}
                      className={`relative h-5 w-9 cursor-pointer rounded-full transition ${expandAll ? "bg-brand-500" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${expandAll ? "translate-x-4" : ""}`} />
                    </button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Line chart */}
                <AmortizationChart
                  schedule={result.schedule}
                  startYear={startYear}
                  principalPaidLabel={t.principalPaid}
                  interestPaidLabel={t.interestPaid}
                  asOfLabel={t.asOf}
                  locale={locale}
                />
              </div>
            )}
          </div>

          {/* Amortization table card (separate card below) */}
          {tab === "amortization" && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-[13px] font-semibold text-gray-700">{t.dateLabel}</th>
                      <th className="px-4 py-3 text-right text-[13px] font-semibold text-gray-700">{t.principalLabel}</th>
                      <th className="px-4 py-3 text-right text-[13px] font-semibold text-gray-700">{t.interestLabel}</th>
                      {extraAnnualPayment > 0 && (
                        <th className="px-4 py-3 text-right text-[13px] font-semibold text-gray-700">{t.extraLabel}</th>
                      )}
                      <th className="px-4 py-3 text-right text-[13px] font-semibold text-gray-700">{t.balanceLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((yr) => {
                      const isExpanded = expandedYears.has(yr.year);
                      const isFixedEnd = yr.year === fixedRatePeriod;
                      return (
                        <React.Fragment key={yr.year}>
                          <tr onClick={() => toggleYear(yr.year)}
                            className={`cursor-pointer select-none border-b border-gray-100 transition hover:bg-brand-25 ${isFixedEnd ? "bg-amber-50/50" : ""}`}>
                            <td className="px-4 py-3 font-semibold text-brand-600">
                              <span className="mr-1.5 inline-block text-xs">{isExpanded ? "−" : "+"}</span>
                              {startYear + yr.year - 1}
                            </td>
                            <td className="px-4 py-3 text-right font-mono tabular-nums">€{fmt(yr.principal)}</td>
                            <td className="px-4 py-3 text-right font-mono tabular-nums">€{fmt(yr.interest)}</td>
                            {extraAnnualPayment > 0 && (
                              <td className="px-4 py-3 text-right font-mono tabular-nums">€{fmt(yr.extraPayments)}</td>
                            )}
                            <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">€{fmt(yr.endBalance)}</td>
                          </tr>
                          {isExpanded && yr.months.map((m) => (
                            <tr key={m.month} className="border-b border-gray-50 bg-gray-50/50 text-xs text-gray-500">
                              <td className="py-2 pl-10 pr-4">{monthNames[(startMonth + m.month - 1) % 12]} {startYear + Math.floor((startMonth + m.month - 1) / 12)}</td>
                              <td className="px-4 py-2 text-right font-mono tabular-nums">€{fmt(m.principal)}</td>
                              <td className="px-4 py-2 text-right font-mono tabular-nums">€{fmt(m.interest)}</td>
                              {extraAnnualPayment > 0 && (
                                <td className="px-4 py-2 text-right font-mono tabular-nums">{m.extraPayment > 0 ? `€${fmt(m.extraPayment)}` : "—"}</td>
                              )}
                              <td className="px-4 py-2 text-right font-mono font-medium tabular-nums">€{fmt(m.balance)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
