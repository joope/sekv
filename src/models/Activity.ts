import { observable, computed, action, decorate } from "mobx";
import {uuid} from 'uuidv4';
import Events from './Events';

class Activity {
  id: string;
  name: string;
  startTime: number | null;
  endTime: number | null;
  duration: number;
  enjoyability: number;
  priority: number;
  status: "todo" | "active" | "canceled" | "done";
  values: string[];

  constructor(name: string) {
    this.id = uuid();
    this.name = name;
    this.startTime = null;
    this.endTime = null;
    this.duration = 0;
    this.status = "todo";
    this.enjoyability = 5;
    this.priority = 5;
    this.values = [];
  }

  start() {
    this.startTime = Date.now();
    this.endTime = null;
    this.status = "active";
  }

  cancel() {
    this.endTime = Date.now();
    this.status = "canceled";
    this.duration = this.endTime - (this.startTime || this.endTime);
    Events.add(this);
  }

  end() {
    this.endTime = Date.now();
    this.status = "done";
    this.duration = this.endTime - (this.startTime || this.endTime);
    Events.add(this);
  }

  get data(){
    return {
      id: this.id,
      name: this.name,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
    }
  }
}
decorate(Activity, {
  startTime: observable,
  name: observable,
  endTime: observable,
  status: observable,
  data: computed,
});

export default Activity;
