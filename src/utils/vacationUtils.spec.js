import {
  countWorkingDays,
  getVacationStatus,
  calculatePaidDaysInYear,
} from "./vacationUtils";

describe("countWorkingDays", () => {
  it("counts the days from Monday to Friday", () => {
    expect(countWorkingDays("2026-12-21", "2026-12-25")).toBe(5);
  });

  it("does not count Saturday and Sunday", () => {
    expect(countWorkingDays("2026-11-23", "2026-11-29")).toBe(5);
  });

  it("returns 0 for a weekend only", () => {
    expect(countWorkingDays("2026-11-28", "2026-11-29")).toBe(0);
  });

  it("counts one day when start and end are the same working day", () => {
    expect(countWorkingDays("2026-11-25", "2026-11-25")).toBe(1);
  });
});

describe("getVacationStatus", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 25));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns upcoming for a vacation in the future", () => {
    const status = getVacationStatus({
      startDate: "2026-12-21",
      endDate: "2026-12-25",
    });

    expect(status).toBe("upcoming");
  });

  it("returns used for a vacation in the past", () => {
    const status = getVacationStatus({
      startDate: "2026-08-03",
      endDate: "2026-08-07",
    });

    expect(status).toBe("used");
  });

  it("returns current when today is inside the period", () => {
    const status = getVacationStatus({
      startDate: "2026-11-23",
      endDate: "2026-11-27",
    });

    expect(status).toBe("current");
  });
});

describe("calculatePaidDaysInYear", () => {
  const vacations = [
    { type: "paid", startDate: "2026-08-03", endDate: "2026-08-07" },
    { type: "unpaid", startDate: "2026-09-07", endDate: "2026-09-11" },
    { type: "sick", startDate: "2026-10-05", endDate: "2026-10-06" },
    { type: "paid", startDate: "2026-12-28", endDate: "2027-01-08" },
  ];

  it("counts only paid vacations", () => {
    expect(calculatePaidDaysInYear(vacations, 2026)).toBe(9);
  });

  it("splits a vacation over New Year between the two years", () => {
    expect(calculatePaidDaysInYear(vacations, 2027)).toBe(6);
  });

  it("returns 0 for a year without vacations", () => {
    expect(calculatePaidDaysInYear(vacations, 2025)).toBe(0);
  });
});
