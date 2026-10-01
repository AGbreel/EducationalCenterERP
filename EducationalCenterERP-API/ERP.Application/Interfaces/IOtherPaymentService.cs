using ERP.Application.DTOs.OtherPayments;

namespace ERP.Application.Interfaces
{
    public interface IOtherPaymentService
    {
        Task<OtherPaymentDto> CreateAsync(CreateOtherPaymentDto dto);

        Task<List<OtherPaymentDto>> GetAllAsync();

        Task<bool> DeleteAsync(Guid id);

        Task<decimal> GetTotalAsync();
    }
}