using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.DTOs.Attendance
{
    public class CreateAttendanceDto
    {
        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid CourseClassId { get; set; }
    }
}
