using backend.AppDbContext;
using backend.DTO;
using backend.Helpers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // -------------------- Текущий пользователь --------------------
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var idClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(idClaim) || !int.TryParse(idClaim, out var userId))
                return Unauthorized();

            var user = await _context.Users
                .AsNoTracking()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email,
                phone = user.Phone,
                location = user.Location,
                firstName = user.FirstName,
                middleName = user.MiddleName,
                surname = user.Surname,
                avatarUrl = user.AvatarUrl,
                role = user.Role.Name,
                createdAt = user.CreatedAt
            });
        }

        // -------------------- Логаут --------------------
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // При использовании JWT логаут обычно выполняется на клиенте
            // Этот endpoint оставлен для совместимости с фронтендом
            return Ok(new { message = "Logged out" });
        }

        // -------------------- Логин --------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Находим пользователя по username
            var user = await _context.Users
                .AsNoTracking()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null)
                return Unauthorized("Invalid username");

            // Проверяем пароль через PasswordHash
            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid password");

            // Генерируем JWT
            var token = _jwtService.GenerateToken(user);

            return Ok(new { token });
        }
    }
}
