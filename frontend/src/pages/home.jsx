import React, { useState, useRef, useEffect, useContext } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { IconButton, TextField, Button, Avatar, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AuthContext } from '../context/AuthContext';
import "../styles/Home.css"
import RoomShowcase from '../Components/common/RoomShowcase';
import Navbar from "../Components/Navbar/Navbar"
import Footer from "../Components/Footer/Footer";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [showMeetingOptions, setShowMeetingOptions] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [generatedMeetingCode, setGeneratedMeetingCode] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleJoinVideoCall();
        }
    };

    const handleNewMeetingClick = (event) => {
        const newCode = Math.random().toString(36).substring(2, 15);
        setGeneratedMeetingCode(newCode);
        setAnchorEl(event.currentTarget);
        setShowMeetingOptions(true);
    };

    const handleCloseOptions = () => {
        setShowMeetingOptions(false);
        setAnchorEl(null);
    };

    const handleStartInstantMeeting = async () => {
        handleCloseOptions();
        await addToUserHistory(generatedMeetingCode);
        navigate(`/${generatedMeetingCode}`);
    };

    const handleCreateForLater = () => {
        handleCloseOptions();
        setShowMeetingModal(true);
    };

    const handleCopyMeetingLink = async () => {
        const meetingLink = `${window.location.origin}/${generatedMeetingCode}`;
        try {
            await navigator.clipboard.writeText(meetingLink);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <>
            <div className="home-container">
                {/* Navigation Bar */}
                <Navbar home={true} />

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-wrapper">
                        <div className="hero-section">
                            <div className="hero-content">
                                <h1 className="hero-title">
                                    Premium Video Conferencing
                                </h1>
                                <p className="hero-subtitle">
                                    Connect with anyone, anywhere. High-quality video calls made simple.
                                </p>

                                <div className="action-section">



                                    <div className="meeting-input-group">

                                        <Button
                                            variant="contained"
                                            className="new-meeting-btn"
                                            size="large"
                                            startIcon={<VideoCallIcon />}
                                            endIcon={<KeyboardArrowDownIcon />}
                                            onClick={handleNewMeetingClick}
                                            sx={{

                                                borderRadius: '24px',
                                                textTransform: 'none',
                                                backgroundColor: '#1d4ed8',
                                                fontWeight: 500,
                                                padding: '12px 24px',
                                                fontSize: '16px',
                                                '&:hover': {
                                                    backgroundColor: '#1565c0',
                                                }
                                            }}
                                        >
                                            New meeting
                                        </Button>
                                        <TextField
                                            value={meetingCode}
                                            onChange={(e) => setMeetingCode(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            label="Enter meeting code"
                                            variant="outlined"
                                            className="meeting-input"
                                            placeholder="e.g., abc-def-ghi"
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '24px',
                                                    backgroundColor: '#f8f9fa',
                                                    '&:hover': {
                                                        backgroundColor: '#ffffff',
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ffffff',
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={handleJoinVideoCall}
                                            variant="text"
                                            className="join-btn"
                                            disabled={!meetingCode.trim()}
                                            size="large"
                                            sx={{
                                                borderRadius: '24px',
                                                color: '#1976d2',
                                                fontWeight: 500,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                }
                                            }}
                                        >
                                            Join
                                        </Button>
                                    </div>



                                    <div style={{ position: 'relative' }}>


                                        <Menu
                                            anchorEl={anchorEl}
                                            open={showMeetingOptions}
                                            onClose={handleCloseOptions}
                                            PaperProps={{
                                                sx: {
                                                    borderRadius: '8px',
                                                    minWidth: '280px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                    mt: 1
                                                }
                                            }}
                                        >
                                            <MenuItem
                                                onClick={handleCreateForLater}
                                                sx={{
                                                    padding: '12px 16px',
                                                    '&:hover': {
                                                        backgroundColor: '#f8f9fa',
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: '40px' }}>
                                                    <LinkIcon sx={{ color: '#5f6368' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Create a meeting for later"
                                                    sx={{
                                                        '& .MuiListItemText-primary': {
                                                            fontSize: '14px',
                                                            fontWeight: 400
                                                        }
                                                    }}
                                                />
                                            </MenuItem>

                                            <MenuItem
                                                onClick={handleStartInstantMeeting}
                                                sx={{
                                                    padding: '12px 16px',
                                                    '&:hover': {
                                                        backgroundColor: '#f8f9fa',
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: '40px' }}>
                                                    <PlayArrowIcon sx={{ color: '#5f6368' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Start an instant meeting"
                                                    sx={{
                                                        '& .MuiListItemText-primary': {
                                                            fontSize: '14px',
                                                            fontWeight: 400
                                                        }
                                                    }}
                                                />
                                            </MenuItem>


                                        </Menu>
                                    </div>
                                </div>
                            </div>

                            <RoomShowcase />
                        </div>
                    </div>
                </main>

                {/* Meeting Link Modal - Only shows when "Create for later" is clicked */}
                <Dialog
                    open={showMeetingModal}
                    onClose={() => setShowMeetingModal(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            padding: '8px'
                        }
                    }}
                >
                    <DialogTitle sx={{ padding: '24px 24px 16px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 500, color: '#202124' }}>
                                Here's your joining information
                            </span>
                            <IconButton
                                onClick={() => setShowMeetingModal(false)}
                                sx={{
                                    color: '#5f6368',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa',
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </DialogTitle>

                    <DialogContent sx={{ padding: '0 24px 16px 24px' }}>
                        <p style={{
                            marginBottom: '16px',
                            color: '#5f6368',
                            fontSize: '14px',
                            lineHeight: '20px'
                        }}>
                            Send this to people that you want to meet with. Make sure that you save it so that you can use it later, too.
                        </p>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            border: '1px solid #e8eaed'
                        }}>
                            <span style={{
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                color: '#202124'
                            }}>
                                {`${window.location.origin}/${generatedMeetingCode}`}
                            </span>
                            <IconButton
                                onClick={handleCopyMeetingLink}
                                size="small"
                                sx={{
                                    color: copySuccess ? '#137333' : '#1976d2',
                                    '&:hover': {
                                        backgroundColor: copySuccess ? 'rgba(19, 115, 51, 0.04)' : 'rgba(25, 118, 210, 0.04)',
                                    }
                                }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </div>

                        {copySuccess && (
                            <p style={{
                                color: '#137333',
                                fontSize: '14px',
                                marginBottom: '0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                ✓ Link copied to clipboard!
                            </p>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ padding: '16px 24px 24px 24px', gap: '8px' }}>
                        <Button
                            onClick={() => setShowMeetingModal(false)}
                            variant="text"
                            sx={{
                                color: '#1976d2',
                                textTransform: 'none',
                                fontWeight: 500,
                                borderRadius: '20px',
                                padding: '8px 16px',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                }
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
            <Footer />
        </>
    );
}

export default withAuth(HomeComponent);