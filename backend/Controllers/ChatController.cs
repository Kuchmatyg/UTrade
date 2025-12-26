using backend.DTO;
using backend.Hubs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Reflection;
using System.Security.Claims;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ChatService chatService;
        private readonly IHubContext<ChatHub> hubContext;

        public ChatController(ChatService chatService,
                              IHubContext<ChatHub> hubContext)
        {
            this.chatService = chatService;
            this.hubContext = hubContext;
        }

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue("id")!);

        // GET /api/chat
        [HttpGet]
        public async Task<IActionResult> GetChats()
        {
            var userId = GetCurrentUserId();
            var chats = await chatService.GetChatsForUserAsync(userId);
            return Ok(chats);
        }

        // GET /api/chat/{chatId}/messages
        [HttpGet("{chatId}/messages")]
        public async Task<IActionResult> GetMessagesChat(int chatId)
        {
            var userId = GetCurrentUserId();
            var messages = await chatService.GetMessagesChatAsync(chatId, userId);
            return Ok(messages);
        }

        // POST /api/chat/{advertisementId}/start
        [HttpPost("{advertisementId}/start")]
        public async Task<IActionResult> StartChat(int advertisementId)
        {
            var userId = GetCurrentUserId();
            var chat = await chatService.CreateChatIfNotExistAsync(advertisementId, userId);
            return Ok(chat);
        }

        // POST /api/chat/{chatId}/message
        // Accept MessageDto from client but ignore/overwrite server-controlled fields.
        [HttpPost("{chatId}/message")]
        public async Task<IActionResult> SendMessage(int chatId, MessageDto dto)
        {
            var userId = GetCurrentUserId();

            var message = await chatService.SendMessageAsync(
                chatId, userId, dto.Content
            );

            await hubContext.Clients
                .Group($"chat-{chatId}")
                .SendAsync("ReceiveMessage", new
                {
                    id = message.Id,
                    content = message.Content,
                    senderUsername = message.SenderName,
                    createdAt = message.CreatedAt
                });

            return Ok(message);
        }
    }
}
