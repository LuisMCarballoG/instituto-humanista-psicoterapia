import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const CreateCertificate = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [certDate, setCertDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use a predictable UUID for preview rendering purposes (will be replaced on submit)
    const [previewUuid, setPreviewUuid] = useState(crypto.randomUUID());

    const certificateRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !certDate) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Generate final UUID
            const finalUuid = crypto.randomUUID();
            setPreviewUuid(finalUuid);

            // Wait for React to render the new UUID in the QR (hacky but reliable for sync)
            await new Promise(resolve => setTimeout(resolve, 100));

            if (!certificateRef.current) throw new Error("Preview div ref not found");

            // 2. Generate PDF via html-to-image
            const imgData = await toPng(certificateRef.current, {
                pixelRatio: 2, // High resolution
                skipFonts: false,
            });

            const width = 842;
            const height = 595;

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [width, height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            const pdfBlob = pdf.output('blob');

            // 3. Upload to Supabase Storage
            const fileName = `${finalUuid}.pdf`;
            const { error: storageError } = await supabase
                .storage
                .from('certificates')
                .upload(fileName, pdfBlob, {
                    contentType: 'application/pdf',
                    upsert: false
                });

            if (storageError) throw storageError;

            // Get public URL
            const { data: publicUrlData } = supabase
                .storage
                .from('certificates')
                .getPublicUrl(fileName);

            const pdfUrl = publicUrlData.publicUrl;

            // 4. Save Record to DB
            const { error: dbError } = await supabase
                .from('certificates')
                .insert([{
                    id: finalUuid,
                    full_name: fullName,
                    certification_date: certDate,
                    pdf_url: pdfUrl
                }]);

            if (dbError) throw dbError;

            // 5. Navigate back to dashboard natively
            navigate('/admin/dashboard');

        } catch (err: any) {
            console.error("Error creating certificate:", err);
            setError(err.message || 'Error inesperado generando el certificado.');
        } finally {
            setLoading(false);
        }
    };

    const validationUrl = `${window.location.origin}/certificate/${previewUuid}`;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="text-slate-500 hover:text-primary-600 flex items-center transition-colors font-medium mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" /> Volver
                    </button>
                    <span className="font-serif font-bold text-slate-800 text-xl border-l pl-4 border-slate-200">
                        Nuevo Certificado
                    </span>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

                {/* Form Column */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Detalles del Participante</h2>

                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Ej. Juan Pérez"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de Certificación</label>
                                <input
                                    type="date"
                                    value={certDate}
                                    onChange={(e) => setCertDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={loading || !fullName}
                                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all shadow-md"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Generar y Guardar
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-slate-500 text-center mt-3">
                                    Se creará el PDF y se subirá automáticamente a la base de datos segura.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Certificate Preview Column */}
                <div className="w-full lg:w-2/3 overflow-x-auto bg-slate-200/50 p-4 sm:p-8 rounded-2xl border border-slate-200 items-center flex flex-col">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Vista Previa del Documento</p>

                    {/* A4 Landscape Ratio Wrapper (1123 x 794 px approx) */}
                    <div className="shadow-2xl overflow-hidden bg-white relative shrink-0" style={{ width: '842px', height: '595px' }}>

                        {/* The actual div that will be screenshotted */}
                        <div
                            ref={certificateRef}
                            className="absolute inset-0 bg-white flex flex-col items-center justify-between p-12 overflow-hidden"
                            style={{ width: '842px', height: '595px' }}
                        >
                            {/* Background watermark or borders can go here */}
                            <div className="absolute inset-4 border-2 border-primary-800/20 rounded-xl pointer-events-none"></div>
                            <div className="absolute inset-6 border border-primary-800/10 rounded-lg pointer-events-none"></div>

                            {/* Header Logo */}
                            <div className="mt-8">
                                <img src="/logo.svg" alt="Instituto Humanista" className="h-28 object-contain" crossOrigin="anonymous" />
                            </div>

                            {/* Body Text */}
                            <div className="text-center mt-4">
                                <p className="text-lg font-serif italic text-slate-500 mb-6">Otorga el presente</p>
                                <h1 className="text-5xl font-serif font-bold text-primary-900 tracking-wide uppercase mb-8">
                                    Certificado
                                </h1>
                                <p className="text-md font-sans text-slate-600 mb-2 uppercase tracking-widest">A favor de:</p>
                                <h2 className="text-4xl font-serif font-bold text-slate-800 border-b-2 border-slate-300 inline-block pb-2 px-12 min-w-[400px]">
                                    {fullName || "Nombre del Participante"}
                                </h2>

                                <p className="max-w-xl mx-auto mt-6 text-sm text-slate-700 leading-relaxed font-sans">
                                    Por su destacada participación y compromiso con los procesos de desarrollo integral,
                                    adquiriendo herramientas valiosas para el crecimiento personal y profesional con un
                                    enfoque profundamente humano.
                                </p>
                            </div>

                            {/* Footer (Dates, Signatures, QR) */}
                            <div className="w-full flex justify-between items-end mt-auto px-12 mb-4">
                                <div className="text-center w-64 border-t border-slate-300 pt-2">
                                    <p className="font-bold text-slate-800">Dirección General</p>
                                    <p className="text-xs text-slate-500">Instituto Humanista</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
                                        <QRCodeSVG value={validationUrl} size={80} level="H" includeMargin={false} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 text-center">
                                        Verificar autenticidad escaneando
                                    </p>
                                    <p className="text-[8px] font-mono text-slate-300">{previewUuid}</p>
                                </div>

                                <div className="text-center w-64 border-t border-slate-300 pt-2">
                                    <p className="text-slate-800 font-medium">Fecha de Emisión</p>
                                    <p className="text-sm font-bold text-slate-600">
                                        {certDate ? new Date(certDate).toLocaleDateString() : '--'}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateCertificate;
