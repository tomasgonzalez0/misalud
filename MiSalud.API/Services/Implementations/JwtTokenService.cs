using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MiSalud.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MiSalud.API.Services.Implementations
{
    public class JwtOptions
    {
        public string Issuer { get; set; } = "MiSalud";
        public string Audience { get; set; } = "MiSalud.Client";
        public string Key { get; set; } = "QmFzZTY0U2VjdXJlS2V5MzIqKkN1c3RvbSEwMTIzNDU2Nzg=";
        public int ExpirationMinutes { get; set; } = 120;
    }

    public class JwtTokenService : IJwtTokenService
    {
        private readonly JwtOptions _opts;
        public JwtTokenService(IOptions<JwtOptions> opts) { _opts = opts.Value; }

        public Task<(string token, DateTime expiresUtc)> CreateTokenAsync(IdentityUser user, IEnumerable<string> roles)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? user.Email ?? ""),
                new(JwtRegisteredClaimNames.Email, user.Email ?? "")
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opts.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_opts.ExpirationMinutes);

            var token = new JwtSecurityToken(
                issuer: _opts.Issuer,
                audience: _opts.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return Task.FromResult((jwt, expires));
        }
    }
}