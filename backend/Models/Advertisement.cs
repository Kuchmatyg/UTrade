namespace backend.Models
{

    public enum AdvertisementStatus
    {
        Pending,    // ожидает модерации
        Approved,   // опубликовано
        Rejected    // отклонено
    }

    public class Advertisement
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        //public int CategoryId { get; set; }
        //public Category Category { get; set; } = null!;
        public string? Description { get; set; }
        public int Price { get; set; }
        // Владелец объявления
        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string? ContactPhoneNumber { get; set; }
        public string ContactEmail { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public AdvertisementStatus Status { get; set; } = AdvertisementStatus.Pending;

        //public string Status { get; set; } = null!;

        // Связи
        public ICollection<Chat> Chats { get; set; } = new List<Chat>();
        public ICollection<AdvertisementImage> AdvertisementImages { get; set; } = new List<AdvertisementImage>();
        public ICollection<AdvertisementCategory> AdvertisementCategories { get; set; } = new List<AdvertisementCategory>();

    }
}
