import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  duration = 300,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2",
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = "up",
  delay = 0,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    left: isVisible ? "translate-x-0" : "-translate-x-8",
    right: isVisible ? "translate-x-0" : "translate-x-8", 
    up: isVisible ? "translate-y-0" : "translate-y-8",
    down: isVisible ? "translate-y-0" : "-translate-y-8"
  };

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        directionClasses[direction],
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};
