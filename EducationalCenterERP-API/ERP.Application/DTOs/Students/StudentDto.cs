using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.DTOs.Students
{
    public class StudentDto
    {
        public Guid Id { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? ParentPhone { get; set; }
        public string? Address { get; set; }
        public string? School { get; set; }
        public string? Grade { get; set; }
        public string QRValue { get; set; } = string.Empty;
        public string QRImagePath { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
