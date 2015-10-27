using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Korgie.Models
{
    public class Event
    {
        public int EventId { get; set; }
        public string Title { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        //Period of repeating
        //1-day; 0-none; 7-week; 31-month; 365-year
        public int Period { get; set; }
        //Days of repeating
        public int Days { get; set; } //?????
        //List of tags
        public List<string> Tags { get; set; }

        public Event(int id, string title, DateTime start, DateTime end, string type, string description, int period, /* days ???, */ List<string> tags)
        {
            EventId = id;
            Title = title;
            Start = start;
            End = end;
            Type = type;
            Description = description;
            Period = period;
            Tags = tags;
        }
    }
}