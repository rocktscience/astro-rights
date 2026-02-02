import React from 'react';
// Placeholder: swap for dnd-kit or react-beautiful-dnd implementation

interface DragDropListProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  onReorder: (newOrder: T[]) => void;
}

export function DragDropList<T>({ items, renderItem }: DragDropListProps<T>) {
  // TODO: Implement drag-and-drop logic
  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="mb-2 last:mb-0">
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
}
