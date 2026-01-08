using BCrypt.Net;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Helpers;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly JwtHelper _jwtHelper;
    private readonly IUserService _userService;

    public AuthService(IAuthRepository authRepository, JwtHelper jwtHelper, IUserService userService)
    {
        _authRepository = authRepository;
        _jwtHelper = jwtHelper;
        _userService = userService;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _authRepository.GetUserByEmailAsync(request.Email);
        
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var isApproved = await _userService.ValidateUserLoginApprovalAsync(user.Email);
        if (!isApproved)
        {
            throw new UnauthorizedAccessException("User is not approved by admin yet");
        }

        var token = _jwtHelper.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Role = user.Role.Name,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _authRepository.UserExistsAsync(request.Email))
        {
            throw new InvalidOperationException("Email already exists");
        }

        var role = await _authRepository.GetRoleByIdAsync(request.RoleId);
        if (role == null)
        {
            throw new InvalidOperationException("Invalid role");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            FirstName = request.FirstName,
            LastName = request.LastName,
            RoleId = request.RoleId,
            CreatedAt = DateTime.UtcNow,
            IsApproved = false
        };

        var createdUser = await _authRepository.CreateUserAsync(user);
        var token = _jwtHelper.GenerateToken(createdUser);

        return new AuthResponse
        {
            Token = token,
            Role = createdUser.Role.Name,
            Email = createdUser.Email,
            FirstName = createdUser.FirstName,
            LastName = createdUser.LastName
        };
    }
}
