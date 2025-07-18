import { useState } from "react";
import { Box } from "@rarui-react/components";

import { Header, Menu, Sidebar } from "..";

const Template: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenu = () => setMenuOpen(!menuOpen);

  return (
    <Box width="100%" minHeight="100dvh" display="flex" flexDirection="column">
      <Header handleMenu={handleMenu} />
      <Box display="flex">
        <Menu open={menuOpen} />
        <Sidebar open={menuOpen} handleMenu={handleMenu} />
        <Box
          as="main"
          width="100%"
          minHeight="calc(100dvh - 70px)"
          padding="$xs"
          backgroundColor="$background"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Template;
