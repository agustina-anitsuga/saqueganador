import { Component } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { I18n } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-angular';

import awsExports from '../../aws-exports';

I18n.putVocabularies(translations);
const extraEsTranslations = {
  "Reset Password":"Cambiar contraseña",
  "Enter your email":"Ingrese su email",
  "Code *":"Código"
};
I18n.putVocabulariesForLanguage("es",extraEsTranslations);
I18n.setLanguage('es');

@Component({
  selector: 'authenticator',
  templateUrl: './authenticator.component.html'
})
export class UseAuthenticatorComponent {

  formFields : any = {
    signUp: {
      email: {
        order: 1,
        placeholder: 'Ingrese su email',
        isRequired: true,
        label: 'Email:'
      },
      preferred_username: {
        order: 2,
        placeholder: 'Ingrese su nombre de usuario',
        isRequired: true,
        label: 'Nombre de usuario:'
      },
      password: {
        order: 3,
        placeholder: 'Ingrese su contraseña',
        isRequired: true,
        label: 'Contraseña:'
      },
      confirm_password: {
        order: 4,
        placeholder: 'Repita su contraseña',
        isRequired: true,
        label: 'Confirmar contraseña:'
      }
    },
  }

  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(awsExports);
  }

  username( user : any ){
    return JSON.stringify(user.attributes.preferred_username);
  }
}