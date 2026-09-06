/* =========================================================
   GCSE HUB — FLASHCARDS
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

let ratingLocked = false;

/* =========================================================
   ENGLISH LITERATURE TEXT SELECTION
   ========================================================= */

const ENGLISH_TEXT_STORAGE_KEY =
    "gcseHubEnglishLiteratureTexts";


const ENGLISH_LITERATURE_OPTIONS = {

    shakespeare: {
        title: "🎭 Shakespeare",
        texts: [
            "Macbeth",
            "Romeo and Juliet",
            "The Tempest",
            "The Merchant of Venice",
            "Much Ado About Nothing",
            "Julius Caesar"
        ]
    },

    novel: {
        title: "📖 19th-Century Novel",
        texts: [
            "The Strange Case of Dr Jekyll and Mr Hyde",
            "A Christmas Carol",
            "Great Expectations",
            "Jane Eyre",
            "Frankenstein",
            "Pride and Prejudice",
            "The Sign of Four"
        ]
    },

    modern: {
        title: "📚 Modern Text",
        texts: [
            "An Inspector Calls",
            "Blood Brothers",
            "DNA",
            "A Taste of Honey",
            "Animal Farm",
            "Lord of the Flies",
            "Anita and Me",
            "Pigeon English",
            "Princess & The Hustler",
            "Leave Taking",
            "My Name is Leon",
            "Telling Tales"
        ]
    },

    poetry: {
        title: "📝 Poetry Anthology",
        texts: [
            "Power and Conflict",
            "Love and Relationships",
            "Worlds and Lives"
        ]
    }

};


let selectedEnglishTexts =
    loadEnglishTextChoices();


function loadEnglishTextChoices() {

    try {

        const saved =
            localStorage.getItem(
                ENGLISH_TEXT_STORAGE_KEY
            );

        if (!saved) {

            return {
                shakespeare: "",
                novel: "",
                modern: "",
                poetry: ""
            };

        }


        const parsed =
            JSON.parse(saved);


        return {

            shakespeare:
                parsed.shakespeare || "",

            novel:
                parsed.novel || "",

            modern:
                parsed.modern || "",

            poetry:
                parsed.poetry || ""

        };

    }

    catch (error) {

        console.warn(
            "Could not load English Literature choices.",
            error
        );


        return {
            shakespeare: "",
            novel: "",
            modern: "",
            poetry: ""
        };

    }

}


function saveEnglishTextChoices() {

    try {

        localStorage.setItem(

            ENGLISH_TEXT_STORAGE_KEY,

            JSON.stringify(
                selectedEnglishTexts
            )

        );

    }

    catch (error) {

        console.warn(
            "Could not save English Literature choices.",
            error
        );

    }

}


/*
 * English is stored as "english"
 * in app.js.
 */

function isEnglishSubject() {

    return (
        normalise(selectedSubject) ===
        "english"
    );

}


/*
 * Find which set text an English card belongs to.
 *
 * When we create the English cards we will use:
 *
 * text: "Macbeth"
 *
 * But this also accepts a few alternative field
 * names so the system is more flexible.
 */

function getEnglishCardText(card) {

    if (!card) {
        return "";
    }


    return (

        card.text ||

        card.textTitle ||

        card.literatureText ||

        card.work ||

        card.play ||

        card.novel ||

        card.poetryCluster ||

        card.cluster ||

        ""

    );

}


/*
 * Returns all four texts currently selected
 * by the student.
 */

function getSelectedEnglishTextList() {

    return Object
        .values(
            selectedEnglishTexts
        )
        .filter(Boolean);

}


/*
 * Should this English card be available?
 *
 * IMPORTANT:
 *
 * Cards without a "text" are allowed.
 * This means future English Language cards,
 * general Literature cards and unseen-poetry
 * cards still work.
 */

function englishCardMatchesSelection(card) {

    if (!isEnglishSubject()) {
        return true;
    }


    const cardText =
        getEnglishCardText(card);


    /*
     * No text field means this is probably
     * English Language, unseen poetry or
     * general English knowledge.
     */

    if (!cardText) {
        return true;
    }


    const choices =
        getSelectedEnglishTextList();


    if (!choices.length) {
        return false;
    }


    return choices.some(

        choice =>

            normalise(choice) ===
            normalise(cardText)

    );

}


