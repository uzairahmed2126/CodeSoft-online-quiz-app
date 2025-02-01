async function fetchData() {
  try {
    const response = await fetch(
      "https://quizapi.io/api/v1/questions?apiKey=NFbXqVAcMrioUysvqBpFNWQpdVMNSFS1t1NHTvL6&limit=5"
    );
    const data = await response.json();

    showQuestions(data.length, data);

    // console.log(data);
    if (!response.ok) {
      throw new Error(`HTTP error! Status:${response.status}`);
    }
    return data;
  } catch (error) {
    throw new Error("Error fetching data:", error);
  }
}
const addBtnt = document.getElementById("create");
const takeAQuizBtn = document.getElementById("take-quiz");
const formClass = document.querySelector(".form");
const closeBtn = document.querySelector(".fa-close");
const bodyContainer = document.body;
const questionContainer = document.getElementById("question-container");
const popUp = document.getElementById("pop-up");
let closeBtnStyle =
  "font-size: 38px;margin: 40px;left: 90%;position: relative;color: darkred;cursor: pointer;pointer-events: all;";
let index = 0;
let quizData = [];
let count = 1;
let score = 0;
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
  // console.log(quizData[index].correct_answers);
  // console.log(dataLength, values[index].correct_answers.answer_a_correct);
  let abcd = ["a", "b", "c", "d"];
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

function handleClickBtn(e) {
  const event = e.target;
  if (event.id === "create") {
    closeBtn.style = closeBtnStyle;
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
  } else if (event.id === "take-quiz") {
    if (index < quizData.length) {
      // counter;
      // count++;
      showQuestions(quizData.length, quizData);
    }
    score = 0;
    index = 0;
    closeBtn.style = closeBtnStyle;
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
    questionContainer.style.visibility = "visible";
  } else if (event.className === "fa fa-close") {
    score = 0;
    index = 0;
    questionContainer.style.visibility = "hidden";
    closeBtn.style = "font-size: 0px;margin: 0px;";
    formClass.classList.remove("form-class");
    popUp.style.visibility = "hidden";
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
  }
  console.log("btn");
}
fetchData();
// events
document.body.addEventListener("click", handleClickBtn);
