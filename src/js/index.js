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

const divDepartureTimeInput = document.getElementById("div-departureTimeInput");
const inputDepartureTime = document.getElementById("input-departureTime");
const buttonWakeup = document.getElementById("button-wakeup");
const divThisMorningTasks = document.getElementById("div-thisMorningTasks");
const presentTaskWrapper = document.getElementById("presentTaskWrapper");
const buttonNextTask = document.getElementById("button-nextTask");
const divPresentTaskWrapper__timeView__startTime = document.getElementById("div-presentTaskWrapper__timeView--startTime");
const divPresentTaskWrapper__timeView__delimiter = document.getElementById("div-presentTaskWrapper__timeView--delimiter");
const divPresentTaskWrapper__timeView__endTime = document.getElementById("div-presentTaskWrapper__timeView--endTime");
const divPresentTaskWrapper__titleView = document.getElementById("div-presentTaskWrapper__titleView");

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

    const lsDepartureTimeString = localStorage.getItem("departureTime");
    if (lsDepartureTimeString) {
        // console.log(lsDepartureTimeString);
        inputDepartureTime.value = lsDepartureTimeString;
        departureTime = timeStringToTimeInstance(lsDepartureTimeString);
        // console.log(departureTime);
    }
    buttonWakeup.addEventListener("click", startTasks);
    buttonNextTask.addEventListener("click", nextTask);
});

function timeStringToTimeInstance(timeString) {
    const tmpHourMinuteStringArray = timeString.split(":");
    return new Time(Number(tmpHourMinuteStringArray[0]), Number(tmpHourMinuteStringArray[1]));
}

inputDepartureTime.addEventListener("input", (e) => {
    localStorage.setItem("departureTime", e.target.value);
    departureTime = timeStringToTimeInstance(e.target.value);
});

function startTasks() {
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
        if (thisMorningTasksArray.length === 0) {
            alert("出発時間までに行えるタスクが1つもありません");
        } else {
            divDepartureTimeInput.setAttribute("style", "display: none;");
            presentTaskWrapper.setAttribute("style", "display: block;");
            thisMorningTasksArray.forEach((task) => {
                const tmpTaskLi = document.createElement("li");
                tmpTaskLi.textContent = `${task[0].title}（${task[1].getStr()}～${task[2].getStr()}）`;
                tmpTaskOl.appendChild(tmpTaskLi);
            });
            divThisMorningTasks.appendChild(tmpTaskOl);
            updatePresentTask();
        }
    } else {
        alert("出発時間が現在時刻の後になるように設定してください");
    }
}

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
    // console.log(`updatePresentTask(); thisMorningPresentTaskIndex: ${thisMorningPresentTaskIndex}`);
    if (thisMorningPresentTaskIndex <= thisMorningTasksArray.length) {
        divPresentTaskWrapper__timeView__startTime.textContent = thisMorningTasksArray[thisMorningPresentTaskIndex][1].getStr();
        divPresentTaskWrapper__timeView__endTime.textContent = thisMorningTasksArray[thisMorningPresentTaskIndex][2].getStr();
        divPresentTaskWrapper__titleView.textContent = thisMorningTasksArray[thisMorningPresentTaskIndex][0].title;
        if (thisMorningPresentTaskIndex + 1 === thisMorningTasksArray.length) {
            buttonNextTask.removeEventListener("click", nextTask);
            buttonNextTask.addEventListener("click", departrue);
            buttonNextTask.textContent = "Let's Go!";
        }
    }
}

function nextTask() {
    thisMorningPresentTaskIndex++;
    updatePresentTask();
}

function departrue() {
    thisMorningPresentTaskIndex++;
    buttonNextTask.setAttribute("style", "display: none;");
    divPresentTaskWrapper__timeView__startTime.textContent = divPresentTaskWrapper__timeView__delimiter.textContent = divPresentTaskWrapper__timeView__endTime.textContent = "";
    divPresentTaskWrapper__titleView.textContent = "行ってらっしゃい！";
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

