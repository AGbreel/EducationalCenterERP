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
        // إنشاء عملية دفع
        Task<PaymentDto> CreateAsync(CreatePaymentDto dto);

        // جميع المدفوعات
        Task<List<PaymentDto>> GetAllAsync();

        // مدفوعات طالب
        Task<List<PaymentDto>> GetStudentPaymentsAsync(Guid studentId);

        // مدفوعات اشتراك معين
        Task<List<PaymentDto>> GetStudentClassPaymentsAsync(Guid studentClassId);

        // إجمالي الإيرادات
        Task<decimal> GetIncomeAsync();

        // حذف عملية دفع
        Task<bool> DeleteAsync(Guid id);
    }
}
