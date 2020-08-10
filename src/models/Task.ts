import { observable, computed, action, decorate } from "mobx";

class Task {
  name: string;
  startTime: number | null;
  endTime: number | null;
  enjoyability: number;
  priority: number;
  status: "todo" | "inProgress" | "canceled" | "done";

  constructor(name: string) {
    this.name = name;
    this.startTime = null;
    this.endTime = null;
    this.status = "todo";
    this.enjoyability = 5;
    this.priority = 5;
  }

  start() {
    this.startTime = Date.now();
    this.status = "inProgress";
  }

  cancel() {
    this.endTime = Date.now();
    this.status = "canceled";
  }

  end() {
    this.endTime = Date.now();
    this.status = "done";
  }

  get duration() {
    if (this.startTime && this.endTime) {
      return new Date(this.endTime - this.startTime).toTimeString();
    }
    if (this.startTime) {
      return new Date(Date.now() - this.startTime).toTimeString();
    }
    return "";
  }
}
decorate(Task, {
  startTime: observable,
  name: observable,
  endTime: observable,
  duration: computed
});

export default Task;
