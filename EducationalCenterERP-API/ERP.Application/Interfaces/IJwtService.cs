using ERP.Application.Models;

namespace ERP.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(JwtUser user);
    }
}
