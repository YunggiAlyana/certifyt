// File: lib/youtube.ts
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

function parseISODuration(duration: string): number {
  const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
  const parts = duration.match(regex);
  if (!parts) return 0;
  const [, years, months, weeks, days, hours, minutes, seconds] = parts.map(parseFloat);
  return (
    (years || 0) * 31536000 + (months || 0) * 2628000 + (weeks || 0) * 604800 + (days || 0) * 86400 + (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)
  );
}

// Kita ubah ini untuk mengambil ID DAN JUDUL sekaligus
async function getPlaylistVideos(playlistId: string) {
  let videos: { id: string; title: string }[] = [];
  let nextPageToken: string | undefined | null = undefined;

  do {
    const res: any = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'], // Ambil snippet untuk judul
      playlistId: playlistId,
      maxResults: 50,
      pageToken: nextPageToken || undefined,
    });

    const items = res.data.items?.map((item: any) => ({
      id: item.contentDetails?.videoId,
      title: item.snippet?.title // Ambil judul video
    })).filter((v: any) => v.id) || [];

    videos.push(...items);
    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  return videos;
}

async function getVideoDurations(videoIds: string[]): Promise<number> {
  let totalSeconds = 0;
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res: any = await youtube.videos.list({
      part: ['contentDetails'],
      id: batch,
    });
    const durations = res.data.items?.map((item: any) => item.contentDetails?.duration || '') || [];
    for (const duration of durations) {
      totalSeconds += parseISODuration(duration);
    }
  }
  return totalSeconds;
}

export async function fetchYouTubePlaylistData(playlistId: string) {
  try {
    // 1. Ambil Info Playlist
    const playlistRes = await youtube.playlists.list({
      part: ['snippet', 'contentDetails'],
      id: [playlistId],
    });
    const playlist = playlistRes.data.items?.[0];
    
    // 2. Ambil Semua Video (ID & Judul)
    const allVideos = await getPlaylistVideos(playlistId);
    const videoIds = allVideos.map(v => v.id);
    
    // 3. Hitung Durasi
    const totalDurationSeconds = await getVideoDurations(videoIds);

    return {
      playlistTitle: playlist?.snippet?.title || 'Unknown',
      channelName: playlist?.snippet?.channelTitle || 'Unknown',
      videoCount: allVideos.length,
      totalDurationSeconds: totalDurationSeconds,
      videoList: allVideos.map(v => v.title) // Kita simpan JUDULNYA juga sekarang!
    };

  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw new Error("Gagal mengambil data dari YouTube API.");
  }
}