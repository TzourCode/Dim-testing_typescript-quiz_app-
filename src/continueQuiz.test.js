import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { wait } from "@testing-library/user-event/dist/utils";
describe("App", () => {
  it("updates the player name when typed into the input", () => {
    render(<App />);
    const playerNameInput = screen.getByLabelText("Player name:");
    fireEvent.change(playerNameInput, { target: { value: "Bob" } });
    expect(playerNameInput.value).toBe("Bob");
  });

  it("renders the player name input", () => {
    render(<App />);
    const playerNameInput = screen.getByLabelText("Player name:");
    expect(playerNameInput).toBeInTheDocument();
  });
  it("handles button click", () => {
    render(<App />);
    const button = screen.getByText("Click to proceed");
    userEvent.click(button);
  });

  it("renders category headline", async () => {
    render(<App />);
    await wait(() => {
      const category = screen.getByLabelText("Pick one category:");
      expect(category).toBeInTheDocument();
    });
  });
  it("renders difficulty headline", async () => {
    render(<App />);
    await wait(() => {
      const cat = screen.getByLabelText("Pick one difficulty:");
      expect(cat).toBeInTheDocument();
    });
  });

  it("handles button click pick category", async () => {
    render(<App />);
    const regex =
      /(arts_and_literature|film_and_tv|food_and_drink|general_knowledge|geography|history|music|science|society_and_culture|sport_and_leisure)/i;
    await wait(() => {
      const butCat = screen.getByText(regex);
      fireEvent.click(butCat);
    });
  });

  it("handles button click pick difficulty", async () => {
    render(<App />);
    await wait(() => {
      const butDif = screen.getByText("easy");
      fireEvent.click(butDif);
    });
  });

  it("handles button click continue to questions", async () => {
    render(<App />);
    await wait(() => {
      const butCont = screen.getByText("Click me to continue!");
      fireEvent.click(butCont);
    });
  });

  it("renders question headline", async () => {
    render(<App />);
    await wait(() => {
      const questions = screen.getByLabelText("Question");
      expect(questions).toBeInTheDocument();
    });
  });
});
