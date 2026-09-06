/* =========================================================
   GCSE HUB — FLASHCARD ENGINE
   VERSION 2
   ========================================================= */


/* =========================================================
   STATE
   ========================================================= */

let selectedSubject = null;

let selectedTopic = "all";

let selectedNumber = 10;

let selectedMode = "normal";

let cards = [];

let currentCard = 0;

let correct = 0;

let almost = 0;

let wrong = 0;

let sessionXP = 0;


/* =========================================================
   STORAGE
   ========================================================= */

const FLASHCARD_STORAGE_KEY =
    "gcseHubFlashcardProgress";


function getFlashProgress() {

    try {

        return JSON.parse(
            localStorage.getItem(
                FLASHCARD_STORAGE_KEY
            )
        ) || {};

    } catch {

        return {};

    }

}


function saveFlashProgress(progress) {

    localStorage.setItem(
        FLASHCARD_STORAGE_KEY,
        JSON.stringify(progress)
    );

}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function today() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


function daysFromNow(days) {

    const date =
        new Date();

    date.setDate(
        date.getDate() + days
    );

    return date
        .toISOString()
        .split("T")[0];

}


/* =========================================================
   CARD PROGRESS
   =========================================================

   Each card can look like:

   {
       attempts: 4,
       correct: 3,
       wrong: 1,
       almost: 0,
       streak: 2,
       mastered: true,
       lastReviewed: "...",
       nextReview: "..."
   }

   ========================================================= */

function getCardProgress(id) {

    const progress =
        getFlashProgress();

    return progress[id] || {

        attempts: 0,

        correct: 0,

        wrong: 0,

        almost: 0,

        streak: 0,

        mastered: false,

        lastReviewed: null,

        nextReview: null

    };

}


/* =========================================================
   UPDATE CARD PROGRESS
   ========================================================= */

function updateCardProgress(
    card,
    rating
) {

    const progress =
        getFlashProgress();


    const current =
        progress[card.id] || {

            attempts: 0,
            correct: 0,
            wrong: 0,
            almost: 0,
            streak: 0,
            mastered: false,
            lastReviewed: null,
            nextReview: null

        };


    current.attempts++;


    current.lastReviewed =
        today();


    if (
        rating === "correct"
    ) {

        current.correct++;

        current.streak++;

        /*
           Review intervals increase
           as the student succeeds.
        */

        if (
            current.streak === 1
        ) {

            current.nextReview =
                daysFromNow(1);

        } else if (
            current.streak === 2
        ) {

            current.nextReview =
                daysFromNow(3);

        } else if (
            current.streak === 3
        ) {

            current.nextReview =
                daysFromNow(7);

        } else if (
            current.streak === 4
        ) {

            current.nextReview =
                daysFromNow(14);

        } else {

            current.nextReview =
                daysFromNow(30);

        }


        /*
           Four successful attempts
           = mastered.
        */

        if (
            current.streak >= 4
        ) {

            current.mastered =
                true;

        }

    }


    if (
        rating === "almost"
    ) {

        current.almost++;

        /*
           Don't reset the whole streak,
           but don't advance it either.
        */

        current.nextReview =
            daysFromNow(1);

    }


    if (
        rating === "wrong"
    ) {

        current.wrong++;

        current.streak =
            0;

        current.mastered =
            false;

        /*
           Wrong cards come back soon.
        */

        current.nextReview =
            daysFromNow(0);

    }


    progress[card.id] =
        current;


    saveFlashProgress(
        progress
    );

}


/* =========================================================
   GET ALL CARDS FOR STUDENT
   ========================================================= */

function getAvailableCards() {

    if (!selectedSubject) {
        return [];
    }


    const data =
        load();


    const board =
        data.boards[
            selectedSubject
        ];


    const level =
        data.levels[
            selectedSubject
        ];


    return FLASHCARDS.filter(
        card =>

            card.subject ===
            selectedSubject

            &&

            card.board ===
            board

            &&

            (
                !card.level ||
                card.level === level
            )

            &&

            (
                selectedTopic ===
                "all"

                ||

                card.topic ===
                selectedTopic
            )
    );

}


