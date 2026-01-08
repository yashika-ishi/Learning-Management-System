using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<EnrollmentResponseDto>> RequestEnroll([FromBody] EnrollmentRequestDto dto)
    {
        var studentId = GetUserId();
        if (studentId == 0) return Unauthorized();

        var result = await _enrollmentService.RequestEnrollmentAsync(studentId, dto);
        if (result == null) return NotFound("Course not found or not published");
        return Ok(result);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<IEnumerable<EnrollmentResponseDto>>> MyEnrollments()
    {
        var studentId = GetUserId();
        if (studentId == 0) return Unauthorized();

        var result = await _enrollmentService.GetStudentEnrollmentsAsync(studentId);
        return Ok(result);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<EnrollmentResponseDto>>> All()
    {
        var result = await _enrollmentService.GetAllEnrollmentsAsync();
        return Ok(result);
    }

    [HttpPost("{id:int}/approval")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(int id, [FromBody] EnrollmentApprovalDto dto)
    {
        var ok = await _enrollmentService.ApproveEnrollmentAsync(id, dto.IsApproved);
        if (!ok) return NotFound();
        return NoContent();
    }

    private int GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(idClaim, out var userId);
        return userId;
    }
}

