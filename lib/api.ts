const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"


export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "An error occurred")
  }

  return data
}

export const authAPI = {
  signup: (userData: any) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (credentials: any) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  getMe: () => apiRequest("/auth/me"),

  // --- NEW FUNCTION ---
  loginWithGitHub: (code: string) => 
    apiRequest("/auth/github", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
    
}

export const eventsAPI = {
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/events${query ? `?${query}` : ""}`)
  },
  getById: (id: string) => apiRequest(`/events/${id}`),
  create: (eventData: any) =>
    apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),
  update: (id: string, eventData: any) =>
    apiRequest(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }),
  delete: (id: string) => apiRequest(`/events/${id}`, { method: "DELETE" }),
  register: (id: string) => apiRequest(`/events/${id}/register`, { method: "POST" }),
  cancelRegistration: (id: string) => apiRequest(`/events/${id}/register`, { method: "DELETE" }),

  // --- NEW FUNCTION ---
  toggleBookmark: (id: string) => apiRequest(`/events/${id}/bookmark`, { method: "POST" }),

  // 1. Reviews Laao
  getReviews: (id: string) => apiRequest(`/events/${id}/reviews`),

  // 2. Naya Review Bhejo
  addReview: (id: string, data: { rating: number; comment: string }) =>
    apiRequest(`/events/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
}

export const usersAPI = {
  getMyRegistrations: () => apiRequest("/users/me/registrations"),
}

// Add this new object to your lib/api.ts file

export const adminAPI = {
  getAllUsers: () => apiRequest("/users"),

  getAllRegistrations: () => apiRequest("/admin/registrations"),
  
  updateUserRole: (userId: string, newRole: string) =>
    apiRequest(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    }),

  deleteUser: (userId: string) =>
    apiRequest(`/users/${userId}`, {
      method: "DELETE",
    }),
}
