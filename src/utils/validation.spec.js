import {
  validateName,
  validateEmail,
  validatePassword,
  validateNewPassword,
  validateConfirmPassword,
  validateTitle,
  validateAmount,
  validateVacationDates,
  validateNote,
  hasErrors,
} from "./validation";

describe("validateName", () => {
  it("returns an error when the name is empty", () => {
    expect(validateName("   ")).toBe("Въведете име");
  });

  it("returns an error when the name is too short", () => {
    expect(validateName("A")).toBe("Името трябва да е поне 2 символа");
  });

  it("returns an error when the name is too long", () => {
    expect(validateName("a".repeat(51))).toBe(
      "Името може да е най-много 50 символа",
    );
  });

  it("returns no error for a valid name", () => {
    expect(validateName("Симона")).toBe("");
  });
});

describe("validateEmail", () => {
  it("returns an error when the email is empty", () => {
    expect(validateEmail("")).toBe("Въведете имейл");
  });

  it("returns an error for an invalid email", () => {
    expect(validateEmail("ivan@firma")).toBe("Невалиден имейл адрес");
  });

  it("returns no error for a valid email", () => {
    expect(validateEmail("ivan@firma.bg")).toBe("");
  });
});

describe("validatePassword", () => {
  it("returns an error when the password is empty", () => {
    expect(validatePassword("")).toBe("Въведете парола");
  });

  it("returns an error when the password is shorter than 6 characters", () => {
    expect(validatePassword("12345")).toBe(
      "Паролата трябва да е поне 6 символа",
    );
  });

  it("returns no error for a valid password", () => {
    expect(validatePassword("123456")).toBe("");
  });
});

describe("validateNewPassword", () => {
  it("returns an error when the new password is the same as the current", () => {
    expect(validateNewPassword("secret1", "secret1")).toBe(
      "Новата парола трябва да е различна от текущата",
    );
  });

  it("returns no error for a different valid password", () => {
    expect(validateNewPassword("secret1", "secret2")).toBe("");
  });
});

describe("validateConfirmPassword", () => {
  it("returns an error when the passwords do not match", () => {
    expect(validateConfirmPassword("123456", "654321")).toBe(
      "Паролите не съвпадат",
    );
  });

  it("returns no error when the passwords match", () => {
    expect(validateConfirmPassword("123456", "123456")).toBe("");
  });
});

describe("validateTitle", () => {
  it("returns an error when the title is too short", () => {
    expect(validateTitle("ab")).toBe("Описанието трябва да е поне 3 символа");
  });

  it("returns no error for a valid title", () => {
    expect(validateTitle("Наем офис")).toBe("");
  });
});

describe("validateAmount", () => {
  it("returns an error when the amount is empty", () => {
    expect(validateAmount("")).toBe("Въведете сума");
  });

  it("returns an error when the amount is not a number", () => {
    expect(validateAmount("abc")).toBe("Сумата трябва да е число");
  });

  it("returns an error when the amount is 0", () => {
    expect(validateAmount("0")).toBe("Сумата трябва да е по-голяма от 0");
  });

  it("returns an error when the amount has more than 2 decimals", () => {
    expect(validateAmount("10,555")).toBe(
      "Сумата може да има най-много 2 знака след запетаята",
    );
  });

  it("accepts an amount with a comma", () => {
    expect(validateAmount("12,50")).toBe("");
  });

  it("accepts an amount with a dot", () => {
    expect(validateAmount("12.50")).toBe("");
  });
});

describe("validateVacationDates", () => {
  it("returns an error when the end date is before the start date", () => {
    expect(validateVacationDates("2026-12-10", "2026-12-01")).toBe(
      "Крайната дата не може да е преди началната",
    );
  });

  it("returns an error when the period is only a weekend", () => {
    expect(validateVacationDates("2026-11-28", "2026-11-29")).toBe(
      "Периодът трябва да съдържа поне един работен ден",
    );
  });

  it("returns no error for a valid period", () => {
    expect(validateVacationDates("2026-11-23", "2026-11-27")).toBe("");
  });
});

describe("validateNote", () => {
  it("returns an error when the note is longer than 200 characters", () => {
    expect(validateNote("a".repeat(201))).toBe(
      "Бележката може да е най-много 200 символа",
    );
  });

  it("allows an empty note", () => {
    expect(validateNote("")).toBe("");
  });
});

describe("hasErrors", () => {
  it("returns true when at least one field has an error", () => {
    expect(hasErrors({ email: "", password: "Въведете парола" })).toBe(true);
  });

  it("returns false when there are no errors", () => {
    expect(hasErrors({ email: "", password: "" })).toBe(false);
  });
});
