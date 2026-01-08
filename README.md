
<div align="center">

  <!-- TECHNOLOGY BADGES -->
  <a href="#">
    <img src="https://img.shields.io/badge/Angular%2018-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
    <img src="https://img.shields.io/badge/ASP.NET%20Core%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
    <img src="https://img.shields.io/badge/JWT%20Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
    <img src="https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" />
    <img src="https://img.shields.io/badge/CRUD%20Operations-0FAAFF?style=for-the-badge" />
  </a>

  <h1>📚 Learning Management System</h1>

  <p>
    Learning Management System is a role-based web application designed to streamline online learning and course management. It supports secure user authentication using JWT and provides separate dashboards for Admin, Instructor, and Student roles. Admins manage users, roles, and course approvals, while instructors create courses and assignments. Students can enroll in published courses, access learning content, and submit assignments. The system ensures scalability, security, and an organized learning experience for all users.
  </p>

   <p>🧑‍💻 By <strong>Yashika</strong> | <a href="https://github.com/yashika-ishi/Learning-Management-System">View Repository</a></p>
</div>

---

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><b>Backend:</b> ASP.NET Core 8 Web API</li>
  <li><b>Frontend:</b> Angular (with Angular Material)</li>
  <li><b>Authentication:</b> JWT (JSON Web Tokens)</li>
  <li><b>Database:</b> SQL Server</li>
  <li><b>ORM:</b> Entity Framework Core</li>
</ul>

<hr/>

<h2>📋 Prerequisites</h2>
<ul>
  <li>Visual Studio 2022 (ASP.NET & Web Development workload)</li>
  <li>.NET SDK 8</li>
  <li>Node.js (LTS version)</li>
  <li>Angular CLI</li>
  <li>SQL Server 2019 or higher</li>
  <li>Entity Framework Core Tools</li>
</ul>

<h3>Angular Setup Commands</h3>
<pre>
npm install -g @angular/cli
ng add @angular/material
npm install @angular/animations
npm install zone.js
</pre>

<p>
In <code>angular.json</code>, add:
</p>
<pre>
"polyfills": ["zone.js"]
</pre>

<hr/>

<h2>⚙️ Backend Setup (.NET Web API)</h2>

<h3>Step 1: Clone Repository</h3>
<pre>
git clone &lt;your-repository-url&gt;
cd LMS.Api.Jan
</pre>

<h3>Step 2: Open Backend Project</h3>
<ul>
  <li>Open the <code>.sln</code> file in Visual Studio</li>
  <li>Restore NuGet packages</li>
</ul>

<h3>Step 3: Configure Database</h3>
<pre>
"ConnectionStrings": {
  "DefaultConnection":
  "Server=(localdb)\\MSSQLLocalDB;Database=LMS_DB_Jan;Trusted_Connection=True;"
}
</pre>

<h3>Step 4: Configure JWT</h3>
<pre>
"Jwt": {
  "Key": "THIS_IS_A_VERY_SECURE_256_BIT_JWT_SECRET_KEY_FOR_JAN",
  "Issuer": "LMS.Api.Jan",
  "Audience": "LMS.Api.Jan"
}
</pre>

<h3>Step 5: Apply Migrations</h3>
<pre>
Add-Migration InitialCreate
Update-Database
</pre>

<p>
Default users and roles are seeded from the <code>Data/DatabaseSeeder</code> folder.
</p>

<h3>Step 6: Run Backend</h3>
<pre>
dotnet run
</pre>

<p>
Backend URL: <b>https://localhost:7234</b>
</p>

<hr/>

<h2>🎨 Frontend Setup (Angular)</h2>

<h3>Step 1: Navigate to Frontend</h3>
<pre>
cd LMS.Ui.Jan
</pre>

<h3>Step 2: Install Dependencies</h3>
<pre>
npm install
</pre>

<h3>Step 3: Configure API URL</h3>
<pre>
export const environment = {
  apiUrl: 'https://localhost:7234/api'
};
</pre>

<h3>Step 4: Run Angular App</h3>
<pre>
ng serve -o
</pre>

<p>
Frontend URL: <b>http://localhost:4200</b>
</p>

<hr/>

<h2>🔄 Application Flow</h2>
<ul>
  <li>User registers or logs in</li>
  <li>JWT token is generated</li>
  <li>Role-based redirection:</li>
  <ul>
    <li><b>Admin:</b> User & Course Management</li>
    <li><b>Instructor:</b> Course & Assignment Management</li>
    <li><b>Student:</b> Course Enrollment & Learning</li>
  </ul>
