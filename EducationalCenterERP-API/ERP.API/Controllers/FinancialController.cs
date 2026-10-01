using ERP.Application.DTOs.Financial;
using ERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace ERP.API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/financial")]
    public class FinancialController : ControllerBase
    {

        private readonly IFinancialSummaryService _service;



        public FinancialController(IFinancialSummaryService service)
        {
            _service = service;
        }



        // GET api/financial/summary
        [HttpGet("summary")]
        public async Task<ActionResult<FinancialSummaryDto>> GetSummary()
        {
            var result = await _service.GetSummaryAsync();

            return Ok(result);
        }
    }
}