import React from 'react'
import { IconButton, TextField, Button, Avatar, Tooltip } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import {ButtonComponent} from '../common/Buttons';
import { useNavigate } from "react-router-dom";

export const LandingNavbarItems = () => {
  return (
    <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">


                                 <ButtonComponent BlueBtn={false} routeToGo={"/aussh123fd"} BtnName={"Join as Guest"} />
                            
                                 <ButtonComponent BlueBtn={false} routeToGo={"/auth"} BtnName={"Sign Up"} />

                                <ButtonComponent BlueBtn={true} routeToGo={"/auth"} BtnName={"Sign In"} />
                            
                            
                            
                            </div>




                        </div>
  )
}
export const HomeNavbarItems = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="flex items-center gap-4 pr-4">
      {/* History */}
      <Tooltip title="Meeting History" arrow>
        <IconButton
          onClick={() => navigate("/history")}
          className="!text-white hover:scale-110 transition-transform"
        >
          <RestoreIcon fontSize="medium" />
        </IconButton>
      </Tooltip>

      {/* Profile */}
      <Tooltip title="Profile" arrow>
        <IconButton
          className="!text-white hover:scale-110 transition-transform"
        >
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}
            className="shadow-md"
          >
            <PersonIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Logout */}
      <Tooltip title="Logout" arrow>
        <IconButton
          onClick={handleLogout}
          className="!text-red-500 hover:text-red-600 hover:scale-110 transition-transform"
        >
          <LogoutIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

