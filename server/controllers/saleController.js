import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Sale } from "../models/Sale.js";
import { createError } from "../middleware/error.js";

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function buildInvoiceNumber() {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);
  return `INV-${stamp}-${random}`;
}

export async function createSale(req, res, next) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw createError(400, "At least one product is required to create a bill.");
    }

    const quantityMap = new Map();

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
        throw createError(400, "Each billed item must include a valid product and quantity.");
      }

      quantityMap.set(item.productId, (quantityMap.get(item.productId) || 0) + quantity);
    }

    const sanitizedItems = Array.from(quantityMap.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
    const productIds = sanitizedItems.map((item) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      user: req.user.id,
    });

    if (products.length !== sanitizedItems.length) {
      throw createError(404, "One or more selected products could not be found.");
    }

    const productMap = new Map(products.map((product) => [product._id.toString(), product]));
    const saleItems = [];
    const appliedUpdates = [];
    let total = 0;

    try {
      for (const item of sanitizedItems) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw createError(404, "One or more selected products could not be found.");
        }

        if (product.stock < item.quantity) {
          throw createError(400, `Insufficient stock for ${product.name}.`);
        }

        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: product._id,
            user: req.user.id,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          { new: true },
        );

        if (!updatedProduct) {
          throw createError(400, `Insufficient stock for ${product.name}.`);
        }

        appliedUpdates.push({ productId: product._id, quantity: item.quantity });

        const subtotal = Number((product.price * item.quantity).toFixed(2));
        total += subtotal;

        saleItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal,
        });
      }

      const sale = await Sale.create({
        user: req.user.id,
        invoiceNumber: buildInvoiceNumber(),
        items: saleItems,
        total: Number(total.toFixed(2)),
      });

      res.status(201).json({ sale });
    } catch (error) {
      if (appliedUpdates.length) {
        await Promise.all(
          appliedUpdates.map((entry) =>
            Product.updateOne(
              { _id: entry.productId, user: req.user.id },
              { $inc: { stock: entry.quantity } },
            ),
          ),
        );
      }

      throw error;
    }
  } catch (error) {
    next(error);
  }
}

export async function getSales(req, res, next) {
  try {
    const { date } = req.query;
    const query = { user: req.user.id };

    if (date) {
      query.soldAt = {
        $gte: startOfDay(date),
        $lte: endOfDay(date),
      };
    }

    const sales = await Sale.find(query).sort({ soldAt: -1, createdAt: -1 });
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    res.json({
      sales,
      summary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalSales: sales.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const today = new Date();
    const [salesToday, totalProducts, lowStockItems, recentSales] = await Promise.all([
      Sale.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user.id),
            soldAt: {
              $gte: startOfDay(today),
              $lte: endOfDay(today),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      Product.countDocuments({ user: req.user.id }),
      Product.find({ user: req.user.id, stock: { $lt: 5 } }).sort({ stock: 1, name: 1 }).limit(8),
      Sale.find({ user: req.user.id }).sort({ soldAt: -1 }).limit(7),
    ]);

    const analytics = recentSales
      .slice()
      .reverse()
      .map((sale) => ({
        label: new Date(sale.soldAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        revenue: sale.total,
      }));

    res.json({
      todaySales: salesToday[0]?.total || 0,
      totalProducts,
      lowStockItems,
      analytics,
    });
  } catch (error) {
    next(error);
  }
}
