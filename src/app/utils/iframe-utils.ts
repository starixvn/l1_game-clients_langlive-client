export const sendMessageToIframe = (action: string): boolean => {
    const iframe = document.querySelector('iframe');
    if (!iframe) {
        console.log('No iframe found');
        return false;
    }

    try {
        iframe.contentWindow?.postMessage({ action }, '*');
        return true;
    } catch (error) {
        console.error('Error sending message to iframe:', error);
        return false;
    }
};

export const listenMessageFromIframe = (callback: (action: string, payload: Record<string, unknown>) => void): (() => void) => {
    const handleMessage = (event: MessageEvent) => {
        const { action, ...payload } = event.data;
        
        if (action) {
            callback(action, payload);
        }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
        window.removeEventListener('message', handleMessage);
    };
}; 