import React from "react";
import { useAuthStore } from "../stores/authStore";

const NavbarComponent: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="bg-[#d5dede] text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold">Vite Commerce</span>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col items-end">
            <span className="mr-4">{user?.username}</span>
            <span className="mr-4">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
