import React from 'react';
import Webcam from "react-webcam";


export default function Camera () { 
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
    
  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <div>
      <form method='post' action='http://127.0.0.1:5000/api/user/csubmit' encType="media/webp">
        <input type='file' name='fileUploaded' />
        <input type='submit'></input>
      </form>
      <h1> Say Cheese! </h1>
      <Webcam audio={false} ref={webcamRef} />
      {capturing ? (
      <button onClick={handleStopCaptureClick}>Stop Capture</button>
    ) : (
      <button onClick={handleStartCaptureClick}>Start Capture</button>
    )}
    {recordedChunks.length > 0 && (
      <button onClick={handleDownload}>Download</button>
    )}
    </div>
  );
};

  


