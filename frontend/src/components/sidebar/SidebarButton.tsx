import { Button, ButtonProps } from "@mantine/core";
import { ReactNode } from "react";

interface SidebarButtonProps extends Omit<ButtonProps, "leftIcon"> {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  icon,
  children,
  onClick,
  ...props
}) => {
  return (
    <Button
      fullWidth
      variant="subtle"
      onClick={onClick}
      component="button"   
      leftSection={icon}
      styles={{
        inner: { justifyContent: "flex-start", paddingLeft: 0 },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SidebarButton;
