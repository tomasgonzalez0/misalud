using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiSalud.API.Data;
using MiSalud.API.Models;
using MiSalud.API.Services.Interfaces;

namespace MiSalud.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _users;
        private readonly SignInManager<IdentityUser> _signIn;
        private readonly RoleManager<IdentityRole> _roles;
        private readonly ApplicationDbContext _db;
        private readonly IJwtTokenService _jwt;

        public AuthController(
            UserManager<IdentityUser> users,
            SignInManager<IdentityUser> signIn,
            RoleManager<IdentityRole> roles,
            ApplicationDbContext db,
            IJwtTokenService jwt)
        {
            _users = users;
            _signIn = signIn;
            _roles = roles;
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] MiSalud.API.DTOs.Auth.LoginRequest req, CancellationToken ct)
        {
            var user = await _users.Users.FirstOrDefaultAsync(u =>
                u.NormalizedUserName == req.UserNameOrEmail.ToUpper() ||
                u.NormalizedEmail == req.UserNameOrEmail.ToUpper(), ct);

            if (user == null) return Unauthorized("Credenciales inválidas.");

            var passOk = await _signIn.CheckPasswordSignInAsync(user, req.Password, false);
            if (!passOk.Succeeded) return Unauthorized("Credenciales inválidas.");

            var roles = await _users.GetRolesAsync(user);
            var tokenResult = await _jwt.CreateTokenAsync(user, roles);
            var token = tokenResult.token;
            var exp = tokenResult.expiresUtc;

            int? personaId = await _db.Personas
                .Where(p => p.UserId == user.Id).Select(p => (int?)p.Id).FirstOrDefaultAsync(ct);
            string? nombre = await _db.Personas
                .Where(p => p.UserId == user.Id).Select(p => p.Nombre).FirstOrDefaultAsync(ct);

            return Ok(new MiSalud.API.DTOs.Auth.LoginResponse
            {
                Token = token,
                ExpiresAtUtc = exp,
                UserId = user.Id,
                PersonaId = personaId,
                Role = roles.FirstOrDefault(),
                Nombre = nombre
            });
        }
    }
}