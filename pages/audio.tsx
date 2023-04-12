import React, { useState, useEffect, useRef } from 'react';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const [audioStream, setAudioStream] = useState<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [audioContext, setAudioContext] = useState<any>(null);

  const startRecording = async () => {
    const stream:any = await navigator.mediaDevices.getUserMedia({audio: true , video : true});
    setAudioStream(stream);
  };

  const stopRecording = () => {
    audioStream.getTracks().forEach((track:any) => track.stop());
    setAudioStream(null);
    // audioContext.close();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    let animationFrameId:any;
    const canvas:any = canvasRef.current;
    const canvasCtx:any = canvas.getContext('2d');
    let audioCtx:any;
    let analyser:any;
    let source:any;
    const bufferLength = 512;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = isFullScreen ? window.innerWidth - 210 : 1000;
    const HEIGHT = isFullScreen ? window.innerHeight - 210 : 500;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

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
      audioCtx = new window.AudioContext();
      setAudioContext(audioCtx);
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      draw();
    } else if (audioContext) {
      // audioContext.close();
      // cancelAnimationFrame(animationFrameId);
    }

    return () => {
      // cancelAnimationFrame(animationFrameId);
      if (audioCtx) {
        // audioCtx.close();
      }
    };
  }, [audioStream, isFullScreen]);

  return (
    <div className='d  p-3 text-black flex flex-col gap-3 justify-center items-center'>
      <canvas className='bg-gray-600 rounded-lg' ref={canvasRef}></canvas>
      {!audioStream ? (
        <button className='bg-green-600 rounded-lg p-2 text-white' onClick={startRecording}>Enable Microphone</button>
      ) : (
        <button className='bg-red-600 rounded-lg p-2 text-white' onClick={stopRecording}>Disable Microphone</button>
      )}
      <button className='bg-yellow-500 rounded-lg p-2 text-white' onClick={toggleFullScreen}>{isFullScreen ? 'Restore Down' : 'Full Screen'}</button>
    </div>
  );
};

export default AudioVisualizer;


