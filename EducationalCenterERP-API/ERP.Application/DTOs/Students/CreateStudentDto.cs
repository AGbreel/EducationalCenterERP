using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.DTOs.Students
{
    public class CreateStudentDto
    {
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }

        [Phone]
        public string? ParentPhone { get; set; }

        [MaxLength(250)]
        public string? Address { get; set; }

        [MaxLength(150)]
        public string? School { get; set; }

        [MaxLength(100)]
        public string? Grade { get; set; }
    }
}
