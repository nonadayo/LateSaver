import { Task, TasksList/*, Time, TimeAllocator*/ } from "./class/index.js";
let tasksList;

const divTaskTable = document.getElementById("div-taskTable");
const inputNewTaskTitle = document.getElementById("input-newTaskTitle");
const inputNewTaskMin = document.getElementById("input-newTaskMin");
const inputNewTaskMax = document.getElementById("input-newTaskMax");
const buttonNewTask = document.getElementById("button-newTask");

document.addEventListener("DOMContentLoaded", () => {
    // console.log("DOM content was loaded.");
    updateTasksListFromLocalStorage();
    updateTaskTableFromTasksList();
});

function updateTasksListFromLocalStorage() {
    //localStorageにJSON文字列として保管しておいたタスク「tasks」を取り出し、配列に変換
    //もし、localStorageに「tasks」がなければ「tasksObjectArray」には「null」が入る
    const tasksObjectArray = JSON.parse(localStorage.getItem("tasks"));
    tasksList = new TasksList();
    if (tasksObjectArray) {
        let tmpTaskIndex = 1;//読み込んだタスクの順番
        tasksObjectArray.forEach((task) => {
            //優先順位とIDは読み込んだ順にする
            tasksList.add(new Task(task.title, Number(task.max), Number(task.min), tmpTaskIndex, tmpTaskIndex++));
        });
        // console.log(`There are ${tasksList.data.length} task(s).`);
    } else {
        // console.log("There are no localStorage data.");
    }
}

function updateTaskTableFromTasksList() {
    //いったん「divTaskTable」の中身をすべて削除
    while (divTaskTable.firstChild) {
        divTaskTable.removeChild(divTaskTable.firstChild);
    }

    const tmpTaskTable = document.createElement("table");
    tmpTaskTable.setAttribute("id", "table-tasks");

    const tmpIndexTr = document.createElement("tr");
    const indexStringArray = ["優先順位", "タスク名", "所要時間（最短）", "所要時間（最長）", "タスクを削除", "優先順位を1つ上げる"];
    indexStringArray.forEach((indexString) => {
        const tmpIndexTh = document.createElement("th");
        tmpIndexTh.textContent = indexString;
        tmpIndexTr.appendChild(tmpIndexTh);
    });
    tmpTaskTable.appendChild(tmpIndexTr);

    //読み込んだタスクをhtmlの表に表示
    tasksList.data.forEach((task) => {
        const tmpTaskTr = document.createElement("tr");
        tmpTaskTr.setAttribute("class", "tr-task");
        tmpTaskTr.setAttribute("id", task.id);

        const tmpTaskIdTd = document.createElement("td");
        tmpTaskIdTd.textContent = task.id;
        tmpTaskTr.appendChild(tmpTaskIdTd);

        const tmpTaskTitleTd = document.createElement("td");
        const inputTaskTitle = document.createElement("input");
        inputTaskTitle.value = task.title;
        inputTaskTitle.setAttribute("id", `input-taskTitle${task.id}`);
        inputTaskTitle.addEventListener("input", () => {
            updateLocalStorageFromTaskTable();
            updateTasksListFromLocalStorage();
        });
        tmpTaskTitleTd.appendChild(inputTaskTitle);
        tmpTaskTr.appendChild(tmpTaskTitleTd);

        const tmpTaskMinTd = document.createElement("td");
        const inputTaskMin = document.createElement("input");
        inputTaskMin.value = task.min;
        inputTaskMin.setAttribute("id", `input-taskMin${task.id}`);
        inputTaskMin.addEventListener("input", () => {
            updateLocalStorageFromTaskTable();
            updateTasksListFromLocalStorage();
        });
        inputTaskMin.setAttribute("type", "number");
        tmpTaskMinTd.appendChild(inputTaskMin);
        tmpTaskTr.appendChild(tmpTaskMinTd);

        const tmpTaskMaxTd = document.createElement("td");
        const inputTaskMax = document.createElement("input");
        inputTaskMax.value = task.max;
        inputTaskMax.setAttribute("id", `input-taskMax${task.id}`);
        inputTaskMax.addEventListener("input", () => {
            updateLocalStorageFromTaskTable();
            updateTasksListFromLocalStorage();
        });
        inputTaskMax.setAttribute("type", "number");
        tmpTaskMaxTd.appendChild(inputTaskMax);
        tmpTaskTr.appendChild(tmpTaskMaxTd);

        const tmpTaskDeleteTd = document.createElement("td");
        const buttonTaskDelete = document.createElement("button");
        buttonTaskDelete.setAttribute("type", "button");
        buttonTaskDelete.setAttribute("id", `button-taskDelete${task.id}`);
        buttonTaskDelete.textContent = "削除";
        buttonTaskDelete.addEventListener("click", (e) => {
            // console.log(e.target.id);
            if (window.confirm(`「${tasksList.data[Number(e.target.id.split("button-taskDelete")[1]) - 1].title}」を削除しますか？`)) {
                tasksList.data.splice(Number(e.target.id.split("button-taskDelete")[1]) - 1, 1);
                // console.log(tasksList.data);
                updateLocalStorageFromTasksList();
                updateTasksListFromLocalStorage();
                updateTaskTableFromTasksList();
            }
            //deleteTask(e.target.id);
            //updateTaskTableFromTasksList();
        });
        tmpTaskDeleteTd.appendChild(buttonTaskDelete);
        tmpTaskTr.appendChild(tmpTaskDeleteTd);

        const tmpTaskPriorityTd = document.createElement("td");
        if (task.id === 1) {
            tmpTaskPriorityTd.textContent = "-";
        } else {
            const buttonTaskPriority = document.createElement("button");
            buttonTaskPriority.setAttribute("type", "button");
            buttonTaskPriority.setAttribute("id", `button-taskPriority${task.id}`);
            buttonTaskPriority.textContent = "優先順位を上げる";
            buttonTaskPriority.addEventListener("click", (e) => {
                // console.log(e.target.id);
                [tasksList.data[task.id - 2].title, tasksList.data[task.id - 1].title] = [tasksList.data[task.id - 1].title, tasksList.data[task.id - 2].title];
                [tasksList.data[task.id - 2].min, tasksList.data[task.id - 1].min] = [tasksList.data[task.id - 1].min, tasksList.data[task.id - 2].min];
                [tasksList.data[task.id - 2].max, tasksList.data[task.id - 1].max] = [tasksList.data[task.id - 1].max, tasksList.data[task.id - 2].max];

                updateLocalStorageFromTasksList();
                updateTasksListFromLocalStorage();
                updateTaskTableFromTasksList();
            });
            tmpTaskPriorityTd.appendChild(buttonTaskPriority);
        }
        tmpTaskTr.appendChild(tmpTaskPriorityTd);

        tmpTaskTable.appendChild(tmpTaskTr);
    });

    divTaskTable.appendChild(tmpTaskTable);
}

