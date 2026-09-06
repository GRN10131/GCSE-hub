/* =========================================================
   GCSE HUB — FLASHCARDS VERSION 5
   Stable subject system + desktop/mobile safe controls
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

let flashcardsInitialised = false;
let ratingLocked = false;


/* =========================================================
   STORAGE
   ========================================================= */

function getFlashcardProgress() {

    try {

        const stored =
            localStorage.getItem(
                FLASHCARD_STORAGE_KEY
            );

        if (!stored) {
            return {};
        }

        const data = JSON.parse(stored);

        return (
            data &&
            typeof data === "object"
        )
            ? data
            : {};

    } catch (error) {

        console.warn(
            "Could not read flashcard progress:",
            error
        );

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

        console.warn(
            "Could not save flashcard progress:",
            error
        );

    }

}


/* =========================================================
   DATES
   ========================================================= */

function today() {

    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");

}


function futureDate(days) {

    const date = new Date();

    date.setDate(
        date.getDate() + days
    );

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");

}


/* =========================================================
   CARD PROGRESS
   ========================================================= */

function defaultCardProgress() {

    return {

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


function getCardProgress(id) {

    const all =
        getFlashcardProgress();

    return all[id]
        ? {
            ...defaultCardProgress(),
            ...all[id]
        }
        : defaultCardProgress();

}


/* =========================================================
   SPACED REPETITION
   ========================================================= */

function updateProgress(card, rating) {

    if (!card || !card.id) {
        return;
    }

    const all =
        getFlashcardProgress();

    const p = {

        ...defaultCardProgress(),

        ...(all[card.id] || {})

    };

    p.attempts++;

    p.lastReviewed =
        today();


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


    else if (rating === "almost") {

        p.almost++;

        p.nextReview =
            futureDate(1);

    }


    else if (rating === "wrong") {

        p.wrong++;

        p.streak = 0;

        p.mastered = false;

        p.nextReview =
            today();

    }


    all[card.id] = p;

    saveFlashcardProgress(all);

}


/* =========================================================
   APP DATA
   ========================================================= */

function getAppData() {

    if (typeof load !== "function") {

        console.error(
            "GCSE Hub load() is unavailable."
        );

        return null;

    }


    try {

        const data = load();

        if (!data) {
            return null;
        }

        return data;

    } catch (error) {

        console.error(
            "Could not load GCSE Hub data:",
            error
        );

        return null;

    }

}


/* =========================================================
   FLASHCARD DATA CHECK
   ========================================================= */

function getFlashcardData() {

    if (
        typeof FLASHCARDS === "undefined"
    ) {

        console.error(
            "FLASHCARDS is not defined."
        );

        return [];

    }


    if (
        !Array.isArray(FLASHCARDS)
    ) {

        console.error(
            "FLASHCARDS exists but is not an array."
        );

        return [];

    }


    return FLASHCARDS;

}


/* =========================================================
   SUBJECT CARD FILTER
   ========================================================= */

function cardMatchesStudent(card) {

    if (!card) {
        return false;
    }

    /*
     * SUBJECT
     *
     * Card data uses lowercase subject IDs
     * such as "biology", while the GCSE Hub
     * may use "Biology".
     *
     * Normalise both sides so the comparison
     * is case-insensitive.
     */

    const cardSubject =
        String(card.subject || "")
            .trim()
            .toLowerCase();

    const studentSubject =
        String(selectedSubject || "")
            .trim()
            .toLowerCase();

    if (
        !studentSubject ||
        cardSubject !== studentSubject
    ) {
        return false;
    }


    /*
     * APP DATA
     */

    const data =
        getAppData();

    if (!data) {
        return false;
    }


    /*
     * Find the student's board and level.
     *
     * This also handles cases where the
     * subject key has different capitalisation.
     */

    function getSubjectSetting(settings) {

        if (
            !settings ||
            typeof settings !== "object"
        ) {
            return null;
        }

        /*
         * First try the exact key.
         */

        if (
            settings[selectedSubject]
        ) {
            return settings[selectedSubject];
        }

        /*
         * Then try a case-insensitive key.
         */

        const key =
            Object.keys(settings).find(
                k =>
                    String(k)
                        .trim()
                        .toLowerCase() ===
                    studentSubject
            );

        return key
            ? settings[key]
            : null;
    }


    const board =
        getSubjectSetting(
            data.boards
        );

    const level =
        getSubjectSetting(
            data.levels
        );


    /*
     * BOARD
     *
     * If a student has a board selected,
     * reject cards belonging to another board.
     *
     * Cards without a board remain usable.
     */

    if (
        board &&
        card.board &&
        String(card.board)
            .trim()
            .toLowerCase() !==
        String(board)
            .trim()
            .toLowerCase()
    ) {
        return false;
    }


    /*
     * LEVEL
     *
     * Cards without a level are available
     * to everyone.
     *
     * Foundation cards are available to
     * Foundation AND Higher students.
     *
     * Higher cards are Higher-only.
     */

    const cardLevel =
        String(card.level || "")
            .trim()
            .toLowerCase();

    const studentLevel =
        String(level || "")
            .trim()
            .toLowerCase();


    if (
        cardLevel === "higher" &&
        studentLevel !== "higher"
    ) {
        return false;
    }


    if (
        cardLevel === "foundation" &&
        studentLevel !== "foundation" &&
        studentLevel !== "higher"
    ) {
        return false;
    }


    /*
     * TOPIC
     */

    if (
        selectedTopic !== "all" &&
        card.topic !== selectedTopic
    ) {
        return false;
    }


    /*
     * CARD PASSES ALL FILTERS
     */

    return true;
}

/* =========================================================
   STUDENT CARDS
   ========================================================= */

function getStudentCards() {

    if (!selectedSubject) {
        return [];
    }


    const data =
        getFlashcardData();


    if (!data.length) {

        console.error(
            "No flashcard data is available."
        );

        return [];

    }


    return data.filter(
        cardMatchesStudent
    );

}


/* =========================================================
   WEAK CARDS
   ========================================================= */

function getWeakCards() {

    return getStudentCards()
        .filter(card => {

            const progress =
                getCardProgress(card.id);


            if (
                progress.attempts === 0
            ) {

                return false;

            }


            const accuracy =
                progress.correct /
                progress.attempts;


            return (

                progress.wrong > 0

                ||

                progress.almost > 0

                ||

                accuracy < 0.75

            );

        });

}


/* =========================================================
   DUE CARDS
   ========================================================= */

function getDueCards() {

    const currentDate =
        today();


    return getStudentCards()
        .filter(card => {

            const progress =
                getCardProgress(card.id);


            return (

                progress.nextReview &&
                progress.nextReview <= currentDate

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

        console.error(
            "subjectGrid was not found."
        );

        return;

    }


    const data =
        getAppData();


    if (!data) {

        grid.innerHTML = `
            <p>
                Unable to load your GCSE Hub data.
                Please refresh the page.
            </p>
        `;

        return;

    }


    if (
        !Array.isArray(data.subjects)
    ) {

        grid.innerHTML = `
            <p>
                No subjects have been selected yet.
                Please return to the dashboard.
            </p>
        `;

        return;

    }


    grid.innerHTML = "";


    /*
     * Only keep selectedSubject if it is
     * actually one of the student's subjects.
     */

    if (
        selectedSubject &&
        !data.subjects.includes(
            selectedSubject
        )
    ) {

        selectedSubject = null;

    }


    /*
     * If there is no URL-selected subject,
     * use the student's current subject.
     */

    if (
        !selectedSubject &&
        data.currentSubject &&
        data.subjects.includes(
            data.currentSubject
        )
    ) {

        selectedSubject =
            data.currentSubject;

    }


    /*
     * Create every subject button.
     */

    data.subjects.forEach(id => {

        const subject =
            typeof SUBJECTS !== "undefined"
                ? SUBJECTS[id]
                : null;


        if (!subject) {

            console.warn(
                "Subject exists in student data but not SUBJECTS:",
                id
            );

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
            data.boards &&
            data.boards[id]
                ? data.boards[id]
                : (
                    Array.isArray(
                        subject.boards
                    ) &&
                    subject.boards.length
                        ? subject.boards[0]
                        : ""
                );


        const level =
            Array.isArray(
                subject.levels
            ) &&
            subject.levels.length &&
            data.levels &&
            data.levels[id]
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
            id === selectedSubject
        ) {

            button.classList.add(
                "selected"
            );

        }


        button.addEventListener(
            "click",
            () => {

                selectedSubject =
                    id;

                selectedTopic =
                    "all";


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


                loadTopics();

                updateStats();

            }
        );


        grid.appendChild(
            button
        );

    });


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


    const data =
        getFlashcardData();


    if (!data.length) {
        return;
    }


    /*
     * Temporarily ignore selectedTopic
     * while finding available topics.
     */

    const previousTopic =
        selectedTopic;


    selectedTopic =
        "all";


    const availableCards =
        data.filter(
            cardMatchesStudent
        );


    selectedTopic =
        previousTopic;


    const topics = [
        ...new Set(
            availableCards
                .map(card => card.topic)
                .filter(Boolean)
        )
    ];


    topics.forEach(topic => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            topic;


        option.textContent =
            topic;


        select.appendChild(
            option
        );

    });


    /*
     * Restore the selected topic
     * if it is still available.
     */

    if (
        topics.includes(
            selectedTopic
        )
    ) {

        select.value =
            selectedTopic;

    }

    else {

        selectedTopic =
            "all";

        select.value =
            "all";

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


    Object.values(progress)
        .forEach(p => {

            const cardAttempts =
                Number(p.attempts) || 0;

            const cardCorrect =
                Number(p.correct) || 0;


            attempts +=
                cardAttempts;


            correctAnswers +=
                cardCorrect;


            if (
                cardAttempts > 0
            ) {

                reviewed++;

            }


            if (
                p.mastered
            ) {

                mastered++;

            }

        });


    let due = 0;


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

function showSetupMessage(message) {

    const element =
        document.getElementById(
            "setupMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.display =
        "block";

}


function hideSetupMessage() {

    const element =
        document.getElementById(
            "setupMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        "";


    element.style.display =
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
                "There are no flashcards available for this subject, board, level or topic."
            );

        }

        return;

    }


    hideSetupMessage();


    /*
     * Make a copy before shuffling.
     * This NEVER modifies FLASHCARDS.
     */

    cards =
        [...pool]
            .sort(
                () =>
                    Math.random() -
                    0.5
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

    ratingLocked = false;


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


    if (
        !setup ||
        !session ||
        !results
    ) {

        console.error(
            "Required flashcard sections were not found."
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


    const showAnswerButton =
        document.getElementById(
            "showAnswer"
        );


    if (showAnswerButton) {

        showAnswerButton.style.display =
            "inline-block";

        showAnswerButton.disabled =
            false;

    }


    const xpEarned =
        document.getElementById(
            "xpEarned"
        );


    if (xpEarned) {

        xpEarned.textContent =
            "";

    }


    ratingLocked =
        false;


    document
        .querySelectorAll(
            "[data-rating]"
        )
        .forEach(button => {

            button.disabled =
                false;

        });

}


/* =========================================================
   SHOW ANSWER
   ========================================================= */

function revealFlashcardAnswer() {

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

    /*
     * Prevent double clicks,
     * especially on mobile.
     */

    if (ratingLocked) {
        return;
    }


    if (
        !cards.length ||
        !cards[currentCard]
    ) {

        return;

    }


    if (
        rating !== "correct" &&
        rating !== "almost" &&
        rating !== "wrong"
    ) {

        return;

    }


    ratingLocked =
        true;


    const card =
        cards[currentCard];


    updateProgress(
        card,
        rating
    );


    let points =
        0;


    if (
        rating === "correct"
    ) {

        points =
            10;

        correct++;

    }

    else if (
        rating === "almost"
    ) {

        points =
            7;

        almost++;

    }

    else {

        points =
            3;

        wrong++;

    }


    sessionXP +=
        points;


    /*
     * Global GCSE Hub XP.
     */

    try {

        if (
            typeof award === "function"
        ) {

            award(points);

        }

    } catch (error) {

        console.warn(
            "Could not award XP:",
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
     * Disable all rating buttons
     * immediately.
     */

    document
        .querySelectorAll(
            "[data-rating]"
        )
        .forEach(button => {

            button.disabled =
                true;

        });


    currentCard++;


    updateStats();


    window.setTimeout(
        () => {

            if (
                currentCard >=
                cards.length
            ) {

                finish();

                return;

            }


            showCard();

        },
        350
    );

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


    ratingLocked =
        false;


    updateStats();

}


/* =========================================================
   RETURN TO SETUP
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


    const session =
        document.getElementById(
            "session"
        );


    if (results) {

        results.classList.remove(
            "active"
        );

    }


    if (session) {

        session.classList.remove(
            "active"
        );

    }


    if (setup) {

        setup.style.display =
            "block";

    }


    cards = [];

    currentCard = 0;

    ratingLocked =
        false;


    updateStats();

}


/* =========================================================
   INITIALISE
   ========================================================= */

function initialiseFlashcards() {

    /*
     * Prevent accidental double initialisation.
     */

    if (flashcardsInitialised) {
        return;
    }


    flashcardsInitialised =
        true;


    console.log(
        "GCSE Hub: Initialising flashcards..."
    );


    /*
     * -------------------------------------------------------
     * URL PARAMETERS
     * -------------------------------------------------------
     */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlSubject =
        params.get(
            "subject"
        );


    const urlTopic =
        params.get(
            "topic"
        );


    if (urlSubject) {

        selectedSubject =
            urlSubject;

    }


    /*
     * -------------------------------------------------------
     * SUBJECTS
     * -------------------------------------------------------
     */

    renderSubjects();


    /*
     * -------------------------------------------------------
     * TOPIC SELECT
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


    /*
     * Restore URL topic AFTER topics
     * have been generated.
     */

    if (urlTopic) {

        if (topicSelect) {

            const topicExists =
                Array.from(
                    topicSelect.options
                )
                .some(
                    option =>
                        option.value ===
                        urlTopic
                );


            if (topicExists) {

                selectedTopic =
                    urlTopic;

                topicSelect.value =
                    urlTopic;

            }

        }

    }


    /*
     * -------------------------------------------------------
     * SPECIAL MODES
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
                        this.dataset.mode ||
                        "normal";


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

                    const number =
                        Number(
                            this.dataset.number
                        );


                    if (
                        Number.isFinite(number) &&
                        number > 0
                    ) {

                        selectedNumber =
                            number;

                    }


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
     * START REVISION
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

                revealFlashcardAnswer();

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
     * AGAIN
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
   PAGE LOAD
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseFlashcards,
        {
            once: true
        }
    );

}

else {

    initialiseFlashcards();

}
