let limit = 5;
async function fetchData() {
  try {
    const response = await fetch(
      `https://quizapi.io/api/v1/questions?apiKey=NFbXqVAcMrioUysvqBpFNWQpdVMNSFS1t1NHTvL6&limit=${limit}`
    );
    const data = await response.json();
    showQuestions(data.length, data);
    if (!response.ok) {
      throw new Error(`HTTP error! Status:${response.status}`);
    }
    return data;
  } catch (error) {
    throw new Error("Error fetching data:", error);
  }
}
const landingPage = document.getElementById("main-container");
const addBtn = document.getElementById("create");
const takeAQuizBtn = document.getElementById("take-quiz");
const formClass = document.querySelector(".form");
const closeBtn = document.querySelector(".fa-close");
const bodyContainer = document.body;
const questionContainer = document.getElementById("question-container");
const popUp = document.getElementById("pop-up");
const questionP = document.querySelectorAll(".question-p");
const objectClass = document.querySelector(".object");
const optQuestion = document.getElementById("get-question");
const optA = document.getElementById("opt-a");
const optB = document.getElementById("opt-b");
const optC = document.getElementById("opt-c");
const optD = document.getElementById("opt-d");
const correctOpt = document.getElementById("correct-opt");
let closeBtnStyle =
  "font-size: 38px;margin: 40px;left: 90%;position: relative;color: darkred;cursor: pointer;pointer-events: all;";
let index = 0;
let quizData = [];
let count = 1;
let score = 0;
let abcd = ["a", "b", "c", "d"];
function counter() {
  if (count === quizData.length) {
    count = 1;
  } else {
    count++;
  }
  return count;
}
// function dataHandle() {
//   let val = "true";

// }
function showQuestions(dataLength, values) {
  quizData = values;
  console.log(quizData);
  // console.log(quizData[index].correct_answers);
  // console.log(dataLength, values[index].correct_answers.answer_a_correct);

  return (questionContainer.innerHTML = `<div id="question-number">question ${count}/${dataLength}</div>
      <div id="questions">
        <p class="question">${values[index].question}</p>
        ${abcd
          .map((item) => {
            return `<div class="inner-question-container">
                    <p class="option">${item}</p>
                    <p class="question-p">${
                      values[index].answers["answer_" + item]
                    }</p></div>`;
          })
          .join("")}</div>`);
}
function popUpForScore() {
  // questionP.forEach((item) => {
  //   item.style.pointerEvents = "none";
  // });
  questionContainer.style.pointerEvents = "none";
  closeBtn.style.zIndex = "1";
  popUp.style.visibility = "visible";
  popUp.innerHTML = `${
    score <= 30
      ? `<h1 style="color:red;">Score :${score}</h1>`
      : `
    <h1 style="color:green;">Score :${score}</h1>`
  }`;
  return popUp;
}
function nexQuestion() {
  if (index < quizData.length) {
    // counter;
    // count++;
    showQuestions(quizData.length, quizData);
  } else {
    popUpForScore();
  }
}
function visibilityHandleOfLandingPage(alive) {
  addBtn.style.pointerEvents = alive;
  takeAQuizBtn.style.pointerEvents = alive;
}
function handleClickBtn(e) {
  const event = e.target;
  if (event.id === "create") {
    closeBtn.style = closeBtnStyle;
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
    objectClass.style.visibility = "visible";
    visibilityHandleOfLandingPage("none");
  } else if (event.id === "take-quiz") {
    if (index < quizData.length) {
      // counter;
      // count++;
      showQuestions(quizData.length, quizData);
    }
    score = 0;
    index = 0;
    visibilityHandleOfLandingPage("none");
    landingPage.style.height = "0";
    questionP.forEach((item) => (item.style.pointerEvents = "fill"));
    questionContainer.style.width = "0";
    landingPage.style.visibility = "hidden";
    closeBtn.style = closeBtnStyle;
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
    questionContainer.style.visibility = "visible";
  } else if (event.className === "fa fa-close") {
    score = 0;
    index = 0;
    objectClass.style.visibility = "hidden";
    visibilityHandleOfLandingPage("visible");
    landingPage.style.height = "";
    questionContainer.style.width = "";
    landingPage.style.visibility = "visible";
    questionContainer.style.visibility = "hidden";
    closeBtn.style = "font-size: 0px;margin: 0px;";
    formClass.classList.remove("form-class");
    popUp.style.visibility = "hidden";
  } else if (event.classList.contains("question-p")) {
    console.log(event.previousElementSibling.innerText);
    let selectedAnswer = event.previousElementSibling.innerText
      .trim()
      .toLowerCase(event.previousElementSibling);
    let correctKey = `answer_${selectedAnswer}_correct`;
    let isCorrect = quizData[index].correct_answers[correctKey] === "true";
    if (isCorrect) {
      score += 10;
    }
    index++;
    counter();
    nexQuestion();
    console.log(score);
  } else if (event.id === "submit") {
    // let val = "";
    // console.log(correctOpt.value)
    // abcd.forEach((item) => {
    //   correctOpt.value.toLowerCase() === item
    //     ? (val = "true")
    //     : (val = "false");
    // });

    limit += 1;
    index++;
    quizData.unshift({
      question: optQuestion.value,
      answers: {
        answer_a: optA.value,
        answer_b: optB.value,
        answer_c: optC.value,
        answer_d: optD.value,
      },
      correct_answers: {
        answer_a_correct:
          correctOpt.value.toLowerCase() === "a" ? "true" : "false",
        answer_b_correct:
          correctOpt.value.toLowerCase() === "b" ? "true" : "false",
        answer_c_correct:
          correctOpt.value.toLowerCase() === "c" ? "true" : "false",
        answer_d_correct:
          correctOpt.value.toLowerCase() === "d" ? "true" : "false",
      },
    });
    optQuestion.value = "";
    optA.value = "";
    optB.value = "";
    optC.value = "";
    optD.value = "";
    correctOpt.value = "";
    console.log(quizData);
    console.log(event.id);
    alert("Data is submited");
  }
  console.log(event);
}
fetchData();
// events
document.body.addEventListener("click", handleClickBtn);
