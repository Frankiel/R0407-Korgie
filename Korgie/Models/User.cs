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
        public List<string> Sport { get; set; }
        public List<string> Work { get; set; }
        public List<string> Study { get; set; }
        public List<string> Additional { get; set; }
        public List<string> Rest { get; set; }
        public User(string _primaryemail, string _name, string _additionalemail, string _phone, string _country, string _city, List<string> _sport, List<string> _work, List<string> _study, List<string> _additional,
            List<string> _rest)
        {
            Name = _name;
            PrimaryEmail = _primaryemail;
            AdditionalEmail = _additionalemail;
            Phone = _phone;
            Country = _country;
            City = _city;
            Sport = _sport;
            Work = _work;
            Study = _study;
            Additional = _additional;
            Rest = _rest;
        }
        public User() { }
    }
}