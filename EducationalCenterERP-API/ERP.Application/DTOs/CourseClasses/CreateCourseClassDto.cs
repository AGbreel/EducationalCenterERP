using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.CourseClasses;

public class CreateCourseClassDto
{
    [Required]
    public Guid SubjectId { get; set; }

    [Required]
    public Guid TeacherId { get; set; }

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string Day { get; set; } = null!;

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    [Required]
    public string Hall { get; set; } = null!;

    [Range(1, 300)]
    public int MaxStudents { get; set; }
}