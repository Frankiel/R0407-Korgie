using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Korgie.Startup))]
namespace Korgie
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}