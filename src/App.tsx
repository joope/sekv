import React, { useState, useEffect } from "react";
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import axios from 'axios';
import { observer } from "mobx-react";
import moment from 'moment';
import "./App.css";

type Activity = {
  id?: string,
  name: string,
  startedAt: number | null,
  endedAt: number | null,
  status: "todo" | "active" | "canceled" | "done",
  duration: number,
}

type appState = {
  currentActivity: Activity,
  newActivityName: string,
  activities: string[],
  events: Activity[],
}

const oldState = null; // window.localStorage.getItem('appState');

const appState:appState = oldState ? JSON.parse(oldState) : {
  currentActivity: {
    name: '',
    startedAt: null,
    endedAt: null,
    duration: 0,
    status: 'todo'
  },
  newActivityName: '',
  activities: [

  ],
  events: [
  ],
}


function SequenceView() {
  const [state, setState] = useState(appState);
  const calendarGroups = state.activities.map((a) => ({id: a, title: a}));
  const timelineItems = state.events.map((e:Activity) => ({
    ...e,
    id: e.id || '1',
    group: e.name,
    title: '',
    start_time: e.startedAt || 1,
    end_time: e.endedAt || 1,
  }))

  const handleNewActivity = (e: any) => {
    e.preventDefault();
    if (!state.newActivityName) return;
    setState({
      ...state,
      activities: [
        ...state.activities, 
        state.newActivityName
      ],
      newActivityName: '',
    });
    axios.post('https://api.joope.net/activities', {name: state.newActivityName});
  };

  const stopActivity = () => {
    const event:Activity =           {
      ...state.currentActivity,
      status: 'done',
      duration: Date.now() - (state.currentActivity.startedAt || 0),
      endedAt: Date.now()
    }
    setState({
      ...state,
      currentActivity: {
        name: '',
        status: 'todo',
        startedAt: null,
        endedAt: null,
        duration: 0,
      },
      events: [
        event,
        ...state.events,
      ]
    });
    axios.post('https://api.joope.net/events', event);
  }

  const changeActivity  = (activity:string) => {
    const event:Activity =           {
      ...state.currentActivity,
      status: 'done',
      duration: Date.now() - (state.currentActivity.startedAt || 0),
      endedAt: Date.now()
    }
    setState({
      ...state,
      currentActivity: {
        name: activity,
        status: 'active',
        startedAt: Date.now(),
        endedAt: null,
        duration: 0,
      },
      events: [
        event,
        ...state.events,
      ]
    });
    axios.post('https://api.joope.net/events', event);
  }

  const handleStartActivity = (activity: string) => {
    if (activity === state.currentActivity.name) {
      return stopActivity();
    }

    if (state.currentActivity.name && state.currentActivity.name !== activity) {
      return changeActivity(activity);
    }
    setState({
      ...state,
      currentActivity: {
        name: activity,
        status: 'active',
        startedAt: Date.now(),
        endedAt: null,
        duration: 0,
      },
    })
  }

  const updateNewActivityName = (e:any) => {
    setState({
      ...state,
      newActivityName: e.target.value,
    })
  }

  useEffect(() => {
    window.localStorage.setItem('appState', JSON.stringify(state));
  }, [state])

  useEffect(() => {
    const getData = async () => {
      const {data:activities} = await axios.get('https://api.joope.net/activities');
      const {data:events} = await axios.get('https://api.joope.net/events');
      const mappedActivities = activities.map((a:any) => a.name);
      const sortedEvents = events.sort((a:any,b:any) => b.endedAt - a.endedAt);
      setState({
        ...state,
        activities: mappedActivities,
        events: sortedEvents,
      })
    }
    getData();
  },[])

  const handleItemDrag = ({eventType, itemId, time, edge, newGroupOrder}:any) => {
    const currentItem = state.events.find(e => e.id === itemId);
    if (!currentItem) return;
  
    let newItem = currentItem;

    if (eventType === 'move') {
      const newGroup = calendarGroups[newGroupOrder]?.id || currentItem?.name || 'jotain';
      newItem = {
        ...currentItem,
        name: newGroup,
        startedAt: time,
        endedAt: currentItem?.endedAt || null,
      }
    }

    if (eventType === 'resize') {
      const newStartedTime = edge === 'left' ? time : currentItem?.startedAt || null;
      const newEndedTime = edge === 'right' ? time : currentItem?.endedAt || null;
      newItem = {
        ...currentItem,
        startedAt: newStartedTime,
        endedAt: newEndedTime,
      }
    }
    console.log(newItem)
    axios.put('https://api.joope.net/events/' + newItem.id, newItem);
    setState({
      ...state,
      events: state.events.map(e => e.id === itemId ? newItem : e)
    })
  }

  return (
    <div className="App">
      <div className="activities">
        {state.activities.map((activity, index) => (
          <button key={activity + index} className={activity === state.currentActivity.name ? 'active' : 'todo'} onClick={() => handleStartActivity(activity)}>{activity}</button>
        ))}
        <form onSubmit={handleNewActivity}>
          <input
            type="text"
            value={state.newActivityName}
            onChange={updateNewActivityName}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      {calendarGroups && timelineItems.length !== 0 && <Timeline 
        groups={calendarGroups}
        items={timelineItems}
        defaultTimeStart={moment().add(-7, 'day')}
        defaultTimeEnd={moment().add(1, 'hour')}
        onItemDrag={handleItemDrag}
      /> }

      {/* {state.events.map(event => (
          <p key={event.name + event.startedAt} className="event">{event.name} {(event.duration / 1000 / 60).toFixed(0)} min</p>
        ))} */}
    </div>
  );
}

// function TaskView() {
//   const params = useParams();
//   const sequence =
//   return (

//   )
// }

// function App() {
//   return (
//     <Router>
//       <SequenceView />
//       <TaskView />
//     </Router>
//   );
// }

export default observer(SequenceView);
