// In Hamburger.tsx, update the component to pass hamburger state to Settings:

"use client";
import Image from "next/image";
import SettingNavigation from "./Setting";
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
  Diamond,
  LogOut,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";



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
  icon?: JSX.Element;
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
        alt="User"
        width={20}
        height={20}
        className=""
      />
    ),
  },
  {
    label: "Settings",
    href: "#",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function Hamburger({ isOpen, onClose }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showCredits, setShowCredits] = useState(true);
  const [activeItem, setActiveItem] = useState<string>("Apps");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Function to handle settings click - toggle settings
  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Function to handle settings close
  const handleSettingsClose = () => {
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
                  <div className="flex items-center gap-3 ml-[4%] mb-1">
                    <Image
                      src="/navigationSetting/profile.png"
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span>Profile</span>
                  </div>
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
                            className=""
                          />
                          <div className="bg-gray-800 rounded px-1 text-xs">
                            {profile.credits}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    className="w-full flex items-center gap-3 p-1 rounded-lg hover:bg-blue-500/20 transition-colors mt-0 "
                    onMouseEnter={() => setHoveredItem("add")}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Image
                      src="/navigationSetting/plus.png"
                      alt="User"
                      width={40}
                      height={40}
                      className=""
                    />
                    <span className="text-md -ml-2">Add profile</span>
                  </button>

                  <div className="border-t border-gray-800 my-0" />

                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20 transition-colors"
                    onMouseEnter={() => setHoveredItem("settings")}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={handleSettingsClick}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm">Settings</span>
                  </button>

                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/20 transition-colors"
                    onMouseEnter={() => setHoveredItem("logout")}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Credits Display */}
          <div className="flex items-center mt-[6%] bg-gray-900/50 rounded-lg pl-[16%] lg:gap-0 md:gap-6">
            {/* "20" Div */}
            <div className="items gap-0">
              <div className="flex rounded-full py-[1vh] pl-2 w-[6vw] border-2 gap-1 border-[#484848] bg-black text-white text-xs">
                <Image
                  src="/navigationSetting/coins.png"
                  alt="User"
                  width={20}
                  height={20}
                  className=""
                />
                <div className="flex items-center gap-3"></div> 20
              </div>
            </div>

            {/* Upgrade Button Overlapping */}
            <button className="flex bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-[0.72rem] px-2 py-[1.2vh] rounded-full hover:bg-blue-600 transition-colors -ml-[24%] gap-1">
              <Image
                src="/navigationSetting/diamond.png"
                alt="User"
                width={16}
                height={16}
                className=""
              />{" "}
              Upgrade
            </button>
          </div>

          {/* Current Plan Text */}
          <div className="text-[11px] ml-[26%] text-white mt-[1%]">
            Current Plan {">"} Basic
          </div>

          <div className="border-b-2 border-[#5A5A5A] bg-[#252525] w-[100vw] mt-[2%] -ml-[6%]"></div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-1 mt-[4%] w-[200%] -ml-[6%] font-poppins">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 p-3 py-[2.5%] transition-colors pl-[6%] text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
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

          <div className="border-b-2 border-[#5A5A5A] bg-[#252525] w-[100vw] mt-[5%] -ml-[6%]"></div>

          <div className="flex flex-col gap-1 mt-[6%] w-[200%] -ml-[6%] font-poppins">
            {plansetting.map((item) => (
              item.label === "Settings" ? (
                <button
                  key={item.label}
                  className="flex items-center gap-4 p-3 py-[2.5%] transition-colors pl-[6%] text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-left"
                  onClick={() => {
                    setActiveItem(item.label);
                    handleSettingsClick();
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-3 py-[2.5%] transition-colors pl-[6%] text-white hover:bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                  onClick={() => {
                    setActiveItem(item.label);
                    onClose();
                    setIsSettingsOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>

      {/* Settings Component - now passing hamburger state */}
      <SettingNavigation 
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        hamburgerOpen={isOpen}
        profiles={profiles}
      />
      
    </>
  );
}