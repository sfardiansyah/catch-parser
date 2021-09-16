import summarizeOrder, {
  calculateAverageUnitPrice,
  calculateOrderValue,
  parseDateToISO,
} from '../summarize';
import { Discount, OrderRecord, OrderSummary } from '../types';

describe('summarize', () => {
  const order: OrderRecord = {
    order_id: 1,
    order_date: 'Thu, 16 Sep 2021 06:47:15 +0000',
    customer: {
      customer_id: 11,
      first_name: 'Jaden',
      last_name: 'Shun',
      email: 'test@test.com',
      phone: '(+62) 341578048',
      shipping_address: {
        street: '32B BAKER',
        postcode: '5678',
        suburb: 'KLOJEN',
        state: 'SEMARANG',
      },
    },
    items: [
      {
        quantity: 2,
        unit_price: 10,
        product: {
          product_id: 1,
          image: '',
          thumbnail: '',
          title: 'item1',
          category: [],
          url: '',
          upc: '0027497',
          created_at: new Date(),
          brand: { id: 7, name: 'BEAR' },
        },
      },
      {
        quantity: 1,
        unit_price: 7.67,
        product: {
          product_id: 10,
          image: '',
          thumbnail: '',
          title: 'item2',
          category: [],
          url: '',
          upc: '0027499',
          created_at: new Date(),
          brand: { id: 7, name: 'BEAR' },
        },
      },
    ],
    discounts: [],
    shipping_price: 13.45,
  };

  describe('parseDateToISO', () => {
    test('should parse date to ISO 8601 format', () =>
      expect(parseDateToISO(order.order_date)).toEqual(
        '2021-09-16T06:47:15.000Z'
      ));
  });

  describe('calculateAverageUnitPrice', () => {
    test('should calculate average unit price in an order', () =>
      expect(calculateAverageUnitPrice(order.items)).toEqual(9.22));
  });

  describe('calculateOrderValue', () => {
    test('should substract the total price with DOLLAR-typed discount', () => {
      const discounts: Discount[] = [{ type: 'DOLLAR', value: 9, priority: 1 }];

      expect(calculateOrderValue(order.items, discounts)).toEqual(18.67);
    });

    test('should reduce the total price with PERCENTAGE-typed discount', () => {
      const discounts: Discount[] = [
        { type: 'PERCENTAGE', value: 10, priority: 1 },
      ];

      expect(calculateOrderValue(order.items, discounts)).toEqual(24.9);
    });
  });

  test('should create OrderSummary object with desired values', () =>
    expect(summarizeOrder(order)).toEqual({
      order_id: 1,
      order_datetime: '2021-09-16T06:47:15.000Z',
      total_order_value: 27.67,
      average_unit_price: 9.22,
      distinct_unit_count: 2,
      total_unit_count: 3,
      customer_state: 'SEMARANG',
    } as OrderSummary));
});
