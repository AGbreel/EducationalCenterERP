namespace ERP.Application.DTOs.Expenses
{
    public class ExpenseDto
    {
        public Guid Id { get; set; }

        public string PayerName { get; set; } = string.Empty;

        public string Reason { get; set; } = string.Empty;

        public string? Category { get; set; }

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; }

        public DateTime? EventDate { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}