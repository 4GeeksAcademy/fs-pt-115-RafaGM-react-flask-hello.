import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try{
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/token", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data?.message || "Error de autenticación");

      sessionStorage.setItem("token", data.access_token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      navigate("/private"); // ✅
    }catch(e){ setErr(e.message); }
  };

  return (
    <div className="card" style={{maxWidth:520}}>
      <h2>Inicio de sesión</h2>
      <p className="subtitle">Introduce tus credenciales.</p>
      {err && <p className="error">{err}</p>}
      <form className="form" onSubmit={submit}>
        <label className="label">Correo</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="label">Contraseña</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <div className="row">
          <button className="btn" type="submit">Entrar</button>
          <Link to="/signup" className="btn btn-outline">Regístrate</Link>
        </div>
      </form>
    </div>
  );
}
