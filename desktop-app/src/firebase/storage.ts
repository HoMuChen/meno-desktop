import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './config';

// Upload a file to Firebase Storage
export const uploadFile = async (path: string, file: File) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { downloadURL, path: snapshot.ref.fullPath };
  } catch (error) {
    throw error;
  }
};

// Upload file with progress tracking
export const uploadFileWithProgress = (
  path: string, 
  file: File, 
  onProgress?: (progress: number) => void
) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise<{ downloadURL: string; path: string }>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadURL, path: uploadTask.snapshot.ref.fullPath });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    throw error;
  }
};

// Get download URL for a file
export const getFileDownloadURL = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

// List all files in a folder
export const listFiles = async (folderPath: string) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          downloadURL,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated
        };
      })
    );
    
    return files;
  } catch (error) {
    throw error;
  }
};

// Get file metadata
export const getFileMetadata = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    return metadata;
  } catch (error) {
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files: { path: string; file: File }[]) => {
  try {
    const uploadPromises = files.map(({ path, file }) => uploadFile(path, file));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};