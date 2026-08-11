using ERP.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace ERP.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAdminAsync(IServiceProvider services)
    {
        var userManager =
            services.GetRequiredService<UserManager<ApplicationUser>>();

        var roleManager =
            services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        // إنشاء Role Admin إذا لم يكن موجود
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            var roleResult = await roleManager.CreateAsync(
                new IdentityRole<Guid>
                {
                    Name = "Admin"
                });

            if (!roleResult.Succeeded)
            {
                foreach (var error in roleResult.Errors)
                {
                    Console.WriteLine(
                        $"{error.Code} - {error.Description}");
                }

                return;
            }
        }

        // البحث عن المستخدم
        var admin = await userManager.FindByNameAsync("admin");

        if (admin == null)
        {
            var adminPassword =
                Environment.GetEnvironmentVariable("ADMIN_PASSWORD")
                ?? throw new InvalidOperationException(
                    "ADMIN_PASSWORD is not configured.");

            admin = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@erp.com",
                FullName = "System Administrator",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(
                admin,
                adminPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine(
                        $"{error.Code} - {error.Description}");
                }

                return;
            }
        }

        // التأكد أن المستخدم Admin
        if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            var roleResult =
                await userManager.AddToRoleAsync(admin, "Admin");

            if (!roleResult.Succeeded)
            {
                foreach (var error in roleResult.Errors)
                {
                    Console.WriteLine(
                        $"{error.Code} - {error.Description}");
                }
            }
        }
    }
}