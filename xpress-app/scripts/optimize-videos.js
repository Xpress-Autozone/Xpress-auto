import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set binary paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const SOURCE_DIR = path.resolve(__dirname, '../src/assets/videos/source');
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/videos');
const CACHE_FILE = path.resolve(__dirname, '../.video-cache.json');

async function getFileHash(filePath) {
  const content = await fs.readFile(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

async function loadCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function processVideo(sourcePath, outputPath, format) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(sourcePath)
      .videoFilters('scale=-2:720') // Industry standard for 720p aspect preservation
      .videoBitrate('1500k') // Target bitrate for mobile/web balance
      .noAudio();

    if (format === 'mp4') {
      command
        .videoCodec('libx264')
        .outputOptions([
          '-preset faster',
          '-movflags +faststart',
          '-crf 26'
        ]);
    } else if (format === 'webm') {
      command
        .videoCodec('libvpx-vp9')
        .outputOptions([
          '-crf 35',
          '-b:v 0'
        ]);
    }

    command
      .on('start', (cmd) => console.log(`    Running: ${cmd}`))
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`    Progress: ${Math.round(progress.percent)}% \r`);
        }
      })
      .on('end', () => {
        console.log(`\n    ✅ Finished ${format.toUpperCase()}`);
        resolve();
      })
      .on('error', (err, stdout, stderr) => {
        console.error(`\n    ❌ FFmpeg ${format.toUpperCase()} Error:`, err.message);
        reject(err);
      })
      .save(outputPath);
  });
}

async function optimize() {
  console.log('--- 🚀 XPRESS NATIVE VIDEO PIPELINE ---');
  
  try {
    // Ensure directories exist
    await fs.mkdir(SOURCE_DIR, { recursive: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    const files = await fs.readdir(SOURCE_DIR);
    const videoFiles = files.filter(f => f.match(/\.(mp4|mov|avi|mkv)$/i));
    
    if (videoFiles.length === 0) {
      console.log('No source videos found in src/assets/videos/source');
      return;
    }

    const cache = await loadCache();
    let hasChanges = false;

    for (const file of videoFiles) {
      const sourcePath = path.join(SOURCE_DIR, file);
      const hash = await getFileHash(sourcePath);
      const basename = path.parse(file).name;
      
      const mp4Output = path.join(OUTPUT_DIR, `${basename}.mp4`);
      const webmOutput = path.join(OUTPUT_DIR, `${basename}.webm`);
      
      // Smart Cache Check
      const mp4Exists = await fs.access(mp4Output).then(() => true).catch(() => false);
      const webmExists = await fs.access(webmOutput).then(() => true).catch(() => false);

      if (cache[file] === hash && mp4Exists && webmExists) {
        console.log(`⏩ Skipping ${file} (Smart Cache: Up to date)`);
        continue;
      }

      console.log(`\n📦 Processing: ${file}...`);
      hasChanges = true;

      console.log(`  - Generating optimized MP4...`);
      await processVideo(sourcePath, mp4Output, 'mp4');

      console.log(`  - Generating WebM counterpart...`);
      await processVideo(sourcePath, webmOutput, 'webm');

      cache[file] = hash;
    }

    if (hasChanges) {
      await saveCache(cache);
      console.log('\n✅ Pipeline Complete: All videos optimized.');
    } else {
      console.log('\n✨ Asset integrity verified. No work needed.');
    }

  } catch (error) {
    console.error('❌ Pipeline Error:', error);
    process.exit(1);
  }
}

optimize();
