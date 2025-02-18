import DownloadClient from "./components/DownloadClient";

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
