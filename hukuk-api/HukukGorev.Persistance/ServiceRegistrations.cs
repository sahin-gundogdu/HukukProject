using HukukGorev.Application.UnitOfWork;
using HukukGorev.Persistance.Contexts;
using HukukGorev.Persistance.Interceptors;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HukukGorev.Persistance;

public static class ServiceRegistrations
{
    public static IServiceCollection AddPersistanceServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<EntityInterceptor>();
        services.AddSingleton<WithNolockInterceptor>();

        services.AddDbContext<HukukGorevDbContext>((sp, options) =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            options.AddInterceptors(
                sp.GetRequiredService<EntityInterceptor>(),
                sp.GetRequiredService<WithNolockInterceptor>()
            );
        });

        services.AddScoped<IUnitOfWork, UnitOfWork.UnitOfWork>();

        return services;
    }
}
