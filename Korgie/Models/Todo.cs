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
        public Todo(int _id,string _title,DateTime _start,string _color,string _description,List<string> _tasks)
        {
            TodoId = _id;
            Title = _title;
            Start = _start;
            Color = _color;
            Description = _description;
            Tasks = _tasks;
        }
    }
}