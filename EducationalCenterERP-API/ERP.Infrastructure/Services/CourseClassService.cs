using ERP.Application.DTOs.CourseClasses;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Services;

public class CourseClassService : ICourseClassService
{
    private readonly ERPDbContext _context;

    public CourseClassService(ERPDbContext context)
    {
        _context = context;
    }

    public async Task<List<CourseClassDto>> GetAllAsync()
    {
        return await _context.CourseClasses
            .AsNoTracking()
            .Include(x => x.Subject)
            .Include(x => x.Teacher)
            .Include(x => x.Students)
            .OrderBy(x => x.Day)
            .ThenBy(x => x.StartTime)
            .Select(x => new CourseClassDto
            {
                Id = x.Id,
                Name = x.Name,
                Subject = x.Subject.Name,
                Teacher = x.Teacher.FullName,
                Day = x.Day,
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                Hall = x.Hall,
                MaxStudents = x.MaxStudents,
                CurrentStudents = x.Students.Count
            })
            .ToListAsync();
    }

    public async Task<CourseClassDto?> GetByIdAsync(Guid id)
    {
        return await _context.CourseClasses
            .AsNoTracking()
            .Include(x => x.Subject)
            .Include(x => x.Teacher)
            .Include(x => x.Students)
            .Where(x => x.Id == id)
            .Select(x => new CourseClassDto
            {
                Id = x.Id,
                Name = x.Name,
                Subject = x.Subject.Name,
                Teacher = x.Teacher.FullName,
                Day = x.Day,
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                Hall = x.Hall,
                MaxStudents = x.MaxStudents,
                CurrentStudents = x.Students.Count
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CourseClassDto> CreateAsync(CreateCourseClassDto dto)
    {
        var subject = await _context.Subjects.FindAsync(dto.SubjectId);

        if (subject == null)
            throw new Exception("Subject not found.");

        var teacher = await _context.Teachers.FindAsync(dto.TeacherId);

        if (teacher == null)
            throw new Exception("Teacher not found.");

        var exists = await _context.CourseClasses.AnyAsync(x =>
            x.TeacherId == dto.TeacherId &&
            x.Day == dto.Day &&
            x.StartTime == dto.StartTime);

        if (exists)
            throw new Exception("Teacher already has another class at this time.");

        var courseClass = new CourseClass
        {
            Id = Guid.NewGuid(),
            SubjectId = dto.SubjectId,
            TeacherId = dto.TeacherId,
            Name = dto.Name,
            Day = dto.Day,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Hall = dto.Hall,
            MaxStudents = dto.MaxStudents
        };

        _context.CourseClasses.Add(courseClass);

        await _context.SaveChangesAsync();

        return new CourseClassDto
        {
            Id = courseClass.Id,
            Name = courseClass.Name,
            Subject = subject.Name,
            Teacher = teacher.FullName,
            Day = courseClass.Day,
            StartTime = courseClass.StartTime,
            EndTime = courseClass.EndTime,
            Hall = courseClass.Hall,
            MaxStudents = courseClass.MaxStudents,
            CurrentStudents = 0
        };
    }

    public async Task<CourseClassDto> UpdateAsync(Guid id, CreateCourseClassDto dto)
    {
        var courseClass = await _context.CourseClasses.FindAsync(id);

        if (courseClass == null)
            throw new Exception("Class not found.");

        var exists = await _context.CourseClasses.AnyAsync(x =>
            x.TeacherId == dto.TeacherId &&
            x.Day == dto.Day &&
            x.StartTime == dto.StartTime &&
            x.Id != id);

        if (exists)
            throw new Exception("Teacher already has another class at this time.");

        courseClass.SubjectId = dto.SubjectId;
        courseClass.TeacherId = dto.TeacherId;
        courseClass.Name = dto.Name;
        courseClass.Day = dto.Day;
        courseClass.StartTime = dto.StartTime;
        courseClass.EndTime = dto.EndTime;
        courseClass.Hall = dto.Hall;
        courseClass.MaxStudents = dto.MaxStudents;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id)
               ?? throw new Exception("Class not found.");
    }

    public async Task DeleteAsync(Guid id)
    {
        var courseClass = await _context.CourseClasses.FindAsync(id);

        if (courseClass == null)
            throw new Exception("Class not found.");

        _context.CourseClasses.Remove(courseClass);

        await _context.SaveChangesAsync();
    }
}