using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Instructor,Admin")]
public class CourseController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CourseController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetMyCourses()
    {
        var (userId, isAdmin) = GetUserContext();
        var courses = await _courseService.GetCoursesAsync(userId, isAdmin);
        return Ok(courses);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CourseResponseDto>> GetById(int id)
    {
        var (userId, isAdmin) = GetUserContext();
        var course = await _courseService.GetCourseByIdAsync(id, userId, isAdmin);
        if (course == null) return NotFound();
        return Ok(course);
    }

    [HttpGet("published")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetPublished()
    {
        var courses = await _courseService.GetPublishedCoursesAsync();
        return Ok(courses);
    }

    [HttpPost]
    public async Task<ActionResult<CourseResponseDto>> Create([FromBody] CourseCreateDto dto)
    {
        var (userId, _) = GetUserContext();
        var created = await _courseService.CreateCourseAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CourseResponseDto>> Update(int id, [FromBody] CourseUpdateDto dto)
    {
        var (userId, isAdmin) = GetUserContext();
        var updated = await _courseService.UpdateCourseAsync(id, userId, isAdmin, dto);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpPost("{id:int}/request-publish")]
    public async Task<IActionResult> RequestPublish(int id)
    {
        var (userId, isAdmin) = GetUserContext();
        var ok = await _courseService.RequestPublishAsync(id, userId, isAdmin);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpPost("{id:int}/approve-publish")]
    public async Task<IActionResult> ApprovePublish(int id)
    {
        var (userId, isAdmin) = GetUserContext();
        var ok = await _courseService.ApprovePublishAsync(id, userId, isAdmin);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (userId, isAdmin) = GetUserContext();
        var ok = await _courseService.DeleteCourseAsync(id, userId, isAdmin);
        if (!ok) return NotFound();
        return NoContent();
    }

    private (int userId, bool isAdmin) GetUserContext()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int userId = 0;
        int.TryParse(idClaim, out userId);

        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        bool isAdmin = role.Equals("Admin", StringComparison.OrdinalIgnoreCase);
        return (userId, isAdmin);
    }
}

