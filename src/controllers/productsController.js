const { unlinkSync } = require("fs");
const path = require("path");
const { literal, Op } = require("sequelize");
const db = require("../database/models");
const { literalQueryUrlImage } = require("../helpers/literalQueryUrlImage");
const { sendJsonError } = require("../helpers/sendJsonError");
const controller = {
  // API -> GET IMAGE IN VIEW
  image: (req, res) => {
    res.sendFile(
      path.join(__dirname, `../../public/images/products/${req.params.img}`)
    );
  },

  // API -> ALL PRODUCTS + QUERIES
  all: async (req, res) => {
    try {
      let {
        page = 1,
        offset = 0,
        limit = 10,
        sales = 0,
        salesDiscount = 0,
        price = 0,
        order = "ASC",
        sortBy = "name",
        search = "",
      } = req.query;

      const typesSort = ["name", "price", "discount", "category", "newest"];

      /* 1 2 3 4 5  6 7 8 9 10  11 12 13 14 15*/
      /* limit 5      1 2 3 4 5 
      offset 0 */
      /* limit 5      6 7 8 9 10 
      offset 5 */

      /* Comprobaciones */

      limit = +limit > 10 ? 10 : +limit;

      salesDiscount = +salesDiscount < 10 ? 10 : +salesDiscount;

      sortBy = typesSort.includes(sortBy) ? sortBy : "name";

      page = +page <= 0 || isNaN(page) ? 1 : +page;

      /* ------------------------------------ */
      /*               URL QUERIES            */
      const queriesValuesDefaultAndModify = {
        search,
        limit,
        sales,
        salesDiscount,
        price,
        order,
        sortBy,
      };

      let urlQuery = "";

      for (const key in queriesValuesDefaultAndModify) {
        urlQuery += `&${key}=${queriesValuesDefaultAndModify[key]}`;
      }
      console.log(urlQuery);
      /*               URL QUERIES END            */
      /* --------------------------------------- */

      /* Comprobaciones END */

      /* Alteración matemática de variables de req query */
      page -= 1;
      offset = page * limit;

      /* ORDER QUERIES */
      const orderQuery =
        sortBy === "category"
          ? [["category", "name", order]]
          : sortBy === "newest"
          ? [["createdAt", "desc"]]
          : [[sortBy, order]];

      /* OPTIONS DEFAULT */
      let options = {
        limit,
        offset,
        include: [
          {
            association:
              "images" /* product.images  = [{ file:nombreimage.png,productId:2,...  }] */,
            attributes: {
              include: [
                [
                  literal(
                    `CONCAT( '${req.protocol}://${req.get(
                      "host"
                    )}/products/image/',images.file )`
                  ),
                  "file",
                ],
              ],
            },
          },
          {
            association: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["updatedAt", "deletedAt"],
        },
        order: orderQuery,
        where: {
          [Op.or]: [
            {
              name: {
                [Op.substring]: search,
              },
            },
            {
              description: {
                [Op.substring]: search,
              },
            },
            /*    {
             "$category.name$":{
               [Op.substring]: search
             }
           } */
          ],
        },
      };

      /* -------------------------- */
      const optionSales = {
        ...options,
        where: {
          discount: {
            [Op.gte]: salesDiscount,
          },
        },
      };

      if (+sales === 1 && !isNaN(sales)) {
        options = optionSales;
      }
      /* -------------------------- */

      /* PRICE */
      const optionPrice = {
        ...options,
        where: {
          price: {
            [Op.gte]: price,
          },
        },
      };

      if (+price && !isNaN(price)) {
        options = optionPrice;
      }
      /* -------------------------- */

      const { count, rows: products } = await db.Product.findAndCountAll(
        options
      );

      if (!products.length) {
        return res.status(200).json({
          ok: true,
          status: 204,
          message: "No hay productos en esta pagina",
        });
      }

      const existPrev = page > 0 && offset <= count;
      /* offset 20   y mi cantidad total es de 16  == false */

      const existNext =
        Math.floor(count / limit) >= page + 1 && limit !== count;
      /*  16  /  5  =   3   >=  1   */ /* 16  !==   16 false */
      let urlPrev = null;
      let urlNext = null;

      if (existNext) {
        urlNext = `${req.protocol}://${req.get("host")}${req.baseUrl}?page=${
          page + 2
        }${urlQuery}`;
      }

      if (existPrev) {
        urlPrev = `${req.protocol}://${req.get("host")}${
          req.baseUrl
        }?page=${page}${urlQuery}`;
      }

      return res.status(200).json({
        meta: {
          status: 200,
        },
        ok: true,
        totalProducts: count,
        prev: urlPrev,
        next: urlNext,
        data: products,
        error : null
      });
    } catch (error) {
      sendJsonError(error, res);
    }
  },

  // API -> DETAIL PRODUCT
  detail: async (req, res) => {
    /* OPTIONS DEFAULT */
    let options = {
      include: [
        {
          association: "images",
          attributes: {
            include: [literalQueryUrlImage(req, "file", "file")],
            exclude: ["createdAt", "updatedAt", "deletedAt", "productId"],
            /*  [
                literal(
                  `CONCAT( '${req.protocol}://${req.get(
                    "host"
                  )}/products/image/',images.file )`
                ),
                "file",
              ], */
          },
        },
        {
          association: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["updatedAt", "deletedAt", "createdAt"],
      },
    };

    try {
      const idProduct = req.params.id;

      if (isNaN(idProduct)) {
        return sendJsonError("El parámetro es invalido", res);
      }

      const product = await db.Product.findByPk(idProduct, options);

      if (!product) {
        return sendJsonError("El producto solicitado no existe", res, 404);
      }

      return res.status(200).json({
        ok: true,
        status: 200,
        data: product,
      });
    } catch (error) {
      sendJsonError(error, res);
    }
  },

  // API -> STORAGE PRODUCT
  store: async (req, res) => {
    try {
      const { name, price, discount, description, categoryId } = req.body;

      const product = await db.Product.create({
        name: name?.trim(),
        description: description?.trim(),
        price: +price,
        discount: +discount,
        categoryId: +categoryId,
      });

      /*       await db.Product.afterCreate(product => {
        console.log(product)
      }) */

      let images = [{ productId: product.id }];

      if (req.files?.length) {
        images = req.files.map((file) => {
          return {
            productId: product.id,
            file: file.filename,
          };
        });
      }

      await db.Image.bulkCreate(images, { validate: true });

      await product.reload({
        include: [
          {
            association: "images",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            association: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });

      return res.status(201).json({
        ok: true,
        status: 201,
        data: product,
      });
    } catch (error) {
      sendJsonError(error, res);
    }
  },

  // API -> UPDATE PRODUCT
  update: async (req, res) => {
    const { name, price, discount, description, categoryId } = req.body;
    const { id } = req.params; /* id product */
    const { deletePreviousImages } = req.query;
    try {
      const product = await db.Product.findByPk(id, {
        include: [
          {
            association: "images",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            association: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });

      product.name = name?.trim() || product.name;
      product.price = +price || product.price;
      product.discount = +discount || product.discount;
      product.description = description?.trim() || product.description;
      product.categoryId = +categoryId || product.categoryId;

      await product.save();

      if (+deletePreviousImages === 1) {
        product.images.forEach(async (img) => {
          await img.destroy();
          unlinkSync(
            path.join(__dirname, `../../public/images/products/${img.file}`)
          );
        });
      }

      if (req.files?.length) {
        const images = req.files.map((file) => {
          return {
            file: file.filename,
            productId: product.id,
          };
        });

        await db.Image.bulkCreate(images);
      }

      res.status(200).json({
        ok: true,
        status: 200,
        /* data: await product.reload() */
        url: `${req.protocol}://${req.get("host")}/products/${product.id}`,
      });
    } catch (error) {
      sendJsonError(error, res);
    }
  },

  // API -> DELETE PRODUCT
  destroy: async (req, res) => {
    const { id } = req.params; /* product id */
    try {
     /*  await db.Image.destroy({ where: { productId: id } });
      await db.Product.destroy({ where: { id } }); */
      const options = {
        include: [
          {
            association: "images",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            association: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      }
      const product = await db.Product.findByPk(id,options );

      
      product.images.forEach(async (img) => {
        await img.destroy();
        unlinkSync(
          path.join(__dirname, `../../public/images/products/${img.file}`)
          );
        });
        await product.destroy()
        
      res.status(200).json({
        ok:true,
        status:200,
        msg:'Producto eliminado'
      })
    } catch (error) {
      sendJsonError(error, res);
    }
  },
};

module.exports = controller;
