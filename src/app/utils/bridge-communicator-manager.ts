/* eslint-disable @typescript-eslint/no-explicit-any */

import { WEBVIEW_ACTION } from "../constants/constants";

class BridgeCommunicatorManager {
  private static callGlobalFunction(method: string): boolean {
    const globalFunctions: Record<string, string> = {
      [WEBVIEW_ACTION.OPEN_RECHARGE_PANEL]: "openRechargePanel",
      [WEBVIEW_ACTION.ON_GAME_LOADED]: "onGameLoaded",
      [WEBVIEW_ACTION.CLOSE]: "close",
    };

    const functionName = globalFunctions[method];
    if (functionName && typeof (window as any)[functionName] === "function") {
      (window as any)[functionName]();
      return true;
    }
    return false;
  }

  private static logError(message: string, error?: any): void {
    const errorMessage = error ? `${message} ${error}` : message;

    console.log(errorMessage);
  }

  private static tryReactNativeWebView(method: string, payload: any): boolean {
    try {
      if ((window as any).ReactNativeWebView?.postMessage) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({ type: method, ...payload })
        );
        return true;
      }
    } catch (e) {
      this.logError(`Error ReactNativeWebView (${method}):`, e);
    }
    return false;
  }

  private static tryAndroidNative(method: string): boolean {
    try {
      const android = (window as any).Android;
      if (android && typeof android[method] === "function") {
        android[method]();
        return true;
      }
    } catch (e) {
      this.logError(`Error Android.${method}:`, e);
    }
    return false;
  }

  private static tryJSBridge(method: string): boolean {
    try {
      const jsbridge = (window as any).JSBridge;
      if (jsbridge && typeof jsbridge[method] === "function") {
        jsbridge[method]();
        return true;
      }
    } catch (e) {
      this.logError(`Error JSBridge.${method}:`, e);
    }
    return false;
  }

  private static tryIOSWebKit(method: string, payload: any): boolean {
    try {
      const webkitHandler = (window as any).webkit?.messageHandlers?.[method];
      if (webkitHandler?.postMessage) {
        webkitHandler.postMessage(payload);
        return true;
      }
    } catch (e) {
      this.logError(`Error webkit.messageHandlers.${method}:`, e);
    }
    return false;
  }

  private static tryIframeParent(method: string, payload: any): boolean {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: method, ...payload }, "*");
        return true;
      }
    } catch (e) {
      this.logError(`Error window.parent.postMessage (${method}):`, e);
    }
    return false;
  }

  public static notifyNativeApp(method: string, payload: any = {}): void {
    const bridgeMethods = [
      () => this.tryReactNativeWebView(method, payload),
      () => this.tryAndroidNative(method),
      () => this.tryJSBridge(method),
      () => this.tryIOSWebKit(method, payload),
      () => this.tryIframeParent(method, payload),
    ];

    for (const bridgeMethod of bridgeMethods) {
      if (bridgeMethod()) {
        this.callGlobalFunction(method);
        return;
      }
    }

    const globalFunctionCalled = this.callGlobalFunction(method);
    if (!globalFunctionCalled) {
      console.log(`notifyNativeApp: no valid bridge found for "${method}"`);
    }
  }
}

export default BridgeCommunicatorManager;
