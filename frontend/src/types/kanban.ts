export type ColumnStatus = 'TODO' | 'DOING' | 'DONE';

export type CardPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Card {
  id: string;
  title: string;
  description?: string | null;
  status: ColumnStatus;
  order: number;
  priority: CardPriority;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnDefinition {
  id: ColumnStatus;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface CreateCardInput {
  title: string;
  description?: string;
  status: ColumnStatus;
  priority: CardPriority;
}

export interface UpdateCardInput {
  title?: string;
  description?: string;
  priority?: CardPriority;
}

export interface MoveCardPayload {
  newStatus: ColumnStatus;
  newOrder: number;
}
