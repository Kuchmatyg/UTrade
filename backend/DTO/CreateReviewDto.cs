namespace backend.DTO
{
    public class CreateReviewDto
    {
        public int AdvertisementId { get; set; }
        public int TargetUserId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
