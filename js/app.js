/* =========================================================
   GCSE HUB
   GLOBAL DATA SYSTEM
   ========================================================= */

const SUBJECTS = {

    maths: {
        name: "Maths",
        icon: "➗",
        boards: ["Pearson", "AQA"],
        levels: ["Foundation", "Higher"]
    },

    english: {
        name: "English",
        icon: "📖",
        boards: ["AQA", "Pearson"],
        levels: []
    },

    biology: {
        name: "Biology",
        icon: "🧬",
        boards: ["AQA", "Pearson"],
        levels: []
    },

    chemistry: {
        name: "Chemistry",
        icon: "⚗️",
        boards: ["AQA", "Pearson"],
        levels: []
    },

    physics: {
        name: "Physics",
        icon: "⚛️",
        boards: ["AQA", "Pearson"],
        levels: []
    },

    combined: {
        name: "Combined Science",
        icon: "🔬",
        boards: ["AQA", "Pearson"],
        levels: []
    },

    ethics: {
        name: "Ethics & Philosophy",
        icon: "⚖️",
        boards: ["AQA"],
        levels: []
    },

    history: {
        name: "History",
        icon: "🏰",
        boards: ["Pearson"],
        levels: []
    },

    geography: {
        name: "Geography",
        icon: "🌍",
        boards: ["AQA", "Pearson"],
        levels: []
    },

    spanish: {
        name: "Spanish",
        icon: "🇪🇸",
        boards: ["Pearson", "AQA"],
        levels: ["Foundation", "Higher"]
    },

    french: {
        name: "French",
        icon: "🇫🇷",
        boards: ["AQA", "Pearson"],
        levels: ["Foundation", "Higher"]
    },

    systems: {
        name: "Systems Programmable Engineering",
        icon: "⚙️",
        boards: ["OCR"],
        levels: []
    },

    engineering: {
        name: "Engineering Design",
        icon: "🔧",
        boards: ["Pearson", "OCR"],
        levels: []
    },

    imedia: {
        name: "Creative i-Media",
        icon: "🎬",
        boards: ["OCR"],
        levels: []
    },

    business: {
        name: "Business",
        icon: "💼",
        boards: ["AQA", "Pearson"],
        levels: []
    }

};


/* =========================================================
   DEFAULT DATA
   ========================================================= */

const DEFAULT_DATA = {

    name: "",

    subjects: [],

    currentSubject: null,

    boards: {},

    levels: {},

    points: 0,

    gems: 100,

    streak: 0,

    streakFreezes: 2,

    dailyGoal: 500,

    pointsToday: 0,

    pointsTodayDate: null,

    lastStreakDate: null,

    history: {},

    completedTopics: {},

    ratings: {}

};


/* =========================================================
   LOAD
   ========================================================= */

function load() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    "GCSE_HUB_DATA"
                ) || "{}"
            );

        const data = {
            ...DEFAULT_DATA,
            ...stored
        };

        if (!Array.isArray(data.subjects)) {
            data.subjects = [];
        }

        if (!data.boards || typeof data.boards !== "object") {
            data.boards = {};
        }

        if (!data.levels || typeof data.levels !== "object") {
            data.levels = {};
        }

        if (!data.history || typeof data.history !== "object") {
            data.history = {};
        }

        if (!data.completedTopics || typeof data.completedTopics !== "object") {
            data.completedTopics = {};
        }

        if (!data.ratings || typeof data.ratings !== "object") {
            data.ratings = {};
        }

        return data;

    } catch (error) {

        console.error(error);

        return {
            ...DEFAULT_DATA,
            boards: {},
            levels: {},
            history: {},
            completedTopics: {},
            ratings: {}
        };

    }

}


/* =========================================================
   SAVE
   ========================================================= */

function save(data) {

    localStorage.setItem(
        "GCSE_HUB_DATA",
        JSON.stringify(data)
    );

}


/* =========================================================
   TODAY
   ========================================================= */

function getToday() {

    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");

}


/* =========================================================
   DATE DIFFERENCE
   ========================================================= */

function daysBetween(first, second) {

    const a = new Date(first);
    const b = new Date(second);

    return Math.round(
        (b - a) / 86400000
    );

}


/* =========================================================
   KEEP DAILY PROGRESS CORRECT
   ========================================================= */

function updateDay(data) {

    const today = getToday();

    if (data.pointsTodayDate !== today) {

        data.pointsToday = 0;

        data.pointsTodayDate = today;

        save(data);

    }

    return data;

}


