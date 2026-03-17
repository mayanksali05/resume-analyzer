import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Briefcase, BarChart3, LogOut } from 'lucide-react';

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <nav className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6 flex flex-col">
            <div className="text-2xl font-bold mb-10 text-blue-400">Campus Placement</div>
            
            <div className="flex-1 flex flex-col gap-4">
                <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                
                <NavLink to="/upload-student" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <UserPlus size={20} />
                    <span>Upload Student</span>
                </NavLink>
                
                <NavLink to="/create-job" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <Briefcase size={20} />
                    <span>Job Creation</span>
                </NavLink>
                
                <NavLink to="/ranking" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <BarChart3 size={20} />
                    <span>Rankings</span>
                </NavLink>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition-all mt-auto">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </nav>
    );
};

export default Navbar;
