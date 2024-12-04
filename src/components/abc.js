// utils.js (New File for Utility Functions)
export const getColorFromInitials = (name) => {
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  };
  
  export const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };
  
  // Card.js
  import React from "react";
  import styles from "../styles/Card.module.css";
  import { getColorFromInitials, getInitials } from "../utils";
  
  const Card = ({ ticket, users }) => {
    const { id, title, priority, tag, assigned_user, status } = ticket;
    const user = users.find((us) => us.name === assigned_user);
    const available = user?.available;
    const initials = getInitials(assigned_user);
  
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardId}>{id}</span>
          <div className={styles.userInitialWrapper}>
            <div
              className={styles.userInitial}
              style={{ background: getColorFromInitials(assigned_user) }}
            >
              {initials}
            </div>
            <div
              className={styles.availabilityDot}
              style={{ background: available ? "seagreen" : "lightgrey" }}
            ></div>
          </div>
        </div>
        <h3 className={styles.cardTitle}>
          {status && (
            <img
              className={styles.taskStatus}
              src={`/assets/${status.toLowerCase().replace(/\s/g, '-')}.svg`}
              alt={status}
            />
          )}
          {title}
        </h3>
        <div className={styles.statusFeature}>
          <div className={styles.taskPriority}>
            {priority !== undefined && (
              <img
                className={styles.priorityImg}
                src={`/assets/${["no", "low", "mid", "high", "urgent"][priority]}.svg`}
                alt="priority"
              />
            )}
          </div>
          <div className={styles.cardTags}>
            {tag.map((t, index) => (
              <span key={index} className={styles.tagPill}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Card;
  
  // KanbanBoard.js
  import React from "react";
  import Card from "./Card";
  import styles from "../styles/Kanban.module.css";
  import { getColorFromInitials, getInitials } from "../utils";
  
  const groupTickets = (tickets, groupBy) => {
    const grouped = {};
    tickets.forEach((ticket) => {
      const key = ticket[groupBy] || "No Group";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ticket);
    });
    return grouped;
  };
  
  const KanbanBoard = ({ tickets, groupBy, sortBy, users }) => {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return <div>No tickets available. Please add tickets or check your API response.</div>;
    }
  
    const groupedTickets = groupTickets(tickets, groupBy);
  
    return (
      <div className={styles.kanbanBoard}>
        {Object.entries(groupedTickets).map(([group, tickets]) => (
          <div className={styles.kanbanColumn} key={group}>
            <div className={styles.kanbanColumnHeader}>
              <h2>
                {groupBy === "assigned_user" && (
                  <div className={styles.userHeaderWrapper}>
                    <div
                      className={styles.userInitial}
                      style={{ background: getColorFromInitials(group) }}
                    >
                      {getInitials(group)}
                    </div>
                    <span className={styles.userName}>{group}</span>
                  </div>
                )}
                {groupBy !== "assigned_user" && group}
                <span className={styles.ticketCountNew}>{tickets.length}</span>
              </h2>
            </div>
            <div className={styles.kanbanColumnCards}>
              {tickets.map((ticket) => (
                <Card key={ticket.id} ticket={ticket} users={users} />
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
  
  // KanbanPage.js
  import React, { useState, useEffect, useRef } from "react";
  import KanbanBoard from "../components/KanbanBoard";
  import { fetchTickets } from "../services/api";
  import styles from "../styles/Kanban.module.css";
  
  const KanbanPage = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupBy, setGroupBy] = useState("status");
    const [sortBy, setSortBy] = useState("priority");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetchTickets();
          if (response && Array.isArray(response.tickets)) {
            setUsers(response.users);
            const usersMap = response.users.reduce((map, user) => {
              map[user.id] = user.name;
              return map;
            }, {});
  
            const enrichedTickets = response.tickets.map((ticket) => ({
              ...ticket,
              assigned_user: usersMap[ticket.userId] || "Unassigned",
            }));
            setTickets(enrichedTickets);
          } else {
            console.error("Invalid API response structure:", response);
            setTickets([]);
          }
        } catch (error) {
          console.error("Error fetching tickets:", error);
          setTickets([]);
        }
      };
      fetchData();
    }, []);
  
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleOutsideClick);
  
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);
  
    return (
      <div className={styles.kanbanPage}>
        <header className={styles.kanbanHeader}>
          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
              className={styles.dropdownToggle}
              onClick={() => setIsOpen(!isOpen)}
            >
              <img className={styles.displayImg} src="/assets/Display.svg" alt="display" />
              <div className={styles.displayText}>Display</div>
              <img className={styles.downImg} src="/assets/down.svg" alt="display" />
            </button>
            {isOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownItem}>
                  <div className={styles.dropdownText}>Grouping</div>
                  <div className={styles.dropDownOption}>
                    <select
                      value={groupBy}
                      onChange={(e) => {
                        setGroupBy(e.target.value);
                        setIsOpen(false);
                      }}
                    >
                      <option value="status">Status</option>
                      <option value="assigned_user">User</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>
                </div>
                <div className={styles.dropdownItem}>
                  <div className={styles.dropdownText}>Ordering</div>
                  <div className={styles.dropDownOption}>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setIsOpen(false);
                      }}
                    >
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        <KanbanBoard tickets={tickets} groupBy={groupBy} sortBy={sortBy} users={users} />
      </div>
    );
  };
  
  export default KanbanPage;
  
  // TicketDetailPage.js
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
          <strong>Priority:</strong> {['No Priority', 'Low', 'Medium', 'High', 'Urgent'][priority]}
        </p>
        <p>
          <strong>Assigned To:</strong> {assigned_user || "Unassigned"}
        </p>
      </div>
    );
  };
  
  export default TicketDetailPage;
  
  // api.js
  export const fetchTickets = async () => {
    try {
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const data = await response.json();
      console.log("Fetched API Data:", data); // Log the raw API response
      return data;
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      throw error;
    }
  };
  