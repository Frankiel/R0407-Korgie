using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Korgie.Models;

namespace Korgie.Controllers
{
    public class WebSiteController : Controller
    {
        // GET: Event
        public ActionResult Index()
        {
            ViewBag.Email = Request.Cookies["Preferences"]["Email"];
            return View(); // don't return anything
        }

        public string GetEvents(int month, int year)
        {
            // Get all events for set month and year from DB
            //using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            //{
            //    //var cmd = new SqlCommand(@"SELECT * WHERE MONTH(Start)=@Monthday AND YEAR(Start)=@Yearday FROM Events", conn);
            //    conn.Open();
            //    var cmd = new SqlCommand(@"Select * from AspNetUsers",conn);
            //    cmd.Parameters.AddWithValue("@Monthday", month);
            //    cmd.Parameters.AddWithValue("@Yearday", year);
            //    using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
            //    {
            //        for (int i=0;i<dr.FieldCount;i++)
            //        {
            //            Console.Write("{0}\t", dr.GetName(i).ToString().Trim());
            //        }
            //        while (dr.Read())
            //        {
            //                Console.WriteLine("{0}\t{1}\t{2}", dr.GetValue(0).ToString().Trim(),
            //                dr.GetValue(1).ToString().Trim(),
            //                dr.GetValue(2).ToString().Trim());
            //        }
            //    }
            //}
            DateTime now = DateTime.Now;
            Event[] eventsStub = { new Event(1, "event1", new DateTime(year, month, now.Day, 12, 00, 00), new DateTime(year, month, now.Day, 13, 00, 00), "Sports", "a few words", 0, new List<string>() { "123", "234" }), new Event(2, "event2", new DateTime(year, month, now.Day, 12, 00, 00), new DateTime(year, month, now.Day, 13, 00, 00), "Work", "a few words", 0, new List<string>() { "123", "234" }), new Event(3, "event3", new DateTime(year, month, now.Day, 12, 00, 00), new DateTime(year, month, now.Day, 13, 00, 00), "Study", "a few words", 0, new List<string>() { "123", "234" }), new Event(4, "event4", new DateTime(year, month, now.Day, 12, 00, 00), new DateTime(year, month, now.Day, 13, 00, 00), "Work", "a few words", 0, new List<string>() { "123", "234" }) };
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
    }
}