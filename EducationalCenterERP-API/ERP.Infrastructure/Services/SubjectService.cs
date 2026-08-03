using ERP.Application.DTOs.Subjects;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly ERPDbContext _context;

        public SubjectService(ERPDbContext context)
        {
            _context = context;
        }

        public async Task<List<SubjectDto>> GetAllAsync()
        {
            return await _context.Subjects
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(x => new SubjectDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                })
                .ToListAsync();
        }

        public async Task<SubjectDto?> GetByIdAsync(Guid id)
        {
            return await _context.Subjects
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new SubjectDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                })
                .FirstOrDefaultAsync();
        }

        public async Task<SubjectDto> CreateAsync(CreateSubjectDto dto)
        {
            var exists = await _context.Subjects
                .AnyAsync(x => x.Name == dto.Name);

            if (exists)
                throw new Exception("Subject already exists.");

            var subject = new Subject
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Subjects.Add(subject);

            await _context.SaveChangesAsync();

            return new SubjectDto
            {
                Id = subject.Id,
                Name = subject.Name,
                Description = subject.Description
            };
        }

        public async Task<SubjectDto> UpdateAsync(Guid id, CreateSubjectDto dto)
        {
            var subject = await _context.Subjects.FindAsync(id);

            if (subject == null)
                throw new Exception("Subject not found.");

            var exists = await _context.Subjects.AnyAsync(x =>
                x.Name == dto.Name && x.Id != id);

            if (exists)
                throw new Exception("Another subject with the same name already exists.");

            subject.Name = dto.Name;
            subject.Description = dto.Description;

            await _context.SaveChangesAsync();

            return new SubjectDto
            {
                Id = subject.Id,
                Name = subject.Name,
                Description = subject.Description
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var subject = await _context.Subjects.FindAsync(id);

            if (subject == null)
                throw new Exception("Subject not found.");

            _context.Subjects.Remove(subject);

            await _context.SaveChangesAsync();
        }
    }
}