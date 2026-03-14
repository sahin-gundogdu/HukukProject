using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace HukukGorev.Application;

public static class ServiceRegistrations
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ServiceRegistrations).Assembly));
        services.AddAutoMapper(typeof(ServiceRegistrations).Assembly);
        services.AddValidatorsFromAssembly(typeof(ServiceRegistrations).Assembly);

        return services;
    }
}
