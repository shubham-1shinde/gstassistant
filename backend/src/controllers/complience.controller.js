import { Invoice } from "../models/invoice.model.js";
import { Purchase } from "../models/purchase.model.js";
import { Complience } from "../models/complience.model.js";

export const getComplienceCalendar = async (req, res) => {
  try {
    const { businessId } = req.params;
    //console.log("Fetching compliance calendar for businessId:", businessId);

    const invoices = await Invoice.find({ businessId });
    const purchases = await Purchase.find({ businessId });

    const allData = [...invoices, ...purchases];

    const monthMap = {};

    allData.forEach((item) => {
      const key = item.month + "-" + item.financialYear;

      if (!monthMap[key]) {
        monthMap[key] = {
          month: item.month,
          financialYear: item.financialYear,
        };
      }
    });

    const tasks = [];

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    Object.values(monthMap).forEach((m) => {
      const currentMonthIndex = monthNames.indexOf(m.month);

      let filingMonth = (currentMonthIndex + 1) % 12;
      let filingYear = 2026; 

      tasks.push({
        month: m.month,
        title: "GSTR-1 Filing",
        desc: `Sales return for ${m.month}`,
        date: new Date(filingYear, filingMonth, 11),
      });

      tasks.push({
        month: m.month,
        title: "GSTR-3B Filing",
        desc: `Summary return for ${m.month}`,
        date: new Date(filingYear, filingMonth, 20),
      });
    });

    const today = new Date();

    const finalTasks = tasks.map((task) => {
      let status = "upcoming";

      if (task.date < today) status = "pending";

      return {
        ...task,
        status,
      };
    });

    finalTasks.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: finalTasks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const toggleComplianceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Compliance.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status =
      task.status === "completed"
        ? "pending"
        : "completed";

    await task.save();

    res.json({
      success: true,
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};