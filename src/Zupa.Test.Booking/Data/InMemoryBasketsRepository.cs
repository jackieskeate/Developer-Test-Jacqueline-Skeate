using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zupa.Test.Booking.Models;

namespace Zupa.Test.Booking.Data
{
    internal class InMemoryBasketsRepository : IBasketsRepository
    {
        private Basket _basket;
        private readonly Dictionary<string, double> _validpromocodes;

        public InMemoryBasketsRepository()
        {
            _basket = new Basket();

            _validpromocodes = new Dictionary<string, double>
            {
                { "discount10", 0.9 },
                { "discount50", 0.5 }
            };
        }

        public Task<Basket> ReadAsync()
        {
            return Task.FromResult(_basket);
        }

        public Task ResetBasketAsync()
        {
            return Task.FromResult(_basket = new Basket());
        }

        public Task<Basket> AddToBasketAsync(BasketItem item)
        {
            var items = _basket.Items.ToList();
            items.Add(item);
            _basket.Items = items;
            double itemDiscountedPrice = ApplyPromoCodeToPrice(_basket.PromoCode, item.GrossPrice);
            _basket.Total += itemDiscountedPrice;
            
            return Task.FromResult(_basket);
        }

        public Task<Basket> AddPromoToBasketAsync(string promoCode)
        {
            // Only allow the promo code to be set if the promo code is valid.
            if (!_validpromocodes.Keys.Contains(promoCode))
            {
                throw new Exception(string.Format("Promotional code {0} is not valid", promoCode));
            }

            // Apply the promo code to the total
            // Always sum the gross prices to prevent discounts being applied more than once
            _basket.PromoCode = promoCode;
            _basket.Total = ApplyPromoCodeToPrice(promoCode, _basket.Items.Sum(item => item.GrossPrice));
            return Task.FromResult(_basket);
        }

        public double ApplyPromoCodeToPrice(string promoCode, double price)
        {
            if (!string.IsNullOrEmpty(promoCode))
            {
                return _validpromocodes[promoCode] * price;
            }
            return price;
        }
    }
}
