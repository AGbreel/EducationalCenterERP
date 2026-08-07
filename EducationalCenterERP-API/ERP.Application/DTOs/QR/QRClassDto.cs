namespace ERP.Application.DTOs.QR;

public class QRClassDto
{
    public Guid ClassId { get; set; }

    public string ClassName { get; set; } = null!;

    public string SubjectName { get; set; } = null!;

    public string TeacherName { get; set; } = null!;

    public string Day { get; set; } = null!;

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public bool IsPaid { get; set; }

    public decimal MonthlyFee { get; set; }
    public Guid StudentClassId { get; set; }
}