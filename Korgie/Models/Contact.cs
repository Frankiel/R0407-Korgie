using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Korgie.Models
{
    public class Contact
    {
        public string From { set; get; }
        public string To { set; get; }
        public string NameTo { set; get; }
        public string State { set; get; }
        public Contact(string _from,string _to,string _nameto, string _state)
        {
            From = _from;
            To = _to;
            NameTo = _nameto;
            State = _state;
        }
        public Contact() { }
    }
}
