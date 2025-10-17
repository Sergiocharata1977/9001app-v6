import { useState, useEffect } from 'react';

/**
 * Hook genérico para operaciones ABM (Alta, Baja, Modificación)
 * @param fetchItems Función para obtener los items
 * @param createItem Función para crear un nuevo item
 * @param updateItem Función para actualizar un item
 * @param deleteItem Función para eliminar un item
 */
const useABM = <T extends { id: string | number }>(
  fetchItems: () => Promise<T[]>,
  createItem: (item: Omit<T, 'id'>) => Promise<T>,
  updateItem: (id: string | number, item: Partial<T>) => Promise<T>,
  deleteItem: (id: string | number) => Promise<void>
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);

  // Cargar items
  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      console.error('Error en useABM:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo item
  const handleCreate = async (newItem: Omit<T, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createItem(newItem);
      setItems(prev => [...prev, created]);
      setIsModalOpen(false);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el item');
      console.error('Error en useABM:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar item
  const handleUpdate = async (id: string | number, updatedData: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateItem(id, updatedData);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      setIsModalOpen(false);
      setCurrentItem(null);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el item');
      console.error('Error en useABM:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar item
  const handleDelete = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el item');
      console.error('Error en useABM:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear
  const openCreateModal = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (item: T) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  // Cargar items al montar el componente
  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    isModalOpen,
    currentItem,
    loadItems,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreateModal,
    openEditModal,
    closeModal
  };
};

export default useABM;