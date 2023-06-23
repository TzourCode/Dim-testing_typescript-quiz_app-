///<reference types="cypress"/>

describe("Quiz App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should start the game and answer a question", () => {
    // Type player name and start the game
    cy.get('input[type="text"]').type("John");
    cy.contains("Click to proceed").click();

    // Pick category and difficulty
    cy.get(".category").first().click();
    cy.contains("easy").click();
    cy.contains("Click me to continue!").click();

    // Answer a question
    for (let i = 0; i < 9; i++) {
      cy.get("button").first().click();
      cy.wait(1000);

      cy.get("body").then(($body) => {
        // synchronously ask for the body's text
        // and do something based on whether it includes
        // another string
        if ($body.text().includes("You picked the right answer!!")) {
          // yup found it
          cy.get(".category-ifright").first().click();
          cy.wait(4000);
        }
      });
    }

    // Assert the results and continue
    cy.contains("You finished the game!");
    cy.contains("You had").should("be.visible");
    cy.contains(" right answer!").should("be.visible");
    cy.contains(" wrong answers!").should("be.visible");
    cy.contains("Totalscore:").should("be.visible");

    // Start a new game
    cy.contains("Wanna play a new game?").click();
    cy.get('input[type="text"]').should("be.empty");
  });
});
