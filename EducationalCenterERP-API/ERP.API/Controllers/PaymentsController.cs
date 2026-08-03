using ERP.Application.DTOs.Payments;
using ERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentsController(IPaymentService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatePaymentDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentPayments(Guid studentId)
        {
            return Ok(await _service.GetStudentPayments(studentId));
        }

        [HttpGet("student/{studentId}/current")]
        public async Task<IActionResult> GetCurrentMonth(Guid studentId)
        {
            return Ok(await _service.GetCurrentMonthPayment(studentId));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllPayments());
        }

        [HttpGet("income")]
        public async Task<IActionResult> GetIncome(int month, int year)
        {
            return Ok(await _service.GetMonthlyIncome(month, year));
        }
    }
}
