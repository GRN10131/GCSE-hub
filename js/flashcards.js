/* =========================================================
   GCSE HUB — FLASHCARDS VERSION 4
   Mobile-safe flashcard system
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


/* =========================================================
   STORAGE
   ========================================================= */

function getFlashcardProgress() {
    try {
        return JSON.parse(
            localStorage.getItem(FLASHCARD_STORAGE_KEY) || "{}"
        );
    } catch (error) {
        console.warn("Could not read flashcard progress:", error);
        return {};
    }
}


function saveFlashcardProgress(data) {
    try {
        localStorage.setItem(
            FLASHCARD_STORAGE_KEY,
            JSON.stringify(data)
        );
    } catch (error) {
        console.warn("Could not save flashcard progress:", error);
    }
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


/* =========================================================
   SPACED REPETITION
   ========================================================= */

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
        p.nextReview = today();
    }

    all[card.id] = p;

    saveFlashcardProgress(all);
}


/* =========================================================
   SAFE APP DATA
   ========================================================= */

function getAppData() {

    try {

        if (typeof load !== "function") {
            console.error(
                "GCSE Hub load() function is unavailable."
            );

            return null;
        }

        const data = load();

        if (!data) {
            return null;
        }

        return data;

    } catch (error) {

        console.error(
            "Could not load GCSE Hub student data:",
            error
        );

        return null;
    }
}


/* =========================================================
   STUDENT CARDS
   ========================================================= */

function getStudentCards() {

    if (!selectedSubject) {
        return [];
    }

    if (
        typeof FLASHCARDS === "undefined" ||
        !Array.isArray(FLASHCARDS)
    ) {

        console.error(
            "FLASHCARDS data could not be found."
        );

        return [];
    }

    const data = getAppData();

    if (!data) {
        return [];
    }

    const board =
        data.boards
            ? data.boards[selectedSubject]
            : null;

    const level =
        data.levels
            ? data.levels[selectedSubject]
            : null;

    return FLASHCARDS.filter(card => {

        if (
            card.subject !== selectedSubject
        ) {
            return false;
        }

        if (
            board &&
            card.board &&
            card.board !== board
        ) {
            return false;
        }

        /*
         * Cards without a level are available
         * to both Foundation and Higher.
         *
         * Higher students also receive Higher cards.
         */
        if (card.level) {

            if (
                card.level === "Higher" &&
                level !== "Higher"
            ) {
                return false;
            }

            if (
                card.level === "Foundation" &&
                level !== "Foundation" &&
                level !== "Higher"
            ) {
                return false;
            }
        }

        if (
            selectedTopic !== "all" &&
            card.topic !== selectedTopic
        ) {
            return false;
        }

        return true;

    });
}


/* =========================================================
   SPECIAL MODES
   ========================================================= */

function getWeakCards() {

    return getStudentCards()
        .filter(card => {

            const p =
                getCardProgress(card.id);

            if (p.attempts === 0) {
                return false;
            }

            return (
                p.wrong > 0 ||
                p.almost > 0 ||
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
                p.nextReview &&
                p.nextReview <= currentDay
            );
        });
}


/* =========================================================
   SUBJECTS
   ========================================================= */

