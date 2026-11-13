export function getAuthErrorMessage(error) {
  if (!error.response) {
    return "Няма връзка със сървъра. Проверете интернета.";
  }

  const code = error.response.data?.error_code;

  if (code === "invalid_credentials") {
    return "Грешен имейл или парола";
  }
  if (code === "user_already_exists") {
    return "Вече има профил с този имейл";
  }
  if (code === "weak_password") {
    return "Паролата е твърде слаба";
  }

  return "Нещо се обърка. Опитайте отново.";
}