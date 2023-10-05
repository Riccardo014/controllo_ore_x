import { CustomerReadDto, ProjectReadDto } from '../../api-interfaces/src';

export interface ProjectWithCustomer {
  project: ProjectReadDto;
  customer: CustomerReadDto;
}
