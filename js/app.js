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
let index = 0;
let count = 1;
let quizData = [];
let userAnswers = [];
function questionCount() {
  count++;
  return count;
}
function scoreCount(score = 0) {
  score += 10;
  return score;
}
function showQuestions(dataLength, values) {
  quizData = values;
  console.log(dataLength, values[index].correct_answers.answer_a_correct);
  questionContainer.innerHTML = `<div id="question-number">question ${count}/${dataLength}</div>
      <div id="questions">
        <p class="question">${values[index].question}</p>
        <div class="inner-question-container">
          <p class="option">a</p>
          <p class="question-p">${values[index].answers.answer_a}</p>
        </div>
        <div class="inner-question-container">
          <p class="option">b</p>
          <p class="question-p">${values[index].answers.answer_b}</p>
        </div>
        <div class="inner-question-container">
          <p class="option">c</p>
          <p class="question-p">${values[index].answers.answer_c}</p>
        </div>
        <div class="inner-question-container">
          <p class="option">d</p>
          <p class="question-p">${values[index].answers.answer_d}</p>
        </div>
      </div>`;
}
function nexQuestion() {
  if (index < quizData.length - 1) {
    index++;
    count++;
    showQuestions(quizData.length, quizData);
  } else {
    alert("Quiz Finished! 🎉");
  }
}

function handleClickBtn(e) {
  const event = e.target;
  if (event.id === "create") {
    closeBtn.style =
      "font-size: 38px;margin: 40px;left: 90%;position: relative;color: darkred;cursor: pointer;pointer-events: all;";
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
  } else if (event.id === "take-quiz") {
    closeBtn.style =
      "font-size: 38px;margin: 40px;left: 90%;position: relative;color: darkred;cursor: pointer;pointer-events: all;";
    closeBtn.style.visibility = "visible";
    formClass.classList.add("form-class");
    questionContainer.style.visibility = "visible";
  } else if (event.className === "fa fa-close") {
    questionContainer.style.visibility = "hidden";
    closeBtn.style = "font-size: 0px;margin: 0px;";
    formClass.classList.remove("form-class");
  } else if (event.classList.contains("question-p")) {
    nexQuestion();
  }

  console.log(e.target.className);
}
fetchData();
// events
document.body.addEventListener("click", handleClickBtn);
