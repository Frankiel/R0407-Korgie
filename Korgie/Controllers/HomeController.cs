using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Korgie.Models;

namespace Korgie.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home - it's place for home page! There will be login form and sign up form
        public ActionResult Index(bool? isSignOut)
        {
            if (isSignOut != null)
            {
                Response.Cookies["Preferences"].Expires = DateTime.Now.AddDays(-1);
                return View();
            }
            HttpCookie cookie = Request.Cookies["Preferences"];
            if (cookie == null)
            {
                return View();
            }
            return RedirectToAction("Index", "Event"); //return main page if user didn't log in and calendar page if he is logged in
        }


    }
}