import { observable, computed, action, decorate } from "mobx";
import Activity from "./Activity";

const exampleActivities = [
  new Activity("Workout"), 
  new Activity("Meditation"), 
  new Activity("Brush teeth"), 
  new Activity("Study"), 
  new Activity("Eat"), 
  new Activity("Browse internet"), 
  new Activity("Research"), 
  new Activity("Misc")
];

class ActivityHandler {
  activities: Activity[];
  currentActivity: Activity | null;

  constructor() {
    this.activities = this.getActivites();
    this.currentActivity = null;

  }

  getActivites() {
    const activities = window.localStorage.getItem('activities');
    if (activities) {
      return JSON.parse(activities);
    }
    return exampleActivities;
  }

  start(activity:Activity) {
    console.log('starting', activity.name)
    if (this.currentActivity && this.currentActivity.id === activity.id) {
      this.currentActivity.end();
      this.currentActivity = null;
      return;
    } else if (this.currentActivity) {
      this.currentActivity.end();
    }
    this.currentActivity = activity;
    this.currentActivity.start();
  }

  addActivity(activity: Activity) {
    this.activities.push(activity);
    window.localStorage.setItem('activities', JSON.stringify(this.activities));
  }
}
decorate(ActivityHandler, {
  activities: observable,
  addActivity: action
});

export default ActivityHandler;
