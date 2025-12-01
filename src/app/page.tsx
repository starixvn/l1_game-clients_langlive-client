"use client";
import { useState, useEffect, useRef } from "react";
import configs from "../../configs";
import { generateGameUrl } from "./url-utils";
import {
  sendMessageToIframe,
  listenMessageFromIframe,
} from "./utils/iframe-utils";
import { WEBVIEW_ACTION } from "./constants/constants";
import "./global-function";
import BridgeCommunicatorManager from "./utils/bridge-communicator-manager";
import { ExitPopup } from "./components/exit-popup";

const resolution = {
  width: 786,
  height: 1038,
};

export default function Page() {
  const [url, setUrl] = useState("");
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [language, setLanguage] = useState("zh-TW");
  // Track a pending close fallback timer id
  const closeFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  // Track if close dialog is already shown in game (to prevent multiple close attempts)
  const isCloseDialogShownRef = useRef<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    const gameIdFromQuery =
      params.get("gameId") || globalThis.localStorage.getItem("llGameId") || "";

    // Extract language information from URL parameters
    const extractedLanguage =
      params.get("lang") ||
      params.get("language") ||
      globalThis.localStorage.getItem("llLanguage") ||
      "zh-TW";
    const locale = params.get("locale") || extractedLanguage;

    console.log("Language extracted:", { language: extractedLanguage, locale });

    // Store language in localStorage for persistence across reloads
    globalThis.localStorage.setItem("llLanguage", extractedLanguage);

    // Set language state
    setLanguage(extractedLanguage);

    if (gameIdFromQuery) {
      globalThis.localStorage.setItem("llGameId", gameIdFromQuery);
      params.append("lurl", globalThis.location.origin);
      const id = +gameIdFromQuery;
      const newUrl = generateGameUrl(
        configs.subDomain,
        configs.subPath,
        id,
        params
      );
      setUrl(newUrl);
      globalThis.history.replaceState({}, "", globalThis.location.pathname);
    }
  }, []);

  // Handle click outside iframe
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const iframe = document.querySelector("iframe");
      const target = event.target as Node;

      // Don't show popup if it's already open
      if (showExitPopup) {
        return;
      }

      if (iframe && target && !iframe.contains(target)) {
        const isClickOnIframe = iframe === target || iframe.contains(target);
        if (!isClickOnIframe) {
          // Show exit popup instead of directly closing
          handleShowExitPopup();
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showExitPopup]);

  const handleShowExitPopup = () => {
    // Send CLOSE to iframe
    sendMessageToIframe(WEBVIEW_ACTION.CLOSE);
    if (closeFallbackTimerRef.current !== null) {
      globalThis.clearTimeout(closeFallbackTimerRef.current);
    }
    if (!isCloseDialogShownRef.current) {
      // Set a 500ms fallback: if RECEIVED_CLOSE_EVENT isn't received, notify native CLOSE
      closeFallbackTimerRef.current = globalThis.setTimeout(() => {
        setShowExitPopup(true);
      }, 500);
    }
  };

  // Handle exit popup actions
  const handleExitConfirm = () => {
    BridgeCommunicatorManager.notifyNativeApp(WEBVIEW_ACTION.CLOSE);
    closeFallbackTimerRef.current = null;
    console.log("Send close to native app");
  };

  const handleExitCancel = () => {
    // User cancelled, do nothing
  };

  const handleExitClose = () => {
    setShowExitPopup(false);
  };

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
          // Reset close dialog flag when game actually closes
          isCloseDialogShownRef.current = false;
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
        case WEBVIEW_ACTION.RECEIVED_CLOSE_EVENT:
          // Parent acknowledged CLOSE; cancel fallback and mark dialog as shown
          if (closeFallbackTimerRef.current !== null) {
            globalThis.clearTimeout(closeFallbackTimerRef.current);
            closeFallbackTimerRef.current = null;
          }
          isCloseDialogShownRef.current = true;
          break;
        default:
          break;
      }
    });

    return () => {
      if (closeFallbackTimerRef.current !== null) {
        globalThis.clearTimeout(closeFallbackTimerRef.current);
        closeFallbackTimerRef.current = null;
      }
      cleanup();
    };
  }, []);

  return (
    <main className="relative w-full h-dvh max-w-3xl mx-auto">
      <div className="absolute left-0 right-0 bottom-0">
        {url && (
          <iframe
            src={url}
            title="Game Demo"
            className="w-full h-full lg:w-auto lg:h-screen lg:mx-auto"
            style={{
              background: "transparent",
              backdropFilter: "none",
              overflow: "hidden",
              aspectRatio: `${resolution.width} / ${resolution.height}`,
            }}
            allow="*"
            allowFullScreen
          />
        )}

        <ExitPopup
          isOpen={showExitPopup}
          onClose={handleExitClose}
          onConfirm={handleExitConfirm}
          onCancel={handleExitCancel}
          language={language}
        />
      </div>
    </main>
  );
}
