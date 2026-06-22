"use client";

import { useState } from "react";
import styles from "./PasswordField.module.css";

export default function PasswordField() {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrap}>
      <input
        type={visible ? "text" : "password"}
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className={styles.input}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className={styles.toggle}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
            <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}
      </button>
    </div>
  );
}
