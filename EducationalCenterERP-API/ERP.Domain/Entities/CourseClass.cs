using ERP.Domain.Common;

namespace ERP.Domain.Entities;

public class CourseClass : BaseEntity
{
    public Guid SubjectId { get; set; }

    public Subject Subject { get; set; } = null!;

    public Guid TeacherId { get; set; }

    public Teacher Teacher { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Day { get; set; } = null!;

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public string Hall { get; set; } = null!;

    public int MaxStudents { get; set; }
    public ICollection<StudentClass> Students { get; set; } = new List<StudentClass>();
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}