using ERP.Domain.Common;

namespace ERP.Domain.Entities;
public class Student : BaseEntity
{
    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? ParentPhone { get; set; }
    public string? Address { get; set; }
    public string? School { get; set; }
    public string? Grade { get; set; }
    public string QRValue { get; set; } = null!;
    public string QRImagePath { get; set; } = null!;
    public ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}