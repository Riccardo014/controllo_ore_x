export interface RtAlert {
  id: number;
  type: 'success' | 'warning' | 'error';
  title: string;
  text: string;
  details?: any;
}
