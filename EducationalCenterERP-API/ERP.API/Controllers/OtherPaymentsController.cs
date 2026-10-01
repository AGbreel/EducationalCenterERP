using ERP.Application.DTOs.OtherPayments;
using ERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/other-income")]
    public class OtherPaymentsController : ControllerBase
    {
        private readonly IOtherPaymentService _service;

        public OtherPaymentsController(IOtherPaymentService service)
        {
            _service = service;
        }

        // GET: api/other-payments
        [HttpGet]
        public async Task<ActionResult<List<OtherPaymentDto>>> GetAll()
        {
            var payments = await _service.GetAllAsync();

            return Ok(payments);
        }

        // POST: api/other-payments
        [HttpPost]
        public async Task<ActionResult<OtherPaymentDto>> Create(
            CreateOtherPaymentDto dto)
        {
            if (dto.Amount <= 0)
                return BadRequest("Amount must be greater than zero.");

            var payment = await _service.CreateAsync(dto);

            return Ok(payment);
        }

        // DELETE: api/other-payments/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound("Other payment not found.");

            return Ok(new
            {
                message = "Other payment deleted successfully."
            });
        }

        // GET: api/other-payments/total
        [HttpGet("total")]
        public async Task<ActionResult<decimal>> GetTotal()
        {
            var total = await _service.GetTotalAsync();

            return Ok(total);
        }
    }
}