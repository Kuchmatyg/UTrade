using backend.Models;

namespace backend.DTO
{
    // DTO для получения объявлений
    public class AdvertisementDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Price { get; set; }

        public int OwnerId { get; set; }
        public string Username { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string ContactEmail { get; set; } = null!;
        public string? ContactPhoneNumber { get; set; }
        public AdvertisementStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<string> Images { get; set; } = new();
        public List<string> Categories { get; set; } = new();
        public double? SellerRating { get; set; }
        public int SellerReviewsCount { get; set; }

    }
}
