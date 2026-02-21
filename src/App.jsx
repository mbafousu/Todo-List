import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialState = [
  { id: 1, title: "Day 1 — React Fundamentals", completed: false },
  { id: 2, title: "Day 2 — State & Events", completed: false },
  { id: 3, title: "Day 3 — Hooks Deep Dive", completed: false },
  { id: 4, title: "Day 4 — Advanced Patterns", completed: false },
  { id: 5, title: "Day 5 — Mini Project", completed: false },
];

function TodoItem({ todo, onToggle, onDelete, onStartEdit, onChangeEditDraft, onSave }) {
  const isEditing = todo.isEditing;

  return (
    <li className={`todo ${todo.completed ? "done" : ""}`}>
      <label className="left">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.title}" as complete`}
        />
        {!isEditing ? (
          <span className="title">{todo.title}</span>
        ) : (
          <input
            className="editInput"
            type="text"
            value={todo.editDraft} 
            onChange={(e) => onChangeEditDraft(todo.id, e.target.value)}
            autoFocus
          />
        )}
      </label>

      <div className="actions">
        {!isEditing ? (
          <>
            <button
              className="btn"
              onClick={() => onStartEdit(todo.id)}
              disabled={todo.completed} 
              title={todo.completed ? "Completed items are locked (optional rule)" : "Edit this todo"}
            >
              Edit
            </button>

            <button
              className="btn danger"
              onClick={() => onDelete(todo.id)}
              disabled={!todo.completed} 
              title={!todo.completed ? "Complete it first to delete" : "Delete this todo"}
            >
              Delete
            </button>
          </>
        ) : (
          <button className="btn primary" onClick={() => onSave(todo.id)} disabled={!todo.editDraft.trim()}>
            Save
          </button>
        )}
      </div>
    </li>
  );
}

export default function App() {
  
  const [todos, setTodos] = useState(() =>
    initialState
      .slice()
      .reverse()
      .map((t) => ({
        ...t,
        isEditing: false,
        editDraft: t.title,
      }))
  );

  const [newTitle, setNewTitle] = useState("");

  const remainingCount = useMemo(
    () => todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [todos]
  );

  function addTodo(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    const todo = {
      userId: 1,
      id: crypto.randomUUID(), 
      title,
      completed: false,
      isEditing: false,
      editDraft: title,
    };

    
    setTodos((prev) => [todo, ...prev]);
    setNewTitle("");
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(id) {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, isEditing: true, editDraft: t.title } 
          : { ...t, isEditing: false } 
      )
    );
  }

  function changeEditDraft(id, value) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, editDraft: value } : t)));
  }

  function saveEdit(id) {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextTitle = t.editDraft.trim();
        if (!nextTitle) return { ...t, isEditing: false, editDraft: t.title }; 
        return { ...t, title: nextTitle, isEditing: false, editDraft: nextTitle };
      })
    );
  }

  return (
    <div className="page">
      <div className="card">
        {/* Heading  */}
        <h1>Todo List</h1>

        {/* Add new todo input  */}
        <form className="addRow" onSubmit={addTodo}>
          <input
            type="text"
            value={newTitle}
            placeholder='Add a todo (e.g. "find that missing sock")'
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="btn primary" type="submit" disabled={!newTitle.trim()}>
            Add
          </button>
        </form>

        <div className="meta">
          <span>{remainingCount} remaining</span>
          <span>{todos.length} total</span>
        </div>

        {/* List of todos  */}
        <ul className="list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onStartEdit={startEdit}
              onChangeEditDraft={changeEditDraft}
              onSave={saveEdit}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}