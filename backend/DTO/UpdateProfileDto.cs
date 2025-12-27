namespace backend.DTO
{
    public class UpdateProfileDto
    {
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Location { get; set; }
    }
}
