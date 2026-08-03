namespace ERP.Application.DTOs.QR;

public class QRStudentDto
{
    public Guid StudentId { get; set; }

    public string StudentName { get; set; } = null!;

    public string StudentCode { get; set; } = null!;

    public string QRValue { get; set; } = null!;

    public List<QRClassDto> Classes { get; set; } = new();
}