import { Task, TasksList, Time, TimeAllocator } from "./class/index.js";
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
let timeLimitViewIntervalFuncID;

const divDepartureTimeInput = document.getElementById("div-departureTimeInput");
const inputDepartureTime = document.getElementById("input-departureTime");
const buttonWakeup = document.getElementById("button-wakeup");
const divThisMorningTasks = document.getElementById("div-thisMorningTasks");
const presentTaskWrapper = document.getElementById("presentTaskWrapper");
const buttonNextTask = document.getElementById("button-nextTask");
const divPresentTaskWrapper__timeView__startTime = document.getElementById("presentTaskWrapper__timeView--startTime");
const divPresentTaskWrapper__timeView__delimiter = document.getElementById("presentTaskWrapper__timeView--delimiter");
const divPresentTaskWrapper__timeView__endTime = document.getElementById("presentTaskWrapper__timeView--endTime");
const divPresentTaskWrapper__titleView = document.getElementById("presentTaskWrapper__titleView");

const color = {
    text: {
        button: "#3A4909",
    },
    background: {
        general: "#FDFAE9",
        deepGreen: "#3A4909",
        lightGreen: "#759411",
    }
}






////////////////////////////////////////////////////////////////////////////////
// 処理に必要なsub関数群
////////////////////////////////////////////////////////////////////////////////
// 12:20 --> Time(12, 20)の変換を行う関数
function timeStringToTimeInstance(timeString) {
    const tmpHourMinuteStringArray = timeString.split(":");
    return new Time(Number(tmpHourMinuteStringArray[0]), Number(tmpHourMinuteStringArray[1]));
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////////////////////
// 開始・Next・出発
////////////////////////////////////////////////////////////////////////////////
// タスクを開始する処理
function startTasks() {
    // console.log("Wakeup button was clicked.");
    //いったん「divThisMorningTasks」の中身をすべて削除
    while (divThisMorningTasks.firstChild) {
        divThisMorningTasks.removeChild(divThisMorningTasks.firstChild);
    }

    const tmpTaskOl = document.createElement("ol");

    const now = new Date();
    const nowTime = new Time(now.getHours(), now.getMinutes());
    if (departureTime.compareTo(nowTime) > 0) {
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
            divDepartureTimeInput.classList.remove("visible");
            divDepartureTimeInput.classList.add("invisible");
            presentTaskWrapper.classList.remove("invisible");
            presentTaskWrapper.classList.add("visible");
            thisMorningTasksArray.forEach((task) => {
                const tmpTaskLi = document.createElement("li");
                tmpTaskLi.textContent = `${task[0].title}（${task[1].getStr()}～${task[2].getStr()}）`;
                tmpTaskOl.appendChild(tmpTaskLi);
            });
            divThisMorningTasks.appendChild(tmpTaskOl);
            updatePresentTask();
            // 時計描画用のインターバル関数
            timeLimitViewRender();
            timeLimitViewIntervalFuncID = setInterval(() => {
                timeLimitViewRender();
            }, 1000)
        }
    } else {
        alert("出発時間が現在時刻の後になるように設定してください");
    }
}



// 次のタスクへの移行処理
function nextTask() {
    thisMorningPresentTaskIndex++;
    updatePresentTask();
    timeLimitViewRender();
}



// 出発処理
function departrue() {
    thisMorningPresentTaskIndex++;
    buttonNextTask.setAttribute("style", "display: none;");
    divPresentTaskWrapper__timeView__startTime.textContent = divPresentTaskWrapper__timeView__delimiter.textContent = divPresentTaskWrapper__timeView__endTime.textContent = "";
    divPresentTaskWrapper__titleView.textContent = "行ってらっしゃい！";
    // 値の初期化処理
    clearInterval(timeLimitViewIntervalFuncID);
    timeLimitViewIntervalFuncID = undefined;
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////////////////////
// DOMの更新処理
////////////////////////////////////////////////////////////////////////////////
// DOMがロードし終わった後の処理
// ローカルストレージからデータを読み込み、各ボタンに処理を付与
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



// 次のタスクへ移行しDOMの内容を更新する処理
function updatePresentTask() {
    // console.log(`updatePresentTask(); thisMorningPresentTaskIndex: ${thisMorningPresentTaskIndex}`);
    if (thisMorningPresentTaskIndex <= thisMorningTasksArray.length) {
        divPresentTaskWrapper__titleView.textContent = thisMorningTasksArray[thisMorningPresentTaskIndex][0].title;
        divPresentTaskWrapper__timeView__startTime.textContent = thisMorningTasksArray[thisMorningPresentTaskIndex][1].getStr();
        divPresentTaskWrapper__timeView__endTime.textContent = thisMorningTasksArray[thisMorningPresentTaskIndex][2].getStr();
        if (thisMorningPresentTaskIndex + 1 === thisMorningTasksArray.length) {
            buttonNextTask.removeEventListener("click", nextTask);
            buttonNextTask.addEventListener("click", departrue);
            buttonNextTask.textContent = "Let's Go!";
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////////////////////
// ローカルストレージ操作
////////////////////////////////////////////////////////////////////////////////
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



// インプットされたらローカルストレージに出発時間を格納
inputDepartureTime.addEventListener("input", (e) => {
    localStorage.setItem("departureTime", e.target.value);
    departureTime = timeStringToTimeInstance(e.target.value);
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////
// 時計の描画処理用関数
//////////////////////////////////////////////////////////////////////
// 現在の時刻から進捗状況を割合で返す関数
// 引数: なし
// 戻り値: [0.3, 0.5] のように、現在タスクの開始時刻割合, 現在時刻の割合を返す
function createOnProgressRatios() {
    // 開始、終了、現在、タスクの開始終了時刻の取得
    const startTime       = thisMorningTasksArray[0][1];
    const endTime         = thisMorningTasksArray[thisMorningTasksArray.length - 1][2];
    const onTaskEndTime = thisMorningTasksArray[thisMorningPresentTaskIndex][2];
    const onTime          = new Time();
    // 時間幅を分単位で取得
    const minutesRange     = endTime.differFrom(startTime).getValAsMin();
    const taskEndMinutes   = onTaskEndTime.differFrom(startTime).getValAsMin();
    const onTimeMinutes    = onTime.differFrom(startTime).getValAsMin();
    // 計算し結果を返す
    const taskEndRatio = (minutesRange - taskEndMinutes) / minutesRange;
    const onTimeRatio    = (minutesRange - onTimeMinutes   ) / minutesRange;
    return [taskEndRatio, onTimeRatio];
}



// 時計の中身の描画を更新する関数
// 引数: なし
// 戻り値: なし
function timeLimitViewRender() {
    const processStateRatios = createOnProgressRatios();
    const degreeRange = [processStateRatios[0]*360, processStateRatios[1]*360]
    let newStyle;
    // 現在時刻がタスク終了予定の時刻より進んでいる場合
    if (degreeRange[0] > degreeRange[1]) {
        newStyle = `conic-gradient(${color.background.deepGreen} ${degreeRange[0]}deg ${degreeRange[1]}deg)`;
    // 現在時刻がタスク終了予定の時刻よりも前の場合
    } else {
        newStyle = `conic-gradient(${color.background.deepGreen} 0deg ${degreeRange[0]}deg, ${color.background.lightGreen} ${degreeRange[0]}deg ${degreeRange[1]}deg, ${color.background.general} ${degreeRange[1]}deg 360deg)`;
    }
    const timeLimitViewDOM = document.querySelector("#presentTaskWrapper__timeLimitAndNextBtn--timeLimitViewBox");
    timeLimitViewDOM.style.background = newStyle;
}
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

