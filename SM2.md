# Implementation of SM2 algorithm in JavaScript adapted from below 2 references.

* Reference 1: https://super-memory.com/english/ol/sm2.htm
* Reference 2: https://github.com/JaDogg/sbx/blob/develop/sbx/core/card.py

Inside a flashcard collection, the user now has 2 buttons - Study All and Study Scheduled

If the user selects Study Scheduled, the cards will be filtered inside the getQuiz function in the index.js file. Then only the cards that have been scheduled by the SM2 algorithm will be shown.
Else if the user selects Study All option, all the flashcards will be shown
There are 2 routes for this in the index.js file:
'/quiz/:subject/:collection' route is used when user selects Study All in a collection
'/scheduled-quiz/:subject/:collection' is used when user selects Study Scheduled in the collection

The database flashcards table now has 4 extra fields
```
CREATE TABLE IF NOT EXISTS flashcards (
    flashcard_id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    collection_id INTEGER NOT NULL,
    subject_id TEXT NOT NULL,
    sm2_repetitions INTEGER NOT NULL,
    sm2_interval REAL NOT NULL,
    sm2_easiness REAL NOT NULL,
    sm2_next_scheduled INTEGER NOT NULL
);
```

The last 4 fields are new and they hold the SM2 state information.

The actual Super memo 2 implementation functionality is inside the markCard function in the quiz.js file. The confidence parameter is a value from 0 to 5 which the user selects during the Quiz. The user's confidence number is used to calculate sm2 easiness -a formula from the references above was used for this. 
In accordance with the references, I have set the bad quality threshold constant to 3. 
If a user selects a confidence number less than 3, then it is considered bad and the algorithm will schedule this card for the very next day. 
If the user selects a confidence number >= 3, these cards will be scheduled to be studied again after 1 or more days, depending on past confidence levels - this is saved in the sm2_easiness field of the database.

If the user's confidence in a card is higher than the bad quality threshold constant, the variable called sm2Rep is increased by 1.

The sm2Rep number is then used to determine the interval (number of days from today) that the card should be shown next.
The sm2Interval number is then used as an input to the nextScheduledDay function to calculate the day when the card will be shown as a unix timestamp.

The markCard function also contains code to update the database with the new SM2 state information for a card.
Then the hidden div element inside quiz.ejs is updated, so if the user studies the cards again during the same study session, the values have now been updated based on the user's previous confidence number.

Flashcard.ejs and flashcard.js preserve the SM2 information of the cards by keeping them in hidden div elements.