/* =========================================================
   GET WEAK CARDS
   ========================================================= */

function getWeakCards() {

    return getAvailableCards()
        .filter(
            card => {

                const p =
                    getCardProgress(
                        card.id
                    );


                /*
                   A card becomes weak if:

                   - it has been answered incorrectly
                   - it has been marked almost
                   - it has a low success rate
                */

                if (
                    p.attempts === 0
                ) {

                    return false;

                }


                const accuracy =
                    p.correct /
                    p.attempts;


                return (

                    p.wrong > 0

                    ||

                    p.almost > 0

                    ||

                    accuracy < 0.75

                );

            }
        );

}


/* =========================================================
   GET DUE CARDS
   ========================================================= */

function getDueCards() {

    const todayDate =
        today();


    return getAvailableCards()
        .filter(
            card => {

                const p =
                    getCardProgress(
                        card.id
                    );


                /*
                   Never reviewed cards
                   are not considered due.

                   They belong in normal revision.
                */

                if (
                    !p.nextReview
                ) {

                    return false;

                }


                return (
                    p.nextReview <=
                    todayDate
                );

            }
        );

}


/* =========================================================
   SUBJECTS
   ========================================================= */

function renderSubjects() {

    const data =
        load();


    const grid =
        document.getElementById(
            "subjectGrid"
        );


    grid.innerHTML = "";


    /*
       Use every subject the student
       selected during setup.
    */

    data.subjects.forEach(
        id => {

            const subject =
                SUBJECTS[id];


            if (!subject) {
                return;
            }


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "subject-select";


            const board =
                data.boards[id] ||
                (
                    subject.boards
                    ?
                    subject.boards[0]
                    :
                    ""
                );


            const level =
                subject.levels &&
                subject.levels.length
                    ?
                    data.levels[id]
                    :
                    "";


            button.innerHTML = `

                <span class="subject-select-icon">
                    ${subject.icon}
                </span>

                <span class="subject-select-name">
                    ${subject.name}
                </span>

                <span class="subject-select-info">

                    ${board}

                    ${
                        level
                            ? ` • ${level}`
                            : ""
                    }

                </span>

            `;


            if (
                id ===
                data.currentSubject
            ) {

                button.classList.add(
                    "selected"
                );

                selectedSubject =
                    id;

            }


            button.addEventListener(
                "click",
                () => {

                    selectedSubject =
                        id;


                    grid
                        .querySelectorAll(
                            ".subject-select"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "selected"
                                    )
                        );


                    button.classList.add(
                        "selected"
                    );


                    loadTopics();

                    updateStats();

                }
            );


            grid.appendChild(
                button
            );

        }
    );


    loadTopics();

}


/* =========================================================
   TOPICS
   ========================================================= */

function loadTopics() {

    const topicSelect =
        document.getElementById(
            "topic"
        );


    topicSelect.innerHTML = `

        <option value="all">
            All available topics
        </option>

    `;


    if (!selectedSubject) {
        return;
    }


    const data =
        load();


    const board =
        data.boards[
            selectedSubject
        ];


    const level =
        data.levels[
            selectedSubject
        ];


    const topics = [

        ...new Set(

            FLASHCARDS
                .filter(
                    card =>

                        card.subject ===
                        selectedSubject

                        &&

                        card.board ===
                        board

                        &&

                        (
                            !card.level ||
                            card.level === level
                        )
                )
                .map(
                    card =>
                        card.topic
                )

        )

    ];


    topics.forEach(
        topic => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                topic;


            option.textContent =
                topic;


            topicSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   MODE BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        ".special-mode"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectedMode =
                        button.dataset.mode;


                    document
                        .querySelectorAll(
                            ".special-mode"
                        )
                        .forEach(
                            other =>
                                other.classList
                                    .remove(
                                        "selected"
                                    )
                        );


                    button.classList.add(
                        "selected"
                    );


                    updateStats();

                }
            );

        }
    );


