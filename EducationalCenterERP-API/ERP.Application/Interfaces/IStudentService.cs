using ERP.Application.DTOs.Students;

namespace ERP.Application.Interfaces
{
    public interface IStudentService
    {
        Task<StudentDto> CreateAsync(CreateStudentDto dto);
        Task<StudentDto?> GetByIdAsync(Guid id);
        Task<List<StudentDto>> GetAllAsync();
        Task<StudentDto?> GetByQRAsync(string qrCode);
        Task<bool> DeleteAsync(Guid id);
        Task<StudentDto?> GetByCodeAsync(string sCode);
    }
}