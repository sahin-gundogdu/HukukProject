using System.Security.Claims;
using HukukGorev.Application.Abstraction;
using HukukGorev.Application.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Infrastructure.Services.Yetki;

public class UserPermissionService : IUserPermissionService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUnitOfWork _unitOfWork;

    public UserPermissionService(IHttpContextAccessor httpContextAccessor, IUnitOfWork unitOfWork)
    {
        _httpContextAccessor = httpContextAccessor;
        _unitOfWork = unitOfWork;
    }

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

    public async Task<List<int>> GetSubordinateIdsAsync(int userId)
    {
        var subordinateIds = new List<int>();
        await GetSubordinatesRecursive(userId, subordinateIds);
        return subordinateIds;
    }

    private async Task GetSubordinatesRecursive(int managerId, List<int> allSubordinateIds)
    {
        var subordinates = await _unitOfWork.KullaniciReadRepository.GetAllQueryable()
            .Where(k => k.YoneticiId == managerId && k.Aktif)
            .Select(k => k.Id)
            .ToListAsync();

        foreach (var subId in subordinates)
        {
            if (!allSubordinateIds.Contains(subId))
            {
                allSubordinateIds.Add(subId);
                await GetSubordinatesRecursive(subId, allSubordinateIds);
            }
        }
    }
}
