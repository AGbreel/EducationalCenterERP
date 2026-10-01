using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.DTOs.Payments
{
    public class CreatePaymentDto
    {
        // الطالب
        public Guid StudentId { get; set; }

        // الاشتراك (StudentClass)
        public Guid StudentClassId { get; set; }

        // قيمة الدفع
        public decimal Amount { get; set; }

        // الشهر والسنة
        public int Month { get; set; }

        public int Year { get; set; }

        /// <summary>
        /// Monthly
        /// Session
        /// </summary>
        public string PaymentType { get; set; } = "Monthly";

        // يستخدم فقط عند الدفع بالحصة
        public int? SessionsCount { get; set; }

        public string PaymentMethod { get; set; } = "Cash";

        public string? Notes { get; set; }
    }
}
