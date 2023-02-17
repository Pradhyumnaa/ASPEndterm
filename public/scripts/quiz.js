// Javascript for carousel slide - Browse Deck tab
// Adapted from https://www.w3schools.com/howto/howto_js_quotes_slideshow.asp
let slideIndex = 1;
showSlides(slideIndex);

function hideAnswer() {
    $('.flashcard-answer').hide();
    $('.flashcard-question').show();
    $('#hide-answer-button').hide();
    $('#reveal-answer-button').show();
}

function plusSlides(n) {
    hideAnswer();
    showSlides(slideIndex += n);
}

function markCard(confidence) {
    // TODO update database, etc
    plusSlides(1);
}

function currentSlide(n) {
    hideAnswer();
    showSlides(slideIndex = n);
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
    $('#hide-answer-button').show();
    $('#reveal-answer-button').hide();
});
$(document).on("click", "#hide-answer-button", function () {
    hideAnswer();
});
