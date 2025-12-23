namespace backend.DTO
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = null!;
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
