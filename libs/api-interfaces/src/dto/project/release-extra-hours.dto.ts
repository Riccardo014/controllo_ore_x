export interface ReleaseExtraHoursReadDto {
  _id: string;
  hours: number;
  notes: string;
  referent: string;
  releaseId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

export interface ReleaseExtraHoursCreateDto {
  hours: number;
  notes: string;
  referent: string;
  releaseId: string;
}

export interface ReleaseExtraHoursUpdateDto {
  hours?: number;
  notes?: string;
  referent?: string;
  releaseId?: string;
}
