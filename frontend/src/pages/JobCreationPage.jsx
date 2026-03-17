import React, { useState, useEffect } from 'react';
import JobForm from '../components/JobForm';
import { jobService } from '../services/api';
import { Briefcase, Calendar, Target, CheckCircle, Edit, Trash2 } from 'lucide-react';

const JobCreationPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editJob, setEditJob] = useState(null);

    const fetchJobs = async () => {
        try {
            const res = await jobService.getJobs();
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job drive?")) return;
        try {
            await jobService.deleteJob(id);
            fetchJobs();
        } catch (err) {
            console.error(err);
            alert("Error deleting job");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold text-slate-900">Placement Drive Creation</h1>
                <p className="text-slate-500 mt-2">Define company requirements and job roles for campus drives.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                <JobForm 
                    onJobCreated={fetchJobs} 
                    editJob={editJob} 
                    onCancel={() => setEditJob(null)} 
                />
                
                <div className="flex-1 space-y-4 h-[700px] overflow-y-auto pr-2">
                    <h2 className="text-2xl font-bold mb-2">Active Job Drives</h2>
                    {jobs.length === 0 ? (
                        <p className="text-slate-400 italic">No job drives created yet.</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className={`bg-white p-6 rounded-xl shadow-sm border ${editJob?._id === job._id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-100'} hover:shadow-md transition-all`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900">{job.company_name}</h4>
                                        <p className="text-blue-600 font-medium">{job.job_role}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setEditJob(job);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="p-2 bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Edit Drive"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteJob(job._id)}
                                            className="p-2 bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Drive"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-slate-600 mb-4">
                                    <p className="line-clamp-2">{job.job_description}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1"><Target size={14} /> Min CGPA: {job.min_cgpa}</div>
                                        <div className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle size={14} /> Open to: {job.allowed_branches.join(', ')}</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                                    {job.required_skills.map(skill => (
                                        <span key={skill} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold capitalize">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobCreationPage;
