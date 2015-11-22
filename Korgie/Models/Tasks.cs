using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Korgie.Models
{
    public class Tasks
    {
        public string Name { set; get; }
        public bool State { set; get; }
        public Tasks() { }
        public Tasks(string _name, string _state)
        {
            Name = _name;
            State = _state;
        }
    }
}
