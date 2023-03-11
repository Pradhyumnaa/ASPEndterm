// Javascript for carousel slide - Browse Deck tab
// Adapted from https://www.w3schools.com/howto/howto_js_quotes_slideshow.asp
let slideIndex = 1;
// Variables used to calculate User's final quiz score
let userConfidenceScore = 0;
const maxScorePerCard = 5;

showSlides(slideIndex);

// If the user selects a confidence number less than 3 for a card, then the user does not remember the card well
// This is taken into consideration when implementing the SM2 algorithm
const badQualityThreshold = 3;

function hideAnswer() {
    $('.flashcard-answer').hide();
    $('.flashcard-question').show();
    $('#answer-confidence-section').hide();
    $('#reveal-answer-button').show();
}

function plusSlides(n) {
    hideAnswer();
    showSlides(slideIndex += n);
}

// Function is called when user selects 0 - 5 confidence button during Quiz session
function markCard(confidence) {
    // Get the slide show container
    const slideshowContainer = $(".slideshow-container")[0];
    // Get all the slides of that container element
    const slideElements = $(slideshowContainer).children(".mySlides");
    // Get current slide jquery object
    const currentSlide = $(slideElements[slideIndex - 1]);
    // Extract metadata object out of that element
    const cardInformationElement = currentSlide.children(".sm2-metadata")[0];
    // Get metadata as a String[] from the metadata element
    const cardInformation = $(cardInformationElement).text().split(",");
    // Get card's collection_id
    const cardCollectionInfoElement = currentSlide.children(".flashcard-collection-id")[0];
    const cardCollectionId = parseInt($(cardCollectionInfoElement).text());

    // Split array content to multiple variables
    let sm2Rep = parseInt(cardInformation[0]);
    let sm2Interval = parseFloat(cardInformation[1]);
    let sm2Easiness = parseFloat(cardInformation[2]);
    let sm2NextSchedule = parseInt(cardInformation[3]);
    let flashcardIndex = parseInt(cardInformation[4]);

    // Implementation of SM2 algorithm in JavaScript adapted from below 2 references.
    // Reference: https://super-memory.com/english/ol/sm2.htm
    // Reference: https://github.com/JaDogg/sbx/blob/develop/sbx/core/card.py

    // Using formula from SM2 document to calculate how easy to remember the given card is
    sm2Easiness = sm2Easiness - 0.8 + 0.28 * confidence - 0.02 * confidence * confidence;
    sm2Easiness = Math.max(1.3, sm2Easiness);

    // Increase the successfully repeated streak by 1 if user's confidence is greater than badQualityThreshold
    if (confidence < badQualityThreshold) {
        sm2Rep = 0;
    } else {
        sm2Rep += 1;
    }

    // Using the sm2Rep value (user's success streak) to calculate the interval for re-studying the card
    // If the user remembers the Answer well (high confidence), the interval will be larger
    //      Therefore the user does not need to study this card again very soon
    // If the user does not remember the Answer (low confidence), the card will be scheduled again for the next day
    if (sm2Rep <= 1) {
        sm2Interval = 1;
    } else if (sm2Rep === 2) {
        sm2Interval = 6;
    } else {
        sm2Interval *= sm2Easiness;
    }

    // Calculating when the user needs to study a card again based on SM2Interval
    sm2NextSchedule = nextScheduledDay(sm2Interval);

    // Updating the SM2 state information of a card to the database
    fetch('/saveCardSM2State', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sm2Rep: sm2Rep,
            sm2Easiness: sm2Easiness,
            sm2Interval: sm2Interval,
            sm2NextSchedule: sm2NextSchedule,
            flashcardIndex: flashcardIndex,
            collectionId: cardCollectionId,
            subject: $("#current_subject").text().replace(/\s/g, '')
        })
    }).then(() => {
        // And then update the hidden element with the values, so if user studies for another round
        //  Calculation is correct
        $(cardInformationElement).text(
            "" + sm2Rep + ","
            + sm2Interval + "," + sm2Easiness
            + "," + sm2NextSchedule + ","
            + flashcardIndex
        );
        // Adding card confidence number to total confidence score of Quiz session
        userConfidenceScore += confidence;
        // Show score after all user has studied all cards
        const totalNumOfSlides = parseInt($("#flashcards-length").text());
        if (slideIndex === totalNumOfSlides) {
            let myModal = new bootstrap.Modal(document.getElementById('quizScoreModal'));
            // Calculating result of Quiz session
            let quizResult = Math.floor(userConfidenceScore / (totalNumOfSlides * maxScorePerCard) * 100);
            // Set value of div containing Quiz score
            $('#quiz-score-text').text("" + quizResult + "%");
            // Set value of progress bar
            $('.progress-bar').css('width', '' + quizResult + '%').attr('aria-valuenow', '' + quizResult);
            //Score Description
            if(quizResult >= 80){
                $('#quiz-score-description').text("Great Job!");
            } else if(quizResult >= 50){
                $('#quiz-score-description').text("You Can Do Better!");
            } else{
                $('#quiz-score-description').text("Still got a long way to go!");
            }
            myModal.show();
            // Set total confidence score back to 0
            userConfidenceScore = 0;
        }
        // Go to the next slide.
        plusSlides(1);
    });
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("carousel-dot");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" carousel-active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " carousel-active";
}

// End of Javascript for Carousel

// Function for reveal question/answer button
$(document).on("click", "#reveal-answer-button", function () {
    $('.flashcard-answer').show();
    $('.flashcard-question').hide();
    $('#answer-confidence-section').show();
    $('#reveal-answer-button').hide();
});


// Function to calculate the next scheduled day for a card - given an interval
// Returns a unix timestamp
const nextScheduledDay = (interval) => {
    let start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    // Next scheduled date of card is today's date + interval
    return Math.floor(start.getTime() / 1000 + (Math.floor(interval) * 24 * 60 * 60));
};

