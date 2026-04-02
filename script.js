let todo = document.getElementById("todo");
let inProgress = document.getElementById("inProgress");
let completed = document.getElementById("completed");
let dragItem = null;

let tasks = document.querySelectorAll(".task");

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
  });
}

addDragEventsOnCol(todo);
addDragEventsOnCol(inProgress);
addDragEventsOnCol(completed);
