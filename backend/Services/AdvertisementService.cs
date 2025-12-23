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
        private readonly NotificationService notificationService;

        public AdvertisementService(ApplicationDbContext context, IWebHostEnvironment env, NotificationService notificationService)
        {
            this.context = context;
            this.env = env;
            this.notificationService = notificationService;
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

            // Подгружаем AdvertisementCategories вместе с Category
            await context.Entry(advertisement)
                .Collection(a => a.AdvertisementCategories)
                .Query()
                .Include(ac => ac.Category)
                .LoadAsync();

            // Подгружаем Owner, чтобы MapToDto не упал
            await context.Entry(advertisement)
                .Reference(a => a.Owner)
                .LoadAsync();

            // Создаём уведомление пользователю
            string message = $"Ваше объявление \"{advertisement.Name}\" отправлено на модерацию";
            await notificationService.NotifyAsync(ownerId, message);

            return MapToDto(advertisement);
        }

        // Получение объявлений для обычного пользователя (только Approved)
        public async Task<List<AdvertisementDto>> GetApprovedAdvertisementsAsync()
        {
            var advertisements = await context.Advertisements
                .Include(a => a.Owner)
                .Include(a => a.AdvertisementImages)
                .Include(a => a.AdvertisementCategories)
                .ThenInclude(ac => ac.Category)
                .Where(a => a.Status == AdvertisementStatus.Approved && !a.IsDeleted)
                .ToListAsync();

            var advertisementsDto = advertisements.Select(MapToDto).ToList();
            return advertisementsDto;
        }

        // Обновление объявления владельцем
        public async Task UpdateAdvertisementAsync(int adId, UpdateAdvertisementDto dto, int currentUserId)
        {
            var ad = await context.Advertisements
                .Include(a => a.AdvertisementCategories)
                .FirstOrDefaultAsync(a => a.Id == adId && !a.IsDeleted);

            if (ad == null)
                throw new Exception("Advertisement not found");

            if (ad.OwnerId != currentUserId)
                throw new Exception("You are not the owner");

            // обновляем поля
            ad.Name = dto.Name;
            ad.Description = dto.Description;
            ad.Price = dto.Price;
            ad.Location = dto.Location;
            ad.ContactEmail = dto.ContactEmail;
            ad.ContactPhoneNumber = dto.ContactPhoneNumber;
            ad.UpdatedAt = DateTime.UtcNow;

            // обновляем категории
            ad.AdvertisementCategories.Clear();

            if (dto.CategoryIds != null)
            {
                foreach (var categoryId in dto.CategoryIds)
                {
                    ad.AdvertisementCategories.Add(new AdvertisementCategory
                    {
                        AdvertisementId = ad.Id,
                        CategoryId = categoryId,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await context.SaveChangesAsync();
        }

        // Повторная отправка на модерацию
        public async Task ResubmitAdvertisementAsync(int adId, int currentUserId)
        {
            var ad = await context.Advertisements.FirstOrDefaultAsync(a => a.Id == adId);

            if (ad == null)
                throw new Exception("Advertisement not found");

            if (ad.OwnerId != currentUserId)
                throw new Exception("You are not the owner");

            if (ad.Status != AdvertisementStatus.Rejected)
                throw new Exception("Only rejected advertisements can be resubmitted");

            ad.Status = AdvertisementStatus.Pending;
            ad.RejectionReason = null;
            ad.UpdatedAt = DateTime.UtcNow;

            // Создаём уведомление пользователю
            string message = $"Ваше объявление \"{ad.Name}\" повторно отправлено на модерацию";
            await notificationService.NotifyAsync(ad.OwnerId, message);

            await context.SaveChangesAsync();
        }

        // Получение всех Pending объявлений для модератора
        public async Task<List<AdvertisementDto>> GetPendingAdvertisementsAsync()
        {
            var advertisements = await context.Advertisements
                .Include(a => a.Owner)
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

            // Создаём уведомление пользователю
            string message = $"Ваше объявление \"{advertisement.Name}\" опубликовано";
            await notificationService.NotifyAsync(advertisement.OwnerId, message);
           
            await context.SaveChangesAsync();
        }

        // Отклонение объявления Модератором
        //public async Task RejectAdvertisementAsync(int adId)
        //{
        //    var advertisement = await context.Advertisements.FindAsync(adId);
        //    if (advertisement == null) throw new Exception("Advertisement not found");

        //    advertisement.Status = AdvertisementStatus.Rejected;
        //    await context.SaveChangesAsync();
        //}
        // Отклонение модератором с причиной
        public async Task RejectAdvertisementAsync(int adId, string reason)
        {
            var ad = await context.Advertisements.FindAsync(adId);
            if (ad == null)
                throw new Exception("Advertisement not found");

            ad.Status = AdvertisementStatus.Rejected;
            ad.RejectionReason = reason;
            ad.UpdatedAt = DateTime.UtcNow;

            // Создаём уведомление пользователю
            string message = $"Ваше объявление \"{ad.Name}\" отклонено. Причина: {reason}";
            await notificationService.NotifyAsync(ad.OwnerId, message);

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
            //Categories = ad.AdvertisementCategories.Select(c => c.Category.Name).ToList()
            return new AdvertisementDto
            {
                Id = ad.Id,
                Name = ad.Name,
                Description = ad.Description,
                Price = ad.Price,
                Username = ad.Owner.Username,
                Location = ad.Location,
                ContactEmail = ad.ContactEmail,
                ContactPhoneNumber = ad.ContactPhoneNumber,
                Status = ad.Status,
                CreatedAt = ad.CreatedAt,
                Images = ad.AdvertisementImages?.Select(i => i.Url).ToList() ?? new List<string>(),
                Categories = ad.AdvertisementCategories?
                    .Where(ac => ac.Category != null)
                    .Select(ac => ac.Category!.Name)
                    .ToList() ?? new List<string>(),
            };
        }
    }
}
