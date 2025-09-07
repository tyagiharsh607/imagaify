export enum AppStatus {
  IDLE,
  PROCESSING,
  SUCCESS,
  ERROR,
}

export interface ImageFile {
  file: File;
  dataUrl: string;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
}
