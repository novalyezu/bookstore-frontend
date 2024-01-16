import moment from "moment";

export const formatUSD = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(value);
};

export const formatOrderDate = (orderDate: Date) => {
  return moment(orderDate).format("DD MMM YYYY")
}
