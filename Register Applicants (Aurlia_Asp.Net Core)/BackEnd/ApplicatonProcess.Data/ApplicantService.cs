using ApplicatonProcess.Domain;
using ApplicatonProcess.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicatonProcess.Data
{
    public class ApplicantService : IRepository<Applicant, int>
    {
        private ApplicationDBContext _context;
        public ApplicantService(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<int> CreateAsync(Applicant applicant)
        {
            _context.Applicants.Add(applicant);
            await _context.SaveChangesAsync();
            return applicant.Id;
        }

        public async Task<bool> DeleteAsync(Applicant applicant)
        {
            _context.Applicants.Remove(applicant);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<Applicant> GetAsync(int Id)
        {
            return await _context.Applicants.FindAsync(Id);
        }

        public async Task<List<Applicant>> GetAllAsync()
        {
            return await _context.Applicants.ToListAsync();
        }

        public async Task<bool> UpdateAsync(Applicant applicant)
        {
            _context.Update(applicant);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
