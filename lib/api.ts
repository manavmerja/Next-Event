const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://next-event-backend.onrender.com/api"

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Get token from cookies (handled by browser automatically for httpOnly) or localStorage if you implemented that.
  // Since we use httpOnly cookies, we just need credentials: "include"
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include" as RequestCredentials, // Important for cookies
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || errorData.message || "API Request Failed")
  }

  // Handle CSV/Blob responses
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("text/csv")) {
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    return { message: "Download started" }
  }

  return response.json()
}

export const authAPI = {
  login: (credentials: any) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  signup: (data: any) => apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  getMe: () => apiRequest("/auth/me"),
  loginWithGitHub: (code: string) => apiRequest("/auth/github", { method: "POST", body: JSON.stringify({ code }) }),
  
  // Bookmark Toggle
  toggleBookmark: (eventId: string) => apiRequest(`/auth/bookmark/${eventId}`, { method: "PUT" }),
}

export const eventsAPI = {
  getAll: (params?: any) => {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
    return apiRequest(`/events${queryString}`)
  },
  getById: (id: string) => apiRequest(`/events/${id}`),
  create: (data: any) => apiRequest("/events", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/events/${id}`, { method: "DELETE" }),
  
  // Fallback for direct registration calls if used anywhere
  register: (eventId: string) => apiRequest("/registrations", { method: "POST", body: JSON.stringify({ eventId }) }),
}

// 👇 THIS WAS MISSING 👇
export const registrationsAPI = {
  register: (eventId: string) => apiRequest("/registrations", { method: "POST", body: JSON.stringify({ eventId }) }),
  checkStatus: (eventId: string) => apiRequest(`/registrations/status/${eventId}`),
  getMyRegistrations: () => apiRequest("/registrations/my"),
}
// 👆 ------------------ 👆

export const adminAPI = {
  getStats: () => apiRequest("/admin/stats"),
  getAllRegistrations: () => apiRequest("/admin/registrations"),
  downloadCSV: () => apiRequest("/admin/export"),
  syncTicketmaster: () => apiRequest("/admin/sync-ticketmaster", { method: "POST" }),
}