using Microsoft.AspNetCore.Identity;

namespace MiSalud.API.Services.Interfaces
{
    public interface IJwtTokenService
    {
        Task<(string token, DateTime expiresUtc)> CreateTokenAsync(IdentityUser user, IEnumerable<string> roles);
    }
}