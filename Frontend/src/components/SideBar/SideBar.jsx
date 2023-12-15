import "./SideBar.css";
import { NavLink } from "react-router-dom";

const SideBar = (props) => {
  const role = localStorage.getItem("Response");
  const roleObject = JSON.parse(role);
  const userRole = roleObject.data.role;
  return (
    <div className="sidebar">
      <nav>
        {userRole === "admin" ? (
          <NavLink to="/profile/admin" onClick={props.close}>
            Inicio
          </NavLink>
        ) : (
          <NavLink to="/profile" onClick={props.close}>
            Inicio
          </NavLink>
        )}
        <NavLink to="/profile/new" onClick={props.close}>
          Nueva lista
        </NavLink>
        <NavLink to={`/profile/list/${props.iduser}`} onClick={props.close}>
          Mis listas
        </NavLink>
        <NavLink to={`/profile/products`} onClick={props.close}>
          Productos
        </NavLink>
        <NavLink to="/profile/sales" onClick={props.close}>
          Ofertas
        </NavLink>
        <NavLink to="/profile/yourprofile" onClick={props.close}>
          Mi perfil
        </NavLink>
        <NavLink to="/profile/faq" onClick={props.close}>
          Contacto
        </NavLink>
        <NavLink to="/" onClick={props.logout}>
          Cerrar sesión
        </NavLink>
      </nav>
    </div>
  );
};

export default SideBar;
