import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Certificate } from '../lib/supabase';
import { Download, Share2, AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react';

const CertificateView = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [cert, setCert] = useState<Certificate | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }, []);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!uuid) return;

            try {
                setLoading(true);
                // Clean UUID
                const cleanUuid = uuid.trim();

                const { data, error } = await supabase
                    .from('certificates')
                    .select('*')
                    .eq('id', cleanUuid)
                    .single();

                if (error) throw error;
                setCert(data);
            } catch (err: any) {
                console.error("Error fetching certificate:", err);
                setError("Certificado no encontrado o el enlace es inválido.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [uuid]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Certificado - Instituto Humanista',
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error compartiendo", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Enlace copiado al portapapeles');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Buscando certificado...</p>
            </div>
        );
    }

    if (error || !cert) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No encontrado</h2>
                    <p className="text-slate-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10 px-4 py-3">
                <div className="container mx-auto flex justify-between items-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 hover:text-primary-600 flex items-center transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span className="hidden sm:inline">Volver</span>
                    </button>

                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Válido y Auténtico</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[75vh]">

                    {/* Header Actions */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="font-bold text-slate-800 uppercase tracking-wide">{cert.full_name}</h1>
                            <p className="text-xs text-slate-500">ID: <span className="font-mono">{cert.id}</span></p>
                        </div>

                        <div className="flex space-x-3 w-full sm:w-auto">
                            <a
                                href={cert.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none flex items-center justify-center bg-white border border-slate-300 hover:border-primary-400 hover:text-primary-600 text-slate-700 py-2 px-4 rounded-lg font-medium transition-all shadow-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar
                            </a>
                            <button
                                onClick={handleShare}
                                className="flex-1 sm:flex-none flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-all shadow-md shadow-primary-500/20"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartir
                            </button>
                        </div>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex-grow bg-slate-200/50 p-4 md:p-8 flex justify-center items-start overflow-auto">
                        <iframe
                            src={isMobile ? `https://docs.google.com/viewer?url=${encodeURIComponent(cert.pdf_url)}&embedded=true` : `${cert.pdf_url}#toolbar=0`}
                            title="Certificado"
                            className="w-full max-w-3xl h-full min-h-[500px] shadow-2xl bg-white border-none"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CertificateView;
