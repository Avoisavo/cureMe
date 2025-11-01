import MangaBook from "@/components/MangaBook";

export default function Home() {
  return (
    <MangaBook
      coverImage="/cover.png"
      title="My Daily Manga Journal"
      description="2025 Edition"
      firstPageContent="Today's adventure begins here! This is where your daily stories come to life in manga form. Each page captures a moment, a feeling, a memory..."
    />
  );
}
