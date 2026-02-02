import React from 'react';

interface FileUploaderProps {
  label?: string;
  accept?: string;
  onFile: (file: File) => void;
  preview?: React.ReactNode;
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ label, accept, onFile, preview, error }) => {
  return (
    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 flex flex-col items-center justify-center bg-zinc-900/60">
      {label && <div className="mb-2 text-sm text-zinc-300">{label}</div>}
      <input
        type="file"
        accept={accept}
        className="hidden"
        id="file-upload-input"
        onChange={e => {
          if (e.target.files && e.target.files[0]) onFile(e.target.files[0]);
        }}
      />
      <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-2">
          <span className="text-2xl text-zinc-400">+</span>
        </div>
        <span className="text-xs text-zinc-400">Click or drag file here</span>
      </label>
      {preview && <div className="mt-3 w-full">{preview}</div>}
      {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
    </div>
  );
};
