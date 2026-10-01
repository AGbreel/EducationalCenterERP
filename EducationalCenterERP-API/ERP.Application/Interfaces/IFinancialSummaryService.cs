using ERP.Application.DTOs.Financial;

namespace ERP.Application.Interfaces
{
    public interface IFinancialSummaryService
    {
        Task<FinancialSummaryDto> GetSummaryAsync();
    }
}