import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
@inject(DialogController)
export class MessageDialog {
  isError: boolean;
  errorMessages: ValidationError[];
  constructor(private controller: DialogController) {}
  activate(messages) {
    this.errorMessages = messages;
    if (this.errorMessages) {
      this.isError = true;
      this.errorMessages.forEach((errorMessage) => {
      });
    }
    else{
      this.isError = false;
    }
  }
}
export class ValidationError {
  errorMessage: string;
}
