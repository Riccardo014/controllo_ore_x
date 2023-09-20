export interface HoursExtraReadDto {
  _id: string;
  hours: number;
  notes: string;
  referent: string;
}

export interface HoursExtraCreateDto {
  hours: number;
  notes: string;
  referent: string;
}

export interface HoursExtraUpdateDto {
  hours?: number;
  notes?: string;
  referent?: string;
}
