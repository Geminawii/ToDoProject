import React from "react";
import { Loader as LoaderIcon } from "lucide-react";

interface LoaderCompProps {
  size?: number;
  color?: string;
}

export const LoaderComp: React.FC<LoaderCompProps> = ({
  size = 48,
  color = "text-orange-500",
}) => {
  return (
    <LoaderIcon
      aria-label="loading spinner"
      className={`animate-spin ${color}`}
      style={{ width: size, height: size }}
    />
  );
};
