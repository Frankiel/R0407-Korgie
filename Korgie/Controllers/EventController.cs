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

        public string GetMonthEvents(int month, int year)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE MONTH(Start)=@Value1 AND YEAR(Start)=@Value2", month, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetWeekEvent(int week,int year)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE WEEKOFYEAR(Start)=@Value1 AND YEAR(Start)=@Value2", week, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public void SaveEvents(int EventId, string Title, DateTime Start, string Type, string Description, int Period, int Days, string Tags)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE EventId=@Value1", EventId);
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                if (eventsStub.Length == 0)
                {
                    var cmd = new SqlCommand(@"INSERT INTO EVENTS VALUES (@Title,@Start,@Type,@Description,@Period,@Days,@Tags)", conn);
                    cmd.Parameters.AddWithValue("@Title", Title);
                    cmd.Parameters.AddWithValue("@Start", Start);
                    cmd.Parameters.AddWithValue("@Type", Type);
                    cmd.Parameters.AddWithValue("@Description", Description);
                    cmd.Parameters.AddWithValue("@Period", Period);
                    cmd.Parameters.AddWithValue("@Days", Days);
                    cmd.Parameters.AddWithValue("@Tags", Tags);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    var cmd = new SqlCommand(@"UPDATE Events SET Title=@Title, Start=@Start, Type=@Type, Description=@Description, Period=@Period, Days=@Days, Tags=@Tags WHERE EventId=@EventId", conn);
                    cmd.Parameters.AddWithValue("@EventId", EventId);
                    cmd.Parameters.AddWithValue("@Title", Title);
                    cmd.Parameters.AddWithValue("@Start", Start);
                    cmd.Parameters.AddWithValue("@Type", Type);
                    cmd.Parameters.AddWithValue("@Description", Description);
                    cmd.Parameters.AddWithValue("@Period", Period);
                    cmd.Parameters.AddWithValue("@Days", Days);
                    cmd.Parameters.AddWithValue("@Tags", Tags);
                    conn.Open();
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