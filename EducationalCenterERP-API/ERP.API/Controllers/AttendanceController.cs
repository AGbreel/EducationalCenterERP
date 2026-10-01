using ERP.Application.DTOs.Attendance;
using ERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/attendance")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _service;

        public AttendanceController(IAttendanceService service)
        {
            _service = service;
        }

        // تسجيل حضور
        [HttpPost]
        public async Task<IActionResult> MarkAttendance(CreateAttendanceDto dto)
        {
            var result = await _service.MarkAttendanceAsync(dto);

            if (!result)
            {
                return BadRequest(new
                {
                    message = "Attendance already exists or student/class is invalid."
                });
            }

            return Ok(new
            {
                message = "Attendance saved successfully."
            });
        }

        // حضور طالب
        [HttpGet("student/{studentId:guid}")]
        public async Task<IActionResult> GetStudentAttendance(Guid studentId)
        {
            var result = await _service.GetStudentAttendanceAsync(studentId);

            return Ok(result);
        }

        // حضور كلاس
        [HttpGet("class/{classId:guid}")]
        public async Task<IActionResult> GetClassAttendance(Guid classId)
        {
            var result = await _service.GetClassAttendanceAsync(classId);

            return Ok(result);
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
    }
}