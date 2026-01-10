namespace backend.DTO
{
    public class ChatListItemDto
    {
        public int Id { get; set; }

        public int AdvertisementId { get; set; }
        public string AdvertisementName { get; set; } = null!;
        public string? AdvertisementImageUrl { get; set; }

        public int CompanionId { get; set; }
        public string CompanionFirstName { get; set; } = null!;
        public string CompanionSurname { get; set; } = null!;
        public string? CompanionAvatarUrl { get; set; }

        public string? LastMessageText { get; set; }
        public bool IsLastMessageMine { get; set; }
        public DateTime? LastMessageAt { get; set; }
    }
}
