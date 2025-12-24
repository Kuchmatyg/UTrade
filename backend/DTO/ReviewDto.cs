namespace backend.DTO
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = null!;
        public int TargetUserId { get; set; }
        public int AdvertisementId { get; set; }
        public string AdvertisementName { get; set; } = null!;
        public string Comment { get; set; } = null!;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
