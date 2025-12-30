using backend.AppDbContext;
using backend.DTO;
using backend.Models; // где лежит AdvertisementStatus
using Microsoft.EntityFrameworkCore;

public class UserService
{
    private readonly ApplicationDbContext context;
    private readonly IWebHostEnvironment env;
    public UserService(ApplicationDbContext context, IWebHostEnvironment env)
    {
        this.context = context;
        this.env = env;
    }

    // Изменение даннх пользователя, именно email, phone, location
    public async Task UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            throw new Exception("User not found");

        // email можно валидировать / проверять уникальность
        user.Email = dto.Email;
        user.Phone= dto.Phone;
        user.Location = dto.Location;

        await context.SaveChangesAsync();
    }

    // 🔹 Отзывы о пользователе
    public async Task<UserProfileDto?> GetUserProfileAsync(int userId)
    {
        var user = await context.Users
            .AsNoTracking()
            .Include(u => u.Rating)
            .Include(u => u.Advertisements)
            .Include(u => u.TargetUsers)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return null;

        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            AvatarUrl = user.AvatarUrl,
            FirstName = user.FirstName,
            MiddleName = user.MiddleName,
            Surname = user.Surname,
            Location = user.Location,
            CreatedAt = user.CreatedAt,

            Rating = user.Rating != null
                ? user.Rating.AverageRating  : 0,

            ReviewsCount = user.Rating?.TotalReviews ?? user.TargetUsers.Count,

            ActiveAdsCount = user.Advertisements
                .Count(a => a.Status == AdvertisementStatus.Approved),

            CompletedAdsCount = user.Advertisements
                .Count(a => a.Status == AdvertisementStatus.Completed)
        };
    }

    // Сохраняем картинку на аватарку пользователя
    public async Task<string> SaveAvatarAsync(int userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("No file uploaded");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            throw new Exception("Unsupported file format");

        var fileName = $"{Guid.NewGuid()}{ext}";
        var folder = Path.Combine(env.WebRootPath, "avatars");
        Directory.CreateDirectory(folder);

        var path = Path.Combine(folder, fileName);
        await using var stream = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(stream);

        var user = await context.Users.FindAsync(userId);
        if (user == null)
            throw new Exception("User not found");

        user.AvatarUrl = fileName;

        await context.SaveChangesAsync();

        return fileName;
    }
}
