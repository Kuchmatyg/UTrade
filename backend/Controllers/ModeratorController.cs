using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTO;
using backend.Hubs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Reflection;
using System.Security.Claims;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/moderator/ads")]
    [Authorize(Roles = "Moderator")]
    public class ModeratorController : ControllerBase
    {
        private readonly AdvertisementService adService;

        public ModeratorController(AdvertisementService adService)
        {
            this.adService = adService;
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            await adService.ApproveAdvertisementAsync(id);
            return Ok();
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectAdvertisementDto dto)
        {
            await adService.RejectAdvertisementAsync(id, dto.Reason);
            return Ok();
        }
    }

}
