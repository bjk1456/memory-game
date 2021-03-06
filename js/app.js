/*
 * Create a list that holds all of your cards
 */
let restart = document.getElementsByClassName("restart");
let deck = document.getElementsByClassName("deck")[0];
let cards = deck.getElementsByTagName("li");
let openedCards = [];
let movesElement = document.getElementsByClassName("moves")[0];
let numMoves = 0;
let finishedGame = document.getElementById("finishedGame");
let time;
restart[0].addEventListener("click", resetBoard);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
var shuffle = (array) => {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var touchCard = (card) => {
    let currentCardElem = card.getElementsByTagName("i")[0];
    if (!currentCardElem.parentElement.className.includes("match")) {
        if (openedCards.length == 0) {
            flipFrstCard(card);
        } else if (openedCards.length == 1) {
            let openedCard = openedCards.pop();
            let openedCardElem = openedCard.getElementsByTagName("i")[0];
            if ((openedCardElem.getBoundingClientRect().x == currentCardElem.getBoundingClientRect().x) &&
                (openedCardElem.getBoundingClientRect().y == currentCardElem.getBoundingClientRect().y)) {
                openedCards.push(openedCard);
                return;
            }
            flipScndCard();
            if (checkCardsDifferentAndMatch(card, openedCard)) {
                handleCardsMatch(card, openedCard);
            } else {
                card.className += " show open";
                setTimeout(function() {
                    card.classList.remove("open", "show");
                    openedCard.classList.remove("open", "show");
                }, 250);
            }
        }
    }
}

var flipFrstCard = (card) => {
    openedCards.push(card);
    card.className += " show open";
}

var flipScndCard = () => {
    numMoves += 1;
    if (numMoves == 9 || numMoves == 16) {
        let stars = document.getElementsByClassName("stars")[0];
        stars.removeChild(stars.getElementsByTagName("li")[0]);
    }
    movesElement.innerHTML = numMoves;
}

var checkCardsDifferentAndMatch = (card, openedCard) => {
    let currentCardElem = card.getElementsByTagName("i")[0];
    let openedCardElem = openedCard.getElementsByTagName("i")[0];
    if (openedCardElem.className == currentCardElem.className &&
        (card.getBoundingClientRect().x != openedCard.getBoundingClientRect().x ||
            card.getBoundingClientRect().y != openedCard.getBoundingClientRect().y)) {
        return true;
    } else {
        return false;
    }
}

var handleCardsMatch = (card, openedCard) => {
  let openedCardElem = openedCard.getElementsByTagName("i")[0];
  let currentCardElem = card.getElementsByTagName("i")[0];
  openedCard.removeEventListener("click", touchCard);
  changeClassNameToMatch(openedCardElem, currentCardElem);

  openedCards.length = 0;
  if (deck.getElementsByClassName("match").length == 16) {
    displayEndOfGame();
  }
}

var changeClassNameToMatch = (openedCardElem, currentCardElem) => {
    openedCardElem.parentElement.classList.remove("open", "show");
    currentCardElem.parentElement.classList.remove("open", "show");
    openedCardElem.parentElement.className += " match";
    currentCardElem.parentElement.className += " match";
}

var displayEndOfGame = () => {
    clearTimeout(time);
    swal(
        `Congrats! You found all the cards. Star Rating: ${
      document.getElementsByClassName("stars")[0].childElementCount
    }
        Time taken: ${document.getElementById("timer").innerHTML}`, {
            buttons: {
                cancel: "No",
                catch: {
                    text: "Play again!",
                    value: "playAgain"
                }
            }
        }
    ).then(value => {
        switch (value) {
            case "playAgain":
                document.location.reload();
                setupBoard();
                break;

            default:
                break;
        }
    });
}

var resetBoard = () => {
    document.location.reload();
    setupBoard();
}

var setUpBoard = () => {
    numMoves = 0;
    cards = shuffle(Array.from(cards));
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    for (const card of cards) {
        card.classList.remove("match", "open", "show");
        card.addEventListener(
            "click",
            function() {
                touchCard(card);
            },
            false
        );
        deck.appendChild(card);
    }
    startTimer();
    movesElement.innerHTML = numMoves;
}

var startTimer = () => {
    time = setTimeout(startTimer, 500);
    minutesSeconds = formatTime()
    seconds = minutesSeconds[0]
    minutes = minutesSeconds[1]
    setTimeBoard(minutes, seconds)
}

var formatTime = () => {
    minutes = parseInt(time / 60, 10)
    seconds = parseInt(time % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return [seconds, minutes]
}

var setTimeBoard = (minutes, seconds) => {
    document.getElementById("timer").innerHTML = `Minutes: ${minutes} Seconds: ${seconds} `;
}