import {
  RenderInstruction,
  ValidateResult,
} from "aurelia-validation";

export class BootstrapFormRenderer {
  render(instruction: RenderInstruction) {
    for (let { result, elements } of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element: Element, result: ValidateResult) {
    if (result.valid) {
      if (!element.classList.contains("is-invalid")) {
        element.classList.add("is-valid");
      }
    } else {
      element.classList.remove("is-valid");
      element.classList.add("is-invalid");

      // add help-block
      const message = document.createElement("div");
      message.id = `validation-message-${result.id}`;
      message.className = "invalid-feedback";
      message.textContent = result.message;
  
      element.parentElement.appendChild(message);
    }
  }

  remove(element: Element, result: ValidateResult) {
    if (result.valid) {
      if (element.classList.contains("is-invalid")) {
        element.classList.remove("is-invalid");
      }
    } else {
      const message = element.parentElement.querySelector(
        `#validation-message-${result.id}`
      );
      if (message) {
        element.parentElement.removeChild(message);
        if (
          element.parentElement.querySelectorAll(".invalid-feedback")
            .length === 0
        ) {
          element.parentElement.classList.remove("is-invalid");
        }
      }
    }
  }
}
