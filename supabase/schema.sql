-- Creación de la tabla de certificados
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    certification_date DATE NOT NULL,
    pdf_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS) para la tabla certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura: Cualquier persona (anonima o logueada) puede ver el certificado (para validarlo)
CREATE POLICY "Public profiles are viewable by everyone."
ON public.certificates FOR SELECT
USING ( true );

-- Políticas de inserción/actualización: Solo usuarios autenticados (admin) pueden crear/editar
CREATE POLICY "Only authenticated users can insert certificates"
ON public.certificates FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' );

-- Configurar bucket público para certificados (PDFs)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas del Storage Bucket (Lectura pública)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'certificates' );

-- Políticas del Storage Bucket (Subida solo autenticada)
CREATE POLICY "Authenticated users can upload certificates"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'certificates' AND auth.role() = 'authenticated' );
