using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Korgie.Models;
using System.Threading.Tasks;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Korgie.Controllers
{
    public class KorgieUserValidator<TUser> : UserValidator<TUser, string>
        where TUser : ApplicationUser
    {
        public KorgieUserValidator(UserManager<TUser, string> manager) : base(manager)
        {
            this.Manager = manager;
        }

        public UserManager<TUser, string> Manager { get; set; }

        /// <summary>
        ///     Validates a user before saving
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public override async Task<IdentityResult> ValidateAsync(TUser item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            var errors = new List<string>();
            await ValidateUserName(item, errors);
            //if (RequireUniqueEmail)
            //{
            //    await ValidateEmail(item, errors);
            //}
            if (errors.Count > 0)
            {
                return IdentityResult.Failed(errors.ToArray());
            }
            return IdentityResult.Success;
        }

        private async Task ValidateUserName(TUser user, List<string> errors)
        {
            if (string.IsNullOrWhiteSpace(user.UserName))
            {
                errors.Add(String.Format(CultureInfo.CurrentCulture, "Name"));
            }
            else if (!Regex.IsMatch(user.UserName, @"^[a-zа-яА-ЯA-Z0-9іІїЇєЄёЁ@_\.\s]+$"))
            {
                // If any characters are not letters or digits, its an illegal user name
                errors.Add(String.Format(CultureInfo.CurrentCulture, user.UserName));
            }
            //else
            //{
            //    var owner = await Manager.FindByNameAsync(user.UserName);
            //    if (owner != null && !EqualityComparer<string>.Default.Equals(owner.Id, user.Id))
            //    {
            //        errors.Add(String.Format(CultureInfo.CurrentCulture, user.UserName));
            //    }
            //}
        }

        // make sure email is not empty, valid, and unique
        //private async Task ValidateEmail(TUser user, List<string> errors)
        //{
        //    if (!user.Email.IsNullOrWhiteSpace())
        //    {
        //        if (string.IsNullOrWhiteSpace(user.Email))
        //        {
        //            errors.Add(String.Format(CultureInfo.CurrentCulture, "Email"));
        //            return;
        //        }
        //        try
        //        {
        //            var m = new MailAddress(user.Email);
        //        }
        //        catch (FormatException)
        //        {
        //            errors.Add(String.Format(CultureInfo.CurrentCulture, email));
        //            return;
        //        }
        //    }
        //    var owner = await Manager.FindByEmailAsync(user.Email);
        //    if (owner != null && !EqualityComparer<string>.Default.Equals(owner.Id, user.Id))
        //    {
        //        errors.Add(String.Format(CultureInfo.CurrentCulture, email));
        //    }
        //}
    }
}