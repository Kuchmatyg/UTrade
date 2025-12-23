using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService notificationService;

        public NotificationController(NotificationService notificationService)
        {
            this.notificationService = notificationService;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue("id")!);
        }

        // GET /api/notifications
        [HttpGet]
        public async Task<IActionResult> GetUserNotifications()
        {
            var userId = GetCurrentUserId();
            var notifications = await notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        // POST /api/notifications/{id}/read
        [HttpPost("{ntId}/read")]
        public async Task<IActionResult> MarkAsReadNotification(int ntId)
        {
            var userId = GetCurrentUserId();
            await notificationService.MarkAsReadNotificationAsync(userId, ntId);
            return NoContent();
        }

        // DELETE /api/notifications/{id}/delete
        [HttpDelete("{ntId}/delete")]
        public async Task<IActionResult> DeleteNotification(int ntId)
        {
            var userId = GetCurrentUserId();
            await notificationService.DeleteNotificationAsync(userId, ntId);
            return NoContent();

        }
    }
}
