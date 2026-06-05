import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

/**
 * @param {File} file
 * @returns {Promise<{ filename: string, url: string }>}
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const body = await axiosInstance.post('/api/uploads/image', formData, {
    headers: { 'Content-Type': undefined },
  });
  return getApiData(body);
}

/**
 * @param {File[]} files
 * @returns {Promise<Array<{ filename: string, url: string }>>}
 */
export async function uploadImages(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }
  const body = await axiosInstance.post('/api/uploads/images', formData, {
    headers: { 'Content-Type': undefined },
  });
  return getApiData(body);
}

export const uploadService = {
  uploadImage,
  uploadImages,
};
