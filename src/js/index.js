import { Task, TasksList, Time, TimeAllocator } from "./class/index.js";
// tasksList.add(new Task("test0", 60, 10, 0, 0));
// tasksList.add(new Task("test1", 50, 5, 0, 0));
// tasksList.add(new Task("test2", 40, 20, 0, 0));
// tasksList.add(new Task("test3", 30, 15, 0, 0));
// const allocator = new TimeAllocator(new Time(10, 30), new Time(11, 30), tasksList);
// allocator.allocate()
// console.log(allocator.result)

let tasksList;
let departureTime;

const inputDepartureTime = document.getElementById("input-departureTime");
const buttonWakeup = document.getElementById("button-wakeup");
const divThisMorningTasks = document.getElementById("div-thisMorningTasks");
// const divTaskTable = document.getElementById("div-taskTable");
// const inputNewTaskTitle = document.getElementById("input-newTaskTitle");
// const inputNewTaskMin = document.getElementById("input-newTaskMin");
// const inputNewTaskMax = document.getElementById("input-newTaskMax");
// const buttonNewTask = document.getElementById("button-newTask");

document.addEventListener("DOMContentLoaded", () => {
    // console.log("DOM content was loaded.");
    updateTasksListFromLocalStorage();
    // updateTaskTableFromTasksList();

    const lsDepartureTimeString = localStorage.getItem("departureTime");
    if (lsDepartureTimeString) {
        // console.log(lsDepartureTimeString);
        inputDepartureTime.value = lsDepartureTimeString;
        departureTime = timeStringToTimeInstance(lsDepartureTimeString);
        // console.log(departureTime);
    }
});

function timeStringToTimeInstance(timeString) {
    const tmpHourMinuteStringArray = timeString.split(":");
    return new Time(Number(tmpHourMinuteStringArray[0]), Number(tmpHourMinuteStringArray[1]));
}

inputDepartureTime.addEventListener("input", (e) => {
    localStorage.setItem("departureTime", e.target.value);
    departureTime = timeStringToTimeInstance(e.target.value);
});

buttonWakeup.addEventListener("click", () => {
    //いったん「divThisMorningTasks」の中身をすべて削除
    while (divThisMorningTasks.firstChild) {
        divThisMorningTasks.removeChild(divThisMorningTasks.firstChild);
    }

    const tmpTaskOl = document.createElement("ol");

    const now = new Date();
    const nowTime = new Time(now.getHours(), now.getMinutes());
    if (0 < departureTime.differFrom(nowTime).getValAsMin()) {
        //「現在時刻<出発時刻」の場合
        const tasksListForAllocate = new TasksList();
        tasksListForAllocate.data = Array.from(tasksList.data);
        // console.log(tasksList.data);
        // console.log(tasksListForAllocate.data);
        const allocator = new TimeAllocator(nowTime, departureTime, tasksListForAllocate);
        allocator.allocate();
        const thisMorningTasksArray = allocator.result;
        // console.log(thisMorningTasksArray);
        thisMorningTasksArray.forEach((task) => {
            const tmpTaskLi = document.createElement("li");
            tmpTaskLi.textContent = `${task[0].title}（${task[1].getStr()}～${task[2].getStr()}）`;
            tmpTaskOl.appendChild(tmpTaskLi);
        });
        divThisMorningTasks.appendChild(tmpTaskOl);
    }
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
