class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.websocket = null;
    this.subscribers = new Set();
    this.messageQueue = [];
    this.connect();
  }

  connect() {
    this.websocket = new WebSocket(this.url);
    this.websocket.onopen = () => {

      this.messageQueue.forEach(message => this._sendMessageInternal(message));
      this.messageQueue = [];
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {

        } else {
          this.notifySubscribers(data);
        }
      } catch (error) {

      }
    };

    this.websocket.onclose = () => {
      // console.log("Disconnected from WebSocket, reconnecting...");
      setTimeout(() => this.connect(), 1000);
    };

    this.websocket.onerror = (error) => {
      // console.error("WebSocket error:", error);
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  notifySubscribers(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  sendMessage(message) {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this._sendMessageInternal(message);
    } else {
      this.messageQueue.push(message); // Add raw message object to queue
    }
  }

  _sendMessageInternal(message) {
    const formattedMessage = JSON.stringify(message);

    this.websocket.send(formattedMessage);
  }
}

export default new WebSocketManager('wss://websocket.doingerp.com');
