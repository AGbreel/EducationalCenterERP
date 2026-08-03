using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.DTOs.Teachers
{
    public class TeacherDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public string? Email { get; set; }

        public decimal Salary { get; set; }
    }
}
