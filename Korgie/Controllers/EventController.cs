using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Korgie.Models;

namespace Korgie.Controllers
{
    public class EventController : Controller
    {
        // GET: Event
        public ActionResult IndexEvents()
        {
            ViewBag.Email = Request.Cookies["Preferences"]["Email"];
            return View(); // don't return anything
        }

        public string GetEvents(int month, int year)
        {
            // Get all events for set month and year from DB
            DateTime now = DateTime.Now;
            Event[] eventsStub = { new Event(1, "event1", new DateTime(year, month, now.Day, 12, 00, 00), new DateTime(year, month, now.Day, 13, 00, 00), "Sports", "a few words", 0, new List<string>() { "123", "234" }),
                new Event(1, "event1", new DateTime(year, month, now.Day, 12, 00, 00), new DateTime(year, month, now.Day, 13, 00, 00), "Sports", "a few words", 0, new List<string>() { "123", "234" })
            };
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
    }
}