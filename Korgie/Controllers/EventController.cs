using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Korgie.Models;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Net;
using System.Configuration;
using System.Web.Configuration;

namespace Korgie.Controllers
{
    public class EventController : Controller
    {
        const string _connection = "Server = tcp:ivqgu1eln8.database.windows.net,1433; Database = korgie_db; User ID = frankiel@ivqgu1eln8; Password = Helloworld123; Trusted_Connection = False; Encrypt = True; Connection Timeout = 30";
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
        #region EventsAndTODO
        public string GetMonthEvents(int month, int year)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events E, UserEvents UE,Users U WHERE MONTH(E.Start)=@Value1 AND YEAR(E.Start)=@Value2
AND E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", month, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetMonthTodo(int month, int year)
        {
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo TD,UserTodo UTD,Users U WHERE MONTH(TD.Start)=@Value1 And YEAR(TD.Start)=@Value2
AND TD.Todoid=UTD.Todoid AND UTD.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", month, year);
            return new JavaScriptSerializer().Serialize(todoStub);
        }
        public string GetWeekEvents(int week, int year)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events E, Users U, UserEvents UE WHERE DATEPART(iso_week,E.Start)=@Value1 AND YEAR(E.Start)=@Value2 AND
E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail and U.PrimaryEmail=@Email", week, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetWeekTodo(int week, int year)
        {
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo TD,UserToDo UTD,Users U WHERE DATEPART(iso_week,TD.Start)=@Value1 AND YEAR(TD.Start)=@Value2 AND
TD.Todoid=UTD.Todoid and UTD.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", week, year);
            return new JavaScriptSerializer().Serialize(todoStub);
        }
        public int SaveTodo(int TodoId, string Title, DateTime Start, string Color, string Description, bool[] States, string[] Tasks)
        {
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo WHERE Todoid=@Value1", TodoId);
            int toreturn = -1;
            using (var conn = new SqlConnection(_connection))
            {
                string resulttasks = "";
                if (Tasks != null)
                {
                    for (int i = 0; i < Tasks.Length; i++)
                    {
                        resulttasks += Tasks[i] + "~" + States[i] + "|";
                    }
                }

                if (todoStub.Length == 0)
                {
                    var cmd = new SqlCommand(@"INSERT INTO ToDo VALUES (@Title,@Start,@Color,@Description,@Tasks)", conn);
                    cmd.Parameters.AddWithValue("@Title", Title);
                    cmd.Parameters.AddWithValue("@Start", Start);
                    cmd.Parameters.AddWithValue("@Color", Color);
                    cmd.Parameters.AddWithValue("@Description", Description);
                    cmd.Parameters.AddWithValue("@Tasks", resulttasks);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    var cmd2 = new SqlCommand(@"INSERT INTO UserTodo Values (@Email,(SELECT MAX(TodoId) FROM ToDo))", conn);
                    cmd2.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                    cmd2.ExecuteNonQuery();
                    var cmd3 = new SqlCommand(@"SELECT MAX(EventId) FROM Events", conn);
                    using (SqlDataReader dr = cmd3.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                    {
                        while (dr.Read())
                        {
                            toreturn = dr.GetInt32(0);
                }
                    }
                }
                else
                {
                    var cmd = new SqlCommand(@"UPDATE ToDo SET Title=@Title, Start=@Start, Color=@Color, Description=@Description, Tasks=@Tasks WHERE Todoid=@Todoid", conn);
                    cmd.Parameters.AddWithValue("@Todoid", TodoId);
                    cmd.Parameters.AddWithValue("@Title", Title);
                    cmd.Parameters.AddWithValue("@Start", Start);
                    cmd.Parameters.AddWithValue("@Color", Color);
                    cmd.Parameters.AddWithValue("@Description", Description);
                    cmd.Parameters.AddWithValue("@Tasks", resulttasks);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            return toreturn;
        }
        public int SaveEvents(int EventId, string Title, DateTime Start, string Type, string Description, int Period, int Days, string Tags, string[] attached,int Notify)
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE EventId=@Value1", EventId);
            int toreturn = -1;
            using (var conn = new SqlConnection(_connection))
            {
                if (eventsStub.Length == 0)
                {
                    var cmd = new SqlCommand(@"INSERT INTO EVENTS VALUES (@Title,@Start,@Type,@Description,@Period,@Days,@Tags,@Owner,@Notify)", conn);
                    cmd.Parameters.AddWithValue("@Title", Title);
                    cmd.Parameters.AddWithValue("@Start", Start);
                    cmd.Parameters.AddWithValue("@Type", Type);
                    cmd.Parameters.AddWithValue("@Description", Description);
                    cmd.Parameters.AddWithValue("@Period", Period);
                    cmd.Parameters.AddWithValue("@Days", Days);
                    cmd.Parameters.AddWithValue("@Tags", Tags);
                    cmd.Parameters.AddWithValue("@Owner", Request.Cookies["Preferences"]["Email"]);
                    cmd.Parameters.AddWithValue("@Notify", Notify);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    var cmd2 = new SqlCommand(@"INSERT INTO UserEvents Values (@Email,(SELECT MAX(EventId) FROM EVENTS))", conn);
                    for (int i = 0; i < attached.Length; i++)
                    {
                        cmd2.Parameters.AddWithValue("@Email", attached[i]);
                        cmd2.ExecuteNonQuery();
                        cmd2.Parameters.Clear();
                    }
                    var cmd3 = new SqlCommand(@"SELECT MAX(EventId) FROM Events", conn);
                    using (SqlDataReader dr = cmd3.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                    {
                        while (dr.Read())
                        {
                            toreturn = dr.GetInt32(0);
                }
                    }
                }
                else
                {
                    var cmd = new SqlCommand(@"UPDATE Events SET Title=@Title, Start=@Start, Type=@Type, Description=@Description, Period=@Period, Days=@Days, Tags=@Tags Notify=@Notify WHERE EventId=@EventId", conn);
                    cmd.Parameters.AddWithValue("@EventId", EventId);
                    cmd.Parameters.AddWithValue("@Title", Title);
                    cmd.Parameters.AddWithValue("@Start", Start);
                    cmd.Parameters.AddWithValue("@Type", Type);
                    cmd.Parameters.AddWithValue("@Description", Description);
                    cmd.Parameters.AddWithValue("@Period", Period);
                    cmd.Parameters.AddWithValue("@Days", Days);
                    cmd.Parameters.AddWithValue("@Tags", Tags);
                    cmd.Parameters.AddWithValue("@Notify", Notify);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    var cmd2 = new SqlCommand(@"DELETE FROM UserEvents WHERE EventId=@Id", conn);
                    cmd2.Parameters.AddWithValue("@Id", EventId);
                    cmd2.ExecuteNonQuery();
                    var cmd3 = new SqlCommand(@"INSERT INTO UserEvents Values (@Email,@Id)", conn);
                    for (int i = 0; i < attached.Length; i++)
                    {
                        cmd3.Parameters.AddWithValue("@Id", EventId);
                        cmd3.Parameters.AddWithValue("@Email", attached[i]);
                        cmd3.ExecuteNonQuery();
                        cmd3.Parameters.Clear();
                    }
                }
            }
            return toreturn;
        }
        public void DeleteEvents(int id)
        {
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                Event[] temp = GetEventsUNI(@"SELECT * FROM Events WHERE EventId=@Id",0,0,id);
                if (temp[0].Owner != Request.Cookies["Preferences"]["Email"])
                {
                    var sqlcom = new SqlCommand(@"DELETE FROM UserEvents WHERE EventId=@Id AND PrimaryEmail=@Email", conn);
                    sqlcom.Parameters.AddWithValue("@Id", id);
                    sqlcom.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                    sqlcom.ExecuteNonQuery();
                    return;
                }
                var cmd = new SqlCommand(@"DELETE FROM UserEvents WHERE EventId=@Id", conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.ExecuteNonQuery();
                var cmd2 = new SqlCommand(@"DELETE FROM Events WHERE EventId=@Id", conn);
                cmd2.Parameters.AddWithValue("@Id", id);
                cmd2.ExecuteNonQuery();
            }
        }
        public void DeleteTodo(int id)
        {
            Delete_Todo_Events_UNI(@"DELETE FROM UserTodo WHERE TodoId=@Id AND PrimaryEmail=@Email", @"DELETE FROM ToDo WHERE Todoid=@Id", id);
        }
        public void Delete_Todo_Events_UNI(string sqlcom,string sqlcom2,int id)
        {
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(sqlcom, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                cmd.ExecuteNonQuery();
                var cmd2 = new SqlCommand(sqlcom2, conn);
                cmd2.Parameters.AddWithValue("@Id", id);
                cmd2.ExecuteNonQuery();
            }
        }
        private Event[] GetEventsUNI(string sqlcommand, int value1 = 0, int value2 = 0, int id = 0)
        {
            List<Event> events = new List<Event>();
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(sqlcommand, conn);
                conn.Open();
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Value1", value1);
                cmd.Parameters.AddWithValue("@Value2", value2);
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        events.Add(new Event(dr.GetInt32(0), dr.GetString(1), dr.GetDateTime(2), dr.GetString(3), dr.GetString(4), dr.GetInt32(5), dr.GetString(7), dr.GetString(8), dr.GetInt32(9)));
                    }
                }
            }
            return events.ToArray();
        }
        public string GetEventContacts(int id)
        {
            List<User> result = new List<User>();
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(@"SELECT * FROM Users U, UserEvents UE WHERE U.PrimaryEmail=UE.PrimaryEmail AND UE.EventId=@Id", conn);
                cmd.Parameters.AddWithValue("@Id", id);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        if (dr.GetString(0) != Request.Cookies["Preferences"]["Email"])
                        {
                            result.Add(new User(dr.GetString(0), dr.GetString(1), dr.GetString(2), dr.GetString(3), dr.GetString(4), dr.GetString(5), dr.GetString(6).Split(' ').ToList<string>(), dr.GetString(7).Split(' ').ToList<string>(), dr.GetString(8).Split(' ').ToList<string>(),
                            dr.GetString(9).Split(' ').ToList<string>(), dr.GetString(10).Split(' ').ToList<string>()));
                        }
                    }
                }
            }
            return new JavaScriptSerializer().Serialize(result.ToArray());
        }
        private Todo[] GetTodoUNI(string sqlcommand, int value1 = 0, int value2 = 0)
        {
            List<Todo> todo = new List<Todo>();
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(sqlcommand, conn);
                conn.Open();
                cmd.Parameters.AddWithValue("@Value1", value1);
                cmd.Parameters.AddWithValue("@Value2", value2);
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        List<string> temp = dr.GetString(5).Split('|').ToList<string>();
                        List<Tasks> tasks = new List<Tasks>();
                        for (int i = 0; i < temp.Count - 1; i++)
                        {
                            tasks.Add(new Tasks(temp[i].Split('~')[0], Convert.ToBoolean(temp[i].Split('~')[1])));
                        }
                        todo.Add(new Todo(dr.GetInt32(0), dr.GetString(1), dr.GetDateTime(2), dr.GetString(3), dr.GetString(4), tasks));
                    }
                }
            }
            return todo.ToArray();
        }
        #endregion
        #region Profile
        public string GetProfileInfo()
        {
            User result = null;
            using (var conn = new SqlConnection(_connection))
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
            return new JavaScriptSerializer().Serialize(result);
        }
        public void SaveProfileInfo(string Name, string PrimaryEmail, string AdditionalEmail, string Phone, string Country,
            string City, string[] Sport, string[] Work, string[] Rest, string[] Study, string[] Additional)
        {
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(@"UPDATE Users SET Name=@Name,AdditionalEmail=@AdditionalEmail,Phone=@Phone,Country=@Country,City=@City,Sport=@Sport
,Work=@Work,Study=@Study,Additional=@Additional,Rest=@Rest WHERE PrimaryEmail=@PrimaryEmail", conn);
                cmd.Parameters.AddWithValue("@Name", Name);
                cmd.Parameters.AddWithValue("@AdditionalEmail", AdditionalEmail);
                cmd.Parameters.AddWithValue("@Phone", Phone);
                cmd.Parameters.AddWithValue("@Country", Country);
                cmd.Parameters.AddWithValue("@City", City);
                cmd.Parameters.AddWithValue("@Sport", string.Join(" ", Sport));
                cmd.Parameters.AddWithValue("@Work", string.Join(" ", Work));
                cmd.Parameters.AddWithValue("@Study", string.Join(" ", Study));
                cmd.Parameters.AddWithValue("@Additional", string.Join(" ", Additional));
                cmd.Parameters.AddWithValue("@Rest", string.Join(" ", Rest));
                cmd.Parameters.AddWithValue("@PrimaryEmail", PrimaryEmail);
                cmd.ExecuteNonQuery();
            }
        }
        public bool IsUser(string email)
        {
            User result = null;
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(@"SELECT * FROM Users WHERE PrimaryEmail=@Email", conn);
                cmd.Parameters.AddWithValue("@Email", email);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        result = new User(dr.GetString(0), dr.GetString(1), dr.GetString(2), dr.GetString(3), dr.GetString(4), dr.GetString(5), dr.GetString(6).Split(' ').ToList<string>(), dr.GetString(7).Split(' ').ToList<string>(), dr.GetString(8).Split(' ').ToList<string>(),
                            dr.GetString(9).Split(' ').ToList<string>(), dr.GetString(10).Split(' ').ToList<string>());
                    }
                }
            }
            return result != null;
        }
        #endregion
        #region Contacts
        public string GetContacts() //Accepted
        {
            List<User> contacts = new List<User>();
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(@"SELECT * FROM Users U, 
UserContacts UC WHERE (UC.PrimaryEmailUser=@Email AND UC.PrimaryEmailContact=U.PrimaryEmail AND State='Accepted') OR (UC.PrimaryEmailUser=U.PrimaryEmail AND UC.PrimaryEmailContact=@Email AND State='Accepted')", conn);
                conn.Open();
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        contacts.Add(new User(dr.GetString(0), dr.GetString(1), dr.GetString(2), dr.GetString(3), dr.GetString(4), dr.GetString(5), dr.GetString(6).Split(' ').ToList<string>(), dr.GetString(7).Split(' ').ToList<string>(), dr.GetString(8).Split(' ').ToList<string>(),
                            dr.GetString(9).Split(' ').ToList<string>(), dr.GetString(10).Split(' ').ToList<string>()));
                    }
                }
            }
            return new JavaScriptSerializer().Serialize(contacts);
        }
        public string GetRequest() //Rejected and Send
        {
            return new JavaScriptSerializer().Serialize(GetRequestsUni(@"SELECT UC.PrimaryEmailUser, UC.PrimaryEmailContact, U.Name, UC.State FROM Users U, UserContacts UC 
WHERE UC.PrimaryEmailUser=@Email AND UC.PrimaryEmailContact=U.PrimaryEmail AND (State='Sent' OR State='Rejected')"));
        }
        public void AcceptRequest(string emailcontact)
        {
            Accept_Reject_Contacts(@"UPDATE UserContacts SET State='Accepted' WHERE PrimaryEmailUser=@Email AND PrimaryEmailContact=@Contact", @"UPDATE UserContacts
SET State='Accepted' WHERE PrimaryEmailUser=@Contact AND PrimaryEmailContact=@Email", emailcontact);
        }
        public void RejectRequest(string emailcontact)
        {
            Accept_Reject_Contacts(@"UPDATE UserContacts SET State='Rejected' WHERE PrimaryEmailUser=@Email AND PrimaryEmailContact=@Contact",@"UPDATE UserContacts
SET State='Rejected' WHERE PrimaryEmailUser=@Contact AND PrimaryEmailContact=@Email",emailcontact);
        }
        private void Accept_Reject_Contacts(string sqlcom,string sqlcom2,string contact)
        {
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(sqlcom, conn);
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                cmd.Parameters.AddWithValue("@Contact", contact);
                conn.Open();
                cmd.ExecuteNonQuery();
                var cmd2 = new SqlCommand(sqlcom2, conn);
                cmd2.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                cmd2.Parameters.AddWithValue("@Contact", contact);
                cmd2.ExecuteNonQuery();
            }
        }
        public string GetMyRequests()
        {
            return new JavaScriptSerializer().Serialize(GetRequestsUni(@"SELECT UC.PrimaryEmailUser, UC.PrimaryEmailContact, U.Name, UC.State FROM Users U, UserContacts UC
WHERE UC.PrimaryEmailUser=U.PrimaryEmail AND UC.PrimaryEmailContact=@Email AND State='Sent'"));
        }
        private Contact[] GetRequestsUni(string sqlcom)
        {
            List<Contact> contacts = new List<Contact>();
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(sqlcom, conn);
                conn.Open();
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        contacts.Add(new Contact(dr.GetString(0), dr.GetString(1), dr.GetString(2), dr.GetString(3)));
                    }
                }
            }
            return contacts.ToArray();
        }
        public void AddContact(string email)
        {
            Delete_Add_Contact(@"INSERT INTO UserContacts VALUES (@PrimaryUser,@PrimaryContact,'Sent')", email);
            AddNotify(email, 2, Request.Cookies["Preferences"]["Email"]);
        }
        public void DeleteContact(string email)
        {
            Delete_Add_Contact(@"DELETE FROM UserContacts WHERE (PrimaryEmailUser=@PrimaryUser AND PrimaryEmailContact=@PrimaryContact) 
OR (PrimaryEmailUser=@PrimaryContact AND PrimaryEmailContact=@PrimaryUser)", email); //добавить проверку на статус и сделать обратку
            AddNotify(email, 3, Request.Cookies["Preferences"]["Email"]);
        }
        public void Delete_Add_Contact(string sqlcom, string email)
        {
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(sqlcom, conn);
                cmd.Parameters.AddWithValue("@PrimaryUser", Request.Cookies["Preferences"]["Email"]);
                cmd.Parameters.AddWithValue("@PrimaryContact", email);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
        public void InviteContact(string email)
        {
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(@"INSERT INTO Invites VALUES (@PrimaryUser,@InvitedContact)", conn);
                cmd.Parameters.AddWithValue("@PrimaryUser", Request.Cookies["Preferences"]["Email"]);
                cmd.Parameters.AddWithValue("@InvitedContact", email);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
            Configuration config = WebConfigurationManager.OpenWebConfiguration(Request.ApplicationPath);
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(config.AppSettings.Settings["MailBoxEmail"].Value, config.AppSettings.Settings["MailBoxPassword"].Value);
            client.EnableSsl = true;
            client.Timeout = 3000;
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(config.AppSettings.Settings["MailBoxEmail"].Value);
            mail.Subject = "Invitation to the Korgie!!!";
            mail.Body = "Hi there!\n" + Request.Cookies["Preferences"]["Email"] + " has invited you to join the new web-organizer Korgie!\nFollow the link www.korgie.net to sign up =)";
            mail.To.Add(new MailAddress(email));
            client.Send(mail);
        }
        public bool IsInvited(string email)
        {
            bool result = false;
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(@"SELECT * FROM Invites WHERE InvitedEmailUser=@Email", conn);
                cmd.Parameters.AddWithValue("@Email", email);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        result = true;
                    }
                }
            }
            return result;
        }
        #endregion
        #region Notifications
        private void AddNotify(string user,int type,string data)
        {
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                if (GetNotificationsUNI().Count>50) //Проверка на количество оповещений, чтобы не было больше 50
                {
                    var cmd2 = new SqlCommand(@"DELETE FROM Notifications WHERE UserEmail=@Email AND Date=Min(Date)",conn);
                    cmd2.Parameters.AddWithValue("@Email", user);
                    cmd2.ExecuteNonQuery();
                }
                var cmd = new SqlCommand(@"INSERT INTO Notifications VALUES (@User,@Type,'True',@Data,@Date)", conn);
                cmd.Parameters.AddWithValue("@User", user);
                cmd.Parameters.AddWithValue("@Type", type);
                cmd.Parameters.AddWithValue("@Data", data);
                cmd.Parameters.AddWithValue("@Date", DateTime.UtcNow);
                cmd.ExecuteNonQuery();
            }
        }
        public void CheckNotify(int id)
        {
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(@"UPDATE Notifications SET Actual='False' WHERE NotId=@Id", conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.ExecuteNonQuery();
            }
        }
        public string GetNotifications()
        {
            //GetEventsUNI("@SELECT * FROM Events WHERE DATEPART(dayofyear,Start)-5=DATEPART(dayofyear")
            return new JavaScriptSerializer().Serialize(GetNotificationsUNI().ToArray());
        }
        public List<Notifications> GetNotificationsUNI()
        {
            List<Notifications> notifications = new List<Notifications>();
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(@"SELECT * FROM Notifications WHERE UserEmail=@Email", conn);
                conn.Open();
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        notifications.Add(new Notifications(dr.GetInt32(0), dr.GetString(1), dr.GetInt32(2), Convert.ToBoolean(dr.GetString(3)), dr.GetString(4), dr.GetDateTime(5)));
                    }
                }
            }
            return notifications;
        }
        #endregion
    }
}