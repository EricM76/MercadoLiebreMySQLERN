import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchWithoutToken } from "../hooks/useFetch";
import { userForm } from "../hooks/userForm";
import { UserContext } from '../UserContext';

export const Login = () => {

  const [formValues, handleInputChange, reset] = userForm({
    email: "",
    password: ""
  });

  const { email, password } = formValues;
  const errorMsg = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await useFetchWithoutToken("auth/login", "POST", formValues);
    console.log(result);

    if (!result.ok) {
      errorMsg.current.textContent = result.error
      errorMsg.current.hidden = false
      reset()
    }
    if (result.ok) {
      const { token } = result;

      
      const user = await useFetchWithoutToken(`auth/me/${token}`);

      setUser({
        logged: true,
        name : user.data.name,
        rolId : user.data.rolId,
        token,
      });

      sessionStorage.setItem('MercadoLiebreReact', JSON.stringify({
        logged: true,
        name : user.data.name,
        rolId : user.data.rolId,
        token,
      }))

      navigate('/')

    }
  };

  return (
    <div className="container products-wrapper">
      <div className="row">
        <div className="col-12">
          <h2 className="products-title">Ingresá</h2>
        </div>
      </div>

      <div className="col-12">
        <div className="contenido">
          <div className="row">
            <div className="col-12 col-md-4 d-flex justify-content-center py-5">
              <img src="/images/logo-mercado-liebre.svg" alt="" />
            </div>
            <div className="col-12 col-md-8 p-5">
              <div className="card shadow">
                <div className="card-body">
                  <form id="form-login" className="row" onSubmit={handleSubmit}>
                    <div className="col-12 col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-input form-control"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-input form-control"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                      <p className="alert alert-danger" ref={errorMsg} hidden></p>
                    </div>
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                      <div className="form-group form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="exampleCheck1"
                          name="remember"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <label
                          className="form-check-label form-label ms-2"
                          htmlFor="exampleCheck1"
                        >
                          Recordarme
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6  d-flex justify-content-center">
                      <button type="submit" className="buy-now-button">
                        Iniciar sesión
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
