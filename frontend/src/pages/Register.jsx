import React, {useState} from 'react';
import axios from 'axios';
export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  async function submit(e){ e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/auth/register',{ name, email, password });
      localStorage.setItem('token', res.data.token);
      alert('Registered');
    }catch(err){ alert(err.response?.data?.message || err.message); }
  }
  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="name" /><br/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" /><br/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" /><br/>
        <button>Register</button>
      </form>
    </div>
  );
}
