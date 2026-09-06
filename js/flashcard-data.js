/* =========================================================
   GCSE HUB — FLASHCARD DATABASE
   VERSION 2

   Each card has a unique ID.

   The ID is extremely important because GCSE Hub uses it
   to remember the student's performance on individual cards.
   ========================================================= */


const FLASHCARDS = [

    /* =====================================================
       MATHS
       ===================================================== */

    {
        id: "maths-algebra-001",
        subject: "maths",
        board: "Pearson",
        level: "Higher",
        topic: "Algebra",

        question:
            "What is the gradient of the line y = 3x + 5?",

        answer:
            "The gradient is 3."
    },

    {
        id: "maths-algebra-002",
        subject: "maths",
        board: "Pearson",
        level: "Higher",
        topic: "Algebra",

        question:
            "Expand (x + 4)(x + 2).",

        answer:
            "x² + 6x + 8."
    },

    {
        id: "maths-algebra-003",
        subject: "maths",
        board: "Pearson",
        level: "Higher",
        topic: "Algebra",

        question:
            "What is the solution to 2x + 6 = 14?",

        answer:
            "x = 4."
    },

    {
        id: "maths-number-001",
        subject: "maths",
        board: "Pearson",
        level: "Higher",
        topic: "Number",

        question:
            "What is the reciprocal of 5?",

        answer:
            "The reciprocal is 1/5."
    },

    {
        id: "maths-number-002",
        subject: "maths",
        board: "Pearson",
        level: "Higher",
        topic: "Number",

        question:
            "What is 15% of 200?",

        answer:
            "30."
    },

    {
        id: "maths-geometry-001",
        subject: "maths",
        board: "Pearson",
        level: "Higher",
        topic: "Geometry",

        question:
            "What is the sum of the interior angles of a triangle?",

        answer:
            "180°."
    },


    /* =====================================================
       BIOLOGY
       ===================================================== */

    {
        id: "biology-cells-001",
        subject: "biology",
        board: "AQA",
        topic: "Cell Biology",

        question:
            "What is the function of the nucleus?",

        answer:
            "The nucleus contains genetic material and controls the activities of the cell."
    },

    {
        id: "biology-cells-002",
        subject: "biology",
        board: "AQA",
        topic: "Cell Biology",

        question:
            "What is the function of mitochondria?",

        answer:
            "Mitochondria are the site of aerobic respiration, where energy is released."
    },

    {
        id: "biology-cells-003",
        subject: "biology",
        board: "AQA",
        topic: "Cell Biology",

        question:
            "What is the function of the cell membrane?",

        answer:
            "The cell membrane controls the movement of substances into and out of the cell."
    },

    {
        id: "biology-bioenergetics-001",
        subject: "biology",
        board: "AQA",
        topic: "Bioenergetics",

        question:
            "What is the role of chlorophyll in photosynthesis?",

        answer:
            "Chlorophyll absorbs light energy, which provides the energy needed for photosynthesis."
    },

    {
        id: "biology-bioenergetics-002",
        subject: "biology",
        board: "AQA",
        topic: "Bioenergetics",

        question:
            "What are the two products of photosynthesis?",

        answer:
            "Glucose and oxygen."
    },

    {
        id: "biology-infection-001",
        subject: "biology",
        board: "AQA",
        topic: "Infection and Response",

        question:
            "What is a pathogen?",

        answer:
            "A pathogen is a microorganism that causes disease."
    },


    /* =====================================================
       CHEMISTRY
       ===================================================== */

    {
        id: "chemistry-atomic-001",
        subject: "chemistry",
        board: "AQA",
        topic: "Atomic Structure",

        question:
            "What is the relative charge of an electron?",

        answer:
            "−1."
    },

    {
        id: "chemistry-atomic-002",
        subject: "chemistry",
        board: "AQA",
        topic: "Atomic Structure",

        question:
            "Where are protons found?",

        answer:
            "Protons are found in the nucleus of an atom."
    },

    {
        id: "chemistry-atomic-003",
        subject: "chemistry",
        board: "AQA",
        topic: "Atomic Structure",

        question:
            "What determines the atomic number of an element?",

        answer:
            "The number of protons in its nucleus."
    },


    /* =====================================================
       PHYSICS
       ===================================================== */

    {
        id: "physics-energy-001",
        subject: "physics",
        board: "AQA",
        topic: "Energy",

        question:
            "What is the equation for kinetic energy?",

        answer:
            "Kinetic energy = ½ × mass × velocity²."
    },

    {
        id: "physics-energy-002",
        subject: "physics",
        board: "AQA",
        topic: "Energy",

        question:
            "What is the unit of energy?",

        answer:
            "The joule (J)."
    },

    {
        id: "physics-forces-001",
        subject: "physics",
        board: "AQA",
        topic: "Forces",

        question:
            "What is the unit of force?",

        answer:
            "The newton (N)."
    },


    /* =====================================================
       HISTORY
       ===================================================== */

    {
        id: "history-medicine-001",
        subject: "history",
        board: "Pearson",
        topic: "Medicine",

        question:
            "What was one major belief about the cause of illness in medieval England?",

        answer:
            "Many people believed illness could be caused by an imbalance of the four humours."
    },

    {
        id: "history-medicine-002",
        subject: "history",
        board: "Pearson",
        topic: "Medicine",

        question:
            "Who developed the theory of evolution by natural selection?",

        answer:
            "Charles Darwin."
    },

    {
        id: "history-medicine-003",
        subject: "history",
        board: "Pearson",
        topic: "Medicine",

        question:
            "Who developed the first successful smallpox vaccination?",

        answer:
            "Edward Jenner."
    },


    /* =====================================================
       SPANISH
       ===================================================== */

    {
        id: "spanish-identity-001",
        subject: "spanish",
        board: "Pearson",
        level: "Higher",
        topic: "Identity and Culture",

        question:
            "How would you say 'I get on well with my friends' in Spanish?",

        answer:
            "Me llevo bien con mis amigos."
    },

    {
        id: "spanish-identity-002",
        subject: "spanish",
        board: "Pearson",
        level: "Higher",
        topic: "Identity and Culture",

        question:
            "How would you say 'I am quite sociable' in Spanish?",

        answer:
            "Soy bastante sociable."
    },

    {
        id: "spanish-local-001",
        subject: "spanish",
        board: "Pearson",
        level: "Higher",
        topic: "Local Area",

        question:
            "How would you say 'I would like to visit Spain'?",

        answer:
            "Me gustaría visitar España."
    },


    /* =====================================================
       SYSTEMS PROGRAMMABLE ENGINEERING
       OCR
       ===================================================== */

    {
        id: "systems-digital-001",
        subject: "systems",
        board: "OCR",
        topic: "Digital Systems",

        question:
            "What is the purpose of a microcontroller in an embedded system?",

        answer:
            "A microcontroller processes inputs and controls outputs according to programmed instructions."
    },

    {
        id: "systems-digital-002",
        subject: "systems",
        board: "OCR",
        topic: "Digital Systems",

        question:
            "What is a digital signal?",

        answer:
            "A digital signal represents information using discrete values, commonly binary 0s and 1s."
    },

    {
        id: "systems-digital-003",
        subject: "systems",
        board: "OCR",
        topic: "Digital Systems",

        question:
            "What is binary?",

        answer:
            "Binary is a number system that uses only the digits 0 and 1."
    }

];
