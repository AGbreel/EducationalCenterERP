using ERP.Application.DTOs.CourseClasses;

namespace ERP.Application.Interfaces;

public interface ICourseClassService
{
    Task<List<CourseClassDto>> GetAllAsync();

    Task<CourseClassDto?> GetByIdAsync(Guid id);

    Task<CourseClassDto> CreateAsync(CreateCourseClassDto dto);

    Task<CourseClassDto> UpdateAsync(Guid id, CreateCourseClassDto dto);

    Task DeleteAsync(Guid id);
}