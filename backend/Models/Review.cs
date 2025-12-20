namespace backend.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
        public int TargetUserId { get; set; }
        public User TargetUser { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

    }
}
