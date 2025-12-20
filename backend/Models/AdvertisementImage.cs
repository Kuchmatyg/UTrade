namespace backend.Models
{
    public class AdvertisementImage
    {
        public int Id { get; set; }
        public int AdvertisementId { get; set; }
        public Advertisement Advertisement { get; set; } = null!;
        //public string Image { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public string Url => $"/uploads/{FileName}"; // путь для фронтенда
        public DateTime CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
