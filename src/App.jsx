import { useState, useEffect } from "react";
import "./App.css";
import { TodoProvider } from "./Contexts/TodoContext";
import { TodoForm, TodoItem } from "./Components";

function App() {
  const [todos, setTodos] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);

  const addTodo = (title) => {
    setTodos((prev) => [...prev, { id: Date.now(), ...title }]);
  };

  const updateTodo = (id, title) => {
    setTodos((prev) =>
      prev.map((prevTodo) => (prevTodo.id === id ? title : prevTodo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((title) => title.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));

    if (todos && todos.length > 0) {
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <TodoProvider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
    >
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">
            Manage Your Todos
          </h1>
          <div className="mb-4">
            {/* Todo form goes here */}
            <TodoForm />
          </div>

          {/*   To fetch data from external API  */}
          <button
            onClick={fetchDataFromAPI}
            className="rounded px-3 py-1 bg-blue-600 text-white shrink-0"
          >
            GetData
          </button>
          {fetchDataFromAPI && (
            <div className="flex flex-wrap gap-y-3">
              {/*Loop and Add TodoItem here */}
              {fetchedData.map((title) => (
                <div key={title.id} className="w-full">
                  <TodoItem title={title} />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-y-3">
            {todos.map((title) => (
              <div key={title.id} className="w-full">
                <TodoItem title={title} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
