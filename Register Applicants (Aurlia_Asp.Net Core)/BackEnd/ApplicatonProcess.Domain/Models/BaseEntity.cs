using System;
using System.Collections.Generic;
using System.Text;

namespace ApplicatonProcess.Domain.Models
{
    public class BaseEntity<TPrimary>
    {
        public TPrimary Id { get; set; }
    }
}
