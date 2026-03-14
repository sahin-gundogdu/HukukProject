namespace HukukGorev.Application.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string entityName, object key)
        : base($"{entityName} ({key}) bulunamadı.") { }
}

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "Yetkisiz erişim.") : base(message) { }
}

public class ForbiddenException : Exception
{
    public ForbiddenException(string message = "Bu işlem için yetkiniz bulunmamaktadır.") : base(message) { }
}

public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}
