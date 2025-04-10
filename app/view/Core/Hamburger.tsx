"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, X, Settings, LogOut } from "lucide-react";
import { auth } from "@/database/firebase";
import { signOut } from "firebase/auth";
import { getImageUrl } from "@/routes/imageroute";
import SettingNavigation from "./Setting";

export default function Hamburger({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [username, setUsername] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => {
            onClose();
            setIsSettingsOpen(false);
          }}
        />
      )}

      <nav
        className={`fixed top-0 left-0 bottom-0 w-[20vw] max-w-[280px] min-w-[250px] bg-[#171717] border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden font-poppins">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {/* Close */}
            {showCloseButton && (
              <button onClick={onClose} className="absolute top-4 right-4 mt-[8%] rounded-lg">
                <X className="w-10 h-10" />
              </button>
            )}

            {/* Profile Section */}
            <div className="relative mt-[30%]">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#252525] hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3 ml-[2%]">
                  <Image src={getImageUrl("core", "profile")} alt="User" width={32} height={32} className="rounded-full object-cover" />
                  <span>Profile</span>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#252525] rounded-lg border border-gray-800 shadow-xl z-50">
                  <div className="p-2">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-[#1e1e1e]">
                      <Image
                        src={getImageUrl("core", "profile")}
                        alt="User"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span>{username || "User"}</span>
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Image src={getImageUrl("core", "coins")} alt="coins" width={16} height={16} />
                          <div className="bg-gray-800 rounded px-1 text-xs">20</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 my-2" />

                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="text-sm">Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings UI */}
          <SettingNavigation
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            hamburgerOpen={isOpen}
            profiles={[{ name: username, credits: 20, isActive: true }]}
          />
        </div>
      </nav>
    </>
  );
}
