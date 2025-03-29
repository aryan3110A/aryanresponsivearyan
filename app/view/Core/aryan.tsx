"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  X,
  Home,
  Grid,
  Boxes,
  FileText,
  FolderKanban,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import SettingNavigation from "./Setting";

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  name: string;
  credits: number;
  isActive?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon?: JSX.Element | React.ReactNode; // Allow both JSX Elements and Image components
}

const profiles: Profile[] = [
  { name: "Name 1", credits: 20, isActive: true },
  { name: "Name 2", credits: 120 },
];

const sidebarItems: NavItem[] = [
  { label: "Home", href: "/view/home", icon: <Home className="w-6 h-6" /> },
  { label: "Apps", href: "/apps", icon: <Grid className="w-5 h-5" /> },
  { label: "Models", href: "/models", icon: <Boxes className="w-5 h-5" /> },
  {
    label: "Templates",
    href: "/view/templates",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderKanban className="w-5 h-5" />,
  },
];

const plansetting: NavItem[] = [
  {
    label: "Plans",
    href: "/view/pricing",
    icon: (
      <Image
        src="/navigationSetting/diamond.png"
        alt="Plans"
        width={20}
        height={20}
      />
    ),
  },
  {
    label: "Settings",
    href: "#",
    icon: <Settings className="w-5 h-5" />,
  },
];

const Hamburger: React.FC<NavbarProps> = ({ isOpen, onClose }) => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("Apps");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Function to handle settings click - toggle settings
  const handleSettingsClick = (): void => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Function to handle settings close
  const handleSettingsClose = (): void => {
    setIsSettingsOpen(false);
  };

  // Close settings when hamburger closes
  useEffect(() => {
    if (!isOpen && isSettingsOpen) {
      setIsSettingsOpen(false);
    }
  }, [isOpen, isSettingsOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => {
            onClose();
            setIsSettingsOpen(false);
          }}
        />
      )}

      {/* Sliding Navbar */}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-[20vw] max-w-[280px] min-w-[250px] bg-[#171717] border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full overflow-y-auto p-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 mt-[10%] rounded-lg transition-colors"
          >
            <X className="w-10 h-10" />
          </button>

          {/* Profile Button */}
          <div className="relative mt-[30%]">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[#252525] hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3 ml-[2%]">
                <Image
                  src="/navigationSetting/profile.png"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span>Profile</span>
              </div>
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#252525] rounded-lg border border-gray-800 shadow-xl z-50">
                <div className="p-2">
                  {profiles.map((profile, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredItem(profile.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Image
                        src="/navigationSetting/profile.png"
                        alt="User"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span>{profile.name}</span>
                          {profile.isActive && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Image
                            src="/navigationSetting/coins.png"
                            alt="User"
                            width={16}
                            height={16}
                          />
                          <div className="bg-gray-800 rounded px-1 text-xs">
                            {profile.credits}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="mt-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 p-3 transition-colors text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                onClick={() => {
                  setActiveItem(item.label);
                  onClose();
                  setIsSettingsOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Plans and Settings */}
          <div className="mt-6">
            {plansetting.map((item) =>
              item.label === "Settings" ? (
                <button
                  key={item.label}
                  className="flex items-center gap-4 p-3 transition-colors text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-left w-full"
                  onClick={handleSettingsClick}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-3 transition-colors text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Settings Component - passing hamburger state */}
      <SettingNavigation
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        hamburgerOpen={isOpen}
        profiles={profiles}
      />
    </>
  );
};

export default Hamburger;
