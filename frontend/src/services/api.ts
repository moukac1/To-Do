/**
 * API Service for communicating with the backend
 *
 * Authentication:
 * - Token is stored in localStorage (key: 'token')
 * - Token is automatically included in Authorization header for all requests
 * - Alternative: Store token in memory (useState) for better security but requires re-login on refresh
 */

const API_BASE_URL = "http://localhost:3000/api";

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth endpoints
  async register(
    email: string,
    password: string,
    name?: string
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.setAuthToken(data.accessToken);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.setAuthToken(data.accessToken);
    return data;
  }

  setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  removeAuthToken(): void {
    localStorage.removeItem("token");
  }

  getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Task endpoints
  async getTasks(doneFilter?: boolean): Promise<Task[]> {
    const url =
      doneFilter !== undefined
        ? `${API_BASE_URL}/tasks?done=${doneFilter}`
        : `${API_BASE_URL}/tasks`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<Task[]>(response);
  }

  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<Task>(response);
  }

  async createTask(title: string, description?: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ title, description }),
    });

    return this.handleResponse<Task>(response);
  }

  async updateTask(
    id: string,
    updates: { title?: string; description?: string; done?: boolean }
  ): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse<Task>(response);
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    await this.handleResponse<void>(response);
  }
}

export default new ApiService();
export type { User, Task, AuthResponse };
