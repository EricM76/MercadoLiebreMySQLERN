import React, { useEffect, useState } from "react";
import { BannerHome } from "../components/BannerHome";
import { CardProduct } from "../components/CardProduct";
import { useFetchWithoutToken } from "../hooks/useFetch";
import {toThousand} from '../helpers'
import { Header } from "../components/Header";

export const Home = () => {

  const [newest, setNewest] = useState({
    loading : false,
    data : null
  });

  const [sales, setSales] = useState({
    loading : false,
    data : null
  });

  useEffect(() => {
    
    const getData = async () => {
      const resultNewest = await useFetchWithoutToken('products?order=DESC&sortBy=newest&limit=4');
      const resultSales = await useFetchWithoutToken('products?order=DESC&sales&limit=4');
      setNewest({
        loading : true,
        data : resultNewest.data
      });

      setSales({
        loading : true,
        data : resultSales.data
      })
    }

    getData()
  
  }, []);

  return (
    <>
      <BannerHome />
      <div className="container products-wrapper">
        <div className="row">
          <div className="col-12">
            <h2 className="products-title">Últimos agregados</h2>
          </div>
          {
            !newest.loading 
            ?
            (
                <div className="alert alert-info">
                    Cargando....
                </div>
            )
            :
            (
                newest.data.map((product,index) => (
                    <CardProduct {...product} toThousand = {toThousand} key={product.name + index}/>
                ))
            )
          }
        </div>
      </div>
      <div className="container products-wrapper">
        <div className="row">
          <div className="col-12">
            <h2 className="products-title">Ofertas</h2>
          </div>
          {
            !sales.loading 
            ?
            (
                <div className="alert alert-info">
                    Cargando....
                </div>
            )
            :
            (
                sales.data.map((product, index) => (
                    <CardProduct {...product} toThousand = {toThousand} key={product.name + index}/>
                ))
            )
          }
        </div>
      </div>
   
    </>
  );
};
