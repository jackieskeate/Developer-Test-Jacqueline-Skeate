using System.Collections.Generic;

namespace Zupa.Test.Booking.ViewModels
{
    public class Basket
    {
        public IEnumerable<BasketItem> Items { get; set; }
        public string PromoCode { get; set; }
        public double Total { get; set; }
    }
}
