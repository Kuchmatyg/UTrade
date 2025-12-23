using backend.AppDbContext;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Services
{
    public class ChatService
    {
        private readonly ApplicationDbContext context;
        private readonly NotificationService notificationService;

        public ChatService(ApplicationDbContext context, NotificationService notificationService)
        {
            this.context = context;
            this.notificationService = notificationService;
        }

        // Получить список чатов пользователя
        public async Task<List<ChatDto>> GetChatsForUserAsync(int userId)
        {
            return await context.Chats
                .Include(c => c.Advertisement)
                .Include(c => c.UserFrom)
                .Include(c => c.UserTo)
                .Where(c => c.UserFromId == userId || c.UserToId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ChatDto
                {
                    Id = c.Id,
                    AdvertisementId = c.AdvertisementId,
                    AdvertisementName = c.Advertisement.Name,
                    UserFromId = c.UserFromId,
                    UserFromName = c.UserFrom.Username,
                    UserToId = c.UserToId,
                    UserToName = c.UserTo.Username,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        // Получить сообщения чата с проверкой доступа
        public async Task<List<MessageDto>> GetMessagesChatAsync(int chatId, int userId)
        {
            var hasAccess = await context.Chats
                .AnyAsync(c =>
                    c.Id == chatId &&
                    (c.UserFromId == userId || c.UserToId == userId));

            if (!hasAccess)
                throw new Exception("Access denied");

            return await context.Messages
                .Where(m => m.ChatId == chatId && m.IsDeleted != true)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    ChatId = m.ChatId,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.Username,
                    Content = m.Content,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();
        }


        // Создать чат, если его ещё нет
        public async Task<ChatDto> CreateChatIfNotExistAsync(int advertisementId, int fromUserId)
        {
            var ad = await context.Advertisements.FindAsync(advertisementId);
            if (ad == null) throw new Exception("Advertisement not found");

            var existingChat = await context.Chats.FirstOrDefaultAsync(c =>
                c.AdvertisementId == advertisementId &&
                c.UserFromId == fromUserId &&
                c.UserToId == ad.OwnerId);

            if (ad.OwnerId == fromUserId)
                throw new Exception("The listing owner cannot start a chat.");

            // Нужно вытащить определённые данные для, такие как UserFromName и UserToName,
            // всё это необходимо для проекции на UI
            var userFromInfo = await context.Users
                .Where(u => u.Id == fromUserId)
                .Select(u => new {
                    u.Username
                })
                .FirstOrDefaultAsync();

            var userToInfo = await context.Users
                .Where(u => u.Id == ad.OwnerId)
                .Select(u => new {
                    u.Username
                })
                .FirstOrDefaultAsync();

            if (userFromInfo == null)
                throw new Exception("Not found user");

            if (existingChat != null)
            {
                ChatDto oldChat = new ChatDto
                {
                    Id = existingChat.Id,
                    AdvertisementId = existingChat.AdvertisementId,
                    UserFromId = existingChat.UserFromId,
                    UserFromName = userFromInfo.Username,
                    UserToId = existingChat.UserToId,
                    UserToName = userToInfo!.Username,
                    CreatedAt = existingChat.CreatedAt
                };
                return oldChat;
            }


            var chat = new Chat
            {
                AdvertisementId = advertisementId,
                UserFromId = fromUserId,
                UserToId = ad.OwnerId,
                CreatedAt = DateTime.UtcNow
            };

            context.Chats.Add(chat);
            await context.SaveChangesAsync();

            ChatDto newChat = new ChatDto
            {
                Id = chat.Id,
                AdvertisementId = chat.AdvertisementId,
                UserFromId = chat.UserFromId,
                UserFromName = userFromInfo.Username,
                UserToId = chat.UserToId,
                UserToName = userToInfo!.Username,
                CreatedAt = chat.CreatedAt
            };

            return newChat;
        }

        // Отправить сообщение
        public async Task<MessageDto> SendMessageAsync(int chatId, int senderId, string content)
        {
            //var chat = await context.Chats.FindAsync(chatId);
            var chatInfo = await context.Chats
                .Where(c => c.Id == chatId)
                .Select(c => new
                {
                    c.UserFromId,
                    c.UserToId,
                    AdvertisementName = c.Advertisement.Name
                })
                .FirstOrDefaultAsync();

            if (chatInfo == null)
                throw new Exception("Chat not found");

            if (chatInfo.UserFromId != senderId && chatInfo.UserToId != senderId)
                throw new Exception("Access denied");

            var message = new Message
            {
                ChatId = chatId,
                SenderId = senderId,
                Content = content,
                CreatedAt = DateTime.UtcNow
            };

            context.Messages.Add(message);

            // Создаём уведомление для второго участника
            var receiverId = chatInfo.UserFromId == senderId ? chatInfo.UserToId : chatInfo.UserFromId;
            string notifyMessage = $"Новое сообщение в чате по объявлению '{chatInfo.AdvertisementName}'";
            await notificationService.NotifyAsync(receiverId, notifyMessage);
            //var notification = new Notification
            //{
            //    UserId = receiverId,
            //    Content = $"Новое сообщение в чате по объявлению '{chatInfo.AdvertisementName}'",
            //    CreatedAt = DateTime.UtcNow
            //};
            //context.Notifications.Add(notification);

            await context.SaveChangesAsync();


            // Находим имя пользователя, который отправил сообщение,
            // для того, чтобы можно было в MessageDto установить SenderName. Нужно для проекции на UI
            var senderInfo = await context.Users
                .Where(u => u.Id == senderId)
                .Select(u => u.Username)
                .FirstAsync();

            MessageDto newMessage = new MessageDto
            {
                Id = message.Id,
                ChatId = message.ChatId,
                SenderId = message.SenderId,
                SenderName = senderInfo,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
            };

            return newMessage;
        }
    }
}
