import { Invoice } from "../models/invoice.model.js";
import { Purchase } from "../models/purchase.model.js";
import { Compliance } from "../models/compliance.model.js";

export const getComplianceCalendar = async (req, res) => {
  try {
    const { businessId } = req.params;

    const compliances = await Compliance.find({
      businessId,
    }).sort({
      dueDate: 1,
    });

    const today = new Date();

    const result = compliances.map((item) => {
      let status = "upcoming";

      if (item.status === "completed") {
        status = "completed";
      } else if (new Date(item.dueDate) < today) {
        status = "pending";
      }

      return {
        ...item.toObject(),
        status,
      };
    });

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const markComplianceCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const compliance = await Compliance.findByIdAndUpdate(
      id,
      {
        status: "completed",
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      data: compliance,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};