using Microsoft.EntityFrameworkCore;
using LMS.Api.Jan.Data;
using LMS.Api.Jan.Models;
using LMS.Api.Jan.Repositories.Interfaces;

namespace LMS.Api.Jan.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.Role)
            .OrderBy(u => u.Id)
            .ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task AddUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserRoleAsync(int id, int roleId)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return;

        user.RoleId = roleId;
        await _context.SaveChangesAsync();
    }

    public async Task UpdateApprovalStatusAsync(int id, bool isApproved)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return;

        user.IsApproved = isApproved;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }
}

