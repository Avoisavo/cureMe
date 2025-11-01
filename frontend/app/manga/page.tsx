'use client';

import MangaBook from "@/components/MangaBook";

export default function MangaPage() {
  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <MangaBook
        coverImage="/cover.png"
        title="My Daily Manga Journal"
        description="2025 Edition"
        leftPageImage="/manga-left.png"
        rightPageImage="/manga-right.png"
      />
    </main>
  );
}

