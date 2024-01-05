//Чарт
const ctx = document.getElementById("myChart");

//Дата
const dateContainer = document.querySelector(".date");
const currentDate = new Date();
const dateDay = currentDate.getDate();
const dateMonth = currentDate.toLocaleString("en-US", { month: "long" });
const dateYear = currentDate.getFullYear();

//Элементы для добавления задач
const button = document.querySelector(".btn-primary");
const container = document.querySelector(".button-container");
const newButtonContainer = document.querySelector(".new-button-container");
const newInputTitle = document.createElement("input");
const newInputBody = document.createElement("input");
const newInputTime = document.createElement("input");
const newButton = document.createElement("button");

//Элементы карточек
const card = document.querySelector(".mb-3");
const cardContainer = document.querySelector(".card-container");

dateContainer.textContent = `${dateDay} ${dateMonth} ${dateYear}`;

new Chart(ctx, {
  type: "line",
  data: {
    labels: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
    datasets: [
      {
        label: "Tasks By Hour",
        data: [1, 5, 3, 5, 2, 3, 1],
      },
    ],
  },
  options: {
    responsive: true,
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0,
        loop: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function createTask() {
  button.classList.add("disabled");
  container.appendChild(newInputTitle);
  newInputTitle.required = true;
  newInputTitle.placeholder = "Task title";

  newInputTitle.addEventListener("input", function () {
    container.appendChild(newInputBody);
    newInputBody.required = true;
    newInputBody.placeholder = "What you want to do?";
  });

  newInputBody.addEventListener("input", function () {
    container.appendChild(newInputTime);
    newInputTime.required = true;
    newInputTime.placeholder = "Set deadline, eg. 10:00";
  });

  newInputTime.addEventListener("input", function () {
    newButtonContainer.append(newButton);
    newButton.textContent = "Add task";
    newButton.classList.add("btn");
  });
}

function addTask() {
  const userInputTitle = newInputTitle.value;
  const userInputBody = newInputBody.value;
  const userInputTime = newInputTime.value;

  if (userInputTitle && userInputBody && userInputTime) {
    let clone = card.cloneNode(true);

    newInputTitle.value = "";
    newInputBody.value = "";
    newInputTime.value = "";

    clone.style.display = "block";
    clone.querySelector(".card-title").textContent = userInputTitle;
    clone.querySelector(
      ".card-text"
    ).textContent = `${userInputBody}. Deadline: ${userInputTime}`;
    cardContainer.appendChild(clone);

    const cardData = {
      title: userInputTitle,
      body: userInputBody,
      time: userInputTime,
    };
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];

    savedCards.push(cardData);
    localStorage.setItem("cards", JSON.stringify(savedCards));

    let errorElement = document.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  } else {
    let errorElement = document.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("p");
      errorElement.classList.add("error-message");
      newButtonContainer.appendChild(errorElement);
    }
    errorElement.textContent = "Please fill in all fields";
  }
}

function loadSavedCards() {
  const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
  savedCards.forEach((cardData) => {
    let clone = card.cloneNode(true);
    clone.style.display = "block";
    clone.querySelector(".card-title").textContent = cardData.title;
    clone.querySelector(
      ".card-text"
    ).textContent = `${cardData.body}. Deadline: ${cardData.time}`;
    cardContainer.appendChild(clone);
  });
}

cardContainer.addEventListener("click", function (event) {
  if (event.target.id === "button-delete") {
    const card = event.target.closest(".card.border-info.mb-3");
    card.remove();
  }
});

cardContainer.addEventListener("click", function (event) {
  if (event.target.id === "button-done") {
    const card = event.target.closest(".card.border-info.mb-3");
    card.style.backgroundColor = "#8FBC8F";
    card.style.color = "grey";
  }
});

button.addEventListener("click", createTask);
newButton.addEventListener("click", addTask);
document.addEventListener("DOMContentLoaded", loadSavedCards);
