/* =========================================================
   GCSE HUB 2.0
   CENTRAL DATA + GAMIFICATION SYSTEM
   ========================================================= */


/* =========================================================
   SUBJECTS
   ========================================================= */

const SUBJECTS = {

    maths: {
        name: "Maths",
        icon: "➗",
        boards: ["AQA", "Pearson"]
    },

    english: {
        name: "English",
        icon: "📖",
        boards: ["AQA", "Pearson"]
    },

    biology: {
        name: "Biology",
        icon: "🧬",
        boards: ["AQA", "Pearson"]
    },

    chemistry: {
        name: "Chemistry",
        icon: "⚗️",
        boards: ["AQA", "Pearson"]
    },

    physics: {
        name: "Physics",
        icon: "⚛️",
        boards: ["AQA", "Pearson"]
    },

    combined: {
        name: "Combined Science",
        icon: "🔬",
        boards: ["AQA", "Pearson"]
    },

    ethics: {
        name: "Ethics & Philosophy",
        icon: "⚖️",
        boards: ["AQA"]
    },

    history: {
        name: "History",
        icon: "🏰",
        boards: ["Pearson"]
    },

    geography: {
        name: "Geography",
        icon: "🌍",
        boards: ["AQA", "Pearson"]
    },

    spanish: {
        name: "Spanish",
        icon: "🇪🇸",
        boards: ["Pearson", "AQA"]
    },

    french: {
        name: "French",
        icon: "🇫🇷",
        boards: ["AQA", "Pearson"]
    },

    systems: {
        name: "Systems Programmable Engineering",
        icon: "⚙️",
        boards: ["School specification"]
    },

    engineering: {
        name: "Engineering Design",
        icon: "🔧",
        boards: ["Pearson", "OCR"]
    },

    imedia: {
        name: "Creative i-Media",
        icon: "🎬",
        boards: ["OCR"]
    },

    business: {
        name: "Business",
        icon: "💼",
        boards: ["AQA", "Pearson"]
    }

};


/* =========================================================
   STARTER TOPICS
   ========================================================= */

const TOPICS = {

    maths: [
        "Number",
        "Algebra",
        "Ratio & Proportion",
        "Geometry",
        "Statistics",
        "Probability"
    ],

    english: [
        "Macbeth",
        "A Christmas Carol",
        "An Inspector Calls",
        "Language Paper 1",
        "Language Paper 2"
    ],

    biology: [
        "Cell Biology",
        "Organisation",
        "Infection & Response",
        "Bioenergetics",
        "Homeostasis",
        "Ecology"
    ],

    chemistry: [
        "Atomic Structure",
        "Bonding",
        "Quantitative Chemistry",
        "Chemical Changes",
        "Energy Changes",
        "Organic Chemistry"
    ],

    physics: [
        "Energy",
        "Electricity",
        "Particle Model",
        "Atomic Structure",
        "Forces",
        "Waves"
    ],

    combined: [
        "Biology",
        "Chemistry",
        "Physics",
        "Required Practicals"
    ],

    ethics: [
        "Christianity",
        "Islam",
        "Relationships",
        "Crime & Punishment",
        "Peace & Conflict"
    ],

    history: [
        "Medicine Through Time",
        "The Renaissance",
        "The Great Plague",
        "Modern Medicine"
    ],

    geography: [
        "Natural Hazards",
        "Living World",
        "Physical Landscapes",
        "Urban Issues",
        "Resource Management"
    ],

    spanish: [
        "Identity & Culture",
        "Local Area",
        "School",
        "Future Aspirations",
        "International & Global Dimension"
    ],

    french: [
        "Identity & Culture",
        "Local Area",
        "School",
        "Future Aspirations",
        "International & Global Dimension"
    ],

    systems: [
        "Programming",
        "Digital Systems",
        "Microcontrollers",
        "Sensors",
        "Data & Logic"
    ],

    engineering: [
        "Materials",
        "Manufacturing",
        "Design Processes",
        "Mechanical Systems",
        "Electronics"
    ],

    imedia: [
        "Pre-production",
        "Creative Media",
        "Digital Graphics",
        "Animation",
        "Interactive Media"
    ],

    business: [
        "Business in the Real World",
        "Influences on Business",
        "Business Operations",
        "Human Resources",
        "Marketing",
        "Finance"
    ]

};