/* =========================================================
   ENGLISH TEXT SELECTION UI
   ========================================================= */

function renderEnglishTextSelection() {

    const oldPanel =
        document.getElementById(
            "englishTextSelection"
        );


    if (oldPanel) {
        oldPanel.remove();
    }


    if (!isEnglishSubject()) {
        return;
    }


    const subjectGrid =
        document.getElementById(
            "subjectGrid"
        );


    if (!subjectGrid) {
        return;
    }


    const panel =
        document.createElement("div");


    panel.id =
        "englishTextSelection";


    panel.style.marginTop =
        "25px";


    panel.innerHTML = `

        <div
            style="
                border:2px solid #e3e5ec;
                border-radius:18px;
                padding:22px;
                background:#fafaff;
            "
        >

            <div
                style="
                    text-align:center;
                    margin-bottom:22px;
                "
            >

                <h2
                    style="
                        margin:0 0 7px;
                    "
                >
                    📚 Your English Literature texts
                </h2>

                <p
                    style="
                        margin:0;
                        color:#777;
                    "
                >
                    Choose the texts your school studies.
                    These choices are remembered on this device.
                </p>

            </div>

            <div id="englishTextGroups"></div>

        </div>

    `;


    subjectGrid.insertAdjacentElement(
        "afterend",
        panel
    );


    const groups =
        document.getElementById(
            "englishTextGroups"
        );


    Object.entries(
        ENGLISH_LITERATURE_OPTIONS
    )
    .forEach(
        ([groupKey, group]) => {

            const section =
                document.createElement(
                    "div"
                );


            section.style.marginTop =
                "18px";


            const heading =
                document.createElement(
                    "h3"
                );


            heading.textContent =
                group.title;


            heading.style.margin =
                "0 0 9px";


            section.appendChild(
                heading
            );


            const select =
                document.createElement(
                    "select"
                );


            select.className =
                "flash-select";


            select.dataset.englishGroup =
                groupKey;


            select.innerHTML = `

                <option value="">
                    Choose your text...
                </option>

            `;


            group.texts.forEach(
                text => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        text;


                    option.textContent =
                        text;


                    select.appendChild(
                        option
                    );

                }
            );


            if (
                selectedEnglishTexts[
                    groupKey
                ]
            ) {

                select.value =
                    selectedEnglishTexts[
                        groupKey
                    ];

            }


            select.addEventListener(
                "change",
                () => {

                    selectedEnglishTexts[
                        groupKey
                    ] =
                        select.value;


                    saveEnglishTextChoices();


                    /*
                     * Refresh topics because changing
                     * texts changes which literature
                     * flashcards are available.
                     */

                    selectedTopic =
                        "all";


                    loadTopics();

                    updateStats();

                    hideSetupMessage();

                }
            );


            section.appendChild(
                select
            );


            groups.appendChild(
                section
            );

        }
    );

}
/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function normalise(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}


/* =========================================================
   APP DATA
   ========================================================= */

function getAppData() {

    try {

        if (typeof load === "function") {
            return load();
        }

    } catch (error) {

        console.error(
            "GCSE Hub: Could not load app data.",
            error
        );

    }

    return null;
}


/* =========================================================
   FLASHCARD DATA
   ========================================================= */

function getFlashcardData() {

    if (
        typeof FLASHCARDS === "undefined"
    ) {

        console.error(
            "GCSE Hub: FLASHCARDS is not defined."
        );

        return [];

    }

    if (
        !Array.isArray(FLASHCARDS)
    ) {

        console.error(
            "GCSE Hub: FLASHCARDS is not an array."
        );

        return [];

    }

    console.log(
        "GCSE Hub: Flashcards loaded:",
        FLASHCARDS.length
    );

    return FLASHCARDS;

}


/* =========================================================
   GET STUDENT BOARD
   ========================================================= */

