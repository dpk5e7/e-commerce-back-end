const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

/**
 * Find all categories including its associated Product data
 */
router.get("/", async (req, res) => {
  try {
    const data = await Category.findAll({
      include: [{ model: Product }],
    });

    if (!data) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Find a single category by its `id` including its associated Product data
 */
router.get("/:id", async (req, res) => {
  try {
    const data = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!data) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Create a new category.
 * The Request body should look like this:
 * {
 *    category_name: "Skis"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const data = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

/**
 * Update a category.
 * The Request body should look like this:
 * {
 *    category_name: "Music"
 * }
 */
router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const data = await Category.update(
      { category_name: req.body.category_name },
      {
        where: { id: req.params.id },
      }
    );

    if (!data) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Delete one category by its `id` value
 */
router.delete("/:id", async (req, res) => {
  try {
    const data = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
