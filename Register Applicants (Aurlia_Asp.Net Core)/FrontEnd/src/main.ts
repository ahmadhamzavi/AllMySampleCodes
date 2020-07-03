import { Aurelia } from "aurelia-framework";
import * as environment from "../config/environment.json";
import { PLATFORM } from "aurelia-pal";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { validationMessages, ValidationMessageProvider } from "aurelia-validation";
import { I18N, Backend, TCustomAttribute } from "aurelia-i18n";
// import XHR from "i18next-xhr-backend";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName("resources/index"))
    .plugin(PLATFORM.moduleName("aurelia-validation"))
    .plugin(PLATFORM.moduleName("aurelia-dialog"))
    .plugin(PLATFORM.moduleName("aurelia-i18n"), (instance) => {
      // instance.i18next.use(XHR);
      let aliases = ["t", "i18n"];
      // add aliases for 't' attribute
      TCustomAttribute.configureAliases(aliases);

      // register backend plugin
      instance.i18next.use(Backend.with(aurelia.loader));
      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading

      return instance.setup({
        // backend: {
        //   // <-- configure backend settings
        //   loadPath: "locales/{{lng}}/{{ns}}.json", // <-- XHR settings for where to get the files from
        // },
        // attributes: aliases,
        // lng: "en",
        // fallbackLng: "en",
        // debug: true,
        // lowerCaseLng: true,
        // load: "currentOnly",
        backend: {
          // <-- configure backend settings
          loadPath: "locales/{{lng}}/{{ns}}.json", // <-- XHR settings for where to get the files from
        },
        attributes: aliases,
        lng: "en",
        fallbackLng: "en",
        load: "currentOnly",
        debug: false,
      });
    });
  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName("aurelia-testing"));
  }
  ValidationResorsesConfig.changeDefaultMessages(aurelia);
  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName("app")));
}
export class ValidationResorsesConfig {
  static changeDefaultMessages(aurelia) {
    ValidationMessageProvider.prototype.getMessage = function(key) {
      const i18n = aurelia.container.get(I18N);
      const translation = i18n.tr(`errorMessages.${key}`);
      return this.parser.parse(translation);
    };
  
    ValidationMessageProvider.prototype.getDisplayName = function(propertyName, displayName) {
      if (displayName !== null && displayName !== undefined) {
        return displayName;
      }
      const i18n = aurelia.container.get(I18N);
      return i18n.tr(propertyName);
    };
  }
}
