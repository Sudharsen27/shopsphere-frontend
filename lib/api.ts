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
    
    // Handle rate limiting (429) before trying to parse JSON
    if (response.status === 429) {
      let message = "Too many requests, please try again later";
      try {
        const data = await response.json();
        message = data.message || message;
      } catch {
        // If JSON parsing fails, use default message
      }
      throw new ApiError(message, 429);
    }

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
};

// Products API
export async function fetchProducts() {
  return fetchApi<any[]>("/products", {
    cache: "no-store",
  });
}
