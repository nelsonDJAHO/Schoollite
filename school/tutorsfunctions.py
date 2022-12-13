import imghdr
import os
import smtplib
from email.utils import formataddr

from main.models import *
from datetime import date, datetime
import threading
from .functions import CheckInternet
from email.message import EmailMessage
import requests
from django.db import transaction, IntegrityError
from .functions import send_Gmail_Email_To_People, send_SmsZedeka_Sms_To_People


def handle_uploaded_file(path, file):
    lock = threading.Lock()
    # with lock
    with open(path + file.name, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
            destination.close()


def ReferenceMaker(sigle):
    time = datetime.now()
    datepart = str(date.today().year) + str(date.today().month) + str(date.today().day)
    reference = sigle + str(datepart) + "-" + str(time.strftime("%H%M%S"))
    return reference


# Enregistrer toutes les donnees concernant les emails a  envoyer aux tuteurs
class saveTutorEmailByClassStufs(threading.Thread):
    def __init__(self, messageId):
        self.messageId = messageId
        threading.Thread.__init__(self)

    def run(self):
        # Recuperation des informations du message a envoyer
        messageToSend = Message.objects.get(id=self.messageId)
        classes = MessageClasseConcerned.objects.filter(Message_id=self.messageId)

        # Parcourir et enregistrer les tuteurs a contacter
        for classe in classes:
            for student in Inscription.objects.filter(Classe_id=classe.Classe.id, AcademicYear_id=messageToSend.AcademicYear):
                for tutor in TutorAffiliationFeaturing.objects.filter(Student_id=student.Student_id):
                    if tutor.Tutor.email:
                        MessageRecieverDetails.objects.create(Message_id=messageToSend.id,
                                                              School_id=messageToSend.School_id,
                                                              AcademicYear_id=messageToSend.AcademicYear_id,
                                                              messageRecieverId_id=tutor.Tutor.id,
                                                              messageSubject=messageToSend.messageSubject,
                                                              messageText=messageToSend.messageText,
                                                              messageDate=messageToSend.messageDate,
                                                              messageHour=messageToSend.messageHour,
                                                              messageProvider=messageToSend.messageProvider,
                                                              messageStatus='En attente')

        # Envoyer les mails
        if CheckInternet():
            print('envoi email')
            if messageToSend.messageProvider == "Gmail":
                print('Gmail')
                send_Gmail_Email_To_People(messageToSend.id).start()
# Fin envoi des emails aux tuteurs


# procedure de sauvegardes des messages sms
class saveTutorSmsByClassStufs(threading.Thread):
    def __init__(self, messageId):
        self.messageId = messageId
        threading.Thread.__init__(self)

    def run(self):
        # Recuperation des informations du message a envoyer
        messageToSend = Message.objects.get(id=self.messageId)
        classes = MessageClasseConcerned.objects.filter(Message_id=self.messageId)
        # Parcourir et enregistrer les tuteurs a contacter
        for classe in classes:
            for student in Inscription.objects.filter(Classe_id=classe.Classe.id, AcademicYear_id=messageToSend.AcademicYear):
                for tutor in TutorAffiliationFeaturing.objects.filter(Student_id=student.Student_id):
                    if tutor.Tutor.phoneNumber:
                        MessageRecieverDetails.objects.create(Message_id=messageToSend.id,
                                                              School_id=messageToSend.School_id,
                                                              AcademicYear_id=messageToSend.AcademicYear_id,
                                                              messageRecieverId_id=tutor.Tutor.id,
                                                              messageSubject=messageToSend.messageSubject,
                                                              messageText=messageToSend.messageText,
                                                              messageDate=messageToSend.messageDate,
                                                              messageHour=messageToSend.messageHour,
                                                              messageProvider=messageToSend.messageProvider,
                                                              messageStatus='En attente')
        # Envoyer les sms
        if CheckInternet():
            print('Envoi du sms')
            if messageToSend.provider == "SMS Zedeka":
                send_SmsZedeka_Sms_To_People(messageToSend.id).start()


# Fin enregistrement des details d un sms destine aux tuteurs


