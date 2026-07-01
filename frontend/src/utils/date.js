export const getCurrentMonthAndFY = () => {
  const date = new Date();

  // Month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthIndex = date.getMonth();
  const month = months[monthIndex];

  const year = date.getFullYear();

  // Financial year logic (India: Apr to Mar)
  let fyStart, fyEnd;

  if (monthIndex >= 3) {
    // April (3) to December
    fyStart = year;
    fyEnd = year + 1;
  } else {
    // January to March
    fyStart = year - 1;
    fyEnd = year;
  }

  const financialYear = `${fyStart}-${String(fyEnd).slice(-2)}`;

  return {
    month,
    financialYear,
  };
};