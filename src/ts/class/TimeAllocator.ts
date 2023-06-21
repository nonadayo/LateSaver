import Task from "./Task";
import TasksList from "./TasksList";
import Time from "./Time";



export default class TimeAllocator {
    start: Time;
    end: Time;
    result: Array< [Task, Time, Time] >;
    tasksList: TasksList;
    constructor(start: Time, end: Time, tasksList: TasksList) {
        this.start = start;
        this.end   = end;
        this.tasksList = tasksList;
        this.result = [];
    }

    //////////////////////////////////////////////////////////////////////////////////
    // 分単位での配分を決定する関数群
    //////////////////////////////////////////////////////////////////////////////////
    // 稼働可能時間、タスクの最大時間、最小時間から最適な時間の比率を求める関数
    // 引数: 稼働可能時間
    // 戻り値: [Taskインスタンス, その時間比率]を要素とする配列
    descideMinRatio(availMinutes: number): Array<[Task, number]> {
        // 最大時間と最小時間の計算
        let maxsum: number = this.tasksList.maxSum();
        let minsum: number = this.tasksList.minSum();
        // 配分を決める配列の設定
        let result: Array<[Task, number]> = [];
        // 最大で配分できる場合は最大の比率で分配する
        if (maxsum <= availMinutes) {
            result = this.tasksList.data.map(task => [task, task.max as number]);
        // 最大は無理だが最小ならいける場合は最小の比率で分配する
        } else if (maxsum > availMinutes && minsum <= availMinutes ) {
            result = this.tasksList.data.map(task => [task, task.min as number]);
        // 最小でもいけない場合はいけるようになるまで優先順位が低いものを削除し、最小の比率で分配する
        } else {
            while (minsum > availMinutes) {
                this.tasksList.popMinPriority();
                minsum = this.tasksList.minSum();
            }
            result = this.tasksList.data.map(task => [task, task.min as number]);
        }
        return result;
    }



    // 与えられた数値をサンプル配列の比率で分配する関数
    // 引数: 分配したい数値, 比率サンプル用の配列
    // 戻り値: [Taskインスタンス, その時間比率]を要素とする配列
    distributeValByRatio(value: number, sampleArr: Array<[Task, number]>):Array<[Task, number]> {
        // サンプルの合計値計算
        let arrsum = 0;
        sampleArr.forEach(elem => arrsum += elem[1]);
        if (arrsum === 0) {
            return []
        }
        // 比率で分配(小数点以下は切り捨て)
        const result: Array<[Task, number]> = [];
        let   resultsum = 0
        sampleArr.forEach(sampleElem => {
            const min = Math.floor(value*sampleElem[1]/arrsum);
            result.push([sampleElem[0], min]);
            resultsum += min;
        })
        // 残ったものをランダムで分配
        if (value - resultsum > 0) {
            let remaind = value - resultsum;
            while (remaind > 0) {
                result[Math.floor(Math.random()*result.length)][1] += 1;
                remaind--;
            }
        }
        return result;
    }



    // 各タスクの時間配分(分)を決定する関数
    // 引数: 無
    // 戻り値: [Taskインスタンス, その時間配分]を要素とする配列
    minutesDistribute(): Array<[Task, number]> {
        // 稼働可能時間の計算
        const availMinutes: number = this.end.differFrom(this.start).getValAsMin();
        // 分配比率の決定
        const distributeRatio: Array<[Task, number]> = this.descideMinRatio(availMinutes);
        // 分配の作成
        return this.distributeValByRatio(availMinutes, distributeRatio);
    }
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////////
    // 時刻ごとに割り当てをする関数群
    //////////////////////////////////////////////////////////////////////////////////
    allocate(): void {
        const minDistribute: Array<[Task, number]> = this.minutesDistribute();
        let onTime: Time = this.start.copy();
        minDistribute.map(distElem => {
            const sectionStart: Time = onTime.copy();
            onTime.addMin(distElem[1])
            const sectionEnd:   Time = onTime.copy();
            this.result.push([distElem[0], sectionStart, sectionEnd]);
        })
    }
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
}