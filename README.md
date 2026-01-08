
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

<h2>⚠️ Common Issues & Fixes</h2>
<ul>
  <li><b>CORS Error:</b> Ensure CORS is enabled in <code>Program.cs</code></li>
  <li><b>JWT Unauthorized:</b> Verify token expiration and secret key</li>
  <li><b>Database Error:</b> Check SQL Server service and connection string</li>
</ul>
