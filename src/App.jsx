import React from 'react'
import { firebase } from './firebase'

function App() {

  //React hooks for state management
  const [task, setTask] = React.useState("")
  const [tasks, setTasks] = React.useState([])
  const [editMode, setEditMode] = React.useState(false)
  const [id, setId] = React.useState(null)
  const db = firebase.firestore()

  //Executes only once, gets data from firebase and displays it
  React.useEffect(() => {
    const getData = async () => {
      try {
        const data = await db.collection('TasksCol').get()
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setTasks(arrayData)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [db])

  /** Function in charge of eliminating a task from both display and firebase
  * @param {idElim} alphanumeric
  * Object id to eliminate
  */
  const eliminateTask = (idElim) => {
    //Edit display
    const filteredArray = tasks.filter(elem => elem.id !== idElim)
    setTasks(filteredArray)
    //Edit firebase
    db.collection('TasksCol').doc(idElim).delete()
  }

  /** Function in charge of adding a task on both display and firebase*/
  const addTask = async (e) => {
    e.preventDefault()
    if (!task.trim()) {
      console.log("You must introduce a task")
      return
    }
    try {
      //Edit firebase
      const newTask = {
        name: task,
        time: firebase.firestore.Timestamp.fromDate(new Date())
      }
      const data = await db.collection('TasksCol').add(newTask)
      
      //Edit display
      setTasks([...tasks, { ...newTask, id: data.id }])
      setTask('')
    } catch (error) {
      console.log(error);
    }
  }

  /** Function in charge of editing an existing task on both display and firebase*/
  const editTask = (e) => {
    e.preventDefault()
    if (!task.trim()) {
      console.log("You must introduce a task")
      return
    }
    //Edit firebase
    try {
      db.collection("TasksCol").doc(id).set({
        name: task,
        time: firebase.firestore.Timestamp.fromDate(new Date()),
      })
    } catch (error) {
      console.log(error);
    }

    //Edit display
    const updatedArray = tasks.map(item => (item.id === id ? { id: item.id, time: item.time, name: task } : item))
    setTasks(updatedArray)
    setEditMode(false)
    setTask('')
    setId('')
  }

  const setEdition = (item) => {
    setEditMode(true)
    setId(item.id)
    setTask(item.name)
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-10">
          <ul className="list-group">
            {
              tasks.map(item => (
                <li key={item.id} className="list-group-item col-6">
                  <strong>{item.name}</strong> - {item.time.toDate().toDateString()}
                  <button className="btn btn-danger btn-sm float-end mx-1" onClick={() => editMode ? console.log("You are currently in edition mode") : eliminateTask(item.id)}>Eliminate</button>
                  <button className="btn btn-warning btn-sm float-end" onClick={() => setEdition(item)} >Edit</button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-2">
          <form onSubmit={editMode ? editTask : addTask}>
            <input
              type="text"
              placeholder="Write your task"
              className="form-control mb"
              value={task}
              onChange={e => setTask(e.target.value)}
            />
            <button type="submit" className={editMode ? "btn btn-warning btn-block mt-2" : "btn btn-danger btn-block mt-2"}>
              {editMode ? 'Edit task' : 'Add task'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
