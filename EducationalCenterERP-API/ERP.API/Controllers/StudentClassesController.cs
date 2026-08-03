using ERP.Application.DTOs.StudentClasses;
using ERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/student-classes")]
public class StudentClassesController : ControllerBase
{
    private readonly IStudentClassService _service;

    public StudentClassesController(IStudentClassService service)
    {
        _service = service;
    }

    // GET: api/student-classes
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    // GET: api/student-classes/student/{studentId}
    [HttpGet("student/{studentId:guid}")]
    public async Task<IActionResult> GetStudentClasses(Guid studentId)
    {
        return Ok(await _service.GetStudentClasses(studentId));
    }

    // POST: api/student-classes
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStudentClassDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }

    // DELETE: api/student-classes/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}