// jsでは各ファイルで export default で export してあげて、そのディレクトリの export を以下のようにindex.tsで
// 再度 export default as としてやると扱いやすくなる。
// 別のjsでimportしたいときは import {TasksList, TimeAllocator, Time} from "パスを入力" のようにできる。
export { default as TasksList     } from "./TasksList";
export { default as Task          } from "./Task";
export { default as TimeAllocator } from "./TimeAllocator";
export { default as Time          } from "./Time";