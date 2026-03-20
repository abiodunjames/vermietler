/** Core mortgage math for German Annuitätendarlehen */

export interface MortgageInput {
  loanAmount: number;       // Darlehensbetrag in EUR
  interestRate: number;     // Sollzins p.a. (e.g. 3.5 for 3.5%)
  repaymentRate: number;    // Anfängliche Tilgung p.a. (e.g. 2 for 2%)
  fixedRatePeriod: number;  // Zinsbindung in years
  extraAnnualPayment: number; // Sondertilgung p.a.
}

export interface MonthlyRow {
  month: number;
  year: number;
  principal: number;
  interest: number;
  payment: number;
  extraPayment: number;
  balance: number;
}

export interface YearlySummary {
  year: number;
  principal: number;
  interest: number;
  extraPayments: number;
  endBalance: number;
  months: MonthlyRow[];
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  remainingBalance: number;   // Restschuld after Zinsbindung
  payoffMonths: number;       // months to full payoff (if no rate change)
  schedule: YearlySummary[];
}

export function calculate(input: MortgageInput): MortgageResult {
  const { loanAmount, interestRate, repaymentRate, fixedRatePeriod, extraAnnualPayment } = input;

  if (loanAmount <= 0 || interestRate < 0 || repaymentRate <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPaid: 0,
      remainingBalance: 0,
      payoffMonths: 0,
      schedule: [],
    };
  }

  const annualRate = interestRate / 100;
  const annualRepayment = repaymentRate / 100;

  // German annuity: monthly payment = loan * (interest + repayment) / 12
  const monthlyPayment = loanAmount * (annualRate + annualRepayment) / 12;
  const monthlyRate = annualRate / 12;

  let balance = loanAmount;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const yearlyMap = new Map<number, MonthlyRow[]>();

  // Calculate until paid off or 40 years max
  const maxMonths = 40 * 12;
  while (balance > 0.01 && month < maxMonths) {
    month++;
    const currentYear = Math.ceil(month / 12);

    const interestPortion = balance * monthlyRate;
    let principalPortion = monthlyPayment - interestPortion;

    // Extra annual payment applied in December (month 12 of each year)
    let extra = 0;
    if (month % 12 === 0 && extraAnnualPayment > 0) {
      extra = Math.min(extraAnnualPayment, balance - principalPortion);
      if (extra < 0) extra = 0;
    }

    // Don't overpay
    if (principalPortion + extra > balance) {
      principalPortion = balance - extra;
      if (principalPortion < 0) {
        extra = balance;
        principalPortion = 0;
      }
    }

    balance -= (principalPortion + extra);
    if (balance < 0.01) balance = 0;

    totalInterest += interestPortion;
    totalPaid += monthlyPayment + extra;

    const row: MonthlyRow = {
      month,
      year: currentYear,
      principal: principalPortion,
      interest: interestPortion,
      payment: monthlyPayment,
      extraPayment: extra,
      balance,
    };

    if (!yearlyMap.has(currentYear)) yearlyMap.set(currentYear, []);
    yearlyMap.get(currentYear)!.push(row);
  }

  // Build yearly summaries
  const schedule: YearlySummary[] = [];
  for (const [year, months] of yearlyMap) {
    schedule.push({
      year,
      principal: months.reduce((s, m) => s + m.principal, 0),
      interest: months.reduce((s, m) => s + m.interest, 0),
      extraPayments: months.reduce((s, m) => s + m.extraPayment, 0),
      endBalance: months[months.length - 1].balance,
      months,
    });
  }

  // Remaining balance after Zinsbindung
  const fixedPeriodYear = schedule.find((s) => s.year === fixedRatePeriod);
  const remainingBalance = fixedPeriodYear?.endBalance ?? balance;

  return {
    monthlyPayment,
    totalInterest,
    totalPaid,
    remainingBalance,
    payoffMonths: month,
    schedule,
  };
}
