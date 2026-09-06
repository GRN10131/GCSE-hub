/* =========================================================
   GCSE HUB — MIND MAP ENGINE
========================================================= */


let mapSubject = null;


/* ---------------------------------------------------------
   SUBJECT DROPDOWN
--------------------------------------------------------- */

function renderMapSubjects() {

    const data = load();

    const picker =
        document.getElementById(
            "subjectPicker"
        );


    picker.innerHTML = "";


    data.subjects.forEach(id => {

        if (!SPECIFICATION_MAP[id]) {
            return;
        }


        const subject =
            SUBJECTS[id];


        const option =
            document.createElement(
                "option"
            );


        option.value = id;


        option.textContent =

            (
                subject
                    ? subject.icon
                    : ""
            )

            +

            " "

            +

            (
                subject
                    ? subject.name
                    : id
            );


        picker.appendChild(option);

    });


    /*
     * Start with the student's current
     * subject where possible.
     */

    if (
        data.currentSubject
        &&
        SPECIFICATION_MAP[
            data.currentSubject
        ]
    ) {

        mapSubject =
            data.currentSubject;

    }

    else {

        mapSubject =
            picker.value;

    }


    picker.value =
        mapSubject;


    renderMap();

}


/* ---------------------------------------------------------
   BUILD MAP
--------------------------------------------------------- */

function renderMap() {

    const map =
        document.getElementById(
            "map"
        );


    const data =
        SPECIFICATION_MAP[
            mapSubject
        ] || {};


    map.innerHTML = "";


    Object
        .entries(data)
        .forEach(
            ([topic, subtopics]) => {


                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "map-topic";


                const heading =
                    document.createElement(
                        "h3"
                    );


                heading.textContent =
                    topic;


                box.appendChild(
                    heading
                );


                subtopics.forEach(
                    subtopic => {


                        const button =
                            document.createElement(
                                "button"
                            );


                        button.className =
                            "subtopic";


                        button.type =
                            "button";


                        button.textContent =
                            "→ " + subtopic;


                        /*
                         * Clicking a subtopic opens
                         * flashcards with the relevant
                         * subject and topic selected.
                         */

                        button.onclick =
                            () => {


                                window.location.href =

                                    "flashcards.html"

                                    +

                                    "?subject="

                                    +

                                    encodeURIComponent(
                                        mapSubject
                                    )

                                    +

                                    "&topic="

                                    +

                                    encodeURIComponent(
                                        topic
                                    )

                                    +

                                    "&subtopic="

                                    +

                                    encodeURIComponent(
                                        subtopic
                                    );

                            };


                        box.appendChild(
                            button
                        );

                    }
                );


                map.appendChild(
                    box
                );

            }
        );

}


/* ---------------------------------------------------------
   SUBJECT CHANGE
--------------------------------------------------------- */

document
    .getElementById(
        "subjectPicker"
    )
    .addEventListener(
        "change",
        event => {

            mapSubject =
                event.target.value;

            renderMap();

        }
    );


/* ---------------------------------------------------------
   START
--------------------------------------------------------- */

renderMapSubjects();
