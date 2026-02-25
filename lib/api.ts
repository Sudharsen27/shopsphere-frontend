const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${user.token}`,
          };
        }
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        throw new ApiError(
          data.message || "Validation failed",
          response.status,
          data.errors
        );
      }

      throw new ApiError(
        data.message || "Request failed",
        response.status
      );
    }

    return data.data || data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error or other issues
    throw new ApiError(
      "Network error. Please check your connection.",
      0
    );
  }
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi<{
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string) => {
    return fetchApi<{
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  verifyToken: async () => {
    return fetchApi<{
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }>("/auth/verify");
  },

  getProfile: async () => {
    return fetchApi<{
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        addresses?: Array<{
          _id: string;
          address: string;
          city: string;
          postalCode: string;
          country: string;
          isDefault?: boolean;
        }>;
      };
    }>("/auth/profile");
  },

  updateProfile: async (name: string, email: string) => {
    return fetchApi<{
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return fetchApi<{ message: string }>("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  forgotPassword: async (email: string) => {
    return fetchApi<{
      message: string;
      resetToken?: string;
      resetUrl?: string;
    }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, password: string) => {
    return fetchApi<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  // Saved addresses
  addAddress: (address: string, city: string, postalCode: string, country: string, isDefault?: boolean) =>
    fetchApi<{ address: any; addresses: any[] }>("/auth/addresses", {
      method: "POST",
      body: JSON.stringify({ address, city, postalCode, country, isDefault }),
    }),
  updateAddress: (id: string, data: { address?: string; city?: string; postalCode?: string; country?: string; isDefault?: boolean }) =>
    fetchApi<{ addresses: any[] }>(`/auth/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAddress: (id: string) =>
    fetchApi<{ addresses: any[] }>(`/auth/addresses/${id}`, { method: "DELETE" }),
  setDefaultAddress: (id: string) =>
    fetchApi<{ addresses: any[] }>(`/auth/addresses/${id}/default`, { method: "PATCH" }),
};

// Admin stats
export async function getAdminStats() {
  return fetchApi<{
    totalOrders: number;
    totalRevenue: number;
    revenueToday: number;
    revenueThisMonth: number;
    ordersToday: number;
    ordersThisMonth: number;
    totalUsers: number;
    lowStockCount: number;
    lowStockProducts: Array<{ _id: string; name: string; countInStock: number; price: number }>;
    recentOrders: any[];
    topProducts: Array<{ name: string; totalQty: number; totalRevenue: number; productId: string }>;
  }>("/admin/stats");
}

// Products API
export async function fetchProducts() {
  return fetchApi<any[]>("/products", {
    cache: "no-store",
  });
}
