using HukukGorev.Application.DTOs;

namespace HukukGorev.Application.Abstraction;

public interface ITokenHandler
{
    TokenDto CreateAccessToken(int userId, string email, string role);
}
