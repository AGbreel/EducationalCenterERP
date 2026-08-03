using ERP.Application.DTOs.Payments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentDto> CreateAsync(CreatePaymentDto dto);
        Task<PaymentDto?> GetCurrentMonthPayment(Guid studentId);
        Task<List<PaymentDto>> GetStudentPayments(Guid studentId);
        Task<List<PaymentDto>> GetAllPayments();
        Task<decimal> GetMonthlyIncome(int month, int year);
        Task Delete(Guid id);
    }
}
