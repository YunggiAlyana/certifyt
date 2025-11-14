import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient' 
import { fetchYouTubePlaylistData } from '@/lib/youtube' 

function getPlaylistIdFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const playlistId = parsedUrl.searchParams.get('list');
    return playlistId;
  } catch (error) {
    console.error("URL invalid:", error);
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { userName, playlistUrl } = body

  const playlistId = getPlaylistIdFromUrl(playlistUrl);
  if (!playlistId) {
    return NextResponse.json({ error: 'URL Playlist YouTube tidak valid.' }, { status: 400 });
  }

  try {
    console.log(`Memulai fetch data YouTube untuk ID: ${playlistId}...`);
    const playlistData = await fetchYouTubePlaylistData(playlistId);
    console.log("...Data YouTube berhasil didapat:", playlistData.playlistTitle);

    console.log("Menyimpan ke Supabase...");
    const { data: newCertificate, error: insertError } = await supabase
      .from('certificates')
      .insert({
        user_name: userName,
        user_email: 'temp@temp.com', 
        playlist_id: playlistId,
        playlist_title: playlistData.playlistTitle,
        channel_name: playlistData.channelName,
        video_count: playlistData.videoCount,
        total_duration_seconds: playlistData.totalDurationSeconds,
      })
      .select() 
      .single(); 

    if (insertError) {
      console.error("Error Supabase:", insertError);
      throw new Error(`Gagal menyimpan ke database: ${insertError.message}`);
    }
    console.log("...Berhasil disimpan! ID Sertifikat:", newCertificate.id);

    return NextResponse.json({
      ...playlistData, 
      certificateId: newCertificate.id 
    });

  } catch (error: any) {
    console.error("Error besar di /api/generate:", error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}