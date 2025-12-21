using backend.AppDbContext;
using backend.DTO;
using backend.Helpers;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // -------------------- Логин --------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Находим пользователя по username
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null)
                return Unauthorized("Invalid username or password");

            // Проверяем пароль через PasswordHash
            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid username or password");

            // Генерируем JWT
            var token = _jwtService.GenerateToken(user);

            return Ok(new { token });
        }
    }
}
