import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function App(){
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(!!sessionStorage.getItem("token"));

  const logout = () => {
    sessionStorage.clear();
    setIsAuth(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const sync = () => setIsAuth(!!sessionStorage.getItem("token"));
    window.addEventListener("storage", sync);
    sync();
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <>
      <nav className="nav">
        <Link to="/">Inicio</Link>
        {!isAuth && (<><Link to="/signup">Registro</Link><Link to="/login">Login</Link></>)}
        {isAuth && (<><Link to="/private">Privado</Link><button className="btn btn-outline" onClick={logout}>Cerrar sesión</button></>)}
      </nav>

      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
