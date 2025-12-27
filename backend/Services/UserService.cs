using backend.AppDbContext;
using backend.DTO;
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
