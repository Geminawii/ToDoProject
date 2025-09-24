import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";


interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {}
const Avatar: React.FC<AvatarProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
};

interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {}
const AvatarImage: React.FC<AvatarImageProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
};


interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {}
const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex h-full w-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
};

export { Avatar, AvatarImage, AvatarFallback };
