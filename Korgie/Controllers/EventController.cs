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
        const string _connection = "Server=tcp:ivqgu1eln8.database.windows.net,1433;Database=korgie_db_2015-12-13T23-44Z;User ID=frankiel@ivqgu1eln8;Password=Helloworld123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        // GET: Event
        public ActionResult Index() // Проверка залогинен ли пользователь или нет
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
            return View();
        }
        //Регион Events и TODO
        #region EventsAndTODO
        public string GetMonthEvents(int month, int year) //Получение месячных евентов
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events E, UserEvents UE,Users U WHERE MONTH(E.Start)=@Value1 AND YEAR(E.Start)=@Value2
AND E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", month, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetMonthTodo(int month, int year) // Получение месячных TODO
        {
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo TD,UserTodo UTD,Users U WHERE MONTH(TD.Start)=@Value1 And YEAR(TD.Start)=@Value2
AND TD.Todoid=UTD.Todoid AND UTD.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", month, year);
            return new JavaScriptSerializer().Serialize(todoStub);
        }
        public string GetWeekEvents(int week, int year) // Получение недельных евентов
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events E, Users U, UserEvents UE WHERE DATEPART(iso_week,E.Start)=@Value1 AND YEAR(E.Start)=@Value2 AND
E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail and U.PrimaryEmail=@Email", week, year);
            return new JavaScriptSerializer().Serialize(eventsStub);
        }
        public string GetWeekTodo(int week, int year) // Получение недельных TODO
        {
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo TD,UserToDo UTD,Users U WHERE DATEPART(iso_week,TD.Start)=@Value1 AND YEAR(TD.Start)=@Value2 AND
TD.Todoid=UTD.Todoid and UTD.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email", week, year);
            return new JavaScriptSerializer().Serialize(todoStub);
        }
        public int SaveTodo(int TodoId, string Title, DateTime Start, string Color, string Description, bool[] States, string[] Tasks) // Сохранение и редактирование TODO
        {
            Todo[] todoStub = GetTodoUNI(@"SELECT * FROM ToDo WHERE Todoid=@Value1", TodoId); //Проверка на наличие туду листов, есть - редактируем, нет - создаем
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

                if (todoStub.Length == 0) // Если нет, так же создаем связь пользователя с этим TODO
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
                    var cmd3 = new SqlCommand(@"SELECT MAX(TodoId) FROM ToDo", conn);
                    using (SqlDataReader dr = cmd3.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                    {
                        while (dr.Read())
                        {
                            toreturn = dr.GetInt32(0);
                }
                    }
                }
                else // Если есть
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
        public int SaveEvents(int EventId, string Title, DateTime Start, string Type, string Description, int Period, int Days, string Tags, string[] attached,int Notify) // Сохранение и редактирование Events
        {
            Event[] eventsStub = GetEventsUNI(@"SELECT * FROM Events WHERE EventId=@Value1", EventId); // Проверка на наличие евента, если есть - редактируем, нет  - создаем
            int toreturn = -1;
            using (var conn = new SqlConnection(_connection))
            {
                if (eventsStub.Length == 0) // Если нет создаем евент и связываем с ним пользователя
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
                else // Если если редактируем существующий евент
                {
                    var cmd = new SqlCommand(@"UPDATE Events SET Title=@Title, Start=@Start, Type=@Type, Description=@Description, Period=@Period, Days=@Days, 
Tags=@Tags, Notify=@Notify WHERE EventId=@EventId", conn);
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
                    var cmd3 = new SqlCommand(@"INSERT INTO UserEvents Values (@Email,@Id)", conn); // Подпись участников на евент
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
        public void DeleteEvents(int id) // Удаление евентов, если удаляет создатель евента, то отписывает от них всех пользователь, если подписавшийся, то он просто отписывается
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
        public void DeleteTodo(int id) // Удаление TODO
        {
            Delete_Todo_Events_UNI(@"DELETE FROM UserTodo WHERE TodoId=@Id AND PrimaryEmail=@Email", @"DELETE FROM ToDo WHERE Todoid=@Id", id);
        }
        public void Delete_Todo_Events_UNI(string sqlcom,string sqlcom2,int id) // Универсальный метод для удаление TODO и Events
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
        private Event[] GetEventsUNI(string sqlcommand, int value1 = 0, int value2 = 0, int id = 0) // Универсальный метод для получения евентов
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
                cmd.Parameters.AddWithValue("@Start", DateTime.UtcNow);
                using (SqlDataReader dr = cmd.ExecuteReader(System.Data.CommandBehavior.CloseConnection))
                {
                    while (dr.Read())
                    {
                        events.Add(new Event(dr.GetInt32(0), dr.GetString(1), dr.GetDateTime(2), dr.GetString(3), dr.GetString(4),
                            dr.GetInt32(5), dr.GetString(7), dr.GetString(8), dr.GetInt32(9)));
                    }
                }
            }
            return events.ToArray();
        }
        public string GetEventContacts(int id) // Получение подписавшихся на евент
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
        private Todo[] GetTodoUNI(string sqlcommand, int value1 = 0, int value2 = 0) // Унивесальный метод получения TODO листов
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
        //Регион работы с профилем
        #region Profile
        public string GetProfileInfo() // Получение информации о пользователе
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
            string City, string[] Sport, string[] Work, string[] Rest, string[] Study, string[] Additional) // Метод редактирования профиля
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
        public bool IsUser(string email) // Проверка наличия пользователя в системе
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
        //Регион работы с контактами
        #region Contacts
        public string GetContacts() // Получение контактов, которые приняли предложения дружбы
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
        public string GetRequest() //Получение отправленных запросов и запросов, которые были отклонены
        {
            return new JavaScriptSerializer().Serialize(GetRequestsUni(@"SELECT UC.PrimaryEmailUser, UC.PrimaryEmailContact, U.Name, UC.State FROM Users U, UserContacts UC 
WHERE UC.PrimaryEmailUser=@Email AND UC.PrimaryEmailContact=U.PrimaryEmail AND (State='Sent' OR State='Rejected')"));
        }
        public void AcceptRequest(string emailcontact) // Метод принятия запроса на дружбу
        {
            Accept_Reject_Contacts(@"UPDATE UserContacts SET State='Accepted' WHERE PrimaryEmailUser=@Email AND PrimaryEmailContact=@Contact", @"UPDATE UserContacts
SET State='Accepted' WHERE PrimaryEmailUser=@Contact AND PrimaryEmailContact=@Email", emailcontact);
        }
        public void RejectRequest(string emailcontact) // Метод, чтобы отклонить запрос на дружбу
        {
            Accept_Reject_Contacts(@"UPDATE UserContacts SET State='Rejected' WHERE PrimaryEmailUser=@Email AND PrimaryEmailContact=@Contact",@"UPDATE UserContacts
SET State='Rejected' WHERE PrimaryEmailUser=@Contact AND PrimaryEmailContact=@Email",emailcontact);
        }
        private void Accept_Reject_Contacts(string sqlcom,string sqlcom2,string contact) //Универсальный метод принятия и отклонения запроса на дружбу
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
        public string GetMyRequests() //Получить запросы дружбы для пользователя
        {
            return new JavaScriptSerializer().Serialize(GetRequestsUni(@"SELECT UC.PrimaryEmailUser, UC.PrimaryEmailContact, U.Name, UC.State FROM Users U, UserContacts UC
WHERE UC.PrimaryEmailUser=U.PrimaryEmail AND UC.PrimaryEmailContact=@Email AND State='Sent'"));
        }
        private Contact[] GetRequestsUni(string sqlcom) // Универсальный метод получения запросов
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
        public void AddContact(string email) // Метод добавления в контакты
        {
            Delete_Add_Contact(@"DELETE FROM UserContacts WHERE (PrimaryEmailUser=@PrimaryUser AND PrimaryEmailContact=@PrimaryContact) 
OR (PrimaryEmailUser=@PrimaryContact AND PrimaryEmailContact=@PrimaryUser)", email);
            Delete_Add_Contact(@"INSERT INTO UserContacts VALUES (@PrimaryUser,@PrimaryContact,'Sent')", email);
            AddNotify(email, 2, Request.Cookies["Preferences"]["Email"], "True"); //Отправка нотификации о добавлении
        }
        public void DeleteContact(string email) //Метод удаления контакта
        {
            Delete_Add_Contact(@"DELETE FROM UserContacts WHERE (PrimaryEmailUser=@PrimaryUser AND PrimaryEmailContact=@PrimaryContact) 
OR (PrimaryEmailUser=@PrimaryContact AND PrimaryEmailContact=@PrimaryUser)", email); //добавить проверку на статус и сделать обратку
            AddNotify(email, 3, Request.Cookies["Preferences"]["Email"], "True"); //Отправка нотификации об удалении
        }
        public void Delete_Add_Contact(string sqlcom, string email) //Универсальный метод добавления и удаления контакта
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
        public void InviteContact(string email) //Приглашение в приложение (через почту) и добавление в контакты
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
        public bool IsInvited(string email) //Проверка приглашен ли пользователь в систему или нет, чтобы избежать лишних сообщених об приглашении (флуда)
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
        //Регион работы с нотификациями
        #region Notifications
        private void AddNotify(string user,int type,string data,string actual) //Добавление нотификации в БД
        {
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                if (GetNotificationsUNI(@"SELECT * FROM Notifications WHERE UserEmail=@Email").Count>50) //Проверка на количество оповещений, чтобы не было больше 50
                {
                    var cmd2 = new SqlCommand(@"DELETE FROM Notifications WHERE UserEmail=@Email AND Actual='False' AND Date=Min(Date)",conn);
                    cmd2.Parameters.AddWithValue("@Email", user);
                    cmd2.ExecuteNonQuery();
                }
                var cmd = new SqlCommand(@"INSERT INTO Notifications VALUES (@User,@Type,@Actual,@Data,@Date)", conn);
                cmd.Parameters.AddWithValue("@User", user);
                cmd.Parameters.AddWithValue("@Type", type);
                cmd.Parameters.AddWithValue("@Actual", actual);
                cmd.Parameters.AddWithValue("@Data", data);
                cmd.Parameters.AddWithValue("@Date", DateTime.UtcNow);
                cmd.ExecuteNonQuery();
            }
        }
        public void CheckNotify(int id) //Изменение актуальности нотификации (прочитал ее пользователь или нет)
        {
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(@"UPDATE Notifications SET Actual='False' WHERE NotId=@Id", conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.ExecuteNonQuery();
            }
        }
        public string GetNotifications() //Получение нотификаций, также добавление нотификаций об евентах о котрых нужно предупредить заранее (устанавливается при добавлении евента)
        {
            //Получение всех евентов о которых нужно уведомить и перезапись всех нотификаций об евентов (учитывая их актуальность)
            Event[] events=GetEventsUNI(@"SELECT * FROM Events E, UserEvents UE,Users U WHERE DATEPART(dayofyear,Start)-Notify<=DATEPART(dayofyear,@Start) AND DATEPART(dayofyear, @Start) <= DATEPART(dayofyear, Start) AND YEAR(Start)=YEAR(@Start) AND E.EventId=UE.EventId AND UE.PrimaryEmail=U.PrimaryEmail AND U.PrimaryEmail=@Email");
            List<Notifications> oldnotify = GetNotificationsUNI(@"SELECT * FROM Notifications WHERE Type=1 AND UserEmail=@Email");
            using (var conn = new SqlConnection(_connection))
            {
                conn.Open();
                var cmd = new SqlCommand(@"DELETE FROM Notifications WHERE Type=1 AND UserEmail=@Email", conn);
                cmd.Parameters.AddWithValue("@Email", Request.Cookies["Preferences"]["Email"]);
                cmd.ExecuteNonQuery();
            }
            bool check = false;
            for (int i=0;i<events.Length;i++)
            {
                check = false;
                for (int j=0;j<oldnotify.Count;j++)
                {
                    if (events[i].Title == oldnotify[j].Data.Split('~')[0] && oldnotify[j].Data.Split('~')[1] == events[i].Start.ToString("dd.MM.yyyy"))
                    {
                        AddNotify(Request.Cookies["Preferences"]["Email"], 1, events[i].Title + "~" + events[i].Start.ToString("dd.MM.yyyy"), oldnotify[j].Actual.ToString());
                        check = true;
                    }
                }
                if (!check)
                {
                    AddNotify(Request.Cookies["Preferences"]["Email"], 1, events[i].Title + "~" + events[i].Start.ToString("dd.MM.yyyy"), "True");
                }
            }
            return new JavaScriptSerializer().Serialize(GetNotificationsUNI(@"SELECT * FROM Notifications WHERE UserEmail=@Email").ToArray());
        }
        public List<Notifications> GetNotificationsUNI(string sqlcom) //Универсальный метод получения нотификаций
        {
            List<Notifications> notifications = new List<Notifications>();
            using (var conn = new SqlConnection(_connection))
            {
                var cmd = new SqlCommand(sqlcom, conn);
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
        public bool CheckActualNotify() //Проверка есть ли актуальные нотификация у пользователя или нет
        {
            List<Notifications> tocheck = GetNotificationsUNI(@"SELECT * FROM Notifications WHERE UserEmail=@Email");
            for (int i = 0; i < tocheck.Count; i++)
            {
                if (tocheck[i].Actual)
                {
                    return true;
                }
            }
            return false;
        }
        #endregion
    }
}