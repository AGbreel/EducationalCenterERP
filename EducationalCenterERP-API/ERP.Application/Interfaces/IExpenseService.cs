using ERP.Application.DTOs.Expenses;

public interface IExpenseService
{
    Task<ExpenseDto> CreateAsync(CreateExpenseDto dto);

    Task<List<ExpenseDto>> GetAllAsync();

    Task<bool> DeleteAsync(Guid id);

    Task<decimal> GetTotalAsync();
}