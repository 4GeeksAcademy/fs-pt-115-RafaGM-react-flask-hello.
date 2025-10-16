import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

async function callPrivate(token){
  const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
    headers: { "Authorization": "Bearer " + token }
  });
  return res;
}

export default function Private(){
  const [data,setData] = useState(null);
  const [err,setErr] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(()=>{
    const token = sessionStorage.getItem("token");
    if(!token){ navigate("/login", { replace:true }); return; }

    (async ()=>{
      try{
        let res = await callPrivate(token);

        // 🔁 Reintento 1 si llega 422 (a veces sucede en dev/StrictMode)
        if(res.status === 422){
          await new Promise(r => setTimeout(r, 200));
          res = await callPrivate(token);
        }

        if(res.status === 401 || res.status === 422){
          sessionStorage.clear();
          navigate("/login", { replace:true });
          return;
        }

        if(!res.ok){
          const j = await res.json().catch(()=> ({}));
          throw new Error(j?.message || `Error ${res.status} en /api/private`);
        }

        const json = await res.json();
        setData(json);
        setErr("");
      }catch(e){
        setErr(e.message);
      }
    })();
  }, [navigate]);

  return (
    <div className="card">
      <h2>Zona privada</h2>
      {err && <p className="error">{err}</p>}
      <p className="subtitle">{data ? `Bienvenido, ${data.email}` : "Cargando..."}</p>
      <button className="btn btn-outline" onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
