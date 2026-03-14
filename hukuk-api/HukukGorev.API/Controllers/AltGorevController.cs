using HukukGorev.Application.Features.AltGorev.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HukukGorev.API.Controllers;

[Authorize]
public class AltGorevController : BaseController
{
    private readonly IMediator _mediator;
    public AltGorevController(IMediator mediator) => _mediator = mediator;

    [HttpPost("[action]")]
    public async Task<IActionResult> CreateAltGorev([FromBody] CreateAltGorevRequest request) =>
        Ok(await _mediator.Send(request));

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateAltGorev([FromBody] UpdateAltGorevRequest request) =>
        Ok(await _mediator.Send(request));

    [HttpDelete("[action]/{id}")]
    public async Task<IActionResult> DeleteAltGorev(int id) =>
        Ok(await _mediator.Send(new DeleteAltGorevRequest { Id = id }));
}
