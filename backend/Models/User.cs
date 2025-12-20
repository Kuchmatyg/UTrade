namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string Surname { get; set; } = null!;
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string Location { get; set; } = null!;
        public string Institute { get; set; } = null!;
        public UserRating? Rating { get; set; } // один рейтинг

        // Кафедра
        public string? Department {  get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Связи
        public ICollection<Advertisement> Advertisements { get; set; } = new List<Advertisement>();
        public ICollection<Chat> ChatsFrom { get; set; } = new List<Chat>();
        public ICollection<Chat> ChatsTo { get; set; } = new List<Chat>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<Review> Authors { get; set; } = new List<Review>();
        public ICollection<Review> TargetUsers { get; set; } = new List<Review>();
        //public ICollection<UserRating> UserRatings { get; set; } = new List<UserRating>();
    }
}
