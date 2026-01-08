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

public class AssignmentAndSubmissionTests
{
    private readonly Mock<IAssignmentService> _mockAssignmentService;
    private readonly Mock<ISubmissionService> _mockSubmissionService;
    private readonly AssignmentController _assignmentController;
    private readonly SubmissionController _submissionController;

    public AssignmentAndSubmissionTests()
    {
        _mockAssignmentService = new Mock<IAssignmentService>();
        _mockSubmissionService = new Mock<ISubmissionService>();
        _assignmentController = new AssignmentController(_mockAssignmentService.Object);
        _submissionController = new SubmissionController(_mockSubmissionService.Object);
    }

    [Fact]
    public async Task Instructor_Can_Create_Assignment_For_Course()
    {
        // Arrange
        var assignmentDto = new AssignmentCreateDto
        {
            CourseId = 1,
            Title = "Week 1 Assignment",
            Description = "Complete exercises 1-5",
            StartDate = DateTime.UtcNow,
            LastDate = DateTime.UtcNow.AddDays(7),
            GoogleDriveLink = "https://drive.google.com/assignment1"
        };

        var expectedResponse = new AssignmentResponseDto
        {
            Id = 1,
            CourseId = 1,
            CourseName = "Introduction to C#",
            Title = assignmentDto.Title,
            Description = assignmentDto.Description,
            InstructorId = 2,
            InstructorName = "John Instructor",
            StartDate = assignmentDto.StartDate,
            LastDate = assignmentDto.LastDate,
            GoogleDriveLink = assignmentDto.GoogleDriveLink,
            CreatedAt = DateTime.UtcNow
        };

        _mockAssignmentService.Setup(x => x.CreateAssignmentAsync(2, assignmentDto))
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

        _assignmentController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _assignmentController.Create(assignmentDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var assignment = createdResult.Value.Should().BeOfType<AssignmentResponseDto>().Subject;
        assignment.Title.Should().Be(assignmentDto.Title);
        assignment.CourseId.Should().Be(1);
        assignment.CourseName.Should().Be("Introduction to C#");
        _mockAssignmentService.Verify(x => x.CreateAssignmentAsync(2, assignmentDto), Times.Once);
    }

    [Fact]
    public async Task Student_Can_Submit_Assignment_Successfully()
    {
        // Arrange
        var submissionDto = new SubmissionCreateDto
        {
            AssignmentId = 1,
            SubmissionTitle = "My Week 1 Submission",
            Solution = "Here is my completed assignment...",
            GoogleDriveLink = "https://drive.google.com/submission1"
        };

        var expectedResponse = new SubmissionResponseDto
        {
            Id = 1,
            AssignmentId = 1,
            StudentId = 3,
            StudentFirstName = "John",
            StudentLastName = "Doe",
            CourseName = "Introduction to C#",
            AssignmentTitle = "Week 1 Assignment",
            SubmissionTitle = submissionDto.SubmissionTitle,
            Solution = submissionDto.Solution,
            GoogleDriveLink = submissionDto.GoogleDriveLink,
            SubmittedAt = DateTime.UtcNow
        };

        _mockSubmissionService.Setup(x => x.CreateSubmissionAsync(3, submissionDto))
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

        _submissionController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        // Act
        var result = await _submissionController.Create(submissionDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var submission = createdResult.Value.Should().BeOfType<SubmissionResponseDto>().Subject;
        submission.StudentId.Should().Be(3);
        submission.AssignmentId.Should().Be(1);
        submission.SubmissionTitle.Should().Be(submissionDto.SubmissionTitle);
        submission.Solution.Should().Be(submissionDto.Solution);
        submission.GoogleDriveLink.Should().Be(submissionDto.GoogleDriveLink);
        _mockSubmissionService.Verify(x => x.CreateSubmissionAsync(3, submissionDto), Times.Once);
    }
}
