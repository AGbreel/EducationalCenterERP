using ERP.Domain.Common;
namespace ERP.Domain.Entities;
public class Teacher : BaseEntity
{
    public string FullName { get; set; } = null!;
    public string Phone { get; set; }
    public string? Email { get; set; }
    public decimal Salary { get; set; }
    public ICollection<CourseClass> Classes { get; set; } = new List<CourseClass>();
}