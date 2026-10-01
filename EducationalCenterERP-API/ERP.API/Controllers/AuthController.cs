using Microsoft.AspNetCore.Identity;
using ERP.Infrastructure.Identity;
using ERP.Application.Models;
using Microsoft.AspNetCore.Mvc;
using ERP.Application.Interfaces;
using ERP.Application.DTOs.Auth;

namespace ERP.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtService _jwt;

        public AuthController(
        UserManager<ApplicationUser> userManager,
        IJwtService jwt)
        {
            _userManager = userManager;
            _jwt = jwt;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
        LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "اسم المستخدم غير صحيح."
                });
            }

            var check = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!check)
            { 
                return Unauthorized(new
                {
                    message = "كلمة المرور غير صحيحة."
                });
            }

            var token = _jwt.GenerateToken(new JwtUser
            {
                Id = user.Id,
                UserName = user.UserName!,
                FullName = user.FullName
            });
            return Ok(new
            {
                token
            });
        }
    }
}
