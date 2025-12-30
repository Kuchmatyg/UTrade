using backend.AppDbContext;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ReviewService
    {
        private readonly ApplicationDbContext context;

        public ReviewService(ApplicationDbContext context)
        {
            this.context = context;
        }

        // Создать отзыв по объявлению
        public async Task CreateReviewAsync(CreateReviewDto dto, int authorId)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                throw new Exception("Rating must be between 1 and 5");

            // Проверяем объявление
            var advertisement = await context.Advertisements
                .Where(a => a.Id == dto.AdvertisementId && !a.IsDeleted)
                .Select(a => new
                {
                    a.Id,
                    a.OwnerId,
                    a.Status
                })
                .FirstOrDefaultAsync();

            if (advertisement == null)
                throw new Exception("Advertisement not found");

            //if (advertisement.Status != AdvertisementStatus.Completed)
            //    throw new Exception("You can leave a review only after the advertisement is completed");

            if (advertisement.OwnerId == authorId)
                throw new Exception("You cannot review your own advertisement");

            // Проверка, что отзыв указывает на владельца объявления в TargetUserId
            if (advertisement.OwnerId != dto.TargetUserId)
                throw new Exception("You cannot list yourself as TargetUserId");

            // Проверяем, что отзыв ещё не оставляли
            var alreadyReviewed = await context.Reviews.AnyAsync(r =>
                r.AuthorId == authorId &&
                r.AdvertisementId == dto.AdvertisementId);

            if (alreadyReviewed)
                throw new Exception("You have already left a review for this advertisement");

            var review = new Review
            {
                AuthorId = authorId,
                TargetUserId = advertisement.OwnerId,
                AdvertisementId = dto.AdvertisementId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            context.Reviews.Add(review);
            await context.SaveChangesAsync();

            await RecalculateUserRatingAsync(advertisement.OwnerId);
        }

        public async Task<List<ReviewDto>> GetReviewsByAdAsync(int adId)
        {
            return await context.Reviews
                .Where(r => r.AdvertisementId == adId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    AuthorId = r.AuthorId,
                    AuthorName = r.Author.Username,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }



        // Получить отзывы пользователя
        public async Task<List<ReviewDto>> GetUserReviewsAsync(int userId)
        {
            return await context.Reviews
                .Where(r => r.TargetUserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    AuthorId = r.AuthorId,
                    AuthorName = r.Author != null
                        ? r.Author.FirstName + " " + r.Author.Surname
                        : "Аноним",
                    TargetUserId = r.TargetUserId,
                    AdvertisementId = r.AdvertisementId,
                    AdvertisementName = r.Advertisement.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        private async Task RecalculateUserRatingAsync(int userId)
        {
            var reviews = await context.Reviews
                .Where(r => r.TargetUserId == userId)
                .ToListAsync();

            int avg = System.Convert.ToInt32(reviews.Average(r => r.Rating));
            var count = reviews.Count;

            var rating = await context.UserRatings
                .FirstOrDefaultAsync(r => r.UserId == userId);

            if (rating == null)
            {
                rating = new UserRating
                {
                    UserId = userId,
                    AverageRating = avg,
                    TotalReviews = count
                };
                context.UserRatings.Add(rating);
            }
            else
            {
                rating.AverageRating = avg;
                rating.TotalReviews = count;
            }

            await context.SaveChangesAsync();
        }
        public async Task<bool> HasUserReviewedAdAsync(int adId, int userId)
        {
            return await context.Reviews.AnyAsync(r =>
                r.AdvertisementId == adId &&
                r.AuthorId == userId
            );
        }


    }
}
