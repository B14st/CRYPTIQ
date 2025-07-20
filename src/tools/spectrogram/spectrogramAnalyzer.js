// tools/audio/setupSpectrogramAnalyzer.js

export function setupSpectrogramAnalyzer(audioContext, audioBuffer, canvas) {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 32768;
  analyser.smoothingTimeConstant = 0;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start();

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;
  const maxSlices = 600;
  const sliceWidth = width / maxSlices;

  let spectrogramData = [];

  function getColor(val) {
    const hue = 280 - (val / 255) * 280;
    const light = 20 + (val / 255) * 60;
    return `hsl(${hue}, 100%, ${light}%)`;
  }

  function draw() {
    analyser.getByteFrequencyData(dataArray);
    spectrogramData.push([...dataArray]);
    if (spectrogramData.length > maxSlices) spectrogramData.shift();

    ctx.clearRect(0, 0, width, height);

    spectrogramData.forEach((slice, t) => {
      slice.forEach((val, f) => {
        const y = (f / bufferLength) * height; // instead of height - (...)

        const barHeight = height / bufferLength;
        ctx.fillStyle = getColor(val);
        ctx.fillRect(t * sliceWidth, y, sliceWidth, barHeight);
      });
    });

    requestAnimationFrame(draw);
  }

  draw();
}
