import React from "react";
import Card from "./Card";
import styles from "../styles/Kanban.module.css";

const groupTickets = (tickets, groupBy) => {
  if (!Array.isArray(tickets)) {
    console.error("Invalid tickets data:", tickets);
    return {};
  }

  const grouped = {};
  tickets.forEach((ticket) => {
    const key = ticket[groupBy] || "No Group";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ticket);
  });
  return grouped;
};

const KanbanBoard = ({ tickets, groupBy, sortBy }) => {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return (
      <div>
        No tickets available. Please add tickets or check your API response.
      </div>
    );
  }

  const groupedTickets = groupTickets(tickets, groupBy);

  return (
    <div className={styles.kanbanBoard}>
      {Object.entries(groupedTickets).map(([group, tickets]) => (
        <div className={styles.kanbanColumn} key={group}>
          <div className={styles.kanbanColumnHeader}>
            <h2>{group}</h2>
            <span className={styles.ticketCount}>({tickets.length})</span>
          </div>
          <div className={styles.kanbanColumnCards}>
            {tickets.map((ticket) => (
              <Card key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

KanbanBoard.defaultProps = {
  tickets: [],
};

export default KanbanBoard;
