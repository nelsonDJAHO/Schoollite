from django.urls import path

from . import views

app_name = 'main'

urlpatterns = [
    path('', views.Authentication, name='Authentication'),
    path('profile/', views.Profile, name='Profile'),
    path('passwordUpdate/', views.passwordUpdate, name='passwordUpdate'),
    path('Enterprise/', views.Enterprise, name='Enterprise'),
    path('Dashboard/', views.Dashboard, name='Dashboard'),
    path('Administrators/', views.Administrators, name='Administrators'),
    path('DeactiveAdministrator/<str:id>/', views.DeactiveAdministrator, name='DeactiveAdministrator'),
    path('DeleteAdministrator/<str:id>/', views.DeleteAdministrator, name='DeleteAdministrator'),

    # Graduations
    path('GraduationLevels/', views.GraduationLevels, name='GraduationLevels'),
    path('GetGraduationLevelById/<str:id>/', views.GetGraduationLevelById, name='GetGraduationLevelById'),
    path('DeleteGraduationLevel/<str:id>/', views.DeleteGraduationLevel, name='DeleteGraduationLevel'),
    path('SusGraduationLevels/', views.SusGraduationLevels, name='SusGraduationLevels'),
    path('GetSusGraduationLevelById/<str:id>/', views.GetSusGraduationLevelById, name='GetSusGraduationLevelById'),
    path('DeleteSusGraduationLevel/<str:id>/', views.DeleteSusGraduationLevel, name='DeleteSusGraduationLevel'),

    # Schools
    path('Schools/', views.Schools,  name='Schools'),
    path('GetShoolByid/<str:id>/', views.GetShoolByid, name='GetShoolByid'),
    path('DeleteSchool/<str:id>/', views.DeleteSchool, name='DeleteSchool'),
    path('FilterSchool/', views.FilterSchool, name='FilterSchool'),

    # Academic years
    path('AcademicYears/', views.AcademicYears, name='AcademicYears'),
    path('GetAcademicYearById/<str:id>/', views.GetAcademicYearById, name='GetAcademicYearById'),
    path('DeleteAcademicYear/<str:id>/', views.DeleteAcademicYear, name='DeleteAcademicYear'),
    path('ActivDeactivAcademicYear/<str:id>/', views.ActivDeactivAcademicYear, name='ActivDeactivAcademicYear'),
    path('changeAcademicYear/<str:id>/', views.changeAcademicYear, name='changeAcademicYear'),
    path('CheckActiveAcademicYear/', views.CheckActiveAcademicYear, name='CheckActiveAcademicYear'),

    # User
    path('getUserById/<str:id>/', views.getUserById, name='getUserById'),

    # Gestion pedagogique

    # postes
    path('UserGroups/', views.UserGroups, name='UserGroups'),
    path('GetUserGroupById/<str:id>/', views.GetUserGroupById, name='GetUserGroupById'),
    path('FilterUserGroup/', views.FilterUserGroup, name='FilterUserGroup'),
    path('DeleteUserGroup/<str:id>/', views.DeleteUserGroup, name='DeleteUserGroup'),

    # Personnel administratif
    path('SchoolWorkers/', views.SchoolWorkers, name='SchoolWorkers'),
    path('SchoolWorkerDetails/<str:id>/', views.SchoolWorkerDetails, name='SchoolWorkerDetails'),
    path('AddMemberToAdministrative/', views.AddMemberToAdministrative, name='AddMemberToAdministrative'),
    path('getSchoolworkerbyid/<str:id>/', views.getSchoolworkerbyid, name='getSchoolworkerbyid'),
    path('RetireUserFromSchoolWorkers/<str:id>/', views.RetireUserFromSchoolWorkers, name='RetireUserFromSchoolWorkers'),
    path('FilterNotAdministrative/', views.FilterNotAdministrative, name='FilterNotAdministrative'),

    # Email and sms settings
    path('EmailSmsSettings/', views.EmailSmsSettings, name='EmailSmsSettings'),
    path('EmailSettings/', views.EmailSettings, name='EmailSettings'),
    path('GetEmailSettingById/<str:id>/', views.GetEmailSettingById, name='GetEmailSettingById'),
    path('DeleteEmailSetting/<str:id>/', views.DeleteEmailSetting, name='DeleteEmailSetting'),
    path('ActivateDeactivateEmailSetting/<str:id>/', views.ActivateDeactivateEmailSetting, name='ActivateDeactivateEmailSetting'),


    path('LogOut/', views.LogOut, name='LogOut'),
]
