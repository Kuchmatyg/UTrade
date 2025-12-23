namespace backend.DTO
{
    public class ChatDto
    {
        public int Id { get; set; }
        public int AdvertisementId { get; set; }
        public string AdvertisementName { get; set; } = null!;
        public int UserFromId { get; set; }
        public string UserFromName { get; set; } = null!;
        public int UserToId { get; set; }
        public string UserToName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
