import React from 'react';
import {Box, Typography, Link, useTheme, IconButton} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                py: 2,
                px: 2,
                backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#f5f5f5',
                textAlign: 'center',
                borderTop: '1px solid',
                borderColor: theme.palette.divider,
            }}
        >
            <Typography variant="body2" color="textSecondary" mb={1}>
                Sviluppato da Davide Figuccia
            </Typography>

            <Box>
                <IconButton
                    component={Link}
                    href="mailto:davidefiguccia2020@outlook.it"
                    target="_blank"
                    rel="noopener"
                    aria-label="Email"
                >
                    <EmailIcon />
                </IconButton>
                <IconButton
                    component={Link}
                    href="https://it.linkedin.com/in/davide-figuccia-15a751158"
                    target="_blank"
                    rel="noopener"
                    aria-label="LinkedIn"
                >
                    <LinkedInIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Footer;