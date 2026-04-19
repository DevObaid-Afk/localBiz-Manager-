import { Product } from "../models/Product.js";
import { createError } from "../middleware/error.js";

function normalizeProductPayload(body) {
  return {
    name: body.name?.trim(),
    price: Number(body.price),
    stock: Number(body.stock),
  };
}

function validateProductPayload({ name, price, stock }) {
  if (!name) {
    throw createError(400, "Product name is required.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw createError(400, "Price must be a valid non-negative number.");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw createError(400, "Stock must be a valid non-negative integer.");
  }
}

export async function getProducts(req, res, next) {
  try {
    const { search = "", stock = "all" } = req.query;
    const query = { user: req.user.id };

    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    if (stock === "low") {
      query.stock = { $lt: 5 };
    }

    const products = await Product.find(query).sort({ updatedAt: -1, name: 1 });
    res.json({ products });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const payload = normalizeProductPayload(req.body);
    validateProductPayload(payload);

    const product = await Product.create({
      user: req.user.id,
      ...payload,
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const payload = normalizeProductPayload(req.body);
    validateProductPayload(payload);

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      payload,
      { new: true, runValidators: true },
    );

    if (!product) {
      throw createError(404, "Product not found.");
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      throw createError(404, "Product not found.");
    }

    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
}
