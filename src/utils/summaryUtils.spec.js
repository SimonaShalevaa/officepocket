import {
  calculateSummary,
  calculatePending,
  getPeriodRange,
  getPeriodTitle,
} from "./summaryUtils";

const transactions = [
  { type: "income", amount: 5000, date: "2026-11-05", isPaid: true },
  { type: "expense", amount: 800, date: "2026-11-01", isPaid: false },
  { type: "salary", amount: 1800, date: "2026-11-10", isPaid: true },
  { type: "dividend", amount: 400, date: "2026-11-20", isPaid: true },
  { type: "income", amount: 1000, date: "2026-10-15", isPaid: true },
  { type: "expense", amount: 150.5, date: "2026-10-20", isPaid: false },
];

describe("calculateSummary", () => {
  it("sums only the records from the selected period", () => {
    const summary = calculateSummary(transactions, "2026-11-01", "2026-11-30");

    expect(summary.income).toBe(5000);
    expect(summary.expense).toBe(800);
    expect(summary.salary).toBe(1800);
    expect(summary.dividend).toBe(400);
  });

  it("counts expenses, salaries and dividends as total expenses", () => {
    const summary = calculateSummary(transactions, "2026-11-01", "2026-11-30");

    expect(summary.totalExpenses).toBe(3000);
  });

  it("calculates the balance as income minus total expenses", () => {
    const summary = calculateSummary(transactions, "2026-11-01", "2026-11-30");

    expect(summary.balance).toBe(2000);
  });

  it("works with decimal amounts", () => {
    const summary = calculateSummary(transactions, "2026-10-01", "2026-10-31");

    expect(summary.balance).toBeCloseTo(849.5);
  });

  it("returns a negative balance when expenses are bigger", () => {
    const summary = calculateSummary(
      [
        { type: "income", amount: 300, date: "2026-12-01", isPaid: true },
        { type: "expense", amount: 500, date: "2026-12-02", isPaid: true },
      ],
      "2026-12-01",
      "2026-12-31",
    );

    expect(summary.balance).toBe(-200);
  });

  it("returns zeros for a period without records", () => {
    const summary = calculateSummary(transactions, "2026-01-01", "2026-01-31");

    expect(summary.income).toBe(0);
    expect(summary.totalExpenses).toBe(0);
    expect(summary.balance).toBe(0);
  });

  it("includes records from several months in a longer period", () => {
    const summary = calculateSummary(transactions, "2026-10-01", "2026-11-30");

    expect(summary.income).toBe(6000);
  });

  it("includes the first and the last day of the period", () => {
    const summary = calculateSummary(transactions, "2026-11-05", "2026-11-20");

    expect(summary.income).toBe(5000);
    expect(summary.dividend).toBe(400);
  });
});

describe("getPeriodRange", () => {
  it("returns the first and last day of a month", () => {
    expect(getPeriodRange("month", 2026, 1)).toEqual({
      startDate: "2026-02-01",
      endDate: "2026-02-28",
    });
  });

  it("returns the three months of a quarter", () => {
    expect(getPeriodRange("quarter", 2026, 3)).toEqual({
      startDate: "2026-10-01",
      endDate: "2026-12-31",
    });
  });

  it("returns the whole year", () => {
    expect(getPeriodRange("year", 2026, 0)).toEqual({
      startDate: "2026-01-01",
      endDate: "2026-12-31",
    });
  });
});

describe("getPeriodTitle", () => {
  it("shows the month name and year", () => {
    expect(getPeriodTitle("month", 2026, 10)).toBe("Ноември 2026");
  });

  it("shows the months of the quarter", () => {
    expect(getPeriodTitle("quarter", 2026, 3)).toBe("Окт – Дек 2026");
  });

  it("shows only the year", () => {
    expect(getPeriodTitle("year", 2026, 0)).toBe("2026");
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
