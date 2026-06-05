class UploadService {
    buildFilePayload(filename: string) {
        return {
            filename,
            url: `/uploads/${filename}`,
        };
    }
}

export default new UploadService();
