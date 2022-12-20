import uuid

from django.db import models


# Create your models here.

# L'etablissement
class MainSchool(models.Model):
    denomination = models.CharField(max_length=150, null=True, blank=True)
    sigle = models.CharField(max_length=150, null=True, blank=True)
    logo = models.ImageField(null=True, blank=True, upload_to="School/", default="yourlogo.png")
    phoneNumber = models.CharField(max_length=150, null=True, blank=True)
    phoneNumber1 = models.CharField(max_length=150, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    livingCountry = models.CharField(max_length=150, null=True, blank=True)
    livingTown = models.CharField(max_length=150, null=True, blank=True)
    address = models.CharField(max_length=150, null=True, blank=True)
    postBox = models.CharField(max_length=150)
    day1 = models.CharField(max_length=150, null=True, blank=True)
    duration1 = models.CharField(max_length=150, null=True, blank=True)
    day2 = models.CharField(max_length=150, null=True, blank=True)
    duration2 = models.CharField(max_length=150, null=True, blank=True)
    day3 = models.CharField(max_length=150, null=True, blank=True)
    duration3 = models.CharField(max_length=150, null=True, blank=True)
    day4 = models.CharField(max_length=150, null=True, blank=True)
    duration4 = models.CharField(max_length=150, null=True, blank=True)
    day5 = models.CharField(max_length=150, null=True, blank=True)
    duration5 = models.CharField(max_length=150, null=True, blank=True)
    day6 = models.CharField(max_length=150, null=True, blank=True)
    duration6 = models.CharField(max_length=150, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Les annexes
class School(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    denomination = models.CharField(max_length=150, null=True, blank=True)
    sigle = models.CharField(max_length=150, null=True, blank=True)
    phoneNumber = models.CharField(max_length=150, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    livingCountry = models.CharField(max_length=150, null=True, blank=True)
    livingTown = models.CharField(max_length=150, null=True, blank=True)
    address = models.CharField(max_length=150, null=True, blank=True)
    isActive = models.BooleanField(default=True)
    searchField = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Email settings
class EmailSetting(models.Model):
    # cles etrangeres
    School = models.ForeignKey(School, on_delete=models.CASCADE)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    provider = models.CharField(max_length=150)
    isActive = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Gmail settings
class GmailSetting(models.Model):
    # cles etrangeres
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    EmailSetting = models.ForeignKey(EmailSetting, on_delete=models.CASCADE)

    loginEmail = models.EmailField(max_length=30, null=True)
    loginPassword = models.CharField(max_length=150, null=True)


# Sms settings
class SmsSetting(models.Model):
    # cles etrangeres
    School = models.ForeignKey(School, on_delete=models.CASCADE)

    provider = models.CharField(max_length=150)
    isActive = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Sms zedeka settings
class SmsZedekaSetting(models.Model):
    # cles etrangeres
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    SmsSetting = models.ForeignKey(SmsSetting, on_delete=models.CASCADE)

    APIkey = models.CharField(max_length=150, null=True)
    clientId = models.CharField(max_length=150, null=True)
    senderId = models.CharField(max_length=150, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Twilio setti
class TwilioSettings(models.Model):
    # Cles etrangeres
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    SmsSetting = models.ForeignKey(SmsSetting, on_delete=models.CASCADE)

    smsNumber = models.CharField(max_length=150)
    accountSID = models.CharField(max_length=150)
    authToken = models.CharField(max_length=150)


# Les annees academiques
class AcademicYear(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    wording = models.CharField(max_length=150, null=True, blank=True, unique=True)
    startDate = models.DateField()
    endDate = models.DateField()
    isActive = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)

    class Meta:
        ordering = ('-createdAt',)


# Importations
class Importation(models.Model):
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    AcademicYear = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    importationfor = models.CharField(
        max_length=150)  # champs pour designer la raison de l importation Ex: salles de  classes
    file = models.FileField(upload_to="ImportationsFiles/")
    Date = models.DateField()
    Hour = models.TimeField()
    importationStatus = models.CharField(max_length=150)
    importationReport = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Importation reports
class ImportationReport(models.Model):
    Importation = models.ForeignKey(Importation, on_delete=models.CASCADE)

    value = models.CharField(max_length=150)
    report = models.TextField()


# User group
class UserGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    wording = models.CharField(max_length=150, null=True, blank=True, unique=True)
    searchField = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# User
class User(models.Model):
    # Cles etrangeres
    UserGroup = models.ForeignKey(UserGroup, on_delete=models.CASCADE, null=True, blank=True)
    Importation = models.ForeignKey(Importation, on_delete=models.CASCADE, null=True, blank=True)

    # Identité
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    matricule = models.CharField(max_length=150, null=True, blank=True, unique=True)
    lastName = models.CharField(max_length=150, null=True, blank=True)
    firstName = models.CharField(max_length=150, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    avatar = models.ImageField(upload_to="users/", default="avatar.png")
    # Naissance
    birthDate = models.DateField(null=True, blank=True)
    birthCountry = models.CharField(max_length=150, null=True, blank=True)
    birthTown = models.CharField(max_length=150, null=True, blank=True)
    nationality = models.CharField(max_length=150, null=True, blank=True)
    # Localisation
    livingCountry = models.CharField(max_length=150, null=True, blank=True)
    livingTown = models.CharField(max_length=150, null=True, blank=True)
    address = models.CharField(max_length=150, null=True, blank=True)
    # Les fonctions des tuteurs
    profession = models.CharField(max_length=150, null=True, blank=True)
    companyName = models.CharField(max_length=150, null=True, blank=True)
    # Contact
    email = models.EmailField(max_length=100, null=True, blank=True)
    phoneNumber = models.CharField(max_length=150, null=True, blank=True)
    # Authentication
    password = models.CharField(max_length=150, null=True, blank=True)
    isActive = models.BooleanField(default=True)

    hiringDate = models.DateField(null=True, blank=True)

    searchField = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.lastName + ' ' + self.firstName

    class Meta:
        ordering = ('-createdAt',)


# Administration Members
class AdministrationMember(models.Model):
    # Clés étrangères
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    UserGroup = models.ForeignKey(UserGroup, on_delete=models.CASCADE)
    School = models.ForeignKey(School, on_delete=models.CASCADE)

    startDate = models.DateField(null=True, blank=True)
    endDate = models.DateField(null=True, blank=True)
    isActive = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Students
class Learner(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    School = models.ForeignKey(School, on_delete=models.CASCADE)

    startDate = models.DateField(null=True, blank=True)
    endDate = models.DateField(null=True, blank=True)
    isActive = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Teacher
class Teacher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    School = models.ForeignKey(School, on_delete=models.CASCADE)

    startDate = models.DateField(null=True, blank=True)
    endDate = models.DateField(null=True, blank=True)
    isActive = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Affiliation
class TutorAffiliation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    wording = models.CharField(max_length=150, null=True, blank=True, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Affiliation des apprenants et de leurs tuteurs
class TutorAffiliationFeaturing(models.Model):
    # Clé étrangères
    TutorAffiliation = models.ForeignKey(TutorAffiliation, on_delete=models.CASCADE, null=True)
    Student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='Student')
    Tutor = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='Tutor')
    School = models.ForeignKey(School, on_delete=models.CASCADE)

    #
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    isActive = models.BooleanField(default=True)
    startDate = models.DateField(auto_now_add=True)
    endDate = models.DateField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Les niveaux d'enseignement
class GraduationLevel(models.Model):
    Importation = models.ForeignKey(Importation, on_delete=models.CASCADE, null=True, blank=True)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    wording = models.CharField(max_length=150, null=True, blank=True, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.wording

    class Meta:
        ordering = ('-createdAt',)


# Les sous niveaux d'enseignement
class SusGraduationLevel(models.Model):
    # Clé étrangères
    GraduationLevel = models.ForeignKey(GraduationLevel, on_delete=models.CASCADE)
    Importation = models.ForeignKey(Importation, on_delete=models.CASCADE, null=True, blank=True)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    sigle = models.CharField(max_length=150, null=True, blank=True)
    wording = models.CharField(max_length=150, null=True, blank=True, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.wording

    class Meta:
        ordering = ('-createdAt',)


# Les salles classes
class Classe(models.Model):
    # Clé étrangères
    SusGraduationLevel = models.ForeignKey(SusGraduationLevel, on_delete=models.CASCADE)
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    Importation = models.ForeignKey(Importation, on_delete=models.CASCADE, null=True, blank=True)

    #
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    wording = models.CharField(max_length=150, null=True, blank=True)
    capacity = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Les inscriptions **************** Les inscriptions
# Les inscriptions **************** Les inscriptions
# Les inscriptions **************** Les inscriptions

# Fee profile
class SchoolFeeProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    wording = models.CharField(max_length=150, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Fees
class SchoolFee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    wording = models.CharField(max_length=150, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Fees featuring
class SchoolFeeBySchool(models.Model):
    # Foreign keys
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    AcademicYear = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    SusGraduationLevel = models.ForeignKey(SusGraduationLevel, on_delete=models.CASCADE)
    SchoolFeeProfile = models.ForeignKey(SchoolFeeProfile, on_delete=models.CASCADE)
    SchoolFee = models.ForeignKey(SchoolFee, on_delete=models.CASCADE)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    important = models.BooleanField(default=False)
    amount = models.FloatField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# New inscription in classe
class Inscription(models.Model):
    # Clé étrangères
    AcademicYear = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    SusGraduationLevel = models.ForeignKey(SusGraduationLevel, on_delete=models.CASCADE)
    SchoolFeeProfile = models.ForeignKey(SchoolFeeProfile, on_delete=models.CASCADE, null=True)
    Student = models.ForeignKey(User, on_delete=models.CASCADE)
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    Classe = models.ForeignKey(Classe, on_delete=models.CASCADE)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    inscriptionDate = models.DateField(null=True, blank=True)
    valid = models.BooleanField(default=False)
    validationDate = models.DateTimeField(null=True, blank=True)
    validator = models.CharField(max_length=150, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Les frais des scolarites a payer apres les inscriptions
class InscriptionSchoolFee(models.Model):
    # Cles etrangeres
    Inscription = models.ForeignKey(Inscription, on_delete=models.CASCADE)
    SchoolFeeBySchool = models.ForeignKey(SchoolFeeBySchool, on_delete=models.CASCADE)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    amount = models.FloatField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Fin des inscriptions **************** Fin des inscriptions
# Fin des inscriptions **************** Fin des inscriptions
# Fin des inscriptions **************** Fin des inscriptions

# Messages
class Message(models.Model):
    # Clé étrangères
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    AcademicYear = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    reference = models.CharField(max_length=150, null=True, blank=True, unique=True)
    recieverGroup = models.CharField(max_length=150)
    messageType = models.CharField(max_length=150)
    messageSubject = models.CharField(max_length=150)
    messageText = models.TextField()
    messageDate = models.DateField()
    messageHour = models.TimeField()
    messageProvider = models.CharField(max_length=150)
    messageStatus = models.CharField(max_length=150)
    report = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Attached file
class MessageAttachedFile(models.Model):
    # Cles etrangeres
    Message = models.ForeignKey(Message, on_delete=models.CASCADE)
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    AcademicYear = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)

    fileType = models.CharField(max_length=150)
    fileName = models.CharField(max_length=150)
    file = models.FileField(upload_to='MessageFiles')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)


# Message classes
class MessageClasseConcerned(models.Model):
    Message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True, blank=True)
    Classe = models.ForeignKey(Classe, on_delete=models.CASCADE)


# Message details
class MessageRecieverDetails(models.Model):
    # Clé étrangères
    Message = models.ForeignKey(Message, on_delete=models.CASCADE)
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    AcademicYear = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    messageRecieverId = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='messageRecieverId')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    messageSubject = models.CharField(max_length=150)
    messageText = models.TextField()
    messageDate = models.DateField()
    messageHour = models.TimeField()
    messageProvider = models.CharField(max_length=150)
    messageStatus = models.CharField(max_length=150)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    creator = models.CharField(max_length=150, null=True, blank=True)
    updator = models.CharField(max_length=150, null=True, blank=True)
