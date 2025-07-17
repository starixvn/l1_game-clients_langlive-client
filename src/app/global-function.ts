/* eslint-disable @typescript-eslint/no-explicit-any */

import { WEBVIEW_ACTION } from "../../constants/constants";
import { sendMessageToIframe } from "./utils/iframe-utils";

(function() {
    if (typeof window === 'undefined') return;

    const handleRechargeSuccess = () => {
        const success = sendMessageToIframe(WEBVIEW_ACTION.ON_RECHARGE_SUCCESS);
        if (success) {
            console.log("Message sent successfully to iframe");
        } else {
            console.error("Failed to send message to iframe");
        }
    };

    // Expose function to global scope
    (window as any).onRechargeSuccess = handleRechargeSuccess;
})(); 