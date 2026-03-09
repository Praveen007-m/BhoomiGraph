import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, FileImage, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
    onUpload: (files: File[]) => void;
    isUploading?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, isUploading }) => {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/tiff': ['.tif', '.tiff'],
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'application/zip': ['.zip', '.shp']
        }
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleConfirmUpload = () => {
        onUpload(files);
        setFiles([]);
    };

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group",
                    isDragActive ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:border-primary/50",
                    isUploading && "opacity-50 pointer-events-none"
                )}
            >
                <input {...getInputProps()} />
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 border border-slate-200 group-hover:scale-110 transition-transform shadow-sm">
                    <Upload className={cn("text-slate-400", isDragActive && "text-primary")} size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Click or drag files to upload</h4>
                <p className="text-xs font-medium text-slate-500 px-4">
                    TIF, SHP, JPG, or PDF. Max 100MB per file.
                </p>
            </div>

            {files.length > 0 && (
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Selected Payload ({files.length})</p>
                    <div className="grid grid-cols-1 gap-2">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl group hover:border-primary/30 transition-all shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                                        {file.type.includes('image') ? <FileImage size={16} /> : <FileText size={16} />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{file.name}</p>
                                        <p className="text-[10px] font-medium text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(idx);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmUpload();
                        }}
                        disabled={isUploading}
                        className="w-full h-11 rounded-xl font-bold gap-2 shadow-sm"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Transmitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={16} />
                                Confirm & Upload
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UploadZone;
