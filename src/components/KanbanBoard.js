import React from "react";
import Card from "./Card";
import styles from "../styles/Kanban.module.css";
import { getColorFromInitials, getInitials } from "./Utils";

const priorityMapping = {
  0: { label: "No Priority", img: "/assets/no.svg" },
  4: { label: "Urgent", img: "/assets/urgent2.svg" },
  3: { label: "High", img: "/assets/high.svg" },
  2: { label: "Medium", img: "/assets/mid.svg" },
  1: { label: "Low", img: "/assets/low.svg" },
};

const statusMapping = {
  Todo: "/assets/To-do.svg",
  "In progress": "/assets/in-progress.svg",
  Backlog: "/assets/Backlog.svg",
};

const priorityOrder = [0, 4, 3, 2, 1];

const groupTickets = (tickets, groupBy) => {
  return tickets.reduce((grouped, ticket) => {
    const key =
      groupBy === "priority" ? ticket[groupBy] : ticket[groupBy] || "No Group";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ticket);
    return grouped;
  }, {});
};

const sortPriorityGroups = (groups) => {
  return priorityOrder.map((priority) => ({
    key: priority,
    label: priorityMapping[priority].label,
    img: priorityMapping[priority].img,
    tickets: groups[priority] || [],
  }));
};

const sortTicketsByTitle = (tickets) => {
  return [...tickets].sort((a, b) => a.title.localeCompare(b.title));
};

const KanbanBoard = ({ tickets, groupBy, sortBy, users }) => {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return (
      <div>
        No tickets available. Please add tickets or check your API response.
      </div>
    );
  }

  const groupedTickets = groupTickets(tickets, groupBy);

  const sortedGroups =
    groupBy === "priority"
      ? sortPriorityGroups(groupedTickets)
      : Object.entries(groupedTickets).map(([key, value]) => ({
          key,
          label: key,
          tickets: value,
        }));

  return (
    <div className={styles.kanbanBoard}>
      {sortedGroups.map(({ key, label, img, tickets }) => {
        const user =
          groupBy === "assigned_user" && users.find((u) => u.name === label);
        const userAvailability = user ? user.available : false;
        const priorityImage = img || statusMapping[label];

        return (
          <div className={styles.kanbanColumn} key={key}>
            <div className={styles.kanbanColumnHeader}>
              <h2>
                {groupBy === "assigned_user" && (
                  <div className={styles.userHeaderWrapper}>
                    <div
                      className={styles.userInitial}
                      style={{ background: getColorFromInitials(label) }}
                    >
                      {getInitials(label)}
                    </div>
                    <div
                      className={styles.availabilityDot}
                      style={{
                        background: userAvailability ? "seagreen" : "lightgrey",
                      }}
                    ></div>
                    <span className={styles.userName}>{label}</span>
                  </div>
                )}
                {priorityImage && (
                  <img
                    src={priorityImage}
                    alt={label}
                    className={styles.priorityImg}
                  />
                )}
                {groupBy !== "assigned_user" && label}
                <span className={styles.ticketCountNew}>{tickets.length}</span>
              </h2>
              <span className={styles.ticketCount2}>
                <img
                  className={styles.addTicket}
                  src="/assets/add.svg"
                  alt="add"
                />
                <img
                  className={styles.menuTicket}
                  src="/assets/menu.svg"
                  alt="menu"
                />
              </span>
            </div>
            <div className={styles.kanbanColumnCards}>
              {(sortBy === "title" ? sortTicketsByTitle(tickets) : tickets).map(
                (ticket) => (
                  <Card key={ticket.id} ticket={ticket} users={users} />
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

KanbanBoard.defaultProps = {
  tickets: [],
};

export default KanbanBoard;
