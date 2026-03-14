using Microsoft.AspNetCore.Authorization;

namespace HukukGorev.Infrastructure.Authorization;

public class PermissionRequirement : IAuthorizationRequirement
{
    public string Permission { get; }
    public PermissionRequirement(string permission) => Permission = permission;
}

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        var roleClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.Role);
        if (roleClaim?.Value == "Admin")
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Genişletilebilir yetki kontrol mantığı
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
