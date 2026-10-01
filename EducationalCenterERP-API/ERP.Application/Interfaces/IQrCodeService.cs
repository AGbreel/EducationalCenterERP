using ERP.Application.DTOs.QR;

namespace ERP.Application.Interfaces
{
    public interface IQrCodeService
    {
        Task<string> SaveAsync(string value, string fileName);
        Task<QRStudentDto?> ScanAsync(string qrValue);
    }
}