/* =========================================================
   GCSE HUB — QUIZ QUESTION BANK
   =========================================================
   Separate question bank for Quick Quiz.

   Question types currently supported:
   - multiple-choice
   - true-false

   Each question contains:
   id
   subject
   board
   level
   topic
   subtopic
   difficulty
   type
   question
   options
   answer
   explanation
   points
   ========================================================= */

const QUIZ_QUESTIONS = [

    /* =====================================================
       BIOLOGY — CELL BIOLOGY
       AQA GCSE 8461 — HIGHER
       ===================================================== */

    {
        id: "bio-quiz-001",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Animal and plant cells",
        difficulty: "Easy",
        type: "multiple-choice",

        question: "Which structure contains the genetic material in an animal cell?",

        options: [
            "Nucleus",
            "Cytoplasm",
            "Cell membrane",
            "Mitochondrion"
        ],

        answer: "Nucleus",

        explanation: "The nucleus contains the genetic material and controls the activities of the cell.",

        points: 1
    },


    {
        id: "bio-quiz-002",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Animal and plant cells",
        difficulty: "Easy",
        type: "multiple-choice",

        question: "Which structure is found in plant cells but not animal cells?",

        options: [
            "Cell wall",
            "Cell membrane",
            "Cytoplasm",
            "Ribosomes"
        ],

        answer: "Cell wall",

        explanation: "Plant cells have a cellulose cell wall. Animal cells do not have a cell wall.",

        points: 1
    },


    {
        id: "bio-quiz-003",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Animal and plant cells",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "Which structure is the site of aerobic respiration in a cell?",

        options: [
            "Mitochondrion",
            "Nucleus",
            "Ribosome",
            "Cell wall"
        ],

        answer: "Mitochondrion",

        explanation: "Aerobic respiration takes place in mitochondria, releasing energy from glucose.",

        points: 1
    },


    {
        id: "bio-quiz-004",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Animal and plant cells",
        difficulty: "Medium",
        type: "true-false",

        question: "Ribosomes are the structures where proteins are made.",

        options: [
            "True",
            "False"
        ],

        answer: "True",

        explanation: "Ribosomes are the site of protein synthesis.",

        points: 1
    },


    {
        id: "bio-quiz-005",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Animal and plant cells",
        difficulty: "Easy",
        type: "multiple-choice",

        question: "What is the main function of the cell membrane?",

        options: [
            "Controls what enters and leaves the cell",
            "Contains the genetic material",
            "Releases energy from glucose",
            "Makes proteins"
        ],

        answer: "Controls what enters and leaves the cell",

        explanation: "The cell membrane controls the movement of substances into and out of the cell.",

        points: 1
    },


    {
        id: "bio-quiz-006",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Specialised cells",
        difficulty: "Easy",
        type: "multiple-choice",

        question: "Which feature of a sperm cell helps it reach an egg cell?",

        options: [
            "Flagellum",
            "Large vacuole",
            "Cellulose cell wall",
            "Chloroplasts"
        ],

        answer: "Flagellum",

        explanation: "A sperm cell has a flagellum, which allows it to swim towards an egg cell.",

        points: 1
    },


    {
        id: "bio-quiz-007",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Specialised cells",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "Why do root hair cells have a large surface area?",

        options: [
            "To increase the absorption of water and mineral ions",
            "To increase the rate of photosynthesis",
            "To make the cell divide faster",
            "To store more genetic material"
        ],

        answer: "To increase the absorption of water and mineral ions",

        explanation: "The large surface area of a root hair cell increases its ability to absorb water and mineral ions from the soil.",

        points: 1
    },


    {
        id: "bio-quiz-008",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Microscopy",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "Which equation is used to calculate magnification?",

        options: [
            "Magnification = image size ÷ actual size",
            "Magnification = actual size ÷ image size",
            "Magnification = image size × actual size",
            "Magnification = actual size − image size"
        ],

        answer: "Magnification = image size ÷ actual size",

        explanation: "Magnification is calculated by dividing the image size by the actual size of the object.",

        points: 1
    },


    {
        id: "bio-quiz-009",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Microscopy",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "An image of a cell is 20 mm wide. The actual cell is 0.05 mm wide. What is the magnification?",

        options: [
            "400",
            "40",
            "100",
            "0.0025"
        ],

        answer: "400",

        explanation: "Magnification = image size ÷ actual size = 20 ÷ 0.05 = 400.",

        points: 2
    },


    {
        id: "bio-quiz-010",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Microscopy",
        difficulty: "Hard",
        type: "multiple-choice",

        question: "Which type of microscope generally provides the greatest magnification and resolution?",

        options: [
            "Electron microscope",
            "Light microscope",
            "Hand lens",
            "Dissecting microscope"
        ],

        answer: "Electron microscope",

        explanation: "Electron microscopes have much greater magnification and resolution than light microscopes.",

        points: 1
    },


    {
        id: "bio-quiz-011",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell division",
        difficulty: "Easy",
        type: "multiple-choice",

        question: "What process produces two genetically identical daughter cells?",

        options: [
            "Mitosis",
            "Meiosis",
            "Fertilisation",
            "Diffusion"
        ],

        answer: "Mitosis",

        explanation: "Mitosis produces two genetically identical daughter cells used for growth and repair.",

        points: 1
    },


    {
        id: "bio-quiz-012",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell division",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "Why must DNA replicate before a cell divides by mitosis?",

        options: [
            "So each daughter cell receives a copy of the genetic material",
            "So the cell can produce more glucose",
            "So the cell membrane becomes thicker",
            "So the cell can absorb more water"
        ],

        answer: "So each daughter cell receives a copy of the genetic material",

        explanation: "DNA replicates before mitosis so that each daughter cell receives the genetic information needed to function.",

        points: 1
    },


    {
        id: "bio-quiz-013",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell division",
        difficulty: "Medium",
        type: "true-false",

        question: "Cancer can occur when cells divide uncontrollably.",

        options: [
            "True",
            "False"
        ],

        answer: "True",

        explanation: "Cancer can develop when changes cause cells to divide uncontrollably and form tumours.",

        points: 1
    },


    {
        id: "bio-quiz-014",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Stem cells",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "What is a stem cell?",

        options: [
            "An undifferentiated cell that can develop into other cell types",
            "A cell that can only carry oxygen",
            "A cell that has permanently stopped dividing",
            "A cell found only in the nervous system"
        ],

        answer: "An undifferentiated cell that can develop into other cell types",

        explanation: "Stem cells are undifferentiated cells that can divide and develop into different types of specialised cells.",

        points: 1
    },


    {
        id: "bio-quiz-015",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Diffusion",
        difficulty: "Easy",
        type: "multiple-choice",

        question: "What is diffusion?",

        options: [
            "The net movement of particles from a higher concentration to a lower concentration",
            "The movement of water from a dilute solution to a concentrated solution",
            "The movement of particles from a lower concentration to a higher concentration using energy",
            "The splitting of glucose to release energy"
        ],

        answer: "The net movement of particles from a higher concentration to a lower concentration",

        explanation: "Diffusion is the net movement of particles down a concentration gradient.",

        points: 1
    },


    {
        id: "bio-quiz-016",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Diffusion",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "Which change would generally increase the rate of diffusion?",

        options: [
            "Increasing the concentration gradient",
            "Decreasing the temperature",
            "Decreasing the surface area",
            "Increasing the diffusion distance"
        ],

        answer: "Increasing the concentration gradient",

        explanation: "A larger concentration gradient increases the difference in concentration and generally increases the rate of diffusion.",

        points: 1
    },


    {
        id: "bio-quiz-017",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Osmosis",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "What is osmosis?",

        options: [
            "The net movement of water through a partially permeable membrane",
            "The movement of glucose through a cell membrane",
            "The movement of oxygen from low concentration to high concentration",
            "The movement of mineral ions using energy"
        ],

        answer: "The net movement of water through a partially permeable membrane",

        explanation: "Osmosis is the net movement of water through a partially permeable membrane from a dilute solution towards a more concentrated solution.",

        points: 1
    },


    {
        id: "bio-quiz-018",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Osmosis",
        difficulty: "Hard",
        type: "multiple-choice",

        question: "A plant cell is placed in a very dilute solution. What is most likely to happen?",

        options: [
            "Water enters the cell by osmosis",
            "Water leaves the cell by osmosis",
            "The cell immediately loses its cell wall",
            "The cell stops all movement of water"
        ],

        answer: "Water enters the cell by osmosis",

        explanation: "Water moves into the plant cell by osmosis when the surrounding solution is more dilute than the cell contents.",

        points: 1
    },


    {
        id: "bio-quiz-019",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Active transport",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "Which process moves substances against a concentration gradient using energy?",

        options: [
            "Active transport",
            "Diffusion",
            "Osmosis",
            "Filtration"
        ],

        answer: "Active transport",

        explanation: "Active transport uses energy to move substances from a lower concentration to a higher concentration.",

        points: 1
    },


    {
        id: "bio-quiz-020",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Active transport",
        difficulty: "Medium",
        type: "true-false",

        question: "Active transport requires energy released by respiration.",

        options: [
            "True",
            "False"
        ],

        answer: "True",

        explanation: "Active transport requires energy, which is supplied by respiration.",

        points: 1
    },


    {
        id: "bio-quiz-021",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell cycle",
        difficulty: "Hard",
        type: "multiple-choice",

        question: "Which sequence correctly describes the main stages before and during mitosis?",

        options: [
            "DNA replication → nucleus divides → cell divides",
            "Cell divides → DNA replicates → nucleus divides",
            "Nucleus divides → DNA replicates → cell divides",
            "DNA is destroyed → nucleus divides → cell divides"
        ],

        answer: "DNA replication → nucleus divides → cell divides",

        explanation: "Before mitosis, DNA replicates. The nucleus then divides, followed by division of the cell.",

        points: 2
    },


    {
        id: "bio-quiz-022",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell differentiation",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "What is cell differentiation?",

        options: [
            "The process by which a cell becomes specialised",
            "The process by which cells lose all their DNA",
            "The movement of particles across a membrane",
            "The production of glucose during photosynthesis"
        ],

        answer: "The process by which a cell becomes specialised",

        explanation: "Cell differentiation is the process by which an unspecialised cell develops features that allow it to perform a particular function.",

        points: 1
    },


    {
        id: "bio-quiz-023",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell transport",
        difficulty: "Hard",
        type: "multiple-choice",

        question: "Which factor would make diffusion faster across a cell membrane?",

        options: [
            "A larger concentration gradient",
            "A thicker membrane",
            "A smaller surface area",
            "A lower temperature"
        ],

        answer: "A larger concentration gradient",

        explanation: "A larger concentration gradient increases the rate at which particles diffuse across a membrane.",

        points: 1
    },


    {
        id: "bio-quiz-024",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell transport",
        difficulty: "Hard",
        type: "multiple-choice",

        question: "Why does a small cell generally exchange substances more efficiently than a large cell?",

        options: [
            "It has a larger surface-area-to-volume ratio",
            "It has no cell membrane",
            "It contains no cytoplasm",
            "It cannot carry out respiration"
        ],

        answer: "It has a larger surface-area-to-volume ratio",

        explanation: "Smaller cells have a larger surface-area-to-volume ratio, allowing substances to move into and out of the cell more efficiently.",

        points: 1
    },


    {
        id: "bio-quiz-025",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell transport",
        difficulty: "Medium",
        type: "true-false",

        question: "Osmosis involves the movement of water molecules.",

        options: [
            "True",
            "False"
        ],

        answer: "True",

        explanation: "Osmosis is specifically the net movement of water molecules through a partially permeable membrane.",

        points: 1
    },


    {
        id: "bio-quiz-026",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell transport",
        difficulty: "Hard",
        type: "multiple-choice",

        question: "Which process could allow a plant root hair cell to take in mineral ions when their concentration is lower in the soil than inside the cell?",

        options: [
            "Active transport",
            "Diffusion",
            "Osmosis",
            "Evaporation"
        ],

        answer: "Active transport",

        explanation: "Active transport allows mineral ions to be taken into root hair cells against their concentration gradient using energy.",

        points: 1
    },


    {
        id: "bio-quiz-027",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell structures",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "Which structure contains chlorophyll and is the site of photosynthesis?",

        options: [
            "Chloroplast",
            "Mitochondrion",
            "Ribosome",
            "Nucleus"
        ],

        answer: "Chloroplast",

        explanation: "Chloroplasts contain chlorophyll, which absorbs light energy for photosynthesis.",

        points: 1
    },


    {
        id: "bio-quiz-028",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell structures",
        difficulty: "Medium",
        type: "multiple-choice",

        question: "What is the function of the permanent vacuole in a plant cell?",

        options: [
            "It contains cell sap and helps maintain pressure inside the cell",
            "It contains the cell's genetic material",
            "It is the site of protein synthesis",
            "It controls what enters and leaves the cell"
        ],

        answer: "It contains cell sap and helps maintain pressure inside the cell",

        explanation: "The permanent vacuole contains cell sap and helps maintain turgor pressure in plant cells.",

        points: 1
    },


    {
        id: "bio-quiz-029",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell structures",
        difficulty: "Easy",
        type: "multiple-choice",

        question: "Which structure controls the movement of substances into and out of a cell?",

        options: [
            "Cell membrane",
            "Nucleus",
            "Ribosome",
            "Chloroplast"
        ],

        answer: "Cell membrane",

        explanation: "The cell membrane controls which substances can enter and leave the cell.",

        points: 1
    },


    {
        id: "bio-quiz-030",
        subject: "biology",
        board: "AQA",
        level: "Higher",
        topic: "Cell Biology",
        subtopic: "Cell structures",
        difficulty: "Hard",
        type: "multiple-choice",

        question: "A student observes a cell containing a nucleus, cell membrane, cytoplasm, mitochondria and ribosomes, but no cell wall or chloroplasts. What type of cell is it?",

        options: [
            "Animal cell",
            "Plant cell",
            "Bacterial cell",
            "Root hair cell"
        ],

        answer: "Animal cell",

        explanation: "The listed structures are characteristic of an animal cell. Plant cells additionally have structures such as a cellulose cell wall and chloroplasts.",

        points: 1
    }

];
