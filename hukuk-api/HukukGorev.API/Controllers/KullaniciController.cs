using HukukGorev.Application.DTOs;
using HukukGorev.Application.Features.Auth.Commands;
using HukukGorev.Application.Features.GenericCrud;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HukukGorev.API.Controllers;

public class KullaniciController : BaseController
{
    private readonly IMediator _mediator;
    public KullaniciController(IMediator mediator) => _mediator = mediator;

    [HttpPost("[action]")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request) =>
        Ok(await _mediator.Send(request));

    [HttpPost("[action]")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request) =>
        Ok(await _mediator.Send(request));

    [HttpGet("[action]")]
    [Authorize]
    public async Task<IActionResult> GetAllKullanicilar() =>
        Ok(await _mediator.Send(new GetAllKullaniciRequest()));
}
