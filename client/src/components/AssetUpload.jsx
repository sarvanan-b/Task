import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import Button from "./Button";
import Loading from "./Loader";

const AssetUpload = ({ taskId, onUploadSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
    return '📎';
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(fileObj => {
        formData.append('files', fileObj.file);
      });

      const API_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800";
      const response = await fetch(`${API_URI}/api/task/${taskId}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();

      if (result.status) {
        toast.success(result.message);
        setFiles([]);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <MdCloudUpload className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or{" "}
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => fileInputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="text-sm text-gray-500">
          Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF (Max 10MB each)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
        />
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(fileObj.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {fileObj.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileObj.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IoMdClose className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            label="Cancel"
            onClick={() => setFiles([])}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          />
          <Button
            label={isUploading ? "Uploading..." : "Upload Files"}
            onClick={uploadFiles}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
};

export default AssetUpload;
