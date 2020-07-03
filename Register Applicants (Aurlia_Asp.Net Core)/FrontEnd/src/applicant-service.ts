
import { Applicant } from "./Applicant";
import { BaseService } from "base-service";
const axios = require('axios').default;
export class ApplicantService extends BaseService {
  getApplicants() {
    return axios.get(this.url);
  }

  getApplicantDetails(id) {
    return axios.get(`${this.url}/${id}`);
  }
  createApplicant(applicant) {
    return axios.post(this.url,applicant);
  }
  updateApplicant(applicant) {
    return axios.put(this.url,applicant);
  }
  deleteApplicant(applicant) {
   return axios.delete(this.url, {
      headers: {    
      },
      data: {
        id:applicant.id
      }
    });
  }
}
