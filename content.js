let clockInterval = null;

// Handle fullscreen changes
document.addEventListener("fullscreenchange", () => {
  let clock = document.getElementById("fullscreen-clock");
  if (document.fullscreenElement) {
    // Set up clock element if it doesn't exist
    if (!clock) {
      clock = document.createElement("div");
      clock.id = "fullscreen-clock";
      clock.style.display = "none";
      document.fullscreenElement.appendChild(clock);
    }

    // Initial update
    const now = new Date();
    const dateOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }
    clock.textContent = now.toLocaleString("en-US", dateOptions);

    // Start interval updates
    if (!clockInterval) {
      clockInterval = setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleString("en-US", dateOptions);
      }, 20000);
    }

    // Show clock
    clock.style.display = "block";
  } else {
    // Hide clock and stop updates
    clock.style.display = "none";
    clearInterval(clockInterval);
    clockInterval = null;
  }
});

// Listen for disable message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "disable") {
    if (clockInterval){
      clearInterval(clockInterval);
    }
    document.removeEventListener("fullscreenchange", () => {});
  } else if (msg.action === "enable") {
    document.addEventListener("fullscreenchange", () => {});
  }
});
