using ERP.Application.DTOs.OtherPayments;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Services
{
    public class OtherPaymentService : IOtherPaymentService
    {
        private readonly ERPDbContext _context;

        public OtherPaymentService(ERPDbContext context)
        {
            _context = context;
        }

        public async Task<OtherPaymentDto> CreateAsync(
            CreateOtherPaymentDto dto)
        {
            var otherPayment = new OtherPayment
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

            _context.OtherPayments.Add(otherPayment);

            await _context.SaveChangesAsync();

            return new OtherPaymentDto
            {
                Id = otherPayment.Id,

                PayerName = otherPayment.PayerName,
                Reason = otherPayment.Reason,
                Category = otherPayment.Category,

                Amount = otherPayment.Amount,

                PaymentDate = otherPayment.PaymentDate,
                EventDate = otherPayment.EventDate,

                Notes = otherPayment.Notes,

                CreatedAt = otherPayment.CreatedAt
            };
        }

        public async Task<List<OtherPaymentDto>> GetAllAsync()
        {
            return await _context.OtherPayments
                .AsNoTracking()
                .OrderByDescending(x => x.PaymentDate)
                .Select(x => new OtherPaymentDto
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
            var otherPayment = await _context.OtherPayments
                .FirstOrDefaultAsync(x => x.Id == id);

            if (otherPayment == null)
                return false;

            _context.OtherPayments.Remove(otherPayment);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<decimal> GetTotalAsync()
        {
            return await _context.OtherPayments
                .SumAsync(x => x.Amount);
        }
    }
}