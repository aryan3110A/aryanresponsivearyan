"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/app/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

// NavigationFeatuesall component for animated border effect
export function NavigationFeatuesall({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = useCallback((currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  }, [clockwise]);

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(40% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(35% 50% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(40% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(35% 50% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, rotateDirection]);

  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border border-gray-600 content-center bg-black/10 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(1px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction]]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  // containerClassName,
  // activeTabClassName,
  // tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div className="relative flex justify-center items-center mb-4">
        <NavigationFeatuesall
          as="div"
          containerClassName="bg-black rounded-full p-2"
          className="bg-black rounded-full p-2"
        >
          <div className="flex space-x-2 min-w-max px-1 overflow-x-auto scrollbar-hide relative z-10">
            {propTabs.map((tab, idx) => (
              <button
                key={tab.title}
                onClick={() => {
                  moveSelectedTabToTop(idx);
                }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={`px-8 py-3 rounded-full text-medium font-medium transition-all duration-200 whitespace-nowrap ${
                  active.value === tab.value
                    ? 'bg-[#006AFF] text-white shadow-md transform scale-105'
                    : 'text-white hover:bg-gray-900 hover:text-white'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </NavigationFeatuesall>
        
        {/* Add scrollbar hide styles */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar { 
            display: none;
          }
        `}</style>
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn("mt-4", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className="relative w-full h-full bg-transparent ">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn("w-full h-full absolute top-0 left-0 bg-transparent", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
