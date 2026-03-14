using HukukGorev.Application.Features.Dashboard.Queries;
using HukukGorev.Application.Features.GenericCrud;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HukukGorev.API.Controllers;

[Authorize]
public class GorevYorumController : BaseController
{
    private readonly IMediator _mediator;
    public GorevYorumController(IMediator mediator) => _mediator = mediator;

    [HttpPost("[action]")]
    public async Task<IActionResult> CreateGorevYorum([FromBody] CreateGorevYorumRequest request) =>
        Ok(await _mediator.Send(request));
}

[Authorize]
public class GrupController : BaseController
{
    private readonly IMediator _mediator;
    public GrupController(IMediator mediator) => _mediator = mediator;

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAllGruplar() => Ok(await _mediator.Send(new GetAllGrupRequest()));

    [HttpPost("[action]")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGrup([FromBody] CreateGrupRequest request) => Ok(await _mediator.Send(request));

    [HttpPut("[action]")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGrup([FromBody] UpdateGrupRequest request) => Ok(await _mediator.Send(request));

    [HttpDelete("[action]/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGrup(int id) => Ok(await _mediator.Send(new DeleteGrupRequest { Id = id }));
}

[Authorize]
public class GorevTipiController : BaseController
{
    private readonly IMediator _mediator;
    public GorevTipiController(IMediator mediator) => _mediator = mediator;

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAllGorevTipleri() => Ok(await _mediator.Send(new GetAllGorevTipiRequest()));

    [HttpPost("[action]")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGorevTipi([FromBody] CreateGorevTipiRequest request) => Ok(await _mediator.Send(request));
}

[Authorize]
public class EtiketController : BaseController
{
    private readonly IMediator _mediator;
    public EtiketController(IMediator mediator) => _mediator = mediator;

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAllEtiketler() => Ok(await _mediator.Send(new GetAllEtiketRequest()));

    [HttpPost("[action]")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateEtiket([FromBody] CreateEtiketRequest request) => Ok(await _mediator.Send(request));
}

[Authorize]
public class BildirimController : BaseController
{
    private readonly IMediator _mediator;
    public BildirimController(IMediator mediator) => _mediator = mediator;

    [HttpGet("[action]")]
    public async Task<IActionResult> GetBildirimler([FromQuery] int kullaniciId, [FromQuery] bool? sadeceOkunmamis) =>
        Ok(await _mediator.Send(new GetBildirimlerRequest { KullaniciId = kullaniciId, SadeceOkunmamis = sadeceOkunmamis }));

    [HttpPut("[action]/{id}")]
    public async Task<IActionResult> MarkOkundu(int id) => Ok(await _mediator.Send(new MarkBildirimOkunduRequest { Id = id }));
}

[Authorize]
public class AyarController : BaseController
{
    private readonly IMediator _mediator;
    public AyarController(IMediator mediator) => _mediator = mediator;

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAllAyarlar() => Ok(await _mediator.Send(new GetAllAyarRequest()));

    [HttpPut("[action]")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAyar([FromBody] UpdateAyarRequest request) => Ok(await _mediator.Send(request));
}

[Authorize]
public class DashboardController : BaseController
{
    private readonly IMediator _mediator;
    public DashboardController(IMediator mediator) => _mediator = mediator;

    [HttpGet("[action]")]
    public async Task<IActionResult> GetDashboard([FromQuery] int? kullaniciId, [FromQuery] int? grupId) =>
        Ok(await _mediator.Send(new GetDashboardRequest { KullaniciId = kullaniciId, GrupId = grupId }));
}