function renderSubjects() {

    const grid =
        document.getElementById(
            "subjectGrid"
        );

    if (!grid) {
        return;
    }

    const data =
        getAppData();

    if (!data || !Array.isArray(data.subjects)) {

        grid.innerHTML = `
            <p>
                Unable to load your subjects.
                Please return to the dashboard and try again.
            </p>
        `;

        return;
    }

    grid.innerHTML = "";

    /*
     * If a subject was supplied through the URL,
     * keep it instead of overwriting it.
     */
    const urlSubject =
        selectedSubject;

    data.subjects.forEach(id => {

        const subject =
            typeof SUBJECTS !== "undefined"
                ? SUBJECTS[id]
                : null;

        if (!subject) {
            return;
        }

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "subject-select";

        const board =
            data.boards &&
            data.boards[id]
                ? data.boards[id]
                : (
                    subject.boards
                        ? subject.boards[0]
                        : ""
                );

        const level =
            subject.levels &&
            subject.levels.length &&
            data.levels
                ? data.levels[id]
                : "";

        button.innerHTML = `

            <span class="subject-select-icon">
                ${subject.icon || "📚"}
            </span>

            <span class="subject-select-name">
                ${subject.name}
            </span>

            <span class="subject-select-info">
                ${board || ""}
                ${level ? ` • ${level}` : ""}
            </span>

        `;

        if (
            id === urlSubject
        ) {

            button.classList.add(
                "selected"
            );
        }

        button.addEventListener(
            "click",
            function () {

                selectedSubject = id;

                grid
                    .querySelectorAll(
                        ".subject-select"
                    )
                    .forEach(other => {

                        other.classList.remove(
                            "selected"
                        );

                    });

                button.classList.add(
                    "selected"
                );

                selectedTopic = "all";

                loadTopics();

                updateStats();
            }
        );

        grid.appendChild(button);

    });

    /*
     * If no URL subject exists, use the
     * student's current subject.
     */
    if (!selectedSubject) {

        const current =
            data.currentSubject;

        if (current) {

            selectedSubject =
                current;

            const matching =
                grid.querySelector(
                    ".subject-select"
                );

            grid
                .querySelectorAll(
                    ".subject-select"
                )
                .forEach(button => {

                    const name =
                        button.querySelector(
                            ".subject-select-name"
                        );

                    if (
                        name &&
                        typeof SUBJECTS !== "undefined" &&
                        SUBJECTS[current] &&
                        name.textContent ===
                            SUBJECTS[current].name
                    ) {

                        button.classList.add(
                            "selected"
                        );

                    }

                });
        }
    }

    loadTopics();
}


/* =========================================================
   TOPICS
   ========================================================= */

