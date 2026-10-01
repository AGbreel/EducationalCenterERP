using ERP.Application.DTOs.Teachers;

namespace ERP.Application.Interfaces;

public interface ITeacherService
{
    Task<List<TeacherDto>> GetAllAsync();

    Task<TeacherDto?> GetByIdAsync(Guid id);

    Task<TeacherDto> CreateAsync(CreateTeacherDto dto);

    Task<TeacherDto> UpdateAsync(Guid id, CreateTeacherDto dto);

    Task DeleteAsync(Guid id);
}