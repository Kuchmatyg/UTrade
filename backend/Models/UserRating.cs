using Microsoft.AspNetCore.SignalR;

namespace backend.Models
{
    public class UserRating
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int AverageRating { get; set; }
        public int TotalReviews { get; set; }


    }
}
