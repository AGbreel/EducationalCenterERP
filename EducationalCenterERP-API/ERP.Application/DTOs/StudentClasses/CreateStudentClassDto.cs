using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.StudentClasses;

public class CreateStudentClassDto
{
    [Required]
    public Guid StudentId { get; set; }

    [Required]
    public Guid CourseClassId { get; set; }

    [Range(0, 100000)]
    public decimal MonthlyFee { get; set; }
}