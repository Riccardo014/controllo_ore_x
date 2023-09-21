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
        message: 'Si è verificato un errore durante il recupero dei dati dell\'utente'
    };
    static readonly WRONG_CREDENTIALS: IErrorBody = {
        code: '003',
        scope: 'Auth',
        message: 'Le credenziali non sono corrette'
    };
    static readonly MISSING_TOKEN: IErrorBody = {
        code: '004',
        scope: 'Auth',
        message: 'Non è stato trovato il token di autenticazione'
    };
    static readonly EXPIRED_TOKEN: IErrorBody = {
        code: '005',
        scope: 'Auth',
        message: 'Il token di autenticazione è scaduto'
    };
    static readonly PROJECT_CREATION_WENT_WRONG: IErrorBody = {
        code: '006',
        scope: 'Project',
        message: 'Si è verificato un errore durante la creazione del progetto'
    };

}

