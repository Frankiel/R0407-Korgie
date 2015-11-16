﻿using System;
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
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events E, UserEvents UE,Users U WHERE MONTH(E.Start)=@Value1 AND YEAR(E.Start)=@Value2
AND E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", month, year);
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo TD,UserTodo UTD,Users U WHERE MONTH(TD.Start)=@Value1 And YEAR(TD.Start)=@VALUE2
AND TD.Todoid=UTD.Todoid AND UTD.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", month, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetWeekEvents(int week, int year)
        {
            //Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE WEEKOFYEAR(Start)=@Value1 AND YEAR(Start)=@Value2", week, year);
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events E, Users U, UserEvents UE WHERE DATEPART(week,E.Start)=@Value1 AND YEAR(E.Start)=@Value2 AND
E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail and U.PrimaryEmail=@Email", week, year);
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo TD,UserToDo UTD,Users U WHERE DATEPART(week,TD.Start)=@Value1 AND YEAR(TD.Start)=@Value2 AND
TD.Todoid=UTD.Todoid and UTD.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", week, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public void SaveTodo(Todo _todo)
        {
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo WHERE Todoid=@Value1", _todo.TodoId);
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                string resulttasks = "";
                foreach (string x in _todo.Tasks)
                {
                    resulttasks += x + " ";
                }
                if (todoStub.Length == 0)
                {
                    //string sql = string.Format(@"INSERT INTO Events VALUES ('{0}',{1},'{2}','{3}','{4}','{5}','{6}')", _event.Title, _event.Start, _event.Type, 
                    //    _event.Description, _event.Period, _event.Days, _event.Tags);
                    var cmd = new SqlCommand(@"INSERT INTO ToDo VALUES (@Title,@Start,@Color,@Description,@Tasks)", conn);
                    cmd.Parameters.AddWithValue("@Title", _todo.Title);
                    cmd.Parameters.AddWithValue("@Start", _todo.Start);
                    cmd.Parameters.AddWithValue("@Color", _todo.Color);
                    cmd.Parameters.AddWithValue("@Description", _todo.Description);
                    cmd.Parameters.AddWithValue("@Tasks", resulttasks);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    //string sql = string.Format(@"UPDATE Events Title=@Title, Start=@Start, Type=@Type, Description=@Description, Period=@Period, Days=@Days, Tags=@Tags WHERE EventId='{0}'",_event.EventId,
                    //    _event.Title,_event.Start,_event.Type,_event.Description,_event.Period,_event.Days,_event.Tags);
                    var cmd = new SqlCommand(@"UPDATE ToDo SET Title=@Title, Start=@Start, Color=@Color, Description=@Description, Tasks=@Tasks WHERE Todoid=@Todoid", conn);
                    cmd.Parameters.AddWithValue("@Todoid", _todo.TodoId);
                    cmd.Parameters.AddWithValue("@Title", _todo.Title);
                    cmd.Parameters.AddWithValue("@Start", _todo.Start);
                    cmd.Parameters.AddWithValue("@Color", _todo.Color);
                    cmd.Parameters.AddWithValue("@Description", _todo.Description);
                    cmd.Parameters.AddWithValue("@Tasks", resulttasks);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }

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
                    var cmd2 = new SqlCommand(@"INSERT INTO UserEvents Values (@Email,(SELECT MAX(EventId) FROM EVENTS))", conn);
                    cmd2.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                    cmd2.ExecuteNonQuery();
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
        public void DeleteEvents(int id)
        {
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                conn.Open();
                var cmd2 = new SqlCommand(@"DELETE FROM UserEvents WHERE EventId=@EventId AND PrimaryEmail=@Email", conn);
                cmd2.Parameters.AddWithValue("@EventId", id);
                cmd2.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                cmd2.ExecuteNonQuery();
                var cmd = new SqlCommand(@"DELETE FROM Events WHERE EventId=@EventId", conn);
                cmd.Parameters.AddWithValue("@EventId", id);
                cmd.ExecuteNonQuery();
            }
        }
        public void DeleteTodo(int id)
        {
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                var cmd = new SqlCommand(@"DELETE FROM ToDo WHERE Todoid=@Todoid", conn);
                cmd.Parameters.AddWithValue("@Todoid", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
        private Event[] GetEventsUNI(string sqlcommand, int value1 = 0, int value2 = 0)
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
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
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
        private Todo[] GetTodoUNI(string sqlcommand, int value1 = 0, int value2 = 0)
        {
            List<Todo> todo = new List<Todo>();
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                var cmd = new SqlCommand(sqlcommand, conn);
                conn.Open();
                //var cmd = new SqlCommand(@"Select * from AspNetUsers",conn);
                cmd.Parameters.AddWithValue("@Value1", value1);
                cmd.Parameters.AddWithValue("@Value2", value2);
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        List<string> tasks = dr.GetString(5).Split(' ').ToList<string>();
                        todo.Add(new Todo(dr.GetInt32(0), dr.GetString(1), dr.GetDateTime(2), dr.GetString(3), dr.GetString(4), tasks));
                    }
                }
            }
            Todo[] todoStub = todo.ToArray();
            return todoStub;
        }
        public User GetProfileInfo()
        {
            User result = null;
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                conn.Open();
                var cmd = new SqlCommand(@"SELECT * FROM Users WHERE PrimaryEmail=@Email", conn);
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        result = new User(dr.GetString(0), dr.GetString(1), dr.GetString(2), dr.GetString(3), dr.GetString(4), dr.GetString(5), dr.GetString(6).Split(' ').ToList<string>(), dr.GetString(7).Split(' ').ToList<string>(), dr.GetString(8).Split(' ').ToList<string>(),
                            dr.GetString(9).Split(' ').ToList<string>(), dr.GetString(10).Split(' ').ToList<string>());
                    }
                }
            }
            return result;
        }
        public void SaveProfileInfo(User user)
        {
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                conn.Open();
                var cmd = new SqlCommand(@"UPDATE Users SET Name=@Name,AdditionalEmail=@AdditionalEmail,Phone=@Phone,Country=@Country,City=@City,Sport=@Sport
,Work=@Work,Study=@Study,Additional=@Additional,Rest=@Rest WHERE PrimaryEmail=@PrimaryEmail", conn);
                cmd.Parameters.AddWithValue("@Name", user.Name);
                cmd.Parameters.AddWithValue("@AdditionalEmail", user.AdditionalEmail);
                cmd.Parameters.AddWithValue("@Phone", user.Phone);
                cmd.Parameters.AddWithValue("@Country", user.Country);
                cmd.Parameters.AddWithValue("@City", user.City);
                cmd.Parameters.AddWithValue("@Sport", string.Join(" ", user.Sport.ToArray()));
                cmd.Parameters.AddWithValue("@Work", string.Join(" ", user.Work.ToArray()));
                cmd.Parameters.AddWithValue("@Study", string.Join(" ", user.Study.ToArray()));
                cmd.Parameters.AddWithValue("@Additional", string.Join(" ", user.Additional.ToArray()));
                cmd.Parameters.AddWithValue("@Rest", string.Join(" ", user.Rest.ToArray()));
                cmd.Parameters.AddWithValue("@PrimaryEmail", user.PrimaryEmail);
                cmd.ExecuteNonQuery();
            }
        }
    }
}