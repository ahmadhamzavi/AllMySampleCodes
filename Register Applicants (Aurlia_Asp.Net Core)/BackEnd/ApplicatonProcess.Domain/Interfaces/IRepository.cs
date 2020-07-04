using ApplicatonProcess.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ApplicatonProcess.Domain.Interfaces
{
    public interface IRepository<TEntity,TPrimary> where TEntity:BaseEntity<TPrimary>
    {
        public Task<TPrimary> CreateAsync(TEntity entity);
        public Task<TEntity> GetAsync(TPrimary Id);
        public Task<List<TEntity>> GetAllAsync();
        public Task<bool> UpdateAsync(TEntity entity);
        public Task<bool> DeleteAsync(TEntity entity);

    }
}