/* =========================================================
   NUMBER BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-number]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectedNumber =
                        Number(
                            button.dataset.number
                        );


                    document
                        .querySelectorAll(
                            "[data-number]"
                        )
                        .forEach(
                            other =>
                                other.classList
                                    .remove(
                                        "selected"
                                    )
                        );


                    button.classList.add(
                        "selected"
                    );

                }
            );

        }
    );


/* =========================================================
   START SESSION
   ========================================================= */

document
    .getElementById(
        "startButton"
    )
    .addEventListener(
        "click",
        startSession
    );


function startSession() {

    const message =
        document.getElementById(
            "setupMessage"
        );


    if (!selectedSubject) {

        message.textContent =
            "Please choose a subject first.";

        message.style.display =
            "block";

        return;

    }


    message.style.display =
        "none";


    selectedTopic =
        document
            .getElementById(
                "topic"
            )
            .value;


    let available;


    if (
        selectedMode ===
        "weak"
    ) {

        available =
            getWeakCards();

    } else if (
        selectedMode ===
        "due"
    ) {

        available =
            getDueCards();

    } else {

        available =
            getAvailableCards();

    }


    if (!available.length) {

        message.textContent =
            selectedMode === "weak"

                ?

                "You don't have any weak cards yet. Complete some normal revision sessions first."

                :

                selectedMode === "due"

                ?

                "You don't have any cards due for review yet. Keep revising and they'll appear here."

                :

                "There aren't any cards available for this selection yet.";

        message.style.display =
            "block";

        return;

    }


    /*
       Prioritise cards that haven't
       been reviewed in normal mode.

       For weak/due modes, randomise
       within the appropriate group.
    */

    available =
        [...available]
            .sort(
                () =>
                    Math.random() -
                    0.5
            );


    cards =
        available.slice(
            0,
            selectedNumber
        );


    currentCard = 0;

    correct = 0;

    almost = 0;

    wrong = 0;

    sessionXP = 0;


    document
        .getElementById(
            "setup"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "results"
        )
        .classList
        .remove(
            "active"
        );


    document
        .getElementById(
            "session"
        )
        .classList
        .add(
            "active"
        );


    const subject =
        SUBJECTS[
            selectedSubject
        ];


    document
        .getElementById(
            "sessionSubject"
        )
        .textContent =
        `${subject.icon} ${subject.name}`;


    document
        .getElementById(
            "sessionTopic"
        )
        .textContent =
        selectedMode === "weak"

            ? "🎯 Weak Cards"

            :

            selectedMode === "due"

            ? "🔄 Due for Review"

            :

            selectedTopic === "all"

            ? "Mixed topics"

            :

            selectedTopic;


    showCard();

}


/* =========================================================
   SHOW CARD
   ========================================================= */

function showCard() {

    const card =
        cards[currentCard];


    document
        .getElementById(
            "counter"
        )
        .textContent =
        `${currentCard + 1} / ${cards.length}`;


    const percentage =
        (
            currentCard /
            cards.length
        ) * 100;


    document
        .getElementById(
            "sessionProgress"
        )
        .style.width =
        percentage + "%";


    document
        .getElementById(
            "questionTopic"
        )
        .textContent =
        card.topic;


    document
        .getElementById(
            "question"
        )
        .textContent =
        card.question;


    document
        .getElementById(
            "answerText"
        )
        .textContent =
        card.answer;


    document
        .getElementById(
            "answer"
        )
        .classList
        .remove(
            "visible"
        );


    document
        .getElementById(
            "ratingButtons"
        )
        .classList
        .remove(
            "visible"
        );


    document
        .getElementById(
            "showAnswer"
        )
        .style.display =
        "block";


    document
        .getElementById(
            "xpEarned"
        )
        .textContent =
        "";

}


/* =========================================================
   SHOW ANSWER
   ========================================================= */

document
    .getElementById(
        "showAnswer"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "answer"
                )
                .classList
                .add(
                    "visible"
                );


            document
                .getElementById(
                    "ratingButtons"
                )
                .classList
                .add(
                    "visible"
                );


            document
                .getElementById(
                    "showAnswer"
                )
                .style.display =
                "none";

        }
    );


/* =========================================================
   RATE CARD
   ========================================================= */

