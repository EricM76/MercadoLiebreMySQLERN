import React, { useState, useEffect } from "react";
import { useFetchWithoutToken } from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { toThousand } from "../helpers";

export const Detail = () => {
  const { id: idProduct } = useParams();

  const [product, setProduct] = useState({
    loading: false,
    data: null,
  });

  useEffect(() => {
    const getData = async () => {
      const result = await useFetchWithoutToken(`products/${idProduct}`);
      setProduct({
        loading: true,
        data: result.data,
      });
    };

    getData();
  }, []);

  const { loading, data } = product;

  return (
    <div class="container products-wrapper">
      {!loading ? (
        <div className="alert alert-info">Cargando....</div>
      ) : (
        <>
          <div class="row">
            <div class="col-12">
              <h2 class="products-title">Detalle del producto: {data.name}</h2>
            </div>
          </div>
          <div class="product-detail">
            <div class="row">
              <div class="col-12 col-lg-8">
                <img
                  src={data.images[0].file}
                  alt={data.name}
                  class="product-detail-img"
                />
                <div class="flex">
                  {data.images.map((image, index) => (
                    <img
                      class="mx-2"
                      src={image.file}
                      alt={data.name}
                      style={{ width: "100px" }}
                    />
                  ))}
                </div>
                <p class="product-detail-description">{data.description}</p>
              </div>
              <div class="col-12 col-lg-4">
                <article class="product-detail-info">
                  <h2 class="product-detail-title">{data.name} </h2>
                  {data.discount > 0 ? (
                    <>
                      <p class="product-detail-price small">
                        <span>{data.price}</span>/<b>{data.discount}% OFF</b>
                      </p>
                      <p class="product-detail-price">
                        {toThousand(
                          data.price - (data.price * data.discount) / 100
                        )}
                      </p>
                    </>
                  ) : (
                    <p class="product-detail-price">{toThousand(data.price)}</p>
                  )}

                  <ul class="actions-list">
                    <li>
                      <i class="fas fa-credit-card"></i>
                      <p>Pagá en 12 cuotas sin interes</p>
                    </li>
                    <li>
                      <i class="fas fa-store"></i>
                      <p>Retiro gratis en locales del vendedor</p>
                    </li>
                  </ul>

                  <button
                    class="btn btn-primary"
                    onclick="addCartItem('<%=product.id%>')"
                  >
                    AGREGAR AL CARRITO
                  </button>
                  <hr />

                  <a href={`/products/edit/${data.id}`} class="btn btn-success">
                    EDITAR PRODUCTO
                  </a>
                  <form
                    action={`/products/delete/${data.id}?_method=DELETE`}
                    method="POST"
                    style={{ display: "inline-flex" }}
                  >
                    <button
                      type="submit"
                      style={{ cursor: "pointer;" }}
                      class="btn btn-danger"
                    >
                      ELIMINAR
                    </button>
                  </form>
                </article>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
