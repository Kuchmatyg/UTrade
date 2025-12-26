using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinChat(int chatId)
        {
            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"chat-{chatId}"
            );
        }
    }
}

