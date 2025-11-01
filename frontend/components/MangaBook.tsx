"use client";

import { useState } from "react";
import "./MangaBook.css";

interface MangaBookProps {
  coverImage?: string;
  title?: string;
  description?: string;
  leftPageImage?: string;
  rightPageText?: string;
}

export default function MangaBook({
  coverImage,
  title = "My Manga Journal",
  description = "2025 Edition",
  leftPageImage,
  rightPageText,
}: MangaBookProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBookClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="manga-book-container">
      <div
        className={`manga-book ${isOpen ? "open" : ""}`}
        onClick={handleBookClick}
      >
        <div className="book-cover">
          <div className="book-spine"></div>
          <div className={`cover-front ${coverImage ? "has-image" : ""}`}>
            {coverImage ? (
              <img src={coverImage} alt={title} className="cover-image" />
            ) : (
              <div className="default-cover">
                <div className="cover-title">{title}</div>
                <div className="cover-description">{description}</div>
                <div className="cover-ornament">✦</div>
              </div>
            )}
          </div>
        </div>

        <div className="book-pages">
          <div className="page page-left">
            <div className="page-content">
              <div className="page-inner-border">
                {leftPageImage ? (
                  <img
                    src={leftPageImage}
                    alt="Left page"
                    className="page-manga-image"
                  />
                ) : (
                  <div className="manga-placeholder">
                    <div className="manga-panel">
                      <div className="speech-bubble">
                        Welcome to your manga journal!
                      </div>
                      <div className="character-placeholder">🎭</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="page page-right">
            <div className="page-content">
              <div className="page-inner-border">
                {rightPageText ? (
                  <div className="journal-text-content">
                    <div className="journal-text-title">AI Summary</div>
                    <div className="journal-text-body">{rightPageText}</div>
                  </div>
                ) : (
                  <div className="journal-text-content">
                    <div className="journal-text-title">AI Summary</div>
                    <div className="journal-text-body">
                      Your AI-generated journal summary will appear here...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
