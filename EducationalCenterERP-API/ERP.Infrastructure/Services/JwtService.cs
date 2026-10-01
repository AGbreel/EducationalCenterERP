using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ERP.Application.Interfaces;
using ERP.Application.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ERP.Infrastructure.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(JwtUser user)
        {
            var keyValue = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(keyValue))
                throw new InvalidOperationException("Jwt:Key is not configured.");

            if (Encoding.UTF8.GetByteCount(keyValue) < 32)
                throw new InvalidOperationException(
                    "Jwt:Key must be at least 32 bytes long.");

            if (string.IsNullOrWhiteSpace(issuer))
                throw new InvalidOperationException("Jwt:Issuer is not configured.");

            if (string.IsNullOrWhiteSpace(audience))
                throw new InvalidOperationException("Jwt:Audience is not configured.");

            var claims = new[]
            {
                 new Claim(
                     JwtRegisteredClaimNames.Sub,
                     user.Id.ToString()),
            
                 new Claim(
                     JwtRegisteredClaimNames.UniqueName,
                     user.UserName ?? ""),
            
                new Claim(
                "FullName",
                user.FullName ?? "")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(keyValue));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}