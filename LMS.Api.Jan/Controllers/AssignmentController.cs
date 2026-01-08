using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AssignmentResponseDto>>> GetAssignments()
    {
        var (userId, isAdmin, isInstructor, isStudent) = GetUserContext();
        var assignments = await _assignmentService.GetAssignmentsAsync(userId, isAdmin, isInstructor, isStudent);
        return Ok(assignments);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssignmentResponseDto>> GetById(int id)
    {
        var (userId, isAdmin, isInstructor, isStudent) = GetUserContext();
        var assignment = await _assignmentService.GetAssignmentByIdAsync(id, userId, isAdmin, isInstructor, isStudent);
        if (assignment == null) return NotFound();
        return Ok(assignment);
    }

    [HttpPost]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<AssignmentResponseDto>> Create([FromBody] AssignmentCreateDto dto)
    {
        var (userId, _, _, _) = GetUserContext();
        var created = await _assignmentService.CreateAssignmentAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<AssignmentResponseDto>> Update(int id, [FromBody] AssignmentUpdateDto dto)
    {
        var (userId, isAdmin, isInstructor, _) = GetUserContext();
        var updated = await _assignmentService.UpdateAssignmentAsync(id, userId, isAdmin, isInstructor, dto);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var (userId, isAdmin, isInstructor, _) = GetUserContext();
        var ok = await _assignmentService.DeleteAssignmentAsync(id, userId, isAdmin, isInstructor);
        if (!ok) return NotFound();
        return NoContent();
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
