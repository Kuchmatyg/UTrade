using backend.AppDbContext;
using backend.DTO;
using Microsoft.EntityFrameworkCore;

public class UserService
{
    private readonly ApplicationDbContext context;

    public UserService(ApplicationDbContext context)
    {
        this.context = context;
    }

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
}
