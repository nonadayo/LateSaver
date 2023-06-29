// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
var Task = /** @class */ (function () {
    function Task(title, max, min, priority, id) {
        this.title = title;
        this.max = max;
        this.min = min;
        this.priority = priority;
        this.id = id;
    }
    // 値がすべてセットされているかどうかを判定する
    // 戻り値: セットされていればtrue、それ以外はfalse
    Task.prototype.isSet = function () {
        return (this.title !== undefined && this.max !== undefined && this.min !== undefined && this.priority !== undefined && this.id !== undefined);
    };
    return Task;
}());
// exports.default = Task;
export default Task;