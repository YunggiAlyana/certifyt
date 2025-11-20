import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton' 
import QRCode from 'qrcode'; 

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours} Jam ${minutes} Menit`;
};

async function generateQRCodeDataURL(url: string): Promise<string> {
    try {
        return await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', type: 'image/png', scale: 6 });
    } catch (err) {
        console.error("QR Code generation failed:", err);
        return '';
    }
}

async function getCertificateData(id: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) return null;
  const { data, error } = await supabase.from('certificates').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export default async function CertificatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getCertificateData(params.id);

  if (!data) {
    return <div className="p-10 text-center text-white">404 Not Found</div>;
  }

  const playlistUrl = `https://www.youtube.com/playlist?list=${data.playlist_id}`;
  const certUrl = `https://certifyt.vercel.app/sertifikat/${data.id}`;
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent("Menyelesaikan Playlist: " + data.playlist_title)}&organizationName=${encodeURIComponent("CertifYT (via " + data.channel_name + ")")}&issueYear=${new Date(data.created_at).getFullYear()}&issueMonth=${new Date(data.created_at).getMonth() + 1}&certUrl=${encodeURIComponent(certUrl)}&certId=${data.id}`;

  const qrCodeDataUrl = await generateQRCodeDataURL(certUrl);
  const videoList: string[] = data.video_list || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-gray-800 print:bg-white print:py-0 print:px-0">
      
      <div className="w-full flex flex-col items-center scale-[0.35] sm:scale-50 md:scale-75 lg:scale-100 origin-top print:scale-100 print:origin-center">
      
      <div className="w-full max-w-4xl min-w-[896px] flex justify-between items-center mb-8 px-2 no-print print:hidden">
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors opacity-70 hover:opacity-100 flex items-center gap-1">
          &larr; Kembali
        </Link>
        <div className="flex gap-3">
            <PrintButton /> 
            <a href={linkedInUrl} target="_blank" className="bg-[#0077b5] hover:bg-[#006396] text-white text-sm font-medium px-4 py-2 rounded transition-colors flex items-center gap-2 shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              Add to LinkedIn
            </a>
        </div>
      </div>

      <div className="bg-white w-full max-w-4xl min-w-[896px] min-h-[650px] shadow-xl border border-gray-300 p-16 relative flex flex-col text-gray-900 print:shadow-none print:border-none print:min-w-0 print:max-w-none print:w-full print:m-0">
        
        <div className="absolute inset-5 border-2 border-gray-300 pointer-events-none print:border-black"></div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-10">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">C</div>
              <span className="text-xl font-semibold tracking-tight">CertifYT</span>
           </div>
           <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest">CERTIFICATE OF COMPLETION</p>
           </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
            
            <div className="mb-8">
                <p className="text-gray-500 font-medium text-lg mb-4">This is to certify that</p>
                
                <h2 className="text-5xl font-sans font-bold text-gray-900 border-b-4 border-blue-500/50 pb-3 pr-10 tracking-tight max-w-full inline-block mb-8">
                  {data.user_name}
                </h2>
                
                <p className="text-gray-500 font-medium text-lg mb-4">has successfully completed the course</p>
                
                <h3 className="text-3xl font-bold text-gray-800 leading-snug">
                  {data.playlist_title}
                </h3>
            </div>

            <div className="space-y-6">
                
                <div className="flex justify-between items-start gap-8">
                    
                    <div className="grid grid-cols-3 gap-8 flex-1">
                       <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Duration</p>
                          <p className="text-xl font-bold text-slate-700">{formatDuration(data.total_duration_seconds)}</p>
                       </div>
                       
                       <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Videos</p>
                          <p className="text-xl font-bold text-slate-700">{data.video_count}</p>
                       </div>

                       <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Source Channel</p>
                          <p className="text-lg font-bold text-slate-700 break-words leading-tight">{data.channel_name}</p>
                       </div>
                    </div>

                    <div className="flex flex-col items-center text-center shrink-0">
                        {qrCodeDataUrl && (
                            <div className="w-24 h-24 border-2 border-blue-500/50 p-1.5 bg-white shadow-md mb-2">
                                <img 
                                  src={qrCodeDataUrl} 
                                  alt="Verification QR Code" 
                                  className="w-full h-full object-contain" 
                                />
                            </div>
                        )}
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                           SCAN UNTUK VERIFIKASI
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-between items-end gap-8">
                    
                    <div className="text-left">
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Issued On</p>
                        <p className="font-semibold text-slate-700 text-base">
                          {new Date(data.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-2 font-mono">Certificate ID: {data.id}</p>
                    </div>

                    <div className="text-right max-w-md">
                        <p className="text-[9px] text-gray-400 leading-snug print:text-black">
                          This certificate confirms completion of a YouTube playlist. 
                          CertifYT is an independent verification tool and is not affiliated with YouTube or the content creator.
                        </p>
                    </div>
                </div>

            </div>

        </div>

      </div>
      
      <div className="w-full max-w-4xl min-w-[896px] mt-8 px-4 no-print print:hidden">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Tentang Sertifikat Ini</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Sertifikat ini diberikan sebagai bukti bahwa <strong>{data.user_name}</strong> telah menyelesaikan seluruh video dalam playlist <strong>{data.playlist_title}</strong> dari channel <strong>{data.channel_name}</strong>.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Total durasi pembelajaran: <strong>{formatDuration(data.total_duration_seconds)}</strong> yang tersebar dalam <strong>{data.video_count} video</strong>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Tentang CertifYT</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                CertifYT adalah platform independen yang memverifikasi penyelesaian playlist YouTube. Kami menyediakan sertifikat digital untuk membuktikan pencapaian pembelajaran Anda.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>CertifYT tidak terafiliasi dengan YouTube atau content creator</span>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Verifikasi Sertifikat</p>
                <p className="text-sm text-gray-700 font-mono">{certUrl}</p>
              </div>
              <a 
                href={playlistUrl} 
                target="_blank" 
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Lihat Playlist
              </a>
            </div>
          </div>

        </div>

        {videoList.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Materi yang Dipelajari</h3>
            <p className="text-sm text-gray-600 mb-4">
              Daftar video yang telah diselesaikan dalam playlist ini:
            </p>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {videoList.map((title, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-0">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
      
      </div>
    </div>
  )
}