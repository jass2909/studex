module.exports = {
    devServer: {
      host: '0.0.0.0', // Allow external access
      port: 8080, // Your local development port
      allowedHosts: "all", // Allow all hosts, including Ngrok
      client: {
        webSocketURL: {
          protocol: 'wss', // Use secure WebSocket
          hostname: 'fae2-41-66-123-87.ngrok-free.app', // Your Ngrok hostname
          port: 443, // Default HTTPS port
        },
      },
    },
  };