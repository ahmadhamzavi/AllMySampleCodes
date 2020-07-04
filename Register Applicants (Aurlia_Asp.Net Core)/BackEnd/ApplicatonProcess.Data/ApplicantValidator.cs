using FluentValidation;
using ApplicatonProcess.Domain;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ApplicatonProcess.Data
{
    public class ApplicantValidator : AbstractValidator<Applicant>
    {
        public ApplicantValidator()
        {
            RuleFor(applicant => applicant.Name).NotEmpty().WithMessage("Name is missing").MinimumLength(5).WithMessage("FamilyName must be at least 5."); 
            RuleFor(applicant => applicant.FamilyName).NotEmpty().WithMessage("FamilyName is missing").MinimumLength(5).WithMessage("FamilyName must be at least 5.");
            RuleFor(applicant => applicant.Address).NotEmpty().WithMessage("Address is missing").MinimumLength(10).WithMessage("Address must be at least 10.");
            RuleFor(applicant => applicant.EMailAddress).NotEmpty().WithMessage("EMailAddress is missing").EmailAddress().WithMessage("EMailAddress is not a valid email.");
            RuleFor(applicant => applicant.Age).GreaterThanOrEqualTo(20).LessThanOrEqualTo(60).WithMessage("Age must be between 20 and 60.");
            RuleFor(applicant => applicant.Hired).NotNull().WithMessage("Hires is missing"); 
            RuleFor(applicant => applicant.CountryOfOrigign)
                .NotEmpty()
                .MustAsync(async (countryOfOrigign, cancellation) => await CountryValidationAsync(countryOfOrigign))
                .WithMessage("Country is not valid");
        }
        public async Task<bool> CountryValidationAsync(string country)
        {
            try
            {
                HttpClient client;
                var url = new Uri($"https://restcountries.eu/rest/v2/name/{country}?fullText=true");
                if (url.Scheme == Uri.UriSchemeHttps)
                {
                    HttpClientHandler clientHandler = new HttpClientHandler();
                    clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
                    client = new HttpClient(clientHandler);
                }
                else { client = new HttpClient(); }

                var response = await client.GetAsync(url);
                return response.StatusCode == System.Net.HttpStatusCode.OK;
            }
            catch { }
            return false;
        }
    }
}
