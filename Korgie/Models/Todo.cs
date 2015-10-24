using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Korgie.Models
{
    public class Todo
    {
        public int TodoId { get; set; }
        public string Title { get; set; }
        public DateTime Start { get; set; }
        public String Color { get; set; }
        public String Description { get; set; }
        public List<string> Tasks { get; set; }
    }
}