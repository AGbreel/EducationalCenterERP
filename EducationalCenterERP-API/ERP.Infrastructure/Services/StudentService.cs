using ERP.Application.DTOs.Attendance;
using ERP.Application.DTOs.Students;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using QRCoder;

namespace ERP.Infrastructure.Services
{
    public class StudentService : IStudentService
    {
        private readonly ERPDbContext _context;
        private readonly IQrCodeService _qrCodeService;

        public StudentService(
            ERPDbContext context,
            IQrCodeService qrCodeService)
        {
            _context = context;
            _qrCodeService = qrCodeService;
        }

        private string GenerateStudentCode()
        {
            return $"ST-{DateTime.UtcNow:yyyyMMddHHmmssfff}-{Random.Shared.Next(100, 999)}";
        }

        public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
        {
            // كود الطالب
            var studentCode = GenerateStudentCode();
            // القيمة التي سيتم تشفيرها داخل QR
            var qrValue = Guid.NewGuid().ToString("N");
            // إنشاء صورة QR (سنستخدمها لاحقًا)
            var qrImagePath = await _qrCodeService.SaveAsync(qrValue, $"{studentCode}.png");

            var student = new Student
            {
                Id = Guid.NewGuid(),
                StudentCode = studentCode,
                FullName = dto.FullName,
                Phone = dto.Phone,
                ParentPhone = dto.ParentPhone,
                Address = dto.Address,
                School = dto.School,
                Grade = dto.Grade,
                QRValue = qrValue,
                QRImagePath = qrImagePath
            };
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync();

            return Map(student);
        }

        public async Task<StudentDto?> GetByIdAsync(Guid id)
        {
            var student = await _context.Students.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            return student == null ? null : Map(student);
        }

        public async Task<List<StudentDto>> GetAllAsync()
        {
            return await _context.Students.AsNoTracking().OrderBy(x => x.FullName).Select(x => new StudentDto
            {
                Id = x.Id,
                StudentCode = x.StudentCode,
                FullName = x.FullName,
                Phone = x.Phone,
                ParentPhone = x.ParentPhone,
                Address = x.Address,
                School = x.School,
                Grade = x.Grade,
                QRValue = x.QRValue,
                QRImagePath = x.QRImagePath,
                CreatedAt = x.CreatedAt
            })
     .ToListAsync();
        }

        public async Task<StudentDto?> GetByQRAsync(string qrCode)
        {
            var student = await _context.Students.AsNoTracking().FirstOrDefaultAsync(x => x.QRValue == qrCode);
            return student == null ? null : Map(student);
        }

        private static StudentDto Map(Student student)
        {
            return new StudentDto
            {
                Id = student.Id,
                StudentCode = student.StudentCode,
                FullName = student.FullName,
                Phone = student.Phone,
                ParentPhone = student.ParentPhone,
                Address = student.Address,
                School = student.School,
                Grade = student.Grade,
                QRValue = student.QRValue,
                QRImagePath = student.QRImagePath,
                CreatedAt = student.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                return false;

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<StudentDto?> GetByCodeAsync(string sCode)
        {
            var student = await _context.Students.AsNoTracking().FirstOrDefaultAsync(x => x.StudentCode == sCode);
            return student == null ? null : Map(student);
        }

        public async Task<StudentClassesLookupDto?> GetStudentClassesByCodeAsync(string code)
        {
            var student = await _context.Students
                .AsNoTracking()
                .Include(x => x.StudentClasses)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Subject)
                .Include(x => x.StudentClasses)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Teacher)
                .FirstOrDefaultAsync(x => x.StudentCode == code);

            if (student == null)
                return null;

            return new StudentClassesLookupDto
            {
                StudentId = student.Id,
                StudentName = student.FullName,
                StudentCode = student.StudentCode,

                Classes = student.StudentClasses
                    .Where(x => x.IsActive)
                    .Select(x => new StudentClassLookupDto
                    {
                        CourseClassId = x.CourseClassId,
                        ClassName = x.CourseClass.Name,
                        Subject = x.CourseClass.Subject.Name,
                        Teacher = x.CourseClass.Teacher.FullName
                    })
                    .ToList()
            };
        }

        public async Task<StudentClassesLookupDto?> GetStudentClassesByQrAsync(string qr)
        {
            var student = await _context.Students
                .AsNoTracking()
                .Include(x => x.StudentClasses)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Subject)
                .Include(x => x.StudentClasses)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Teacher)
                .FirstOrDefaultAsync(x => x.QRValue == qr);

            if (student == null)
                return null;

            return new StudentClassesLookupDto
            {
                StudentId = student.Id,
                StudentName = student.FullName,
                StudentCode = student.StudentCode,

                Classes = student.StudentClasses
                    .Where(x => x.IsActive)
                    .Select(x => new StudentClassLookupDto
                    {
                        CourseClassId = x.CourseClassId,
                        ClassName = x.CourseClass.Name,
                        Subject = x.CourseClass.Subject.Name,
                        Teacher = x.CourseClass.Teacher.FullName
                    })
                    .ToList()
            };
        }
    }
}