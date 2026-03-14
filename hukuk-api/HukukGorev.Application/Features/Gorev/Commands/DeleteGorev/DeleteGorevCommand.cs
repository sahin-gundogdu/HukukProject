using MediatR;

namespace HukukGorev.Application.Features.Gorev.Commands.DeleteGorev;

public class DeleteGorevRequest : IRequest<DeleteGorevResponse>
{
    public int Id { get; set; }
}

public class DeleteGorevResponse
{
    public bool Basarili { get; set; }
    public string? Mesaj { get; set; }
}

public class DeleteGorevHandler : IRequestHandler<DeleteGorevRequest, DeleteGorevResponse>
{
    private readonly UnitOfWork.IUnitOfWork _unitOfWork;

    public DeleteGorevHandler(UnitOfWork.IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<DeleteGorevResponse> Handle(DeleteGorevRequest request, CancellationToken cancellationToken)
    {
        var gorev = await _unitOfWork.GorevReadRepository.GetByIdAsync(request.Id);
        if (gorev == null)
            throw new Exceptions.NotFoundException("Görev", request.Id);

        _unitOfWork.GorevWriteRepository.Remove(gorev);
        await _unitOfWork.SaveChangesAsync();

        return new DeleteGorevResponse { Basarili = true, Mesaj = "Görev başarıyla silindi." };
    }
}
