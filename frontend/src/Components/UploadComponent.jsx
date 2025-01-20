import React, { useState } from "react";

export const UploadComponent = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`w-full max-w-xl h-[300px] border-2 ${
        isDragging ? "border-blue-500 bg-blue-50/20" : "border-gray-500"
      } border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Image icon above the text */}
      <img
        src="/upload.png"  // Corrected path for React
        alt="Upload Icon"
        className="mb-6 w-20 h-20"  // Updated size for consistency
      />
      <p className="text-gray-300 text-lg">Drag and drop an image here</p>
      <p className="text-gray-400 text-sm">or</p>
      <label
        htmlFor="file-upload"
        className="text-blue-500 font-semibold cursor-pointer hover:underline"
      >
        Browse files
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};
