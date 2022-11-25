import React from "react";
import {Link} from 'react-router-dom'

export const CardProduct = ({id, images, discount, price, name, toThousand}) => {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <section className="product-box">
        <Link to={`/products/detail/${id}`}>
          <figure className="product-box_image">
            <img
              src={images[0].file}
              alt="imagen de producto"
            />
          </figure>
          <article className="product-box_data">
            <h2>{toThousand(price)}</h2>
            {discount ? <span>{discount}% OFF</span> : <h2>$ {toThousand(price)} </h2> }
            <p>{name}</p>
            <i className="fas fa-truck"></i>       
          </article>
        </Link>
      </section>
    </div>
  );
};
