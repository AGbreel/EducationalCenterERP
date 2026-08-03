using ERP.Application.Interfaces;
using ERP.Infrastructure.Persistence;
using ERP.Application.DTOs.QR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using QRCoder;

namespace ERP.Infrastructure.Services
{
    public class QrCodeService : IQrCodeService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ERPDbContext _context;

        public QrCodeService(IWebHostEnvironment environment, ERPDbContext context)
        {
            _environment = environment;
            _context = context;
        }

        public async Task<string> SaveAsync(string value, string fileName)
        {
            var folder = Path.Combine(_environment.WebRootPath, "qrcodes");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            using var generator = new QRCodeGenerator();
            using var data = generator.CreateQrCode(value, QRCodeGenerator.ECCLevel.Q);

            var pngQr = new PngByteQRCode(data);
            var bytes = pngQr.GetGraphic(20);

            var filePath = Path.Combine(folder, fileName);

            await File.WriteAllBytesAsync(filePath, bytes);

            return $"/qrcodes/{fileName}";
        }

        public async Task<QRStudentDto?> ScanAsync(string qrValue)
        {
            var month = DateTime.Now.Month;
            var year = DateTime.Now.Year;

            var student = await _context.Students
                .Include(x => x.StudentClasses)
                    .ThenInclude(sc => sc.CourseClass)
                        .ThenInclude(c => c.Subject)
                .Include(x => x.StudentClasses)
                    .ThenInclude(sc => sc.CourseClass)
                        .ThenInclude(c => c.Teacher)
                .FirstOrDefaultAsync(x => x.QRValue == qrValue);

            if (student == null)
                return null;

            var result = new QRStudentDto
            {
                StudentId = student.Id,
                StudentName = student.FullName,
                StudentCode = student.StudentCode,
                QRValue = student.QRValue
            };

            foreach (var item in student.StudentClasses.Where(x => x.IsActive))
            {
                var paid = await _context.Payments.AnyAsync(x =>
                    x.StudentClassId == item.Id &&
                    x.Month == month &&
                    x.Year == year &&
                    x.Status == "Paid");

                result.Classes.Add(new QRClassDto
                {
                    ClassId = item.CourseClassId,
                    ClassName = item.CourseClass.Name,
                    SubjectName = item.CourseClass.Subject.Name,
                    TeacherName = item.CourseClass.Teacher.FullName,
                    Day = item.CourseClass.Day,
                    StartTime = item.CourseClass.StartTime,
                    EndTime = item.CourseClass.EndTime,
                    MonthlyFee = item.MonthlyFee,
                    IsPaid = paid
                });
            }

            return result;
        }
    }
}