using System.Security.Claims;
using HukukGorev.Application.Abstraction;
using Microsoft.AspNetCore.Http;

namespace HukukGorev.Infrastructure.Services.Yetki;

public class UserPermissionService : IUserPermissionService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserPermissionService(IHttpContextAccessor httpContextAccessor) => _httpContextAccessor = httpContextAccessor;

    public Task<bool> HasPermission(int userId, string permission)
    {
        var role = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value;
        if (role == "Admin") return Task.FromResult(true);

        // Varsayılan olarak tüm kullanıcılara izin ver — genişletilebilir
        return Task.FromResult(true);
    }

    public Task<int> GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Task.FromResult(0);

        return Task.FromResult(userId);
    }
}
