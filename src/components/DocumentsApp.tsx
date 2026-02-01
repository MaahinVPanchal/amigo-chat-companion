import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, ArrowLeft, Check, Clock, X as XIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  filename: string;
  status: 'processing' | 'ready' | 'failed';
  file_size: number;
  created_at: string;
  content_type: string;
}

interface DocumentsAppProps {
  onBack: () => void;
}

const DocumentsApp = ({ onBack }: DocumentsAppProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'documents'>('upload');
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, DOCX, or TXT files only",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({ type: 'resume' }));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: "Document uploaded successfully",
      });

      // Refresh documents list
      fetchDocuments();
      setActiveTab('documents');
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const deleteDocument = async (docId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <XIcon className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800"
    >
      {/* Status Bar */}
      <div className="absolute top-3 left-0 right-0 flex justify-between items-center px-8 z-10">
        <span className="text-white text-xs font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-2.5 bg-white rounded-sm" />
            <div className="w-1 h-3 bg-white rounded-sm" />
            <div className="w-1 h-3.5 bg-white rounded-sm" />
            <div className="w-1 h-4 bg-white rounded-sm" />
          </div>
          <div className="w-6 h-3 border border-white rounded-sm ml-1">
            <div className="w-4 h-2 bg-white rounded-sm m-0.5" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-4 z-20">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Documents</h1>
        <div className="w-8 h-8" /> {/* Spacer */}
      </div>

      {/* Tab Navigation */}
      <div className="absolute top-24 left-0 right-0 px-4 z-10">
        <div className="flex bg-white/10 rounded-full p-1">
          {[
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'documents', label: 'Files', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-full text-xs font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-blue-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-40 left-0 right-0 bottom-4 px-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-white text-lg font-semibold mb-2">Upload Document</h2>
                <p className="text-white/70 text-sm mb-6">
                  Upload your resume or documents to analyze with AI
                </p>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button
                  disabled={uploading}
                  className="w-full bg-white text-blue-900 hover:bg-white/90 py-6"
                >
                  {uploading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
              </div>

              <p className="text-white/50 text-xs text-center">
                Supported: PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {loading ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-white/50 mx-auto mb-2 animate-spin" />
                  <p className="text-white/70">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-white/50 mx-auto mb-2" />
                  <p className="text-white/70">No documents uploaded yet</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-white/70 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">
                          {doc.filename}
                        </p>
                        <p className="text-white/50 text-xs">
                          {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-white/50" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full" />
    </motion.div>
  );
};

export default DocumentsApp;