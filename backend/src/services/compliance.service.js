import {Compliance} from "../models/compliance.model.js";
import {Business} from "../models/business.model.js";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getFinancialYear = (date) => {
  const year = date.getFullYear();

  return date.getMonth() >= 3
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
};

export const createMonthlyCompliance = async (
  businessId,
  date = new Date()
) => {
  const month = monthNames[date.getMonth()];
  const financialYear = getFinancialYear(date);

  const nextMonth = (date.getMonth() + 1) % 12;

  const dueYear =
    nextMonth === 0
      ? date.getFullYear() + 1
      : date.getFullYear();

  const compliances = [
    {
      title: "GSTR-1 Filing",
      desc: `Sales return for ${month}`,
      dueDate: new Date(dueYear, nextMonth, 11),
    },
    {
      title: "GSTR-3B Filing",
      desc: `Summary return for ${month}`,
      dueDate: new Date(dueYear, nextMonth, 20),
    },
  ];

  for (const compliance of compliances) {
    const exists = await Compliance.findOne({
      businessId,
      month,
      financialYear,
      title: compliance.title,
    });

    if (exists) continue;

    await Compliance.create({
      businessId,
      month,
      financialYear,
      ...compliance,
    });
  }
};

export const generateComplianceForAllBusinesses = async () => {
  const businesses = await Business.find();

  for (const business of businesses) {
    await createMonthlyCompliance(business._id);
  }
};