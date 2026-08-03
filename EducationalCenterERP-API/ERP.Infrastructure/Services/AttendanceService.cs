using ERP.Application.DTOs.Attendance;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly ERPDbContext _context;

        public AttendanceService(ERPDbContext context)
        {
            _context = context;
        }

        public async Task<bool> MarkAttendanceAsync(CreateAttendanceDto dto)
        {
            // التأكد من وجود الطالب
            var studentExists = await _context.Students
                .AnyAsync(x => x.Id == dto.StudentId);

            if (!studentExists)
                return false;

            // التأكد من وجود الكلاس
            var classExists = await _context.CourseClasses
                .AnyAsync(x => x.Id == dto.CourseClassId);

            if (!classExists)
                return false;

            // التأكد أن الطالب مسجل في الكلاس
            var enrolled = await _context.StudentClasses
                .AnyAsync(x =>
                    x.StudentId == dto.StudentId &&
                    x.CourseClassId == dto.CourseClassId);

            if (!enrolled)
                return false;

            // منع تكرار الحضور في نفس اليوم
            var alreadyExists = await _context.Attendances
                .AnyAsync(x =>
                    x.StudentId == dto.StudentId &&
                    x.CourseClassId == dto.CourseClassId &&
                    x.AttendanceDate.Date == DateTime.Today);

            if (alreadyExists)
                return false;

            var attendance = new Attendance
            {
                Id = Guid.NewGuid(),
                StudentId = dto.StudentId,
                CourseClassId = dto.CourseClassId,
                AttendanceDate = DateTime.Now,
                Status = "Present"
            };

            _context.Attendances.Add(attendance);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<AttendanceDto>> GetStudentAttendanceAsync(Guid studentId)
        {
            return await _context.Attendances
                .AsNoTracking()
                .Where(x => x.StudentId == studentId)
                .OrderByDescending(x => x.AttendanceDate)
                .Select(x => new AttendanceDto
                {
                    Id = x.Id,
                    StudentId = x.StudentId,
                    StudentName = x.Student.FullName,
                    CourseClassId = x.CourseClassId,
                    AttendanceDate = x.AttendanceDate,
                    Status = x.Status
                })
                .ToListAsync();
        }

        public async Task<List<AttendanceDto>> GetClassAttendanceAsync(Guid classId)
        {
            return await _context.Attendances
                .AsNoTracking()
                .Where(x => x.CourseClassId == classId)
                .OrderByDescending(x => x.AttendanceDate)
                .Select(x => new AttendanceDto
                {
                    Id = x.Id,
                    StudentId = x.StudentId,
                    StudentName = x.Student.FullName,
                    CourseClassId = x.CourseClassId,
                    AttendanceDate = x.AttendanceDate,
                    Status = x.Status
                })
                .ToListAsync();
        }
    }
}