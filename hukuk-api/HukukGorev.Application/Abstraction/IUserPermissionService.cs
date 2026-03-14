namespace HukukGorev.Application.Abstraction;

public interface IUserPermissionService
{
    Task<bool> HasPermission(int userId, string permission);
    Task<int> GetCurrentUserId();
}
