'''Mostly just sends confirmation emails'''

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email import Encoders
import os

gmail_user = "blackrockhologram@gmail.com"
gmail_pwd = "alcoholics$$$"

def mailConfirmation(user, request):
   msg = MIMEMultipart()

   msg['From'] = gmail_user
   msg['To'] = user.email
   msg['Subject'] = "Welcome to BRH!"
   msg.attach(MIMEText("""Welcome to Black Rock Hologram

We'll email you once in a while!
""".format(user.email, request.host)))
   
   mailServer = smtplib.SMTP("smtp.gmail.com", 587)
   mailServer.ehlo()
   mailServer.starttls()
   mailServer.ehlo()
   mailServer.login(gmail_user, gmail_pwd)
   mailServer.sendmail(gmail_user, user.email, msg.as_string())
   # Should be mailServer.quit(), but that crashes...
   mailServer.close()

