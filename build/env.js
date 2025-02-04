const hostname = window.location.hostname;

// Set environment variables based on hostname
window.env = {
  AP: `https://${hostname}/api`,  // API URL
  WS: `wss://${hostname}`,       // WebSocket URL
};