document
    .querySelectorAll(
        "[data-rating]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    rateCard(
                        button.dataset.rating
                    );

                }
            );

        }
    );


function rateCard(rating) {

    const card =
        cards[currentCard];


    /*
       Save permanent card history.
    */

    updateCardProgress(
        card,
        rating
    );


    let points;


    if (
        rating === "correct"
    ) {

        correct++;

        points = 10;

    }


    else if (
        rating === "almost"
    ) {

        almost++;

        points = 7;

    }


    else {

        wrong++;

        points = 3;

    }


    /*
       First attempt bonus.
    */

    const progress =
        getCardProgress(
            card.id
        );


    if (
        progress.attempts === 1
    ) {

        points += 5;

    }


    sessionXP += points;


    /*
       Add XP to global GCSE Hub.
    */

    if (
        typeof award ===
        "function"
    ) {

        award(points);

    }


    document
        .getElementById(
            "xpEarned"
        )
        .textContent =
        `+${points} ⭐`;


    currentCard++;


    updateStats();


    if (
        currentCard >=
        cards.length
    ) {

        setTimeout(
            finishSession,
            450
        );

        return;

    }


    setTimeout(
        showCard,
        450
    );

}


/* =========================================================
   FINISH SESSION
   ========================================================= */

function finishSession() {

    document
        .getElementById(
            "session"
        )
        .classList
        .remove(
            "active"
        );


    document
        .getElementById(
            "results"
        )
        .classList
        .add(
            "active"
        );


    const total =
        cards.length;


    const percentage =
        Math.round(
            (
                correct /
                total
            ) * 100
        );


    document
        .getElementById(
            "score"
        )
        .textContent =
        `${percentage}%`;


    document
        .getElementById(
            "resultCards"
        )
        .textContent =
        total;


    document
        .getElementById(
            "resultCorrect"
        )
        .textContent =
        correct;


    document
        .getElementById(
            "resultAlmost"
        )
        .textContent =
        almost;


    document
        .getElementById(
            "resultXP"
        )
        .textContent =
        `${sessionXP} ⭐`;


    document
        .getElementById(
            "sessionProgress"
        )
        .style.width =
        "100%";

}


/* =========================================================
   CALCULATE GLOBAL STATISTICS
   ========================================================= */

function calculateStats() {

    const progress =
        getFlashProgress();


    const entries =
        Object.values(
            progress
        );


    let reviewed = 0;

    let mastered = 0;

    let correctAnswers = 0;

    let attempts = 0;

    let due = 0;


    entries.forEach(
        p => {

            attempts +=
                p.attempts || 0;


            correctAnswers +=
                p.correct || 0;


            if (
                p.attempts > 0
            ) {

                reviewed++;

            }


            if (
                p.mastered
            ) {

                mastered++;

            }


            if (
                p.nextReview &&
                p.nextReview <= today()
            ) {

                due++;

            }

        }
    );


    const accuracy =
        attempts > 0

            ?

            Math.round(
                (
                    correctAnswers /
                    attempts
                ) * 100
            )

            :

            0;


    return {

        reviewed,
        mastered,
        accuracy,
        due

    };

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStats() {

    const stats =
        calculateStats();


    document
        .getElementById(
            "statReviewed"
        )
        .textContent =
        stats.reviewed;


    document
        .getElementById(
            "statMastered"
        )
        .textContent =
        stats.mastered;


    document
        .getElementById(
            "statAccuracy"
        )
        .textContent =
        `${stats.accuracy}%`;


    /*
       Due count is filtered to the
       selected subject where possible.
    */

    let dueCount =
        stats.due;


    if (
        selectedSubject
    ) {

        dueCount =
            getDueCards().length;

    }


    document
        .getElementById(
            "statDue"
        )
        .textContent =
        dueCount;

}


/* =========================================================
   REVISE AGAIN
   ========================================================= */

document
    .getElementById(
        "againButton"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "results"
                )
                .classList
                .remove(
                    "active"
                );


            document
                .getElementById(
                    "setup"
                )
                .style.display =
                "block";


            updateStats();

        }
    );


/* =========================================================
   INITIALISE
   ========================================================= */

renderSubjects();

updateStats();
