"use client";

import { useState } from "react";
import styles from "./MangaBook.module.css";

interface MangaBookProps {
  coverImage?: string;
  title?: string;
  description?: string;
  firstPageContent?: string;
  firstPageImage?: string;
}

export default function MangaBook({
  coverImage,
  title = "My Manga Journal",
  description = "Click to open",
  firstPageContent = "This is your first page of manga!",
  firstPageImage,
}: MangaBookProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBookClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={styles["manga-book-container"]}>
      <div
        className={`${styles["manga-book"]} ${isOpen ? styles.open : ""}`}
        onClick={handleBookClick}
      >
        {/* Book Cover */}
        <div className={styles["book-cover"]}>
          <div className={styles["book-spine"]}></div>
          <div
            className={`${styles["cover-front"]} ${
              coverImage ? styles["has-image"] : ""
            }`}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className={styles["cover-image"]}
              />
            ) : (
              <div className={styles["default-cover"]}>
                <div className={styles["cover-title"]}>{title}</div>
                <div className={styles["cover-description"]}>{description}</div>
                <div className={styles["cover-ornament"]}>✦</div>
              </div>
            )}
          </div>
        </div>

        {/* First Page (revealed when opened) */}
        <div className={styles["book-pages"]}>
          <div className={`${styles.page} ${styles["page-left"]}`}>
            <div className={styles["page-content"]}>
              <div className={styles["page-inner-border"]}>
                <h2 className={styles["page-title"]}>Chapter 1</h2>
                <div className={styles["page-text"]}>{firstPageContent}</div>
              </div>
            </div>
          </div>
          <div className={`${styles.page} ${styles["page-right"]}`}>
            <div className={styles["page-content"]}>
              <div className={styles["page-inner-border"]}>
                {firstPageImage ? (
                  <img
                    src={firstPageImage}
                    alt="First page"
                    className={styles["page-manga-image"]}
                  />
                ) : (
                  <div className={styles["manga-placeholder"]}>
                    <div className={styles["manga-panel"]}>
                      <div className={styles["speech-bubble"]}>
                        Welcome to your manga journal!
                      </div>
                      <div className={styles["character-placeholder"]}>🎭</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={styles["navigation-controls"]}>
          <button
            className={styles["close-book-btn"]}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            Close Book
          </button>
          <div className={styles["page-controls"]}>
            <button className={styles["prev-page-btn"]} disabled>
              ← Previous
            </button>
            <span className={styles["page-number"]}>Page 1</span>
            <button className={styles["next-page-btn"]}>Next →</button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className={styles["instruction-text"]}>Click the book to open</div>
      )}
    </div>
  );
}
