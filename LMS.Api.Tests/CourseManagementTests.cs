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

public class CourseManagementTests
{
    private readonly Mock<ICourseService> _mockCourseService;
    private readonly CourseController _courseController;

    public CourseManagementTests()
    {
        _mockCourseService = new Mock<ICourseService>();
        _courseController = new CourseController(_mockCourseService.Object);
    }

    [Fact]
    public async Task Instructor_Can_Create_Course_Successfully()
    {
        // Arrange
        var courseDto = new CourseCreateDto
        {
            CourseName = "Introduction to C#",
            CourseCode = "CS101",
            Description = "Learn C# programming basics",
            YouTubeUrl = "https://youtube.com/course"
        };

        var expectedResponse = new CourseResponseDto
        {
            Id = 1,
            CourseName = courseDto.CourseName,
            CourseCode = courseDto.CourseCode,
            Description = courseDto.Description,
            YouTubeUrl = courseDto.YouTubeUrl,
            Status = "Draft",
            IsDraft = true,
            CreatedAt = DateTime.UtcNow
        };

        _mockCourseService.Setup(x => x.CreateCourseAsync(It.IsAny<int>(), It.IsAny<CourseCreateDto>()))
            .ReturnsAsync(expectedResponse);

        // Simulate Instructor user context
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "2"),
            new Claim(ClaimTypes.Role, "Instructor"),
            new Claim(ClaimTypes.Email, "instructor@test.com")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _courseController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _courseController.Create(courseDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var returnedCourse = createdResult.Value.Should().BeOfType<CourseResponseDto>().Subject;
        returnedCourse.CourseName.Should().Be(courseDto.CourseName);
        returnedCourse.CourseCode.Should().Be(courseDto.CourseCode);
        returnedCourse.Status.Should().Be("Draft");
        _mockCourseService.Verify(x => x.CreateCourseAsync(2, courseDto), Times.Once);
    }

    [Fact]
    public async Task Student_Cannot_Create_Course()
    {
        // Arrange - Verify that CourseController requires Instructor or Admin role
        var controllerType = typeof(CourseController);
        var authorizeAttribute = controllerType.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), false)
            .FirstOrDefault() as Microsoft.AspNetCore.Authorization.AuthorizeAttribute;

        // Assert - Student role should not be in the allowed roles
        authorizeAttribute.Should().NotBeNull();
        authorizeAttribute!.Roles.Should().NotBeNullOrEmpty();

        var roles = authorizeAttribute.Roles.Split(',').Select(r => r.Trim()).ToList();
        roles.Should().NotContain("Student");
        roles.Should().Contain("Instructor");
        roles.Should().Contain("Admin");
    }

    [Fact]
    public async Task Admin_Can_Publish_Course()
    {
        // Arrange
        int courseId = 1;

        _mockCourseService.Setup(x => x.ApprovePublishAsync(courseId, It.IsAny<int>(), true))
            .ReturnsAsync(true);

        // Simulate Admin user context
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "1"),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(ClaimTypes.Email, "admin@test.com")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _courseController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _courseController.ApprovePublish(courseId);

        // Assert
        result.Should().BeOfType<NoContentResult>();
        _mockCourseService.Verify(x => x.ApprovePublishAsync(courseId, 1, true), Times.Once);
    }
}
