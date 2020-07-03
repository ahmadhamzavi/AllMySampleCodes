import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
@inject(DialogController)
export class ResetDialog {
  constructor(private controller:DialogController) {
  }
  activate() {
  }
}
