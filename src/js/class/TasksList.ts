import Task from "./Task";


// Taskクラスを要素にもつ配列のクラス
// Taskクラス配列に対して必要な動作をまとめている
export default class TasksList {
    data: Task[];
    constructor() {
        this.data = [];
    }

    // タスクを新しく追加する関数
    // 引数:   Taskクラスのインスタンス
    // 戻り値: 無
    add(newTask: Task): void {
        let targetIndex: number = 0;
        for (let i=0; i < this.data.length; i++) {
            const task: Task = this.data[i];
            if (task.isSet() && newTask.isSet()) {
                if ((task.order as number) > (newTask.order as number)) {
                    targetIndex = i;
                    break;
                }
            }
        }
        this.data.splice(targetIndex, 0, newTask);
    }
}