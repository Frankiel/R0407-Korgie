using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Korgie.Models;

namespace Korgie.Controllers
{
    public class EventController : Controller
    {
        // GET: Event
        public ActionResult IndexEvents()
        {
            return View(); //return the calendar page
        }
    }
}