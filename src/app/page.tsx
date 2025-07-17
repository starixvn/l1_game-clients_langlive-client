"use client";
import { useState, useEffect } from "react";
import configs from "../../configs";
import { generateGameUrl } from "./url-utils";

export default function Home() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameIdFromQuery =
      params.get("gameId") || localStorage.getItem("llGameId") || "";
    if (gameIdFromQuery) {
      params.append("lurl", window.location.origin);
      const id = +gameIdFromQuery;
      const newUrl = generateGameUrl(
        configs.subDomain,
        configs.subPath,
        id,
        params
      );
      setUrl(newUrl);
    }
  }, []);

  return (
    <main className="relative w-full h-screen">
      <div
        className="absolute left-0 right-0 bottom-0 w-full"
        style={{ height: "45.36%" }}
      >
        {url && (
          <iframe
            src={url}
            title="Game Demo"
            className="w-full h-full"
            style={{
              background: "transparent",
              backdropFilter: "none",
              overflow: "hidden",
            }}
            allow="*"
            allowFullScreen
          />
        )}
      </div>
    </main>
  );
}
