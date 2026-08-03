using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Teachers;

public class CreateTeacherDto
{
    [Required]
    [StringLength(150)]
    public string FullName { get; set; } = null!;

    [Required]
    [Phone]
    [StringLength(20)]
    public string Phone { get; set; } = null!;

    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }

    [Range(0, 1000000)]
    public decimal Salary { get; set; }
}