/* =========================================================
   DEFAULT USER DATA
   ========================================================= */

const DEFAULT_DATA = {

    name: "",

    /* ALL SUBJECTS THE STUDENT STUDIES */
    subjects: [],

    /* CURRENTLY SELECTED SUBJECT */
    currentSubject: null,

    /* EXAM BOARD FOR EACH SUBJECT */
    boards: {},

    /* LEVEL FOR EACH SUBJECT */
    levels: {},

    /* GAMIFICATION */

    points: 0,

    gems: 100,

    streak: 0,

    streakFreezes: 2,

    /* DAILY GOAL */

    dailyGoal: 500,

    pointsToday: 0,

    pointsTodayDate: null,

    lastStreakDate: null,

    /* HISTORY */

    history: {},

    /* REVISION */

    completedTopics: {},

    ratings: {}

};


/* =========================================================
   LOAD DATA
   ========================================================= */

function load() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem("GCSE_HUB_DATA") || "{}"
            );


        const data = {
            ...DEFAULT_DATA,
            ...stored
        };


        /* ---------------------------------------------
           MIGRATION FROM OLD VERSION
           --------------------------------------------- */

        /*
           The previous version stored:

           subject: "maths"

           This converts it into:

           subjects: ["maths"]
        */

        if (
            (!Array.isArray(data.subjects) ||
            data.subjects.length === 0) &&
            stored.subject
        ) {

            data.subjects = [stored.subject];

        }


        if (
            !data.currentSubject &&
            data.subjects &&
            data.subjects.length > 0
        ) {

            data.currentSubject =
                data.subjects[0];

        }


        /* Old single level/board system */

        if (
            data.currentSubject &&
            !data.levels[data.currentSubject] &&
            stored.level
        ) {

            data.levels[data.currentSubject] =
                stored.level;

        }


        if (
            data.currentSubject &&
            !data.boards[data.currentSubject] &&
            stored.board
        ) {

            data.boards[data.currentSubject] =
                stored.board;

        }


        return data;

    }

    catch (error) {

        console.error(
            "Could not load GCSE Hub data:",
            error
        );

        return {
            ...DEFAULT_DATA
        };

    }

}


/* =========================================================
   SAVE DATA
   ========================================================= */

function save(data) {

    localStorage.setItem(
        "GCSE_HUB_DATA",
        JSON.stringify(data)
    );

}


/* =========================================================
   TODAY'S DATE
   ========================================================= */

function getToday() {

    const now = new Date();

    return (
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0")
    );

}


/* =========================================================
   DATE DIFFERENCE
   ========================================================= */

function daysBetween(firstDate, secondDate) {

    const first =
        new Date(firstDate);

    const second =
        new Date(secondDate);


    return Math.round(
        (second - first) /
        (1000 * 60 * 60 * 24)
    );

}


/* =========================================================
   DAILY DATA
   ========================================================= */

function updateDay(data) {

    const today =
        getToday();


    /*
       Only reset today's points when
       the actual calendar day changes.

       This is the important fix.
    */

    if (
        data.pointsTodayDate !== today
    ) {

        data.pointsToday = 0;

        data.pointsTodayDate =
            today;

    }


    return data;

}


/* =========================================================
   AWARD POINTS + GEMS
   ========================================================= */

function award(
    points = 0,
    gems = 0
) {

    let data =
        load();


    data =
        updateDay(data);


    const today =
        getToday();


    /*
       STREAK
    */

    if (
        data.lastStreakDate !== today
    ) {

        if (
            !data.lastStreakDate
        ) {

            data.streak = 1;

        }

        else {

            const gap =
                daysBetween(
                    data.lastStreakDate,
                    today
                );


            if (gap === 1) {

                data.streak++;

            }

            else if (gap > 1) {

                /*
                   Use a streak freeze
                   if one is available.
                */

                if (
                    data.streakFreezes > 0
                ) {

                    data.streakFreezes--;

                }

                else {

                    data.streak = 1;

                }

            }

        }


        data.lastStreakDate =
            today;

    }


    /*
       POINTS
    */

    data.points += points;

    data.pointsToday += points;


    /*
       GEMS
    */

    data.gems += gems;


    /*
       HISTORY
    */

    data.history[today] = {

        points:
            data.pointsToday

    };


    save(data);


    /*
       Immediately update the page.
    */

    renderStats();


    return data;

}


