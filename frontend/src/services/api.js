import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (details) => api.post('/auth/register', details),
};

export const studentService = {
    uploadStudent: (formData) => api.post('/student/upload_student', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    bulkUpload: (formData) => api.post('/student/bulk_upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getStudents: () => api.get('/student/students'),
};

export const jobService = {
    createJob: (jobData) => api.post('/job/create_job', jobData),
    getJobs: () => api.get('/job/jobs'),
};

export const rankingService = {
    rankStudents: (jobId) => api.post('/ranking/rank_students', { job_id: jobId }),
    getRankings: (jobId) => api.get(`/ranking/rankings/${jobId}`),
    downloadRankingsCSV: (jobId) => api.get(`/ranking/rankings/${jobId}/download`, { responseType: 'blob' }),
};

export default api;
