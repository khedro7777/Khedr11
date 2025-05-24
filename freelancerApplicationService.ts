import apiClient from "@/lib/apiClient";
import { Group, FreelancerApplication, ApplicationStatus } from "@/types"; // Assuming types are defined

// Interfaces for API responses and request bodies
interface OpenMissionsResponse {
  success: boolean;
  count: number;
  data: Group[]; // Groups seeking freelancers
}

interface ApplicationResponse {
  success: boolean;
  data: FreelancerApplication;
}

interface ApplicationsResponse {
  success: boolean;
  count: number;
  data: FreelancerApplication[];
}

interface SubmitApplicationData {
  group: string; // Group ID
  description: string;
  timeline: string;
  budget: number;
  currency?: string;
  attachments?: string[]; // Array of file IDs or URLs
}

interface ReviewApplicationData {
  status: ApplicationStatus; // "approved" or "rejected"
}

// Freelancer Application service functions
export const freelancerApplicationService = {
  getOpenMissions: async (): Promise<Group[]> => {
    try {
      const response = await apiClient.get<OpenMissionsResponse>("/freelancer-applications/open-missions");
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch open missions");
      }
    } catch (error: any) {
      console.error("Get open missions error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching open missions.");
    }
  },

  submitApplication: async (data: SubmitApplicationData): Promise<FreelancerApplication> => {
    try {
      const response = await apiClient.post<ApplicationResponse>("/freelancer-applications", data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error: any) {
      console.error("Submit application error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while submitting the application.");
    }
  },

  getApplicationById: async (id: string): Promise<FreelancerApplication> => {
    try {
      const response = await apiClient.get<ApplicationResponse>(`/freelancer-applications/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch application details");
      }
    } catch (error: any) {
      console.error("Get application by ID error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching application details.");
    }
  },

  getGroupApplications: async (groupId: string): Promise<FreelancerApplication[]> => {
    try {
      // Note: Backend route is /api/freelancer-applications/group/:id based on routes file
      const response = await apiClient.get<ApplicationsResponse>(`/freelancer-applications/group/${groupId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch group applications");
      }
    } catch (error: any) {
      console.error("Get group applications error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching group applications.");
    }
  },

  reviewApplication: async (id: string, data: ReviewApplicationData): Promise<FreelancerApplication> => {
    try {
      const response = await apiClient.put<ApplicationResponse>(`/freelancer-applications/${id}/review`, data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to review application");
      }
    } catch (error: any) {
      console.error("Review application error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while reviewing the application.");
    }
  },

  getMyApplications: async (): Promise<FreelancerApplication[]> => {
    try {
      const response = await apiClient.get<ApplicationsResponse>("/freelancer-applications/my");
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch freelancer applications");
      }
    } catch (error: any) {
      console.error("Get my applications error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching freelancer applications.");
    }
  },
};

