using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Korgie.Models
{
    public class Notifications
    {
        public int NotId { set; get; }
        public string User { set; get; }
        public int Type { set; get; }
        public bool Actual { set; get; }
        public string Data { set; get; }
        public DateTime Date { set; get; }
        public Notifications(int id,string user,int type,bool actual,string data, DateTime date)
        {
            NotId = id;
            User = user;
            Type = type;
            Actual = actual;
            Data = data;
            Date = date;
        }
    }
}