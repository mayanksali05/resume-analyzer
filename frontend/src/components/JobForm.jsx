import React, { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import { Briefcase, Plus, CheckCircle, XCircle } from 'lucide-react';

const JobForm = ({ onJobCreated }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        job_role: '',
        job_description: '',
        required_skills: '',
        min_cgpa: '',
        allowed_branches: []
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const branches = ["CSE", "IT", "ECE", "EE", "Mechanical", "Civil"];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBranchToggle = (branch) => {
        const currentBranches = [...formData.allowed_branches];
        if (currentBranches.includes(branch)) {
            setFormData({ ...formData, allowed_branches: currentBranches.filter(b => b !== branch) });
        } else {
            setFormData({ ...formData, allowed_branches: [...currentBranches, branch] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = {
            ...formData,
            required_skills: formData.required_skills.split(',').map(s => s.trim()),
        };

        try {
            await jobService.createJob(data);
            setMessage({ type: 'success', text: 'Job drive created successfully!' });
            setFormData({ company_name: '', job_role: '', job_description: '', required_skills: '', min_cgpa: '', allowed_branches: [] });
            if (onJobCreated) onJobCreated();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error creating job drive.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="text-blue-600" />
                Create Company Placement Drive
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Company Name</label>
                        <input name="company_name" value={formData.company_name} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Google" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Job Role</label>
                        <input name="job_role" value={formData.job_role} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Software Engineer" required />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Job Description</label>
                    <textarea name="job_description" value={formData.job_description} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24" placeholder="Detailed job requirement..." required />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Required Skills (Comma separated)</label>
                    <input name="required_skills" value={formData.required_skills} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Python, SQL, React..." required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Minimum CGPA</label>
                        <input name="min_cgpa" type="number" step="0.01" value={formData.min_cgpa} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="7.5" required />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Allowed Branches</label>
                    <div className="flex flex-wrap gap-2">
                        {branches.map(branch => (
                            <button key={branch} type="button" onClick={() => handleBranchToggle(branch)} className={`px-4 py-2 rounded-full border transition-all ${formData.allowed_branches.includes(branch) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-600'}`}>
                                {branch}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} />
                    {loading ? "Creating..." : "Create Job Drive"}
                </button>
            </form>

            {message && (
                <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default JobForm;
