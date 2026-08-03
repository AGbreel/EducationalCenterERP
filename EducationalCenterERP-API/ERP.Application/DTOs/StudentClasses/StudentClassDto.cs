namespace ERP.Application.DTOs.StudentClasses;

public class StudentClassDto
{
    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public string StudentName { get; set; } = null!;

    public Guid CourseClassId { get; set; }

    public string ClassName { get; set; } = null!;

    public decimal MonthlyFee { get; set; }

    public DateTime EnrollmentDate { get; set; }

    public bool IsActive { get; set; }
}