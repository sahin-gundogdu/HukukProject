using System.Data.Common;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace HukukGorev.Persistance.Interceptors;

public class WithNolockInterceptor : DbCommandInterceptor
{
    // FROM [dbo].[KULLANICI] AS [k] → FROM [dbo].[KULLANICI] WITH (NOLOCK) AS [k]
    // JOIN [dbo].[GOREV] AS [g]     → JOIN [dbo].[GOREV] WITH (NOLOCK) AS [g]
    private static readonly Regex TablePattern = new(
        @"((?:FROM|JOIN)\s+\[[\w]+\]\.\[[\w]+\])\s+(AS\s+\[)",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public override InterceptionResult<DbDataReader> ReaderExecuting(DbCommand command, CommandEventData eventData, InterceptionResult<DbDataReader> result)
    {
        ApplyNolock(command);
        return base.ReaderExecuting(command, eventData, result);
    }

    public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(DbCommand command, CommandEventData eventData, InterceptionResult<DbDataReader> result, CancellationToken cancellationToken = default)
    {
        ApplyNolock(command);
        return base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
    }

    private static void ApplyNolock(DbCommand command)
    {
        if (command.CommandText.StartsWith("SELECT", StringComparison.OrdinalIgnoreCase) &&
            !command.CommandText.Contains("WITH (NOLOCK)"))
        {
            command.CommandText = TablePattern.Replace(command.CommandText, "$1 WITH (NOLOCK) $2");
        }
    }
}

