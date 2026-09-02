import { execFile } from "node:child_process";
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(import.meta.dirname, "../..");
const videoDir = path.join(projectRoot, "artifacts/coding-program/public/videos");
const tempDir = path.join(videoDir, ".whiteboard-tmp");

const whiteboardFilter = [
  "format=gray",
  "edgedetect=mode=colormix:high=0.1:low=0.02",
  "negate",
  "eq=contrast=1.35:brightness=0.22",
  "colorchannelmixer=rr=1.0:gg=0.97:bb=0.9",
  "noise=alls=1:allf=u",
].join(",");

const videoFiles = (await readdir(videoDir))
  .filter((file) => /^lesson-\d+\.mp4$/.test(file))
  .sort((a, b) => {
    const aNumber = Number(a.match(/\d+/)?.[0] ?? 0);
    const bNumber = Number(b.match(/\d+/)?.[0] ?? 0);
    return aNumber - bNumber;
  });

if (videoFiles.length === 0) {
  throw new Error(`No lesson videos found in ${videoDir}`);
}

await rm(tempDir, { recursive: true, force: true });
await mkdir(tempDir, { recursive: true });

try {
  for (const file of videoFiles) {
    const input = path.join(videoDir, file);
    const output = path.join(tempDir, file);
    console.log(`Converting ${file}...`);
    await execFileAsync("ffmpeg", [
      "-y",
      "-i", input,
      "-map", "0:v:0",
      "-map", "0:a?",
      "-vf", whiteboardFilter,
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "20",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "128k",
      "-movflags", "+faststart",
      output,
    ]);
  }

  for (const file of videoFiles) {
    await rename(path.join(tempDir, file), path.join(videoDir, file));
  }

  console.log(`Converted ${videoFiles.length} lesson videos to whiteboard style.`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}