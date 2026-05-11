import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [editorStatus, setEditorStatus] = useState(false);
  const [inputTask, setInputTask] = useState("");
  const [priorityTag, setPriorityTag] = useState("urgent");
  const [statusTag, setStatusTag] = useState("In Progress");
  const [compiledTask, setCompiledTask] = useState(() => {
    const saved = localStorage.getItem("task-list");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("task-list", JSON.stringify(compiledTask));
  }, [compiledTask]);

  const deleteFunction = (deleteIndex) => {
    const filteredArray = compiledTask.filter(
      (_, currentIndex) => currentIndex !== deleteIndex,
    );
    setCompiledTask(filteredArray);
  };

  const editFunction = (editIndex) => {
    if (inputTask !== "") {
      alert("Please save your task before proceed!");
      return;
    }

    setEditorStatus(true);

    const grabTask2Edit = compiledTask[editIndex];
    setInputTask(grabTask2Edit.taskName);
    setPriorityTag(grabTask2Edit.priotity);
    setStatusTag(grabTask2Edit.status);

    deleteFunction(editIndex);
  };

  const [searchFilter, setSearchFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredTasks = compiledTask.filter((item) => {
    const matchSearch = item.taskName
      .toLowerCase()
      .includes(searchFilter.toLowerCase());
    const matchPriority =
      priorityFilter === "all" || item.priority === priorityFilter;
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  return (
    <section>
      <div>
        <h1>My Tasks</h1>
        <button onClick={() => setEditorStatus(!editorStatus)}>
          + Add tasks
        </button>
        {editorStatus && (
          <form>
            <div className="task-input-container">
              <textarea
                placeholder="Write your task here..."
                className="editor"
                value={inputTask}
                onChange={(e) => setInputTask(e.target.value)}
              ></textarea>
              <div>
                <select
                  className="priority-tag"
                  value={priorityTag}
                  onChange={(e) => setPriorityTag(e.target.value)}
                >
                  <option value="urgent">Urgent</option>
                  <option value="not-urgent">Not Urgent</option>
                </select>
              </div>
              <div>
                <select
                  className="status-tag"
                  value={statusTag}
                  onChange={(e) => setStatusTag(e.target.value)}
                >
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="save-btn-container">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const newTask = {
                      taskName: inputTask,
                      priority: priorityTag,
                      status: statusTag,
                    };
                    {
                      setCompiledTask([...compiledTask, newTask]);
                    }
                    setInputTask("");
                  }}
                >
                  Save task
                </button>
              </div>
            </div>
          </form>
        )}
        <div className="task-container">
          <h2>Task List</h2>
          <input
            placeholder="Search task..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          ></input>
          <div className="filter-priority-container">
            <label>Filter By Priority: </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="not-urgent">Not Urgent</option>
            </select>
          </div>
          <div className="filter-status-container">
            <label>Filter By Status: </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Progress</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <ul className="task-summary">
            {filteredTasks.map((item, index) => (
              <li key={index} className="single-list">
                <span>{item.taskName}</span>, <span>{item.priority}</span>,
                <span>{item.status}</span>
                <div>
                  <button onClick={() => deleteFunction(index)}>Delete</button>
                  <button onClick={() => editFunction(index)}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default App;
