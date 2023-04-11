import React, { useState, useEffect, useRef } from 'react';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const [audioStream, setAudioStream] = useState<any>(null);

  const startRecording = async () => {
    const stream:any = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
  };

  const stopRecording = () => {
    audioStream.getTracks().forEach((track:any) => track.stop());
    setAudioStream(null);
  };

  useEffect(() => {
    let animationFrameId:any;
    const canvas:any = canvasRef.current;
    const canvasCtx:any = canvas.getContext('2d');
    let audioCtx:any;
    let analyser:any;
    let source;
    const bufferLength = 512;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const barWidth = (WIDTH / bufferLength) * 8.5;
    let x = 0;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / .5;

        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      x = 0;
    };

    if (audioStream) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      draw();
    } else {
      cancelAnimationFrame(animationFrameId);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [audioStream]);

  return (
    <div className='bg-blue-300 p-3 text-black flex flex-col gap-3 justify-center items-center'>
      <canvas className='bg-black rounded-lg' ref={canvasRef} width="1000" height="500"></canvas>
      {!audioStream ? (
        <button className='bg-green-600 rounded-lg p-3 text-white' onClick={startRecording}>Enable Microphone</button>
      ) : (
        <button className='bg-red-600 rounded-lg p-3 text-white'  onClick={stopRecording}>Disable Microphone</button>
      )}
    </div>
  );
};

export default AudioVisualizer;
