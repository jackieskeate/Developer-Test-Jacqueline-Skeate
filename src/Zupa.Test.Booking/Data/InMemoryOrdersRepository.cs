using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zupa.Test.Booking.Models;

namespace Zupa.Test.Booking.Data
{
    internal class InMemoryOrdersRepository : IOrdersRepository
    {
        private readonly List<Order> _orders;

        public InMemoryOrdersRepository()
        {
            _orders = new List<Order>();
        }

        public async Task<Order> ReadAsync(Guid id)
        {
            return _orders.First(order => order.ID == id);
        }

        public async Task<Order> SaveAsync(Order order)
        {
            // Check the promo code on this order hasn't been 
            // used on a previous order before adding
            foreach (Order existingOrder in _orders)
            {
                if (existingOrder.PromoCode == order.PromoCode)
                {
                    throw new Exception(string.Format("Promo code {0} has already been used. Your order has not been placed.", order.PromoCode));
                }
            }

            _orders.Add(order);
            return order;
        }
    }
}
