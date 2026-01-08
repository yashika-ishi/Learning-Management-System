using BCrypt.Net;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Helpers;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthRepository _authRepository;

    public UserService(IUserRepository userRepository, IAuthRepository authRepository)
    {
        _userRepository = userRepository;
        _authRepository = authRepository;
    }

    public async Task<List<UserListDto>> GetUsersForAdminAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();

        return users.Select(u => new UserListDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            Role = u.Role.Name,
            IsApproved = u.IsApproved
        }).ToList();
    }

    public async Task<UserListDto?> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) return null;

        return new UserListDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.Name,
            IsApproved = user.IsApproved
        };
    }

    public async Task<UserListDto> CreateUserAsync(UserCreateDto dto)
    {
        if (await _userRepository.UserExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("Email already exists");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = passwordHash,
            RoleId = dto.RoleId,
            CreatedAt = DateTime.UtcNow,
            IsApproved = false
        };

        await _userRepository.AddUserAsync(user);

        // Reload with role
        var created = await _userRepository.GetUserByIdAsync(user.Id) ?? user;

        return new UserListDto
        {
            Id = created.Id,
            FirstName = created.FirstName,
            LastName = created.LastName,
            Email = created.Email,
            Role = created.Role.Name,
            IsApproved = created.IsApproved
        };
    }

    public async Task<UserListDto?> EditUserDetailsAsync(int id, UserUpdateDto dto)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) return null;

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;

        await _userRepository.UpdateUserAsync(user);

        var updated = await _userRepository.GetUserByIdAsync(id) ?? user;

        return new UserListDto
        {
            Id = updated.Id,
            FirstName = updated.FirstName,
            LastName = updated.LastName,
            Email = updated.Email,
            Role = updated.Role.Name,
            IsApproved = updated.IsApproved
        };
    }

    public async Task AssignRoleAsync(UserRoleUpdateDto dto)
    {
        await _userRepository.UpdateUserRoleAsync(dto.UserId, dto.RoleId);
    }

    public async Task ApproveUserAsync(UserApprovalDto dto)
    {
        await _userRepository.UpdateApprovalStatusAsync(dto.UserId, true);
    }

    public async Task DisapproveUserAsync(UserApprovalDto dto)
    {
        await _userRepository.UpdateApprovalStatusAsync(dto.UserId, false);
    }

    public async Task RemoveUserAsync(int id)
    {
        await _userRepository.DeleteUserAsync(id);
    }

    public async Task<bool> ValidateUserLoginApprovalAsync(string email)
    {
        var user = await _authRepository.GetUserByEmailAsync(email);
        return user != null && user.IsApproved;
    }
}

