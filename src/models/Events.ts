import { observable, computed, action, decorate } from "mobx";
import Activity from "./Activity";

type Event = {
  id: string;
  name: string;
  startTime: number | null;
  endTime: number | null;
  duration: number;
  // priority: number;
  // status: "todo" | "active" | "canceled" | "done";
  // values: string[];
}

class Events {
  events: Event[];
  currentActivity: Activity | null;

  constructor() {
    this.events = this.getEvents();
    this.currentActivity = null;

  }

  getEvents = () => {
    const events = window.localStorage.getItem('events');
    if (events) {
      return JSON.parse(events);
    }
    return [];
  }

  add(activity:Activity) {
    this.events.push(activity.data);
    window.localStorage.setItem('events', JSON.stringify(this.events));
  }

}
decorate(Events, {
  events: observable,
  add: action
});

export default new Events();
