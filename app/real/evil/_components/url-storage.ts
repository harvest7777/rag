export interface UrlStorage {
  findAllUploads(): Promise<Array<ListEntry>>;
  findUploadsByFingerprint(fingerprint: string): Promise<Array<ListEntry>>;

  removeUpload(urlStorageKey: string): Promise<void>;

  // Returns the URL storage key, which can be used for removing the upload.
  addUpload(fingerprint: string, upload: ListEntry): Promise<string>;
}
