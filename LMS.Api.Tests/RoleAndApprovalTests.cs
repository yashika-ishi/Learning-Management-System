using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using LMS.Api.Jan.Controllers;
using LMS.Api.Jan.Services.Interfaces;
using LMS.Api.Jan.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace LMS.Api.Tests;

public class RoleAndApprovalTests
{
    private readonly Mock<IUserService> _mockUserService;
    private readonly UserController _userController;

    public RoleAndApprovalTests()
    {
        _mockUserService = new Mock<IUserService>();
        _userController = new UserController(_mockUserService.Object);
    }

    [Fact]
    public async Task User_With_Student_Role_Should_Not_Access_Admin_API()
    {
        // Arrange - The UserController has [Authorize(Roles = "Admin")] attribute
        // This test verifies that the controller is properly decorated with the Admin role requirement
        var controllerType = typeof(UserController);
        var authorizeAttribute = controllerType.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), false)
            .FirstOrDefault() as Microsoft.AspNetCore.Authorization.AuthorizeAttribute;

        // Assert
        authorizeAttribute.Should().NotBeNull();
        authorizeAttribute!.Roles.Should().Contain("Admin");
    }

    [Fact]
    public async Task Admin_Can_Approve_User_Successfully()
    {
        // Arrange
        var approvalDto = new UserApprovalDto
        {
            UserId = 5,
            IsApproved = true
        };

        _mockUserService.Setup(x => x.ApproveUserAsync(It.IsAny<UserApprovalDto>()))
            .Returns(Task.CompletedTask);

        // Simulate Admin user context
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "1"),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(ClaimTypes.Email, "admin@test.com")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _userController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _userController.UpdateApproval(approvalDto);

        // Assert
        result.Should().BeOfType<NoContentResult>();
        _mockUserService.Verify(x => x.ApproveUserAsync(approvalDto), Times.Once);
    }

    [Fact]
    public async Task Non_Admin_User_Cannot_Approve_User()
    {
        // Arrange - Verify that only Admin role can access approval endpoint
        // The UserController requires Admin role at controller level
        var controllerType = typeof(UserController);
        var authorizeAttribute = controllerType.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), false)
            .FirstOrDefault() as Microsoft.AspNetCore.Authorization.AuthorizeAttribute;

        // Assert - The controller should be restricted to Admin role only
        authorizeAttribute.Should().NotBeNull();
        authorizeAttribute!.Roles.Should().Be("Admin");

        // Additional verification: Instructor or Student roles should not be in the allowed roles
        var roles = authorizeAttribute.Roles.Split(',').Select(r => r.Trim()).ToList();
        roles.Should().NotContain("Instructor");
        roles.Should().NotContain("Student");
    }
}
