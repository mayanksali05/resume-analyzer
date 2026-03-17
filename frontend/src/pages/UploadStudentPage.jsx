import React, { useState, useEffect } from 'react';
import StudentUpload from '../components/StudentUpload';
import { studentService } from '../services/api';
import { User, Mail, GraduationCap, Award, Trash2 } from 'lucide-react';

const UploadStudentPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const res = await studentService.getStudents();
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to remove this student?")) return;
        
        try {
            await studentService.deleteStudent(id);
            fetchStudents();
        } catch (err) {
            console.error(err);
            alert("Error removing student");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold text-slate-900">Student Management</h1>
                <p className="text-slate-500 mt-2">Register students and upload their resumes for analysis.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                <StudentUpload onUploadSuccess={fetchStudents} />
                
                <div className="flex-1 bg-white p-8 rounded-xl shadow-lg border border-slate-100 max-h-[700px] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6">Registered Students</h2>
                    <div className="space-y-4">
                        {students.length === 0 ? (
                            <p className="text-slate-400 italic">No students registered yet.</p>
                        ) : (
                            students.map((student) => (
                                <div key={student._id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                            <User size={16} className="text-blue-500" />
                                            {student.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{student.branch}</span>
                                            <button 
                                                onClick={() => handleDeleteStudent(student._id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Remove Student"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-2"><Mail size={14} /> {student.email}</div>
                                        <div className="flex items-center gap-2"><Award size={14} /> CGPA: {student.cgpa}</div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {student.skills.slice(0, 5).map(skill => (
                                            <span key={skill} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadStudentPage;
