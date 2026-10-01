using System;
using System.Collections.Generic;
using System.Text;

namespace ERP.Application.DTOs.Auth
{
    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
