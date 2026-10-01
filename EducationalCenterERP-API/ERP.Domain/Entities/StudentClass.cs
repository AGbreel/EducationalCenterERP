using ERP.Domain.Common;

namespace ERP.Domain.Entities;

public class StudentClass : BaseEntity
{
    public Guid StudentId { get; set; }

    public Student Student { get; set; } = null!;

    public Guid CourseClassId { get; set; }

    public CourseClass CourseClass { get; set; } = null!;

    public decimal MonthlyFee { get; set; }

    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}