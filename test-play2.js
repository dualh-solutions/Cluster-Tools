const play = require('play-dl');
async function test() {
  try {
    const info = await play.video_info('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    console.log(info.format.slice(0, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