</ul>

<hr/>

<h2>👤 Default Seeded Users</h2>

<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Role</th>
    <th>Email</th>
    <th>Password</th>
  </tr>
  <tr>
    <td>Admin</td>
    <td>admin@lms.com</td>
    <td>Admin@123</td>
  </tr>
  <tr>
    <td>Instructor</td>
    <td>instructor@lms.com</td>
    <td>Instructor@123</td>
  </tr>
  <tr>
    <td>Student</td>
    <td>student@lms.com</td>
    <td>Student@123</td>
  </tr>
</table>

<hr/>

# Learning Management System (LMS) - System Architecture & Detailed Flow

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [High-Level Architecture](#high-level-architecture)
4. [Database Architecture](#database-architecture)
5. [Backend Architecture (.NET Core API)](#backend-architecture-net-core-api)
6. [Frontend Architecture (Angular)](#frontend-architecture-angular)
7. [Authentication & Authorization Flow](#authentication--authorization-flow)
8. [Detailed User Flows](#detailed-user-flows)
9. [API Endpoints](#api-endpoints)
10. [Security Implementation](#security-implementation)
11. [Testing Strategy](#testing-strategy)

---

## Project Overview

The Learning Management System (LMS) is a full-stack web application that enables:
- **Admin**: Manage users, approve/disapprove courses, enrollments, view all system activities
- **Instructors**: Create and manage courses, create assignments, view student submissions
- **Students**: Browse published courses, enroll in courses, submit assignments

### Key Features
- Role-based access control (Admin, Instructor, Student)
- User approval workflow
- Course publishing workflow (Draft → Pending → Published)
- Enrollment management with approval system
- Assignment creation and submission tracking
- JWT-based authentication
- Real-time data validation and error handling

---

## Technology Stack

### Frontend
- **Framework**: Angular 21
- **UI Library**: Angular Material
- **State Management**: Angular Signals (reactive state)
- **HTTP Client**: Angular HttpClient with Interceptors
- **Routing**: Angular Router with Guards
- **Styling**: CSS with Material Design

### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **ORM**: Entity Framework Core 8.0
- **Authentication**: JWT Bearer Tokens
- **Password Hashing**: BCrypt.Net
- **API Documentation**: Swagger/OpenAPI
- **Architecture Pattern**: Repository Pattern + Service Layer

### Database
- **Database**: SQL Server (LocalDB for development)
- **Migrations**: Entity Framework Core Migrations
- **Seeding**: Automated data seeding on startup

### Testing
- **Framework**: xUnit
- **Coverage**: Unit & Integration Tests for Controllers, Services, Repositories

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Angular 21 Application (Port 4200)                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │ │
│  │  │Components│  │ Services │  │  Guards  │  │Interceptors│  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (JWT in Header)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │        ASP.NET Core 8.0 API (Port 7234)                    │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │ │
│  │  │Controllers │→ │  Services  │→ │   Repositories     │   │ │
│  │  └────────────┘  └────────────┘  └────────────────────┘   │ │
│  │  ┌────────────┐  ┌────────────┐                           │ │
│  │  │ Middleware │  │   Helpers  │                           │ │
│  │  └────────────┘  └────────────┘                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Entity Framework Core
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │       SQL Server LocalDB (LMS_DB_Jan)                      │ │
│  │  ┌──────┐  ┌────────┐  ┌────────────┐  ┌────────────┐    │ │
│  │  │Users │  │Courses │  │Enrollments │  │Assignments │    │ │
│  │  └──────┘  └────────┘  └────────────┘  └────────────┘    │ │
│  │  ┌──────┐  ┌─────────────┐                               │ │
│  │  │Roles │  │Submissions  │                               │ │
│  │  └──────┘  └─────────────┘                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────────┐
│     Roles       │
│─────────────────│
│ Id (PK)         │
│ Name            │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────┐
│        Users            │
│─────────────────────────│
│ Id (PK)                 │
│ Email (Unique)          │
│ PasswordHash            │
│ FirstName               │
│ LastName                │
│ RoleId (FK)             │
│ IsApproved              │
│ CreatedAt               │
└─────────────────────────┘
         │
         │ 1:N (Instructor)
         ▼
┌─────────────────────────┐          ┌──────────────────────┐
│       Courses           │          │    Enrollments       │
│─────────────────────────│          │──────────────────────│
│ Id (PK)                 │◄───N:1───│ Id (PK)              │
│ InstructorId (FK)       │          │ StudentId (FK)       │
│ CourseName              │          │ CourseId (FK)        │
│ CourseCode              │          │ Status               │
│ Description             │          │ CreatedAt            │
│ YouTubeUrl              │          └──────────────────────┘
│ IsDraft                 │                    ▲
│ Status (Draft/Pending/  │                    │
│        Published)       │                    │ N:1
│ CreatedAt               │                    │
└─────────────────────────┘          ┌──────────────────────┐
         │                           │      Users           │
         │ 1:N                       │   (as Student)       │
         ▼                           └──────────────────────┘
┌─────────────────────────┐
│     Assignments         │
│─────────────────────────│
│ Id (PK)                 │
│ Title                   │
│ Description             │
│ CourseId (FK)           │
│ InstructorId (FK)       │
│ StartDate               │
│ LastDate                │
│ GoogleDriveLink         │
│ CreatedAt               │
└─────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────┐
│      Submissions        │
│─────────────────────────│
│ Id (PK)                 │
│ AssignmentId (FK)       │
│ StudentId (FK)          │
│ SubmissionTitle         │
│ Solution                │
│ GoogleDriveLink         │
│ SubmittedAt             │
└─────────────────────────┘
```

### Database Tables

#### 1. Roles
- Stores user role types
- Pre-seeded with: Admin (Id=1), Instructor (Id=2), Student (Id=3)

#### 2. Users
- Stores all user information
- Passwords are hashed using BCrypt
- `IsApproved` flag controls user access (Admin approves new users)
- Unique constraint on Email
- Foreign key to Roles

#### 3. Courses
- Created by Instructors
- `Status` field: Draft, Pending (awaiting admin approval), Published
- `IsDraft` kept for backward compatibility
- Unique constraint on (CourseCode, InstructorId)
- Optional YouTube URL for course content

#### 4. Enrollments
- Junction table linking Students to Courses
- `Status` field: Pending, Approved, Disapproved
- Unique constraint on (StudentId, CourseId) - student can only enroll once per course
- Cascade delete when course is deleted

#### 5. Assignments
- Created by Instructors for their courses
- Contains start and end dates
- Optional Google Drive link for assignment materials

#### 6. Submissions
- Students submit solutions to assignments
- Unique constraint on (AssignmentId, StudentId) - one submission per assignment per student
- Optional Google Drive link for submission files

---

## Backend Architecture (.NET Core API)

### Layered Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CONTROLLERS LAYER                      │
│  - AuthController       - UserController                  │
│  - CourseController     - EnrollmentController            │
│  - AssignmentController - SubmissionController            │
│                                                            │
│  Responsibilities:                                         │
│  • HTTP request/response handling                          │
│  • Route definitions                                       │
│  • Authorization attributes                                │
│  • User context extraction (from JWT claims)               │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                     SERVICES LAYER                        │
│  - IAuthService / AuthService                             │
│  - IUserService / UserService                             │
│  - ICourseService / CourseService                         │
│  - IEnrollmentService / EnrollmentService                 │
│  - IAssignmentService / AssignmentService                 │
│  - ISubmissionService / SubmissionService                 │
│                                                            │
│  Responsibilities:                                         │
│  • Business logic implementation                           │
│  • Data validation                                         │
│  • DTO transformations                                     │
│  • Authorization logic (role-based access)                 │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                  REPOSITORIES LAYER                       │
│  - IAuthRepository / AuthRepository                       │
│  - IUserRepository / UserRepository                       │
│  - ICourseRepository / CourseRepository                   │
│  - IEnrollmentRepository / EnrollmentRepository           │
│  - IAssignmentRepository / AssignmentRepository           │
│  - ISubmissionRepository / SubmissionRepository           │
│                                                            │
│  Responsibilities:                                         │
│  • Database access via Entity Framework                    │
│  • CRUD operations                                         │
│  • Complex queries                                         │
│  • Transaction management                                  │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                      DATA LAYER                           │
│  - AppDbContext (DbContext)                               │
│  - Models (User, Role, Course, etc.)                      │
│  - DataSeeder                                             │
│                                                            │
│  Responsibilities:                                         │
│  • Entity configuration                                    │
│  • Database context                                        │
│  • Initial data seeding                                    │
└──────────────────────────────────────────────────────────┘
```

### Cross-Cutting Concerns

#### Middleware
- **ExceptionMiddleware**: Global exception handling
  - Catches all unhandled exceptions
  - Returns standardized error responses
  - Logs errors

#### Helpers
- **JwtHelper**: JWT token generation and validation
  - Creates JWT tokens with user claims (UserId, Email, Role)
  - Token validation in authentication pipeline

#### DTOs (Data Transfer Objects)
- **Request DTOs**: LoginRequest, RegisterRequest, CourseCreateDto, etc.
- **Response DTOs**: AuthResponse, CourseResponseDto, UserListDto, etc.
- Used to decouple API contracts from database models

---

## Frontend Architecture (Angular)

### Component Structure

```
App Root
│
├── Public Routes
│   ├── LoginComponent
│   └── RegisterComponent
│
├── Admin Shell (Role: Admin)
│   ├── AdminDashboardComponent
│   ├── ManageUsersComponent
│   ├── AdminCoursesComponent
│   ├── AdminEnrollmentsComponent
│   ├── AdminAssignmentsComponent
│   └── AdminSubmissionsComponent
│
├── Instructor Shell (Role: Instructor)
│   ├── InstructorDashboardComponent
│   ├── InstructorMyCoursesComponent
│   ├── InstructorMyAssignmentsComponent
│   └── InstructorSubmissionsComponent
│
└── Student Shell (Role: Student)
    ├── StudentDashboardComponent
    ├── StudentCoursesComponent (Browse all published courses)
    ├── StudentMyCoursesComponent (Enrolled courses)
    └── StudentAssignmentsComponent
```

### Service Layer

```
Services
├── AuthService
│   • Login/Register
│   • Token management (localStorage)
│   • User state (Angular Signals)
│   • Role retrieval
│
├── Admin Services
│   └── AdminUserService
│       • Get all users
│       • Update user role
│       • Approve/disapprove users
│       • Delete users
│
├── Instructor Services
│   ├── InstructorCourseService
│   │   • Create/update/delete courses
│   │   • Request course publish
│   ├── AssignmentService
│   │   • Create/update/delete assignments
│   └── InstructorDashboardService
│       • Get instructor statistics
│
└── Student Services
    ├── EnrollmentService
    │   • Request enrollment
    │   • Get my enrollments
    ├── SubmissionService
    │   • Submit assignment
    │   • View my submissions
    └── StudentDashboardService
        • Get student statistics
```

### Guards

1. **AuthGuard**
   - Checks if user is authenticated (valid token exists)
   - Redirects to login if not authenticated

2. **RoleGuard**
   - Checks if user has the required role
   - Prevents unauthorized access to role-specific routes

### Interceptors

**AuthInterceptor**
- Automatically attaches JWT token to all HTTP requests
- Adds `Authorization: Bearer <token>` header

### Routing Strategy

```typescript
Routes:
  /login                           → LoginComponent (Public)
  /register                        → RegisterComponent (Public)
  
  /admin                           → AdminShell (Guard: Admin)
    /admin/dashboard               → AdminDashboard
    /admin/manage-users            → ManageUsers
    /admin/courses                 → AdminCourses
    /admin/enrollments             → AdminEnrollments
    /admin/assignments             → AdminAssignments
    /admin/submissions             → AdminSubmissions
  
  /instructor                      → InstructorShell (Guard: Instructor)
    /instructor/dashboard          → InstructorDashboard
    /instructor/my-courses         → InstructorMyCourses
    /instructor/my-assignments     → InstructorMyAssignments
    /instructor/submissions        → InstructorSubmissions
  
  /student                         → StudentShell (Guard: Student)
    /student/dashboard             → StudentDashboard
    /student/courses               → StudentCourses
    /student/my-courses            → StudentMyCourses
    /student/assignments           → StudentAssignments
```

---

## Authentication & Authorization Flow

### Registration Flow

```
┌────────┐                    ┌─────────┐                    ┌──────────┐
│ User   │                    │ Angular │                    │   API    │
└────────┘                    └─────────┘                    └──────────┘
    │                              │                              │
    │ 1. Fill registration form    │                              │
    │─────────────────────────────>│                              │
    │                              │                              │
    │                              │ 2. POST /api/auth/register   │
    │                              │     (email, password,        │
    │                              │      firstName, lastName,    │
    │                              │      roleId)                 │
    │                              │─────────────────────────────>│
    │                              │                              │
    │                              │                              │ 3. Validate data
    │                              │                              │    Check if email exists
    │                              │                              │    Hash password (BCrypt)
    │                              │                              │    Create user (IsApproved=false)
    │                              │                              │    Generate JWT token
    │                              │                              │
    │                              │ 4. Return AuthResponse       │
    │                              │    { token, role, email,     │
    │                              │      firstName, lastName }   │
    │                              │<─────────────────────────────│
    │                              │                              │
    │                              │ 5. Store token in            │
    │                              │    localStorage              │
    │                              │    Update user state         │
    │                              │                              │
    │ 6. Redirect to dashboard     │                              │
    │    (Note: User needs admin   │                              │
    │     approval to fully access)│                              │
    │<─────────────────────────────│                              │
```

### Login Flow

```
┌────────┐                    ┌─────────┐                    ┌──────────┐
│ User   │                    │ Angular │                    │   API    │
└────────┘                    └─────────┘                    └──────────┘
    │                              │                              │
    │ 1. Enter credentials         │                              │
    │─────────────────────────────>│                              │
    │                              │                              │
    │                              │ 2. POST /api/auth/login      │
    │                              │     (email, password)        │
    │                              │─────────────────────────────>│
    │                              │                              │
    │                              │                              │ 3. Find user by email
    │                              │                              │    Verify password (BCrypt)
    │                              │                              │    Generate JWT with claims:
    │                              │                              │    - NameIdentifier (UserId)
    │                              │                              │    - Email
    │                              │                              │    - Role
    │                              │                              │
    │                              │ 4. Return AuthResponse       │
    │                              │<─────────────────────────────│
    │                              │                              │
    │                              │ 5. Store token & user data   │
    │                              │    Set isAuthenticated=true  │
    │                              │                              │
    │ 6. Route to role-based       │                              │
    │    dashboard                 │                              │
    │<─────────────────────────────│                              │
```

### Authorized Request Flow

```
┌────────┐                    ┌─────────┐                    ┌──────────┐
│ User   │                    │ Angular │                    │   API    │
└────────┘                    └─────────┘                    └──────────┘
    │                              │                              │
    │ 1. Click "Create Course"     │                              │
    │─────────────────────────────>│                              │
    │                              │                              │
    │                              │ 2. AuthInterceptor adds      │
    │                              │    "Authorization: Bearer    │
    │                              │     <token>" header          │
    │                              │                              │
    │                              │ 3. POST /api/course          │
    │                              │    Headers: { Authorization  │
    │                              │             + JWT }          │
    │                              │─────────────────────────────>│
    │                              │                              │
    │                              │                              │ 4. JWT Middleware validates token
    │                              │                              │    Extract claims from token
    │                              │                              │
    │                              │                              │ 5. [Authorize(Roles="Instructor")]
    │                              │                              │    Check if user has required role
    │                              │                              │
    │                              │                              │ 6. Execute business logic
    │                              │                              │    Create course in database
    │                              │                              │
    │                              │ 7. Return created course     │
    │                              │<─────────────────────────────│
    │                              │                              │
    │ 8. Display success message   │                              │
    │<─────────────────────────────│                              │
```

---

## Detailed User Flows

### 1. Admin Flow: Approve New User

```
1. Admin logs in
2. Navigates to "Manage Users"
3. Component calls AdminUserService.getUsers()
4. API: GET /api/user (requires Admin role)
5. Database returns all users except Admins
6. Display users in Material Table with filter/sort
7. Admin clicks "Approve" button for pending user
8. Component calls AdminUserService.updateApproval(userId, true)
9. API: PATCH /api/user/approval { userId, isApproved: true }
10. Update User.IsApproved = true in database
11. Return success
12. Frontend updates table data
13. User can now access system fully
```

### 2. Instructor Flow: Create and Publish Course

```
1. Instructor logs in
2. Navigates to "My Courses"
3. Clicks "Create Course" button
4. Opens dialog with course form
5. Fills in: CourseName, CourseCode, Description, YouTubeUrl
6. Submits form
7. Component calls InstructorCourseService.createCourse(courseData)
8. API: POST /api/course (requires Instructor role)
   - Extract instructorId from JWT claims
   - Create course with Status="Draft", IsDraft=true
9. Course saved to database
10. Frontend displays new course with "Draft" status
11. Instructor edits course details
12. Clicks "Request Publish"
13. API: POST /api/course/{id}/request-publish
    - Update Status="Pending"
14. Admin sees course in "Pending Approval" list
15. Admin reviews and clicks "Approve Publish"
16. API: POST /api/course/{id}/approve-publish
    - Update Status="Published", IsDraft=false
17. Course now visible to all students in course catalog
```

### 3. Student Flow: Enroll and Submit Assignment

```
┌─────────────────────────────────────────────────────────────┐
│                    ENROLLMENT PHASE                          │
└─────────────────────────────────────────────────────────────┘
1. Student logs in
2. Navigates to "Browse Courses"
3. Component calls GET /api/course/published (public endpoint)
4. Display all published courses
5. Student clicks "Enroll" on a course
6. Component calls EnrollmentService.requestEnrollment(courseId)
7. API: POST /api/enrollment (requires Student role)
   - Extract studentId from JWT claims
   - Create enrollment with Status="Pending"
   - Check: student not already enrolled (unique constraint)
8. Display "Enrollment Pending" message

┌─────────────────────────────────────────────────────────────┐
│                  ADMIN APPROVAL PHASE                        │
└─────────────────────────────────────────────────────────────┘
9. Admin navigates to "Enrollments"
10. Sees pending enrollment
11. Clicks "Approve"
12. API: POST /api/enrollment/{id}/approval { isApproved: true }
13. Update Enrollment.Status="Approved"
14. Student can now access course content

┌─────────────────────────────────────────────────────────────┐
│                  ASSIGNMENT SUBMISSION                       │
└─────────────────────────────────────────────────────────────┘
15. Student navigates to "My Courses"
16. API: GET /api/enrollment/my (returns approved enrollments)
17. Student clicks on enrolled course
18. Views course assignments
19. API: GET /api/assignment (filtered by student's enrolled courses)
20. Student clicks "Submit" on an assignment
21. Opens submission dialog
22. Fills: SubmissionTitle, Solution, GoogleDriveLink
23. Submits form
24. API: POST /api/submission (requires Student role)
    - Extract studentId from JWT claims
    - Validate: student is enrolled in course (approved)
    - Validate: assignment belongs to enrolled course
    - Check: student hasn't already submitted (unique constraint)
25. Create submission record
26. Display success message
27. Instructor can now view submission in their portal
```

### 4. Instructor Flow: View Submissions

```
1. Instructor logs in
2. Navigates to "Submissions"
3. Component calls SubmissionService.getSubmissions()
4. API: GET /api/submission (requires authentication)
   - Extract userId and role from JWT
   - If Instructor: return only submissions for their assignments
   - If Admin: return all submissions
5. Backend logic:
   - Find all assignments created by this instructor
   - Get all submissions for those assignments
   - Include student and assignment details
6. Display submissions in sortable table
7. Instructor can view:
   - Student name
   - Assignment title
   - Submission title
   - Solution text
   - Google Drive link
   - Submission date
```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | None | Login with email/password |
| POST | /api/auth/register | None | Register new user |

### User Management (Admin Only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/user | Admin | Get all users |
| GET | /api/user/{id} | Admin | Get user by ID |
| POST | /api/user | Admin | Create user |
| PUT | /api/user/{id} | Admin | Update user details |
| PATCH | /api/user/role | Admin | Update user role |
| PATCH | /api/user/approval | Admin | Approve/disapprove user |
| DELETE | /api/user/{id} | Admin | Delete user |

### Course Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/course/my | Instructor, Admin | Get my courses |
| GET | /api/course/{id} | Instructor, Admin | Get course by ID |
| GET | /api/course/published | None | Get all published courses |
| POST | /api/course | Instructor, Admin | Create course |
| PUT | /api/course/{id} | Instructor, Admin | Update course |
| POST | /api/course/{id}/request-publish | Instructor, Admin | Request publish |
| POST | /api/course/{id}/approve-publish | Instructor, Admin | Approve publish |
| DELETE | /api/course/{id} | Instructor, Admin | Delete course |

### Enrollment Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/enrollment | Student | Request enrollment |
| GET | /api/enrollment/my | Student | Get my enrollments |
| GET | /api/enrollment/all | Admin | Get all enrollments |
| POST | /api/enrollment/{id}/approval | Admin | Approve/disapprove enrollment |

### Assignment Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/assignment | Authenticated | Get assignments (filtered by role) |
| GET | /api/assignment/{id} | Authenticated | Get assignment by ID |
| POST | /api/assignment | Instructor, Admin | Create assignment |
| PUT | /api/assignment/{id} | Instructor, Admin | Update assignment |
| DELETE | /api/assignment/{id} | Instructor, Admin | Delete assignment |

### Submission Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/submission | Authenticated | Get submissions (filtered by role) |
| GET | /api/submission/{id} | Authenticated | Get submission by ID |
| POST | /api/submission | Student | Create submission |

---

## Security Implementation

### 1. Password Security
- **Hashing Algorithm**: BCrypt with automatic salt generation
- **Password Requirements**: Enforced on frontend (email format, strong password)
- **Storage**: Only password hash stored in database

### 2. JWT Token Security
```
Token Structure:
{
  "nameid": "userId",
  "email": "user@example.com",
  "role": "Student",
  "iss": "LMS.Api.Jan",
  "aud": "LMS.Api.Jan",
  "exp": timestamp
}
```

- **Key**: 256-bit secret key stored in appsettings.json
- **Lifetime**: Configurable expiration
- **Validation**: Validates Issuer, Audience, Lifetime, and Signature

### 3. Authorization Layers

#### Controller Level
```csharp
[Authorize(Roles = "Admin")]        // Admin only
[Authorize(Roles = "Instructor")]   // Instructor only
[Authorize(Roles = "Instructor,Admin")] // Both roles
```

#### Service Level
- Additional business logic checks
- Example: Instructor can only edit their own courses

### 4. CORS Policy
- Configured to allow only Angular app (http://localhost:4200)
- Allows credentials for cookie/token support

### 5. Frontend Guards
- **AuthGuard**: Validates token existence
- **RoleGuard**: Validates user has required role for route

### 6. Error Handling
- **ExceptionMiddleware**: Catches all exceptions
- Returns standardized error response
- Prevents sensitive error details from leaking to client

---

## Testing Strategy

### Backend Testing (xUnit)

Located in: `LMS.Api.Tests/`

#### Test Categories:

1. **AuthenticationTests.cs**
   - Login with valid/invalid credentials
   - Registration with duplicate email
   - JWT token generation

2. **RoleAndApprovalTests.cs**
   - User role assignment
   - User approval/disapproval
   - Access control based on approval status

3. **CourseManagementTests.cs**
   - Course creation by instructor
   - Course publish workflow (Draft → Pending → Published)
   - Course filtering by status
   - Authorization checks (instructor can't edit other's courses)

4. **EnrollmentTests.cs**
   - Student enrollment request
   - Duplicate enrollment prevention
   - Enrollment approval workflow
   - Enrollment status filtering

5. **AssignmentAndSubmissionTests.cs**
   - Assignment creation for courses
   - Submission by enrolled students
   - Submission validation (must be enrolled)
   - Duplicate submission prevention

#### Testing Approach:
- **In-Memory Database**: Each test uses isolated in-memory database
- **Arrange-Act-Assert Pattern**
- **Coverage**: Controllers, Services, Repositories

### Frontend Testing
- **Framework**: Vitest (configured in package.json)
- Component unit tests
- Service integration tests

---

## Data Flow Example: Complete Assignment Submission

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: STUDENT VIEWS ASSIGNMENTS                                  │
└─────────────────────────────────────────────────────────────────────┘

StudentAssignmentsComponent.ngOnInit()
    │
    ├─> AssignmentService.getMyAssignments()
    │       │
    │       ├─> HTTP GET /api/assignment
    │       │   Headers: { Authorization: Bearer <JWT> }
    │       │
    │       └─> AssignmentController.GetAssignments()
    │               │
    │               ├─> Extract userId and role from JWT claims
    │               │
    │               └─> AssignmentService.GetAssignmentsAsync(userId, isAdmin, isInstructor, isStudent)
    │                       │
    │                       ├─> If Student: Get assignments for enrolled courses
    │                       │   - Find all approved enrollments for student
    │                       │   - Get assignments for those courses
    │                       │
    │                       └─> AssignmentRepository.GetAssignmentsForStudent(studentId)
    │                               │
    │                               └─> EF Core Query:
    │                                   SELECT a.* FROM Assignments a
    │                                   INNER JOIN Enrollments e ON e.CourseId = a.CourseId
    │                                   WHERE e.StudentId = @studentId 
    │                                     AND e.Status = 'Approved'
    │
    └─> Display assignments in Material Table

┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: STUDENT SUBMITS ASSIGNMENT                                 │
└─────────────────────────────────────────────────────────────────────┘

Student clicks "Submit" button
    │
    ├─> Open SubmissionDialogComponent
    │       │
    │       └─> Student fills form:
    │           - Submission Title
    │           - Solution (text)
    │           - Google Drive Link (optional)
    │
    └─> Student clicks "Submit"
            │
            └─> SubmissionService.createSubmission(submissionData)
                    │
                    ├─> HTTP POST /api/submission
                    │   Headers: { Authorization: Bearer <JWT> }
                    │   Body: {
                    │     assignmentId: 5,
                    │     submissionTitle: "My Solution",
                    │     solution: "Implementation details...",
                    │     googleDriveLink: "https://drive.google.com/..."
                    │   }
                    │
                    └─> SubmissionController.Create(dto)
                            │
                            ├─> Extract userId (studentId) from JWT
                            │
                            └─> SubmissionService.CreateSubmissionAsync(studentId, dto)
                                    │
                                    ├─> Validation:
                                    │   1. Check assignment exists
                                    │   2. Check student is enrolled in course (Approved)
                                    │   3. Check student hasn't already submitted
                                    │
                                    └─> SubmissionRepository.CreateAsync(submission)
                                            │
                                            ├─> Create Submission entity:
                                            │   - AssignmentId
                                            │   - StudentId
                                            │   - SubmissionTitle
                                            │   - Solution
                                            │   - GoogleDriveLink
                                            │   - SubmittedAt (DateTime.UtcNow)
                                            │
                                            ├─> _context.Submissions.Add(submission)
                                            │
                                            └─> _context.SaveChangesAsync()
                                                    │
                                                    └─> SQL INSERT INTO Submissions...

┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: INSTRUCTOR VIEWS SUBMISSION                                │
└─────────────────────────────────────────────────────────────────────┘

InstructorSubmissionsComponent.ngOnInit()
    │
    └─> SubmissionService.getSubmissions()
            │
            └─> HTTP GET /api/submission
                Headers: { Authorization: Bearer <JWT> }
                    │
                    └─> SubmissionController.GetSubmissions()
                            │
                            ├─> Extract userId (instructorId) and role from JWT
                            │
                            └─> SubmissionService.GetSubmissionsAsync(userId, isInstructor)
                                    │
                                    ├─> If Instructor:
                                    │   Get submissions for their assignments only
                                    │
                                    └─> SubmissionRepository.GetSubmissionsForInstructor(instructorId)
                                            │
                                            └─> EF Core Query:
                                                SELECT s.*, st.FirstName, st.LastName, a.Title
                                                FROM Submissions s
                                                INNER JOIN Assignments a ON s.AssignmentId = a.Id
                                                INNER JOIN Users st ON s.StudentId = st.Id
                                                WHERE a.InstructorId = @instructorId
                                                ORDER BY s.SubmittedAt DESC
```

---

## Configuration Files

### Backend Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=LMS_DB_Jan;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "THIS_IS_A_VERY_SECURE_256_BIT_JWT_SECRET_KEY_FOR_JAN",
    "Issuer": "LMS.Api.Jan",
    "Audience": "LMS.Api.Jan"
  }
}
```

### Frontend Configuration

- **API Base URL**: `https://localhost:7234/api`
- **Auth Token Key**: `lms_token` (in localStorage)
- **User Data Key**: `lms_user` (in localStorage)

---

## Deployment Considerations

### Backend
1. Update connection string to production database
2. Change JWT secret key
3. Configure CORS for production domain
4. Enable HTTPS
5. Set up proper logging
6. Configure environment variables

### Frontend
1. Update API base URL in services
2. Build for production: `ng build --prod`
3. Deploy static files to web server
4. Configure routing (SPA fallback)

### Database
1. Run Entity Framework migrations
2. Ensure DataSeeder runs on first deployment
3. Set up database backups
4. Configure database security

---

## Key Design Patterns Used

### 1. Repository Pattern
- Abstracts data access logic
- Enables unit testing with mock repositories
- Centralizes database queries

### 2. Service Layer Pattern
- Separates business logic from controllers
- Reusable across different controllers
- Easier to test and maintain

### 3. DTO Pattern
- Decouples API contracts from database models
- Controls what data is exposed
- Enables versioning

### 4. Dependency Injection
- All services/repositories injected via constructor
- Configured in Program.cs
- Enables loose coupling

### 5. Guard Pattern (Frontend)
- Protects routes based on authentication/authorization
- Centralized security logic

---

## Seeded Test Data

### Users
- **Admin**: admin@lms.com / Admin@123
- **Instructors**: 
  - instructor@lms.com / Instructor@123 (Approved)
  - instructor2@lms.com / Instructor@123 (Approved)
  - instructor3@lms.com / Instructor@123 (Pending Approval)
- **Students**: 
  - student@lms.com / Student@123 (Approved)
  - student2@lms.com to student10@lms.com / Student@123 (Various approval states)

### Courses
- 7 courses pre-seeded
- Various statuses: Published, Pending, Draft
- Include YouTube links and descriptions

### Assignments
- 11 assignments across different courses
- Various start/end dates (some active, some expired)
- Some with Google Drive links

### Enrollments
- Multiple student enrollments
- Different statuses: Approved, Pending, Disapproved

### Submissions
- Sample submissions from students
- Linked to specific assignments