function getStudentBoard(subject) {

    const data = getAppData();

    if (!data) {
        return null;
    }

    /*
       Try the normal boards object.
    */

    if (
        data.boards &&
        typeof data.boards === "object"
    ) {

        const subjectKey =
            Object.keys(data.boards)
                .find(
                    key =>
                        normalise(key) ===
                        normalise(subject)
                );

        if (subjectKey) {

            return data.boards[subjectKey];

        }

    }

    /*
       Some versions of GCSE Hub may store
       board information differently.
    */

    if (
        data.board &&
        typeof data.board === "object"
    ) {

        const subjectKey =
            Object.keys(data.board)
                .find(
                    key =>
                        normalise(key) ===
                        normalise(subject)
                );

        if (subjectKey) {

            return data.board[subjectKey];

        }

    }

    return null;

}


/* =========================================================
   GET STUDENT LEVEL
   ========================================================= */

function getStudentLevel(subject) {

    const data = getAppData();

    if (!data) {
        return null;
    }

    if (
        data.levels &&
        typeof data.levels === "object"
    ) {

        const subjectKey =
            Object.keys(data.levels)
                .find(
                    key =>
                        normalise(key) ===
                        normalise(subject)
                );

        if (subjectKey) {

            return data.levels[subjectKey];

        }

    }

    if (
        data.level &&
        typeof data.level === "object"
    ) {

        const subjectKey =
            Object.keys(data.level)
                .find(
                    key =>
                        normalise(key) ===
                        normalise(subject)
                );

        if (subjectKey) {

            return data.level[subjectKey];

        }

    }

    return null;

}


/* =========================================================
   CHECK WHETHER CARD BELONGS TO STUDENT
   ========================================================= */

function cardMatchesStudent(card) {

    if (!card) {
        return false;
    }


    /* -----------------------------------------------------
       SUBJECT
       ----------------------------------------------------- */

    const cardSubject =
        normalise(card.subject);

    const studentSubject =
        normalise(selectedSubject);


    if (
        cardSubject !==
        studentSubject
    ) {

        return false;

    }


    /* -----------------------------------------------------
       BOARD
       ----------------------------------------------------- */

    const studentBoard =
        getStudentBoard(selectedSubject);


    /*
       IMPORTANT:

       If the student's board cannot be determined,
       DO NOT reject the card.

       This prevents the entire subject disappearing
       because the board information is stored slightly
       differently elsewhere in the website.
    */

    if (
        studentBoard &&
        card.board
    ) {

        if (
            normalise(card.board) !==
            normalise(studentBoard)
        ) {

            return false;

        }

    }


    /* -----------------------------------------------------
       LEVEL
       ----------------------------------------------------- */

    const studentLevel =
        getStudentLevel(selectedSubject);


    if (
        studentLevel &&
        card.level
    ) {

        const cardLevel =
            normalise(card.level);

        const level =
            normalise(studentLevel);


        /*
           Higher students can use:

           - Higher cards
           - Foundation cards
        */

        if (
            level === "higher"
        ) {

            if (
                cardLevel !== "higher" &&
                cardLevel !== "foundation"
            ) {

                /*
                   If the card has an unusual level
                   value, don't accidentally hide it.
                */

                if (
                    cardLevel !== ""
                ) {

                    return false;

                }

            }

        }


        /*
           Foundation students can only use
           Foundation cards.
        */

        else if (
            level === "foundation"
        ) {

            if (
                cardLevel === "higher"
            ) {

                return false;

            }

        }

    }


    /* -----------------------------------------------------
       TOPIC
       ----------------------------------------------------- */

    if (
        selectedTopic !== "all"
    ) {

        const cardTopic =
            normalise(card.topic);

        const wantedTopic =
            normalise(selectedTopic);

        if (
            cardTopic !==
            wantedTopic
        ) {

            return false;

        }

    }
    /* -----------------------------------------------------
       ENGLISH LITERATURE TEXT
       ----------------------------------------------------- */

    if (
        !englishCardMatchesSelection(card)
    ) {

        return false;

    }

    return true;

}


/* =========================================================
   GET ALL STUDENT CARDS
   ========================================================= */

function getStudentCards() {

    const allCards =
        getFlashcardData();

    const result =
        allCards.filter(
            card =>
                cardMatchesStudent(card)
        );


    console.log(
        "GCSE Hub: Cards available for",
        selectedSubject,
        ":",
        result.length
    );


    return result;

}


