import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.104:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get stored token
  async getToken() {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Set token
  async setToken(token) {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  // Remove token
  async removeToken() {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyToken(token) {
    return this.request('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resetPassword(email) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateLanguageSettings(sourceLang, targetLang) {
    return this.request('/users/language-settings', {
      method: 'PUT',
      body: JSON.stringify({ sourceLang, targetLang }),
    });
  }

  async updateSettings(settings) {
    return this.request('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getProgress() {
    return this.request('/users/progress');
  }

  async updateProgress(type, increment = 1) {
    return this.request('/users/progress', {
      method: 'POST',
      body: JSON.stringify({ type, increment }),
    });
  }

  async updateXP(xpGained) {
    return this.request('/users/xp', {
      method: 'POST',
      body: JSON.stringify({ xpGained }),
    });
  }

  async getLeaderboard(limit = 10) {
    return this.request(`/users/leaderboard?limit=${limit}`);
  }

  // Content endpoints
  async getVocabulary(sourceLang, targetLang, level = 1, limit = 10) {
    const params = new URLSearchParams({
      sourceLang,
      targetLang,
      level: level.toString(),
      limit: limit.toString(),
    });
    return this.request(`/content/vocabulary?${params}`);
  }

  async getGrammar(sourceLang, targetLang, level = 1, limit = 10) {
    const params = new URLSearchParams({
      sourceLang,
      targetLang,
      level: level.toString(),
      limit: limit.toString(),
    });
    return this.request(`/content/grammar?${params}`);
  }

  async getSentences(sourceLang, targetLang, level = 1, limit = 10) {
    const params = new URLSearchParams({
      sourceLang,
      targetLang,
      level: level.toString(),
      limit: limit.toString(),
    });
    return this.request(`/content/sentences?${params}`);
  }

  async getFillBlanks(sourceLang, targetLang, level = 1, limit = 10) {
    const params = new URLSearchParams({
      sourceLang,
      targetLang,
      level: level.toString(),
      limit: limit.toString(),
    });
    return this.request(`/content/fill-blanks?${params}`);
  }

  async getImageBased(sourceLang, targetLang, level = 1, limit = 10) {
    const params = new URLSearchParams({
      sourceLang,
      targetLang,
      level: level.toString(),
      limit: limit.toString(),
    });
    return this.request(`/content/image-based?${params}`);
  }

  // Create content (admin only)
  async createContent(type, title, sourceLang, targetLang, level, content) {
    return this.request('/content/create', {
      method: 'POST',
      body: JSON.stringify({ type, title, sourceLang, targetLang, level, content }),
    });
  }
}

export default new ApiService();