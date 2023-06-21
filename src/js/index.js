import { Task, TasksList, Time, TimeAllocator } from "./class/index.js";
const tasksList = new TasksList();
tasksList.add(new Task("test0", 60, 10, 0, 0));
tasksList.add(new Task("test1", 50, 5, 0, 0));
tasksList.add(new Task("test2", 40, 20, 0, 0));
tasksList.add(new Task("test3", 30, 15, 0, 0));
const allocator = new TimeAllocator(new Time(10, 30), new Time(11, 30), tasksList);
allocator.allocate()
console.log(allocator.result)