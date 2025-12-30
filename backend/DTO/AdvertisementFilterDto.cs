namespace backend.DTO
{
    public class AdvertisementFilterDto
    {
        public string? Query { get; set; }
        public int? CategoryId { get; set; }
        public int? MinPrice { get; set; }
        public int? MaxPrice { get; set; }
    }
}
