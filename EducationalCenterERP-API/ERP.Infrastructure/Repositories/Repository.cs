using ERP.Application.Interfaces;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


namespace ERP.Infrastructure.Repositories;


public class Repository<T> : IRepository<T>
where T : class
{

    private readonly ERPDbContext _context;


    public Repository(ERPDbContext context)
    {
        _context = context;
    }



    public async Task<T?> GetByIdAsync(Guid id)
    {

        return await _context.Set<T>()
            .FindAsync(id);

    }



    public async Task<List<T>> GetAllAsync()
    {

        return await _context.Set<T>()
            .ToListAsync();

    }



    public async Task AddAsync(T entity)
    {

        await _context.Set<T>()
            .AddAsync(entity);

    }



    public void Update(T entity)
    {
        _context.Set<T>()
            .Update(entity);
    }



    public void Delete(T entity)
    {
        _context.Set<T>()
            .Remove(entity);
    }



    public IQueryable<T> Query()
    {
        return _context.Set<T>();
    }

}