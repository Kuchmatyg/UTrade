namespace backend.DTO
{
    // DTO для создания / обновления объявления
    public class CreateAdvertisementDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Price { get; set; }
        public string Location { get; set; } = null!;
        public string ContactEmail { get; set; } = null!;
        public string? ContactPhoneNumber { get; set; }
        public List<int>? CategoryIds { get; set; }
    }
}
