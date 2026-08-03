using ERP.Application.DTOs.StudentClasses;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Services;

public class StudentClassService : IStudentClassService
{
    private readonly ERPDbContext _context;

    public StudentClassService(ERPDbContext context)
    {
        _context = context;
    }

    public async Task<List<StudentClassDto>> GetAllAsync()
    {
        return await _context.StudentClasses
            .AsNoTracking()
            .Include(x => x.Student)
            .Include(x => x.CourseClass)
            .OrderByDescending(x => x.EnrollmentDate)
            .Select(x => new StudentClassDto
            {
                Id = x.Id,
                StudentId = x.StudentId,
                StudentName = x.Student.FullName,
                CourseClassId = x.CourseClassId,
                ClassName = x.CourseClass.Name,
                MonthlyFee = x.MonthlyFee,
                EnrollmentDate = x.EnrollmentDate,
                IsActive = x.IsActive
            })
            .ToListAsync();
    }

    public async Task<List<StudentClassDto>> GetStudentClasses(Guid studentId)
    {
        return await _context.StudentClasses
            .AsNoTracking()
            .Include(x => x.CourseClass)
            .Include(x => x.Student)
            .Where(x => x.StudentId == studentId && x.IsActive)
            .Select(x => new StudentClassDto
            {
                Id = x.Id,
                StudentId = x.StudentId,
                StudentName = x.Student.FullName,
                CourseClassId = x.CourseClassId,
                ClassName = x.CourseClass.Name,
                MonthlyFee = x.MonthlyFee,
                EnrollmentDate = x.EnrollmentDate,
                IsActive = x.IsActive
            })
            .ToListAsync();
    }

    public async Task<StudentClassDto> CreateAsync(CreateStudentClassDto dto)
    {
        var student = await _context.Students.FindAsync(dto.StudentId);

        if (student == null)
            throw new Exception("Student not found.");

        var courseClass = await _context.CourseClasses
            .Include(x => x.Students)
            .FirstOrDefaultAsync(x => x.Id == dto.CourseClassId);

        if (courseClass == null)
            throw new Exception("Class not found.");

        var exists = await _context.StudentClasses.AnyAsync(x =>
            x.StudentId == dto.StudentId &&
            x.CourseClassId == dto.CourseClassId &&
            x.IsActive);

        if (exists)
            throw new Exception("Student already enrolled in this class.");

        if (courseClass.Students.Count >= courseClass.MaxStudents)
            throw new Exception("Class is full.");

        var studentClass = new StudentClass
        {
            Id = Guid.NewGuid(),
            StudentId = dto.StudentId,
            CourseClassId = dto.CourseClassId,
            MonthlyFee = dto.MonthlyFee,
            EnrollmentDate = DateTime.UtcNow,
            IsActive = true
        };

        _context.StudentClasses.Add(studentClass);

        await _context.SaveChangesAsync();

        return new StudentClassDto
        {
            Id = studentClass.Id,
            StudentId = student.Id,
            StudentName = student.FullName,
            CourseClassId = courseClass.Id,
            ClassName = courseClass.Name,
            MonthlyFee = studentClass.MonthlyFee,
            EnrollmentDate = studentClass.EnrollmentDate,
            IsActive = studentClass.IsActive
        };
    }

    public async Task DeleteAsync(Guid id)
    {
        var studentClass = await _context.StudentClasses.FindAsync(id);

        if (studentClass == null)
            throw new Exception("Enrollment not found.");

        _context.StudentClasses.Remove(studentClass);

        await _context.SaveChangesAsync();
    }
}