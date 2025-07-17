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