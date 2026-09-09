import { Card, ColumnStatus } from '../types/kanban';

/**
 * Reordena itens dentro de uma mesma coluna
 */
export function reorderList(list: Card[], startIndex: number, endIndex: number): Card[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Atualiza as propriedades 'order' localmente
  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
}

/**
 * Move um card de uma coluna para outra
 */
export function moveBetweenLists(
  sourceList: Card[],
  destinationList: Card[],
  sourceIndex: number,
  destinationIndex: number,
  newStatus: ColumnStatus
): { newSource: Card[]; newDestination: Card[]; movedCard: Card } {
  const sourceClone = Array.from(sourceList);
  const destClone = Array.from(destinationList);
  
  const [removed] = sourceClone.splice(sourceIndex, 1);
  const updatedCard: Card = {
    ...removed,
    status: newStatus,
    order: destinationIndex,
  };

  destClone.splice(destinationIndex, 0, updatedCard);

  const newSource = sourceClone.map((item, index) => ({
    ...item,
    order: index,
  }));

  const newDestination = destClone.map((item, index) => ({
    ...item,
    order: index,
  }));

  return {
    newSource,
    newDestination,
    movedCard: updatedCard,
  };
}
