import PropTypes from "prop-types";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react'
import './header.css';
import { Link } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Moon icon for dark mode
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Sun icon for light mode


// const pages = ['Posts', 'Sign In', 'Sign Up'];
// const signedInPages = ['Posts', 'Publish a Post']
// const settings = ['Profile', 'Logout'];

//Header receives a isSigned in Prop
//we shall render header based on wether user is signed in or not
export default function Header({ isSignedIn, user, toggleTheme, themeMode }) {
    let token = ''
    // console.log('User in header', user)
    if (isSignedIn) {
        token = localStorage.getItem('token');
    }

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <>
            <AppBar position="sticky">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            ODIN BLOG
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {isSignedIn ?

                                    <>
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>
                                                {themeMode == 'light' ? <Link to="/" style={{ color: 'black' }}>Posts</Link> : <Link to="/">Posts</Link>} 
                                                
                                            </Typography>
                                        </MenuItem>

                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>
                                            {themeMode == 'light' ?
                                                <a href={`https://odin-blog-editor.netlify.app/?token=${encodeURIComponent(token)}`} target='_blank' style={{ color: 'black' }}>New Post</a> :
                                                <a href={`https://odin-blog-editor.netlify.app/?token=${encodeURIComponent(token)}`} target='_blank'>New Post</a>}
                                            </Typography>
                                        </MenuItem>
                                        <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
                                            {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                                        </IconButton>
                                    </>
                                    :
                                    <>
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>
                                                <Link to="/" style={{ color: 'black' }}>Posts</Link>
                                            </Typography>
                                        </MenuItem>

                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>
                                                <Link to="/sign-in" style={{ color: 'black' }}>Sign In</Link>
                                            </Typography>
                                        </MenuItem>

                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>
                                                <Link to="/sign-up" style={{ color: 'black' }}>Sign Up</Link>
                                            </Typography>
                                        </MenuItem>
                                        <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
                                            {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                                        </IconButton>
                                    </>
                                }

                            </Menu>
                        </Box>

                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            ODIN BLOG
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {isSignedIn ?

                                <>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        <Link to='/'>Posts</Link>
                                    </Button>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        <a href={`https://odin-blog-editor.netlify.app/?token=${encodeURIComponent(token)}`} target="_blank">New Post</a>
                                    </Button>
                                    <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
                                        {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                                    </IconButton>
                                </>
                                :
                                <>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        <Link to='/' >Posts</Link>
                                    </Button>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        <Link to='/sign-in' >Sign In</Link>
                                    </Button>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        <Link to='/sign-up' >Sign Up</Link>
                                    </Button>
                                    <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
                                        {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                                    </IconButton>

                                </>

                            }
                        </Box>
                        {isSignedIn ?
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="User" sx={{ color: 'black' }}> {user?.name?.charAt(0)} </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >

                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>
                                            <Link to="/profile">Profile</Link>
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>
                                            <Link to="/logout">Logout</Link>
                                        </Typography>
                                    </MenuItem>

                                </Menu>
                            </Box> : <></>}

                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

Header.propTypes = {
    isSignedIn: PropTypes.bool,
    user: PropTypes.object,
    toggleTheme: PropTypes.func.isRequired,
    themeMode: PropTypes.string.isRequired,
}