/* =========================================================
   AWARD POINTS
   ========================================================= */

function award(points = 0, gems = 0) {

    let data = load();

    data = updateDay(data);

    const today = getToday();

    /* -----------------------------------------
       STREAK
       ----------------------------------------- */

    if (data.lastStreakDate !== today) {

        if (!data.lastStreakDate) {

            data.streak = 1;

        } else {

            const gap =
                daysBetween(
                    data.lastStreakDate,
                    today
                );

            if (gap === 1) {

                data.streak++;

            } else if (gap > 1) {

                if (data.streakFreezes > 0) {

                    data.streakFreezes--;

                } else {

                    data.streak = 1;

                }

            }

        }

        data.lastStreakDate = today;

    }


    /* -----------------------------------------
       POINTS
       ----------------------------------------- */

    data.points += points;

    data.pointsToday += points;


    /* -----------------------------------------
       GEMS
       ----------------------------------------- */

    data.gems += gems;


    /* -----------------------------------------
       HISTORY
       ----------------------------------------- */

    data.history[today] = {
        points: data.pointsToday
    };


    save(data);

    renderStats();

    return data;

}


/* =========================================================
   CURRENT SUBJECT
   ========================================================= */

function setCurrentSubject(id) {

    const data = load();

    if (!data.subjects.includes(id)) {
        return;
    }

    data.currentSubject = id;

    save(data);

    renderStats();

}


/* =========================================================
   SUBJECT NAME
   ========================================================= */

function getSubjectName(id) {

    if (SUBJECTS[id]) {
        return SUBJECTS[id].name;
    }

    return "";

}


/* =========================================================
   HEADER
   ========================================================= */

function headerHTML() {

    return `

        <header class="topbar">

            <a
                href="dashboard.html"
                class="logo"
            >
                GCSE<span>Hub</span>
            </a>

            <div class="stats">

                <span class="pill">
                    ⭐
                    <b data-points>0</b>
                </span>

                <span class="pill gems">
                    💎
                    <b data-gems>0</b>
                </span>

                <span class="pill streak">
                    🔥
                    <b data-streak>0</b>
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

    let data = load();

    data = updateDay(data);


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


    /* TODAY */

    document
        .querySelectorAll("[data-today]")
        .forEach(element => {

            element.textContent =
                data.pointsToday;

        });


    /* GOAL */

    document
        .querySelectorAll("[data-goal]")
        .forEach(element => {

            element.textContent =
                data.dailyGoal;

        });


    /* PROGRESS */

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
                data.name || "";

        });


    /* CURRENT SUBJECT */

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
                    : "";

        });


    /* LEVEL */

    document
        .querySelectorAll("[data-level]")
        .forEach(element => {

            const level =
                data.levels[
                    data.currentSubject
                ];

            element.textContent =
                level || "";

        });

}


/* =========================================================
   RESET
   ========================================================= */

function resetData() {

    const confirmed =
        confirm(
            "This will delete all GCSE Hub data on this device. Continue?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "GCSE_HUB_DATA"
    );

    window.location.href =
        "setup-name.html";

}
/* =========================================
   WOJTEK MASCOT SYSTEM
   ========================================= */

const WOJTEK_IMAGES = {

    happy: "assets/wojtek/happy.png",

    wave: "assets/wojtek/waving.png",

    thinking: "assets/wojtek/thinking.png",

    studying: "assets/wojtek/studying.png",

    celebrate: "assets/wojtek/celebrate.png"

};


/* Change Wojtek's image */

function wojtekAnimation(animation) {

    const image =
        WOJTEK_IMAGES[animation] ||
        WOJTEK_IMAGES.happy;

    document
        .querySelectorAll(".wojtek")
        .forEach(wojtek => {

            wojtek.style.backgroundImage =
                `url("${image}")`;

            wojtek.dataset.animation =
                animation;

        });

}


/* Change Wojtek's speech */

function wojtekSpeak(message) {

    document
        .querySelectorAll(".wojtek-message")
        .forEach(box => {

            box.innerHTML = message;

        });

}


/* Change animation + speech */

function wojtekSay(animation, message) {

    wojtekAnimation(animation);

    wojtekSpeak(message);

}


/* =========================================================
   CROSS-PAGE / CROSS-TAB UPDATE
   ========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "GCSE_HUB_DATA"
        ) {

            renderStats();

        }

    }
);


