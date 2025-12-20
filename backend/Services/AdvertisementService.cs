using backend.AppDbContext;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AdvertisementService
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment env;

        public AdvertisementService(ApplicationDbContext context, IWebHostEnvironment env)
        {
            this.context = context;
            this.env = env;
        }

        // Создание нового объявления
        public async Task<AdvertisementDto> CreateAdvertisementAsync(CreateAdvertisementDto dto, int ownerId)
        {

            var advertisement = new Advertisement
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Location = dto.Location,
                ContactEmail = dto.ContactEmail,
                ContactPhoneNumber = dto.ContactPhoneNumber,
                OwnerId = ownerId,
                Status = AdvertisementStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            // Связь с категориями
            if (dto.CategoryIds != null)
            {
                foreach (var categoryId in dto.CategoryIds)
                {
                    advertisement.AdvertisementCategories.Add(
                        new AdvertisementCategory()
                        {
                            Advertisement = advertisement,
                            CategoryId = categoryId,
                            CreatedAt = DateTime.UtcNow
                        });
                }

            }

            context.Advertisements.Add(advertisement);
            await context.SaveChangesAsync();

            return MapToDto(advertisement);
        }

        // Получение объявлений для обычного пользователя (только Approved)
        public async Task<List<AdvertisementDto>> GetApprovedAdvertisementsAsync()
        {
            var advertisements = await context.Advertisements
                .Include(a => a.AdvertisementImages)
                .Include(a => a.AdvertisementCategories)
                .ThenInclude(ac => ac.Category)
                .Where(a => a.Status == AdvertisementStatus.Approved && !a.IsDeleted)
                .ToListAsync();

            var advertisementsDto = advertisements.Select(MapToDto).ToList();
            return advertisementsDto;
        }

        // Получение всех Pending объявлений для модератора
        public async Task<List<AdvertisementDto>> GetPendingAdvertisementsAsync()
        {
            var advertisements = await context.Advertisements
                .Include(a => a.AdvertisementImages)
                .Include(a => a.AdvertisementCategories)
                .ThenInclude(ac => ac.Category)
                .Where(a => a.Status == AdvertisementStatus.Pending && !a.IsDeleted)
                .ToListAsync();

            var advertisementsDto = advertisements.Select(MapToDto).ToList();
            return advertisementsDto;
        }

        // Одобрение объявления Модератором
        public async Task ApproveAdvertisementAsync(int adId)
        {
            var advertisement = await context.Advertisements.FindAsync(adId);
            if (advertisement == null) throw new Exception("Advertisement not found");

            advertisement.Status = AdvertisementStatus.Approved;
            await context.SaveChangesAsync();
        }

        // Отклонение объявления Модератором
        public async Task RejectAdvertisementAsync(int adId)
        {
            var advertisement = await context.Advertisements.FindAsync(adId);
            if (advertisement == null) throw new Exception("Advertisement not found");

            advertisement.Status = AdvertisementStatus.Rejected;
            await context.SaveChangesAsync();
        }

        // Загрузка изображения для объявления
        public async Task<AdvertisementImage> UploadImageAsync(int adId, IFormFile file)
        {
            var advertisement = await context.Advertisements.FindAsync(adId);
            if (advertisement == null) throw new Exception("Advertisement not found");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
                throw new Exception("Unsupported file format");

            var fileName = $"{Guid.NewGuid()}{ext}";
            var path = Path.Combine(env.WebRootPath, "uploads", fileName);
            Directory.CreateDirectory(Path.GetDirectoryName(path)!);

            await using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);

            var image = new AdvertisementImage
            {
                AdvertisementId = adId,
                FileName = fileName
            };

            context.AdvertisementImages.Add(image);
            await context.SaveChangesAsync();
            return image;
        }

        // Удаление объявления (Soft delete)
        public async Task DeleteAdvertisementAsync(int adId, int currentUserId, bool isModerator = false)
        {
            var advertisement = await context.Advertisements
                .FirstOrDefaultAsync(a => a.Id == adId);

            if (advertisement == null)
                throw new Exception("Advertisement not found");

            // Проверка владельца
            if (!isModerator && advertisement.OwnerId != currentUserId)
                throw new Exception("You are not the owner of this advertisement");

            advertisement.IsDeleted = true;
            advertisement.DeletedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();
        }

        // Приватный метод для маппинга в DTO
        private AdvertisementDto MapToDto(Advertisement ad)
        {
            return new AdvertisementDto
            {
                Id = ad.Id,
                Name = ad.Name,
                Description = ad.Description,
                Price = ad.Price,
                Location = ad.Location,
                ContactEmail = ad.ContactEmail,
                ContactPhoneNumber = ad.ContactPhoneNumber,
                Status = ad.Status,
                CreatedAt = ad.CreatedAt,
                Images = ad.AdvertisementImages.Select(i => i.Url).ToList(),
                Categories = ad.AdvertisementCategories.Select(c => c.Category.Name).ToList()
            };
        }
    }
}
