using LMS.Api.Jan.DTOs;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;
using LMS.Api.Jan.Services.Interfaces;

namespace LMS.Api.Jan.Services.Implementations;

public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly ICourseRepository _courseRepository;

    public EnrollmentService(IEnrollmentRepository enrollmentRepository, ICourseRepository courseRepository)
    {
        _enrollmentRepository = enrollmentRepository;
        _courseRepository = courseRepository;
    }

    public async Task<EnrollmentResponseDto?> RequestEnrollmentAsync(int studentId, EnrollmentRequestDto dto)
    {
        var course = await _courseRepository.GetCourseByIdAsync(dto.CourseId);
        if (course == null || course.Status != "Published") return null;

        var existing = await _enrollmentRepository.GetEnrollmentAsync(studentId, dto.CourseId);
        if (existing != null)
        {
            return Map(existing);
        }

        var enrollment = new Enrollment
        {
            StudentId = studentId,
            CourseId = dto.CourseId,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        await _enrollmentRepository.AddEnrollmentAsync(enrollment);
        enrollment = await _enrollmentRepository.GetEnrollmentByIdAsync(enrollment.Id) ?? enrollment;
        return Map(enrollment);
    }

    public async Task<List<EnrollmentResponseDto>> GetStudentEnrollmentsAsync(int studentId)
    {
        var enrollments = await _enrollmentRepository.GetEnrollmentsForStudentAsync(studentId);
        return enrollments.Select(Map).ToList();
    }

    public async Task<List<EnrollmentResponseDto>> GetAllEnrollmentsAsync()
    {
        var enrollments = await _enrollmentRepository.GetAllEnrollmentsAsync();
        return enrollments.Select(Map).ToList();
    }

    public async Task<bool> ApproveEnrollmentAsync(int enrollmentId, bool isApproved)
    {
        var enrollment = await _enrollmentRepository.GetEnrollmentByIdAsync(enrollmentId);
        if (enrollment == null) return false;

        enrollment.Status = isApproved ? "Approved" : "Disapproved";
        await _enrollmentRepository.UpdateEnrollmentAsync(enrollment);
        return true;
    }

    private static EnrollmentResponseDto Map(Enrollment e) => new EnrollmentResponseDto
    {
        Id = e.Id,
        CourseId = e.CourseId,
        CourseName = e.Course?.CourseName ?? string.Empty,
        CourseCode = e.Course?.CourseCode ?? string.Empty,
        Description = e.Course?.Description ?? string.Empty,
        YouTubeUrl = e.Course?.YouTubeUrl,
        StudentId = e.StudentId,
        StudentFirstName = e.Student?.FirstName ?? string.Empty,
        StudentLastName = e.Student?.LastName ?? string.Empty,
        Status = e.Status
    };
}

