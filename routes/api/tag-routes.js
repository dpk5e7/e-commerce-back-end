const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

/**
 * Find all tags including its associated Product data
 */
router.get("/", async (req, res) => {
  try {
    const data = await Tag.findAll({
      include: [{ model: Product }],
    });

    if (!data) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Find a single tag by its `id` including its associated Product data
 */
router.get("/:id", async (req, res) => {
  try {
    const data = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!data) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Create a new tag.
 * The Request body should look like this:
 * {
 *    tag_name: "Jazz"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const data = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

/**
 * Update a tag.
 * The Request body should look like this:
 * {
 *    tag_name: "Blues"
 * }
 */
router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const data = await Tag.update(
      { tag_name: req.body.tag_name },
      {
        where: { id: req.params.id },
      }
    );

    if (!data) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Delete one tag by its `id` value
 */
router.delete("/:id", async (req, res) => {
  try {
    const data = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!data) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
