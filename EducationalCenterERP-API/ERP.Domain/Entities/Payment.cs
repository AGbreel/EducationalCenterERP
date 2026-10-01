using ERP.Domain.Common;

namespace ERP.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;

    // الاشتراك الذي تم الدفع له
    public Guid StudentClassId { get; set; }
    public StudentClass StudentClass { get; set; } = null!;

    public decimal Amount { get; set; }

    // الشهر والسنة الخاصة بالاشتراك
    public int Month { get; set; }

    public int Year { get; set; }

    /// <summary>
    /// Monthly
    /// Session
    /// </summary>
    public string PaymentType { get; set; } = "Monthly";

    // تستخدم فقط عند الدفع بالحصة
    public int? SessionsCount { get; set; }

    public string PaymentMethod { get; set; } = "Cash";

    public string? Notes { get; set; }

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
}