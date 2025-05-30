import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const initializeVideoCall = (roomId, localVideoRef, remoteVideoRef, setLocalStream) => {
  console.log(`Initializing video call for room: ${roomId}`);
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // Store the stream in a state or ref to handle cleanup later
      setLocalStream(stream);
    })
    .catch((err) => console.error('Error accessing media devices:', err));
};

function VideoConsultation({ consultationId }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [localStream, setLocalStream] = useState(null);  // State for stream reference
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (isCallActive) {
      initializeVideoCall(consultationId, localVideoRef, remoteVideoRef, setLocalStream);
    }

    // Cleanup when call ends or component unmounts
    return () => {
      if (localStream) {
        const tracks = localStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCallActive, consultationId, localStream]); // Add localStream to dependencies

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // You can stop the stream here, but cleanup is already handled in useEffect
    if (localStream) {
      const tracks = localStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  return (
    <div style={styles.container}>
      <h2>Video Consultation</h2>
      <div style={styles.videoContainer}>
        <div style={styles.videoWrapper}>
          <h3>Local Video</h3>
          <video ref={localVideoRef} autoPlay muted style={styles.video} />
        </div>
        <div style={styles.videoWrapper}>
          <h3>Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay style={styles.video} />
        </div>
      </div>
      <div style={styles.controls}>
        {!isCallActive ? (
          <button onClick={handleStartCall} style={styles.startButton}>
            Start Call
          </button>
        ) : (
          <button onClick={handleEndCall} style={styles.endButton}>
            End Call
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  videoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  videoWrapper: {
    flex: 1,
    margin: '0 10px',
    textAlign: 'center',
  },
  video: {
    width: '100%',
    maxWidth: '300px',
    borderRadius: '5px',
    backgroundColor: '#000',
  },
  controls: {
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  endButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

VideoConsultation.propTypes = {
  consultationId: PropTypes.string.isRequired,
};

export default VideoConsultation;
