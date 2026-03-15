'use client';

import axios from 'axios';
import { Task, TaskFormData, User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';




// ─── Axios Instance ──────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/user/', 
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mini-tasks-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('mini-tasks-token');
      localStorage.removeItem('mini-tasks-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Mock helpers (localStorage-backed) ──────────────────────────
function getUsers(): (User & { password: string })[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('mini-tasks-users');
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem('mini-tasks-users', JSON.stringify(users));
}

function getTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('mini-tasks-tasks');
  return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem('mini-tasks-tasks', JSON.stringify(tasks));
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function delay(ms: number = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Auth API ────────────────────────────────────────────────────
export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth', {
      username: credentials.username,
      password: credentials.password,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    throw {
      response: {
        data: {
          message: axiosError?.response?.data?.message || 'Invalid username or password',
        },
        status: axiosError?.response?.status || 401,
      },
    };
  }
}

export async function registerApi(credentials: RegisterCredentials): Promise<AuthResponse> {
  await delay();
  const users = getUsers();
  if (users.find((u) => u.username === credentials.username)) {
    throw { response: { data: { message: 'Username already registered' }, status: 409 } };
  }
  const newUser = {
    id: generateId(),
    username: credentials.username,
    password: credentials.password,
    role: 'USER',
  };
  users.push(newUser);
  saveUsers(users);
  const token = `mock-jwt-${newUser.id}-${Date.now()}`;
  // Return shape now matches AuthResponse — no user wrapper
  return { token, username: newUser.username, role: newUser.role };
}

// ─── Tasks API ───────────────────────────────────────────────────
export async function fetchTasks(): Promise<Task[]> {
  await delay();
  return getTasks();
}

export async function fetchTask(id: string): Promise<Task> {
  await delay();
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw { response: { data: { message: 'Task not found' }, status: 404 } };
  }
  return task;
}

export async function createTask(data: TaskFormData): Promise<Task> {
  await delay();
  const tasks = getTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export async function updateTask(id: string, data: TaskFormData): Promise<Task> {
  await delay();
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw { response: { data: { message: 'Task not found' }, status: 404 } };
  }
  tasks[index] = {
    ...tasks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveTasks(tasks);
  return tasks[index];
}

export async function deleteTask(id: string): Promise<void> {
  await delay();
  const tasks = getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) {
    throw { response: { data: { message: 'Task not found' }, status: 404 } };
  }
  saveTasks(filtered);
}

export default api;
