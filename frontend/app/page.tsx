import MangaBook from "@/components/MangaBook";

export default function Home() {
  return (
    <MangaBook
      coverImage="/cover.png"
      title="My Daily Manga Journal"
      description="2025 Edition"
      leftPageImage="/manga-left.png"
      rightPageImage="/manga-right.png"
    />
  );
}