/* =========================================================
   PROGRESS STORAGE
   ========================================================= */

const FLASHCARD_STORAGE_KEY =
    "gcseHubFlashcardProgress";


function getFlashcardProgress() {

    try {

        const saved =
            localStorage.getItem(
                FLASHCARD_STORAGE_KEY
            );

        if (!saved) {
            return {};
        }

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not load flashcard progress.",
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

        console.error(
            "Could not save flashcard progress.",
            error
        );

    }

}


/* =========================================================
   DEFAULT CARD PROGRESS
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

    const progress =
        getFlashcardProgress();

    return progress[id]
        ? {
            ...defaultCardProgress(),
            ...progress[id]
        }
        : defaultCardProgress();

}


/* =========================================================
   DATES
   ========================================================= */

function today() {

    const date =
        new Date();

    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, "0"),

        String(
            date.getDate()
        ).padStart(2, "0")

    ].join("-");

}


function futureDate(days) {

    const date =
        new Date();

    date.setDate(
        date.getDate() + days
    );

    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, "0"),

        String(
            date.getDate()
        ).padStart(2, "0")

    ].join("-");

}


/* =========================================================
   UPDATE PROGRESS
   ========================================================= */

function updateProgress(card, rating) {

    if (
        !card ||
        !card.id
    ) {

        return;

    }


    const all =
        getFlashcardProgress();


    const progress = {

        ...defaultCardProgress(),

        ...(all[card.id] || {})

    };


    progress.attempts++;

    progress.lastReviewed =
        today();


    if (
        rating === "correct"
    ) {

        progress.correct++;

        progress.streak++;


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
                    progress.streak - 1,
                    intervals.length - 1
                )
            ];


        progress.nextReview =
            futureDate(interval);


        if (
            progress.streak >= 4
        ) {

            progress.mastered =
                true;

        }

    }


    else if (
        rating === "almost"
    ) {

        progress.almost++;

        progress.nextReview =
            futureDate(1);

    }


    else if (
        rating === "wrong"
    ) {

        progress.wrong++;

        progress.streak =
            0;

        progress.mastered =
            false;

        progress.nextReview =
            today();

    }


    all[card.id] =
        progress;


    saveFlashcardProgress(all);

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
                !progress.attempts
            ) {

                return false;

            }


            return (

                progress.wrong > 0 ||

                progress.almost > 0 ||

                (
                    progress.correct /
                    progress.attempts
                ) < 0.75

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

                progress.nextReview <=
                currentDate

            );

        });

}


/* =========================================================
   SUBJECT INFORMATION
   ========================================================= */

function getSubjectInfo(id) {

    if (
        typeof SUBJECTS !== "undefined" &&
        SUBJECTS[id]
    ) {

        return SUBJECTS[id];

    }

    return null;

}


