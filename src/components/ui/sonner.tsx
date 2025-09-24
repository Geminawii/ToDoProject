import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps as SonnerProps } from "sonner";

interface ToasterProps extends SonnerProps {}

const Toaster: React.FC<ToasterProps> = (props) => {
  const { theme = "system" } = useTheme();

  const sonnerTheme = (["light", "dark", "system"].includes(theme)
    ? theme
    : "system") as "light" | "dark" | "system";

  return (
    <Sonner
      theme={sonnerTheme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties} 
      {...props}
    />
  );
};

export { Toaster };
