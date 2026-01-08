using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserListDto>>> GetAll()
    {
        var users = await _userService.GetUsersForAdminAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserListDto>> GetById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserListDto>> Create(UserCreateDto dto)
    {
        var created = await _userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UserListDto>> Update(int id, UserUpdateDto dto)
    {
        var updated = await _userService.EditUserDetailsAsync(id, dto);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpPatch("role")]
    public async Task<IActionResult> UpdateRole(UserRoleUpdateDto dto)
    {
        await _userService.AssignRoleAsync(dto);
        return NoContent();
    }

    [HttpPatch("approval")]
    public async Task<IActionResult> UpdateApproval(UserApprovalDto dto)
    {
        if (dto.IsApproved)
        {
            await _userService.ApproveUserAsync(dto);
        }
        else
        {
            await _userService.DisapproveUserAsync(dto);
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _userService.RemoveUserAsync(id);
        return NoContent();
    }
}

