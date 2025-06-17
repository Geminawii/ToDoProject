import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TodoDetails from "./pages/DetailsPage";
import AddTodo from "./pages/AddToDo";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/Error404";
import ErrorCheck from "./components/ErrorCheck";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CategoriesPage from "./pages/Categories";


function App() {
  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/todos/:id" element={<TodoDetails />} />
            <Route path="/todos/add" element={<AddTodo />} />
            <Route path="/test-error" element={<ErrorCheck />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
      </DndProvider>
    </ErrorBoundary>
  );
}

export default App;
