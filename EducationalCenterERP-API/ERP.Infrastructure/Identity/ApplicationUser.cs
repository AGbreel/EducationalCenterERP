using Microsoft.AspNetCore.Identity;

namespace ERP.Infrastructure.Identity;
public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = null!;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
}