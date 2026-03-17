import React, { useState, useEffect } from 'react';
import { jobService, rankingService } from '../services/api';
import { Trophy, Search, CheckCircle, AlertCircle, Award } from 'lucide-react';

const RankingPage = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            const res = await jobService.getJobs();
            setJobs(res.data);
            if (res.data.length > 0) {
                setSelectedJob(res.data[0]._id);
            }
        };
        fetchJobs();
    }, []);

    const handleGenerateRankings = async () => {
        if (!selectedJob) return;
        setLoading(true);
        try {
            const res = await rankingService.rankStudents(selectedJob);
            setRankings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedJob) {
            const fetchRankings = async () => {
                const res = await rankingService.getRankings(selectedJob);
                setRankings(res.data);
            };
            fetchRankings();
        }
    }, [selectedJob]);

    const [downloading, setDownloading] = useState(false);

    const handleDownloadCSV = async () => {
        if (!selectedJob) return;
        setDownloading(true);
        try {
            const res = await rankingService.downloadRankingsCSV(selectedJob);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rankings_${selectedJob}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">Candidate Shortlisting</h1>
                    <p className="text-slate-500 mt-2">Filter and rank eligible students based on skill match scoring.</p>
                </div>
                <div className="flex gap-4">
                    <select 
                        value={selectedJob} 
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="p-3 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                    >
                        {jobs.map(job => (
                            <option key={job._id} value={job._id}>{job.company_name} - {job.job_role}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleGenerateRankings}
                        disabled={loading || !selectedJob}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-slate-400"
                    >
                        <Search size={20} />
                        {loading ? 'Processing...' : 'Generate Rankings'}
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-5 font-bold text-slate-700">Rank</th>
                            <th className="p-5 font-bold text-slate-700">Candidate Name</th>
                            <th className="p-5 font-bold text-slate-700">Branch</th>
                            <th className="p-5 font-bold text-slate-700">CGPA</th>
                            <th className="p-5 font-bold text-slate-700">Skill Match</th>
                            <th className="p-5 font-bold text-slate-700">Score</th>
                            <th className="p-5 font-bold text-slate-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {rankings.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-10 text-center text-slate-400 italic">No rankings available for this drive yet.</td>
                            </tr>
                        ) : (
                            rankings.map((candidate, index) => (
                                <tr key={candidate._id} className={`hover:bg-slate-50 transition-all ${index === 0 ? 'bg-yellow-50/30' : ''}`}>
                                    <td className="p-5 font-bold">
                                        {index === 0 && <Trophy className="inline mr-2 text-yellow-500" size={18} />}
                                        #{index + 1}
                                    </td>
                                    <td className="p-5">
                                        <div className="font-bold text-slate-800">{candidate.student_name}</div>
                                    </td>
                                    <td className="p-5"><span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase">{candidate.branch}</span></td>
                                    <td className="p-5 font-medium">{candidate.cgpa}</td>
                                    <td className="p-5">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {candidate.matched_skills.map(skill => (
                                                <span key={skill} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] uppercase font-bold">{skill}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-600 h-full" style={{ width: `${candidate.score * 100}%` }}></div>
                                            </div>
                                            <span className="font-bold text-blue-600">{(candidate.score * 100).toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                                            <CheckCircle size={14} /> Shortlisted
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {rankings.length > 0 && (
                <div className="bg-blue-600 rounded-2xl p-8 flex items-center justify-between text-white shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-full">
                            <Award size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Shortlisting Complete</h2>
                            <p className="opacity-80">Export candidate details and notify the company for next interview rounds.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleDownloadCSV}
                        disabled={downloading}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        {downloading ? 'Downloading...' : 'Download CSV'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RankingPage;
