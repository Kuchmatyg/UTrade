using backend.DTO;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdvertisementController : ControllerBase
    {
        private readonly AdvertisementService service;

        public AdvertisementController(AdvertisementService service)
        {
            this.service = service;
        }

        // -------------------- User Endpoints --------------------

        // Создание нового объявления
        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> CreateAdvertisement([FromBody] CreateAdvertisementDto dto)
        {
            int currentUserId = int.Parse(User.FindFirst("id")!.Value);
            var advertisement = await service.CreateAdvertisementAsync(dto, currentUserId);
            return Ok(advertisement);
        }

        // Получение объявлений для обычного пользователя (только Approved)
        [HttpGet]
        public async Task<IActionResult> GetApprovedAdvertisements()
        {
            var advertisements = await service.GetApprovedAdvertisementsAsync();
            return Ok(advertisements);
        }

        // Загрузка изображения для объявления
        [HttpPost("{adId}/images")]
        [Authorize]
        public async Task<IActionResult> UploadImage(int adId, IFormFile file)
        {
            var image = await service.UploadImageAsync(adId, file);
            return Ok(new { image.Id, image.Url });
        }

        // Удаление объявления (Soft delete)
        [HttpDelete("{adId}")]
        [Authorize]
        public async Task<IActionResult> DeleteAdvertisement(int adId)
        {
            // Временно — заглушка
            // позже заменим на получение из JWT
            int currentUserId = int.Parse(User.FindFirst("id")!.Value);

            bool isModerator = User.IsInRole("Moderator");

            await service.DeleteAdvertisementAsync(adId, currentUserId, isModerator);
            return NoContent();
        }

        // -------------------- Moderator Endpoints --------------------

        // Получение всех Pending объявлений для модератора
        [HttpGet("pending")]
        [Authorize(Roles = "Moderator")]
        public async Task<IActionResult> GetPendingAdvertisements()
        {
            var advertisements = await service.GetPendingAdvertisementsAsync();
            return Ok(advertisements);
        }

        // Одобрение объявления Модератором
        [HttpPost("{adId}/approve")]
        [Authorize(Roles = "Moderator")]
        public async Task<IActionResult> ApproveAdvertisement(int adId)
        {
            await service.ApproveAdvertisementAsync(adId);
            return Ok();
        }

        // Отклонение объявления Модератором
        [HttpPost("{adId}/reject")]
        [Authorize(Roles = "Moderator")]
        public async Task<IActionResult> RejectAdvertisement(int adId)
        {
            await service.RejectAdvertisementAsync(adId);
            return Ok();
        }
    }
}
