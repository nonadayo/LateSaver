// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
var TimeAllocator = /** @class */ (function () {
    function TimeAllocator(start, end, tasksList) {
        this.start = start;
        this.end = end;
        this.tasksList = tasksList;
        this.result = [];
    }
    //////////////////////////////////////////////////////////////////////////////////
    // 分単位での配分を決定する関数群
    //////////////////////////////////////////////////////////////////////////////////
    // 稼働可能時間、タスクの最大時間、最小時間から最適な時間の比率を求める関数
    // 引数: 稼働可能時間
    // 戻り値: [Taskインスタンス, その時間比率]を要素とする配列
    TimeAllocator.prototype.descideMinRatio = function (availMinutes) {
        // 最大時間と最小時間の計算
        var maxsum = this.tasksList.maxSum();
        var minsum = this.tasksList.minSum();
        // 配分を決める配列の設定
        var result = [];
        // 最大で配分できる場合は最大の比率で分配する
        if (maxsum <= availMinutes) {
            result = this.tasksList.data.map(function (task) { return [task, task.max]; });
            // 最大は無理だが最小ならいける場合は最小の比率で分配する
        }
        else if (maxsum > availMinutes && minsum <= availMinutes) {
            result = this.tasksList.data.map(function (task) { return [task, task.min]; });
            // 最小でもいけない場合はいけるようになるまで優先順位が低いものを削除し、最小の比率で分配する
        }
        else {
            while (minsum > availMinutes) {
                this.tasksList.popMinPriority();
                minsum = this.tasksList.minSum();
            }
            result = this.tasksList.data.map(function (task) { return [task, task.min]; });
        }
        return result;
    };
    // 与えられた数値をサンプル配列の比率で分配する関数
    // 引数: 分配したい数値, 比率サンプル用の配列
    // 戻り値: [Taskインスタンス, その時間比率]を要素とする配列
    TimeAllocator.prototype.distributeValByRatio = function (value, sampleArr) {
        // サンプルの合計値計算
        var arrsum = 0;
        sampleArr.forEach(function (elem) { return arrsum += elem[1]; });
        if (arrsum === 0) {
            return [];
        }
        // 比率で分配(小数点以下は切り捨て)
        var result = [];
        var resultsum = 0;
        sampleArr.forEach(function (sampleElem) {
            var min = Math.floor(value * sampleElem[1] / arrsum);
            result.push([sampleElem[0], min]);
            resultsum += min;
        });
        // 残ったものをランダムで分配
        if (value - resultsum > 0) {
            var remaind = value - resultsum;
            while (remaind > 0) {
                result[Math.floor(Math.random() * result.length)][1] += 1;
                remaind--;
            }
        }
        return result;
    };
    // 各タスクの時間配分(分)を決定する関数
    // 引数: 無
    // 戻り値: [Taskインスタンス, その時間配分]を要素とする配列
    TimeAllocator.prototype.minutesDistribute = function () {
        // 稼働可能時間の計算
        var availMinutes = this.end.differFrom(this.start).getValAsMin();
        // 分配比率の決定
        var distributeRatio = this.descideMinRatio(availMinutes);
        // 分配の作成
        return this.distributeValByRatio(availMinutes, distributeRatio);
    };
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    // 時刻ごとに割り当てをする関数群
    //////////////////////////////////////////////////////////////////////////////////
    TimeAllocator.prototype.allocate = function () {
        var _this = this;
        var minDistribute = this.minutesDistribute();
        var onTime = this.start.copy();
        minDistribute.map(function (distElem) {
            var sectionStart = onTime.copy();
            onTime.addMin(distElem[1]);
            var sectionEnd = onTime.copy();
            _this.result.push([distElem[0], sectionStart, sectionEnd]);
        });
    };
    return TimeAllocator;
}());
// exports.default = TimeAllocator;
export default TimeAllocator;