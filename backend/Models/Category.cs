namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        // Связи
        public ICollection<AdvertisementCategory> AdvertisementCategories { get; set; } = new List<AdvertisementCategory>();
    }
}
