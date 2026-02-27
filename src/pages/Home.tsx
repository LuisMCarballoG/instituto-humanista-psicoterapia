import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, QrCode, BookOpen, Users, BrainCircuit, GraduationCap } from 'lucide-react';

const Home = () => {
    const [uuid, setUuid] = useState('');
    const navigate = useNavigate();

    const handleValidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (uuid.trim()) {
            navigate(`/certificate/${uuid.trim()}`);
        }
    };

    const services = [
        {
            title: 'Psicoterapia',
            description: 'Sesiones de ayuda psicoterapéutica personalizadas para tu bienestar emocional.',
            icon: <BrainCircuit className="w-8 h-8 text-primary-500" />,
        },
        {
            title: 'Formación',
            description: 'Programas de formación integral para profesionales de la salud mental.',
            icon: <GraduationCap className="w-8 h-8 text-primary-500" />,
        },
        {
            title: 'Clases',
            description: 'Aprende con nuestros expertos a través de clases teóricas y prácticas.',
            icon: <BookOpen className="w-8 h-8 text-primary-500" />,
        },
        {
            title: 'Talleres',
            description: 'Participa en talleres intensivos enfocados en el desarrollo humano.',
            icon: <Users className="w-8 h-8 text-primary-500" />,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Navbar Placeholder */}
            <header className="fixed top-0 w-full z-50 glass border-b border-primary-100 transition-all duration-300">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                        <span className="font-serif font-bold text-primary-900 text-xl leading-tight hidden sm:block">Instituto Humanista de Psicoterapia</span>
                        <span className="font-serif font-bold text-primary-900 text-xl leading-tight sm:hidden">IHP</span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#servicios" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Servicios</a>
                        <a href="#validar" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Certificados</a>
                        <button onClick={() => navigate('/admin/login')} className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                            Portal Admin
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow pt-24">
                {/* Dynamic Abstract Background inside Hero */}
                <div className="relative overflow-hidden bg-primary-900">
                    <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10 mix-blend-overlay"></div>
                    {/* Glowing Orbs */}
                    <div className="absolute -top-24 -left-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-sun-500/20 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl tracking-tight">
                            Acompañando tu proceso de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sun-400 to-accent-400">Desarrollo Humano</span>
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 mb-12 max-w-2xl">
                            Fomentamos el bienestar emocional a través de la formación, la psicoterapia y el aprendizaje continuo.
                        </p>

                        {/* Validation Card (Glassmorphism) */}
                        <div id="validar" className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative">
                            <div className="absolute inset-0 bg-white/5 rounded-3xl pointer-events-none"></div>
                            <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Valida o descarga tu certificado</h2>

                            <form onSubmit={handleValidate} className="flex flex-col sm:flex-row gap-4 relative z-10">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={uuid}
                                        onChange={(e) => setUuid(e.target.value)}
                                        placeholder="Ingresa el UUID de tu certificado..."
                                        className="w-full pl-11 pr-4 py-4 rounded-xl border border-white/20 bg-white shadow-inner text-slate-800 focus:ring-2 focus:ring-accent-400 focus:outline-none transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary-500/30 transition-all duration-300 whitespace-nowrap"
                                >
                                    Buscar
                                </button>
                            </form>

                            <div className="mt-8 flex items-center justify-center relative z-10">
                                <div className="border-t border-white/20 flex-grow"></div>
                                <span className="px-4 text-primary-200 text-sm uppercase tracking-wider font-semibold">O también</span>
                                <div className="border-t border-white/20 flex-grow"></div>
                            </div>

                            <button
                                onClick={() => navigate('/scan')}
                                className="mt-8 w-full group relative flex justify-center items-center py-4 px-4 border-2 border-accent-400 text-accent-100 bg-accent-500/10 hover:bg-accent-500/20 hover:text-white rounded-xl font-bold transition-all duration-300"
                            >
                                <QrCode className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                Escanear QR
                            </button>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div id="servicios" className="py-24 bg-slate-50 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">Nuestros Servicios</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Ofrecemos un enfoque humanista centrado en la persona, brindando espacios de acompañamiento, crecimiento y formación.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {service.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Minimal Footer */}
            <footer className="bg-slate-900 py-12 border-t border-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <img src="/logo.png" alt="Instituto Humanista de Psicoterapia" className="h-12 w-auto mx-auto mb-6 opacity-80 mix-blend-screen grayscale" />
                    <p className="text-slate-400 text-sm mb-2">
                        © {new Date().getFullYear()} Instituto Humanista de Psicoterapia. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
