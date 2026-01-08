using BCrypt.Net;
using LMS.Api.Jan.Models;

namespace LMS.Api.Jan.Data;

public class DataSeeder
{
    private readonly AppDbContext _context;

    public DataSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // Ensure database is created
        await _context.Database.EnsureCreatedAsync();

        // Seed Roles if they don't exist
        if (!_context.Roles.Any())
        {
            var roles = new List<Role>
            {
                new Role { Name = "Admin" },
                new Role { Name = "Instructor" },
                new Role { Name = "Student" }
            };

            _context.Roles.AddRange(roles);
            await _context.SaveChangesAsync();
        }

        // Seed Users if they don't exist
        if (!_context.Users.Any())
        {
            var adminRole = _context.Roles.FirstOrDefault(r => r.Name == "Admin");
            var instructorRole = _context.Roles.FirstOrDefault(r => r.Name == "Instructor");
            var studentRole = _context.Roles.FirstOrDefault(r => r.Name == "Student");

            var users = new List<User>
            {
                // Admin
                new User
                {
                    Email = "admin@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FirstName = "Admin",
                    LastName = "User",
                    RoleId = adminRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                
                // Instructors
                new User
                {
                    Email = "instructor@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123"),
                    FirstName = "Anl",
                    LastName = "Negi",
                    RoleId = instructorRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "instructor2@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123"),
                    FirstName = "carah",
                    LastName = "Wilson",
                    RoleId = instructorRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "instructor3@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor@123"),
                    FirstName = "Michael",
                    LastName = "Brown",
                    RoleId = instructorRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = false // Pending approval
                },
                
