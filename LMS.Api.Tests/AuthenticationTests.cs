using Xunit;
using Moq;
using FluentAssertions;
using LMS.Api.Jan.Services.Interfaces;
using LMS.Api.Jan.Services.Implementations;
using LMS.Api.Jan.Repositories.Interfaces;
using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Helpers;
using Microsoft.Extensions.Configuration;

namespace LMS.Api.Tests;

public class AuthenticationTests
{
    private readonly Mock<IAuthRepository> _mockAuthRepo;
    private readonly Mock<IUserService> _mockUserService;
    private readonly JwtHelper _jwtHelper;
    private readonly IAuthService _authService;

    public AuthenticationTests()
    {
        _mockAuthRepo = new Mock<IAuthRepository>();
        _mockUserService = new Mock<IUserService>();

        // Setup configuration for JwtHelper
        var inMemorySettings = new Dictionary<string, string>
        {
            {"Jwt:Key", "ThisIsASecretKeyForTestingPurposesOnly1234567890"},
            {"Jwt:Issuer", "TestIssuer"},
            {"Jwt:Audience", "TestAudience"}
        };
        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();
        _jwtHelper = new JwtHelper(configuration);

        _authService = new AuthService(_mockAuthRepo.Object, _jwtHelper, _mockUserService.Object);
    }

    [Fact]
    public async Task Register_User_With_Valid_Data_Should_Create_User()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "newuser@test.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe",
            RoleId = 3 // Student role
        };

        var role = new Role { Id = 3, Name = "Student" };
        var createdUser = new User
        {
            Id = 1,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            RoleId = request.RoleId,
            Role = role,
            IsApproved = false
        };

        _mockAuthRepo.Setup(x => x.UserExistsAsync(request.Email))
            .ReturnsAsync(false);

        _mockAuthRepo.Setup(x => x.GetRoleByIdAsync(request.RoleId))
            .ReturnsAsync(role);

        _mockAuthRepo.Setup(x => x.CreateUserAsync(It.IsAny<User>()))
            .ReturnsAsync(createdUser);

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.Email.Should().Be(request.Email);
        result.FirstName.Should().Be(request.FirstName);
        result.LastName.Should().Be(request.LastName);
        result.Role.Should().Be("Student");
        _mockAuthRepo.Verify(x => x.CreateUserAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task Register_User_With_Duplicate_Email_Should_Fail()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "existing@test.com",
            Password = "Password123!",
            FirstName = "Jane",
            LastName = "Smith",
            RoleId = 3
        };

        _mockAuthRepo.Setup(x => x.UserExistsAsync(request.Email))
            .ReturnsAsync(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _authService.RegisterAsync(request)
        );

        exception.Message.Should().Contain("already exists");
        _mockAuthRepo.Verify(x => x.CreateUserAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Login_With_Valid_Credentials_Should_Return_JWT_Token()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "user@test.com",
            Password = "Password123!"
        };

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var user = new User
        {
            Id = 1,
            Email = request.Email,
            PasswordHash = hashedPassword,
            FirstName = "Test",
            LastName = "User",
            IsApproved = true,
            RoleId = 3,
            Role = new Role { Id = 3, Name = "Student" }
        };

        _mockAuthRepo.Setup(x => x.GetUserByEmailAsync(request.Email))
            .ReturnsAsync(user);

        _mockUserService.Setup(x => x.ValidateUserLoginApprovalAsync(request.Email))
            .ReturnsAsync(true);

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.Email.Should().Be(request.Email);
        result.Role.Should().Be("Student");
        result.FirstName.Should().Be("Test");
        result.LastName.Should().Be("User");
    }

    [Fact]
    public async Task Login_With_Invalid_Password_Should_Return_Unauthorized()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "user@test.com",
            Password = "WrongPassword"
        };

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword("CorrectPassword");
        var user = new User
        {
            Id = 1,
            Email = request.Email,
            PasswordHash = hashedPassword,
            FirstName = "Test",
            LastName = "User",
            IsApproved = true,
            RoleId = 3,
            Role = new Role { Id = 3, Name = "Student" }
        };

        _mockAuthRepo.Setup(x => x.GetUserByEmailAsync(request.Email))
            .ReturnsAsync(user);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _authService.LoginAsync(request)
        );

        exception.Message.Should().Contain("Invalid");
    }
}
