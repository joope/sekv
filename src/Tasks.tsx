import React, { useState } from "react";
import { observer } from "mobx-react";
import Sequence from "./Seqvence";
import Task from "./Task";

type TasksProps = {
  sequence: Sequence;
  setCurrentSequence: any;
};
function Tasks({ sequence, setCurrentSequence }: TasksProps) {
  const [name, setName] = useState("");

  const handleNewTask = (e: any) => {
    e.preventDefault();
    sequence.addTask(new Task(name));
    setName("");
  };
  return (
    <div>
      <h1>{sequence.name}</h1>
      {sequence.tasks.map(task => (
        <div className="task">
          <p className={task.status}>{task.name}</p>
          <p className={task.status}>{task.duration}</p>
        </div>
      ))}
      <form onSubmit={handleNewTask}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <button onClick={() => sequence.start()}>Start</button>
      <button onClick={() => sequence.next()}>Next</button>
      <button onClick={() => sequence.end()}>Stop</button>
      <button onClick={() => setCurrentSequence(undefined)}>Return</button>
    </div>
  );
}

export default observer(Tasks);
