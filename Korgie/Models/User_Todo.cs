using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Korgie.Models
{
    public class User_Todo
    {
        public int UserTodoId { get; set; }
        public int UserId { get; set; }
        public int TodoId { get; set; }
    }
}