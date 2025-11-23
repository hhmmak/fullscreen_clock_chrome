// Track interval ID of the clock
let clockInterval = null;
// Track whether seconds should be shown
let includeSeconds = true;

// Helper to build date options based on `includeSeconds`
const getDateOptions = () => {
  const opts = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };
  if (includeSeconds) opts.second = "2-digit";
  return opts;
};

// Click handler for the fullscreen clock element
const handleClockClick = () => {
  const clock = document.getElementById("fullscreen-clock");
  if (!clock) return;

  // Stop existing interval
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }

  // Toggle seconds display
  includeSeconds = !includeSeconds;

  // Immediately update displayed time with new options
  const now = new Date();
  clock.textContent = now.toLocaleString("en-US", getDateOptions());

  // Restart interval. Use 1s updates when seconds are shown, 5s otherwise (preserve previous behavior)
  const intervalMs = includeSeconds ? 1000 : 5000;
  clockInterval = setInterval(() => {
    const now = new Date();
    clock.textContent = now.toLocaleString("en-US", getDateOptions());
  }, intervalMs);
};

// Handle fullscreen changes
const handleFullscreenChange = () => {
  let clock = document.getElementById("fullscreen-clock");
  if (document.fullscreenElement) {
    // Set up clock element if it doesn't exist
    if (!clock) {
      clock = document.createElement("div");
      clock.id = "fullscreen-clock";
      clock.style.display = "none";
      document.fullscreenElement.appendChild(clock);
      // Add click listener to toggle seconds and restart the interval
      clock.addEventListener("click", handleClockClick);
    }

    // Initial update
    const now = new Date();
    clock.textContent = now.toLocaleString("en-US", getDateOptions());

    // Start interval updates
    if (!clockInterval) {
      const intervalMs = includeSeconds ? 1000 : 5000;
      clockInterval = setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleString("en-US", getDateOptions());
      }, intervalMs);
    }

    // Show clock
    clock.style.display = "block";
  } else {
    // Hide clock and stop updates
    clock.style.display = "none";
    clearInterval(clockInterval);
    clockInterval = null;
  }
};

// Listen for disable message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "disable") {
    if (clockInterval){
      clearInterval(clockInterval);
    }
    document.removeEventListener("fullscreenchange", () => {});
  } else {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
  }
});
