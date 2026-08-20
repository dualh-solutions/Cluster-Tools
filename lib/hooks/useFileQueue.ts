import { useState, useCallback, useRef } from "react";

export type FileStatus = "queued" | "processing" | "done" | "error";

export interface QueueFile {
  id: string;
  file: File;
  status: FileStatus;
  progress?: number;
  resultBlob?: Blob;
  errorMessage?: string;
  originalSize: number;
  finalSize?: number;
}

export interface UseFileQueueOptions {
  accept?: string[]; // e.g. ["image/jpeg", "image/png"]
  maxSizeMB?: number; // e.g. 25
  maxFiles?: number; // e.g. 100
}

export function useFileQueue(options: UseFileQueueOptions = {}) {
  const [files, setFiles] = useState<QueueFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { accept, maxSizeMB = 25, maxFiles } = options;

  const validateFile = useCallback((file: File): string | null => {
    if (accept && accept.length > 0) {
      // Check if file.type matches any accept criteria (exact or wildcard like image/*)
      const isAccepted = accept.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.replace("/*", ""));
        }
        // Handle extensions like .pdf
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type;
      });
      if (!isAccepted) {
        return `Unsupported file type: ${file.type || "unknown"}`;
      }
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Max size is ${maxSizeMB}MB.`;
    }
    
    return null;
  }, [accept, maxSizeMB]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const updatedFiles = [...prev];
      
      for (const file of newFiles) {
        if (maxFiles && updatedFiles.length >= maxFiles) {
          break; // Reach file limit
        }
        
        const error = validateFile(file);
        
        updatedFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          status: error ? "error" : "queued",
          errorMessage: error || undefined,
          originalSize: file.size,
        });
      }
      return updatedFiles;
    });
  }, [maxFiles, validateFile]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<QueueFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const clearQueue = useCallback(() => {
    setFiles([]);
  }, []);
  
  const moveFile = useCallback((dragIndex: number, hoverIndex: number) => {
    setFiles((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, removed);
      return result;
    });
  }, []);

  // --- Drag & Drop Handlers ---
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, [addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [addFiles]);

  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    updateFile,
    clearQueue,
    moveFile, // Useful for JPG -> PDF reordering
    
    // UI binding
    isDragActive,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    openFileDialog,
  };
}
