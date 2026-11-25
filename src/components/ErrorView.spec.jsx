import { render, screen, fireEvent } from "@testing-library/react-native";

import { ThemeContext } from "../contexts/theme/ThemeContext";
import { lightColors, darkColors } from "../theme";
import ErrorView from "./ErrorView";

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

async function renderWithTheme(component, colors = lightColors) {
  await render(
    <ThemeContext.Provider value={{ colors }}>
      {component}
    </ThemeContext.Provider>,
  );
}

describe("ErrorView", () => {
  it("shows the error message", async () => {
    await renderWithTheme(<ErrorView message="Няма връзка със сървъра" />);

    expect(screen.getByText("Няма връзка със сървъра")).toBeOnTheScreen();
  });

  it("shows the retry button when onRetry is given", async () => {
    await renderWithTheme(<ErrorView message="Грешка" onRetry={() => {}} />);

    expect(screen.getByText("Опитай отново")).toBeOnTheScreen();
  });

  it("does not show the retry button without onRetry", async () => {
    await renderWithTheme(<ErrorView message="Грешка" />);

    expect(screen.queryByText("Опитай отново")).not.toBeOnTheScreen();
  });

  it("calls onRetry when the button is pressed", async () => {
    const onRetry = jest.fn();

    await renderWithTheme(<ErrorView message="Грешка" onRetry={onRetry} />);
    await fireEvent.press(screen.getByText("Опитай отново"));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("uses the colors of the dark theme", async () => {
    await renderWithTheme(<ErrorView message="Грешка" />, darkColors);

    expect(screen.getByText("Грешка")).toHaveStyle({
      color: darkColors.text,
    });
  });
});
