using HukukGorev.Application.Abstraction;
using HukukGorev.Infrastructure.Authorization;
using HukukGorev.Infrastructure.Filters;
using HukukGorev.Infrastructure.Services.Token;
using HukukGorev.Infrastructure.Services.Yetki;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace HukukGorev.Infrastructure;

public static class ServiceRegistrations
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<ITokenHandler, TokenHandler>();
        services.AddScoped<IUserPermissionService, UserPermissionService>();
        services.AddScoped<IAuthorizationHandler, PermissionHandler>();
        services.AddScoped<ValidationFilter>();
        services.AddHttpContextAccessor();

        return services;
    }
}
