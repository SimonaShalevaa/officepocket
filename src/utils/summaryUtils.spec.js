import { calculateMonthSummary, calculatePending } from "./summaryUtils";

const transactions = [
  { type: "income", amount: 5000, date: "2026-11-05", isPaid: true },
  { type: "expense", amount: 800, date: "2026-11-01", isPaid: false },
  { type: "salary", amount: 1800, date: "2026-11-10", isPaid: true },
  { type: "dividend", amount: 400, date: "2026-11-20", isPaid: true },
  { type: "income", amount: 1000, date: "2026-10-15", isPaid: true },
  { type: "expense", amount: 150.5, date: "2026-10-20", isPaid: false },
];

describe("calculateMonthSummary", () => {
  it("sums only the records from the selected month", () => {
    const summary = calculateMonthSummary(transactions, 2026, 10);

    expect(summary.income).toBe(5000);
    expect(summary.expense).toBe(800);
    expect(summary.salary).toBe(1800);
    expect(summary.dividend).toBe(400);
  });

  it("counts expenses, salaries and dividends as total expenses", () => {
    const summary = calculateMonthSummary(transactions, 2026, 10);

    expect(summary.totalExpenses).toBe(3000);
  });

  it("calculates the balance as income minus total expenses", () => {
    const summary = calculateMonthSummary(transactions, 2026, 10);

    expect(summary.balance).toBe(2000);
  });

  it("works with decimal amounts", () => {
    const summary = calculateMonthSummary(transactions, 2026, 9);

    expect(summary.balance).toBeCloseTo(849.5);
  });

  it("returns a negative balance when expenses are bigger", () => {
    const summary = calculateMonthSummary(
      [
        { type: "income", amount: 300, date: "2026-12-01", isPaid: true },
        { type: "expense", amount: 500, date: "2026-12-02", isPaid: true },
      ],
      2026,
      11,
    );

    expect(summary.balance).toBe(-200);
  });

  it("returns zeros for a month without records", () => {
    const summary = calculateMonthSummary(transactions, 2026, 0);

    expect(summary.income).toBe(0);
    expect(summary.totalExpenses).toBe(0);
    expect(summary.balance).toBe(0);
  });
});

describe("calculatePending", () => {
  it("counts all unpaid records from all months", () => {
    const pending = calculatePending(transactions);

    expect(pending.count).toBe(2);
    expect(pending.amount).toBeCloseTo(950.5);
  });

  it("returns zero when everything is paid", () => {
    const pending = calculatePending([
      { type: "income", amount: 100, date: "2026-11-01", isPaid: true },
    ]);

    expect(pending.count).toBe(0);
    expect(pending.amount).toBe(0);
  });
});
