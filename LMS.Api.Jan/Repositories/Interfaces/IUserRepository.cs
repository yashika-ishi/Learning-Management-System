using LMS.Api.Jan.Models;

namespace LMS.Api.Jan.Repositories.Interfaces;

public interface IUserRepository
{
    Task<List<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task AddUserAsync(User user);
    Task UpdateUserAsync(User user);
    Task UpdateUserRoleAsync(int id, int roleId);
    Task UpdateApprovalStatusAsync(int id, bool isApproved);
    Task DeleteUserAsync(int id);
    Task<bool> UserExistsAsync(string email);
}

