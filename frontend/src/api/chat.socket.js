import * as signalR from "@microsoft/signalr";

export const connectChat = async (chatId, onMessage) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5056/hubs/chat", {
      accessTokenFactory: () => localStorage.getItem("token"),
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", onMessage);

  await connection.start();
  await connection.invoke("JoinChat", Number(chatId));

  return connection; // 🔥 ВАЖНО
};
