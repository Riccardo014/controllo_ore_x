# Generatore

## Generatore di files per Nestjs

In particolare il comando:

```
yarn nx generate @controllo-ore-x/tools:api-module --name=myModule --no-interactive
```

Genererà:

- Una cartella `my-module/` nella posizione: `apps/api/src/app/modules/` contenente:

  - il **modulo**: `my-module.module.ts`
  - nella cartella `controllers/` il **controller**: `my-module.controller.ts`;
  - nella cartella `dtov/` le **dtov**:
    - `my-module-create.dtov.ts`
    - `my-module-update.dtov.ts`
  - nella cartella `entities/` la **entity**: `my-module.entity.ts`;
  - nella cartella `services/` la **entity**: `my-module.service.ts`;

- Una cartella nella posizione: `libs/api-interfaces/src/dto/my-module` contenente le **dto**: `my-module.dto.ts`

Invece, con il comando:

```
yarn nx generate @controllo-ore-x/tools:api-module --name=mySon --module=myModule --no-interactive
```

Genererà:

- Nella cartella nella posizione: `apps/api/src/app/modules/my-module/`

  - nella cartella `controllers/` il **controller**: `my-son.controller.ts`;
  - nella cartella `dtov/` le **dtov**:
    - `my-son-create.dtov.ts`
    - `my-son-update.dtov.ts`
  - nella cartella `entities/` la **entity**: `my-son.entity.ts`;
  - nella cartella `services/` la **entity**: `my-son.service.ts`;

- Nella cartella nella posizione: `libs/api-interfaces/src/dto/my-module` contenente le **dto**: `my-son.dto.ts`

**_Nota:_** _tutti i file generati avranno già uno scheletro_

**_Nota:_** verranno automaticamente aggiornati gli **export** del file `libs/api-interfaces/src/index.ts`
