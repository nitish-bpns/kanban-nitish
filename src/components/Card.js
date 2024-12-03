import React from "react";
import styles from "../styles/Card.module.css";

const Card = ({ ticket }) => {
  const { id, title, priority, tag, assigned_user, user_avatar } = ticket;

  const priorityMap = ["No Priority", "Low", "Medium", "High", "Urgent"];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardId}>{id}</span>
        {user_avatar ? (
          <img
            src={user_avatar}
            alt="User avatar"
            className={styles.userAvatar}
          />
        ) : (
          <div className={styles.userInitial}>{assigned_user.charAt(0)}</div>
        )}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardTags}>
        {tag.map((t, index) => (
          <span key={index} className={styles.tagPill}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;
