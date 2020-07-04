using ApplicatonProcess.Data;
using ApplicatonProcess.Domain;
using ApplicatonProcess.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicatonProcess.Web
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicantController : Controller
    {
        ApplicantValidator applicantValidator;
        IRepository<Applicant, int> _applicantService;
        public ApplicantController(IRepository<Applicant, int> applicantService)
        {
            _applicantService = applicantService;
            applicantValidator = new ApplicantValidator();
        }
        /// <summary>         
        /// POST for Creating an Object – returning an 201 on successful creation of the object and the url were the object can be called
        /// </summary>
        /// <param name="applicant"></param>
        /// <returns></returns>
        [HttpPost]
        [SwaggerRequestExample(typeof(Applicant), typeof(ApplicantExample))]                
        public async Task<IActionResult> Create([FromBody]Applicant applicant)
        {
            var validation = (await applicantValidator.ValidateAsync(applicant));

            if (validation.IsValid)
            {
                applicant.Id = await _applicantService.CreateAsync(applicant);
                return Ok(applicant.Id);
            }
            return BadRequest(validation.Errors);
        }

        /// <summary>        
        /// GET with id parameter – to ask for an object by id
        /// </summary>
        /// <param name="applicant"></param>
        /// <returns></returns>
        [HttpGet("{id}")]                
        public async Task<Applicant> Get(int id)
        {
            return await _applicantService.GetAsync(id);
        }
        /// <summary>        
        /// GET All
        /// </summary>
        /// <param name="applicant"></param>
        /// <returns></returns>
        [HttpGet]                
        public async Task<List<Applicant>> GetAll()
        {
            return await _applicantService.GetAllAsync();
        }
        /// <summary>        
        /// PUT – to update the object with the given id
        /// </summary>
        /// <param name="applicant"></param>
        /// <returns></returns>
        [HttpPut]
        [SwaggerRequestExample(typeof(Applicant), typeof(ApplicantExample))]                
        public async Task<IActionResult> Put([FromBody] Applicant applicant)
        {
            if (applicantValidator.Validate(applicant).IsValid)
            {
                return Ok(await _applicantService.UpdateAsync(applicant));
            }
            return BadRequest();
        }
        /// <summary>        
        /// DELETE – to delete the object with the given id
        /// </summary>
        /// <param name="applicant"></param>
        /// <returns></returns>
        [HttpDelete]           
        public async Task<IActionResult> Delete([FromBody]Applicant app)
        {
            var applicant = await Get(app.Id);
            if (applicant == null)
            {
                return BadRequest("Not found");
            }
            await _applicantService.DeleteAsync(applicant);
            return Ok();
        }
    }
}
