using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionController : ControllerBase
{
    private readonly ISubmissionService _submissionService;

    public SubmissionController(ISubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubmissionResponseDto>>> GetSubmissions()
    {
        var (userId, isAdmin, isInstructor, isStudent) = GetUserContext();
        var submissions = await _submissionService.GetSubmissionsAsync(userId, isAdmin, isInstructor, isStudent);
        return Ok(submissions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SubmissionResponseDto>> GetById(int id)
    {
        var (userId, isAdmin, isInstructor, isStudent) = GetUserContext();
        var submission = await _submissionService.GetSubmissionByIdAsync(id, userId, isAdmin, isInstructor, isStudent);
        if (submission == null) return NotFound();
        return Ok(submission);
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<SubmissionResponseDto>> Create([FromBody] SubmissionCreateDto dto)
    {
        var (userId, _, _, _) = GetUserContext();
        try
        {
            var created = await _submissionService.CreateSubmissionAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private (int userId, bool isAdmin, bool isInstructor, bool isStudent) GetUserContext()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int userId = 0;
        int.TryParse(idClaim, out userId);

        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        bool isAdmin = role.Equals("Admin", StringComparison.OrdinalIgnoreCase);
        bool isInstructor = role.Equals("Instructor", StringComparison.OrdinalIgnoreCase);
        bool isStudent = role.Equals("Student", StringComparison.OrdinalIgnoreCase);

        return (userId, isAdmin, isInstructor, isStudent);
    }
}
