window.onload = function() {
    chrome.storage.local.get(['keyurl', 'keystatus'], function(result) {
        const webname = document.querySelector(".webname");
        const webstatus = document.querySelector(".webstatus");
        
        if (result.keyurl) {
            webname.textContent = result.keyurl;
            webstatus.textContent = result.keystatus === "benign" ? "Safe" : "Malicious";
            webstatus.className = `webstatus ${result.keystatus === "benign" ? "safe" : "malicious"}`;
        }
    });
};