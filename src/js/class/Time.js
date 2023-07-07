// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// 時間を17:01などの形式で管理するためのクラス
// 演算機能とかを持ってる
var Time = /** @class */ (function () {
    // 引数: 時間, 分を渡す
    function Time(hours, minutes) {
        if (hours !== undefined && minutes !== undefined) {
            this.hours = hours;
            this.minutes = minutes;
        }
        else {
            var now = new Date();
            this.hours = now.getHours();
            this.minutes = now.getMinutes();
        }
    }
    /////////////////////////////////////////////////////////////////////////////////
    // 取得関数群
    /////////////////////////////////////////////////////////////////////////////////
    // 時間のフォーマットで文字列を作成する関数
    // 引数:   無
    // 戻り値: "17:00"などの文字列
    Time.prototype.getStr = function () {
        if (this.minutes < 10) {
            return "".concat(this.hours, ":0").concat(this.minutes);
        }
        else {
            return "".concat(this.hours, ":").concat(this.minutes);
        }
    };
    // 時間, 分を分に変換する関数
    // 引数: 無
    // 戻り値: 分
    Time.prototype.getValAsMin = function () {
        return this.hours * 60 + this.minutes;
    };
    // インスタンスをコピーする関数
    // 引数: 無
    // 戻り値: Timeインスタンス
    Time.prototype.copy = function () {
        return new Time(this.hours, this.minutes);
    };
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    // 演算関数群
    /////////////////////////////////////////////////////////////////////////////////
    // 指定されたTimeからの単純差を計算する関数
    // 引数: Timeインスタンス
    // 戻り値: Timeインスタンス
    Time.prototype.differFrom = function (time) {
        var hoursDiff = this.hours - time.hours;
        var minDiff = this.minutes - time.minutes;
        return new Time(hoursDiff, minDiff);
    };
    // 分を足す関数
    // 引数: 足したい分数
    // 戻り値: なし
    Time.prototype.addMin = function (min) {
        this.minutes += min;
        while (this.minutes >= 60) {
            this.hours++;
            if (this.hours >= 24) {
                this.hours = 0;
            }
            this.minutes -= 60;
        }
    };
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    // 判定関数群
    /////////////////////////////////////////////////////////////////////////////////
    // 比較関数
    // 引数: Timeインスタンス
    // 戻り値: this > timeなら正, this == timeなら0, this < timeなら負の値を返す
    Time.prototype.compareTo = function (time) {
        var differTime = this.differFrom(time);
        return differTime.getValAsMin();
    };
    return Time;
}());
// exports.default = Time;
export default Time;
