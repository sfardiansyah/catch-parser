import moment from 'moment';
import { OrderRecord, OrderSummary, Item, Discount } from './types';

const calculateOrderValue = (items: Item[], discounts: Discount[]) => {
  const total = items.reduce(
    (sum, { unit_price, quantity }) => sum + unit_price * quantity,
    0
  );

  discounts.sort((a, b) => a.priority - b.priority);

  const totalWithDiscounts = discounts.reduce(
    (sum, disc) =>
      disc.type === 'PERCENTAGE'
        ? (sum * (100 - disc.value)) / 100
        : sum - disc.value,
    total
  );

  return parseFloat(totalWithDiscounts.toFixed(2));
};

const calculateAverageUnitPrice = (items: Item[]) => {
  let price = 0;
  let units = 0;

  items.forEach(({ quantity, unit_price }) => {
    price += quantity * unit_price;
    units += quantity;
  });

  return parseFloat((price / units).toFixed(2));
};

const parseDateToISO = (date: string) =>
  moment(date, 'ddd, DD MMM YYYY HH:mm:ss Z').toISOString();

const summarizeOrder = ({
  order_id,
  order_date,
  items,
  discounts,
  customer: {
    shipping_address: { state },
  },
}: OrderRecord): OrderSummary => ({
  order_id,
  order_datetime: parseDateToISO(order_date),
  total_order_value: calculateOrderValue(items, discounts),
  average_unit_price: calculateAverageUnitPrice(items),
  distinct_unit_count: items.length,
  total_unit_count: items.reduce((sum, { quantity }) => sum + quantity, 0),
  customer_state: state,
});

export default summarizeOrder;
