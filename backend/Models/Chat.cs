using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public int UserFromId { get; set; }
        public User UserFrom { get; set; } = null!;
        public int UserToId { get; set; }
        public User UserTo { get; set; } = null!;

        public int AdvertisementId { get; set; }
        public Advertisement Advertisement { get; set; } = null!;
        public bool IsSupportChat { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
