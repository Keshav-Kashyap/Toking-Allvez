import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { IconButton, InputAdornment, TextField, Chip } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const [filteredMeetings, setFilteredMeetings] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true)
                const history = await getHistoryOfUser();
                setMeetings(history);
                setFilteredMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            } finally {
                setLoading(false)
            }
        }

        fetchHistory();
    }, [])

    useEffect(() => {
        const filtered = meetings.filter(meeting =>
            meeting.meetingCode.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredMeetings(filtered)
    }, [searchTerm, meetings])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    const getRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = today - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays <= 7) return `${diffDays} days ago`;
        return formatDate(dateString);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <Typography className="text-gray-600">Loading your meeting history...</Typography>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-100">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <IconButton
                                onClick={() => routeTo("/home")}
                                className="hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                                sx={{
                                    backgroundColor: '#f1f5f9',
                                    '&:hover': {
                                        backgroundColor: '#dbeafe',
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            >
                                <HomeIcon className="text-blue-600" />
                            </IconButton>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                               this is your     Meeting History cicd done
                                </h1>
                                <p className="text-gray-600 mt-1">View all your past meetings and sessions</p>
                            </div>
                        </div>
                        <Chip
                            label={`${filteredMeetings.length} Meeting${filteredMeetings.length !== 1 ? 's' : ''}`}
                            className="bg-blue-100 text-blue-800 font-semibold"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <TextField
                            placeholder="Search by meeting code..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 max-w-md"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3b82f6',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3b82f6',
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="text-gray-400" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <IconButton
                            className="bg-white hover:bg-gray-50 shadow-md border border-gray-200"
                            sx={{
                                padding: '12px',
                                borderRadius: '12px'
                            }}
                        >
                            <FilterListIcon className="text-gray-600" />
                        </IconButton>
                    </div>
                </div>

                {/* Meetings Grid */}
                {filteredMeetings.length !== 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMeetings.map((meeting, index) => (
                            <Card
                                key={index}
                                className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-white border-0"
                                sx={{
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    }
                                }}
                            >
                                <CardContent className="p-6">
                                    {/* Header with Icon */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                                            <VideoCallIcon className="text-blue-600 text-2xl" />
                                        </div>
                                        <Chip
                                            label={getRelativeDate(meeting.date)}
                                            size="small"
                                            className="bg-gray-100 text-gray-700 font-medium"
                                        />
                                    </div>

                                    {/* Meeting Code */}
                                    <div className="mb-4">
                                        <Typography
                                            variant="h6"
                                            className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300"
                                        >
                                            Meeting Code
                                        </Typography>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <code className="text-lg font-mono text-blue-600 font-semibold">
                                                {meeting.meetingCode}
                                            </code>
                                        </div>
                                    </div>

                                    {/* Date and Time Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <CalendarTodayIcon className="text-gray-400 text-sm" />
                                            <Typography className="text-gray-600 font-medium">
                                                {formatDate(meeting.date)}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <AccessTimeIcon className="text-gray-400 text-sm" />
                                            <Typography className="text-gray-600 font-medium">
                                                {formatTime(meeting.date)}
                                            </Typography>
                                        </div>
                                    </div>


                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <VideoCallIcon className="text-blue-600 text-4xl" />
                            </div>
                            <Typography variant="h5" className="font-bold text-gray-800 mb-3">
                                {searchTerm ? 'No meetings found' : 'No meetings yet'}
                            </Typography>
                            <Typography className="text-gray-600 mb-6">
                                {searchTerm
                                    ? `No meetings found matching "${searchTerm}"`
                                    : 'Start your first meeting to see it appear here'
                                }
                            </Typography>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}