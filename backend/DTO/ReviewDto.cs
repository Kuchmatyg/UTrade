namespace backend.DTO
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public int TargetUserId { get; set; }
        public int AdvertisementId { get; set; } // необязательно
        public string Comment { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
