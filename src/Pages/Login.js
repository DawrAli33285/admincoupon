import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [state,setState]=useState({
        password:"",
        email:''
    })
const login=async()=>{
    try{
        let response = await fetch("https://couponbackend.vercel.app/admin/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(state)   // state = { email, password }
          });
          
          let data = await response.json();
          console.log(data);
          
localStorage.setItem("adminToken",data.token)

    }catch(e){

    }
}
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
                <h1 className="font-body text-[#03624c] text-3xl font-bold text-center text-gray-800 mb-3">
                    Login
                </h1>
                <div className="flex justify-center py-2">
                    <p className="text-gray-600">
                    If you dont have a account?{' '}
                    <button className="text-[#03624c] hover:text-[#03624ca9] font-medium transition-colors">
                        <a href={"/signup"}>SignUp</a>
                    </button>
                </p>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                        value={state.email}
                        onChange={(e)=>{
                            setState({
                                ...state,
                                email:e.target.value
                            })
                        }}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full outline-none text-gray-700"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <Lock className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                        value={state.password}
                        onChange={(e)=>{
                            setState({
                                ...state,
                                password:e.target.value
                            })
                        }}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full outline-none text-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button onClick={login} className="w-full bg-[#03624c] text-white py-2 rounded-lg font-medium hover:bg-[#03624ca9] transition">
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
