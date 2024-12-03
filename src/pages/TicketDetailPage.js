import React from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/TicketDetail.module.css";

const TicketDetailPage = ({ tickets }) => {
  const { ticketId } = useParams();
  const ticket = tickets.find((t) => t.id === parseInt(ticketId, 10));

  if (!ticket) {
    return <div className={styles.ticketDetail}>Ticket not found.</div>;
  }

  const { title, priority, status, assigned_user } = ticket;

  return (
    <div className={styles.ticketDetail}>
      <h1>{title}</h1>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <p>
        <strong>Priority:</strong>{" "}
        {["No Priority", "Low", "Medium", "High", "Urgent"][priority]}
      </p>
      <p>
        <strong>Assigned To:</strong> {assigned_user || "Unassigned"}
      </p>
    </div>
  );
};

export default TicketDetailPage;
