export default class Task {
    title: string | undefined;
    max:   number | undefined;
    min:   number | undefined;
    id:    number | undefined;
    priority: number | undefined;
    constructor(title?: string, max?: number, min?: number, priority?: number, id?: number) {
        this.title = title;
        this.max = max;
        this.min = min;
        this.priority = priority;
        this.id = id;
    }

    // 値がすべてセットされているかどうかを判定する
    // 戻り値: セットされていればtrue、それ以外はfalse
    isSet(): boolean {
        return (this.title !== undefined && this.max !== undefined && this.min !== undefined && this.priority !== undefined && this.id !== undefined);
    }
}