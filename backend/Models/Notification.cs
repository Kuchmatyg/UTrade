namespace backend.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string Content { get; set; } = null!;
        public bool? IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedAt { get; set; }

    }
}
