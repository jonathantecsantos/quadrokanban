import axios from 'axios';
import { Card, CreateCardInput, MoveCardPayload, UpdateCardInput } from '../types/kanban';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const kanbanApi = {
  // Healthcheck para verificar se a API está online ou acordando do cold-start do Render
  async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  // Retorna todos os cards
  async getCards(): Promise<Card[]> {
    const response = await api.get<Card[]>('/api/cards');
    return response.data;
  },

  // Cria um novo card
  async createCard(data: CreateCardInput): Promise<Card> {
    const response = await api.post<Card>('/api/cards', data);
    return response.data;
  },

  // Atualiza dados de um card existente
  async updateCard(id: string, data: UpdateCardInput): Promise<Card> {
    const response = await api.put<Card>(`/api/cards/${id}`, data);
    return response.data;
  },

  // Atualiza posição / status do card após Drag and Drop
  async moveCard(id: string, data: MoveCardPayload): Promise<Card> {
    const response = await api.patch<Card>(`/api/cards/${id}/move`, data);
    return response.data;
  },

  // Exclui um card
  async deleteCard(id: string): Promise<void> {
    await api.delete(`/api/cards/${id}`);
  },
};
