import React, { useContext } from "react";
import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../UserContext'

export const Header = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => setUser({
    logged : false
  })

  return (
    <header className="main-header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-5 col-md-2">
            <Link to="/" className="main-header_home-link">
              <img src="/images/logo-mercado-liebre.svg" alt="logo" />
            </Link>
          </div>

          <div className="col-7 col-md-6">
            <form action="/search" method="GET" className="search-form">
              <input
                type="text"
                name="keywords"
                placeholder="Buscar productos, marcas y más"
                className="search-form_input"
              />
              <button type="submit" className="search-form_button">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          <div className="col-12 col-md-4">
            <a href="/tarjetas" className="main-header_credit-link">
              <i className="fas fa-hand-holding-usd"></i>
              Comprá en cuotas y sin tarjeta de crédito
            </a>
          </div>
        </div>

        <button className="btn-toggle-navbar">
          <i className="fas fa-bars"></i>
        </button>

        <nav className="main-navbar">
          <ul className="left-navbar">
            <li>
              <a href="/products">Todos los productos</a>
            </li>
            <li>
              <a href="/ofertas">Ofertas</a>
            </li>
            <li>
              <a href="/tiendas">Tiendas Oficiales</a>
            </li>
            <li>
              <NavLink to="/products/create">Vender</NavLink>
            </li>
            <li>
              <a href="/ayuda">Ayuda</a>
            </li>
          </ul>
          <ul className="right-navbar">
            {
              user.logged
                ?
                (
                  <>
                    <li>
                      <Link to="/users/profile">
                        {user.name} <i className="far fa-address-card"></i>
                      </Link>
                    </li>
                    <li id="btn-cart">
                      <button
                        type="button"
                        className="btn fs-4"
                        data-bs-toggle="modal"
                        data-bs-target="#cartModal"
                      >
                        Mis compras <i className="fas fa-shopping-basket"></i>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="btn fs-4"
                        onClick={handleLogout}
                      >
                        Salir <i className="fas fa-sign-out-alt"></i>
                      </button>
                     
                    </li>
                  </>
                )
                :
                (
                  <>
                    <li>
                      <a href="/users/register" id="link-register">
                        Creá tu cuenta <i className="fas fa-address-card"></i>
                      </a>
                    </li>
                    <li>
                      <Link to="/users/login">
                        Ingresá <i className="fas fa-sign-in-alt"></i>
                      </Link>
                    </li>
                  </>
                )

            }



          </ul>
        </nav>
      </div>
    </header>
  );
};
