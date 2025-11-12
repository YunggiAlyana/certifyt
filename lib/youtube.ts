import { google } from 'googleapis'

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
    (years || 0) * 31536000 +
    (months || 0) * 2628000 +
    (weeks || 0) * 604800 +
    (days || 0) * 86400 +
    (hours || 0) * 3600 +
    (minutes || 0) * 60 +
    (seconds || 0)
  );
}

async function getPlaylistDetails(playlistId: string) {
  const res = await youtube.playlists.list({
    part: ['snippet', 'contentDetails'],
    id: [playlistId],
  });
  const playlist = res.data.items?.[0];
  return {
    title: playlist?.snippet?.title || 'Judul Tidak Ditemukan',
    channelName: playlist?.snippet?.channelTitle || 'Channel Tidak Ditemukan',
    videoCount: playlist?.contentDetails?.itemCount || 0,
  };
}

async function getPlaylistVideoIds(playlistId: string): Promise<string[]> {
  let videoIds: string[] = [];
  let nextPageToken: string | undefined | null = undefined;

  while (true) {
    const res: any = await youtube.playlistItems.list({
      part: ['contentDetails'],
      playlistId: playlistId,
      maxResults: 50,
      pageToken: nextPageToken || undefined,
    });

    const ids = res.data.items?.map((item: any) => item.contentDetails?.videoId).filter(Boolean) as string[];
    videoIds.push(...ids);
    
    nextPageToken = res.data.nextPageToken;

    if (!nextPageToken) {
      break;
    }
  }

  return videoIds;
}

async function getVideoDurations(videoIds: string[]): Promise<number> {
  let totalSeconds = 0;

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50); 

    const res = await youtube.videos.list({
      part: ['contentDetails'],
      id: batch,
    });

    const durations = res.data.items?.map(item => item.contentDetails?.duration || '') || [];

    for (const duration of durations) {
      totalSeconds += parseISODuration(duration);
    }
  }
  return totalSeconds;
}

export async function fetchYouTubePlaylistData(playlistId: string) {
  try {
    const details = await getPlaylistDetails(playlistId);

    const videoIds = await getPlaylistVideoIds(playlistId);

    const totalDurationSeconds = await getVideoDurations(videoIds);

    return {
      playlistTitle: details.title,
      channelName: details.channelName,
      videoCount: videoIds.length,
      totalDurationSeconds: totalDurationSeconds, 
    };

  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw new Error("Gagal mengambil data dari YouTube API.");
  }
}