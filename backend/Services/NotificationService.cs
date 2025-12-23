using backend.AppDbContext;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class NotificationService
    {
        private readonly ApplicationDbContext context;

        public NotificationService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task NotifyAsync(int userId, string content)
        {
            var notification = new Notification
            {
                UserId = userId,
                Content = content,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            context.Notifications.Add(notification);
            await context.SaveChangesAsync();
        }

        // Получить уведомления пользователя
        public async Task<List<NotificationDto>> GetUserNotificationsAsync(int userId)
        {
            var notifications = await context.Notifications
                .Where(n => n.UserId == userId && n.IsDelete != true)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Content = n.Content,
                    IsRead = n.IsRead ?? false,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();

            return notifications;
        }

        // Пометить уведомление как прочитанное
        public async Task MarkAsReadNotificationAsync(int userId, int notificationId)
        {
            var notification = await context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId);

            if (notification == null)
                throw new Exception("Not found notification");

            if (notification.UserId != userId) throw new Exception("Wrong user");

            if (notification.IsRead == true)
                return;   
            
            notification.IsRead = true;
            notification.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();
        } 
        
        // Удалить уведомление пользователя
        public async Task DeleteNotificationAsync(int userId, int notificationId)
        {
            var notification = await context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId);

            if (notification == null) throw new Exception("Not found notification");

            if (notification.UserId != userId) throw new Exception("Wrong user");

            if (notification.IsDelete == true) return;

            notification.IsDelete = true;
            notification.DeletedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();
        }
    }
}