function updateLocalStorageFromTaskTable() {
    // console.log(tasksList.data);
    const savingDataObjectArray = [];
    for (let id = 1; id <= tasksList.data.length; id++) {
        let tmpDataObject = {};
        tmpDataObject.title = document.getElementById(`input-taskTitle${id}`).value;
        tmpDataObject.min = document.getElementById(`input-taskMin${id}`).value;
        tmpDataObject.max = document.getElementById(`input-taskMax${id}`).value;
        savingDataObjectArray.push(tmpDataObject);
    }
    localStorage.setItem("tasks", JSON.stringify(savingDataObjectArray));
}

function updateLocalStorageFromTasksList() {
    // console.log(tasksList.data);
    const savingDataObjectArray = [];
    tasksList.data.forEach((task) => {
        let tmpDataObject = {};
        tmpDataObject.title = task.title
        tmpDataObject.min = task.min
        tmpDataObject.max = task.max
        savingDataObjectArray.push(tmpDataObject);
    });
    localStorage.setItem("tasks", JSON.stringify(savingDataObjectArray));
}


buttonNewTask.addEventListener("click", () => {
    // console.log("New task button was clicked.");
    if (inputNewTaskTitle.value != "") {
        tasksList.add(new Task(inputNewTaskTitle.value, Number(inputNewTaskMax.value), Number(inputNewTaskMin.value), tasksList.data.length + 1, tasksList.data.length + 1));
        inputNewTaskTitle.value = "";
        inputNewTaskMin.value = "";
        inputNewTaskMax.value = "";
        updateTaskTableFromTasksList();
        updateLocalStorageFromTaskTable();
        // console.log(tasksList.data);
    }
});