import { RtFormError } from './rt-form-error.interface';

export const RT_FORM_ERRORS: { [key: string]: RtFormError } = {
  REQUIRED: { name: 'required', message: 'Il campo è obbligatorio' },
  EMAIL: { name: 'email', message: 'Email non valida' },
  MISMATCH: { name: 'mismatch', message: 'Le password non coincidono' },
  PASSWORD: {
    name: 'strong',
    message:
      'La password deve contenere almeno 8 caratteri, incluso un numero, una lettera maiuscola e di carattere speciale',
  },
};

