import React, { useState, useEffect } from 'react';
import { studentService, jobService } from '../services/api';
import { Users, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ students: 0, jobs: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [studentsRes, jobsRes] = await Promise.all([
                    studentService.getStudents(),
                    jobService.getJobs()
                ]);
                setStats({
                    students: studentsRes.data.length,
                    jobs: jobsRes.data.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Students', value: stats.students, icon: Users, color: 'bg-blue-500' },
        { title: 'Active Drives', value: stats.jobs, icon: Briefcase, color: 'bg-indigo-500' },
        { title: 'Placement Rate', value: 'N/A', icon: TrendingUp, color: 'bg-emerald-500' },
        { title: 'Top Branch', value: 'CSE', icon: GraduationCap, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-slate-900">Placement Dashboard</h1>
                <p className="text-slate-500 mt-2">Overview of current campus placement activities.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className={`${card.color} p-4 rounded-xl text-white`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6">Recent Activities</h3>
                    <div className="space-y-4 text-slate-600">
                        <p className="flex items-center gap-2 border-l-4 border-blue-500 pl-4 py-1">New placement drive created for Google</p>
                        <p className="flex items-center gap-2 border-l-4 border-indigo-500 pl-4 py-1">50 fresh student resumes uploaded</p>
                        <p className="flex items-center gap-2 border-l-4 border-emerald-500 pl-4 py-1">Ranking generated for Microsoft SDE role</p>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Quick Stats</h3>
                        <p className="opacity-90 mb-6 font-light">The automated system has matched over 200 candidates this semester with 95% accuracy.</p>
                        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-slate-100 transition-all">View Full Report</button>
                    </div>
                    <Users size={200} className="absolute -right-10 -bottom-10 opacity-10" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
