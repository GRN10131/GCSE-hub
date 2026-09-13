/* =========================================================
   GCSE HUB — EXAM PRACTICE QUESTION BANK
   =========================================================

   Exam Practice is different from Quick Quiz.

   Students:
   - read an exam-style question
   - type their answer
   - reveal the model answer
   - self-mark their response
   - can request teacher help

   Fields:

   id
   subject
   board
   level
   paper
   topic
   subtopic
   marks
   question
   commandWord
   modelAnswer
   markScheme
   ========================================================= */


const EXAM_PRACTICE_QUESTIONS = [

    /* =====================================================
       BIOLOGY — CELL BIOLOGY
       AQA GCSE 8461 — HIGHER
       ===================================================== */

    {
        id: "bio-exam-001",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Cell Biology",
        subtopic: "Animal and plant cells",

        marks: 4,

        commandWord: "Explain",

        question:
            "Explain how the structure of a root hair cell is adapted for absorbing water and mineral ions from the soil.",

        modelAnswer:
            "Root hair cells have a long extension that gives the cell a large surface area for absorbing substances. They have a thin cell wall, giving a short distance for substances to travel. They contain many mitochondria to provide energy for active transport of mineral ions.",

        markScheme: [
            "Large surface area / long root hair",
            "Short diffusion distance / thin cell wall",
            "Many mitochondria provide energy",
            "Active transport of mineral ions"
        ]

    },


    {
        id: "bio-exam-002",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Cell Biology",
        subtopic: "Microscopy",

        marks: 3,

        commandWord: "Calculate",

        question:
            "A student observes a cell using a microscope. The image of the cell is 24 mm long. The actual length of the cell is 0.08 mm.\n\nCalculate the magnification of the image.",

        modelAnswer:
            "Magnification = image size ÷ actual size\n\n24 ÷ 0.08 = 300\n\nThe magnification is ×300.",

        markScheme: [
            "Correct equation: image size ÷ actual size",
            "24 ÷ 0.08",
            "300 / ×300"
        ]

    },


    {
        id: "bio-exam-003",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Cell Biology",
        subtopic: "Cell division",

        marks: 4,

        commandWord: "Explain",

        question:
            "Explain why DNA must replicate before a cell divides by mitosis.",

        modelAnswer:
            "DNA replicates before mitosis so that there are two copies of the genetic material. When the nucleus divides, each daughter cell receives a complete set of genetic information. This means the daughter cells are genetically identical to the original cell.",

        markScheme: [
            "DNA replicates",
            "Two copies of genetic material are produced",
            "Each daughter cell receives a complete set of genetic information",
            "Daughter cells are genetically identical"
        ]

    },


    {
        id: "bio-exam-004",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Cell Biology",
        subtopic: "Osmosis",

        marks: 5,

        commandWord: "Describe",

        question:
            "Describe what happens to a plant cell when it is placed in a solution with a higher water concentration than the cell contents.",

        modelAnswer:
            "Water enters the plant cell by osmosis through the partially permeable cell membrane. Water moves from the dilute solution into the more concentrated cell contents. The vacuole becomes larger and the cell becomes turgid. The cell wall prevents the cell from bursting.",

        markScheme: [
            "Water enters the cell",
            "Movement is by osmosis",
            "Water moves through a partially permeable membrane",
            "Cell becomes turgid",
            "Cell wall prevents bursting"
        ]

    },


    {
        id: "bio-exam-005",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Cell Biology",
        subtopic: "Active transport",

        marks: 4,

        commandWord: "Compare",

        question:
            "Compare diffusion and active transport.",

        modelAnswer:
            "Diffusion is the net movement of particles from a higher concentration to a lower concentration and does not require energy from respiration. Active transport moves substances from a lower concentration to a higher concentration and requires energy from respiration.",

        markScheme: [
            "Diffusion moves from high to low concentration",
            "Diffusion does not require energy",
            "Active transport moves from low to high concentration",
            "Active transport requires energy"
        ]

    },


    /* =====================================================
       BIOLOGY — ORGANISATION
       ===================================================== */

    {
        id: "bio-exam-006",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Organisation",
        subtopic: "Digestive system",

        marks: 4,

        commandWord: "Explain",

        question:
            "Explain how the small intestine is adapted for absorbing the products of digestion.",

        modelAnswer:
            "The small intestine contains many villi, which provide a large surface area. The villi have a thin wall, giving a short diffusion distance. They contain a good blood supply that maintains concentration gradients. Microvilli further increase the surface area.",

        markScheme: [
            "Large surface area due to villi",
            "Thin wall / short diffusion distance",
            "Good blood supply",
            "Microvilli increase surface area"
        ]

    },


    {
        id: "bio-exam-007",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Organisation",
        subtopic: "Enzymes",

        marks: 5,

        commandWord: "Explain",

        question:
            "Explain why an enzyme may stop working when the temperature becomes too high.",

        modelAnswer:
            "Increasing temperature gives enzyme and substrate particles more kinetic energy, increasing the rate of reaction up to the optimum temperature. At temperatures above the optimum, bonds holding the enzyme's structure together can break. The active site changes shape and the substrate is no longer complementary to it. The enzyme is denatured.",

        markScheme: [
            "Particles gain kinetic energy as temperature increases",
            "Rate increases up to optimum temperature",
            "High temperature breaks bonds",
            "Active site changes shape",
            "Enzyme becomes denatured"
        ]

    },


    /* =====================================================
       BIOLOGY — INFECTION AND RESPONSE
       ===================================================== */

    {
        id: "bio-exam-008",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Infection and Response",
        subtopic: "Pathogens",

        marks: 4,

        commandWord: "Explain",

        question:
            "Explain how bacteria can cause disease in humans.",

        modelAnswer:
            "Bacteria can reproduce rapidly inside the body. They can produce toxins that damage cells and tissues. The toxins can interfere with normal body functions and cause symptoms of disease.",

        markScheme: [
            "Bacteria reproduce rapidly",
            "Bacteria produce toxins",
            "Toxins damage cells or tissues",
            "Damage causes symptoms"
        ]

    },


    {
        id: "bio-exam-009",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Infection and Response",
        subtopic: "Vaccination",

        marks: 6,

        commandWord: "Explain",

        question:
            "Explain how vaccination can protect a population from a communicable disease.",

        modelAnswer:
            "A vaccine introduces harmless forms of a pathogen or its antigens into the body. This stimulates white blood cells to produce antibodies. Memory cells are also produced. If the same pathogen enters the body later, the memory cells allow a faster and larger antibody response, destroying the pathogen before serious illness develops. If enough people are vaccinated, the pathogen has fewer opportunities to spread through the population.",

        markScheme: [
            "Vaccine contains harmless pathogen / antigens",
            "Stimulates white blood cells",
            "Antibodies are produced",
            "Memory cells are produced",
            "Faster secondary response",
            "Reduced spread through population"
        ]

    },


    /* =====================================================
       BIOLOGY — BIOENERGETICS
       ===================================================== */

    {
        id: "bio-exam-010",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Bioenergetics",
        subtopic: "Photosynthesis",

        marks: 4,

        commandWord: "Explain",

        question:
            "Explain why increasing light intensity increases the rate of photosynthesis, up to a point.",

        modelAnswer:
            "Light provides energy for photosynthesis. Increasing light intensity increases the amount of light energy available, so the rate of photosynthesis increases. Eventually another factor, such as carbon dioxide concentration or temperature, becomes limiting, so increasing light intensity further has little or no effect.",

        markScheme: [
            "Light provides energy",
            "Greater light intensity provides more energy",
            "Rate of photosynthesis increases",
            "Another factor becomes limiting"
        ]

    },


    {
        id: "bio-exam-011",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 1",

        topic: "Bioenergetics",
        subtopic: "Respiration",

        marks: 5,

        commandWord: "Compare",

        question:
            "Compare aerobic respiration and anaerobic respiration in humans.",

        modelAnswer:
            "Aerobic respiration uses oxygen and releases a large amount of energy from glucose. Anaerobic respiration occurs without oxygen and releases less energy. In human muscle cells, anaerobic respiration produces lactic acid.",

        markScheme: [
            "Aerobic respiration uses oxygen",
            "Aerobic respiration releases more energy",
            "Anaerobic respiration occurs without oxygen",
            "Anaerobic respiration releases less energy",
            "Lactic acid is produced in human muscles"
        ]

    },


    /* =====================================================
       BIOLOGY — HOMEOSTASIS
       ===================================================== */

    {
        id: "bio-exam-012",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 2",

        topic: "Homeostasis and Response",
        subtopic: "Blood glucose",

        marks: 6,

        commandWord: "Explain",

        question:
            "Explain how the body controls blood glucose concentration when it becomes too high.",

        modelAnswer:
            "The pancreas detects that blood glucose concentration is too high and releases insulin. Insulin causes glucose to move from the blood into cells. It also causes the liver and muscles to convert glucose into glycogen for storage. This lowers the blood glucose concentration back towards the normal level.",

        markScheme: [
            "Pancreas detects high blood glucose",
            "Insulin is released",
            "Glucose moves into cells",
            "Glucose is converted to glycogen",
            "Liver and muscles store glycogen",
            "Blood glucose concentration falls"
        ]

    },


    /* =====================================================
       BIOLOGY — ECOLOGY
       ===================================================== */

    {
        id: "bio-exam-013",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 2",

        topic: "Ecology",
        subtopic: "Food chains",

        marks: 4,

        commandWord: "Explain",

        question:
            "Explain why only a small proportion of the energy in one trophic level is transferred to the next trophic level.",

        modelAnswer:
            "Energy is lost through respiration and released as heat. Some material is not eaten and therefore is not transferred. Some parts of organisms are not digested and are lost in faeces. Energy is also lost in urine.",

        markScheme: [
            "Energy lost through respiration",
            "Energy released as heat",
            "Some material is not eaten",
            "Some material is lost in faeces / urine"
        ]

    },


    {
        id: "bio-exam-014",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 2",

        topic: "Ecology",
        subtopic: "Sampling",

        marks: 5,

        commandWord: "Describe",

        question:
            "Describe how a student could use quadrats to estimate the abundance of a plant species in a field.",

        modelAnswer:
            "The student should place quadrats randomly throughout the field. They should count the number of plants of the chosen species in each quadrat. They should repeat the measurements at several locations to obtain reliable results. The mean number of plants per quadrat can then be calculated and used to estimate the abundance in the whole field.",

        markScheme: [
            "Use quadrats",
            "Place quadrats randomly",
            "Count organisms",
            "Repeat sampling",
            "Calculate a mean / use results to estimate abundance"
        ]

    },


    /* =====================================================
       BIOLOGY — GENETICS
       ===================================================== */

    {
        id: "bio-exam-015",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 2",

        topic: "Inheritance, Variation and Evolution",
        subtopic: "Genetic inheritance",

        marks: 5,

        commandWord: "Explain",

        question:
            "Explain how two parents who do not have cystic fibrosis can have a child with cystic fibrosis.",

        modelAnswer:
            "Cystic fibrosis is caused by a recessive allele. Both parents can be carriers because they each have one dominant normal allele and one recessive cystic fibrosis allele. Each parent can pass the recessive allele to their child. If the child inherits the recessive allele from both parents, they will have cystic fibrosis.",

        markScheme: [
            "Cystic fibrosis is recessive",
            "Both parents can be carriers",
            "Each parent has a recessive allele",
            "Child inherits recessive allele from both parents",
            "Child has two recessive alleles"
        ]

    },


    {
        id: "bio-exam-016",

        subject: "biology",
        board: "AQA",
        level: "Higher",

        paper: "Paper 2",

        topic: "Inheritance, Variation and Evolution",
        subtopic: "Evolution",

        marks: 6,

        commandWord: "Explain",

        question:
            "Explain how natural selection can cause a population of bacteria to become resistant to an antibiotic.",

        modelAnswer:
            "Random mutations can produce bacteria with an allele that gives antibiotic resistance. When the antibiotic is used, non-resistant bacteria are killed while resistant bacteria survive. The resistant bacteria reproduce and pass the resistance allele to their offspring. Over generations, the proportion of resistant bacteria increases.",

        markScheme: [
            "Random mutation produces variation",
            "Some bacteria have resistance",
            "Antibiotic kills non-resistant bacteria",
            "Resistant bacteria survive",
            "Resistant bacteria reproduce and pass on allele",
            "Proportion of resistant bacteria increases"
        ]

    }

];
