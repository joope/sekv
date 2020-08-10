import { observable, computed, action, decorate } from "mobx";
import Task from "./Task";

class Sequence {
  name: string;
  startTime: number | null;
  endTime: number | null;
  tasks: Task[];
  currentTaskIndex: number;

  constructor(name: string) {
    this.name = name;
    this.startTime = null;
    this.endTime = null;
    this.tasks = [];
    this.currentTaskIndex = 0;
  }

  start() {
    this.startTime = Date.now();
    this.tasks[this.currentTaskIndex].start();
  }

  next() {
    this.tasks[this.currentTaskIndex].end();
    this.currentTaskIndex++;
    if (!this.tasks[this.currentTaskIndex]) {
      this.endTime = Date.now();
      this.currentTaskIndex = 0;
      return;
    }
    this.tasks[this.currentTaskIndex].start();
  }

  end() {
    this.tasks[this.currentTaskIndex].end();
    this.endTime = Date.now();
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }
}
decorate(Sequence, {
  startTime: observable,
  name: observable,
  endTime: observable,
  tasks: observable,
  addTask: action
});

export default Sequence;
