import { INDEX_CONFIGURATION_KEY, TableConfiguration } from '@api-interfaces';
import { BaseEntityTemplate } from '@shared/classes/base-entity-template.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class IndexConfiguration extends BaseEntityTemplate {
  @Column({ type: 'varchar' })
  key: INDEX_CONFIGURATION_KEY;

  @Column({ type: 'json' })
  configuration: TableConfiguration;
}

