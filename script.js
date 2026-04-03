let todo = document.getElementById("todo");
let inProgress = document.getElementById("inProgress");
let completed = document.getElementById("completed");
let columns = [todo, inProgress, completed];
let dragItem = null;

let tasks = document.querySelectorAll(".task");
let taskTitle = document.getElementById("taskTitle");
let taskDesc = document.getElementById("taskDesc");
let titleError = document.getElementById("titleError");
let descError = document.getElementById("descError");
let addTaskBtn = document.getElementById("addNewTask");

let tasksData = {};

let storedTask = localStorage.getItem("tasks");

function addTask(
  title,
  description,
  column,
  dateTime = new Date().toLocaleString(),
) {
  let div = document.createElement("div");
  div.classList.add("task", "rounded");
  div.innerHTML = `<h4 class="task-title">${title}</h4>
            <p class="task-desc">${description}</p>
            
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${dateTime}</small>

              <button class="btn btn-danger btn-sm" id="delete">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
            `;
  div.setAttribute("draggable", "true");
  column.appendChild(div);

  div.addEventListener("drag", () => {
    dragItem = div;
  });

  // Delete task
  const deleteBtn = div.querySelector("button");
  deleteBtn.addEventListener("click", () => {
    div.remove();
    updateLocalStorage();
    updateCounts();
  });
}

if (storedTask) {
  let storedData = JSON.parse(storedTask);

  for (let col in storedData) {
    const column = document.querySelector(`#${col}`);

    storedData[col].forEach((task) => {
      addTask(task.title, task.description, column, task.dateTime);
    });
  }

  updateLocalStorage();
}

updateCounts();
tasks.forEach((task) => {
  task.addEventListener("drag", () => {
    dragItem = task;
  });
});

function addDragEventsOnCol(column) {
  column.addEventListener("dragenter", () => {
    column.classList.add("hover", "shadow");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover", "shadow");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", () => {
    column.appendChild(dragItem);
    column.classList.remove("hover", "shadow");

    updateLocalStorage();
    updateCounts();
  });
}

function updateLocalStorage() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h4").innerText,
        description: t.querySelector("p").innerText,
        dateTime: t.querySelector("small").innerText,
      };
    });
    localStorage.setItem("tasks", JSON.stringify(tasksData));
  });
}

function updateCounts() {
  columns.forEach((col, index) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");
    count.innerText = tasks.length;
  });
}

addDragEventsOnCol(todo);
addDragEventsOnCol(inProgress);
addDragEventsOnCol(completed);

function validate() {
  return validateTitle() && validateDesc();
}

function handleReset() {
  taskTitle.value = "";
  taskDesc.value = "";

  titleError.innerText = "";
  descError.innerText = "";
}

addTaskBtn.addEventListener("click", () => {
  if (!validate()) {
    return;
  }

  addTask(taskTitle.value, taskDesc.value, todo);
  updateLocalStorage();
  let modalInstance = bootstrap.Modal.getInstance(
    document.getElementById("taskModal"),
  );
  modalInstance.hide();
  updateCounts();
  handleReset();
});

function validateTitle() {
  const value = taskTitle.value.trim();
  if (value == "") {
    titleError.innerText = "Title is required";
    return false;
  } else if (value.length < 3) {
    titleError.innerText = "Enter a valid Title (min 3 characters).";
    return false;
  } else {
    titleError.innerText = "";
    return true;
  }
}

function validateDesc() {
  const value = taskDesc.value.trim();
  if (value == "") {
    descError.innerText = "Description is required";
    return false;
  } else if (value.length < 6) {
    descError.innerText = "Enter a valid Description (min 6 characters).";
    return false;
  } else {
    descError.innerText = "";
    return true;
  }
}

taskTitle.addEventListener("input", validateTitle);
taskDesc.addEventListener("input", validateDesc);
