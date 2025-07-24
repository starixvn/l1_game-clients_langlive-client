"use client";
import { useState, useEffect } from "react";
import configs from "../../configs";
import { generateGameUrl } from "./url-utils";
import {
  sendMessageToIframe,
  listenMessageFromIframe,
} from "./utils/iframe-utils";
import { WEBVIEW_ACTION } from "./constants/constants";
import "./global-function";
import BridgeCommunicatorManager from "./utils/bridge-communicator-manager";

const resolution = {
  width: 786,
  height: 772,
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS device
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = Boolean(
      /iphone|ipad|ipod/.test(userAgent) ||
        /iPad|iPhone|iPod/.test(navigator.userAgent)
    );
    setIsIOS(isIOSDevice);

    const params = new URLSearchParams(window.location.search);
    const gameIdFromQuery =
      params.get("gameId") || localStorage.getItem("llGameId") || "";
    if (gameIdFromQuery) {
      localStorage.setItem("llGameId", gameIdFromQuery);
      params.append("lurl", window.location.origin);
      const id = +gameIdFromQuery;
      const newUrl = generateGameUrl(
        configs.subDomain,
        configs.subPath,
        id,
        params
      );
      setUrl(newUrl);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Handle click outside iframe
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const iframe = document.querySelector("iframe");
      const target = event.target as Node;

      if (iframe && target && !iframe.contains(target)) {
        const isClickOnIframe = iframe === target || iframe.contains(target);
        if (!isClickOnIframe) {
          sendMessageToIframe(WEBVIEW_ACTION.CLOSE);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Listen for messages from iframe
  useEffect(() => {
    const cleanup = listenMessageFromIframe((action) => {
      switch (action) {
        case WEBVIEW_ACTION.ON_GAME_LOADED:
          BridgeCommunicatorManager.notifyNativeApp(
            WEBVIEW_ACTION.ON_GAME_LOADED
          );
          break;
        case WEBVIEW_ACTION.CLOSE:
          BridgeCommunicatorManager.notifyNativeApp(WEBVIEW_ACTION.CLOSE);
          break;
        case WEBVIEW_ACTION.OPEN_RECHARGE_PANEL:
          BridgeCommunicatorManager.notifyNativeApp(
            WEBVIEW_ACTION.OPEN_RECHARGE_PANEL
          );
          break;
        case WEBVIEW_ACTION.ON_RECHARGE_SUCCESS:
          BridgeCommunicatorManager.notifyNativeApp(
            WEBVIEW_ACTION.ON_RECHARGE_SUCCESS
          );
          break;
        default:
          break;
      }
    });

    return cleanup;
  }, []);

  return (
    <main
      className={`relative w-full h-dvh max-w-3xl mx-auto gradient-background`}
    >
      <div
        className={`absolute left-0 right-0  ${
          isIOS ? "bottom-[34px]" : "bottom-0"
        }`}
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
              width: `100%`,
              height: "auto",
              aspectRatio: `${resolution.width} / ${resolution.height}`,
            }}
            allow="*"
            allowFullScreen
          />
        )}
      </div>
    </main>
  );
}