                // Students
                new User
                {
                    Email = "student@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "Aditi",
                    LastName = "Negi",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student2@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "Alex",
                    LastName = "johnson",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student3@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "emily",
                    LastName = "Davis",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student4@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "Chris",
                    LastName = "Martinez",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student5@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "alice",
                    LastName = "Anderson",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = false // Pending approval
                },
                new User
                {
                    Email = "student6@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "David",
                    LastName = "Taylor",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student7@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "Jessica",
                    LastName = "White",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student8@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "Robert",
                    LastName = "Moore",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student9@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "Amanda",
                    LastName = "Clark",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = true
                },
                new User
                {
                    Email = "student10@lms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    FirstName = "Daniel",
                    LastName = "Lewis",
                    RoleId = studentRole!.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsApproved = false // Pending approval
                }
            };

            _context.Users.AddRange(users);
            await _context.SaveChangesAsync();
        }

        // Seed Courses if they don't exist
        if (!_context.Courses.Any())
        {
            var instructor = _context.Users.FirstOrDefault(u => u.Email == "instructor@lms.com");
            var instructor2 = _context.Users.FirstOrDefault(u => u.Email == "instructor2@lms.com");

            if (instructor != null && instructor2 != null)
            {
                var courses = new List<Course>
                {
                    // Instructor 1's 5 courses
                    new Course
                    {
                        InstructorId = instructor.Id,
                        CourseName = "Introduction to C# Programming",
                        CourseCode = "CS101",
                        Description = "This course covers C# basics including syntax, variables, data types, operators, control statements, loops, methods, object-oriented concepts, classes, objects, inheritance, exception handling, and simple console-based application development.",
                        YouTubeUrl = "https://www.youtube.com/watch?v=r3CExhZgZV8&list=PLZPZq0r_RZOPNy28FDBys3GVP2LiaIyP",
                        Status = "Published",
                        IsDraft = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-60)
                    },
                    new Course
                    {
                        InstructorId = instructor.Id,
                        CourseName = "Advanced ASP.NET Core",
                        CourseCode = "CS201",
                        Description = "This course teaches building web applications using ASP.NET Core, covering MVC architecture, routing, controllers, views, models, Entity Framework Core, RESTful APIs, authentication, authorization, middleware, database integration, and deployment fundamentals for modern, scalable web applications.",
                        YouTubeUrl = "https://www.youtube.com/watch?v=ouhtSWSdeOU&list=PL1BztTYDF-QPgfvPouABKLwfTKxB6z7gk",
                        Status = "Published",
                        IsDraft = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-50)
                    },
                    new Course
                    {
                        InstructorId = instructor.Id,
                        CourseName = "Database Design & SQL",
                        CourseCode = "DB101",
                        Description = "This course covers C# basics including syntax, variables, data types, operators, control statements, loops, methods, object-oriented concepts, classes, objects, inheritance, exception handling, and simple console-based application development.",
                        YouTubeUrl = "https://www.youtube.com/watch?v=r3CExhZgZV8&list=PLZPZq0r_RZOPNy28FDBys3GVP2LiaIyP",
                        Status = "Published",
                        IsDraft = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-40)
                    },
                    new Course
                    {
                        InstructorId = instructor.Id,
                        CourseName = "RESTful API Development",
                        CourseCode = "API101",
                        Description = "This course teaches building web applications using ASP.NET Core, covering MVC architecture, routing, controllers, views, models, Entity Framework Core, RESTful APIs, authentication, authorization, middleware, database integration, and deployment fundamentals for modern, scalable web applications.",
                        Status = "Pending",
                        IsDraft = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-20)
                    },
                    new Course
                    {
                        InstructorId = instructor.Id,
                        CourseName = "Software Architecture Patterns",
                        CourseCode = "SA301",
                        Description = "This course covers C# basics including syntax, variables, data types, operators, control statements, loops, methods, object-oriented concepts, classes, objects, inheritance, exception handling, and simple console-based application development.",
                        Status = "Draft",
                        IsDraft = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-10)
                    },
                    
                    // Additional courses from other instructor
                    new Course
                    {
                        InstructorId = instructor2.Id,
                        CourseName = "Data Structures & Algorithms",
                        CourseCode = "CS102",
                        Description = "This course teaches building web applications using ASP.NET Core, covering MVC architecture, routing, controllers, views, models, Entity Framework Core, RESTful APIs, authentication, authorization, middleware, database integration, and deployment fundamentals for modern, scalable web applications.",
                        YouTubeUrl = "https://www.youtube.com/watch?v=r3CExhZgZV8&list=PLZPZq0r_RZOPNy28FDBys3GVP2LiaIyP",
                        Status = "Published",
                        IsDraft = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-55)
                    },
                    new Course
                    {
                        InstructorId = instructor2.Id,
                        CourseName = "Web Development Fundamentals",
                        CourseCode = "WEB101",
                        Description = "This course teaches building web applications using ASP.NET Core, covering MVC architecture, routing, controllers, views, models, Entity Framework Core, RESTful APIs, authentication, authorization, middleware, database integration, and deployment fundamentals for modern, scalable web applications.",
                        YouTubeUrl = "https://www.youtube.com/watch?v=r3CExhZgZV8&list=PLZPZq0r_RZOPNy28FDBys3GVP2LiaIyP",
                        Status = "Published",
                        IsDraft = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-45)
                    }
                };

                _context.Courses.AddRange(courses);
                await _context.SaveChangesAsync();
            }
        }

        // Seed Assignments if they don't exist
        if (!_context.Assignments.Any())
        {
            var instructor = _context.Users.FirstOrDefault(u => u.Email == "instructor@lms.com");
            var courses = _context.Courses.Where(c => c.InstructorId == instructor!.Id).ToList();

            if (instructor != null && courses.Any())
            {
                var assignments = new List<Assignment>
                {
                    // CS101 Assignments (3)
                    new Assignment
                    {
                        Title = "Hello World Console Application",
                        Description = "Create a simple console application that prints 'Hello World'. Demonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[0].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-30),
                        LastDate = DateTime.UtcNow.AddDays(-23),
                        GoogleDriveLink = "https://drive.google.com/file/d/13aYiBs89pik3IIpuSv7orTvODmP_0A6O/view?usp=sharing",
                        CreatedAt = DateTime.UtcNow.AddDays(-30)
                    },
                    new Assignment
                    {
                        Title = "Variables and Data Types",
                        Description = "Demonstrate understanding of C# data types and variables. Create a simple console application that prints 'Hello World'. Demonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[0].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-20),
                        LastDate = DateTime.UtcNow.AddDays(-13),
                        GoogleDriveLink = "https://drive.google.com/file/d/13aYiBs89pik3IIpuSv7orTvODmP_0A6O/view?usp=sharing",
                        CreatedAt = DateTime.UtcNow.AddDays(-20)
                    },
                    new Assignment
                    {
                        Title = "Control Flow and Loops",
                        Description = "Implement programs using if-else, switch, and loopsCreate a simple console application that prints 'Hello World'. Demonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[0].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-10),
                        LastDate = DateTime.UtcNow.AddDays(5),
                        GoogleDriveLink = "https://drive.google.com/file/d/13aYiBs89pik3IIpuSv7orTvODmP_0A6O/view?usp=sharing",
                        CreatedAt = DateTime.UtcNow.AddDays(-10)
                    },
                    
                    // CS201 Assignments (3)
                    new Assignment
                    {
                        Title = "MVC Web Application",
                        Description = "Create a basic MVC application with CRUD operationsCreate a simple console application that prints 'Hello World'. Demonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[1].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-25),
                        LastDate = DateTime.UtcNow.AddDays(-10),
                        GoogleDriveLink = "https://drive.google.com/file/d/13aYiBs89pik3IIpuSv7orTvODmP_0A6O/view?usp=sharing",
                        CreatedAt = DateTime.UtcNow.AddDays(-25)
                    },
                    new Assignment
                    {
                        Title = "Dependency Injection Implementation",
                        Description = "Demonstrate DI in ASP.NET Core",
                        CourseId = courses[1].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-15),
                        LastDate = DateTime.UtcNow.AddDays(3),
                        GoogleDriveLink = "https://drive.google.com/file/d/13aYiBs89pik3IIpuSv7orTvODmP_0A6O/view?usp=sharing",
                        CreatedAt = DateTime.UtcNow.AddDays(-15)
                    },
                    new Assignment
                    {
                        Title = "Authentication & Authorization",
                        Description = "Implement user authentication and role-based authorization",
                        CourseId = courses[1].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-5),
                        LastDate = DateTime.UtcNow.AddDays(10),
                        CreatedAt = DateTime.UtcNow.AddDays(-5)
                    },
                    
                    // DB101 Assignments (2)
                    new Assignment
                    {
                        Title = "Database Schema Design",
                        Description = "Design a normalized database schema for an e-commerce systemCreate a simple console application that prints 'Hello World'. Demonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[2].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-22),
                        LastDate = DateTime.UtcNow.AddDays(-8),
                        CreatedAt = DateTime.UtcNow.AddDays(-22)
                    },
                    new Assignment
                    {
                        Title = "Complex SQL Queries",
                        Description = "Write complex SQL queries with joins and subqueriesCreate a simple console application that prints 'Hello World'. Demonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[2].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-12),
                        LastDate = DateTime.UtcNow.AddDays(2),
                        GoogleDriveLink = "https://drive.google.com/file/d/13aYiBs89pik3IIpuSv7orTvODmP_0A6O/view?usp=sharing",
                        CreatedAt = DateTime.UtcNow.AddDays(-12)
                    },
                    
                    // API101 Assignments (2)
                    new Assignment
                    {
                        Title = "Build REST API Endpoints",
                        Description = "Create CRUD endpoints for a resourceDemonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[3].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-8),
                        LastDate = DateTime.UtcNow.AddDays(7),
                        CreatedAt = DateTime.UtcNow.AddDays(-8)
                    },
                    new Assignment
                    {
                        Title = "API Documentation with Swagger",
                        Description = "Document your API using Swagger/OpenAPIDemonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[3].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-3),
                        LastDate = DateTime.UtcNow.AddDays(12),
                        CreatedAt = DateTime.UtcNow.AddDays(-3)
                    },
                    
                    // SA301 Assignment (1)
                    new Assignment
                    {
                        Title = "Design Pattern Implementation",
                        Description = "Implement three design patterns in a sample projectDemonstrate understanding of C# data types and variables.Create a basic MVC application with CRUD operations. Implement programs using if-else, switch, and loops",
                        CourseId = courses[4].Id,
                        InstructorId = instructor.Id,
                        StartDate = DateTime.UtcNow.AddDays(-5),
                        LastDate = DateTime.UtcNow.AddDays(15),
                        CreatedAt = DateTime.UtcNow.AddDays(-5)
                    }
                };

                _context.Assignments.AddRange(assignments);
                await _context.SaveChangesAsync();
            }
        }

        // Seed Enrollments if they don't exist
        if (!_context.Enrollments.Any())
        {
            var student1 = _context.Users.FirstOrDefault(u => u.Email == "student@lms.com");
            var student2 = _context.Users.FirstOrDefault(u => u.Email == "student2@lms.com");
            var student3 = _context.Users.FirstOrDefault(u => u.Email == "student3@lms.com");
            var student4 = _context.Users.FirstOrDefault(u => u.Email == "student4@lms.com");
            var student5 = _context.Users.FirstOrDefault(u => u.Email == "student6@lms.com");
            
            var courses = _context.Courses.ToList();

            if (student1 != null && courses.Any())
            {
                var enrollments = new List<Enrollment>
                {
                    // Student 1 - Enrolled in 2 courses (Approved)
                    new Enrollment
                    {
                        StudentId = student1.Id,
                        CourseId = courses[0].Id,
                        Status = "Approved",
                        CreatedAt = DateTime.UtcNow.AddDays(-28)
                    },
                    new Enrollment
                    {
                        StudentId = student1.Id,
                        CourseId = courses[1].Id,
                        Status = "Approved",
                        CreatedAt = DateTime.UtcNow.AddDays(-24)
                    },
                    
                    // Student 2 - Multiple enrollments with different statuses
                    new Enrollment
                    {
                        StudentId = student2!.Id,
                        CourseId = courses[0].Id,
                        Status = "Approved",
                        CreatedAt = DateTime.UtcNow.AddDays(-27)
                    },
                    new Enrollment
                    {
                        StudentId = student2.Id,
                        CourseId = courses[2].Id,
                        Status = "Approved",
                        CreatedAt = DateTime.UtcNow.AddDays(-20)
                    },
                    new Enrollment
                    {
                        StudentId = student2.Id,
                        CourseId = courses[3].Id,
                        Status = "Pending",
                        CreatedAt = DateTime.UtcNow.AddDays(-5)
                    },
                    
                    // Student 3 - Some approved, some pending
                    new Enrollment
                    {
                        StudentId = student3!.Id,
                        CourseId = courses[1].Id,
                        Status = "Approved",
                        CreatedAt = DateTime.UtcNow.AddDays(-25)
                    },
                    new Enrollment
                    {
                        StudentId = student3.Id,
                        CourseId = courses[5].Id,
                        Status = "Approved",
                        CreatedAt = DateTime.UtcNow.AddDays(-18)
                    },
                    
                    // Student 4 - One disapproved enrollment
                    new Enrollment
                    {
                        StudentId = student4!.Id,
                        CourseId = courses[0].Id,
                        Status = "Disapproved",
                        CreatedAt = DateTime.UtcNow.AddDays(-15)
                    },
                    new Enrollment
                    {
                        StudentId = student4.Id,
                        CourseId = courses[6].Id,
                        Status = "Approved",
                        CreatedAt = DateTime.UtcNow.AddDays(-10)
                    },
                    
                    // Student 5 - Pending enrollment
                    new Enrollment
                    {
                        StudentId = student5!.Id,
                        CourseId = courses[2].Id,
                        Status = "Pending",
                        CreatedAt = DateTime.UtcNow.AddDays(-3)
                    }
                };

                _context.Enrollments.AddRange(enrollments);
                await _context.SaveChangesAsync();
            }
        }

        // Seed Submissions if they don't exist
        if (!_context.Submissions.Any())
        {
            var student1 = _context.Users.FirstOrDefault(u => u.Email == "student@lms.com");
            var student2 = _context.Users.FirstOrDefault(u => u.Email == "student2@lms.com");
            var student3 = _context.Users.FirstOrDefault(u => u.Email == "student3@lms.com");
            
            var assignments = _context.Assignments.ToList();

            if (student1 != null && student2 != null && assignments.Any())
            {
                var submissions = new List<Submission>
                {
                    // Student 1 - 2 submissions
                    new Submission
                    {
                        AssignmentId = assignments[0].Id,
                        StudentId = student1.Id,
                        SubmissionTitle = "Hello World Assignment Submission",
                        Solution = "Console.WriteLine(\"Hello World\");",
                        GoogleDriveLink = "https://drive.google.com/file/d/1snhZ6jwCvIkGS50NHRuzrjA5wvNH8Kkh/view?usp=sharing",
                        SubmittedAt = DateTime.UtcNow.AddDays(-25)
                    },
                    new Submission
                    {
                        AssignmentId = assignments[1].Id,
                        StudentId = student1.Id,
                        SubmissionTitle = "Data Types Assignment Submission",
                        Solution = "Demonstrated int, string, double, bool, and custom types",
                        GoogleDriveLink = "https://drive.google.com/file/d/1snhZ6jwCvIkGS50NHRuzrjA5wvNH8Kkh/view?usp=sharing",
                        SubmittedAt = DateTime.UtcNow.AddDays(-15)
                    },
                    
                    // Student 2 - Multiple submissions
                    new Submission
                    {
                        AssignmentId = assignments[0].Id,
                        StudentId = student2.Id,
                        SubmissionTitle = "My First C# Program",
                        Solution = "Console.WriteLine(\"Hello, Learning Management System!\");",
                        GoogleDriveLink = "https://drive.google.com/file/d/1snhZ6jwCvIkGS50NHRuzrjA5wvNH8Kkh/view?usp=sharing",
                        SubmittedAt = DateTime.UtcNow.AddDays(-24)
                    },
                    new Submission
                    {
                        AssignmentId = assignments[1].Id,
                        StudentId = student2.Id,
                        SubmissionTitle = "Variables Exercise Solution",
                        Solution = "Implemented all required variable types and conversions",
                        GoogleDriveLink = "https://drive.google.com/file/d/1snhZ6jwCvIkGS50NHRuzrjA5wvNH8Kkh/view?usp=sharing",
                        SubmittedAt = DateTime.UtcNow.AddDays(-14)
                    },
                    new Submission
                    {
                        AssignmentId = assignments[6].Id,
                        StudentId = student2.Id,
                        SubmissionTitle = "E-Commerce Database Schema",
                        Solution = "Designed normalized schema with Users, Products, Orders, and OrderItems tables",
                        GoogleDriveLink = "https://drive.google.com/file/d/1snhZ6jwCvIkGS50NHRuzrjA5wvNH8Kkh/view?usp=sharing",
                        SubmittedAt = DateTime.UtcNow.AddDays(-10)
                    },
                    
                    // Student 3 - Submissions
                    new Submission
                    {
                        AssignmentId = assignments[3].Id,
                        StudentId = student3!.Id,
                        SubmissionTitle = "MVC CRUD Application",
                        Solution = "Built complete MVC app with Entity Framework Core",
                        GoogleDriveLink = "https://drive.google.com/file/d/1snhZ6jwCvIkGS50NHRuzrjA5wvNH8Kkh/view?usp=sharing",
                        SubmittedAt = DateTime.UtcNow.AddDays(-12)
                    }
                };

                _context.Submissions.AddRange(submissions);
                await _context.SaveChangesAsync();
            }
        }
    }
}
