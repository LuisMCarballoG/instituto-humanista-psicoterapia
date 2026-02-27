import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Certificate } from '../../lib/supabase';
import { Plus, Copy, Download, LogOut, Check } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCertificates(data || []);
        } catch (error) {
            console.error('Error fetching certificates', error);
            alert('Error cargando certificados. Revisa tu conexión u originación de BD.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = (uuid: string) => {
        const url = `${window.location.origin}/certificate/${uuid}`;
        navigator.clipboard.writeText(url);
        setCopiedId(uuid);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sun-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 w-full">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img src="/logo.png" alt="IH" className="h-8 w-auto hidden sm:block opacity-90 mix-blend-screen grayscale" />
                        <span className="font-serif font-bold text-white text-xl">Panel de Administración</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-slate-400 hover:text-red-400 font-medium transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Cerrar Sesión</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Certificados Emitidos</h1>
                        <p className="text-slate-300 mt-1">Gestiona los registros públicos de validez</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/create')}
                        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Crear Certificado
                    </button>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr className="text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    <th className="px-6 py-4">ID (UUID)</th>
                                    <th className="px-6 py-4">Nombre Completo</th>
                                    <th className="px-6 py-4">Fecha Certificación</th>
                                    <th className="px-6 py-4">Fecha Registro</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-300">
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3"></div>
                                                Cargando registros...
                                            </div>
                                        </td>
                                    </tr>
                                ) : certificates.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-300">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-lg font-medium text-white">No hay certificados todavía.</p>
                                                <p className="text-sm mt-1 text-slate-400">Comienza creando uno nuevo con el botón superior.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    certificates.map((cert) => (
                                        <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 min-w-[280px]">
                                                <span className="font-mono text-xs text-primary-300 bg-primary-900/40 px-2 py-1 rounded border border-primary-500/30 items-center inline-flex select-all">
                                                    {cert.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">{cert.full_name}</td>
                                            <td className="px-6 py-4 text-slate-300">{cert.certification_date}</td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">{new Date(cert.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleCopyLink(cert.id)}
                                                        title="Copiar URL Validación"
                                                        className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                                                    >
                                                        {copiedId === cert.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <a
                                                        href={cert.pdf_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Ver / Descargar PDF"
                                                        className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
