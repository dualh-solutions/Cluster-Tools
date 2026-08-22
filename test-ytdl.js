const ytdl = require('@distube/ytdl-core');

async function test() {
  try {
    const info = await ytdl.getInfo('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    console.log("Success:", info.videoDetails.title);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
