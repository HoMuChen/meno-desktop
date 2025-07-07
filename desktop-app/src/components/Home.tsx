import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase/auth';
import { uploadFileWithProgress } from '../firebase/storage';
import { addDocument } from '../firebase/database';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Failed to access microphone. Please ensure permissions are granted.');
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Upload audio recording
  const uploadAudioRecording = async () => {
    if (!audioBlob || !currentUser) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const fileName = `audio_${Date.now()}.webm`;
      const path = `users/${currentUser.uid}/recordings/${fileName}`;
      
      const result = await uploadFileWithProgress(
        path,
        new File([audioBlob], fileName, { type: 'audio/webm' }),
        (progress) => setUploadProgress(progress)
      );

      // Create a document in Firestore with the file URL
      await addDocument('meetings', {
        userId: currentUser.uid,
        type: 'audio',
        fileName: fileName,
        fileUrl: result.downloadURL,
        filePath: result.path,
        createdBy: currentUser.email || currentUser.uid,
        size: audioBlob.size,
        duration: null, // You can calculate this if needed
      });

      setSuccess('Audio recording uploaded successfully!');
      setAudioBlob(null);
      setUploadProgress(0);
    } catch (err: any) {
      setError(`Failed to upload audio: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const path = `users/${currentUser.uid}/uploads/${file.name}`;
      
      const result = await uploadFileWithProgress(
        path,
        file,
        (progress) => setUploadProgress(progress)
      );

      // Create a document in Firestore with the file URL
      await addDocument('meetings', {
        userId: currentUser.uid,
        type: 'file',
        fileName: file.name,
        fileUrl: result.downloadURL,
        filePath: result.path,
        fileType: file.type,
        createdBy: currentUser.email || currentUser.uid,
        size: file.size,
      });

      setSuccess('File uploaded successfully!');
      setUploadProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(`Failed to upload file: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Meeting Management</h1>
        <div>
          <span style={{ marginRight: '10px' }}>
            {currentUser?.email || 'User'}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {success}
        </div>
      )}

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Add Meeting</h2>
        
        {/* Audio Recording Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3>1. Record Audio</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!isRecording && !audioBlob && (
              <button
                onClick={startRecording}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Start Recording
              </button>
            )}
            
            {isRecording && (
              <>
                <button
                  onClick={stopRecording}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Stop Recording
                </button>
                <span style={{ color: '#dc3545' }}>● Recording...</span>
              </>
            )}
            
            {audioBlob && !isRecording && (
              <>
                <audio controls src={URL.createObjectURL(audioBlob)} />
                <button
                  onClick={uploadAudioRecording}
                  disabled={uploading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: uploading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Upload Recording
                </button>
                <button
                  onClick={() => setAudioBlob(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Discard
                </button>
              </>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <h3>2. Upload File</h3>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            accept="audio/*,video/*,.pdf,.doc,.docx,.txt"
            style={{
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              width: '100%',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          />
          <small style={{ color: '#6c757d' }}>
            Supported: Audio, Video, PDF, Word documents, Text files
          </small>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div style={{ marginTop: '20px' }}>
            <div style={{
              width: '100%',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${uploadProgress}%`,
                  backgroundColor: '#007bff',
                  height: '20px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <p style={{ textAlign: 'center', marginTop: '5px' }}>
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;