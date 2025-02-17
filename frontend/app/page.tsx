import DownloadClient from "./components/DownloadClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Video Downloader - Fast & Free",
  description:
    "Download YouTube videos in high quality. Free, fast, and easy-to-use YouTube downloader.",
  openGraph: {
    title: "YouTube Video Downloader",
    description: "Download YouTube videos with audio in HD quality.",
    type: "website",
    url: "https://your-site.com/download",
  },
};

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        YouTube Video Downloader
      </h1>
      <DownloadClient />
    </main>
  );
}
