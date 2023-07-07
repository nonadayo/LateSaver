import { Task, TasksList, Time, TimeAllocator } from "../class/index.js";
// tasksList.add(new Task("test0", 60, 10, 0, 0));
// tasksList.add(new Task("test1", 50, 5, 0, 0));
// tasksList.add(new Task("test2", 40, 20, 0, 0));
// tasksList.add(new Task("test3", 30, 15, 0, 0));
// const allocator = new TimeAllocator(new Time(10, 30), new Time(11, 30), tasksList);
// allocator.allocate()
// console.log(allocator.result)

let tasksListOfLocalStorage;
let departureTime;
let thisMorningTasksArray = [];
let thisMorningPresentTaskIndex = 0;

const divDepartureTimeInputAndPresentTask = document.getElementById("div-departureTimeInputAndPresentTask");
const inputDepartureTime = document.getElementById("input-departureTime");
const buttonWakeup = document.getElementById("button-wakeup");
const divThisMorningTasks = document.getElementById("div-thisMorningTasks");
// const divTaskTable = document.getElementById("div-taskTable");
// const inputNewTaskTitle = document.getElementById("input-newTaskTitle");
// const inputNewTaskMin = document.getElementById("input-newTaskMin");
// const inputNewTaskMax = document.getElementById("input-newTaskMax");
// const buttonNewTask = document.getElementById("button-newTask");

const color = {
    text: {
        button: "#3A4909",
    },
    background: {
        general: "#FDFAE9",
    }
}

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
    // console.log("Wakeup button was clicked.");
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
        tasksListForAllocate.data = Array.from(tasksListOfLocalStorage.data);
        // console.log(tasksList.data);
        // console.log(tasksListForAllocate.data);
        const allocator = new TimeAllocator(nowTime, departureTime, tasksListForAllocate);
        allocator.allocate();
        thisMorningTasksArray = allocator.result;
        // console.log(thisMorningTasksArray);
        thisMorningTasksArray.forEach((task) => {
            const tmpTaskLi = document.createElement("li");
            tmpTaskLi.textContent = `${task[0].title}（${task[1].getStr()}～${task[2].getStr()}）`;
            tmpTaskOl.appendChild(tmpTaskLi);
        });
        divThisMorningTasks.appendChild(tmpTaskOl);

        updatePresentTask();
    }
});

function updateTasksListFromLocalStorage() {
    //localStorageにJSON文字列として保管しておいたタスク「tasks」を取り出し、配列に変換
    //もし、localStorageに「tasks」がなければ「tasksObjectArray」には「null」が入る
    const tasksObjectArray = JSON.parse(localStorage.getItem("tasks"));
    tasksListOfLocalStorage = new TasksList();
    if (tasksObjectArray) {
        let tmpTaskIndex = 1;//読み込んだタスクの順番
        tasksObjectArray.forEach((task) => {
            //優先順位とIDは読み込んだ順にする
            tasksListOfLocalStorage.add(new Task(task.title, Number(task.max), Number(task.min), tmpTaskIndex, tmpTaskIndex++));
        });
        // console.log(`There are ${tasksList.data.length} task(s).`);
    } else {
        // console.log("There are no localStorage data.");
    }
}

function updatePresentTask() {
    //いったん「divDepartureTimeInputAndPresentTask」の中身をすべて削除
    while (divDepartureTimeInputAndPresentTask.firstChild) {
        divDepartureTimeInputAndPresentTask.removeChild(divDepartureTimeInputAndPresentTask.firstChild);
    }

    const divClock = document.createElement("div");//時計が入るdiv
    /*
    時計作成
     */
    divDepartureTimeInputAndPresentTask.appendChild(divClock);

    if (thisMorningPresentTaskIndex + 1 < thisMorningTasksArray.length) {
        const buttonNextTask = document.createElement("button");
        // buttonNextTask.setAttribute("style", `color: ${color.text.button}; background-color: ${color.background.general};`);
        buttonNextTask.setAttribute("id", "button-wakeup");
        buttonNextTask.textContent = "Next >>";
        buttonNextTask.addEventListener("click", () => {
            thisMorningPresentTaskIndex++;
            updatePresentTask();
        });
        divDepartureTimeInputAndPresentTask.appendChild(buttonNextTask);
    }

    const pTaskTime = document.createElement("p");
    pTaskTime.textContent = `${thisMorningTasksArray[thisMorningPresentTaskIndex][1].getStr()}　～　${thisMorningTasksArray[thisMorningPresentTaskIndex][2].getStr()}`;
    pTaskTime.setAttribute("style", "font-weight: 900;");
    divDepartureTimeInputAndPresentTask.appendChild(pTaskTime);

    const pTaskTitle = document.createElement("p");
    pTaskTitle.textContent = thisMorningTasksArray[thisMorningPresentTaskIndex][0].title;
    divDepartureTimeInputAndPresentTask.appendChild(pTaskTitle);
}






//////////////////////////////////////////////////////////////////////
// 時計の描画処理用関数
//////////////////////////////////////////////////////////////////////
// 時計の中身の描画を更新する関数
// 引数: なし
// 戻り値: なし
function timeLimitViewRender() {
    const timeLimitOnTask = []; // 現在のタスクの残り時間をdegで格納 [0, 10] など。
    const timeLimit = [];       // 現在のタスクを含めない残り時間をdegで格納 [10, 30] など。
    // タスクのデータからtimeLimitOnTaskとtimeLimitを計算する関数
    const tasksData = []
    console.log(thisMorningTasksArray);
}
timeLimitViewRender()
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

