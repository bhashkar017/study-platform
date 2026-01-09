import { useState, useEffect } from 'react';
import axios from 'axios';
import { File, Download, Upload, Trash2 } from 'lucide-react';

const FileShare = ({ groupId }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, [groupId]);

    const fetchFiles = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/files/group/${groupId}`);
            setFiles(res.data);
        } catch (err) {
            console.error("Error fetching files:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('groupId', groupId);

        setUploading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFiles([res.data, ...files]);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Shared Files</h3>
                <div>
                    <label className={`cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload size={18} className="mr-2" />
                        {uploading ? 'Uploading...' : 'Upload File'}
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-500 text-center py-4">Loading files...</p>
            ) : files.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No files shared yet.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {files.map((file) => (
                        <li key={file._id} className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-md transition">
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <File className="text-indigo-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                                    <p className="text-xs text-gray-500">
                                        {file.uploader?.username || 'Unknown'} • {new Date(file.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <a
                                href={file.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-indigo-600 p-2 transition-colors"
                                title="Download"
                                download
                            >
                                <Download size={20} />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileShare;
