import React, { useState, useEffect } from "react";
import axios from 'axios';
import { observer } from "mobx-react";
import "./App.css";

type Activity = {
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

const oldState = window.localStorage.getItem('appState');

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
    "Workout",
    "Meditation",
    "Brush teeth",
    "Study",
    "Eat",
    "Browse internet",
    "Research",
    "Misc",
    "Shower",
    "Thinking",
    "Socialising"
  ],
  events: [
  ],
}


function SequenceView() {
  const [state, setState] = useState(appState);

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
        ...state.events,
        event,
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
        ...state.events,
        event,
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
    axios.get('https://api.joope.net/events')
      .then(({data}) => {
        setState({
          ...state,
          events: data
        })
      })
  },[])

  return (
    <div className="App">
      <div className="activities">
        {state.activities.map(activity => (
          <button key={activity} className={activity === state.currentActivity.name ? 'active' : 'todo'} onClick={() => handleStartActivity(activity)}>{activity}</button>
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
      {state.events.map(event => (
          <p key={event.name + event.startedAt} className="event">{event.name} {event.duration / 1000}s</p>
        ))}
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
