using HukukGorev.Application.Features.GenericCrud;
using HukukGorev.Application.Features.Gorev.Commands.CreateGorev;
using HukukGorev.Application.Features.Gorev.Commands.DeleteGorev;
using HukukGorev.Application.Features.Gorev.Commands.UpdateGorev;
using HukukGorev.Application.Features.Gorev.Queries.GetAllGorev;
using HukukGorev.Application.Features.Gorev.Queries.GetGorevById;
using HukukGorev.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HukukGorev.API.Controllers;

[Authorize]
public class GorevController : BaseController
{
    private readonly IMediator _mediator;
    public GorevController(IMediator mediator) => _mediator = mediator;

    [HttpPost("[action]")]
    public async Task<IActionResult> CreateGorev([FromBody] CreateGorevRequest request) =>
        Ok(await _mediator.Send(request));

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateGorev([FromBody] UpdateGorevRequest request) =>
        Ok(await _mediator.Send(request));

    [HttpDelete("[action]/{id}")]
    public async Task<IActionResult> DeleteGorev(int id) =>
        Ok(await _mediator.Send(new DeleteGorevRequest { Id = id }));

    [HttpGet("[action]/{id}")]
    public async Task<IActionResult> GetGorevById(int id) =>
        Ok(await _mediator.Send(new GetGorevByIdRequest { Id = id }));

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAllGorevler(
        [FromQuery] GorevDurumu? durum,
        [FromQuery] OncelikSeviyesi? oncelik,
        [FromQuery] int? atananKullaniciId,
        [FromQuery] int? atananGrupId,
        [FromQuery] int? gorevTipiId,
        [FromQuery] DateTime? baslangicTarihi,
        [FromQuery] DateTime? bitisTarihi,
        [FromQuery] string? aramaMetni,
        [FromQuery] bool? sadeceGecikenler) =>
        Ok(await _mediator.Send(new GetAllGorevRequest
        {
            Durum = durum,
            Oncelik = oncelik,
            AtananKullaniciId = atananKullaniciId,
            AtananGrupId = atananGrupId,
            GorevTipiId = gorevTipiId,
            BaslangicTarihi = baslangicTarihi,
            BitisTarihi = bitisTarihi,
            AramaMetni = aramaMetni,
            SadeceGecikenler = sadeceGecikenler
        }));

    [HttpPost("[action]")]
    public async Task<IActionResult> GorevUzerineAl([FromBody] GorevUzerineAlRequest request) =>
        Ok(await _mediator.Send(request));
}
