using backend.DTO;
using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService reviewService;

        public ReviewController(ReviewService reviewService)
        {
            this.reviewService = reviewService;
        }

        // POST /api/reviews
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
        {
            int authorId = int.Parse(User.FindFirst("id")!.Value);

            await reviewService.CreateReviewAsync(dto, authorId);

            return Ok();
        }

        // GET /api/reviews/by-ad/{adId}
        [HttpGet("by-ad/{adId}")]
        public async Task<IActionResult> GetByAd(int adId)
        {
            var reviews = await reviewService.GetReviewsByAdAsync(adId);
            return Ok(reviews);
        }

        // GET /api/reviews/has-reviewed/{adId}
        [HttpGet("by-ad/{adId}/mine")]
        [Authorize]
        public async Task<IActionResult> HasReviewed(int adId)
        {
            int userId = int.Parse(User.FindFirst("id")!.Value);
            var result = await reviewService.HasUserReviewedAdAsync(adId, userId);
            return Ok(result);
        }
    }
}
