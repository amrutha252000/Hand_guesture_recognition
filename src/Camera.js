import React, { useState, useEffect, useRef } from 'react';
import './Camera.css'
function CameraBox() {
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { video: true }; // Request video only

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
      });

    // Cleanup function (stop the camera when component unmounts)
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array: run useEffect only once

  const captureImage = () => {
    const canvas = document.createElement('canvas'); 
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0); 

    const dataURL = canvas.toDataURL('image/jpeg', 0.8); 
    storeImage(dataURL); 
  };

  const storeImage = (imageData) => {
    // Option 1: Download image directly
    const link = document.createElement('a');
    link.download = 'captured_image.jpeg'; 
    link.href = imageData;
    link.click(); 
  
    // Option 2: Store in local storage (temporary)
    //localStorage.setItem('capturedImage', imageData);
  };
  
  return (
    <div>
    <h2>Hand Gesture Analysis</h2>
    <div className="camera-box"> {/* Styling for the box */}
      
      <video ref={videoRef} autoPlay />
      <button onClick={captureImage}>Capture</button>
      <h4>The displayed hand gesture is :</h4>
    </div>
    </div>
  );
}

export default CameraBox;
