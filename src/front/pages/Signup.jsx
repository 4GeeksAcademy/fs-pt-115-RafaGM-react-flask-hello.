import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const [ok,setOk] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setOk("");
    try{
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(()=> ({}));
      if(!res.ok) throw new Error(data?.message || "Error registrando");
      setOk("Usuario creado. Redirigiendo a inicio de sesión…");
      setTimeout(()=> navigate("/login"), 800);
    }catch(e){ setErr(e.message); }
  };

  return (
    <div className="card" style={{maxWidth:520}}>
      <h2>Registro</h2>
      <p className="subtitle">Crea tu cuenta con un email y contraseña.</p>
      {err && <p className="error">{err}</p>}
      {ok && <p className="ok">{ok}</p>}
      <form className="form" onSubmit={submit}>
        <label className="label">Correo</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="label">Contraseña</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" type="submit">Crear cuenta</button>
        <p className="muted">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </div>
  );
}
