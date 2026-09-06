/* =========================================================
   GCSE HUB — FLASHCARDS VERSION 3
   ========================================================= */

const FLASHCARD_STORAGE_KEY = "gcseHubFlashcardProgress";

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


/* ---------------------------------------------------------
   STORAGE
--------------------------------------------------------- */

function getFlashcardProgress() {

    try {

        return JSON.parse(
            localStorage.getItem(FLASHCARD_STORAGE_KEY) || "{}"
        );

    } catch {

        return {};

    }

}


function saveFlashcardProgress(data) {

    localStorage.setItem(
        FLASHCARD_STORAGE_KEY,
        JSON.stringify(data)
    );

}


function today() {

    return new Date()
        .toISOString()
        .slice(0, 10);

}


function futureDate(days) {

    const d = new Date();

    d.setDate(
        d.getDate() + days
    );

    return d
        .toISOString()
        .slice(0, 10);

}


function getCardProgress(id) {

    const all = getFlashcardProgress();

    return all[id] || {

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


/* ---------------------------------------------------------
   SPACED REPETITION
--------------------------------------------------------- */

function updateProgress(card, rating) {

    const all = getFlashcardProgress();

    const p = all[card.id] || {

        attempts: 0,
        correct: 0,
        wrong: 0,
        almost: 0,

        streak: 0,

        mastered: false,

        lastReviewed: null,
        nextReview: null

    };


    p.attempts++;

    p.lastReviewed = today();


    if (rating === "correct") {

        p.correct++;

        p.streak++;


        const intervals = [
            1,
            3,
            7,
            14,
            30
        ];


        const interval =
            intervals[
                Math.min(
                    p.streak - 1,
                    intervals.length - 1
                )
            ];


        p.nextReview =
            futureDate(interval);


        if (p.streak >= 4) {

            p.mastered = true;

        }

    }


    if (rating === "almost") {

        p.almost++;

        p.nextReview =
            futureDate(1);

    }


    if (rating === "wrong") {

        p.wrong++;

        p.streak = 0;

        p.mastered = false;

        p.nextReview =
            today();

    }


    all[card.id] = p;

    saveFlashcardProgress(all);

}


/* ---------------------------------------------------------
   STUDENT DATA
--------------------------------------------------------- */

function getStudentCards() {

    if (!selectedSubject) {
        return [];
    }


    const data = load();


    const board =
        data.boards[selectedSubject];

    const level =
        data.levels[selectedSubject];


    return FLASHCARDS.filter(card => {

        return (

            card.subject === selectedSubject

            &&

            card.board === board

            &&

            (
                !card.level
                ||
                card.level === level
            )

            &&

            (
                selectedTopic === "all"
                ||
                card.topic === selectedTopic
            )

        );

    });

}


/* ---------------------------------------------------------
   SPECIAL MODES
--------------------------------------------------------- */

function getWeakCards() {

    return getStudentCards()
        .filter(card => {

            const p =
                getCardProgress(card.id);

            if (p.attempts === 0) {
                return false;
            }

            return (

                p.wrong > 0

                ||

                p.almost > 0

                ||

                (
                    p.correct / p.attempts
                    < 0.75
                )

            );

        });

}


function getDueCards() {

    const currentDay =
        today();

    return getStudentCards()
        .filter(card => {

            const p =
                getCardProgress(card.id);

            return (

                p.nextReview
                &&
                p.nextReview <= currentDay

            );

        });

}


/* ---------------------------------------------------------
   SUBJECTS
--------------------------------------------------------- */

function renderSubjects() {

    const data = load();

    const grid =
        document.getElementById(
            "subjectGrid"
        );

    grid.innerHTML = "";


    data.subjects.forEach(id => {

        const subject =
            SUBJECTS[id];

        if (!subject) {
            return;
        }


        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "subject-select";


        const board =
            data.boards[id]
            ||
            (
                subject.boards
                ? subject.boards[0]
                : ""
            );


        const level =
            subject.levels &&
            subject.levels.length
                ? data.levels[id]
                : "";


        button.innerHTML = `

            <span class="subject-select-icon">
                ${subject.icon}
            </span>

            <span class="subject-select-name">
                ${subject.name}
            </span>

            <span class="subject-select-info">
                ${board}
                ${level ? ` • ${level}` : ""}
            </span>

        `;


        if (id === data.currentSubject) {

            button.classList.add(
                "selected"
            );

            selectedSubject = id;

        }


        button.onclick = () => {

            selectedSubject = id;


            grid
                .querySelectorAll(
                    ".subject-select"
                )
                .forEach(button => {

                    button.classList.remove(
                        "selected"
                    );

                });


            button.classList.add(
                "selected"
            );


            loadTopics();

            updateStats();

        };


        grid.appendChild(button);

    });


    loadTopics();

}


/* ---------------------------------------------------------
   TOPICS
--------------------------------------------------------- */

function loadTopics() {

    const select =
        document.getElementById("topic");


    select.innerHTML = `

        <option value="all">
            All available topics
        </option>

    `;


    if (!selectedSubject) {
        return;
    }


    const data = load();

    const board =
        data.boards[selectedSubject];

    const level =
        data.levels[selectedSubject];


    const topics = [

        ...new Set(

            FLASHCARDS
                .filter(card => {

                    return (

                        card.subject === selectedSubject

                        &&

                        card.board === board

                        &&

                        (
                            !card.level
                            ||
                            card.level === level
                        )

                    );

                })

                .map(card => card.topic)

        )

    ];


    topics.forEach(topic => {

        const option =
            document.createElement("option");

        option.value = topic;

        option.textContent = topic;

        select.appendChild(option);

    });

}


/* ---------------------------------------------------------
   STATISTICS
--------------------------------------------------------- */

function updateStats() {

    const progress =
        getFlashcardProgress();


    let reviewed = 0;
    let mastered = 0;

    let attempts = 0;
    let correctAnswers = 0;

    let due = 0;


    Object.values(progress)
        .forEach(p => {

            attempts +=
                p.attempts || 0;

            correctAnswers +=
                p.correct || 0;


            if (p.attempts > 0) {
                reviewed++;
            }


            if (p.mastered) {
                mastered++;
            }


            if (
                p.nextReview
                &&
                p.nextReview <= today()
            ) {

                due++;

            }

        });


    if (selectedSubject) {

        due =
            getDueCards().length;

    }


    document.getElementById(
        "statReviewed"
    ).textContent = reviewed;


    document.getElementById(
        "statMastered"
    ).textContent = mastered;


    document.getElementById(
        "statAccuracy"
    ).textContent =

        (
            attempts
                ? Math.round(
                    correctAnswers
                    /
                    attempts
                    *
                    100
                )
                : 0
        )
        + "%";


    document.getElementById(
        "statDue"
    ).textContent = due;

}


/* ---------------------------------------------------------
   MODE BUTTONS
--------------------------------------------------------- */

document
    .querySelectorAll(".special-mode")
    .forEach(button => {

        button.onclick = () => {

            selectedMode =
                button.dataset.mode;


            document
                .querySelectorAll(
                    ".special-mode"
                )
                .forEach(other => {

                    other.classList.remove(
                        "selected"
                    );

                });


            button.classList.add(
                "selected"
            );


            updateStats();

        };

    });


/* ---------------------------------------------------------
   CARD COUNT
--------------------------------------------------------- */

document
    .querySelectorAll("[data-number]")
    .forEach(button => {

        button.onclick = () => {

            selectedNumber =
                Number(
                    button.dataset.number
                );


            document
                .querySelectorAll(
                    "[data-number]"
                )
                .forEach(other => {

                    other.classList.remove(
                        "selected"
                    );

                });


            button.classList.add(
                "selected"
            );

        };

    });


/* ---------------------------------------------------------
   START SESSION
--------------------------------------------------------- */

document
    .getElementById("startButton")
    .onclick = () => {

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


        selectedTopic =
            document.getElementById(
                "topic"
            ).value;


        let pool;


        if (selectedMode === "weak") {

            pool = getWeakCards();

        }

        else if (selectedMode === "due") {

            pool = getDueCards();

        }

        else {

            pool = getStudentCards();

        }


        if (!pool.length) {

            if (
                selectedMode === "weak"
            ) {

                message.textContent =
                    "No weak cards yet — try a normal session first.";

            }

            else if (
                selectedMode === "due"
            ) {

                message.textContent =
                    "Nothing is due yet — keep revising and come back later.";

            }

            else {

                message.textContent =
                    "There are no cards for this selection yet.";

            }


            message.style.display =
                "block";

            return;

        }


        message.style.display =
            "none";


        cards =
            pool
                .sort(
                    () => Math.random() - 0.5
                )
                .slice(
                    0,
                    selectedNumber
                );


        currentCard = 0;

        correct = 0;

        almost = 0;

        wrong = 0;

        sessionXP = 0;


        document.getElementById(
            "setup"
        ).style.display = "none";


        document
            .getElementById("results")
            .classList.remove("active");


        document
            .getElementById("session")
            .classList.add("active");


        const subject =
            SUBJECTS[selectedSubject];


        document.getElementById(
            "sessionSubject"
        ).textContent =

            `${subject.icon} ${subject.name}`;


        document.getElementById(
            "sessionTopic"
        ).textContent =

            selectedMode === "weak"

                ? "🎯 Weak Cards"

                : selectedMode === "due"

                ? "🔄 Due for Review"

                : selectedTopic === "all"

                ? "Mixed topics"

                : selectedTopic;


        showCard();

    };


/* ---------------------------------------------------------
   DISPLAY CARD
--------------------------------------------------------- */

function showCard() {

    const card =
        cards[currentCard];


    document.getElementById(
        "counter"
    ).textContent =

        `${currentCard + 1} / ${cards.length}`;


    document.getElementById(
        "sessionProgress"
    ).style.width =

        (
            currentCard
            /
            cards.length
            *
            100
        )
        + "%";


    document.getElementById(
        "questionTopic"
    ).textContent =

        card.subtopic

            ? `${card.topic} • ${card.subtopic}`

            : card.topic;


    document.getElementById(
        "question"
    ).textContent =
        card.question;


    document.getElementById(
        "answerText"
    ).textContent =
        card.answer;


    document.getElementById(
        "answer"
    ).classList.remove(
        "visible"
    );


    document.getElementById(
        "ratingButtons"
    ).classList.remove(
        "visible"
    );


    document.getElementById(
        "showAnswer"
    ).style.display =
        "inline-block";


    document.getElementById(
        "xpEarned"
    ).textContent = "";

}


/* ---------------------------------------------------------
   SHOW ANSWER
--------------------------------------------------------- */

document
    .getElementById("showAnswer")
    .onclick = () => {

        document
            .getElementById("answer")
            .classList.add("visible");


        document
            .getElementById("ratingButtons")
            .classList.add("visible");


        document
            .getElementById("showAnswer")
            .style.display = "none";

    };


/* ---------------------------------------------------------
   RATE CARD
--------------------------------------------------------- */

document
    .querySelectorAll("[data-rating]")
    .forEach(button => {

        button.onclick = () => {

            const rating =
                button.dataset.rating;


            const card =
                cards[currentCard];


            updateProgress(
                card,
                rating
            );


            let points;


            if (rating === "correct") {

                points = 10;

                correct++;

            }

            else if (rating === "almost") {

                points = 7;

                almost++;

            }

            else {

                points = 3;

                wrong++;

            }


            sessionXP += points;


            /*
             * Use the existing GCSE Hub
             * XP system if available.
             */

            if (
                typeof award === "function"
            ) {

                award(points);

            }


            document.getElementById(
                "xpEarned"
            ).textContent =

                `+${points} ⭐`;


            currentCard++;


            updateStats();


            setTimeout(() => {

                if (
                    currentCard >= cards.length
                ) {

                    finish();

                }

                else {

                    showCard();

                }

            }, 350);

        };

    });


/* ---------------------------------------------------------
   FINISH SESSION
--------------------------------------------------------- */

function finish() {

    document
        .getElementById("session")
        .classList.remove("active");


    document
        .getElementById("results")
        .classList.add("active");


    const percentage =
        Math.round(
            correct
            /
            cards.length
            *
            100
        );


    document.getElementById(
        "score"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "resultCards"
    ).textContent =
        cards.length;


    document.getElementById(
        "resultCorrect"
    ).textContent =
        correct;


    document.getElementById(
        "resultAlmost"
    ).textContent =
        almost;


    document.getElementById(
        "resultXP"
    ).textContent =
        sessionXP + " ⭐";


    document.getElementById(
        "sessionProgress"
    ).style.width =
        "100%";

}


/* ---------------------------------------------------------
   AGAIN
--------------------------------------------------------- */

document
    .getElementById("againButton")
    .onclick = () => {

        document
            .getElementById("results")
            .classList.remove("active");


        document.getElementById(
            "setup"
        ).style.display = "block";


        updateStats();

    };


/* ---------------------------------------------------------
   INITIALISE
--------------------------------------------------------- */

/* ---------------------------------------------------------
   URL PARAMETERS
--------------------------------------------------------- */

const flashcardParams =
    new URLSearchParams(
        window.location.search
    );


const urlSubject =
    flashcardParams.get("subject");


const urlTopic =
    flashcardParams.get("topic");


const urlSubtopic =
    flashcardParams.get("subtopic");


if (urlSubject) {

    selectedSubject =
        urlSubject;

}


renderSubjects();


if (urlTopic) {

    selectedTopic =
        urlTopic;


    const topicSelect =
        document.getElementById(
            "topic"
        );


    if (
        [...topicSelect.options]
            .some(
                option =>
                    option.value === urlTopic
            )
    ) {

        topicSelect.value =
            urlTopic;

    }

}


updateStats();
