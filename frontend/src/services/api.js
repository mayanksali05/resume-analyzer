import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Ensure the URL starts with http:// or https://
if (API_BASE_URL && !API_BASE_URL.startsWith('http')) {
    API_BASE_URL = `https://${API_BASE_URL}`;
}

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the user's email in headers
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
            config.headers['X-User-Email'] = user.email;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (details) => api.post('/auth/register', details),
    verifyEmail: (data) => api.post('/auth/verify', data),
    resendCode: (email) => api.post('/auth/resend-code', { email }),
};

export const studentService = {
    uploadStudent: (formData) => api.post('/student/upload_student', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    bulkUpload: (formData) => api.post('/student/bulk_upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getStudents: () => api.get('/student/students'),
    deleteStudent: (studentId) => api.delete(`/student/students/${studentId}`),
};

export const jobService = {
    createJob: (jobData) => api.post('/job/create_job', jobData),
    getJobs: () => api.get('/job/jobs'),
    updateJob: (jobId, jobData) => api.put(`/job/jobs/${jobId}`, jobData),
    deleteJob: (jobId) => api.delete(`/job/jobs/${jobId}`),
};

export const rankingService = {
    rankStudents: (jobId) => api.post('/ranking/rank_students', { job_id: jobId }),
    getRankings: (jobId) => api.get(`/ranking/rankings/${jobId}`),
    downloadRankingsCSV: (jobId) => api.get(`/ranking/rankings/${jobId}/download`, { responseType: 'blob' }),
};

export default api;
