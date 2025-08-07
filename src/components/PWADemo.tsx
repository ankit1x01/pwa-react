import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from './NetworkStatus';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  synced: boolean;
}

const PWADemo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    // Load todos from localStorage on component mount
    const savedTodos = localStorage.getItem('pwa-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever todos change
    localStorage.setItem('pwa-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    // Simulate syncing unsynced items when online
    if (isOnline) {
      const unsyncedTodos = todos.filter(todo => !todo.synced);
      if (unsyncedTodos.length > 0) {
        setTimeout(() => {
          setTodos(prevTodos =>
            prevTodos.map(todo => ({ ...todo, synced: true }))
          );
        }, 1000);
      }
    }
  }, [isOnline, todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        synced: isOnline
      };
      setTodos(prev => [...prev, newItem]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, synced: isOnline }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ marginTop: 0, color: '#495057', textAlign: 'center' }}>
        PWA Demo: Offline Todo App
      </h3>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <small style={{ color: '#6c757d' }}>
          {isOnline 
            ? '🟢 Online - Changes sync automatically'
            : '🔴 Offline - Changes saved locally'
          }
        </small>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Add
        </button>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {todos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #e9ecef',
                gap: '10px'
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ cursor: 'pointer' }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#6c757d' : '#343a40',
                  fontSize: '14px'
                }}
              >
                {todo.text}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: todo.synced ? '#28a745' : '#ffc107',
                  fontWeight: 'bold'
                }}
              >
                {todo.synced ? '✓' : '⏳'}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#6c757d', textAlign: 'center' }}>
        <p>
          ✓ = Synced to server | ⏳ = Waiting to sync<br/>
          Data persists offline and syncs when online
        </p>
      </div>
    </div>
  );
};

export default PWADemo;
