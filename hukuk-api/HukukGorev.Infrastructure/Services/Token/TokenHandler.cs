using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HukukGorev.Application.Abstraction;
using HukukGorev.Application.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HukukGorev.Infrastructure.Services.Token;

public class TokenHandler : ITokenHandler
{
    private readonly IConfiguration _configuration;

    public TokenHandler(IConfiguration configuration) => _configuration = configuration;

    public TokenDto CreateAccessToken(int userId, string email, string role)
    {
        var tokenSection = _configuration.GetSection("Token");
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSection["SecurityKey"]!));
        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var expiration = DateTime.UtcNow.AddHours(12);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Role, role),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            audience: tokenSection["Audience"],
            issuer: tokenSection["Issuer"],
            expires: expiration,
            claims: claims,
            signingCredentials: signingCredentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();

        return new TokenDto
        {
            AccessToken = tokenHandler.WriteToken(token),
            Expiration = expiration
        };
    }
}
