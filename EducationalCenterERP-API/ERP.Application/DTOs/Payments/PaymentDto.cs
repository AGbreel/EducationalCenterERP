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

        public Guid StudentId { get; set; }

        public string StudentName { get; set; } = string.Empty;

        public Guid StudentClassId { get; set; }

        public string ClassName { get; set; } = string.Empty;

        public Guid CourseClassId { get; set; }

        public string SubjectName { get; set; } = string.Empty;

        public string TeacherName { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public string PaymentType { get; set; } = string.Empty;

        public int? SessionsCount { get; set; }

        public string PaymentMethod { get; set; } = string.Empty;

        public string? Notes { get; set; }

        public DateTime PaymentDate { get; set; }
    }
}
