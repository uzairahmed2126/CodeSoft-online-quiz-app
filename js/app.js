// get id and classes
const bodyContainer = document.body;
const landingPage = document.getElementById("main-container");
const addBtn = document.getElementById("create");
const takeAQuizBtn = document.getElementById("take-quiz");
const formClass = document.querySelector(".form");
const questionP = document.querySelectorAll(".question-p");
const closeBtn = document.querySelector(".fa-close");
const objectClass = document.querySelector(".object");
const questionContainer = document.getElementById("question-container");
const popUp = document.getElementById("pop-up");
const optQuestion = document.getElementById("get-question");
const optA = document.getElementById("opt-a");
const optB = document.getElementById("opt-b");
const optC = document.getElementById("opt-c");
const optD = document.getElementById("opt-d");
const correctOpt = document.getElementById("correct-opt");
const question = document.querySelector(".question");
const timerId = document.getElementById("timer");

// global variables
let limit = 10;
let closeBtnStyle =
  "font-size: 38px;margin: 40px;left: 80%;position: relative;color: darkred;cursor: pointer;";
let index = 0;
let quizData = [];
let count = 1;
let score = 0;
let abcd = ["a", "b", "c", "d"];
let time = 60;
let countDown;

// fetch data from API
async function fetchData() {
  try {
    const response = await fetch(
      `https://quizapi.io/api/v1/questions?apiKey=NFbXqVAcMrioUysvqBpFNWQpdVMNSFS1t1NHTvL6&limit=${limit}`
    );
    const data = await response.json();
    quizData = [...quizData, ...data];
    showQuestions(data.length, data);
    if (!response.ok) {
      throw new Error(`HTTP error! Status:${response.status}`);
    }
    return data;
  } catch (error) {
    throw new Error("Error fetching data:", error);
  }
}
// question counter handler
function counter() {
  if (count === quizData.length) {
    count = 1;
  } else {
    count++;
  }
  return count;
}
function showQuestions(dataLength, values) {
  quizData = values;
  return (questionContainer.innerHTML = `<div id="question-number"><p>question</p> <h4>${count}/${dataLength}</h4></div>
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
// score popup
function popUpForScore() {
  questionContainer.style.pointerEvents = "none";
  closeBtn.style.zIndex = "1";
  popUp.style.visibility = "visible";
  popUp.innerHTML = `${
    score <= 30
      ? `<h1 style="color:red;">Score :${score}</h1>`
      : `
    <h1 style="color:green;">Score :${score}</h1>`
  }`;
  clearInterval(countDown);
  return popUp;
}
function nexQuestion() {
  if (index < quizData.length) {
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
  const eventId = event.id;
  const eventClass = event.className;
  if (eventId === "create") {
    closeBtn.style = closeBtnStyle;
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
    objectClass.style.visibility = "visible";
    visibilityHandleOfLandingPage("none");
  } else if (eventId === "take-quiz") {
    countDown = setInterval(() => {
      timerId.textContent = time;
      if (time !== 0) {
        time--;
      } else {
        clearInterval(countDown);
        timerId.textContent = "time up!";
        timerId.style.background = "darkred";
        questionContainer.children.questions.style.visibility = "hidden";
        time = 60;
        popUpForScore();
      }
    }, 1000);
    timerId.style.visibility = "visible";
    timerId.style.background = "";
    timerId.textContent = "";
    score = 0;
    index = 0;
    let storedData = JSON.parse(localStorage.getItem("quizData"));
    if (storedData) {
      quizData = storedData;
      showQuestions(quizData.length, quizData);
    }
    visibilityHandleOfLandingPage("none");
    landingPage.style.height = "0";
    questionContainer.style.width = "0";
    landingPage.style.visibility = "hidden";
    closeBtn.style = closeBtnStyle;
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
    questionContainer.style.visibility = "visible";
  } else if (eventClass === "fa fa-close") {
    // reset the variables
    score = 0;
    index = 0;
    time = 60;
    // function calling
    nexQuestion();
    visibilityHandleOfLandingPage("visible");
    clearInterval(countDown);
    // visiblity
    timerId.style.visibility = "hidden";
    objectClass.style.visibility = "hidden";
    questionContainer.style.visibility = "hidden";
    popUp.style.visibility = "hidden";
    landingPage.style.visibility = "visible";
    // styling
    closeBtn.style = "font-size: 0px;margin: 0px;";
    landingPage.style.height = "";
    questionContainer.style.width = "";
    // clsslist
    formClass.classList.remove("form-class");
  } else if (event.classList.contains("question-p")) {
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
  } else if (eventId === "submit") {
    if (
      optQuestion.value !== "" ||
      optA.value !== "" ||
      optB.value !== "" ||
      optC.value !== "" ||
      optD.value !== ""
    ) {
      limit += 1;
    }

    index++;

    let newQuestion = {
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
    };

    // add new question into existing array
    quizData.unshift(newQuestion);

    // add whole array into LocalStorage
    localStorage.setItem("quizData", JSON.stringify(quizData));

    // reset the input values
    optQuestion.value = "";
    optA.value = "";
    optB.value = "";
    optC.value = "";
    optD.value = "";
    correctOpt.value = "";
  } else if (popUp.style.visibility === "visible") {
    questionP.forEach((item) => (item.style.pointerEvents = "none"));
  }
}
if (window.innerWidth <= 480) {
  closeBtnStyle = "";
} else if (window.innerWidth > 480) {
  closeBtnStyle = closeBtnStyle;
}
fetchData();
// events
document.body.addEventListener("click", handleClickBtn);
