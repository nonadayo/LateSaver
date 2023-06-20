// 時間を17:01などの形式で管理するためのクラス
// 演算機能とかを持ってる
export default class Time {
    hours: number;
    minutes: number;

    // 引数: 時間, 分を渡す
    constructor(hours: number, minutes: number) {
        this.hours   = hours;
        this.minutes = minutes;
    }


    // 時間のフォーマットで文字列を作成する関数
    // 引数:   無
    // 戻り値: "17:00"などの文字列
    getStr(): string {
        return `${this.hours}:${this.minutes}`;
    }
}