export function setupSpectrogramAnalyzer(audioContext, audioBuffer, canvas, profile) {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = profile.fftSize;
  analyser.smoothingTimeConstant = 0;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start();

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const ctx = canvas.getContext('2d');

  const duration = audioBuffer.duration;
  const width = Math.ceil(duration * profile.pixelsPerSecond);
  const height = profile.height;
  canvas.width = width;
  canvas.height = height;

  let t = 0;
  const sliceWidth = 1;

  function getColor(val) {
    const hue = 280 - (val / 255) * 280;
    const light = 20 + (val / 255) * 60;
    return `hsl(${hue}, 100%, ${light}%)`;
  }

  function logScale(index, total) {
    const logMin = Math.log10(1);
    const logMax = Math.log10(total);
    const scale = (Math.log10(index + 1) - logMin) / (logMax - logMin);
    return scale;
  }

  function draw() {
    analyser.getByteFrequencyData(dataArray);

    for (let i = 1; i < bufferLength; i++) {
      const val = dataArray[i];
      if (val < 4) continue;

      let y1, y2;
if (profile.scale === 'log') {
  y1 = height - logScale(i, bufferLength) * height;
  y2 = height - logScale(i + 1, bufferLength) * height;
} else {
  y1 = height - ((i + 1) / bufferLength) * height;
  y2 = height - (i / bufferLength) * height;
}


      const barHeight = y2 - y1;
      ctx.fillStyle = getColor(val);
      ctx.fillRect(t, y1, sliceWidth, barHeight);
    }

    t += sliceWidth;
    if (t < width) requestAnimationFrame(draw);
  }

  draw();
}
