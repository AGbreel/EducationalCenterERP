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
        public string QRValue { get; set; } = string.Empty;
        public string QRImagePath { get; set; } = string.Empty;
    }
}
