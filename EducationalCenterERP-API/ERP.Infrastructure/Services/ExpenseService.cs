using ERP.Application.DTOs.Expenses;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class ExpenseService : IExpenseService
{
    private readonly ERPDbContext _context;

    public ExpenseService(ERPDbContext context)
    {
        _context = context;
    }

    public async Task<ExpenseDto> CreateAsync(CreateExpenseDto dto)
    {
        var expense = new Expense
        {
            Id = Guid.NewGuid(),

            PayerName = dto.PayerName,
            Reason = dto.Reason,
            Category = dto.Category,
            Amount = dto.Amount,

            PaymentDate = dto.PaymentDate,
            EventDate = dto.EventDate,

            Notes = dto.Notes,

            CreatedAt = DateTime.UtcNow
        };

        _context.Expenses.Add(expense);

        await _context.SaveChangesAsync();

        return new ExpenseDto
        {
            Id = expense.Id,
            PayerName = expense.PayerName,
            Reason = expense.Reason,
            Category = expense.Category,
            Amount = expense.Amount,
            PaymentDate = expense.PaymentDate,
            EventDate = expense.EventDate,
            Notes = expense.Notes,
            CreatedAt = expense.CreatedAt
        };
    }

    public async Task<List<ExpenseDto>> GetAllAsync()
    {
        return await _context.Expenses
            .OrderByDescending(x => x.PaymentDate)
            .Select(x => new ExpenseDto
            {
                Id = x.Id,
                PayerName = x.PayerName,
                Reason = x.Reason,
                Category = x.Category,
                Amount = x.Amount,
                PaymentDate = x.PaymentDate,
                EventDate = x.EventDate,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
            return false;

        _context.Expenses.Remove(expense);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<decimal> GetTotalAsync()
    {
        return await _context.Expenses.SumAsync(x => x.Amount);
    }
}