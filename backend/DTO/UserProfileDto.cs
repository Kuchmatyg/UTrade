namespace backend.DTO
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string? AvatarUrl { get; set; }

        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string Surname { get; set; } = null!;

        public string Location { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        // рейтинг
        public double Rating { get; set; }
        public int ReviewsCount { get; set; }

        // объявления
        public int ActiveAdsCount { get; set; }
        public int CompletedAdsCount { get; set; }
    }
}
