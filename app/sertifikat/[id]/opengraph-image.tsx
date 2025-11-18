// File: app/sertifikat/[id]/opengraph-image.tsx

import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const alt = 'Certificate of Completion'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export default async function Image(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const { data } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!data) return new ImageResponse(<div style={{ background: 'white', width: '100%', height: '100%', display: 'flex' }}>404</div>, { ...size })

  // Warna
  const primaryBlue = '#1a73e8'; // Blue yang kuat
  const textGray = '#5f6368';
  const textBlack = '#202124';
  const borderCol = '#1a73e8'; // Border warna Primary Blue

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between', // Untuk menempatkan header/footer di pojok
          padding: '40px',
          fontFamily: 'sans-serif',
          position: 'relative',
          border: `12px solid ${borderCol}` // Bingkai tebal
        }}
      >
        {/* Header (Pojok Kiri dan Kanan Atas) */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${borderCol}`, paddingBottom: 20 }}>
           <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, color: primaryBlue, letterSpacing: -1 }}>CertifYT</div>
           </div>
           <div style={{ display: 'flex', fontSize: 20, color: textGray, textTransform: 'uppercase', letterSpacing: 2 }}>
              Certificate of Completion
           </div>
        </div>

        {/* Konten Utama (Nama Dominan) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, paddingTop: 40 }}>
            <div style={{ display: 'flex', fontSize: 28, color: textGray, marginBottom: 15 }}>This is to certify that</div>
            
            {/* NAMA - Sangat Dominan */}
            <div style={{ display: 'flex', fontSize: 90, color: textBlack, fontWeight: 700, margin: '10px 0 25px 0' }}>
              {data.user_name}
            </div>
            
            <div style={{ display: 'flex', fontSize: 28, color: textGray, marginBottom: 15 }}>has successfully completed the playlist</div>
            
            {/* JUDUL PLAYLIST - Warna Primer */}
            <div style={{ display: 'flex', fontSize: 40, color: primaryBlue, fontWeight: 600, textAlign: 'center', padding: '0 40px' }}>
              {data.playlist_title}
            </div>

            {/* Garis Pemisah (Aesthetic) */}
            <div style={{ display: 'flex', width: 400, height: 2, background: borderCol, margin: '50px 0 30px 0' }}></div>

            {/* Grid Info */}
            <div style={{ display: 'flex', gap: 60, width: '100%', justifyContent: 'center' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', fontSize: 18, color: textGray, textTransform: 'uppercase' }}>Total Duration</div>
                  <div style={{ display: 'flex', fontSize: 32, color: textBlack, fontWeight: 700, marginTop: 5 }}>{formatDuration(data.total_duration_seconds)}</div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', fontSize: 18, color: textGray, textTransform: 'uppercase' }}>Source Channel</div>
                  <div style={{ display: 'flex', fontSize: 32, color: textBlack, fontWeight: 700, marginTop: 5 }}>{data.channel_name}</div>
               </div>
            </div>
        </div>

        {/* Footer Bawah */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${borderCol}`, paddingTop: 20, marginTop: 20 }}>
           
           {/* Date Issued */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', fontSize: 16, color: textGray }}>Date Issued</div>
              <div style={{ display: 'flex', fontSize: 20, color: textBlack, fontWeight: 600 }}>
                 {new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
           </div>

           {/* Watermark Pojok Kanan Bawah */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', fontSize: 12, color: '#bdc1c6', textAlign: 'right', maxWidth: 400, marginBottom: 4 }}>
                 This certificate verifies completion of a YouTube playlist. CertifYT is not affiliated with YouTube.
              </div>
              <div style={{ display: 'flex', fontSize: 14, color: '#bdc1c6', fontFamily: 'monospace' }}>
                 ID: {data.id}
              </div>
           </div>
        </div>
      </div>
    ),
    { ...size }
  )
}