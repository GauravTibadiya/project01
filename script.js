function parseEquation(equation) {
    equation = equation.replace(/\s+/g, ''); // Remove spaces

    const [lhs, rhs] = equation.split('=');
    if (!lhs || rhs !== '0') throw new Error("Only ax + by + c = 0 format supported");

    const terms = lhs.match(/([+-]?[^+-]+)/g);
    if (!terms || terms.length < 2) throw new Error("Invalid format");

    let a = 0, b = 0, c = 0;

    terms.forEach(term => {
        if (term.includes('x')) {
            const val = term.replace('x', '') || '1';
            a = parseFloat(val === '+' ? '1' : val === '-' ? '-1' : val);
        } else if (term.includes('y')) {
            const val = term.replace('y', '') || '1';
            b = parseFloat(val === '+' ? '1' : val === '-' ? '-1' : val);
        } else {
            c = parseFloat(term);
        }
    });

    if (isNaN(a) || isNaN(b) || isNaN(c)) throw new Error("Invalid coefficients");

    return { a, b, c: -c };
}

function analyze() {
    const eq1 = document.getElementById("eq1").value;
    const eq2 = document.getElementById("eq2").value;

    try {
        const e1 = parseEquation(eq1);
        const e2 = parseEquation(eq2);

        const ratioA = (e1.a / e2.a).toFixed(2);
        const ratioB = (e1.b / e2.b).toFixed(2);
        const ratioC = (e1.c / e2.c).toFixed(2);

        let comparisonText = "";

        if (ratioA !== ratioB) {
            comparisonText = "a₁/a₂ ≠ b₁/b₂";
        } else if (ratioA === ratioB && ratioB === ratioC) {
            comparisonText = "a₁/a₂ = b₁/b₂ = c₁/c₂";
        } else {
            comparisonText = "a₁/a₂ = b₁/b₂ ≠ c₁/c₂";
        }

        let graphType = "", consistency = "", algebra = "";

        if (ratioA !== ratioB) {
            graphType = "છેદતી રેખા ";
            algebra = "માત્ર એકજ ઉકેલ ";
            consistency = "છે ";
        } else if (ratioA === ratioB && ratioB === ratioC) {
            graphType = "સંપાતી રેખા ";
            algebra = "અનંત ઉકેલ ";
            consistency = "છે ";
        } else {
            graphType = "સમાંતર રેખા ";
            algebra = " ઉકેલ ન મળે";
            consistency = "નથી ";
        }

        const output = `
<strong>સમીકરણ 1:</strong> ${eq1}<br>
<strong>સમીકરણ 2:</strong> ${eq2}<br><br>
<strong>ગુણોત્તર:</strong><br>
a₁/a₂ = ${ratioA}, b₁/b₂ = ${ratioB}, c₁/c₂ = ${ratioC}<br>
<strong>તુલના:</strong> ${comparisonText}<br><br>
<strong>આલેખાત્મક સ્વરૂપ :</strong> ${graphType}<br>
<strong>બૈજિક અર્થઘટન :</strong> ${algebra}<br>
<strong>સુસંગત :</strong> ${consistency}
`;

        const analysisBox = document.getElementById("output");
        analysisBox.innerHTML = output;
        analysisBox.style.display = "block";

        document.getElementById("quiz").style.display = "none";

    } catch (err) {
        alert("Invalid equation format. Use ax + by + c = 0 .");
    }
}

function startQuiz() {
    const eq1 = document.getElementById("eq1").value;
    const eq2 = document.getElementById("eq2").value;

    try {
        const e1 = parseEquation(eq1);
        const e2 = parseEquation(eq2);

        const ratioA = (e1.a / e2.a).toFixed(2);
        const ratioB = (e1.b / e2.b).toFixed(2);
        const ratioC = (e1.c / e2.c).toFixed(2);

        let correctAnswers = {};

        if (ratioA !== ratioB) {
            correctAnswers = { q1: "c", q2: "b", q3: "a", q4: "a" };
        } else if (ratioA === ratioB && ratioB === ratioC) {
            correctAnswers = { q1: "b", q2: "a", q3: "c", q4: "a" };
        } else {
            correctAnswers = { q1: "a", q2: "c", q3: "b", q4: "b" };
        }

        const questions = [
            {
                id: "q1",
                text: "1) આપેલ સમીકરણના ગુણોત્તર ની તુલના શું થાય?",
                options: {
                    a: "a₁/a₂ = b₁/b₂ ≠ c₁/c₂",
                    b: "a₁/a₂ = b₁/b₂ = c₁/c₂",
                    c: "a₁/a₂ ≠ b₁/b₂",
                }
            },
            {
                id: "q2",
                text: "2) આપેલ સમીકરણનું આલેખાત્મક સ્વરૂપ શું થાય?",
                options: {
                    a: "સંપાતી રેખા",
                    b: "છેદતી રેખા",
                    c: "સમાંતર રેખા"
                }
            },
            {
                id: "q3",
                text: "3) આપેલ સમીકરણ નું બૈજિક અર્થઘટન શું થાય",
                options: {
                    a: "માત્ર એકજ ઉકેલ",
                    b: "ઉકેલ ન મળે",
                    c: "અનંત ઉકેલ"
                }
            },
            {
                id: "q4",
                text: "4) આપેલ સમીકરણ સુસંગત છે કે નથી",
                options: {
                    a: "છે",
                    b: "નથી"
                }
            }
        ];

        let quizHTML = `<h3>પ્રશ્નો:</h3>`;
        questions.forEach(q => {
            quizHTML += `<p>${q.text}</p><div class="quiz-options" id="${q.id}">`;
            for (let key in q.options) {
                quizHTML += `
                    <div class="option-box" data-option="${key}" onclick="selectOption('${q.id}', '${key}', '${correctAnswers[q.id]}', this)">
                        ${key}) ${q.options[key]}
                    </div>`;
            }
            quizHTML += `</div><br>`;
        });

        const quizBox = document.getElementById("quiz");
        quizBox.innerHTML = quizHTML;
        quizBox.style.display = "block";

        document.getElementById("output").style.display = "none";

    } catch (err) {
        alert("સાચા સ્વરૂપમાં સમીકરણ લખો: ax + by + c = 0");
    }
}

function selectOption(questionId, selected, correct, element) {
    const options = document.querySelectorAll(`#${questionId} .option-box`);
    options.forEach(opt => {
        opt.classList.add('disabled');
    });

    if (selected === correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('incorrect');
        const correctBox = Array.from(options).find(opt => opt.dataset.option === correct);
        if (correctBox) correctBox.classList.add('correct');
    }
}