/* =========================================================
   RENDER SUBJECTS
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


    if (
        !data ||
        !Array.isArray(data.subjects)
    ) {

        grid.innerHTML =
            "<p>Please return to the dashboard and choose your subjects.</p>";

        return;

    }


    grid.innerHTML = "";


    /*
       Allow subject to be passed through URL.
       Example:

       flashcards.html?subject=biology
    */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlSubject =
        params.get("subject");


    if (urlSubject) {

        const found =
            data.subjects.find(
                subject =>
                    normalise(subject) ===
                    normalise(urlSubject)
            );


        if (found) {

            selectedSubject =
                found;

        }

    }


    /*
       Otherwise use current subject.
    */

    if (
        !selectedSubject &&
        data.currentSubject
    ) {

        selectedSubject =
            data.currentSubject;

    }


    data.subjects.forEach(
        id => {

            const subject =
                getSubjectInfo(id);


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
                getStudentBoard(id);


            const level =
                getStudentLevel(id);


            button.innerHTML = `

                <span class="subject-select-icon">
                    ${subject.icon || "📚"}
                </span>

                <span class="subject-select-name">
                    ${subject.name}
                </span>

                <span class="subject-select-info">
                    ${board || ""}
                    ${board && level ? " • " : ""}
                    ${level || ""}
                </span>

            `;


            if (
                normalise(id) ===
                normalise(selectedSubject)
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
                        .forEach(
                            other =>
                                other.classList.remove(
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
   LOAD TOPICS
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


    /*
       Temporarily use all topics.
    */

    const previousTopic =
        selectedTopic;


    selectedTopic =
        "all";


    const topics = [

        ...new Set(

            getStudentCards()
                .map(
                    card =>
                        card.topic
                )
                .filter(Boolean)

        )

    ];


    selectedTopic =
        previousTopic;


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


            select.appendChild(
                option
            );

        }
    );


    if (
        topics.some(
            topic =>
                normalise(topic) ===
                normalise(selectedTopic)
        )
    ) {

        const matchingTopic =
            topics.find(
                topic =>
                    normalise(topic) ===
                    normalise(selectedTopic)
            );


        select.value =
            matchingTopic;

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


    let reviewed =
        0;

    let mastered =
        0;

    let attempts =
        0;

    let correctAnswers =
        0;


    Object.values(progress)
        .forEach(
            p => {

                const a =
                    Number(
                        p.attempts
                    ) || 0;


                const c =
                    Number(
                        p.correct
                    ) || 0;


                attempts +=
                    a;


                correctAnswers +=
                    c;


                if (
                    a > 0
                ) {

                    reviewed++;

                }


                if (
                    p.mastered
                ) {

                    mastered++;

                }

            }
        );


    const due =
        selectedSubject
            ? getDueCards().length
            : 0;


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


    if (
        reviewedElement
    ) {

        reviewedElement.textContent =
            reviewed;

    }


    if (
        masteredElement
    ) {

        masteredElement.textContent =
            mastered;

    }


    if (
        accuracyElement
    ) {

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


    if (
        dueElement
    ) {

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

        /*
           Also log the problem so we can
           diagnose it if necessary.
        */

        console.warn(
            "GCSE Hub:",
            message
        );

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
   START REVISION
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
            topicSelect.value ||
            "all";

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


    console.log(
        "GCSE Hub: Selected subject:",
        selectedSubject
    );


    console.log(
        "GCSE Hub: Selected topic:",
        selectedTopic
    );


    console.log(
        "GCSE Hub: Matching cards:",
        pool.length
    );


    if (
        !pool.length
    ) {

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


    cards =
        [...pool]
            .sort(
                () =>
                    Math.random() - 0.5
            )
            .slice(
                0,
                selectedNumber
            );


    currentCard =
        0;


    correct =
        0;


    almost =
        0;


    wrong =
        0;


    sessionXP =
        0;


    ratingLocked =
        false;


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
        getSubjectInfo(
            selectedSubject
        );


    const sessionSubject =
        document.getElementById(
            "sessionSubject"
        );


    if (
        sessionSubject
    ) {

        sessionSubject.textContent =
            subject

                ? `${subject.icon || "📚"} ${subject.name}`

                : selectedSubject;

    }


    const sessionTopic =
        document.getElementById(
            "sessionTopic"
        );


    if (
        sessionTopic
    ) {

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


    if (
        questionTopic
    ) {

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


    const answer =
        document.getElementById(
            "answer"
        );


    const answerText =
        document.getElementById(
            "answerText"
        );


    const ratings =
        document.getElementById(
            "ratingButtons"
        );


    const showAnswerButton =
        document.getElementById(
            "showAnswer"
        );


    if (answer) {

        answer.classList.remove(
            "visible"
        );

    }


    if (ratings) {

        ratings.classList.remove(
            "visible"
        );

    }


    if (answerText) {

        answerText.textContent =
            card.answer || "";

    }


    if (
        showAnswerButton
    ) {

        showAnswerButton.style.display =
            "inline-block";

    }


    ratingLocked =
        false;

}


/* =========================================================
   REVEAL ANSWER
   ========================================================= */

function revealAnswer() {

    const answer =
        document.getElementById(
            "answer"
        );


    const ratings =
        document.getElementById(
            "ratingButtons"
        );


    const button =
        document.getElementById(
            "showAnswer"
        );


    if (answer) {

        answer.classList.add(
            "visible"
        );

    }


    if (ratings) {

        ratings.classList.add(
            "visible"
        );

    }


    if (button) {

        button.style.display =
            "none";

    }

}


/* =========================================================
   RATE CARD
   ========================================================= */

function rateCard(rating) {

    if (
        ratingLocked ||
        !cards[currentCard]
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


    if (
        rating === "correct"
    ) {

        correct++;

    }

    else if (
        rating === "almost"
    ) {

        almost++;

    }

    else if (
        rating === "wrong"
    ) {

        wrong++;

    }


    const xp =

        rating === "correct"

            ? 20

            : rating === "almost"

                ? 10

                : 5;


    sessionXP +=
        xp;


    if (
        typeof award === "function"
    ) {

        award(
            xp,
            rating === "correct"
                ? 1
                : 0
        );

    }


    const xpElement =
        document.getElementById(
            "xpEarned"
        );


    if (
        xpElement
    ) {

        xpElement.textContent =
            `+${xp} XP ⭐`;

    }


    setTimeout(
        () => {

            currentCard++;


            if (
                currentCard >=
                cards.length
            ) {

                finishSession();

            }

            else {

                showCard();

            }

        },
        350
    );

}


/* =========================================================
   FINISH SESSION
   ========================================================= */

function finishSession() {

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


    const resultCards =
        document.getElementById(
            "resultCards"
        );


    const resultCorrect =
        document.getElementById(
            "resultCorrect"
        );


    const resultAlmost =
        document.getElementById(
            "resultAlmost"
        );


    const resultXP =
        document.getElementById(
            "resultXP"
        );


    if (score) {

        score.textContent =
            `${percentage}%`;

    }


    if (resultCards) {

        resultCards.textContent =
            cards.length;

    }


    if (resultCorrect) {

        resultCorrect.textContent =
            correct;

    }


    if (resultAlmost) {

        resultAlmost.textContent =
            almost;

    }


    if (resultXP) {

        resultXP.textContent =
            `${sessionXP} ⭐`;

    }


    updateStats();

}


/* =========================================================
   RESET SESSION
   ========================================================= */

function resetSession() {

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


    updateStats();

}


/* =========================================================
   INITIALISE
   ========================================================= */

function initialiseFlashcards() {

    console.log(
        "GCSE Hub: Initialising flashcards..."
    );


    /*
       MODE BUTTONS
    */

    document
        .querySelectorAll(
            "[data-mode]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        selectedMode =
                            button.dataset.mode ||
                            "normal";


                        document
                            .querySelectorAll(
                                "[data-mode]"
                            )
                            .forEach(
                                other =>
                                    other.classList.remove(
                                        "selected"
                                    )
                            );


                        button.classList.add(
                            "selected"
                        );


                        hideSetupMessage();

                    }
                );

            }
        );


    /*
       NUMBER BUTTONS
    */

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
                            ) || 10;


                        document
                            .querySelectorAll(
                                "[data-number]"
                            )
                            .forEach(
                                other =>
                                    other.classList.remove(
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


    /*
       TOPIC SELECT
    */

    const topic =
        document.getElementById(
            "topic"
        );


    if (topic) {

        topic.addEventListener(
            "change",
            () => {

                selectedTopic =
                    topic.value ||
                    "all";


                updateStats();

            }
        );

    }


    /*
       START BUTTON
    */

    const startButton =
        document.getElementById(
            "startButton"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            startSession
        );

    }


    /*
       SHOW ANSWER
    */

    const showAnswerButton =
        document.getElementById(
            "showAnswer"
        );


    if (
        showAnswerButton
    ) {

        showAnswerButton.addEventListener(
            "click",
            revealAnswer
        );

    }


    /*
       RATING BUTTONS
    */

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


    /*
       AGAIN BUTTON
    */

    const againButton =
        document.getElementById(
            "againButton"
        );


    if (againButton) {

        againButton.addEventListener(
            "click",
            resetSession
        );

    }


    /*
       SUBJECTS
    */

    renderSubjects();


    /*
       STATS
    */

    updateStats();


    console.log(
        "GCSE Hub: Flashcards initialised."
    );

}


/* =========================================================
   DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseFlashcards
    );

}

else {

    initialiseFlashcards();

}
