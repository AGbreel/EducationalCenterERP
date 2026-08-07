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


        // إنشاء عملية دفع
        [HttpPost]
        public async Task<IActionResult> Create(CreatePaymentDto dto)
        {
            try
            {
                var result = await _service.CreateAsync(dto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }



        // جميع المدفوعات
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _service.GetAllAsync();

            return Ok(payments);
        }



        // مدفوعات طالب
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentPayments(Guid studentId)
        {
            var payments = await _service.GetStudentPaymentsAsync(studentId);

            return Ok(payments);
        }



        // مدفوعات اشتراك معين
        [HttpGet("class/{studentClassId}")]
        public async Task<IActionResult> GetStudentClassPayments(Guid studentClassId)
        {
            var payments = await _service.GetStudentClassPaymentsAsync(studentClassId);

            return Ok(payments);
        }



        // إجمالي الإيرادات
        [HttpGet("income")]
        public async Task<IActionResult> GetIncome()
        {
            var income = await _service.GetIncomeAsync();

            return Ok(new
            {
                totalIncome = income
            });
        }



        // حذف عملية دفع
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _service.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Payment not found"
                });
            }

            return Ok(new
            {
                message = "Payment deleted successfully"
            });
        }
    }
}