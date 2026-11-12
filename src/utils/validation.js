const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function validateName(name) {
  const value = name.trim();

  if (!value) {
    return "Въведете име";
  }
  if (value.length < 2) {
    return "Името трябва да е поне 2 символа";
  }

  return "";
}

export function validateEmail(email) {
  const value = email.trim();

  if (!value) {
    return "Въведете имейл";
  }
  if (!EMAIL_PATTERN.test(value)) {
    return "Невалиден имейл адрес";
  }

  return "";
}

export function validatePassword(password) {
  if (!password) {
    return "Въведете парола";
  }
  if (password.length < 6) {
    return "Паролата трябва да е поне 6 символа";
  }

  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Повторете паролата";
  }
  if (password !== confirmPassword) {
    return "Паролите не съвпадат";
  }

  return "";
}

export function validateTitle(title) {
  const value = title.trim();

  if (!value) {
    return "Въведете описание";
  }
  if (value.length < 3) {
    return "Описанието трябва да е поне 3 символа";
  }
  if (value.length > 100) {
    return "Описанието може да е най-много 100 символа";
  }

  return "";
}

export function validateAmount(amount) {
  const value = amount.trim().replace(",", ".");

  if (!value) {
    return "Въведете сума";
  }
  if (isNaN(Number(value))) {
    return "Сумата трябва да е число";
  }
  if (Number(value) <= 0) {
    return "Сумата трябва да е по-голяма от 0";
  }
  if (!AMOUNT_PATTERN.test(value)) {
    return "Сумата може да има най-много 2 знака след запетаята";
  }

  return "";
}

export function hasErrors(errors) {
  return Object.values(errors).some((error) => error !== "");
}

export function validateImage(imageUri) {
  if (!imageUri) {
    return "Добавете снимка на документа";
  }

  return "";
}
