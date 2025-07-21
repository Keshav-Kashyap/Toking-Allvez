import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconButton,
    Avatar,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider
} from '@mui/material';
import {
    Restore as RestoreIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Edit as EditIcon,
    KeyboardArrowDown as ArrowDownIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';

export const HomeNavbarItems = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [userData, setUserData] = useState({ name: '', username: '' });
    const open = Boolean(anchorEl);

    useEffect(() => {
        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData({
            name: user.name || 'User Name',
            username: user.username || 'username'
        });
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth");
    };

    return (
        <div className="flex items-center gap-3 pr-4">



            {/* Profile Section with Dropdown */}
            <Tooltip title="Profile Menu" arrow>
                <Box
                    onClick={handleClick}
                    className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f9fafb',
                            borderColor: '#d1d5db'
                        }
                    }}
                >
                    {/* Avatar */}
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#2563eb",
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            border: '2px solid #e5e7eb'
                        }}
                        className="ring-2 ring-blue-100"
                    >
                        <PersonIcon fontSize="small" />
                    </Avatar>

                    {/* User Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography
                            variant="body2"
                            className="text-gray-800 font-semibold leading-tight"
                            sx={{
                                fontSize: '14px',
                                lineHeight: 1.2
                            }}
                        >
                            {userData.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            className="text-gray-500 leading-tight"
                            sx={{
                                fontSize: '12px',
                                lineHeight: 1.2
                            }}
                        >
                            @{userData.username}
                        </Typography>
                    </Box>

                    {/* Dropdown Arrow */}
                    <ArrowDownIcon
                        className={`text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                        sx={{
                            fontSize: 18,
                            ml: 0.5
                        }}
                    />
                </Box>
            </Tooltip>

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 8px 32px rgba(0,0,0,0.12))',
                        mt: 1.5,
                        minWidth: 240,
                        borderRadius: '16px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                        '& .MuiList-root': {
                            padding: '8px',
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            width: 12,
                            height: 12,
                            bgcolor: '#ffffff',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderBottom: 'none',
                            borderRight: 'none'
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* User Info in Dropdown Header */}
                <Box className="px-4 py-4 mb-2">
                    <div className="flex items-center gap-3">
                        <Avatar
                            sx={{
                                width: 44,
                                height: 44,
                                bgcolor: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                            }}
                        >
                            <PersonIcon fontSize="medium" />
                        </Avatar>
                        <div>
                            <Typography variant="body2" className="text-gray-900 font-semibold text-base">
                                {userData.name}
                            </Typography>
                            <Typography variant="caption" className="text-gray-500 text-sm">
                                @{userData.username}
                            </Typography>
                        </div>
                    </div>
                </Box>

                {/* History */}
                <MenuItem
                    onClick={() => { navigate("/history"); setAnchorEl(null); }}
                    className="mx-2 my-1 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                    sx={{
                        py: 2,
                        px: 2,
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                            transform: 'translateX(4px)',
                        }
                    }}
                >
                    <ListItemIcon>
                        <RestoreIcon
                            fontSize="small"
                            className="text-gray-600 transition-colors duration-200"
                            sx={{
                                '&:hover': { color: '#2563eb' }
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary="Meeting History"
                        primaryTypographyProps={{
                            className: "text-gray-700 font-medium"
                        }}
                    />
                </MenuItem>

                {/* Edit Profile */}
                <MenuItem
                    onClick={() => { navigate("/edit-profile"); setAnchorEl(null); }}
                    className="mx-2 my-1 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                    sx={{
                        py: 2,
                        px: 2,
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                            transform: 'translateX(4px)',
                        }
                    }}
                >
                    <ListItemIcon>
                        <EditIcon
                            fontSize="small"
                            className="text-gray-600 transition-colors duration-200"
                            sx={{
                                '&:hover': { color: '#2563eb' }
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary="Edit Profile"
                        primaryTypographyProps={{
                            className: "text-gray-700 font-medium"
                        }}
                    />
                </MenuItem>



                {/* Logout */}
                <MenuItem
                    onClick={() => { handleLogout(); setAnchorEl(null); }}
                    className="mx-2 my-1 mt-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                    sx={{
                        py: 2,
                        px: 2,
                        borderTop: '1px solid #f1f5f9',
                        '&:hover': {
                            backgroundColor: '#fef2f2',
                            transform: 'translateX(4px)',
                        }
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon
                            fontSize="small"
                            className="text-red-500 transition-colors duration-200"
                            sx={{
                                '&:hover': { color: '#dc2626' }
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                            className: "text-red-600 font-medium"
                        }}
                    />
                </MenuItem>
            </Menu>
        </div>
    );
};