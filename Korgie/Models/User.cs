using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Korgie.Models
{
    public class User
    {
        public string Name { get; set; }
        public string PrimaryEmail { get; set; }
        public string AdditionalEmail { get; set; }
        public string Phone { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public Type Sport { get; set; }
        public Type Work { get; set; }
        public Type Study { get; set; }
        public Type Additional { get; set; }
        public Type Rest { get; set; }
    }
}