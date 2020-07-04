using ApplicatonProcess.Domain;
using Swashbuckle.AspNetCore.Filters;

namespace ApplicatonProcess.Web
{
    public class ApplicantExample : IExamplesProvider<Applicant>
    {
        public Applicant GetExamples()
        {
            return new Applicant()
            {
                Name = "13245",
                FamilyName = "123465",
                CountryOfOrigign = "aruba",
                Age = 30,
                Address = "01234567891234567",
                EMailAddress = "asfd@gdfg.fgfd",
            };
        }
    }
}
