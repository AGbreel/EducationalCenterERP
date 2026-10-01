using System;
using System.Collections.Generic;
using System.Text;

namespace ERP.Application.DTOs.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
