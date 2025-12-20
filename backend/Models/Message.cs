using Microsoft.AspNetCore.Mvc.Formatters;

namespace backend.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; } = null!;
        public int SenderId { get; set; }
        public User Sender { get; set; } = null!;
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool? IsEdited { get; set; }
        public DateTime? EditedAt { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }

        // Связи
        public ICollection<MessageImage> Images { get; set; } = new List<MessageImage>();

    }
}
