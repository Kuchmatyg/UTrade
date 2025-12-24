using backend.DTO;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    [Authorize]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService reviewService;

        public ReviewController(ReviewService reviewService)
        {
            this.reviewService = reviewService;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue("id")!);

        // POST /api/reviews
        [HttpPost]
        public async Task<IActionResult> CreateReview(CreateReviewDto dto)
        {
            await reviewService.CreateReviewAsync(dto, CurrentUserId);
            return NoContent();
        }

        // GET /api/users/{id}/reviews
        [HttpGet("/api/users/{id}/reviews")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserReviews(int id)
        {
            var reviews = await reviewService.GetUserReviewsAsync(id);
            return Ok(reviews);
        }
    }
}
