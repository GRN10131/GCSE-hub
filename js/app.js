/* =========================================================

   GCSE HUB 2.0

   CENTRAL DATA SYSTEM

   ========================================================= */

/* ---------------------------------------------------------

   SUBJECTS

   --------------------------------------------------------- */

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

/* ---------------------------------------------------------

   STARTER TOPICS

   --------------------------------------------------------- */

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

/* ---------------------------------------------------------

   DEFAULT USER DATA

   --------------------------------------------------------- */

const DEFAULT_DATA = {

    name: "Student",

    subject: "maths",

    level: "Higher",

    board: "AQA",

    /* GAMIFICATION */

    points: 0,

    gems: 100,

    streak: 0,

    streakFreezes: 2,

    /* DAILY PROGRESS */

    dailyGoal: 500,

    pointsToday: 0,

    lastActiveDate: null,

    lastStreakDate: null,

    /* REVISION */

    completedTopics: {},

    ratings: {},

    /* DAILY HISTORY */

    history: {}

};

/* ---------------------------------------------------------

   LOAD DATA

   --------------------------------------------------------- */

function load() {

    const stored =

        localStorage.getItem(

            "GCSE_HUB_DATA"

        );

    if (!stored) {

        return {

            ...DEFAULT_DATA

        };

    }

    try {

        return {

            ...DEFAULT_DATA,

            ...JSON.parse(stored)

        };

    } catch {

        return {

            ...DEFAULT_DATA

        };

    }

}

/* ---------------------------------------------------------

   SAVE DATA

   --------------------------------------------------------- */

function save(data) {

    localStorage.setItem(

        "GCSE_HUB_DATA",

        JSON.stringify(data)

    );

}

/* ---------------------------------------------------------

   DATE

   --------------------------------------------------------- */

function getToday() {

    const now =

        new Date();

    return now

        .toISOString()

        .split("T")[0];

}

/* ---------------------------------------------------------

   DATE DIFFERENCE

   --------------------------------------------------------- */

function daysBetween(date1, date2) {

    const first =

        new Date(date1);

    const second =

        new Date(date2);

    return Math.round(

        (second - first)

        /

        (1000 * 60 * 60 * 24)

    );

}

/* ---------------------------------------------------------

   DAILY RESET

   --------------------------------------------------------- */

function updateDay(data) {

    const today =

        getToday();

    if (

        data.lastActiveDate === today

    ) {

        return data;

    }

    /*

       If the student hasn't done anything

       today, reset today's progress.

    */

    data.pointsToday = 0;

    /*

       Streak handling

    */

    if (data.lastStreakDate) {

        const difference =

            daysBetween(

                data.lastStreakDate,

                today

            );

        if (difference > 1) {

            /*

               Student missed a day.

               Use a freeze if available.

            */

            if (

                data.streakFreezes > 0

            ) {

                data.streakFreezes--;

            } else {

                data.streak = 0;

            }

        }

    }

    data.lastActiveDate =

        today;

    save(data);

    return data;

}

/* ---------------------------------------------------------

   AWARD POINTS / GEMS

   --------------------------------------------------------- */

function award(

    points = 0,

    gems = 0

) {

    let data = load();

    data =

        updateDay(data);

    data.points += points;

    data.pointsToday += points;

    data.gems += gems;

    /*

       Record today's activity

    */

    const today =

        getToday();

    if (

        data.lastStreakDate !== today

    ) {

        if (

            data.lastStreakDate === null

        ) {

            data.streak = 1;

        } else {

            const difference =

                daysBetween(

                    data.lastStreakDate,

                    today

                );

            if (difference === 1) {

                data.streak++;

            }

            else if (

                difference > 1

            ) {

                /*

                   If updateDay used a freeze,

                   the streak remains intact.

                */

                if (

                    data.streak === 0

                ) {

                    data.streak = 1;

                }

            }

        }

        data.lastStreakDate =

            today;

    }

    /*

       Record daily history

    */

    data.history[today] = {

        points:

            data.pointsToday

    };

    save(data);

    renderStats();

    return data;

}

/* ---------------------------------------------------------

   HEADER

   --------------------------------------------------------- */

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

/* ---------------------------------------------------------

   INSERT HEADER

   --------------------------------------------------------- */

function injectHeader() {

    document.body.insertAdjacentHTML(

        "afterbegin",

        headerHTML()

    );

    renderStats();

}

/* ---------------------------------------------------------

   UPDATE UI

   --------------------------------------------------------- */

function renderStats() {

    let data =

        updateDay(load());

    /*

       Points

    */

    document

        .querySelectorAll("[data-points]")

        .forEach(element => {

            element.textContent =

                data.points.toLocaleString();

        });

    /*

       Gems

    */

    document

        .querySelectorAll("[data-gems]")

        .forEach(element => {

            element.textContent =

                data.gems.toLocaleString();

        });

    /*

       Streak

    */

    document

        .querySelectorAll("[data-streak]")

        .forEach(element => {

            element.textContent =

                data.streak;

        });

    /*

       Today's points

    */

    document

        .querySelectorAll("[data-today]")

        .forEach(element => {

            element.textContent =

                data.pointsToday;

        });

    /*

       Daily goal

    */

    document

        .querySelectorAll("[data-goal]")

        .forEach(element => {

            element.textContent =

                data.dailyGoal;

        });

    /*

       Progress bar

    */

    document

        .querySelectorAll("[data-progress]")

        .forEach(element => {

            const percentage =

                Math.min(

                    100,

                    (

                        data.pointsToday

                        /

                        data.dailyGoal

                    ) * 100

                );

            element.style.width =

                percentage + "%";

        });

    /*

       Name

    */

    document

        .querySelectorAll("[data-name]")

        .forEach(element => {

            element.textContent =

                data.name;

        });

    /*

       Subject

    */

    document

        .querySelectorAll("[data-subject]")

        .forEach(element => {

            const subject =

                SUBJECTS[data.subject];

            if (subject) {

                element.textContent =

                    subject.name;

            }

        });

}

/* ---------------------------------------------------------

   RESET

   --------------------------------------------------------- */

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

/* ---------------------------------------------------------

   KEEP MULTIPLE OPEN TABS IN SYNC

   --------------------------------------------------------- */

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
