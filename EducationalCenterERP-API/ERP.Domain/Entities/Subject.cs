using ERP.Domain.Common;

namespace ERP.Domain.Entities;
public class Subject : BaseEntity
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public ICollection<CourseClass> Classes { get; set; } = new List<CourseClass>();
}