import { useEffect, useState } from "react";

export const useAudioData = (audio:any) => {
  const [dataArray, setDataArray] = useState<Array<any>>([]);
  const [bufferLength, setBufferLength] = useState(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength:any = analyser.frequencyBinCount;
    const dataArray:any = new Uint8Array(bufferLength);

    setBufferLength(bufferLength);
    setDataArray(dataArray);

    audio.play();

    const updateDataArray = () => {
      analyser.getByteFrequencyData(dataArray);
      setDataArray([...dataArray]);
    };

    const interval = setInterval(updateDataArray, 1000 / 60);

    return () => clearInterval(interval);
  }, [audio]);

  return { dataArray, bufferLength };
};
