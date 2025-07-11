import { createContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from "http-status-codes";
import axios from 'axios';
import { Meeting } from "../../../backend/src/models/meeting.model";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users"
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password
      });

      if (response.status === StatusCodes.CREATED) {
        return response.data.message;
      }
    } catch (err) {
      console.log("Registration error:", err); // Debug log
      
      // Create a more structured error object
      const errorObj = {
        message: err?.response?.data?.message || err?.message || "Registration failed",
        status: err?.response?.status,
        response: err?.response
      };
      
      throw errorObj;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await client.post("/login", {
        username,
        password
      });

      console.log(response);

      if (response.status === StatusCodes.OK) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user);
        router('/'); 
        return response.data.message;
      }
    } catch (err) {
      console.log("Login error:", err); // Debug log
      
      // Create a more structured error object
      const errorObj = {
        message: err?.response?.data?.message || err?.message || "Login failed",
        status: err?.response?.status,
        response: err?.response
      };
      
      throw errorObj;
    }
  };


  const getHistoryOfUser = async ()=>{
    try{
      let request = await client.get("/get_all_activity",{
        params:{
          token:localStorage.getItem("token")

        }
      }) 
      return request.data;
    }catch(err){
      throw err;

    }
  }


  const addToUserHistory = async(meetingCode)=>{
    try{
      let request  = await client.post("/add_to_activity",{
        token:localStorage.getItem("token"),
        meeting_code:meetingCode
      })
      return request
    }catch(e){
      throw e;

    }
  }



  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
     getHistoryOfUser,
     addToUserHistory
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};