using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Korgie.Models;
using System.Data.SqlClient;

namespace Korgie.Controllers
{
    public class EventController : Controller
    {
        // GET: Event
        public ActionResult Index()
        {
            string[] allcookies = Request.Cookies.AllKeys;
            bool result = true;
            foreach (string x in allcookies)
            {
                if (x == "Preferences")
                {
                    result = false;
                }
            }

            if (result)
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.Email = Request.Cookies["Preferences"]["Email"];
            return View(); // don't return anything
        }

        public string GetEvents(int month, int year)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE MONTH(Start)=@Value1 AND YEAR(Start)=@Value2", month, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetWeekEvent(int week,int year)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE WEEKOFYEAR(Start)=@Value1 AND YEAR(Start)=@Value2", week, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public void SaveEvents(Event _event)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE EventId=@Value1", _event.EventId);
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                if (eventsStub.Length==0)
                {

                    string sql = string.Format(@"INSERT INTO Events VALUES ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", _event.EventId, _event.Title, _event.Start, _event.Type, 
                        _event.Description, _event.Period, _event.Days, _event.Tags);
                    var cmd = new SqlCommand(sql);
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    string sql = string.Format(@"UPDATE Events SET EventId='{0}', Title='{1}', Start='{2}', Type='{3}', Description='{4}', Period='{5}', Days='{6}', Tags='{7}' WHERE EventId='{0}'");
                    var cmd = new SqlCommand(sql);
                    cmd.ExecuteNonQuery();
                }
            }
        }
        private Event[] GetEventsUNI(string sqlcommand,int value1=0,int value2=0)
        {
            //Get all events for set month and year from DB
            List<Event> events = new List<Event>();
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                var cmd = new SqlCommand(sqlcommand, conn);
                conn.Open();
                //var cmd = new SqlCommand(@"Select * from AspNetUsers",conn);
                cmd.Parameters.AddWithValue("@Value1", value1);
                cmd.Parameters.AddWithValue("@Value2", value2);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        events.Add(new Event(dr.GetInt32(0), dr.GetString(1), dr.GetDateTime(2), dr.GetString(3), dr.GetString(4), dr.GetInt32(5), dr.GetString(7)));
                    }
                }
            }
            Event[] eventsStub = events.ToArray();
            return eventsStub;
        }
    }
}