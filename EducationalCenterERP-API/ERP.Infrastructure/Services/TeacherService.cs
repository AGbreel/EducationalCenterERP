using ERP.Application.DTOs.Teachers;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Services;

public class TeacherService : ITeacherService
{
    private readonly ERPDbContext _context;

    public TeacherService(ERPDbContext context)
    {
        _context = context;
    }

    public async Task<List<TeacherDto>> GetAllAsync()
    {
        return await _context.Teachers
            .AsNoTracking()
            .OrderBy(x => x.FullName)
            .Select(x => new TeacherDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Phone = x.Phone,
                Email = x.Email,
                Salary = x.Salary
            })
            .ToListAsync();
    }

    public async Task<TeacherDto?> GetByIdAsync(Guid id)
    {
        return await _context.Teachers
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new TeacherDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Phone = x.Phone,
                Email = x.Email,
                Salary = x.Salary
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TeacherDto> CreateAsync(CreateTeacherDto dto)
    {
        var exists = await _context.Teachers
            .AnyAsync(x => x.Phone == dto.Phone);

        if (exists)
            throw new Exception("Teacher phone already exists.");

        var teacher = new Teacher
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            Phone = dto.Phone,
            Email = dto.Email,
            Salary = dto.Salary
        };

        _context.Teachers.Add(teacher);

        await _context.SaveChangesAsync();

        return new TeacherDto
        {
            Id = teacher.Id,
            FullName = teacher.FullName,
            Phone = teacher.Phone,
            Email = teacher.Email,
            Salary = teacher.Salary
        };
    }

    public async Task<TeacherDto> UpdateAsync(Guid id, CreateTeacherDto dto)
    {
        var teacher = await _context.Teachers.FindAsync(id);

        if (teacher == null)
            throw new Exception("Teacher not found.");

        var exists = await _context.Teachers.AnyAsync(x =>
            x.Phone == dto.Phone &&
            x.Id != id);

        if (exists)
            throw new Exception("Teacher phone already exists.");

        teacher.FullName = dto.FullName;
        teacher.Phone = dto.Phone;
        teacher.Email = dto.Email;
        teacher.Salary = dto.Salary;

        await _context.SaveChangesAsync();

        return new TeacherDto
        {
            Id = teacher.Id,
            FullName = teacher.FullName,
            Phone = teacher.Phone,
            Email = teacher.Email,
            Salary = teacher.Salary
        };
    }

    public async Task DeleteAsync(Guid id)
    {
        var teacher = await _context.Teachers.FindAsync(id);

        if (teacher == null)
            throw new Exception("Teacher not found.");

        _context.Teachers.Remove(teacher);

        await _context.SaveChangesAsync();
    }
}