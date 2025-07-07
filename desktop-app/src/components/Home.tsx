import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase/auth';
import { uploadFileWithProgress } from '../firebase/storage';
import { addDocument } from '../firebase/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Mic, MicOff, Upload, LogOut, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meeting Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {currentUser?.email || 'User'}
            </span>
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-900">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>Add Meeting</CardTitle>
            <CardDescription>
              Record audio or upload files to create a new meeting entry
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Audio Recording Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">1. Record Audio</h3>
              <div className="flex gap-3 items-center flex-wrap">
                {!isRecording && !audioBlob && (
                  <Button
                    onClick={startRecording}
                    variant="default"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <>
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                    <span className="text-destructive flex items-center gap-1">
                      <span className="animate-pulse">●</span> Recording...
                    </span>
                  </>
                )}
            
                {audioBlob && !isRecording && (
                  <>
                    <audio 
                      controls 
                      src={URL.createObjectURL(audioBlob)} 
                      className="max-w-xs"
                    />
                    <Button
                      onClick={uploadAudioRecording}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Recording
                    </Button>
                    <Button
                      onClick={() => setAudioBlob(null)}
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Discard
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">2. Upload File</h3>
              <div className="space-y-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept="audio/*,video/*,.pdf,.doc,.docx,.txt"
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Supported: Audio, Video, PDF, Word documents, Text files
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-2 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;