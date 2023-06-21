// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// Taskクラスを要素にもつ配列のクラス
// Taskクラス配列に対して必要な動作をまとめている
var TasksList = /** @class */ (function () {
    function TasksList() {
        this.data = [];
    }
    /////////////////////////////////////////////////////////////////////////////////////
    // 配列操作関数群
    /////////////////////////////////////////////////////////////////////////////////////
    // タスクを新しく追加する関数
    // 引数:   Taskクラスのインスタンス
    // 戻り値: 無
    TasksList.prototype.add = function (newTask) {
        var targetIndex = -1;
        for (var i = 0; i < this.data.length; i++) {
            var task = this.data[i];
            if (task.isSet() && newTask.isSet()) {
                if (task.priority < newTask.priority) {
                    targetIndex = i;
                    break;
                }
            }
        }
        if (targetIndex >= 0) {
            this.data.push(newTask);
        }
        else {
            this.data.splice(targetIndex, 0, newTask);
        }
    };
    // 優先順位が最も低いTaskを取り除いて取得する関数関数
    // 引数: 無
    // 戻り値: 優先順位が最も低いTaskインスタンスもしくはundefind
    TasksList.prototype.popMinPriority = function () {
        var targetIndex = -1;
        var targetTask = undefined;
        var minPriority = this.getMinPriority();
        for (var i = 0; i < this.data.length; i++) {
            var task = this.data[i];
            if (task.priority === minPriority) {
                targetIndex = i;
                targetTask = task;
                break;
            }
        }
        if (targetIndex !== -1) {
            this.data.splice(targetIndex, 1);
        }
        return targetTask;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    // 計算関数群
    /////////////////////////////////////////////////////////////////////////////////////
    // task.maxの合計値を返す関数
    // 引数: 無
    // 戻り値: tasksListに含まれるTaskのmax合計値
    TasksList.prototype.maxSum = function () {
        var result = 0;
        this.data.forEach(function (task) {
            if (task.max) {
                result += task.max;
            }
        });
        return result;
    };
    // task.minの合計値を返す関数
    // 引数: 無
    // 戻り値: tasksListに含まれるTaskのmin合計値
    TasksList.prototype.minSum = function () {
        var result = 0;
        this.data.forEach(function (task) {
            if (task.min) {
                result += task.min;
            }
        });
        return result;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    // 取得関数群
    /////////////////////////////////////////////////////////////////////////////////////
    // 最も低い優先順位を取得する関数
    // 引数: 無
    // 戻り値: 優先順位の最小値
    TasksList.prototype.getMinPriority = function () {
        var result = this.getMaxPriority();
        this.data.forEach(function (task) {
            if (task.priority && task.priority < result) {
                result = task.priority;
            }
        });
        return result;
    };
    // 最も高い優先順位を取得する関数
    // 引数: 無
    // 戻り値: 優先順位の最大値
    TasksList.prototype.getMaxPriority = function () {
        var result = 0;
        this.data.forEach(function (task) {
            if (task.priority && task.priority > result) {
                result = task.priority;
            }
        });
        return result;
    };
    return TasksList;
}());
// exports.default = TasksList;
export default TasksList;