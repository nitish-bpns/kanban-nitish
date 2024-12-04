import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KanbanPage from "./pages/KanbanPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KanbanPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
