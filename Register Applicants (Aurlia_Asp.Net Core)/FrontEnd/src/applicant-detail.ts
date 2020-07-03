import { ResetDialog } from "./reset-dialog";
import { inject, NewInstance, observable } from "aurelia-framework";
import { ApplicantService } from "./applicant-service";
import { ApplicantUpdated, ApplicantViewed ,ApplicantDeleted } from "./events";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { I18N } from "aurelia-i18n";
import { BootstrapFormRenderer } from "bootstrap-form-renderer";
import { Applicant } from "Applicant";
import {
  ValidationControllerFactory,
  ValidationRules,
  Validator,
  validateTrigger,
  ValidationController,
} from "aurelia-validation";
import { ServerConnectionDialog } from "server-connection-dialog";
import { MessageDialog } from "message-dialog";

@inject(
  ApplicantService,
  EventAggregator,
  ValidationControllerFactory,
  Validator,
  BootstrapFormRenderer,
  NewInstance.of(ValidationController),
  DialogService,
  I18N
)
export class ApplicantDetail {
  routeConfig;
  @observable({ name: "name", changeHandler: "applicantChanged" })
  applicant: Applicant;
  originalApplicant: Applicant;
  private controller: ValidationController;
  canSave: boolean = true;
  isResetActive: boolean = false;
  full_name: string;
  form; 
  rules = ValidationRules.ensure("name")
    .required()
    .minLength(5)
    .ensure("familyName")
    .required()
    .minLength(5)
    .ensure("address")
    .required()
    .minLength(10)
    .ensure("eMailAddress")
    .required()
    .email()
    .ensure("age")
    .required()
    .min(20)
    .max(60)
    .ensure("countryOfOrigign")
    .required()
    .on(Applicant).rules;
  constructor(
    private applicantService: ApplicantService,
    private eventAggregator: EventAggregator,
    private controllerFactory: ValidationControllerFactory,
    private validator: Validator,
    private bootstrapFormRenderer: BootstrapFormRenderer,
    controller: ValidationController,
    private dialogService: DialogService,
    private i18n: I18N
  ) {
    this.controller = controller; 
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.subscribe(() => this.validateWhole());
  }
  private validateWhole() {
    this.validator.validateObject(this.applicant).then((results) => {
      this.canSave = results.every((result) => result.valid);
      this.ActiveReset();
    });
  }
  setValidation() {
    this.controller.addObject(this.applicant, this.rules);
    this.resetFormStyle();
    this.controller.reset();
  }
  resetFormStyle() {
    if (this.form) {
      for (let i = 0; i < this.form.length; i++) {
        (<Element>this.form[i]).classList.remove("is-invalid");
        (<Element>this.form[i]).classList.remove("is-valid");
      }
    }
  }

  activate(params, routeConfig) {
    let _this = this;
    this.routeConfig = routeConfig;
    this.controller.removeRenderer(this.bootstrapFormRenderer);
    this.controller.addRenderer(this.bootstrapFormRenderer);
    if (params.id == 0) {
      _this.applicant = new Applicant();
      _this.fillForm();
      return;
    }
    return this.applicantService
      .getApplicantDetails(params.id)
      .then((response) => {
        _this.controller.removeObject(_this.applicant);
        if (response.data) {
          _this.applicant = <Applicant>response.data;
        } else {
          _this.applicant = new Applicant();
        }
        _this.fillForm();
      })
      .catch(() => {
        // handle error
        this.dialogService
          .open({ viewModel: ServerConnectionDialog })
          .whenClosed((response) => {
            if (!response.wasCancelled) {
              _this.activate(params, routeConfig);
            } else {
            }
          });
      });
  }

  fillForm() {
    this.originalApplicant = this.applicant;
    this.routeConfig.navModel.setTitle(this.applicant.name);
    this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
    this.eventAggregator.publish(new ApplicantViewed(this.applicant));
    if (this.applicant.name) {
      this.full_name = `${this.applicant.name} ${this.applicant.familyName}`;
    } else {
      this.full_name = this.i18n.tr("new_applicant");
    }

    this.setValidation();
    this.ActiveReset();
  }

  ActiveReset() {
    if (
      this.applicant.name !== "" ||
      this.applicant.familyName !== "" ||
      this.applicant.countryOfOrigign !== "" ||
      this.applicant.address !== "" ||
      this.applicant.eMailAddress !== ""
    ) {
      this.isResetActive = true;
      return;
    }
    this.isResetActive = false;
    return;
  }

  save() {
    let _this = this;
    this.controller.validate().then((v) => {
      if (v.valid) {
      if (_this.applicant.id == 0) {
        _this.applicantService
          .createApplicant(_this.applicant)
          .then((response) => {
            if (response.status == 200) {
              _this.applicant.id = response.data;
              _this.successSave();
            }
          })
          .catch((error) => {
            if (error.response.status == 400) {
              _this.dialogService.open({
                viewModel: MessageDialog,
                model: error.response.data,
              });
            }
          });
      } else {
        _this.applicantService
          .updateApplicant(_this.applicant)
          .then((response) => {
            if (response.status == 200) {
              _this.successSave();
            }
          });
      }
      }
    });
  }

  successSave() {
    this.dialogService.open({
      viewModel: MessageDialog,
      model: null,
    });
    this.routeConfig.navModel.setTitle(this.applicant.name);
    this.full_name = `${this.applicant.name} ${this.applicant.familyName}`;
    this.eventAggregator.publish(new ApplicantUpdated(this.applicant));
  }
  successDelete() {
    this.dialogService.open({
      viewModel: MessageDialog,
      model: null,
    });
    this.applicant= new Applicant();
    this.eventAggregator.publish(new ApplicantDeleted(this.applicant));
  }

  reset() {
    this.dialogService
      .open({ viewModel: ResetDialog })
      .whenClosed((response) => {
        if (!response.wasCancelled) {
          let id = this.applicant.id;
          this.applicant = new Applicant();
          this.applicant.id = id;
          this.controller.reset();
          this.isResetActive = true;
        } else {
        }
      });
  }
  delete() {
    this.applicantService.deleteApplicant(this.applicant).then((response) => {
      if (response.status == 200) {
        this.successDelete();
      }
    });
  }
}
