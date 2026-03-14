using Microsoft.AspNetCore.Mvc;

namespace HukukGorev.Application.Authorization;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = false)]
public class HasPermissionAttribute : TypeFilterAttribute
{
    public string Permission { get; }

    public HasPermissionAttribute(string permission) : base(typeof(HasPermissionAttribute))
    {
        Permission = permission;
        Arguments = new object[] { permission };
    }
}
