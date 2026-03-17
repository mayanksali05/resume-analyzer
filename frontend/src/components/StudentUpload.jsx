import React, { useState } from 'react';
import { studentService } from '../services/api';
import { Upload, CheckCircle, XCircle, Zap, ShieldCheck } from 'lucide-react';

const StudentUpload = ({ onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        branch: 'CSE',
        cgpa: ''
    });
    const [files, setFiles] = useState([]);
    const [isSmartMode, setIsSmartMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSmartMode) {
                // Bulk / Smart Upload
                const data = new FormData();
                files.forEach(file => {
                    data.append('resumes', file);
                });
                await studentService.bulkUpload(data);
                setMessage({ type: 'success', text: `Successfully processed ${files.length} resumes automatically!` });
            } else {
                // Single Manual Upload
                const data = new FormData();
                data.append('resume', files[0]);
                data.append('name', formData.name);
                data.append('email', formData.email);
                data.append('phone', formData.phone);
                data.append('branch', formData.branch);
                data.append('cgpa', formData.cgpa);
                await studentService.uploadStudent(data);
                setMessage({ type: 'success', text: 'Student uploaded successfully!' });
            }
            
            setFormData({ name: '', email: '', phone: '', branch: 'CSE', cgpa: '' });
            setFiles([]);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error in processing. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Upload className="text-blue-600" />
                    Student Management
                </h2>
                <button 
                    onClick={() => setIsSmartMode(!isSmartMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${isSmartMode ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}
                >
                    <Zap size={16} fill={isSmartMode ? "currentColor" : "none"} />
                    {isSmartMode ? "Smart Mode ON" : "Switch to Smart Mode"}
                </button>
            </div>

            {isSmartMode && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100 flex gap-3 text-blue-800 text-sm">
                    <ShieldCheck className="shrink-0" size={20} />
                    <p><strong>Smart Mode:</strong> Upload multiple resumes. The system will automatically extract Name, Email, CGPA, and Branch. Manual entry is disabled.</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isSmartMode && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">Name (Optional)</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Student Name" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="student@college.edu" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="9999999999" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">Branch</label>
                                <select name="branch" value={formData.branch} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EE">EE</option>
                                    <option value="Mechanical">Mechanical</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">CGPA</label>
                                <input name="cgpa" type="number" step="0.01" value={formData.cgpa} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="8.5" required />
                            </div>
                        </div>
                    </>
                )}

                <div className="flex flex-col gap-1 p-8 border-2 border-dashed rounded-lg bg-slate-50 items-center justify-center cursor-pointer hover:bg-slate-100 transition-all border-slate-200">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" multiple={isSmartMode} required />
                    <label htmlFor="resume-upload" className="flex flex-col items-center gap-3 cursor-pointer w-full text-center">
                        <Upload size={40} className="text-blue-500 bg-blue-50 p-2 rounded-xl" />
                        <div className="space-y-1">
                            <p className="text-slate-800 font-bold">{files.length > 0 ? `${files.length} file(s) selected` : (isSmartMode ? "Select Multiple Resume PDFs" : "Select Student Resume PDF")}</p>
                            <p className="text-slate-400 text-xs">Only PDF files are supported</p>
                        </div>
                    </label>
                </div>

                <button type="submit" disabled={loading || files.length === 0} className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-slate-400 mt-4 flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                        </>
                    ) : (
                        isSmartMode ? `Bulk Process ${files.length} Resumes` : "Upload Student Data"
                    )}
                </button>
            </form>

            {message && (
                <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}
        </div>
    );
};

export default StudentUpload;