function loadTopics() {

    const select =
        document.getElementById(
            "topic"
        );

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="all">
            All available topics
        </option>
    `;

    if (!selectedSubject) {
        return;
    }

    if (
        typeof FLASHCARDS === "undefined" ||
        !Array.isArray(FLASHCARDS)
    ) {
        return;
    }

    const data =
        getAppData();

    if (!data) {
        return;
    }

    const board =
        data.boards
            ? data.boards[selectedSubject]
            : null;

    const level =
        data.levels
            ? data.levels[selectedSubject]
            : null;

    const topics = [

        ...new Set(

            FLASHCARDS

                .filter(card => {

                    if (
                        card.subject !==
                        selectedSubject
                    ) {
                        return false;
                    }

                    if (
                        board &&
                        card.board &&
                        card.board !== board
                    ) {
                        return false;
                    }

                    if (card.level) {

                        if (
                            card.level === "Higher" &&
                            level !== "Higher"
                        ) {
                            return false;
                        }

                        if (
                            card.level === "Foundation" &&
                            level !== "Foundation" &&
                            level !== "Higher"
                        ) {
                            return false;
                        }
                    }

                    return true;

                })

                .map(card => card.topic)

                .filter(Boolean)

        )

    ];

    topics.forEach(topic => {

        const option =
            document.createElement("option");

        option.value = topic;

        option.textContent = topic;

        select.appendChild(option);

    });

    /*
     * Restore the selected topic if it exists.
     */
    if (
        [...select.options]
            .some(
                option =>
                    option.value ===
                    selectedTopic
            )
    ) {

        select.value =
            selectedTopic;

    } else {

        selectedTopic = "all";

        select.value = "all";
    }
}


/* =========================================================
   STATISTICS
   ========================================================= */

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

        });

    /*
     * When a subject is selected,
     * show due cards for that subject.
     */
    if (selectedSubject) {

        due =
            getDueCards().length;
    }

    const reviewedElement =
        document.getElementById(
            "statReviewed"
        );

    const masteredElement =
        document.getElementById(
            "statMastered"
        );

    const accuracyElement =
        document.getElementById(
            "statAccuracy"
        );

    const dueElement =
        document.getElementById(
            "statDue"
        );

    if (reviewedElement) {
        reviewedElement.textContent =
            reviewed;
    }

    if (masteredElement) {
        masteredElement.textContent =
            mastered;
    }

    if (accuracyElement) {

        accuracyElement.textContent =

            (
                attempts
                    ? Math.round(
                        correctAnswers /
                        attempts *
                        100
                    )
                    : 0
            ) + "%";
    }

    if (dueElement) {
        dueElement.textContent =
            due;
    }
}


/* =========================================================
   SETUP MESSAGE
   ========================================================= */

function showSetupMessage(text) {

    const message =
        document.getElementById(
            "setupMessage"
        );

    if (!message) {
        return;
    }

    message.textContent =
        text;

    message.style.display =
        "block";
}


function hideSetupMessage() {

    const message =
        document.getElementById(
            "setupMessage"
        );

    if (!message) {
        return;
    }

    message.textContent = "";

    message.style.display =
        "none";
}


/* =========================================================
   START SESSION
   ========================================================= */

function startSession() {

    console.log(
        "GCSE Hub: Start Revision clicked."
    );

    if (!selectedSubject) {

        showSetupMessage(
            "Please choose a subject first."
        );

        return;
    }

    const topicSelect =
        document.getElementById(
            "topic"
        );

    if (topicSelect) {

        selectedTopic =
            topicSelect.value;
    }

    let pool = [];

    if (
        selectedMode === "weak"
    ) {

        pool =
            getWeakCards();

    }

    else if (
        selectedMode === "due"
    ) {

        pool =
            getDueCards();

    }

    else {

        pool =
            getStudentCards();
    }

    if (!pool.length) {

        if (
            selectedMode === "weak"
        ) {

            showSetupMessage(
                "No weak cards yet — try a normal session first."
            );

        }

        else if (
            selectedMode === "due"
        ) {

            showSetupMessage(
                "Nothing is due yet — keep revising and come back later."
            );

        }

        else {

            showSetupMessage(
                "There are no cards for this selection yet."
            );
        }

        return;
    }

    hideSetupMessage();

    /*
     * Shuffle without modifying the original
     * FLASHCARDS array.
     */
    cards =
        [...pool]
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

    const setup =
        document.getElementById(
            "setup"
        );

    const session =
        document.getElementById(
            "session"
        );

    const results =
        document.getElementById(
            "results"
        );

    if (!setup || !session || !results) {

        console.error(
            "Flashcard session elements could not be found."
        );

        showSetupMessage(
            "The revision session could not be opened. Please refresh the page."
        );

        return;
    }

    setup.style.display =
        "none";

    results.classList.remove(
        "active"
    );

    session.classList.add(
        "active"
    );

    const subject =
        typeof SUBJECTS !== "undefined"
            ? SUBJECTS[selectedSubject]
            : null;

    const sessionSubject =
        document.getElementById(
            "sessionSubject"
        );

    if (sessionSubject) {

        sessionSubject.textContent =

            subject
                ? `${subject.icon || "📚"} ${subject.name}`
                : selectedSubject;
    }

    const sessionTopic =
        document.getElementById(
            "sessionTopic"
        );

    if (sessionTopic) {

        sessionTopic.textContent =

            selectedMode === "weak"

                ? "🎯 Weak Cards"

                : selectedMode === "due"

                ? "🔄 Due for Review"

                : selectedTopic === "all"

                ? "Mixed topics"

                : selectedTopic;
    }

    showCard();
}


/* =========================================================
   DISPLAY CARD
   ========================================================= */

function showCard() {

    if (
        !cards.length ||
        currentCard >= cards.length
    ) {
        return;
    }

    const card =
        cards[currentCard];

    const counter =
        document.getElementById(
            "counter"
        );

    if (counter) {

        counter.textContent =
            `${currentCard + 1} / ${cards.length}`;
    }

    const progressBar =
        document.getElementById(
            "sessionProgress"
        );

    if (progressBar) {

        progressBar.style.width =

            (
                currentCard /
                cards.length *
                100
            ) + "%";
    }

    const questionTopic =
        document.getElementById(
            "questionTopic"
        );

    if (questionTopic) {

        questionTopic.textContent =

            card.subtopic
                ? `${card.topic} • ${card.subtopic}`
                : card.topic || "";
    }

    const question =
        document.getElementById(
            "question"
        );

    if (question) {

        question.textContent =
            card.question || "";
    }

    const answerText =
        document.getElementById(
            "answerText"
        );

    if (answerText) {

        answerText.textContent =
            card.answer || "";
    }

    const answer =
        document.getElementById(
            "answer"
        );

    if (answer) {

        answer.classList.remove(
            "visible"
        );
    }

    const ratingButtons =
        document.getElementById(
            "ratingButtons"
        );

    if (ratingButtons) {

        ratingButtons.classList.remove(
            "visible"
        );
    }

    const showAnswer =
        document.getElementById(
            "showAnswer"
        );

    if (showAnswer) {

        showAnswer.style.display =
            "inline-block";

        showAnswer.disabled =
            false;
    }

    const xpEarned =
        document.getElementById(
            "xpEarned"
        );

    if (xpEarned) {

        xpEarned.textContent = "";
    }
}


/* =========================================================
   SHOW ANSWER
   ========================================================= */

function showAnswer() {

    const answer =
        document.getElementById(
            "answer"
        );

    const ratingButtons =
        document.getElementById(
            "ratingButtons"
        );

    const showAnswerButton =
        document.getElementById(
            "showAnswer"
        );

    if (answer) {

        answer.classList.add(
            "visible"
        );
    }

    if (ratingButtons) {

        ratingButtons.classList.add(
            "visible"
        );
    }

    if (showAnswerButton) {

        showAnswerButton.style.display =
            "none";
    }
}


/* =========================================================
   RATE CARD
   ========================================================= */

function rateCard(rating) {

    if (
        !cards.length ||
        !cards[currentCard]
    ) {
        return;
    }

    const card =
        cards[currentCard];

    updateProgress(
        card,
        rating
    );

    let points = 0;

    if (
        rating === "correct"
    ) {

        points = 10;
        correct++;
    }

    else if (
        rating === "almost"
    ) {

        points = 7;
        almost++;
    }

    else {

        points = 3;
        wrong++;
    }

    sessionXP += points;

    /*
     * Use GCSE Hub's global XP system
     * if available.
     */
    try {

        if (
            typeof award === "function"
        ) {

            award(points);
        }

    } catch (error) {

        console.warn(
            "XP award failed:",
            error
        );
    }

    const xpEarned =
        document.getElementById(
            "xpEarned"
        );

    if (xpEarned) {

        xpEarned.textContent =
            `+${points} ⭐`;
    }

    /*
     * Prevent double tapping while the
     * next card is loading.
     */
    document
        .querySelectorAll(
            "[data-rating]"
        )
        .forEach(button => {

            button.disabled = true;

        });

    currentCard++;

    updateStats();

    setTimeout(() => {

        if (
            currentCard >= cards.length
        ) {

            finish();

        }

        else {

            document
                .querySelectorAll(
                    "[data-rating]"
                )
                .forEach(button => {

                    button.disabled = false;

                });

            showCard();
        }

    }, 350);
}


/* =========================================================
   FINISH SESSION
   ========================================================= */

function finish() {

    const session =
        document.getElementById(
            "session"
        );

    const results =
        document.getElementById(
            "results"
        );

    if (session) {

        session.classList.remove(
            "active"
        );
    }

    if (results) {

        results.classList.add(
            "active"
        );
    }

    const percentage =
        cards.length
            ? Math.round(
                correct /
                cards.length *
                100
            )
            : 0;

    const score =
        document.getElementById(
            "score"
        );

    if (score) {

        score.textContent =
            percentage + "%";
    }

    const resultCards =
        document.getElementById(
            "resultCards"
        );

    if (resultCards) {

        resultCards.textContent =
            cards.length;
    }

    const resultCorrect =
        document.getElementById(
            "resultCorrect"
        );

    if (resultCorrect) {

        resultCorrect.textContent =
            correct;
    }

    const resultAlmost =
        document.getElementById(
            "resultAlmost"
        );

    if (resultAlmost) {

        resultAlmost.textContent =
            almost;
    }

    const resultXP =
        document.getElementById(
            "resultXP"
        );

    if (resultXP) {

        resultXP.textContent =
            sessionXP + " ⭐";
    }

    const progressBar =
        document.getElementById(
            "sessionProgress"
        );

    if (progressBar) {

        progressBar.style.width =
            "100%";
    }

    updateStats();
}


/* =========================================================
   AGAIN
   ========================================================= */

function reviseAgain() {

    const results =
        document.getElementById(
            "results"
        );

    const setup =
        document.getElementById(
            "setup"
        );

    if (results) {

        results.classList.remove(
            "active"
        );
    }

    if (setup) {

        setup.style.display =
            "block";
    }

    updateStats();
}


/* =========================================================
   INITIALISE EVERYTHING
   ========================================================= */

function initialiseFlashcards() {

    console.log(
        "GCSE Hub: Initialising flashcards..."
    );

    /*
     * Make sure the flashcard data exists.
     */
    if (
        typeof FLASHCARDS === "undefined"
    ) {

        console.error(
            "FLASHCARDS is not loaded. Check flashcard-data.js."
        );

        showSetupMessage(
            "Flashcard data could not be loaded. Please refresh the page."
        );

        return;
    }

    /*
     * -------------------------------------------------------
     * URL PARAMETERS
     * -------------------------------------------------------
     */

    const flashcardParams =
        new URLSearchParams(
            window.location.search
        );

    const urlSubject =
        flashcardParams.get(
            "subject"
        );

    const urlTopic =
        flashcardParams.get(
            "topic"
        );


    if (urlSubject) {

        selectedSubject =
            urlSubject;
    }


    /*
     * -------------------------------------------------------
     * SUBJECT BUTTONS
     * -------------------------------------------------------
     */

    renderSubjects();


    /*
     * -------------------------------------------------------
     * TOPIC
     * -------------------------------------------------------
     */

    const topicSelect =
        document.getElementById(
            "topic"
        );

    if (topicSelect) {

        topicSelect.addEventListener(
            "change",
            function () {

                selectedTopic =
                    this.value;

                updateStats();

            }
        );
    }


    if (urlTopic) {

        selectedTopic =
            urlTopic;

        if (topicSelect) {

            if (
                [...topicSelect.options]
                    .some(
                        option =>
                            option.value ===
                            urlTopic
                    )
            ) {

                topicSelect.value =
                    urlTopic;

            }

        }
    }


    /*
     * -------------------------------------------------------
     * MODE BUTTONS
     * -------------------------------------------------------
     */

    document
        .querySelectorAll(
            ".special-mode"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    selectedMode =
                        this.dataset.mode;

                    document
                        .querySelectorAll(
                            ".special-mode"
                        )
                        .forEach(other => {

                            other.classList.remove(
                                "selected"
                            );

                        });

                    this.classList.add(
                        "selected"
                    );

                    updateStats();

                }
            );

        });


    /*
     * -------------------------------------------------------
     * CARD COUNT
     * -------------------------------------------------------
     */

    document
        .querySelectorAll(
            "[data-number]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    selectedNumber =
                        Number(
                            this.dataset.number
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

                    this.classList.add(
                        "selected"
                    );

                }
            );

        });


    /*
     * -------------------------------------------------------
     * START BUTTON
     * -------------------------------------------------------
     */

    const startButton =
        document.getElementById(
            "startButton"
        );

    if (startButton) {

        startButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                startSession();

            }
        );

    } else {

        console.error(
            "Start Revision button was not found."
        );
    }


    /*
     * -------------------------------------------------------
     * SHOW ANSWER
     * -------------------------------------------------------
     */

    const showAnswerButton =
        document.getElementById(
            "showAnswer"
        );

    if (showAnswerButton) {

        showAnswerButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showAnswer();

            }
        );

    }


    /*
     * -------------------------------------------------------
     * RATING BUTTONS
     * -------------------------------------------------------
     */

    document
        .querySelectorAll(
            "[data-rating]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    rateCard(
                        this.dataset.rating
                    );

                }
            );

        });


    /*
     * -------------------------------------------------------
     * AGAIN BUTTON
     * -------------------------------------------------------
     */

    const againButton =
        document.getElementById(
            "againButton"
        );

    if (againButton) {

        againButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                reviseAgain();

            }
        );

    }


    /*
     * -------------------------------------------------------
     * INITIAL STATS
     * -------------------------------------------------------
     */

    updateStats();

    console.log(
        "GCSE Hub: Flashcards ready."
    );
}


/* =========================================================
   WAIT FOR PAGE
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseFlashcards
    );

} else {

    initialiseFlashcards();

}
