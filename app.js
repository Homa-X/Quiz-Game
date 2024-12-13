let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let userAnswers = [];

// Start the quiz
function startQuiz() {
  fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
      questions = data;
      showQuestion();
    })
    .catch((error) => console.error("Error loading questions:", error));
}

// Render a question
function showQuestion() {
  clearInterval(timer);
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    document.getElementById("root").innerHTML = `
      <h2>Question ${currentQuestionIndex + 1}/${questions.length}</h2>
      <p>${question.question}</p>
      ${question.options
        .map(
          (option, index) =>
            `<button onclick="handleAnswer(${index})">${option}</button>`
        )
        .join("")}
      <p id="timer">Time left: 10s</p>
    `;
    startTimer();
  } else {
    showSummary();
  }
}

// Handle answer selection
function handleAnswer(selectedIndex) {
  clearInterval(timer);
  const question = questions[currentQuestionIndex];
  userAnswers.push({
    question: question.question,
    selected: question.options[selectedIndex],
    correct: question.options[question.correctIndex],
  });

  if (selectedIndex === question.correctIndex) {
    score++;
  }

  currentQuestionIndex++;
  showQuestion();
}

// Show summary
function showSummary() {
  const results = userAnswers
    .map(
      (answer, index) => `
      <li>
        <strong>Q${index + 1}: ${answer.question}</strong><br>
        Your answer: ${answer.selected} <br>
        Correct answer: ${answer.correct}
      </li>
    `
    )
    .join("");

  document.getElementById("root").innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>Your score: ${score}/${questions.length}</p>
    <ul class="result-list">${results}</ul>
    <button onclick="restartQuiz()">Play Again</button>
  `;
}

// Restart quiz
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  showStartButton();
}

// Start countdown timer
function startTimer() {
  let timeLeft = 10;
  timer = setInterval(() => {
    document.getElementById("timer").textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleAnswer(-1); // No answer selected
    }
    timeLeft--;
  }, 1000);
}

// Show start button
function showStartButton() {
  document.getElementById("root").innerHTML = `
    <h1>Welcome to the Quiz!</h1>
    <button onclick="startQuiz()">START</button>
  `;
}

// Initial load
showStartButton();
