using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Domain.Entities
{
    public class OtherPayment
    {
        public Guid Id { get; set; }

        // الشخص الذي قام بالدفع
        public string PayerName { get; set; } = string.Empty;

        // سبب المصروف
        public string Reason { get; set; } = string.Empty;

        // تصنيف المصروف
        public string? Category { get; set; }

        // المبلغ
        public decimal Amount { get; set; }

        // تاريخ دفع الفلوس
        public DateTime PaymentDate { get; set; }

        // تاريخ الحدث / الشيء الذي تم الدفع بسببه
        public DateTime? EventDate { get; set; }

        // ملاحظات
        public string? Notes { get; set; }

        // تاريخ تسجيل العملية في النظام
        public DateTime CreatedAt { get; set; }
    }
}
