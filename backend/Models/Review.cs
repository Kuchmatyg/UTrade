namespace backend.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
        public int TargetUserId { get; set; }
        public User TargetUser { get; set; } = null!;
        public int AdvertisementId { get; set; }
        public Advertisement Advertisement { get; set; } = null!;
        public int Rating { get; set; } // 1–5
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
