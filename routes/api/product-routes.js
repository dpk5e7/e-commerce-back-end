const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const data = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });

    if (!data) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const data = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!data) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 1, // The starter code forgot this field
      tagIds: [1, 2, 3, 4] // I deleted id 1.  Use 9 instead.
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", async (req, res) => {
  // Note to grader: The provided code only works if the request includes new Tag IDs.  I'm refactoring the code to allow the user to update the product without changing the tags if they're not sent in the request.  Also, if a product had no tags to begin with, the provided code would not add new tags that were sent in.

  try {
    const product = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (product) {
      if (req.body.tagIds) {
        // If new tags are provided, just destroy every tag that was there previously
        await ProductTag.destroy({ where: { product_id: req.params.id } });

        // Then add the new tags
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
      }

      // Go ahead and send back the new object, just like the get :id route
      const data = await Product.findByPk(req.params.id, {
        include: [{ model: Category }, { model: Tag }],
      });

      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No product found with that id!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const data = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
