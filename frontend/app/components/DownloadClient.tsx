"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react"; // For loading spinner

export default function DownloadClient() {
  const [url, setUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState<{
    title: string;
    formats: {
      format: string;
      url: string;
      filesize: number;
      acodec: string;
      vcodec: string;
    }[];
  } | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "video" | "audio" | "video_with_audio"
  >("video_with_audio");

  const handleDownload = async () => {
    if (!url) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/download", {
        url,
      });
      setVideoDetails(response.data);
    } catch (err) {
      setError(
        "Failed to fetch video details. Please check the URL and try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFormats = videoDetails?.formats.filter((format) => {
    if (activeTab === "video_with_audio") {
      return (
        format.acodec !== "none" && format.vcodec !== "none" && format.filesize
      );
    } else if (activeTab === "video") {
      return (
        format.vcodec !== "none" &&
        format.acodec === "none" &&
        format.format.includes("p") &&
        format.filesize
      );
    } else if (activeTab === "audio") {
      return (
        format.acodec !== "none" && format.vcodec === "none" && format.filesize
      );
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Enter YouTube URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center w-full md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : null}
              {isLoading ? "Fetching..." : "Fetch Video"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
          )}
        </div>

        {/* Video Details Section */}
        {videoDetails && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {videoDetails.title}
            </h2>

            {/* Tabs */}
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 mb-6">
              {["video_with_audio", "video", "audio"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab as "video_with_audio" | "video" | "audio")
                  }
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab === "video_with_audio"
                    ? "Video with Audio"
                    : tab === "video"
                    ? "Video Only"
                    : "Audio Only"}
                </button>
              ))}
            </div>

            {/* Formats List */}
            <ul className="space-y-4">
              {filteredFormats?.map((format, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-300 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{format.format}</p>
                    <p className="text-gray-500 text-sm">
                      {`${(format.filesize / 1024 / 1024).toFixed(2)} MB`}
                    </p>
                  </div>
                  <a
                    href={format.url}
                    download={`${videoDetails.title}_${format.format}.${
                      activeTab === "audio" ? "mp3" : "mp4"
                    }`}
                    target="_blank"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
