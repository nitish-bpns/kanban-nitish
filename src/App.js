import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KanbanPage from "./pages/KanbanPage";
import TicketDetailPage from "./pages/TicketDetailPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KanbanPage />} />
        <Route path="/ticket/:ticketId" element={<TicketDetailPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
