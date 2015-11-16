using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Korgie.Models
{
    public class Type
    {
        public string Title { set; get; }
        public string ClassColor { set; get; }
        public string Color { set; get; }
        public Type(string Title,string ClassColor,string Color)
        {
            this.Title = Title;
            this.ClassColor = ClassColor;
            this.Color = Color;
        }
    }
}
