import React from "react";
import styles from "../styles/Card.module.css";

const Card = ({ ticket, users }) => {
  const { id, title, priority, tag, assigned_user, status } = ticket;

  const user = users.find((us) => us.name === assigned_user);
  const available = user.available;

  const getColorFromInitials = (name) => {
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

  const initials = assigned_user
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

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
        {status === "In progress" && (
          <img
            className={styles.taskStatus}
            src="/assets/in-progress.svg"
            alt="in-progress"
          />
        )}
        {status === "Todo" && (
          <img
            className={styles.taskStatus}
            src="/assets/To-do.svg"
            alt="To-do"
          />
        )}
        {status === "Backlog" && (
          <img
            className={styles.taskStatus}
            src="/assets/Backlog.svg"
            alt="backlog"
          />
        )}
        {status === "Done" && (
          <img
            className={styles.taskStatus}
            src="/assets/done.svg"
            alt="done"
          />
        )}
        {title}
      </h3>
      <div className={styles.statusFeature}>
        <div className={styles.taskPriority}>
          {priority === 0 && (
            <img
              className={styles.priorityImg}
              src="/assets/no.svg"
              alt="priority"
            />
          )}
          {priority === 1 && (
            <img
              className={styles.priorityImg}
              src="/assets/low.svg"
              alt="priority"
            />
          )}
          {priority === 2 && (
            <img
              className={styles.priorityImg}
              src="/assets/mid.svg"
              alt="priority"
            />
          )}
          {priority === 3 && (
            <img
              className={styles.priorityImg}
              src="/assets/high.svg"
              alt="priority"
            />
          )}
          {priority === 4 && (
            <img
              className={styles.priorityImg}
              src="/assets/urgent.svg"
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
