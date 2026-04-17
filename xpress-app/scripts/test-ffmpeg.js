import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

console.log('FFmpeg Path:', ffmpegInstaller.path);

ffmpeg.getAvailableCodecs((err, codecs) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Available Codecs found.');
    process.exit(0);
  }
});
