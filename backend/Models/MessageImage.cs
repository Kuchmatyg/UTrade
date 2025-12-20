namespace backend.Models
{
    public class MessageImage
    {
        public int Id { get; set; }
        public int MessageId { get; set; }
        public Message Message { get; set; } = null!;
        public string Image { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
