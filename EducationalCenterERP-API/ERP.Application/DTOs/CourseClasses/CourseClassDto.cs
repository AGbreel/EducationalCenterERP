public class CourseClassDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public Guid SubjectId { get; set; }
    public string Subject { get; set; } = null!;

    public Guid TeacherId { get; set; }
    public string Teacher { get; set; } = null!;

    public string Day { get; set; } = null!;

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public string Hall { get; set; } = null!;

    public int MaxStudents { get; set; }

    public int CurrentStudents { get; set; }
}