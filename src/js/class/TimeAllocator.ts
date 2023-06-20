import Time from "./Time";



export default class TimeAllocator {
    start: Time;
    end: Time
    constructor(start: Time, end: Time) {
        this.start = start;
        this.end   = end;
    }
}