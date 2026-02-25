const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white p-8">

            <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-xl p-8">

                {/* Perfil superior */}
                <div className="flex items-center gap-6 border-b border-slate-700 pb-6">
                    <img
                        src="/path-to-avatar.png"
                        alt="Avatar"
                        className="w-32 h-32 rounded-full border-4 border-blue-500"
                    />

                    <div>
                        <h2 className="text-4xl font-bold">Nombre del Jugador</h2>
                        <p className="text-slate-300">Nivel: 42 | RPG Warrior</p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 text-center mt-8">
                    <div className="bg-slate-700 rounded-xl p-4">
                        <p className="text-2xl font-semibold">5320</p>
                        <p className="text-slate-300 text-sm">Puntos</p>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-4">
                        <p className="text-2xl font-semibold">149</p>
                        <p className="text-slate-300 text-sm">Victorias</p>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-4">
                        <p className="text-2xl font-semibold">12</p>
                        <p className="text-slate-300 text-sm">Torneos</p>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 mt-8 justify-center">
                    <button className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-lg font-semibold shadow-lg">
                        Editar Perfil
                    </button>

                    <button className="bg-white text-slate-900 hover:bg-slate-200 transition px-6 py-3 rounded-lg font-semibold shadow-lg">
                        Cerrar Sesión
                    </button>
                </div>

            </div>

        </div>
    );
};

export default ProfilePage;