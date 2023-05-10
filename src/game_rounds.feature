Feature: Game round

Scenario: Player completes the game round
Given the game has started
And the player has answered all questions in the game round
When the game round is complete
Then the player receives a total score for the game round
And the game presents an option to continue playing or quit