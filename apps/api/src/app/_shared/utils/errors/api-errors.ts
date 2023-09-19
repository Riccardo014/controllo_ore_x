import { IErrorBody } from './i-error-body';

export class ApiErrors {
    static readonly UNUTHORIZED_OPERATION: IErrorBody = {
        code: '001',
        scope: 'General',
        message: 'L\'utente non è autorizzato ad eseguire questa operazione'
    };
    static readonly MISSING_USER_DATA: IErrorBody = {
        code: '002',
        scope: 'General',
        message: 'Si è verificato un errore durante il recupero dei deti dell\'utente'
    };
}

