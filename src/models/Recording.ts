
export default interface Recording {
  blob?: Blob;
  url?: string;
  name: string;
  inProgress: boolean;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  id: string;
}
