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

public class EnrollmentTests
{
    private readonly Mock<IEnrollmentService> _mockEnrollmentService;
    private readonly EnrollmentController _enrollmentController;

    public EnrollmentTests()
    {
        _mockEnrollmentService = new Mock<IEnrollmentService>();
        _enrollmentController = new EnrollmentController(_mockEnrollmentService.Object);
    }

    [Fact]
    public async Task Student_Can_Request_Course_Enrollment()
    {
        // Arrange
        var enrollmentRequest = new EnrollmentRequestDto
        {
            CourseId = 1
        };

        var expectedResponse = new EnrollmentResponseDto
        {
            Id = 1,
            StudentId = 3,
            CourseId = 1,
            CourseName = "Introduction to C#",
            CourseCode = "CS101",
            Description = "Learn C# programming basics",
            StudentFirstName = "John",
            StudentLastName = "Doe",
            Status = "Pending"
        };

        _mockEnrollmentService.Setup(x => x.RequestEnrollmentAsync(3, enrollmentRequest))
            .ReturnsAsync(expectedResponse);

        // Simulate Student user context
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "3"),
            new Claim(ClaimTypes.Role, "Student"),
            new Claim(ClaimTypes.Email, "student@test.com")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _enrollmentController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _enrollmentController.RequestEnroll(enrollmentRequest);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var enrollment = okResult.Value.Should().BeOfType<EnrollmentResponseDto>().Subject;
        enrollment.StudentId.Should().Be(3);
        enrollment.CourseId.Should().Be(1);
        enrollment.Status.Should().Be("Pending");
        _mockEnrollmentService.Verify(x => x.RequestEnrollmentAsync(3, enrollmentRequest), Times.Once);
    }

    [Fact]
    public async Task Admin_Can_Approve_Enrollment()
    {
        // Arrange
        int enrollmentId = 1;
        var approvalDto = new EnrollmentApprovalDto
        {
            IsApproved = true
        };

        _mockEnrollmentService.Setup(x => x.ApproveEnrollmentAsync(enrollmentId, true))
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

        _enrollmentController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _enrollmentController.Approve(enrollmentId, approvalDto);

        // Assert
        result.Should().BeOfType<NoContentResult>();
        _mockEnrollmentService.Verify(x => x.ApproveEnrollmentAsync(enrollmentId, true), Times.Once);
    }

    [Fact]
    public async Task Student_Cannot_Enroll_In_Unpublished_Course()
    {
        // Arrange
        var enrollmentRequest = new EnrollmentRequestDto
        {
            CourseId = 99 // Unpublished course
        };

        // Service returns null when course is not found or not published
        _mockEnrollmentService.Setup(x => x.RequestEnrollmentAsync(3, enrollmentRequest))
            .ReturnsAsync((EnrollmentResponseDto?)null);

        // Simulate Student user context
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "3"),
            new Claim(ClaimTypes.Role, "Student"),
            new Claim(ClaimTypes.Email, "student@test.com")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _enrollmentController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _enrollmentController.RequestEnroll(enrollmentRequest);

        // Assert
        var notFoundResult = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
        notFoundResult.Value.Should().Be("Course not found or not published");
        _mockEnrollmentService.Verify(x => x.RequestEnrollmentAsync(3, enrollmentRequest), Times.Once);
    }
}
