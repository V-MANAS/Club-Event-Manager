import React, {useState} from 'react';
import axios from 'axios';
export default function Login(){
  const [email,setEmail]=useState('admin@college.edu');
  const [password,setPassword]=useState('password');
  async function submit(e){ e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/auth/login',{ email, password });
      localStorage.setItem('token', res.data.token);
      alert('Logged in');
    }catch(err){ alert(err.response?.data?.message || err.message); }
  }
  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" /><br/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" /><br/>
        <button>Login</button>
      </form>
    </div>
  );
}
