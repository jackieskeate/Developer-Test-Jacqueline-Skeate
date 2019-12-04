using System.Collections.Generic;

namespace Zupa.Test.Booking.Models
{
    public class Basket
    {
        public IEnumerable<BasketItem> Items { get; set; } = new List<BasketItem>();
        public string PromoCode { get; set; } = string.Empty;
        public double Total { get; set; } = 0;
    }
}
