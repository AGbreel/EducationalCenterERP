using ERP.Application.DTOs.Payments;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {

        private readonly ERPDbContext _context;

        public PaymentService(ERPDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentDto> CreateAsync(CreatePaymentDto dto)
        {
            var student = await _context.Students.FirstOrDefaultAsync(x => x.Id == dto.StudentId);
            if (student == null)
                throw new Exception("Student not found");

            var exists = await _context.Payments.AnyAsync(x => x.StudentClassId == dto.StudentClassId && x.Month == dto.Month && x.Year == dto.Year);
            if (exists)
                throw new Exception("Student already paid this month");

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                StudentId = dto.StudentId,
                StudentClassId = dto.StudentClassId,
                Month = dto.Month,
                Year = dto.Year,
                Amount = dto.Amount,
                Status = "Paid",
                PaymentMethod = dto.PaymentMethod,
                Notes = dto.Notes,
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return new PaymentDto
            {
                Id = payment.Id,
                StudentName = student.FullName,
                Month = payment.Month,
                Year = payment.Year,
                Amount = payment.Amount,
                Status = payment.Status,
                PaymentDate = payment.PaymentDate,
                PaymentMethod = payment.PaymentMethod,
                Notes = payment.Notes
            };
        }

        public async Task<PaymentDto?> GetCurrentMonthPayment(Guid studentId)
        {
            var month = DateTime.Now.Month;
            var year = DateTime.Now.Year;

            return await _context.Payments
                .Where(x =>
                    x.StudentId == studentId &&
                    x.Month == month &&
                    x.Year == year)
                .Select(x => new PaymentDto
                {
                    Id = x.Id,
                    StudentName = x.Student.FullName,
                    Month = x.Month,
                    Year = x.Year,
                    Amount = x.Amount,
                    Status = x.Status,
                    PaymentDate = x.PaymentDate,
                    PaymentMethod = x.PaymentMethod,
                    Notes = x.Notes
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<PaymentDto>> GetStudentPayments(Guid studentId)
        {
            return await _context.Payments.Where(x => x.StudentId == studentId).OrderByDescending(x => x.PaymentDate)
        .Select(x => new PaymentDto
        {
            Id = x.Id,
            StudentName = x.Student.FullName,
            Month = x.Month,
            Year = x.Year,
            Amount = x.Amount,
            Status = x.Status,
            PaymentDate = x.PaymentDate,
            PaymentMethod = x.PaymentMethod,
            Notes = x.Notes
        })
        .ToListAsync();
        }

        public async Task<List<PaymentDto>> GetAllPayments()
        {
            return await _context.Payments
        .Include(x => x.Student)
        .OrderByDescending(x => x.PaymentDate)
        .Select(x => new PaymentDto
         {
            Id = x.Id,
            StudentName = x.Student.FullName,
            Month = x.Month,
            Year = x.Year,
            Amount = x.Amount,
            Status = x.Status,
            PaymentDate = x.PaymentDate,
            PaymentMethod = x.PaymentMethod,
            Notes = x.Notes
        })
        .ToListAsync();
        }

        public async Task<decimal> GetMonthlyIncome(int month, int year)
        {
            return await _context.Payments
        .Where(x =>
            x.Month == month &&
            x.Year == year &&
            x.Status == "Paid")
        .SumAsync(x => x.Amount);
        }

        public async Task Delete(Guid id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
                throw new Exception("Payment not found");

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
        }
    }
}
