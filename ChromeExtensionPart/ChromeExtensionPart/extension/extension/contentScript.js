document.addEventListener("click", function(event) {
  let target = event.target.closest("a");
  if (target && target.href) {
      event.preventDefault();
      const url = target.href;
      chrome.runtime.sendMessage({ action: "checkUrl", url }, (response) => {
          if (response && response.malicious) {
              showPopup(url);
          } else if (response) {
              window.location.href = url;
          }
      });
  }
});

window.addEventListener('load', function() {
  const currentUrl = window.location.href;
  chrome.runtime.sendMessage({ action: "checkUrl", url: currentUrl }, (response) => {
    if (response && response.malicious) {
      alert('Warning: This URL has been identified as potentially malicious!\n\n' +
            'URL: ' + currentUrl + '\n\n' +
            'We recommend not proceeding further.');
    }
  });
});

function showPopup(url) {
  const style = document.createElement('style');
  style.textContent = `
      .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999999;
      }
      .popup {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          text-align: center;
          min-width: 300px;
      }
      .popup p {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #333;
      }
      .popup button {
          padding: 8px 20px;
          margin: 0 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
      }
      .popup button.yes {
          background: #dc3545;
          color: white;
      }
      .popup button.no {
          background: #28a745;
          color: white;
      }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
      <p>⚠️ Malicious URL detected! Proceed anyway?</p>
      <button class="yes">Proceed</button>
      <button class="no">Cancel</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  popup.querySelector(".yes").addEventListener("click", () => {
      document.head.removeChild(style);
      document.body.removeChild(overlay);
      window.location.href = url;
  });

  popup.querySelector(".no").addEventListener("click", () => {
      document.head.removeChild(style);
      document.body.removeChild(overlay);
  });

  overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
          document.head.removeChild(style);
          document.body.removeChild(overlay);
      }
  });
}