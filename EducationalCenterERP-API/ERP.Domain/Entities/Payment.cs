using ERP.Domain.Common;

namespace ERP.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;

    // الجديد
    public Guid StudentClassId { get; set; }
    public StudentClass StudentClass { get; set; } = null!;

    public int Month { get; set; }

    public int Year { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = null!;

    public string PaymentMethod { get; set; } = "Cash";

    public string? Notes { get; set; }

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
}