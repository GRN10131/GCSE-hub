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
   STREAK STATUS CHECK
   Checks whether the student has missed a revision day.
   This runs when the dashboard is opened.
   ========================================================= */

function checkStreakStatus() {

    let data = load();

    const today = getToday();

    /* Nothing to check if the student has never started */
    if (!data.lastStreakDate) {
        return;
    }

    /* Already active today */
    if (data.lastStreakDate === today) {
        return;
    }

    const gap = daysBetween(
        data.lastStreakDate,
        today
    );

    /* Exactly one day since last revision:
       this is still a valid consecutive streak. */
    if (gap === 1) {
        return;
    }

    /* -----------------------------------------------------
       MORE THAN ONE DAY MISSED
       ----------------------------------------------------- */

    if (gap > 1) {

        /* ---------------------------------------------
           STREAK FREEZE AVAILABLE
           --------------------------------------------- */

        if (data.streakFreezes > 0) {

            data.streakFreezes--;

            /*
               The freeze protects the streak and counts
               today as the protected day.
            */

            data.lastStreakDate = today;

            save(data);

            renderStats();

            showStreakFreezePopup();

            return;
        }


        /* ---------------------------------------------
           NO FREEZE — STREAK HAS ENDED
           --------------------------------------------- */

        const previousStreak =
            data.streak;

        data.streak = 0;

        data.lastStreakDate = null;

        /*
           Remember that this particular streak break
           has already been shown.
        */

        data.streakBreakNotice = today;

        data.lastBrokenStreak = previousStreak;

        save(data);

        renderStats();

        showStreakEndedPopup(previousStreak);

    }

}


/* =========================================================
   STREAK ENDED POPUP
   ========================================================= */

function showStreakEndedPopup(previousStreak = 0) {

    /*
       Do not show the same popup twice during the
       same dashboard visit/day.
    */

    const today = getToday();

    const data = load();

    if (data.streakBreakNotice !== today) {
        return;
    }

    /* Prevent duplicate popup elements */

    if (
        document.getElementById(
            "streakEndedModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement("div");

    modal.id =
        "streakEndedModal";


    modal.innerHTML = `

        <div class="streak-ended-overlay">

            <div class="streak-ended-card">

                <button
                    class="streak-ended-close"
                    onclick="closeStreakEndedPopup()"
                    aria-label="Close"
                >
                    ×
                </button>


                <img
                    src="assets/wojtek/streak-ended.png"
                    alt="Wojtek looking sad because the revision streak ended"
                    class="streak-ended-image"
                >


                <div class="streak-ended-icon">
                    💔
                </div>


                <h2>
                    Your streak has ended
                </h2>


                <p class="streak-ended-main">
                    Oh no! Wojtek is very disappointed.
                </p>


                <p class="streak-ended-secondary">

                    Your
                    <strong>${previousStreak}-day</strong>
                    streak has ended.

                    <br><br>

                    But don't worry —
                    <strong>you can start a new one today!</strong>

                </p>


                <button
                    class="btn streak-ended-button"
                    onclick="closeStreakEndedPopup()"
                >
                    Start New Streak 🚀
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

}


/* =========================================================
   CLOSE STREAK ENDED POPUP
   ========================================================= */

function closeStreakEndedPopup() {

    const modal =
        document.getElementById(
            "streakEndedModal"
        );

    if (modal) {

        modal.remove();

    }

}


/* =========================================================
   STREAK FREEZE POPUP
   ========================================================= */

function showStreakFreezePopup() {

    if (
        document.getElementById(
            "streakFreezeModal"
        )
    ) {
        return;
    }


    const data = load();


    const modal =
        document.createElement("div");

    modal.id =
        "streakFreezeModal";


    modal.innerHTML = `

        <div class="streak-ended-overlay">

            <div class="streak-ended-card freeze-card">

                <button
                    class="streak-ended-close"
                    onclick="closeStreakFreezePopup()"
                    aria-label="Close"
                >
                    ×
                </button>


                <div class="freeze-icon">
                    🛡️
                </div>


                <h2>
                    Streak Freeze Used!
                </h2>


                <p class="streak-ended-main">
                    Wojtek is relieved!
                </p>


                <p class="streak-ended-secondary">

                    You missed a revision day,
                    but a Streak Freeze protected
                    your streak.

                    <br><br>

                    You now have
                    <strong>
                        ${data.streakFreezes}
                    </strong>
                    freeze
                    ${data.streakFreezes === 1 ? "remaining" : "remaining"}.

                </p>


                <button
                    class="btn streak-ended-button"
                    onclick="closeStreakFreezePopup()"
                >
                    Keep Revising 🔥
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

}


/* =========================================================
   CLOSE STREAK FREEZE POPUP
   ========================================================= */

function closeStreakFreezePopup() {

    const modal =
        document.getElementById(
            "streakFreezeModal"
        );

    if (modal) {

        modal.remove();

    }

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

  wave: "assets/wojtek/waving.png",  
   
   happy: "assets/wojtek/happy.png",

    thinking: "assets/wojtek/thinking.png",

    studying: "assets/wojtek/studying.png",

    celebrate: "assets/wojtek/celebrate.png",

    streakEnded: "assets/wojtek/streak-ended.png"

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


