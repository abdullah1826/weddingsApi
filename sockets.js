let io;

const setupSocket = (serverIo) => {
  io = serverIo;
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Join a room based on a unique identifier like card ID or user ID
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    // Listen for updates specific to a room
    socket.on("updateWeddingCard", (data) => {
      const roomId = data.cardId; // Assuming data includes the cardId or similar unique ID
      io.to(roomId).emit("weddingCardUpdated", data); // Emit only to clients in that room
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

// const emitEvent = (event, data) => {
//   io.emit(event, data);
// };

export { setupSocket };
