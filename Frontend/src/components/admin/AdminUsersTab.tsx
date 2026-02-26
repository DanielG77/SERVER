import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { adminUserService } from '../../services/userService';
import ConfirmDialog from '../ConfirmDialog';
import { User, UserUpdateRequest, PaginatedResponse } from '../../shared/types/api.types';

const AdminUsersTab: React.FC = () => {
    const { showSuccess, showError } = useNotification();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<UserUpdateRequest>({});

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isHardDelete, setIsHardDelete] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [currentPage]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await adminUserService.getAllUsers(currentPage, 10);
            if (response.success && response.data) {
                setUsers(response.data.content || []);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            showError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditFormData({
            email: user.email,
            roles: user.roles,
            isActive: user.isActive,
        });
        setIsEditFormOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;

        try {
            setIsEditLoading(true);
            const response = await adminUserService.updateUser(editingUser.id, editFormData);

            if (response.success && response.data) {
                const updatedUser: User = response.data;

                setUsers(
                    users.map(u =>
                        u.id === editingUser.id ? updatedUser : u
                    )
                );

                showSuccess('Usuario actualizado');
            } else {
                showError(response.message || 'Error');
            }

            setIsEditFormOpen(false);
            setEditingUser(null);

        } catch (error) {
            console.error('Error:', error);
            showError('Error al actualizar usuario');
        } finally {
            setIsEditLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleteLoading(true);
            let response;

            if (isHardDelete) {
                response = await adminUserService.hardDeleteUser(userToDelete.id);
            } else {
                response = await adminUserService.softDeleteUser(userToDelete.id);
            }

            if (response.success) {
                setUsers(users.filter(u => u.id !== userToDelete.id));
                showSuccess(isHardDelete ? 'Usuario eliminado permanentemente' : 'Usuario desactivado');
            } else {
                showError(response.message || 'Error');
            }

            setDeleteConfirmOpen(false);
            setUserToDelete(null);
            setIsHardDelete(false);
        } catch (error) {
            console.error('Error:', error);
            showError('Error al eliminar');
        } finally {
            setIsDeleteLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Cargando...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-2xl font-bold">Usuarios ({users.length})</h3>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-700">
                        <tr className="text-gray-400">
                            <th className="px-4 py-3">Usuario</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Roles</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Creado</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                <td className="px-4 py-3">{user.username}</td>
                                <td className="px-4 py-3 text-gray-400">{user.email}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {user.roles?.map((role) => (
                                            <span key={role} className="px-2 py-1 bg-blue-900 rounded text-xs">
                                                {role.replace('ROLE_', '')}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={user.isActive ? 'text-green-400' : 'text-red-400'}>
                                        {user.isActive ? '✓ Activo' : '✗ Inactivo'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-blue-400 hover:text-blue-300"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUserToDelete(user);
                                                setIsHardDelete(false);
                                                setDeleteConfirmOpen(true);
                                            }}
                                            className="text-red-400 hover:text-red-300"
                                            title="Desactivar"
                                        >
                                            🗑️
                                        </button>
                                        {!user.isActive && (
                                            <button
                                                onClick={() => {
                                                    setUserToDelete(user);
                                                    setIsHardDelete(true);
                                                    setDeleteConfirmOpen(true);
                                                }}
                                                className="text-gray-400 hover:text-gray-300"
                                                title="Eliminar permanentemente"
                                            >
                                                ⚠️
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                    Página {currentPage + 1} de {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition"
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition"
                    >
                        Siguiente →
                    </button>
                </div>
            </div>

            {/* Edit Form Modal */}
            {isEditFormOpen && editingUser && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-6">Editar Usuario: {editingUser.username}</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveEdit();
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editFormData.email || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Roles</label>
                                <div className="space-y-2">
                                    {['ADMIN', 'USER'].map((role) => (
                                        <label key={role} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={editFormData.roles?.includes(`ROLE_${role}`) || false}
                                                onChange={(e) => {
                                                    const newRoles = editFormData.roles || [];
                                                    if (e.target.checked) {
                                                        setEditFormData({
                                                            ...editFormData,
                                                            roles: [...newRoles, `ROLE_${role}`]
                                                        });
                                                    } else {
                                                        setEditFormData({
                                                            ...editFormData,
                                                            roles: newRoles.filter(r => r !== `ROLE_${role}`)
                                                        });
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span>{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editFormData.isActive !== false}
                                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">Usuario activo</span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditFormOpen(false)}
                                    className="flex-1 px-4 py-2 rounded border border-gray-600 hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isEditLoading}
                                    className="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isEditLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title={isHardDelete ? "Eliminar Permanentemente" : "Desactivar Usuario"}
                message={`¿Estás seguro de que deseas ${isHardDelete ? 'eliminar permanentemente' : 'desactivar'} al usuario "${userToDelete?.username}"?`}
                confirmText={isHardDelete ? "Eliminar" : "Desactivar"}
                isDangerous={true}
                isLoading={isDeleteLoading}
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleteConfirmOpen(false);
                    setUserToDelete(null);
                    setIsHardDelete(false);
                }}
            />
        </div>
    );
};

export default AdminUsersTab;
