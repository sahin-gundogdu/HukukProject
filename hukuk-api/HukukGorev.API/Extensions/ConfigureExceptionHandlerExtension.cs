using System.Net;
using System.Text.Json;
using HukukGorev.Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace HukukGorev.API.Extensions;

public static class ConfigureExceptionHandlerExtension
{
    public static void ConfigureExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    var errorCode = Guid.NewGuid().ToString("N")[..8].ToUpper();

                    var (statusCode, message) = contextFeature.Error switch
                    {
                        NotFoundException => (HttpStatusCode.NotFound, contextFeature.Error.Message),
                        BadRequestException => (HttpStatusCode.BadRequest, contextFeature.Error.Message),
                        UnauthorizedException => (HttpStatusCode.Unauthorized, contextFeature.Error.Message),
                        ForbiddenException => (HttpStatusCode.Forbidden, contextFeature.Error.Message),
                        ConflictException => (HttpStatusCode.Conflict, contextFeature.Error.Message),
                        _ => (HttpStatusCode.InternalServerError, $"Bir hata oluştu. Hata kodu: {errorCode}")
                    };

                    context.Response.StatusCode = (int)statusCode;
                    context.Response.ContentType = "application/json";

                    var response = JsonSerializer.Serialize(new
                    {
                        Basarili = false,
                        HataKodu = errorCode,
                        Mesaj = message,
                        StatusCode = (int)statusCode
                    });

                    // Log only internal server errors
                    if (statusCode == HttpStatusCode.InternalServerError)
                    {
                        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
                        logger.LogError(contextFeature.Error, "Hata Kodu: {ErrorCode}", errorCode);
                    }

                    await context.Response.WriteAsync(response);
                }
            });
        });
    }
}
