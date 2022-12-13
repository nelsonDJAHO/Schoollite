# procedure d envoie d email par le canal gmail
import imghdr
import os
import smtplib
import urllib
from datetime import date, datetime
from email.message import EmailMessage
from email.utils import formataddr
import requests
from asgiref.sync import sync_to_async
import asyncio
import threading
from main.models import *


# Check if internet is working
def CheckInternet():
    url = 'http://google.com'
    timeoute = 5
    response = ""
    try:
        urllib.request.urlopen(url)  # Python 3.x
        return True
    except:
        return False


# Send gmail email to persons
class send_Gmail_Email_To_People(threading.Thread):
    def __init__(self, messageId):
        self.messageId = messageId
        threading.Thread.__init__(self)

    def run(self):
        # Recuperer les informations du message a envoyer
        messageToSend = Message.objects.get(id=self.messageId)
        school = School.objects.get(id=messageToSend.School_id)
        emailSubject = messageToSend.messageSubject
        emailText = messageToSend.messageText

        # Declarations globales
        tutorsHasAlreadyMailedList = []  # liste des emails  des personnes deja contactees
        tutorsNotYetMailed = []  # Liste des email des personnes a contacter

        # verification des parametres de connexion gmail
        gmailsetting = GmailSetting.objects.get(School_id=messageToSend.School_id)

        # Recuperer la liste des personnes deja contactees
        if MessageRecieverDetails.objects.filter(Message_id=messageToSend.id).exists():
            for user in MessageRecieverDetails.objects.filter(Message_id=messageToSend.id,
                                                              messageStatus__exact='Envoyé'):
                tutorsHasAlreadyMailedList.append(user.messageRecieverId.email)

        # Conteneur des emails des tuteurs si des tuteurs sont lies aux apprennants
        for user in MessageRecieverDetails.objects.filter(Message_id=messageToSend.id,
                                                          messageStatus__exact='En attente'):
            if user.messageRecieverId.email and user.messageRecieverId.email not in tutorsHasAlreadyMailedList:
                tutorsNotYetMailed.append(user.messageRecieverId.email)

        # Si la connexion intenet est disponible envoyer les mails
        if CheckInternet():
            # Si des email sont dispoibles envoyer les mails
            if tutorsNotYetMailed:
                print("Envoi d email en cours")

                for email in tutorsNotYetMailed:
                    # Changer l etat d envoi de l email
                    msgtsend = Message.objects.get(id=self.messageId)
                    msgtsend.messageStatus = "En cours"
                    msgtsend.save()

                    # Si l email n a pas deja ete notifie alos effectuer l envoi
                    if email not in tutorsHasAlreadyMailedList:
                        reciever = User.objects.get(email__exact=email)
                        msg = EmailMessage()
                        msg['Subject'] = emailSubject
                        msg['From'] = formataddr((school.denomination, f"{gmailsetting.loginEmail}"))
                        msg['To'] = email
                        # msg['BCC'] = senderEmail
                        msg.set_content(
                            f"""\
                                <html lang="en">
                                    <head>
                                        {emailText}
                                    </head>
                                    <body>
                                </html>
                            """,
                            subtype='html'
                        )

                        # Si il existe des fichiers attaches au mail
                        if MessageAttachedFile.objects.filter(Message_id=self.messageId).exists():
                            for item in MessageAttachedFile.objects.filter(Message_id=self.messageId):
                                with open(os.path.abspath(item.file.path), 'rb') as file:
                                    file_data = file.read()
                                    file_type = imghdr.what(file.name)
                                    file_name = file.name
                                    if 'application' in item.fileType:
                                        msg.add_attachment(file_data, maintype='application', subtype='octet-stream',
                                                           filename=file_name)
                                    elif 'image' in item.fileType:
                                        msg.add_attachment(file_data, maintype='image', subtype=file_type,
                                                           filename=file_name)

                        # Envoyer le mail
                        try:
                            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                                smtp.login(gmailsetting.loginEmail, gmailsetting.loginPassword)
                                smtp.send_message(msg)

                                # Enregistrer les information de la personne ayant ete notifiee
                                # Enregistres les beneficiaires de l email
                                MessageRecieverDetails.objects.create(Message_id=self.messageId,
                                                                      School_id=messageToSend.School_id,
                                                                      AcademicYear_id=messageToSend.AcademicYear_id,
                                                                      messageRecieverId_id=reciever.id,
                                                                      messageSubject=messageToSend.messageSubject,
                                                                      messageText=messageToSend.messageText,
                                                                      messageDate=date.today(),
                                                                      messageHour=datetime.now(),
                                                                      messageProvider="GMAIL",
                                                                      messageStatus="Envoyé")
                            # Ajouter l email a la liste des personnes ayant deja ete notifies
                            tutorsHasAlreadyMailedList.append(email)
                            # Changer l etat d envoi de l email
                            msgtsend.messageStatus = "Message envoyé"
                            msgtsend.report = "Message envoyé"
                            msgtsend.save()
                        except:
                            msgtsend.messageStatus = "Message non envoyé"
                            msgtsend.report = "Impossible de se connecter au compte Gmail"
                            msgtsend.save()
                            break
                print("Email envoyé")
            else:  # Aucun email  trouve
                # Changer l etat d envoi de l email
                msgtsend = Message.objects.get(id=self.messageId)
                msgtsend.messageStatus = "Message non envoyé"
                msgtsend.report = "Annulé (Tuteur non trouvé)"
                msgtsend.save()


