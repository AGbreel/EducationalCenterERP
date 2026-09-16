using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ERP.Infrastructure.Identity;
using ERP.Domain.Entities;

namespace ERP.Infrastructure.Persistence;

public class ERPDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ERPDbContext(DbContextOptions<ERPDbContext> options)
        : base(options)
    {
    }

    public DbSet<Student> Students { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<CourseClass> CourseClasses { get; set; }
    public DbSet<StudentClass> StudentClasses { get; set; }
    public DbSet<Attendance> Attendances { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Expense> Expenses { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // =========================
        // Unique Indexes
        // =========================

        builder.Entity<Student>()
            .HasIndex(x => x.StudentCode)
            .IsUnique();

        builder.Entity<Student>()
            .HasIndex(x => x.QRValue)
            .IsUnique();

        builder.Entity<Attendance>()
            .HasIndex(x => new
            {
                x.StudentId,
                x.CourseClassId,
                x.AttendanceDate
            })
            .IsUnique();

        // =========================
        // Decimal Precision
        // =========================

        builder.Entity<Payment>()
            .Property(x => x.Amount)
            .HasPrecision(18, 2);

        builder.Entity<StudentClass>()
            .Property(x => x.MonthlyFee)
            .HasPrecision(18, 2);

        builder.Entity<Teacher>()
            .Property(x => x.Salary)
            .HasPrecision(18, 2);

        builder.Entity<Expense>()
            .Property(e => e.Amount)
            .HasPrecision(18, 2);
        // =========================
        // Relationships
        // =========================

        builder.Entity<Payment>()
            .HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Payment>()
            .HasOne(x => x.StudentClass)
            .WithMany(x => x.Payments)
            .HasForeignKey(x => x.StudentClassId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}