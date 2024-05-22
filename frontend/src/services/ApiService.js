import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";  // 使用本地转发的地址

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const downloadDataset = async () => {
  try {
    const response = await api.get('/download-dataset');
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const trainYoloV8 = async ({ devices, batch }) => {
  try {
    const response = await api.post('/train-yolo-v8', { devices, batch });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const trainYoloV9 = async ({ devices, batch }) => {
  try {
    const response = await api.post('/train-yolo-v9', { devices, batch });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const evaluateYoloV8 = async (devices) => {
  try {
    const response = await api.post('/evaluate-yolo-v8', { devices });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const evaluateYoloV9 = async (devices) => {
  try {
    const response = await api.post('/evaluate-yolo-v9', { devices });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const evaluateYoloV8Best = async (devices) => {
  try {
    const response = await api.post('/evaluate-yolo-v8-best', { devices });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const evaluateYoloV9Best = async (devices) => {
  try {
    const response = await api.post('/evaluate-yolo-v9-best', { devices });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const getSystemInfo = async () => {
  try {
    const response = await api.get('/system-info');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};
