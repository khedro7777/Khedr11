import apiClient from "@/lib/apiClient";
import { Arbitration, ArbitrationStatus, Group, GroupStatus } from "@/types"; // Assuming types are defined

// Interfaces for API responses and request bodies
interface ArbitrationResponse {
  success: boolean;
  data: Arbitration;
}

interface ArbitrationsResponse {
  success: boolean;
  count: number;
  data: Arbitration[];
}

interface GroupResponse {
    success: boolean;
    data: Group;
    message?: string;
}

interface RequestArbitrationData {
  group: string; // Group ID
  disputeType: string;
  description: string;
  evidence?: string[]; // Array of file IDs or URLs
  proposedAction: string;
}

interface ReviewArbitrationData {
  status: ArbitrationStatus; // "pending", "reviewing", "resolved", "rejected"
  resolution?: string;
  notes?: string;
}

// Arbitration service functions
export const arbitrationService = {
  requestArbitration: async (data: RequestArbitrationData): Promise<Arbitration> => {
    try {
      const response = await apiClient.post<ArbitrationResponse>("/arbitration", data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to request arbitration");
      }
    } catch (error: any) {
      console.error("Request arbitration error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while requesting arbitration.");
    }
  },

  getArbitrationById: async (id: string): Promise<Arbitration> => {
    try {
      const response = await apiClient.get<ArbitrationResponse>(`/arbitration/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch arbitration details");
      }
    } catch (error: any) {
      console.error("Get arbitration by ID error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching arbitration details.");
    }
  },

  getGroupArbitrations: async (groupId: string): Promise<Arbitration[]> => {
    try {
      // Note: Backend route is /api/arbitration/group/:groupId based on routes file
      const response = await apiClient.get<ArbitrationsResponse>(`/arbitration/group/${groupId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch group arbitrations");
      }
    } catch (error: any) {
      console.error("Get group arbitrations error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching group arbitrations.");
    }
  },

  reviewArbitration: async (id: string, data: ReviewArbitrationData): Promise<Arbitration> => {
    try {
      const response = await apiClient.put<ArbitrationResponse>(`/arbitration/${id}/review`, data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to review arbitration case");
      }
    } catch (error: any) {
      console.error("Review arbitration error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while reviewing the arbitration case.");
    }
  },

  // Group freeze/unfreeze related to arbitration
  freezeGroup: async (groupId: string): Promise<Group> => {
    try {
        // Note: Backend route is /api/arbitration/groups/:id/freeze based on routes file
        const response = await apiClient.put<GroupResponse>(`/arbitration/groups/${groupId}/freeze`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Failed to freeze group");
        }
    } catch (error: any) {
        console.error("Freeze group error:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "An error occurred while freezing the group.");
    }
  },

  unfreezeGroup: async (groupId: string): Promise<Group> => {
    try {
        // Note: Backend route is /api/arbitration/groups/:id/unfreeze based on routes file
        const response = await apiClient.put<GroupResponse>(`/arbitration/groups/${groupId}/unfreeze`);
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Failed to unfreeze group");
        }
    } catch (error: any) {
        console.error("Unfreeze group error:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "An error occurred while unfreezing the group.");
    }
  },
};

