using System;
using System.IO;
using System.Net;
using System.Web;

class Program
{
    static void Main(string[] args)
    {
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:8080/");
        listener.Start();
        while (true)
        {
            HttpListenerContext context = listener.GetContext();
            HttpListenerRequest request = context.Request;
            if (request.HttpMethod == "POST")
            {
                // Read the request data from the input stream
                StreamReader reader = new StreamReader(request.InputStream);
                string data = reader.ReadToEnd();
                Console.WriteLine("Received POST request with data: " + data);
            }
            else
            {
                Console.WriteLine("Received non-POST request");
            }

            HttpListenerResponse response = context.Response;
            response.StatusCode = 200;
            response.Close();
        }
    }
}