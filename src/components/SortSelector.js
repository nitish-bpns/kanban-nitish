import React from "react";
import styles from "../styles/Selector.module.css";

const SortSelector = ({ sortBy, setSortBy }) => {
  return (
    <div className={styles.selector}>
      {/* <label>Sort By:</label> */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
};

export default SortSelector;
