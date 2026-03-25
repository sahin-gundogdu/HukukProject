namespace HukukGorev.Application.Abstraction;

public interface IUserPermissionService
{
    Task<bool> HasPermission(int userId, string permission);
    Task<int> GetCurrentUserId();
    Task<List<int>> GetSubordinateIdsAsync(int userId);
}
