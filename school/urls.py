from django.urls import path

from . import views

app_name = 'school'

urlpatterns = [
    path('Authentication/', views.Authentication, name='Authentication'),
    path('profile/', views.Profile, name='Profile'),
    path('passwordUpdate/', views.passwordUpdate, name='passwordUpdate'),
    path('LogOut/', views.LogOut, name='LogOut'),
    path('Dashboard/', views.Dashboard, name='Dashboard'),

    # Graduations and levels session *************** Graduations and levels session
    # Graduations and levels session *************** Graduations and levels session
    # Graduations and levels session *************** Graduations and levels session

    # View, add and uprdate graduations levels
    path('GraduationLevels/', views.GraduationLevels, name='GraduationLevels'),
    path('GetGraduationLevelById/<str:id>/', views.GetGraduationLevelById, name='GetGraduationLevelById'),
    path('DeleteGraduationLevel/<str:id>/', views.DeleteGraduationLevel, name='DeleteGraduationLevel'),
    path('SusGraduationLevels/', views.SusGraduationLevels, name='SusGraduationLevels'),
    path('GetSusGraduationLevelById/<str:id>/', views.GetSusGraduationLevelById, name='GetSusGraduationLevelById'),
    path('DeleteSusGraduationLevel/<str:id>/', views.DeleteSusGraduationLevel, name='DeleteSusGraduationLevel'),

    # End Graduations and levels session *************** End Graduations and levels session
    # End Graduations and levels session *************** End Graduations and levels session
    # End Graduations and levels session *************** End Graduations and levels session



    # Classes session ****************** Classes session
    # Classes session ****************** Classes session
    # Classes session ****************** Classes session

    path('Classes/', views.Classes, name='Classes'),
    path('GetClasseById/<str:id>/', views.GetClasseById, name='GetClasseById'),
    path('DeleteClasse/<str:id>/', views.DeleteClasse, name='DeleteClasse'),
    path('FilterClassesBySusgraduation/<str:id>/', views.FilterClassesBySusgraduation, name='FilterClassesBySusgraduation'),

    # End Classes session ****************** End Classes session
    # End Classes session ****************** End Classes session
    # End Classes session ****************** End Classes session



    # Students session ****************** Students session
    # Students session ****************** Students session
    # Students session ****************** Students session

    path('Students/', views.Students, name='Students'),
    path('StudentFilter/', views.StudentFilter, name='StudentFilter'),
    path('StudentFilterWithSafe/', views.StudentFilterWithSafe, name='StudentFilterWithSafe'),
    path('DeleteStudent/<str:id>/', views.DeleteStudent, name='DeleteStudent'),
    path('StudentDetails/<str:id>/', views.StudentDetails, name='StudentDetails'),

    # End Students session ****************** End Students session
    # End Students session ****************** End Students session
    # End Students session ****************** End Students session



    # Inscriptions session **************
    # Inscriptions session **************
    # Inscriptions session **************

    # View, create and update school fees
    path('SchoolFees/', views.SchoolFees, name='SchoolFees'),
    # School fees profiles
    path('SchoolFeesProfiles/', views.SchoolFeesProfiles, name='SchoolFeesProfiles'),
    # Get school fee by id
    path('GetSchoolFeeProfileById/<str:id>/', views.GetSchoolFeeProfileById, name='GetSchoolFeeProfileById'),
    # Detele school fee profile by id
    path('DeleteSchoolFeeProfileById/<str:id>/', views.DeleteSchoolFeeProfileById, name='DeleteSchoolFeeProfileById'),
    # School fees saving
    path('SchoolFeeSaving/', views.SchoolFeeSaving, name='SchoolFeeSaving'),
    # Get school fee by id
    path('GetSchoolFeeById/<str:id>/', views.GetSchoolFeeById, name='GetSchoolFeeById'),
    # Delete shoolfee by id
    path('DeleteSchoolFeeById/<str:id>/', views.DeleteSchoolFeeById, name='DeleteSchoolFeeById'),
    # get school fee details by susgraduationlevelid
    path('GetSchoolFeeDetailsBySusgraduationId/', views.GetSchoolFeeDetailsBySusgraduationId, name='GetSchoolFeeDetailsBySusgraduationId'),    # View, create and update inscriptions
    # SchoolFeeDetails
    path('SchoolFeeDetails/', views.SchoolFeeDetails, name='SchoolFeeDetails'),
    # Get schoollfeedetailsById
    path('GetSchoolFeeDetailsById/<str:id>/', views.GetSchoolFeeDetailsById, name='GetSchoolFeeDetailsById'),
    # Delete schoolfees by id
    path('DeleteSchoolFeeDetailsById/<str:id>/', views.DeleteSchoolFeeDetailsById, name='DeleteSchoolFeeDetailsById'),
    # Inscriptions
    path('Inscriptions/', views.Inscriptions, name='Inscriptions'),
    # Filter student who has not inscription
    path('InscriptionStudentsFilter/', views.InscriptionStudentsFilter, name='StudentsFilter'),
    # Get inscription's primary information
    path('GetInscriptionById/<str:id>/', views.GetInscriptionById, name='GetInscriptionById'),
    # Get inscription details by id
    path('GetInscriptionDetailsById/<str:id>/', views.GetInscriptionDetailsById, name='GetInscriptionDetailsById'),
    # Delete insriptions's information
    path('DeleteInscription/<str:id>/', views.DeleteInscription, name='DeleteInscription'),
    # Filter inscriptions
    path('FilterInscription/', views.FilterInscription, name='FilterInscription'),

    # End Inscriptions session **************
    # End Inscriptions session **************
    # End Inscriptions session **************



    # Message session **************
    # Message session **************
    # Message session **************

    #Send email to people
    path('SendEmailToPeople/', views.SendEmailToPeople, name='SendEmailToPeople'),
    # Send sms to people
    path('SendSmsToPeople/', views.SendSmsToPeople, name='SendSmsToPeople'),
    # Send whatsapp message to somebody
    path('SendWhatsappMessageToSomebody/', views.SendWhatsappMessageToSomebody, name='SendWhatsappMessageToSomebody'),
    # Get message details
    path('getMessageDetailsById/<str:id>/', views.getMessageDetailsById, name='getMessageDetailsById'),
    # Get message information
    path('getMessageById/<str:id>/', views.getMessageById, name='getMessageById'),
    # Delete message information
    path('deleteMessageById/<str:id>/', views.deleteMessageById, name='deleteMessageById'),

    # End Message session **************
    # End Message session **************
    # End Message session **************



    # Tutors session *************** Tutors session
    # Tutors session *************** Tutors session
    # Tutors session *************** Tutors session

    # View, add and update tutors
    path('Tutors/', views.Tutors, name='Tutors'),
    # get tutor's all information
    path('TutorDetails/<str:id>/', views.TutorDetails, name='TutorDetails'),
    # Delete tutor data
    path('DeleteTutor/<str:id>/', views.DeleteTutor, name='DeleteTutor'),
    # Filter tutor with safe
    path('TutorFilterWithSafe/', views.TutorFilterWithSafe, name='TutorFilterWithSafe'),
    # Get students of a tutor
    path('GetTutorStudents/<str:id>/', views.GetTutorStudents, name='GetTutorStudents'),
    path('TutorsMessages/', views.TutorsMessages, name='TutorsMessages'),
    path('FilterTutorsMessages/', views.FilterTutorsMessages, name='FilterTutorsMessages'),
    path('SendEmailTotutorsByClasses/', views.SendEmailTotutorsByClasses, name='SendEmailTotutorsByClasses'),
    path('SendSmsTotutorsByClasses/', views.SendSmsTotutorsByClasses, name='SendSmsTotutorsByClasses'),

    # Tutor link part
    path('GetStudentTutors/<str:id>/', views.GetStudentTutors, name='GetStudentTutors'),
    path('FilterTutors/', views.FilterTutors, name='FilterTutors'),
    path('LinkStudentTutor/', views.LinkStudentTutor, name='LinkStudentTutor'),
    path('GetTutorLinkById/<str:id>/', views.GetTutorLinkById, name='GetTutorLinkById'),
    path('RemovetutorStudentLink/<str:id>/', views.RemovetutorStudentLink, name='RemovetutorStudentLink'),
    # End tutor link part

    # End Tutors session *************** End Tutors session
    # End Tutors session *************** End Tutors session
    # End Tutors session *************** End Tutors session



    # School session ********************
    # School session ********************
    # School session ********************

    # view and update school infomrations
    path('SchoolInformations/', views.SchoolInformations, name='SchoolInformations'),
    # view and update email and sms settings
    path('SmsEmailSettings/', views.SmsEmailSettings, name='SmsEmailSettings'),
    # Email part
    path('EmailSettings/', views.EmailSettings, name='EmailSettings'),
    path('testEmailServerConnexion/<str:id>/', views.testEmailServerConnexion, name='testEmailServerConnexion'),
    path('ActivateDeactivateEmailSetting/<str:id>/', views.ActivateDeactivateEmailSetting, name='ActivateDeactivateEmailSetting'),
    path('GetEmailSetting/<str:id>/', views.GetEmailSetting, name='GetEmailSetting'),
    # End Email part
    # Sms part
    path('SmsSettings/', views.SmsSettings, name='SmsSettings'),
    path('GetSMSSetting/<str:id>/', views.GetSMSSetting, name='GetSMSSetting'),
    path('ActivateDeactivateSMSSetting/<str:id>/', views.ActivateDeactivateSMSSetting, name='ActivateDeactivateSMSSetting'),
    # End Sms part

    # End School session ********************
    # End School session ********************
    # End School session ********************



    # Imporations session **************
    # Imporations session **************
    # Imporations session **************

    path('getImportationById/<str:id>/', views.getImportationById, name='getImportationById'),
    # Recuperer les informations primaire d une imnportation
    path('ImportationDetails/<str:id>/', views.ImportationDetails, name='ImportationDetails'),
    # Recuperer toutes les informations d une importations
    path('deleteImportation/<str:id>/', views.deleteImportation, name='deleteImportation'),
    # Supprimer les informations d une imporartation

    path('GraduationsLevelsImporations/', views.GraduationsLevelsImporations, name='GraduationsLevelsImporations'),
    path('classesImportation/', views.classesImportation, name='classesImportation'),
    path('studentsImportation/', views.studentsImportation, name='studentsImportation'),

    # End Imporations session **************
    # End Imporations session **************
    # End Imporations session **************

]
