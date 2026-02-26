import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ArrowLeft, XCircle } from 'lucide-react';

const Scan = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Custom logic to handle scanning
        const onScanSuccess = (decodedText: string) => {
            // Assuming the QR contains the UUID or a URL ending in the UUID
            try {
                if (scannerRef.current) {
                    scannerRef.current.clear();
                }

                let uuid = decodedText;
                if (decodedText.includes('/certificate/')) {
                    const parts = decodedText.split('/certificate/');
                    uuid = parts[parts.length - 1];
                }

                navigate(`/certificate/${uuid}`);
            } catch (err) {
                console.error("Error parsing QR", err);
                setError("Formato de QR no válido");
            }
        };

        const onScanFailure = (_error: any) => {
            // Often fires when a frame has no QR code, safe to ignore
            // console.warn(error);
        };

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      /* verbose= */ false
        );

        scannerRef.current = scanner;
        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-12 px-4 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
            </button>

            <div className="w-full max-w-md mt-12 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-white mb-2 text-center">Escanear Certificado</h1>
                <p className="text-slate-400 text-center mb-8 text-sm">
                    Apunta la cámara al código QR impreso en el certificado para validarlo.
                </p>

                <div className="bg-white p-4 rounded-3xl w-full shadow-2xl overflow-hidden">
                    <div id="reader" className="w-full rounded-2xl overflow-hidden"></div>
                </div>

                {error && (
                    <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center">
                        <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scan;
