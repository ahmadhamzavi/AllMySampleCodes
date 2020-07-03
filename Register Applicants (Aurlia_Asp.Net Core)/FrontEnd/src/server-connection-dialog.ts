import { inject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";
@inject(DialogController)
export class ServerConnectionDialog {
  constructor(private controller:DialogController) {
  }
  activate() {
  }
}
