export const formatMoney = ({ amount, currencyCode }) => {
  return new Intl.NumberFormat("vn-VN", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};
