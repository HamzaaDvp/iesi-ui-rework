import React from 'react';
import {
  AppBar, Box, IconButton, Toolbar, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type TProps = {
  children: React.ReactNode
};

export default function Appshell({ children }: TProps) {
  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 8 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              IESI
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </>
  );
}
