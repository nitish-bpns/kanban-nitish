import React, { useState, useEffect, useRef } from "react";
import KanbanBoard from "../components/KanbanBoard";
import { fetchTickets } from "../services/api";
import styles from "../styles/Kanban.module.css";

const KanbanPage = () => {
  const [tickets, setTickets] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown container

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTickets();
        if (response && Array.isArray(response.tickets)) {
          const usersMap = response.users.reduce((map, user) => {
            map[user.id] = user.name;
            return map;
          }, {});
          setUsersMap(usersMap);

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

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup event listener on unmount
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
            <img
              className={styles.displayImg}
              src="/assets/Display.svg"
              alt="display"
            />
            <div className={styles.displayText}>Display</div>

            <img
              className={styles.downImg}
              src="/assets/down.svg"
              alt="display"
            />
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
                      setIsOpen(false); // Close dropdown on selection
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
                      setIsOpen(false); // Close dropdown on selection
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
      <KanbanBoard tickets={tickets} groupBy={groupBy} sortBy={sortBy} />
    </div>
  );
};

export default KanbanPage;
