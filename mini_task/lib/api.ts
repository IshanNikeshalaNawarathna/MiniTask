'use client';

import axios from 'axios';
import { Task, TaskFormData, PageResponse, AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';
import { extractErrorMessage } from '@/util/errorHandler';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  headers: { 'Content-Type': 'application/json', },
});

// Attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mini-tasks-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('mini-tasks-token');
      localStorage.removeItem('mini-tasks-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

function delay(ms: number = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//
// AUTH
//
export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const res = await api.post('/user/auth', credentials);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function registerApi(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const res = await api.post('/user', credentials);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}


//
// TASKS
//
export async function fetchTasks(
  page = 0,
  size = 5,
  status?: string,
  priority?: string
): Promise<PageResponse<Task>> {
  try {
    const res = await api.get('/task', {
      params: {
        page,
        size,
        status,
        priority,
        sortBy: 'dueDate',
        sortDir: 'asc',
      },
    });

    console.log('API RESPONSE:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('FETCH TASK ERROR:', error?.response || error);
    throw new Error(
      extractErrorMessage(error) || 'Failed to fetch tasks. Please try again.'
    );
  }
}
export async function createTask(data: TaskFormData) {
  try {


    const res = await api.post('/task', data);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
  try {
    const res = await api.put(`/task/${id}`, data);
    console.log('Updated task:', res.data + " " + id);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await api.delete(`/task/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateTaskStatus(id: string): Promise<void> {
  await delay();
  try {
    await api.get(`/task/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}