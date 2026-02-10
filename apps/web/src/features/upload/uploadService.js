import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Your Node.js server

export const uploadFileToS3 = async (file) => {
  // 1. Ask your backend for a one-time use URL
  const { data } = await axios.get(`${API_BASE_URL}/docs/upload-url`, {
    params: { fileName: file.name, fileType: file.type }
  });

  const { signedUrl, key } = data;

  // 2. Upload the file DIRECTLY to S3 using the signed URL
  await axios.put(signedUrl, file, {
    headers: { 'Content-Type': file.type }
  });

  // 3. Tell your backend the upload is finished so it can start AI processing
  await axios.post(`${API_BASE_URL}/docs`, { s3Key: key, title: file.name });

  return key;
};