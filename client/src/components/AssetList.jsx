import { useState } from "react";
import { toast } from "sonner";
import { MdDownload, MdDelete, MdPreview } from "react-icons/md";
import Button from "./Button";
import AssetPreview from "./AssetPreview";
import PropTypes from "prop-types";

const AssetList = ({ assets, taskId, onAssetDeleted }) => {
  const [deletingAsset, setDeletingAsset] = useState(null);
  const [previewAsset, setPreviewAsset] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('image')) return '🖼️';
    if (mimetype.includes('word')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '📽️';
    return '📎';
  };

  const downloadAsset = async (assetId, originalName) => {
    try {
      const API_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800";
      const response = await fetch(`${API_URI}/api/task/${taskId}/assets/${assetId}/download`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("File downloaded successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Download failed");
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Download failed. Please try again.");
    }
  };

  const deleteAsset = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    setDeletingAsset(assetId);
    
    try {
      const API_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800";
      const response = await fetch(`${API_URI}/api/task/${taskId}/assets/${assetId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const result = await response.json();

      if (result.status) {
        toast.success("File deleted successfully");
        if (onAssetDeleted) {
          onAssetDeleted();
        }
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeletingAsset(null);
    }
  };

  const handlePreview = (asset) => {
    setPreviewAsset(asset);
    setIsPreviewOpen(true);
  };

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assets.map((asset) => (
        <div
          key={asset._id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 flex-1">
            <span className="text-2xl">{getFileIcon(asset.mimetype)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {asset.originalName}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatFileSize(asset.size)}</span>
                <span>•</span>
                <span>{formatDate(asset.uploadedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              icon={<MdPreview className="text-lg" />}
              onClick={() => handlePreview(asset)}
              className="text-blue-600 hover:text-blue-800 p-2"
              title="Preview"
            />
            <Button
              icon={<MdDownload className="text-lg" />}
              onClick={() => downloadAsset(asset._id, asset.originalName)}
              className="text-green-600 hover:text-green-800 p-2"
              title="Download"
            />
            <Button
              icon={<MdDelete className="text-lg" />}
              onClick={() => deleteAsset(asset._id)}
              disabled={deletingAsset === asset._id}
              className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50"
              title="Delete"
            />
          </div>
        </div>
      ))}

      {/* Preview Modal */}
      <AssetPreview
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewAsset(null);
        }}
        asset={previewAsset}
        taskId={taskId}
      />
    </div>
  );
};

AssetList.propTypes = {
  assets: PropTypes.array,
  taskId: PropTypes.string.isRequired,
  onAssetDeleted: PropTypes.func.isRequired,
};

export default AssetList;