# Send sms zedeka to people
class send_SmsZedeka_Sms_To_People(threading.Thread):
    def __init__(self, messageId):
        self.messageId = messageId
        threading.Thread.__init__(self)

    def run(self):
        # Recuperation des informations du message a envoyer
        messageToSend = Message.objects.get(id=self.messageId)
        school = School.objects.get(id=messageToSend.School_id)
        smsSubject = messageToSend.messageSubject
        smsText = messageToSend.messageText
        classes = MessageClasseConcerned.objects.filter(Message_id=self.messageId)

        # Declarations globales
        tutorsHasAlreadySmsedList = []  # Liste des numeros des personnes deja contactes
        tutorsphoneNumbersNotYetSms = []  # Liste des numeros des personnes pas encore contatees

        # recuperation des parametres de connexion a sms zedeka
        smszedekasetting = SmsZedekaSetting.objects.get(School_id=messageToSend.School_id)

        # Recuperer la liste des personnes deja notifiees
        tutorsHasAlreadySmsedList = []
        if MessageRecieverDetails.objects.filter(Message_id=messageToSend.id).exists():
            for user in MessageRecieverDetails.objects.filter(Message_id=messageToSend.id,
                                                              messageStatus__exact='Envoyé'):
                tutorsHasAlreadySmsedList.append(user.messageRecieverId.phoneNumber)

        # Conteneur des emails des tuteurs si des tuteurs sont lies aux apprennants
        for user in MessageRecieverDetails.objects.filter(Message_id=messageToSend.id,
                                                          messageStatus__exact='En attente'):
            if user.messageRecieverId.phoneNumber and user.messageRecieverId.phoneNumber not in tutorsHasAlreadySmsedList:
                tutorsphoneNumbersNotYetSms.append(user.messageRecieverId.phoneNumber)

        # Si la connexion intenet est disponible envoyer les sms
        if CheckInternet():
            # Si des email sont disponibles envoyer les sms
            if tutorsphoneNumbersNotYetSms:
                print("Envoi d sms en cours")
                # Changer l etat d envoi du sms
                msgtsend = Message.objects.get(id=self.messageId)
                msgtsend.messageStatus = "En cours"
                msgtsend.save()
                for phoneNumber in tutorsphoneNumbersNotYetSms:
                    # Si l email n a pas deja ete notifie alos effectuer l envoi
                    if phoneNumber not in tutorsHasAlreadySmsedList:
                        reciever = User.objects.get(phoneNumber__exact=phoneNumber)
                        apiUrl = 'https://extranet.nghcorp.net/api/send-sms'
                        data = {"from": smszedekasetting.senderId,
                                "to": phoneNumber,
                                "text": smsText,
                                "reference": 1212,
                                "api_key": smszedekasetting.APIkey,
                                "api_secret": smszedekasetting.clientId}
                        try:
                            r = requests.post(url=apiUrl, json=data)
                            print(r.text)
                            print(r)
                            # Enregistres les beneficiaires de l email
                            MessageRecieverDetails.objects.create(Message_id=self.messageId,
                                                                  School_id=messageToSend.School_id,
                                                                  AcademicYear_id=messageToSend.AcademicYear_id,
                                                                  messageRecieverId_id=reciever.id,
                                                                  messageSubject=messageToSend.messageSubject,
                                                                  messageText=messageToSend.messageText,
                                                                  messageDate=date.today(),
                                                                  messageHour=datetime.now(),
                                                                  messageProvider="Sms Zedeka",
                                                                  messageStatus="Envoyé")
                            # Ajouter l email a la liste des personnes ayant deja ete notifies
                            tutorsHasAlreadySmsedList.append(phoneNumber)
                            # Changer l etat d envoi de l sms
                            msgtsend.messageStatus = "Envoyé"
                            msgtsend.report = "Envoyé"
                            msgtsend.save()
                        except:
                            msgtsend.messageStatus = "Message non envoyé"
                            msgtsend.report = "Impossible de se connecter a l'api"
                            msgtsend.save()
            else:  # Aucun numero  trouve
                # Changer l etat d envoi de l email
                msgtsend = Message.objects.get(id=self.messageId)
                msgtsend.messageStatus = "Annulé (Tuteur non trouvé)"
                msgtsend.save()