/* =========================================================
   SET CURRENT SUBJECT
   ========================================================= */

function setCurrentSubject(subjectId) {

    const data =
        load();


    if (
        !data.subjects.includes(subjectId)
    ) {

        return;

    }


    data.currentSubject =
        subjectId;


    save(data);


    renderStats();

}


/* =========================================================
   GET CURRENT SUBJECT
   ========================================================= */

function getCurrentSubject() {

    const data =
        load();


    return data.currentSubject;

}


/* =========================================================
   GET SUBJECT NAME
   ========================================================= */

function getSubjectName(id) {

    if (
        SUBJECTS[id]
    ) {

        return SUBJECTS[id].name;

    }


    return "Unknown subject";

}


/* =========================================================
   HEADER
   ========================================================= */

function headerHTML() {

    return `

        <header class="topbar">

            <a
                class="logo"
                href="dashboard.html"
            >
                GCSE<span>Hub</span>
            </a>


            <div class="stats">

                <span class="pill">

                    ⭐

                    <b data-points>
                        0
                    </b>

                </span>


                <span class="pill gems">

                    💎

                    <b data-gems>
                        0
                    </b>

                </span>


                <span class="pill streak">

                    🔥

                    <b data-streak>
                        0
                    </b>

                </span>

            </div>

        </header>

    `;

}


/* =========================================================
   INSERT HEADER
   ========================================================= */

function injectHeader() {

    document.body.insertAdjacentHTML(
        "afterbegin",
        headerHTML()
    );


    renderStats();

}


/* =========================================================
   RENDER GLOBAL STATS
   ========================================================= */

function renderStats() {

    let data =
        load();


    /*
       Update date without
       destroying today's progress.
    */

    data =
        updateDay(data);


    save(data);


    /* POINTS */

    document
        .querySelectorAll("[data-points]")
        .forEach(element => {

            element.textContent =
                data.points.toLocaleString();

        });


    /* GEMS */

    document
        .querySelectorAll("[data-gems]")
        .forEach(element => {

            element.textContent =
                data.gems.toLocaleString();

        });


    /* STREAK */

    document
        .querySelectorAll("[data-streak]")
        .forEach(element => {

            element.textContent =
                data.streak;

        });


    /* TODAY'S POINTS */

    document
        .querySelectorAll("[data-today]")
        .forEach(element => {

            element.textContent =
                data.pointsToday;

        });


    /* DAILY GOAL */

    document
        .querySelectorAll("[data-goal]")
        .forEach(element => {

            element.textContent =
                data.dailyGoal;

        });


    /*
       DAILY PROGRESS BAR

       This now updates whenever:
       - the page loads
       - points are awarded
       - the daily goal changes
       - another browser tab changes the data
    */

    document
        .querySelectorAll("[data-progress]")
        .forEach(element => {

            const percentage =
                Math.min(
                    100,
                    (
                        data.pointsToday /
                        Math.max(
                            1,
                            data.dailyGoal
                        )
                    ) * 100
                );


            element.style.width =
                percentage + "%";

        });


    /* NAME */

    document
        .querySelectorAll("[data-name]")
        .forEach(element => {

            element.textContent =
                data.name ||
                "Student";

        });


    /*
       CURRENT SUBJECT
    */

    document
        .querySelectorAll("[data-subject]")
        .forEach(element => {

            const subject =
                SUBJECTS[
                    data.currentSubject
                ];


            element.textContent =
                subject
                ? subject.name
                : "Select a subject";

        });


    /*
       LEVEL
    */

    document
        .querySelectorAll("[data-level]")
        .forEach(element => {

            const level =
                data.levels[
                    data.currentSubject
                ];


            element.textContent =
                level ||
                "Not set";

        });

}


/* =========================================================
   RESET
   ========================================================= */

function resetData() {

    const confirmed =
        confirm(
            "Are you sure you want to reset all GCSE Hub data?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "GCSE_HUB_DATA"
    );


    window.location.href =
        "index.html";

}


/* =========================================================
   MULTI-TAB SYNCHRONISATION
   ========================================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key ===
            "GCSE_HUB_DATA"
        ) {

            renderStats();

        }

    }
);
