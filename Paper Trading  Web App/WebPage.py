import requests;
from bs4 import BeautifulSoup;
 
class WebScrape():
    def __init__(self, link):
        self.link = link;
    def findClass(self, className):
        page = requests.get(self.link);
        soup = BeautifulSoup(page.text, 'html.parser');
        names = soup.findAll(class_= className);
        for name in names:
            cleanName = name.get_text();
            final = "";
            final += cleanName;
        return final;

paperTrade = WebScrape("https://monumental-lily-aeef47.netlify.app/").findClass("account");
yahoo = WebScrape("https://finance.yahoo.com/quote/AAPL?p=AAPL&.tsrc=fin-srch").findClass("C($primaryColor) Fz(24px) Fw(b)");
print(paperTrade)
 

