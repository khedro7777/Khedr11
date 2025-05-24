import apiClient from "@/lib/apiClient";

// Interface for file upload response
interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    path: string; // Relative path from backend (e.g., /uploads/filename.ext)
    mimetype: string;
    size: number;
  };
}

// File service functions
export const fileService = {
  uploadFile: async (file: File): Promise<FileUploadResponse["data"]> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post<FileUploadResponse>("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "File upload failed");
      }
    } catch (error: any) {
      console.error("File upload error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred during file upload.");
    }
  },

  // Function to get the full URL for a file stored on the backend
  getFileUrl: (relativePath: string): string => {
    // Construct the full URL based on the backend base URL and the relative path
    const backendBaseUrl = process.env.NODE_ENV === 'production' 
        ? 'YOUR_PRODUCTION_BACKEND_URL' // Replace later
        : 'http://localhost:5000'; // Base URL without /api
    
    // Ensure the relative path starts with a slash if it doesn't already
    const filePath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    
    return `${backendBaseUrl}${filePath}`; 
    // Example: http://localhost:5000/uploads/file-1678886400000-123456789.pdf
  },

  // Optional: Delete file function (requires backend endpoint and permissions)
  deleteFile: async (filename: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/files/${filename}`);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to delete file");
      }
    } catch (error: any) {
      console.error("Delete file error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while deleting the file.");
    }
  },
};

