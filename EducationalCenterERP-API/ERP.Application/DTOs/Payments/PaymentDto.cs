using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.DTOs.Payments
{
    public class PaymentDto
    {
        public Guid Id { get; set; }
        public string StudentName { get; set; } = null!;
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = null!;
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string? Notes { get; set; }
    }
}
