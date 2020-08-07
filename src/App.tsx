import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import "./App.css";
import Sequence from "./Seqvence";
import Tasks from "./Tasks";
import Task from "./Task";

const Sequences = [new Sequence("Workout"), new Sequence("Morning")];
// const Tasks = [new Task("Brush teeth"), new Task("Invent cure for cancer")];

function SequenceView() {
  const [name, setName] = useState("");
  const [sequences, setSequences] = useState<Sequence[]>(Sequences);
  const [currentSequence, setCurrentSequence] = useState<Sequence>();
  useEffect(() => {
    setName("somehting else");
  }, []);

  const handleNewSequence = (e: any) => {
    e.preventDefault();
    setSequences([...sequences, new Sequence(name)]);
    setName("");
  };

  if (currentSequence) {
    return (
      <Tasks
        sequence={currentSequence}
        setCurrentSequence={setCurrentSequence}
      />
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {sequences.map(sequence => (
          <h2 onClick={() => setCurrentSequence(sequence)}>{sequence.name}</h2>
        ))}
        <form onSubmit={handleNewSequence}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </header>
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
