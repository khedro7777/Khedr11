import apiClient from "@/lib/apiClient";
import { Group, GroupMember, GroupStatus, ResourceType } from "@/types"; // Assuming types are defined in @/types

// Interfaces for API responses and request bodies
interface GroupResponse {
  success: boolean;
  data: Group;
}

interface GroupsResponse {
  success: boolean;
  count: number;
  data: Group[];
}

interface MyGroupsResponse {
  success: boolean;
  createdGroups: Group[];
  joinedGroups: Group[];
}

interface GroupMembersResponse {
  success: boolean;
  count: number;
  data: GroupMember[];
}

interface CreateGroupData {
  name: string;
  description: string;
  sector: string;
  country: string;
  expectedMembers: number;
  resourceType: ResourceType;
}

interface UpdateGroupData {
  name?: string;
  description?: string;
  sector?: string;
  country?: string;
  expectedMembers?: number;
  resourceType?: ResourceType;
  status?: GroupStatus;
  // Add other updatable fields as needed
}

interface InviteData {
  email: string;
}

interface UpdateMemberRoleData {
  role: "member" | "admin";
}

// Group service functions
export const groupService = {
  createGroup: async (data: CreateGroupData): Promise<Group> => {
    try {
      const response = await apiClient.post<GroupResponse>("/groups", data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to create group");
      }
    } catch (error: any) {
      console.error("Create group error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while creating the group.");
    }
  },

  getGroups: async (filters?: { sector?: string; country?: string; status?: GroupStatus; resourceType?: ResourceType }): Promise<Group[]> => {
    try {
      const response = await apiClient.get<GroupsResponse>("/groups", { params: filters });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch groups");
      }
    } catch (error: any) {
      console.error("Get groups error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching groups.");
    }
  },

  getMyGroups: async (): Promise<{ createdGroups: Group[]; joinedGroups: Group[] }> => {
    try {
      const response = await apiClient.get<MyGroupsResponse>("/groups/my");
      if (response.data.success) {
        return { createdGroups: response.data.createdGroups, joinedGroups: response.data.joinedGroups };
      } else {
        throw new Error("Failed to fetch user groups");
      }
    } catch (error: any) {
      console.error("Get my groups error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching user groups.");
    }
  },

  getGroupById: async (id: string): Promise<Group> => {
    try {
      const response = await apiClient.get<GroupResponse>(`/groups/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch group details");
      }
    } catch (error: any) {
      console.error("Get group by ID error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching group details.");
    }
  },

  updateGroup: async (id: string, data: UpdateGroupData): Promise<Group> => {
    try {
      const response = await apiClient.put<GroupResponse>(`/groups/${id}`, data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to update group");
      }
    } catch (error: any) {
      console.error("Update group error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while updating the group.");
    }
  },

  joinGroup: async (id: string): Promise<Group> => {
    try {
      const response = await apiClient.post<GroupResponse>(`/groups/${id}/join`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to join group");
      }
    } catch (error: any) {
      console.error("Join group error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while joining the group.");
    }
  },

  leaveGroup: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.post<{ success: boolean }>(`/groups/${id}/leave`);
      if (!response.data.success) {
        throw new Error("Failed to leave group");
      }
    } catch (error: any) {
      console.error("Leave group error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while leaving the group.");
    }
  },

  inviteToGroup: async (id: string, data: InviteData): Promise<Group> => {
    try {
      const response = await apiClient.post<GroupResponse>(`/groups/${id}/invite`, data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to invite user");
      }
    } catch (error: any) {
      console.error("Invite to group error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while inviting the user.");
    }
  },

  getGroupMembers: async (id: string): Promise<GroupMember[]> => {
    try {
      const response = await apiClient.get<GroupMembersResponse>(`/groups/${id}/members`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch group members");
      }
    } catch (error: any) {
      console.error("Get group members error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching group members.");
    }
  },

  updateMemberRole: async (groupId: string, userId: string, data: UpdateMemberRoleData): Promise<Group> => {
    try {
      const response = await apiClient.put<GroupResponse>(`/groups/${groupId}/members/${userId}`, data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to update member role");
      }
    } catch (error: any) {
      console.error("Update member role error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while updating the member role.");
    }
  },
};

