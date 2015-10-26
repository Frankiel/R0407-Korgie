using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Korgie.Models
{
    public class User_Event
    {
        public int UserEventId { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; }
    }
}