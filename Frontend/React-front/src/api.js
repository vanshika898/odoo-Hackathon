const BASE_URL = "http://localhost:3000/api/v1";

export async function request(method, path, body = null, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    credentials: "include",
    ...options,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, config);
    
    // Check for file download (e.g. CSV report)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/csv")) {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || "CSV download failed");
      }
      return text;
    }
    
    let result = {};
    try {
      result = await response.json();
    } catch (e) {
      // Return empty if no json
    }

    if (!response.ok) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error(`API Error on ${method} ${path}:`, error);
    throw error;
  }
}

export const api = {
  get: (path, options) => request("GET", path, null, options),
  post: (path, body, options) => request("POST", path, body, options),
  put: (path, body, options) => request("PUT", path, body, options),
  patch: (path, body, options) => request("PATCH", path, body, options),
  delete: (path, options) => request("DELETE", path, null, options),
};
