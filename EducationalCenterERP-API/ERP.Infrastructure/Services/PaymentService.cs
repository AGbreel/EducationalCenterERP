using ERP.Application.DTOs.Payments;
using ERP.Application.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ERPDbContext _context;

        public PaymentService(ERPDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentDto> CreateAsync(CreatePaymentDto dto)
        {
            // التأكد من وجود الطالب
            var student = await _context.Students
                .FirstOrDefaultAsync(x => x.Id == dto.StudentId);

            if (student == null)
                throw new Exception("Student not found.");

            // التأكد من وجود الاشتراك
            var studentClass = await _context.StudentClasses
                .Include(x => x.CourseClass)
                    .ThenInclude(x => x.Subject)
                .Include(x => x.CourseClass)
                    .ThenInclude(x => x.Teacher)
                .FirstOrDefaultAsync(x => x.Id == dto.StudentClassId);

            if (studentClass == null)
                throw new Exception("Student class not found.");

            // التأكد أن الاشتراك يخص الطالب
            if (studentClass.StudentId != dto.StudentId)
                throw new Exception("Invalid student class.");
            // في حالة الاشتراك الشهري امنع تكرار الدفع لنفس الشهر
            if (dto.PaymentType.Equals("Monthly", StringComparison.OrdinalIgnoreCase))
            {
                var alreadyPaid = await _context.Payments.AnyAsync(x =>
                    x.StudentClassId == dto.StudentClassId &&
                    x.Month == dto.Month &&
                    x.Year == dto.Year &&
                    x.PaymentType == "Monthly");

                if (alreadyPaid)
                    throw new Exception("This month has already been paid.");
            }

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                StudentId = dto.StudentId,
                StudentClassId = dto.StudentClassId,
                Amount = dto.Amount,
                Month = dto.Month,
                Year = dto.Year,
                PaymentType = dto.PaymentType,
                SessionsCount = dto.SessionsCount,
                PaymentMethod = dto.PaymentMethod,
                Notes = dto.Notes,
                PaymentDate = DateTime.Now
            };

            _context.Payments.Add(payment);

            await _context.SaveChangesAsync();
            return new PaymentDto
            {
                Id = payment.Id,

                StudentId = payment.StudentId,
                StudentName = student.FullName,

                StudentClassId = studentClass.Id,

                CourseClassId = studentClass.CourseClassId,

                ClassName = studentClass.CourseClass.Name,

                SubjectName = studentClass.CourseClass.Subject.Name,

                TeacherName = studentClass.CourseClass.Teacher.FullName,

                Amount = payment.Amount,

                Month = payment.Month,

                Year = payment.Year,

                PaymentType = payment.PaymentType,

                SessionsCount = payment.SessionsCount,

                PaymentMethod = payment.PaymentMethod,

                Notes = payment.Notes,

                PaymentDate = payment.PaymentDate
            };
        }
        public async Task<List<PaymentDto>> GetAllAsync()
        {
            return await _context.Payments
                .AsNoTracking()
                .Include(x => x.Student)
                .Include(x => x.StudentClass)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Subject)
                .Include(x => x.StudentClass)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Teacher)
                .OrderByDescending(x => x.PaymentDate)
                .Select(x => new PaymentDto
                {
                    Id = x.Id,

                    StudentId = x.StudentId,
                    StudentName = x.Student.FullName,

                    StudentClassId = x.StudentClassId,

                    CourseClassId = x.StudentClass.CourseClassId,

                    ClassName = x.StudentClass.CourseClass.Name,

                    SubjectName = x.StudentClass.CourseClass.Subject.Name,

                    TeacherName = x.StudentClass.CourseClass.Teacher.FullName,

                    Amount = x.Amount,

                    Month = x.Month,

                    Year = x.Year,

                    PaymentType = x.PaymentType,

                    SessionsCount = x.SessionsCount,

                    PaymentMethod = x.PaymentMethod,

                    Notes = x.Notes,

                    PaymentDate = x.PaymentDate
                })
                .ToListAsync();
        }
        public async Task<List<PaymentDto>> GetStudentPaymentsAsync(Guid studentId)
        {
            return await _context.Payments
                .AsNoTracking()
                .Where(x => x.StudentId == studentId)
                .Include(x => x.Student)
                .Include(x => x.StudentClass)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Subject)
                .Include(x => x.StudentClass)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Teacher)
                .OrderByDescending(x => x.PaymentDate)
                .Select(x => new PaymentDto
                {
                    Id = x.Id,

                    StudentId = x.StudentId,
                    StudentName = x.Student.FullName,

                    StudentClassId = x.StudentClassId,

                    CourseClassId = x.StudentClass.CourseClassId,

                    ClassName = x.StudentClass.CourseClass.Name,

                    SubjectName = x.StudentClass.CourseClass.Subject.Name,

                    TeacherName = x.StudentClass.CourseClass.Teacher.FullName,

                    Amount = x.Amount,

                    Month = x.Month,

                    Year = x.Year,

                    PaymentType = x.PaymentType,

                    SessionsCount = x.SessionsCount,

                    PaymentMethod = x.PaymentMethod,

                    Notes = x.Notes,

                    PaymentDate = x.PaymentDate
                })
                .ToListAsync();
        }


        public async Task<List<PaymentDto>> GetStudentClassPaymentsAsync(Guid studentClassId)
        {
            return await _context.Payments
                .AsNoTracking()
                .Where(x => x.StudentClassId == studentClassId)
                .Include(x => x.Student)
                .Include(x => x.StudentClass)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Subject)
                .Include(x => x.StudentClass)
                    .ThenInclude(x => x.CourseClass)
                        .ThenInclude(x => x.Teacher)
                .OrderByDescending(x => x.PaymentDate)
                .Select(x => new PaymentDto
                {
                    Id = x.Id,

                    StudentId = x.StudentId,
                    StudentName = x.Student.FullName,

                    StudentClassId = x.StudentClassId,

                    CourseClassId = x.StudentClass.CourseClassId,

                    ClassName = x.StudentClass.CourseClass.Name,

                    SubjectName = x.StudentClass.CourseClass.Subject.Name,

                    TeacherName = x.StudentClass.CourseClass.Teacher.FullName,

                    Amount = x.Amount,

                    Month = x.Month,

                    Year = x.Year,

                    PaymentType = x.PaymentType,

                    SessionsCount = x.SessionsCount,

                    PaymentMethod = x.PaymentMethod,

                    Notes = x.Notes,

                    PaymentDate = x.PaymentDate
                })
                .ToListAsync();
        }


        public async Task<decimal> GetIncomeAsync()
        {
            return await _context.Payments
                .SumAsync(x => x.Amount);
        }


        public async Task<bool> DeleteAsync(Guid id)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(x => x.Id == id);

            if (payment == null)
                return false;

            _context.Payments.Remove(payment);

            await _context.SaveChangesAsync();

            return true;
        }
    }
 }
