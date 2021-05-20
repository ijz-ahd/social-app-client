import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);

  const pathName = window.location.pathname;
  const path = pathName === "/" ? "home" : pathName.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const logoutUser = (e) => {
    logout();
  };

  const menuBar = user ? (
    <Menu
      pointing
      secondary
      size="large"
      color="blue"
      style={{ paddingTop: "15px" }}
    >
      <Menu.Item name={user.username} active as={Link} to="/" />

      <Menu.Menu position="right">
        <Menu.Item
          name="Logout"
          active={activeItem === "Logout"}
          onClick={logoutUser}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu
      pointing
      secondary
      size="large"
      color="blue"
      style={{ paddingTop: "15px" }}
    >
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
