import React from "react";
import headerJson from "./HeaderJson.json";
import vtwPng from "../../assets/img/vtw.png";
import { Link } from "react-router-dom";
import {signIn, signOut} from "../../utils/AuthMng"
import {Button} from "devextreme-react/button";

const Header = () => {
  const NavItem = ({ item }) => {
    if (item.dropdownItems) {
      return (
        <li className="nav-item dropdown" key={item.id}>
          <a
            className="nav-link dropdown-toggle"
            id={`navbarDropdown${item.id}`}
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {item.title}
          </a>
          <ul
            className="dropdown-menu"
            aria-labelledby={`navbarDropdown${item.id}`}
          >
            {item.dropdownItems.map((dropdownItem) => (
              <li key={dropdownItem.id}>
                <Link to={dropdownItem.link} className="dropdown-item">
                  {dropdownItem.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      );
    } else {
      return (
        <li className="nav-item" key={item.id}>
          <a className="nav-link" href={item.link}>
            {item.title}
          </a>
        </li>
      );
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        background: "linear-gradient(to bottom, #6d94bf, #446e9b)",
        borderColor: "#345578",
        color: "#dddddd",
      }}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={vtwPng} alt="" />
        </Link>

        <ul className="navbar-nav">
          {headerJson.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </ul>
        <div className="ml-auto">
          <Button onClick={signOut}>로그아웃</Button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
