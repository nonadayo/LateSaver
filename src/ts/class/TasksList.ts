import Task from "./Task";


// Taskクラスを要素にもつ配列のクラス
// Taskクラス配列に対して必要な動作をまとめている
export default class TasksList {
    data: Task[];
    constructor() {
        this.data = [];
    }
    /////////////////////////////////////////////////////////////////////////////////////
    // 配列操作関数群
    /////////////////////////////////////////////////////////////////////////////////////
    // タスクを新しく追加する関数
    // 引数:   Taskクラスのインスタンス
    // 戻り値: 無
    add(newTask: Task): void {
        let targetIndex: number = -1;
        for (let i=0; i < this.data.length; i++) {
            const task: Task = this.data[i];
            if (task.isSet() && newTask.isSet()) {
                if ((task.priority as number) < (newTask.priority as number)) {
                    targetIndex = i;
                    break;
                }
            }
        }
        if (targetIndex >= 0) {
            this.data.push(newTask);
        } else {
            this.data.splice(targetIndex, 0, newTask);
        }
    }
    // 優先順位が最も低いTaskを取り除いて取得する関数関数
    // 引数: 無
    // 戻り値: 優先順位の値が最も低いTaskインスタンスもしくはundefind
    popHighestPriority(): Task | undefined {
        let   targetIndex: number = -1;
        let   targetTask : Task | undefined = undefined;
        const lowestPriority: number = this.getHighestPriority();
        for (let i=0; i<this.data.length; i++) {
            const task = this.data[i];
            if (task.priority === lowestPriority) {
                targetIndex = i;
                targetTask = task;
                break;
            }
        }
        if (targetIndex !== -1) {
            this.data.splice(targetIndex, 1);
        }
        return targetTask;
    }
    // 優先順位が最も低いTaskを取り除いて取得する関数関数
    // 引数: 無
    // 戻り値: 優先順位の値が最も低いTaskインスタンスもしくはundefind
    popLowestPriority(): Task | undefined {
        let   targetIndex: number = -1;
        let   targetTask : Task | undefined = undefined;
        const lowestPriority: number = this.getLowestPriority();
        for (let i=0; i<this.data.length; i++) {
            const task = this.data[i];
            if (task.priority === lowestPriority) {
                targetIndex = i;
                targetTask = task;
                break;
            }
        }
        if (targetIndex !== -1) {
            this.data.splice(targetIndex, 1);
        }
        return targetTask;
    }
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////////////////
    // 計算関数群
    /////////////////////////////////////////////////////////////////////////////////////
    // task.maxの合計値を返す関数
    // 引数: 無
    // 戻り値: tasksListに含まれるTaskのmax合計値
    maxSum(): number {
        let result: number = 0;
        this.data.forEach(task => {
            if (task.max) {
                result += task.max;
            }
        })
        return result;
    }



    // task.minの合計値を返す関数
    // 引数: 無
    // 戻り値: tasksListに含まれるTaskのmin合計値
    minSum(): number {
        let result: number = 0;
        this.data.forEach(task => {
            if (task.min) {
                result += task.min;
            }
        })
        return result;
    }
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////////////////
    // 取得関数群
    /////////////////////////////////////////////////////////////////////////////////////
    // 最も低い優先順位を取得する関数
    // 引数: 無
    // 戻り値: 優先順位の最小値
    getLowestPriority(): number {
        let result: number = this.getHighestPriority();
        this.data.forEach(task => {
            if (task.priority && task.priority < result) {
                result = task.priority;
            }
        })
        return result;
    }
    // 最も高い優先順位を取得する関数
    // 引数: 無
    // 戻り値: 優先順位の最大値
    getHighestPriority(): number {
        let result: number = 0;
        this.data.forEach(task => {
            if (task.priority && task.priority > result) {
                result = task.priority;
            }
        })
        return result;
    }
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
}