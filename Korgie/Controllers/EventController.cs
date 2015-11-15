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
AND E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email",month, year);
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo TD,UserTodo UTD,Users U WHERE MONTH(TD.Start)=@Value1 And YEAR(TD.Start)=@VALUE2
AND TD.Todoid=UTD.Todoid AND UTD.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", month, year);
            SaveTodo(todoStub[0]);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetWeekEvents(int week,int year)
        {
            //Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE WEEKOFYEAR(Start)=@Value1 AND YEAR(Start)=@Value2", week, year);
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events E, Users U, UserEvents UE WHERE DATEPART(week,E.Start)=@Value1 AND YEAR(E.Start)=@Value2 AND
E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail and U.PrimaryEmail=@Email",week, year);
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
        public void SaveEvents(Event _event)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE EventId=@Value1",_event.EventId);
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                if (eventsStub.Length==0)
                {
                    //string sql = string.Format(@"INSERT INTO Events VALUES ('{0}',{1},'{2}','{3}','{4}','{5}','{6}')", _event.Title, _event.Start, _event.Type, 
                    //    _event.Description, _event.Period, _event.Days, _event.Tags);
                    var cmd = new SqlCommand(@"INSERT INTO EVENTS VALUES (@Title,@Start,@Type,@Description,@Period,@Days,@Tags)", conn);
                    cmd.Parameters.AddWithValue("@Title", _event.Title);
                    cmd.Parameters.AddWithValue("@Start", _event.Start);
                    cmd.Parameters.AddWithValue("@Type", _event.Type);
                    cmd.Parameters.AddWithValue("@Description", _event.Description);
                    cmd.Parameters.AddWithValue("@Period", _event.Period);
                    cmd.Parameters.AddWithValue("@Days", _event.Days);
                    cmd.Parameters.AddWithValue("@Tags", _event.Tags);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    //string sql = string.Format(@"UPDATE Events Title=@Title, Start=@Start, Type=@Type, Description=@Description, Period=@Period, Days=@Days, Tags=@Tags WHERE EventId='{0}'",_event.EventId,
                    //    _event.Title,_event.Start,_event.Type,_event.Description,_event.Period,_event.Days,_event.Tags);
                    var cmd = new SqlCommand(@"UPDATE Events SET Title=@Title, Start=@Start, Type=@Type, Description=@Description, Period=@Period, Days=@Days, Tags=@Tags WHERE EventId=@EventId", conn);
                    cmd.Parameters.AddWithValue("@EventId", _event.EventId);
                    cmd.Parameters.AddWithValue("@Title", _event.Title);
                    cmd.Parameters.AddWithValue("@Start", _event.Start);
                    cmd.Parameters.AddWithValue("@Type", _event.Type);
                    cmd.Parameters.AddWithValue("@Description", _event.Description);
                    cmd.Parameters.AddWithValue("@Period", _event.Period);
                    cmd.Parameters.AddWithValue("@Days", _event.Days);
                    cmd.Parameters.AddWithValue("@Tags", _event.Tags);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public void DeleteEvents(int id)
        {
            using (var conn = new SqlConnection("Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30"))
            {
                var cmd = new SqlCommand(@"DELETE FROM Events WHERE EventId=@EventId", conn);
                cmd.Parameters.AddWithValue("@EventId", id);
                conn.Open();
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
        private Todo[] GetTodoUNI(string sqlcommand,int value1=0,int value2=0)
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
    }
}