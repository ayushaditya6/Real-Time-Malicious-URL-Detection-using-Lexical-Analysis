chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "checkUrl") {
        fetch(`http://127.0.0.1:5000/api?url=${encodeURIComponent(request.url)}`)
            .then(response => response.json())
            .then(data => {
                sendResponse({ 
                    malicious: data.status === "malicious" 
                });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ malicious: false });
            });
        return true; // Keep the message channel open for async response
    }
});