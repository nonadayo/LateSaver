import { Task, TasksList, Time, TimeAllocator } from "./class/index.js";
const tasksList = new TasksList();
// tasksList.add(new Task("test0", 60, 10, 0, 0));
// tasksList.add(new Task("test1", 50, 5, 0, 0));
// tasksList.add(new Task("test2", 40, 20, 0, 0));
// tasksList.add(new Task("test3", 30, 15, 0, 0));
// const allocator = new TimeAllocator(new Time(10, 30), new Time(11, 30), tasksList);
// allocator.allocate()
console.log(allocator.result)

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content was loaded.");
    //localStorageにJSON文字列として保管しておいたタスク「tasks」を取り出し、オブジェクトに変換
    //もし、localStorageに「tasks」がなければ「tasksObject」には「null」が入る
    const tasksObject = JSON.parse(localStorage.getItem("tasks"));
    console.log(localStorage.getItem("tasks"));
    console.log(tasksObject);

    if (tasksObject !== null) {
        let tmpTaskIndex = 1;//読み込んだタスクの順番
        for (const task in tasksObject) {
            console.log(tasksObject[task]);
            //優先順位とIDは暫定的に読み込んだ順にする
            tasksList.add(new Task(tasksObject[task].title, tasksObject[task].max, tasksObject[task].min, tmpTaskIndex, tmpTaskIndex));
        }
        console.log(taskArray);
    } else {
        console.log("There are no tasks.");
    }

    createTaskTable();
});

function createTaskTable() {
    //いったん「divTaskTable」の中身をすべて削除
    while (divTaskTable.firstChild) {
        divTaskTable.removeChild(divTaskTable.firstChild);
    }

    const tmpTaskTable = document.createElement("table");
    tmpTaskTable.setAttribute("id", "table-tasks");

    const tmpIndexTr = document.createElement("tr");
    const indexStringArray = ["優先順位", "タスク名", "所要時間（最短）", "所要時間（最長）", "タスクを削除"];
    indexStringArray.forEach((indexString) => {
        const tmpIndexTh = document.createElement("th");
        tmpIndexTh.textContent = indexString;
        tmpIndexTr.appendChild(tmpIndexTh);
    });
    tmpTaskTable.appendChild(tmpIndexTr);

    //読み込んだタスクをhtmlの表に表示
    taskArray.forEach((task) => {
        const tmpTaskTr = document.createElement("tr");
        tmpTaskTr.setAttribute("class", "tr-task");
        tmpTaskTr.setAttribute("id", task[taskLabels.id]);
        tmpTaskTr.setAttribute("draggalbe", "true");
        tmpTaskTr.appendChild(document.createElement("td").appendChild(document.createTextNode(task[taskLabels.order])));
        tmpTaskTr.appendChild(document.createElement("td").appendChild(document.createTextNode(task[taskLabels.title])));
        tmpTaskTr.appendChild(document.createElement("td").appendChild(document.createTextNode(task[taskLabels.minTime])));
        tmpTaskTr.appendChild(document.createElement("td").appendChild(document.createTextNode(task[taskLabels.maxTime])));
        const tmpDeleteButton = document.createElement("button");
        tmpDeleteButton.setAttribute("type", "button");
        tmpDeleteButton.setAttribute("id", `button-task${task[taskLabels.id]}`);
        tmpDeleteButton.textContent = "削除";
        tmpDeleteButton.addEventListener("click", (e) => {
            console.log(e.target.id);
            //deleteTask(e.target.id);
            //updateTaskTable();
        });
        tmpTaskTr.appendChild(document.createElement("td").appendChild(tmpDeleteButton));

        let tmpTd = document.createElement("td");
        tmpTd.textContent = task[taskLabels.order];
        tmpTaskTr.appendChild(tmpTd);
        tmpTd.textContent = task[taskLabels.title];
        tmpTaskTr.appendChild(tmpTd);
        tmpTd.textContent = task[taskLabels.minTime];
        tmpTaskTr.appendChild(tmpTd);
        tmpTd.textContent = task[taskLabels.maxTime];
        tmpTaskTr.appendChild(tmpTd);
        tmpTd.textContent = null;
        tmpTaskTable.appendChild(tmpTaskTr);
    });

    divTaskTable.appendChild(tmpTaskTable);
}