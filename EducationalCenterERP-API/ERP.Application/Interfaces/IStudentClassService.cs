using ERP.Application.DTOs.StudentClasses;

namespace ERP.Application.Interfaces;

public interface IStudentClassService
{
    Task<List<StudentClassDto>> GetAllAsync();

    Task<List<StudentClassDto>> GetStudentClasses(Guid studentId);

    Task<StudentClassDto> CreateAsync(CreateStudentClassDto dto);

    Task DeleteAsync(Guid id);
}