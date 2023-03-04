// Integrating summernote
$(document).ready(function () {
    $('.summernote').summernote({
        height: 250,
        toolbar: [
            ['font', ['bold', 'underline']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['view', ['codeview']],
        ],
        callbacks: {
            // callback for pasting text only (no formatting)
            onPaste: function (e) {
              var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
              e.preventDefault();
              bufferText = bufferText.replace(/\r?\n/g, '<br>');
              document.execCommand('insertHtml', false, bufferText);
            }
        }
    });
});


$(document).ready(function () {
    $('#createNewFlashcardButton').click(function (e) {
            e.preventDefault();

            let newFlashcardDiv = document.createElement('div');
            newFlashcardDiv.classList.add('single-card-container', 'mb-4');
            $('<div class="sm2-metadata" style="display: none">0,1,2.5,0</div>')
                .appendTo(newFlashcardDiv);

            // Question editor
            $('<div class="summernote">Question</div>')
                .appendTo(newFlashcardDiv)
                .summernote({
                    height: 250,
                    toolbar: [
                        ['font', ['bold', 'underline']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']],
                        ['view', ['codeview']],
                    ],
                    callbacks: {
                        // callback for pasting text only (no formatting)
                        onPaste: function (e) {
                          var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                          e.preventDefault();
                          bufferText = bufferText.replace(/\r?\n/g, '<br>');
                          document.execCommand('insertHtml', false, bufferText);
                        }
                    }
                });
            // Answer editor
            $('<div class="summernote">Answer</div>')
                .appendTo(newFlashcardDiv)
                .summernote({
                    height: 250,
                    toolbar: [
                        ['font', ['bold', 'underline']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']],
                        ['view', ['codeview']],
                    ],
                    callbacks: {
                        // callback for pasting text only (no formatting)
                        onPaste: function (e) {
                          var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                          e.preventDefault();
                          bufferText = bufferText.replace(/\r?\n/g, '<br>');
                          document.execCommand('insertHtml', false, bufferText);
                        }
                    }
                });

            // Delete button
            const deleteBtnSVG = '<svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" width=\"16\" height=\"16\" fill=\"currentColor\"\r\n class=\"bi bi-trash3-fill\" viewBox=\"0 0 16 16\">\r\n                                <path d=\"M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z\"\/>\r\n <\/svg>';
            let deleteCardButton = document.createElement('div');
            $('<button type="button" class="btn btn-danger delete-card-btn"></button>')
                .html(deleteBtnSVG).appendTo(deleteCardButton);
            // Append delete button to new flashcard div
            newFlashcardDiv.append(deleteCardButton);

            // Append the created flashcard to main container
            $('.multi-card-container').append(newFlashcardDiv);
        }
    );
});

// Function to delete flashcard
$(document).on("click", ".delete-card-btn", function () {
    $(this).closest('.single-card-container').remove();
});

// Function to save flashcards
$(document).on("click", ".save-button", function () {
    const flashcards = $('.single-card-container');
    const cards = [];
    const collectionId = parseInt($("#collection_id").text());
    const subject = $("#current_subject").text().replace(/\s/g, '');
    flashcards.each(function (index) {
        // Getting sm2 metadata elements and pushing to card array, so it can be added to the database
        // This ensures that the card scheduling state remains intact
        const sm2MetadataElement = $(this).children('.sm2-metadata')[0];
        const sm2Metadata = $(sm2MetadataElement).text().split(",");
        const sm2Rep = parseInt(sm2Metadata[0]);
        const sm2Interval = parseFloat(sm2Metadata[1]);
        const sm2Easiness = parseFloat(sm2Metadata[2]);
        const sm2NextSchedule = parseInt(sm2Metadata[3]);
        // Getting the HTML inputs from Question and Answer editors and pushing to card array
        const sides = $(this).children('.summernote');
        const question = $(sides[0]).summernote('code');
        const answer = $(sides[1]).summernote('code');
        cards.push([collectionId, question, answer, subject, sm2Rep, sm2Interval, sm2Easiness, sm2NextSchedule]);
    });
    // From https://stackoverflow.com/questions/29775797/fetch-post-json-data
    fetch('/saveCardsOfCollection', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({collection_id: collectionId, cards: cards, subject: subject})
    }).then(() => window.location.reload()); // Refresh page
});
