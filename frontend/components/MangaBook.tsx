"use client";

import { useState } from "react";
import styles from "./MangaBook.module.css";

interface MangaBookProps {
  coverImage?: string;
  title?: string;
  description?: string;
  leftPageImage?: string;
  rightPageImage?: string;
}

export default function MangaBook({
  coverImage,
  title = "My Manga Journal",
  description = "Click to open",
  leftPageImage,
  rightPageImage,
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

        <div className={styles["book-pages"]}>
          <div className={`${styles.page} ${styles["page-left"]}`}>
            <div className={styles["page-content"]}>
              <div className={styles["page-inner-border"]}>
                {leftPageImage ? (
                  <img
                    src={leftPageImage}
                    alt="Left page"
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
          <div className={`${styles.page} ${styles["page-right"]}`}>
            <div className={styles["page-content"]}>
              <div className={styles["page-inner-border"]}>
                {rightPageImage ? (
                  <img
                    src={rightPageImage}
                    alt="Right page"
                    className={styles["page-manga-image"]}
                  />
                ) : (
                  <div className={styles["manga-placeholder"]}>
                    <div className={styles["manga-panel"]}>
                      <div className={styles["speech-bubble"]}>
                        Your daily story begins here!
                      </div>
                      <div className={styles["character-placeholder"]}>📖</div>
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
