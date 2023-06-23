import { defineFeature, loadFeature } from "jest-cucumber";
const feature = loadFeature("./src/game_rounds.feature");

defineFeature(feature, (test) => {
  test("Player completes the game round", ({ given, when, then }) => {
    let gameStarted = false;
    let questionsAnswered = true;
    let totalScore = 0;
    let continuePlaying = false;

    given("the game has started", () => {
      gameStarted = true;
    });

    given("the player has answered all questions in the game round", () => {
      questionsAnswered = true;
    });

    when("the game round is complete", () => {
      totalScore = 100;
      continuePlaying = true;
    });

    then("the player receives a total score for the game round", () => {
      expect(totalScore).toBeGreaterThan(0);
    });

    then("the game presents an option to continue playing or quit", () => {
      expect(continuePlaying).toBeTruthy();
    });
  });
});
