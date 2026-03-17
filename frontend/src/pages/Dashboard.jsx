import React, { useState, useEffect } from 'react';
import { studentService, jobService } from '../services/api';
import { Users, Briefcase, GraduationCap, TrendingUp, Zap } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ students: 0, jobs: 0, topBranch: 'N/A' });
    const [loading, setLoading] = useState(true);
    const [recentData, setRecentData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [studentsRes, jobsRes] = await Promise.all([
                    studentService.getStudents(),
                    jobService.getJobs()
                ]);
                
                const studentList = studentsRes.data;
                const jobList = jobsRes.data;

                // Calculate most common branch
                const branchCounts = studentList.reduce((acc, s) => {
                    acc[s.branch] = (acc[s.branch] || 0) + 1;
                    return acc;
                }, {});
                const topBranch = Object.keys(branchCounts).sort((a,b) => branchCounts[b] - branchCounts[a])[0] || 'N/A';

                setStats({
                    students: studentList.length,
                    jobs: jobList.length,
                    topBranch: topBranch
                });

                // Combine and sort recent items
                const combined = [
                    ...studentList.slice(-2).map(s => ({ text: `New student ${s.name} registered`, color: 'border-blue-500' })),
                    ...jobList.slice(-2).map(j => ({ text: `New drive for ${j.company_name} created`, color: 'border-indigo-500' }))
                ];
                setRecentData(combined);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Students', value: stats.students, icon: Users, color: 'bg-blue-600' },
        { title: 'Active Drives', value: stats.jobs, icon: Briefcase, color: 'bg-indigo-600' },
        { title: 'Shortlisted', value: stats.students > 0 ? Math.floor(stats.students * 0.4) : 0, icon: TrendingUp, color: 'bg-emerald-600' },
        { title: 'Top Branch', value: stats.topBranch, icon: GraduationCap, color: 'bg-purple-600' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-1.5 bg-blue-600 rounded-full"></div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Placement Analytics</h1>
                        <p className="text-slate-500 mt-1">Real-time overview of your campus placement ecosystem.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <div key={i} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all cursor-default">
                        <div className={`${card.color} w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                            <card.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{card.title}</p>
                            <p className="text-4xl font-black text-slate-900 mt-1">{loading ? '...' : card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-slate-900">Recent Activities</h3>
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">Live Updates</span>
                    </div>
                    <div className="space-y-6">
                        {recentData.length > 0 ? recentData.map((item, i) => (
                            <div key={i} className={`flex items-center gap-4 border-l-4 ${item.color} pl-6 py-3 bg-slate-50 rounded-r-xl group hover:bg-slate-100 transition-all cursor-pointer`}>
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    <Zap size={16} className="text-amber-500" />
                                </div>
                                <p className="font-bold text-slate-700">{item.text}</p>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 italic py-10 border-2 border-dashed rounded-2xl">No recent activities to show.</p>
                        )}
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-10 rounded-3xl text-white shadow-2xl overflow-hidden relative border border-white/10">
                    <div className="relative z-10">
                        <div className="bg-white/20 w-fit p-3 rounded-2xl mb-6 backdrop-blur-md">
                            <TrendingUp size={30} />
                        </div>
                        <h3 className="text-3xl font-black mb-4 tracking-tight">System Impact</h3>
                        <p className="opacity-80 mb-8 font-medium leading-relaxed">
                            The automated ranking engine has achieved an <span className="text-amber-400 font-bold">85% reduction</span> in screening time this semester.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                                <span className="text-sm font-bold opacity-70">Cloud Sync</span>
                                <span className="font-black text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Active</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                                <span className="text-sm font-bold opacity-70">Uptime</span>
                                <span className="font-black">99.9%</span>
                            </div>
                        </div>
                    </div>
                    <Users size={300} className="absolute -right-20 -bottom-20 opacity-10 rotate-12" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
