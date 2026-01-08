using LMS.Api.Jan.DTOs;

namespace LMS.Api.Jan.Services.Interfaces;

public interface IUserService
{
    Task<List<UserListDto>> GetUsersForAdminAsync();
    Task<UserListDto?> GetUserByIdAsync(int id);
    Task<UserListDto> CreateUserAsync(UserCreateDto dto);
    Task<UserListDto?> EditUserDetailsAsync(int id, UserUpdateDto dto);
    Task AssignRoleAsync(UserRoleUpdateDto dto);
    Task ApproveUserAsync(UserApprovalDto dto);
    Task DisapproveUserAsync(UserApprovalDto dto);
    Task RemoveUserAsync(int id);
    Task<bool> ValidateUserLoginApprovalAsync(string email);
}

