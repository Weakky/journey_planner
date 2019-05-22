export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StopWithString {
  id: number;
  train_id: number;
  station_id: number;
  departure: string;
  arrival: string;
}

export interface StopWithNumber {
  id: number;
  train_id: number;
  station_id: number;
  departure: number;
  arrival: number;
  departureHuman: string;
  arrivalHuman: string;
}
