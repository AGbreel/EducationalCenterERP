using ERP.Application.DTOs.Students;
using ERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/students")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _service;
        public StudentsController(
        IStudentService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(
        CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet("qr/{code}")]
        public async Task<IActionResult> GetByQr(string code)
        {
            var student = await _service.GetByQRAsync(code);
            if (student == null)
                return NotFound();

            return Ok(student);

        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var student = await _service.GetByIdAsync(id);
            if (student == null)
                return NotFound();

            return Ok(student);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();        
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByStudentCode(string code)
        {
            var student = await _service.GetByCodeAsync(code);
            if (student == null)
                return NotFound();

            return Ok(student);

        }

        [HttpGet("code/{code}/classes")]
        public async Task<IActionResult> GetStudentClassesByCode(string code)
        {
            var result = await _service.GetStudentClassesByCodeAsync(code);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("qr/{qr}/classes")]
        public async Task<IActionResult> GetStudentClassesByQr(string qr)
        {
            var result = await _service.GetStudentClassesByQrAsync(qr);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}
