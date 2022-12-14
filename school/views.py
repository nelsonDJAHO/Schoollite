import os
import ssl
import threading
import urllib
from datetime import datetime, date
import smtplib

from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q, Subquery
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.db import transaction, IntegrityError

# Functions importation
from .tutorsfunctions import saveTutorSmsByClassStufs, saveTutorEmailByClassStufs
from .functions import send_Gmail_Email_To_People, send_SmsZedeka_Sms_To_People
from .importations import GraduationsLevelsImportation, ClasseImportation, StudentsImportation

# Create your views here.
from main.models import *


def handle_uploaded_file(path, file):
    with open(path + file.name, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)


# Ajax request
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


def ReferenceMaker(sigle):
    time = datetime.now()
    datepart = str(date.today().year) + str(date.today().month) + str(date.today().day)
    reference = sigle + str(datepart) + "-" + str(time.strftime("%H%M%S"))
    return reference


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


# Authentication
def Authentication(request):
    if not 'Worker' in request.session:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""

            # Posted data
            schoolId = request.POST.get('schoolId')
            email = request.POST.get('email')
            password = request.POST.get('password')

            # Traitement
            if not schoolId or not email or not password:
                status = False
                message = "Des champs requis sont vides"
            else:
                # Verifier si l etablissement existe
                if School.objects.filter(id=schoolId).exists():
                    # Verifier si l utilisateur existe
                    if User.objects.filter(email=email).exists():
                        userFound = User.objects.get(email=email)
                        # Verifier si le mot de passe correspond
                        if check_password(password, userFound.password):
                            # Verifier si l utilisateur est lie a cet etablissement
                            if AdministrationMember.objects.filter(User_id=userFound.id, School_id=schoolId,
                                                                   isActive=True).exists():
                                adminMember = AdministrationMember.objects.get(User_id=userFound.id, School_id=schoolId,
                                                                               isActive=True)
                                request.session['Worker'] = str(userFound.id)
                                request.session['WorkerGroup'] = str(adminMember.UserGroup.reference)
                                request.session['lockDown'] = False
                                request.session['School'] = schoolId
                                if AcademicYear.objects.filter(isActive=True).exists():
                                    request.session['AcademicYear'] = str(AcademicYear.objects.get(isActive=True).id)
                                else:
                                    request.session['AcademicYear'] = ""
                                message = "Vous ??tes connect??(e)"
                            else:
                                status = False
                                message = "Acc??s refus?? ?? cet etablissement"
                        else:
                            status = False
                            message = "Identifiants incorrects"
                    else:
                        status = False
                        message = "Identifiants incorrects"
                else:
                    status = False
                    message = "Cet etablissement n'existe plus"

            return JsonResponse({'status': status, 'message': message})

        context = {
            'mainSchool': MainSchool.objects.all()[0],
            'schools': School.objects.filter(isActive=True)
        }
        return render(request, 'school/Authentication.html', context)
    else:
        if User.objects.get(id=request.session['Worker']) and UserGroup.objects.filter(
                reference=request.session['WorkerGroup']).exists():
            return redirect('school:Dashboard')


# Gestion des informations du profil connect??
def Profile(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""

            # Posted datas
            userId = request.POST.get('userId')
            lastName = request.POST.get('lastName')
            firstName = request.POST.get('firstName')
            gender = request.POST.get('gender')
            birthDate = request.POST.get('birthDate')
            birthCountry = request.POST.get('birthCountry')
            birthTown = request.POST.get('birthTown')
            nationality = request.POST.get('nationality')
            livingCountry = request.POST.get('livingCountry')
            livingTown = request.POST.get('livingTown')
            address = request.POST.get('livingAddress')
            email = request.POST.get('email')
            phoneNumber = request.POST.get('phoneNumber')
            avatar = request.FILES.get('avatar')

            # Traitement
            if not userId or not lastName or not firstName or not gender or not birthTown or not email or not phoneNumber:
                status = False
                message = "Des champs requis sont vides"
            else:
                if User.objects.filter(email=email).exclude(id=userId).exists():
                    status = False
                    message = "l'adresse mail " + email + " est d??j?? attribu??e"
                elif User.objects.filter(phoneNumber=phoneNumber).exclude(id=userId).exists():
                    status = False
                    message = "Le num??ro de t??l??phone " + phoneNumber + " est d??j?? attribu??"
                else:
                    searchField = lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                    user = User.objects.get(id=userId)
                    user.lastName = lastName.upper()
                    user.firstName = firstName.title()
                    user.gender = gender.title()
                    if avatar:
                        user.avatar = avatar
                    user.birthDate = birthDate
                    user.birthCountry = birthCountry.upper()
                    user.birthTown = birthTown.title()
                    user.nationality = nationality.upper()
                    user.livingCountry = livingCountry.upper()
                    user.livingTown = livingTown.title()
                    user.address = address.title()
                    user.email = email
                    user.phoneNumber = phoneNumber
                    user.searchField = searchField
                    user.save()
                    message = "Vos informations ont ??t?? enregistr??es"

            return JsonResponse({'status': status, 'message': message})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
        }
        return render(request, 'school/profile.html', context)


# Password update
def passwordUpdate(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""

            # Posted data
            userId = request.POST.get('userId')
            oldPassword = request.POST.get('oldPassword')
            newPassword = request.POST.get('newPassword')

            user = User.objects.get(id=userId)
            if check_password(oldPassword, user.password):
                user.password = make_password(newPassword, 'sha512')
                user.save()
                message = "Le mot de passe a ??t?? chang??"
            else:
                status = False
                message = "L'ancien mot de passe ne correspond pas"

            return JsonResponse({'status': status, 'message': message})


# Logout
def LogOut(request):
    if 'Worker' in request.session:
        del request.session['Worker']
        del request.session['WorkerGroup']
        del request.session['lockDown']
        del request.session['AcademicYear']
        del request.session['School']
        return redirect('school:Authentication')
    else:
        return redirect('school:Authentication')


# Dashboard
def Dashboard(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        # Les donnees de l ecole
        # Nombre d'apprenants
        studentsCount = Learner.objects.filter(School_id=request.session['School']).count()
        # Nombre de classes
        classesCount = Classe.objects.filter(School_id=request.session['School']).count

        # Nombre de tuteurs
        tutorsCount = User.objects.filter(
            id__in=TutorAffiliationFeaturing.objects.filter(School_id=request.session['School'],
                                                            Student_id__isnull=True).values('Tutor_id')).count()

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'classesCount': classesCount,
            'studentsCount': studentsCount,
            'tutorsCount': tutorsCount
        }
        return render(request, 'school/Dashboard.html', context)


# Graduations
def GraduationLevels(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == 'POST':
            status = True
            message = ""
            newGraduationLevellist = []

            # Posted data
            graduationLevelId = request.POST.get('graduationLevelId')
            graduationWording = request.POST.get('graduationWording')

            # Traitement
            if not graduationWording:
                status = False
                message = "Des champs requis sont vides"
            else:
                try:
                    with transaction.atomic():
                        if not graduationLevelId:
                            if GraduationLevel.objects.filter(wording__exact=graduationWording).exists():
                                status = False
                                message = "Le niveau d'enseignement " + graduationWording + " existe d??j??"
                            else:
                                GraduationLevel.objects.create(reference=ReferenceMaker('NE-'),
                                                               wording=graduationWording)
                                message = "Le niveau d'enseignement " + graduationWording + " a ??t?? enregistr??"
                        else:
                            if not GraduationLevel.objects.filter(id=graduationLevelId).exists():
                                status = False
                                message = "Ce niveaux d'enseignement n'existe plus"
                            else:
                                grauationlevel = GraduationLevel.objects.get(id=graduationLevelId)
                                grauationlevel.wording = graduationWording
                                grauationlevel.save()
                                message = "Le niveau d'enseignement " + graduationWording + " a ??t?? enregistr??"
                except IntegrityError:
                    status = False
                    message = "Une erreur est survenue lors de l'enregistrement"

            for level in GraduationLevel.objects.all():
                item = {
                    'id': level.id,
                    'reference': level.reference,
                    'wording': level.wording,
                    'createdAt': level.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': level.updatedAt.strftime('%d-%m-%Y')
                }
                newGraduationLevellist.append(item)
            return JsonResponse({'status': status, 'message': message, 'graduationLevelsList': newGraduationLevellist})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'school': School.objects.get(id=request.session['School']),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'graduationLevels': GraduationLevel.objects.all()[:100],
            'susGraduationLevel': SusGraduationLevel.objects.all()[:100]
        }
        return render(request, 'school/classes/GraduationLevels.html', context)


# Get graduation level by Id
def GetGraduationLevelById(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        item = None

        if not id:
            status = False
            message = "Aucun niveau s??lectionn??"
        else:
            if not GraduationLevel.objects.filter(id=id).exists():
                status = False
                message = "Ce niveau n'existe plus"
            else:
                level = GraduationLevel.objects.get(id=id)
                item = {
                    'id': level.id,
                    'reference': level.reference,
                    'wording': level.wording,
                    'createdAt': level.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': level.updatedAt.strftime('%d-%m-%Y')
                }
        return JsonResponse({'status': status, 'message': message, 'graduationLevel': item})


# Delete graduation level
def DeleteGraduationLevel(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        newGraduationLevellist = []

        if not id:
            status = False
            message = "Aucun niveau s??lectionn??"
        else:
            if not GraduationLevel.objects.filter(id=id).exists():
                status = False
                message = "Ce niveau n'existe plus"
            elif SusGraduationLevel.objects.filter(GraduationLevel_id=id).exists():
                status = False
                message = "Impossible de supprimer ce niveau car li?? ?? au moins un degr??"
            else:
                graduationlevel = GraduationLevel.objects.get(id=id)
                graduationlevel.delete()
                message = "Suppression faite"

        for level in GraduationLevel.objects.all():
            item = {
                'id': level.id,
                'reference': level.reference,
                'wording': level.wording,
                'createdAt': level.createdAt.strftime('%d-%m-%Y'),
                'updatedAt': level.updatedAt.strftime('%d-%m-%Y')
            }
            newGraduationLevellist.append(item)
        return JsonResponse({'status': status, 'message': message, 'graduationLevelsList': newGraduationLevellist})


# SusGraduationLevel
def SusGraduationLevels(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            newSusGraduationLevels = []

            # Posted data
            susGraduationLevelId = request.POST.get('susGraduationLevelId')
            susGraduationSigle = request.POST.get('susGraduationSigle')
            susGraduationWording = request.POST.get('susGraduationWording')
            susGraduationLevelGraduationId = request.POST.get('susGraduationLevelGraduationId')

            # Traitement
            if not susGraduationSigle or not susGraduationWording or not susGraduationLevelGraduationId:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not susGraduationLevelId:
                    if SusGraduationLevel.objects.filter(sigle=susGraduationSigle,
                                                         GraduationLevel_id=susGraduationLevelGraduationId).exists():
                        status = False
                        message = "Le degr?? " + susGraduationSigle + " esiste d??j?? pour ce niveau"
                    else:
                        SusGraduationLevel.objects.create(sigle=susGraduationSigle,
                                                          wording=susGraduationWording,
                                                          GraduationLevel_id=susGraduationLevelGraduationId)
                        message = "Le degr?? d'enseignement " + susGraduationWording + " a ??t?? enregistr??"
                else:
                    if SusGraduationLevel.objects.filter(sigle=susGraduationSigle,
                                                         GraduationLevel_id=susGraduationLevelGraduationId).exclude(
                        id=susGraduationLevelId).exists():
                        status = False
                        message = "Le degr?? " + susGraduationWording + " esiste d??j?? pour ce niveau"
                    else:
                        susgraduationlevel = SusGraduationLevel.objects.get(id=susGraduationLevelId)
                        susgraduationlevel.sigle = susGraduationSigle
                        susgraduationlevel.wording = susGraduationWording
                        susgraduationlevel.GraduationLevel_id = susGraduationLevelGraduationId
                        susgraduationlevel.save()
                        message = "Le degr?? d'enseignement " + susGraduationWording + " a ??t?? enregistr??"

            for susLevel in SusGraduationLevel.objects.all():
                item = {
                    'id': susLevel.id,
                    'sigle': susLevel.sigle,
                    'wording': susLevel.wording,
                    'graduationLevel': str(susLevel.GraduationLevel),
                    'graduationLevelId': susLevel.GraduationLevel_id,
                    'createdAt': susLevel.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': susLevel.updatedAt.strftime('%d-%m-%Y')
                }
                newSusGraduationLevels.append(item)
            return JsonResponse({'status': status, 'message': message, 'SusGraduationLevels': newSusGraduationLevels})


# Get sus graduation level
def GetSusGraduationLevelById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucun degr?? s??lectionn??"
    elif not SusGraduationLevel.objects.filter(id=id).exists():
        status = False
        message = "Ce degr?? d'enseignement n'existe plus"
    else:
        susLevel = SusGraduationLevel.objects.get(id=id)
        item = {
            'id': susLevel.id,
            'sigle': susLevel.sigle,
            'wording': susLevel.wording,
            'graduationLevel': str(susLevel.GraduationLevel),
            'graduationLevelId': susLevel.GraduationLevel_id,
            'createdAt': susLevel.createdAt.strftime('%d-%m-%Y'),
            'updatedAt': susLevel.updatedAt.strftime('%d-%m-%Y')
        }
    return JsonResponse({'status': status, 'message': message, 'susGraduationLevel': item})


# Delete sus graduation level
def DeleteSusGraduationLevel(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        newSusGraduationLevels = []

        if not id:
            status = False
            message = "Aucun degr?? s??lectionn??"
        elif not SusGraduationLevel.objects.filter(id=id).exists():
            status = False
            message = "Ce degr?? d'enseignement n'existe plus"
        elif Classe.objects.filter(SusGraduationLevel_id=id).exists():
            status = False
            message = "Impossible de supprimer ce degr?? car li?? ?? au moins une classe"
        else:
            susLevel = SusGraduationLevel.objects.get(id=id)
            susLevel.delete()
            message = "Suppression faite"

        for susLevel in SusGraduationLevel.objects.all():
            item = {
                'id': susLevel.id,
                'sigle': susLevel.sigle,
                'wording': susLevel.wording,
                'graduationLevel': str(susLevel.GraduationLevel),
                'graduationLevelId': susLevel.GraduationLevel_id,
                'createdAt': susLevel.createdAt.strftime('%d-%m-%Y'),
                'updatedAt': susLevel.updatedAt.strftime('%d-%m-%Y')
            }
            newSusGraduationLevels.append(item)
        return JsonResponse({'status': status, 'message': message, 'SusGraduationLevels': newSusGraduationLevels})


# Classes
def Classes(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            newClassesList = []

            # Posted Data
            classeId = request.POST.get('classeId')
            wording = request.POST.get('wording')
            susGraduationLevelId = request.POST.get('susGraduationLevelId')
            capacity = request.POST.get('capacity')

            # Traitement
            if not wording or not susGraduationLevelId or not capacity:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not classeId:
                    if Classe.objects.filter(wording__exact=wording,
                                             School_id__exact=request.session['School']).exists():
                        status = False
                        message = "La classe " + wording + " existe d??j??"
                    else:
                        Classe.objects.create(reference=ReferenceMaker('SC-'), wording=wording,
                                              SusGraduationLevel_id=susGraduationLevelId, capacity=capacity,
                                              School_id=request.session['School'])
                        message = "La classe " + wording + " a ??t?? enregistr??e"
                else:
                    if Classe.objects.filter(wording__exact=wording,
                                             School_id__exact=request.session['School']).exclude(
                        id=classeId).exists():
                        status = False
                        message = "La classe " + wording + " existe d??j??"
                    else:
                        classe = Classe.objects.get(id=classeId)
                        classe.wording = wording
                        classe.SusGraduationLevel_id = susGraduationLevelId
                        classe.capacity = capacity
                        classe.save()
                        message = "La classe " + wording + " a ??t?? enregistr??e"

            for classe in Classe.objects.filter(School_id=request.session['School'])[:100]:
                item = {
                    'id': classe.id,
                    'reference': classe.reference,
                    'GraduationLevel': str(classe.SusGraduationLevel.GraduationLevel),
                    'SusGraduationLevel': str(classe.SusGraduationLevel),
                    'SusGraduationLevelId': classe.SusGraduationLevel_id,
                    'wording': classe.wording,
                    'capacity': classe.capacity
                }
                newClassesList.append(item)
            return JsonResponse({'status': status, 'message': message, 'classes': newClassesList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'Classes': Classe.objects.filter(School_id=request.session['School'])[:100],
            'SusGraduationLevels': SusGraduationLevel.objects.all()
        }
        return render(request, 'school/classes/Classes.html', context)


# Get classe by Id
def GetClasseById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucune classe s??lectionn??e"
    elif not Classe.objects.filter(id=id).exists():
        status = False
        message = "Cette classe n'existe plus"
    else:
        classe = Classe.objects.get(id=id)
        item = {
            'id': classe.id,
            'reference': classe.reference,
            'wording': classe.wording,
            'capacity': classe.capacity,
            'SusGraduationLevelId': classe.SusGraduationLevel_id
        }
    return JsonResponse({'status': status, 'message': message, 'classe': item})


# Delete Classe
def DeleteClasse(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        newClassesList = []

        if not id:
            status = False
            message = "Aucune classe s??lectionn??e"
        elif not Classe.objects.filter(id=id).exists():
            status = False
            message = "Cette classe n'existe plus"
        elif Inscription.objects.filter(Classe_id=id).exists():
            status = False
            message = "Impossible de suppprimer cette classe  car au li??e ?? au moin une inscription"
        else:
            classe = Classe.objects.get(id=id)
            classe.delete()
            message = "Suppression faite"

    for classe in Classe.objects.filter(School_id=request.session['School'])[:100]:
        item = {
            'id': classe.id,
            'reference': classe.reference,
            'GraduationLevel': str(classe.SusGraduationLevel.GraduationLevel),
            'SusGraduationLevel': str(classe.SusGraduationLevel),
            'SusGraduationLevelId': classe.SusGraduationLevel_id,
            'wording': classe.wording,
            'capacity': classe.capacity
        }
        newClassesList.append(item)
    return JsonResponse({'status': status, 'message': message, 'classes': newClassesList})


# filter classe by sus graduation
def FilterClassesBySusgraduation(request, id):
    status = True
    message = ""
    classesList = []

    if not id:
        status = False
        message = "Aucun degr?? s??lectionn??"
    elif not SusGraduationLevel.objects.filter(id=id).exists():
        status = False
        message = "Ce degr?? n'existe plus"
    else:
        for classe in Classe.objects.filter(SusGraduationLevel_id=id):
            item = {
                'id': classe.id,
                'wording': classe.wording
            }
            classesList.append(item)
    return JsonResponse({'status': status, 'message': message, 'classes': classesList})


# Students
def Students(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            newStudents = []

            # Posted datas
            # Identit??
            studentId = request.POST.get('studentId')
            matricule = request.POST.get('matricule')
            lastName = request.POST.get('lastName')
            firstName = request.POST.get('firstName')
            gender = request.POST.get('gender')
            avatar = request.FILES.get('avatar')
            # Naissance
            birthDate = request.POST.get('birthDate')
            birthCountry = request.POST.get('birthCountry')
            birthTown = request.POST.get('birthTown')
            nationality = request.POST.get('nationality')
            # Localisation
            livingCountry = request.POST.get('livingCountry')
            livingTown = request.POST.get('livingTown')
            address = request.POST.get('livingAddress')
            email = request.POST.get('email')
            phoneNumber = request.POST.get('phoneNumber')

            # Lien avec les etablissement
            schoolId = request.session['School']

            # Traitement
            if not lastName or not firstName or not gender:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not studentId:
                    if matricule and User.objects.filter(matricule=matricule).exists():
                        status = False
                        message = "Le matricule " + matricule + " est d??j?? attribu??"
                    elif email and User.objects.filter(email=email).exists():
                        status = False
                        message = "L'adresse mail " + email + " est d??j?? attribu??"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exists():
                        status = False
                        message = "Le num??ro de t??l??phone " + phoneNumber + " est d??j?? attribu??"
                    else:
                        if not avatar:
                            avatar = 'avatar.png'
                        searchField = matricule + " " + lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        newUser = User.objects.create(reference=ReferenceMaker('USR-'),
                                                      matricule=matricule, lastName=lastName.upper(),
                                                      firstName=firstName.title(), gender=gender, avatar=avatar,
                                                      birthDate=birthDate,
                                                      birthCountry=birthCountry.upper(), birthTown=birthTown.title(),
                                                      nationality=nationality.upper(),
                                                      livingCountry=livingCountry.upper(),
                                                      livingTown=livingTown.title(), address=address,
                                                      email=email, phoneNumber=phoneNumber,
                                                      password=make_password('00000', 'sha512'),
                                                      searchField=searchField)

                        # Lien avec l ecole
                        Learner.objects.create(User=newUser, School_id=schoolId, startDate=date.today())
                        message = "L'apprennant " + str(newUser) + " a ??t?? enregistr??(e)"
                else:
                    if matricule and User.objects.filter(matricule=matricule).exclude(id=studentId).exists():
                        status = False
                        message = "Le matricule " + matricule + " est d??j?? attribu??"
                    elif email and User.objects.filter(email=email).exclude(id=studentId).exists():
                        status = False
                        message = "L'adresse mail " + email + " est d??j?? attribu??"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exclude(id=studentId).exists():
                        status = False
                        message = "Le num??ro de t??l??phone " + phoneNumber + " est d??j?? attribu??"
                    else:
                        user = User.objects.get(id=studentId)
                        searchField = matricule + " " + lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        user.matricule = matricule
                        user.lastName = lastName.upper()
                        user.firstName = firstName.title()
                        user.gender = gender
                        if avatar:
                            user.avatar = avatar
                        user.birthDate = birthDate
                        user.birthCountry = birthCountry.upper()
                        user.birthTown = birthTown.title()
                        user.nationality = nationality.upper()
                        user.livingCountry = livingCountry.upper()
                        user.livingTown = livingTown.title()
                        user.address = address
                        user.email = email
                        user.phoneNumber = phoneNumber
                        user.searchField = searchField
                        user.save()
                        message = "L'apprennant " + str(user) + " a ??t?? enregistr??(e)"

            if status:
                for learner in Learner.objects.filter(School_id=request.session['School'])[:100]:
                    item = {
                        'id': learner.User.id,
                        'matricule': learner.User.matricule,
                        'reference': learner.User.reference,
                        'fullName': str(learner.User),
                        'gender': learner.User.gender,
                        'address': learner.User.address,
                        'phoneNumber': learner.User.phoneNumber,
                        'isActive': learner.User.isActive,
                        'school': learner.School.sigle,
                        'avatar': learner.User.avatar.url
                    }
                    newStudents.append(item)
            return JsonResponse({'status': status, 'message': message, 'students': newStudents})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'students': Learner.objects.filter(School_id=request.session['School'])[:100],
            'tutors': User.objects.all(),
            'tutorAffiliations': TutorAffiliation.objects.all()
        }
        return render(request, 'school/students/Students.html', context)


# Student filter
def StudentFilter(request):
    if request.method == 'GET':
        term = request.GET.get('term')
        studentsList = []

        if term:
            if request.session['AcademicYear']:
                students = User.objects.filter(
                    Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term),
                    id__in=Learner.objects.filter(School_id=request.session['School']).values_list('User_id'))
            else:
                students = User.objects.filter(
                    Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term),
                    id__in=Learner.objects.filter(School_id=request.session['School']))
            for student in students:
                item = {
                    'id': student.id,
                    'fullname': str(student) + ' ' + student.phoneNumber + ' ' + student.email,
                    'phonenumber': student.phoneNumber,
                    'fullname1': str(student),
                    'avatar': student.avatar.url,
                    'lastName': student.lastName,
                    'firstName': student.firstName,
                    'gender': student.gender,
                    'address': student.address,
                    'phoneNumber': student.phoneNumber
                }
                studentsList.append(item)
            return JsonResponse(studentsList, safe=False)
        else:
            return JsonResponse(studentsList, safe=False)


# Student filter withe safe
def StudentFilterWithSafe(request):
    if request.method == 'GET':
        status = True
        message = "Aucun r??sultat trouv??"
        term = request.GET.get('term')
        studentsList = []

        if term:
            if request.session['AcademicYear']:
                students = User.objects.filter(
                    Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term),
                    id__in=Learner.objects.filter(School_id=request.session['School']).values_list('User_id'))[:100]
            else:
                students = User.objects.filter(
                    Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term),
                    id__in=Learner.objects.filter(School_id=request.session['School']))[:100]
            for student in students:
                item = {
                    'id': student.id,
                    'matricule': student.matricule,
                    'reference': student.reference,
                    'fullName': str(student),
                    'gender': student.gender,
                    'address': student.address,
                    'phoneNumber': student.phoneNumber,
                    'isActive': student.isActive,
                    'school': School.objects.get(id=request.session['School']).sigle,
                    'avatar': student.avatar.url
                }
                studentsList.append(item)
        else:
            for student in User.objects.filter(
                    id__in=Learner.objects.filter(School_id=request.session['School']).values_list('User_id'))[:100]:
                item = {
                    'id': student.id,
                    'matricule': student.matricule,
                    'reference': student.reference,
                    'fullName': str(student),
                    'gender': student.gender,
                    'address': student.address,
                    'phoneNumber': student.phoneNumber,
                    'isActive': student.isActive,
                    'school': School.objects.get(id=request.session['School']).sigle,
                    'avatar': student.avatar.url
                }
                studentsList.append(item)

        if studentsList:
            message = str(len(studentsList)) + " r??sultats trouv??s"
            return JsonResponse({'status': status, 'message': message, 'students': studentsList})
        else:
            return JsonResponse({'status': status, 'message': message, 'students': studentsList})


# Delete Student
def DeleteStudent(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        newStudents = []

        if not id:
            status = False
            message = "Aucun apprenant s??lectionn??"
        elif not User.objects.filter(id=id).exists():
            status = False
            message = "Cet apprenant n'existe plus"
        elif Inscription.objects.filter(Student_id=id).exists():
            status = False
            message = "Impossible de supprimer cet apprenat car li?? ?? au moins une inscription"
        else:
            user = User.objects.get(id=id)
            user.delete()
            message = "Suppression faite"

        if status:
            for worker in Learner.objects.filter(School_id=request.session['School'])[:100]:
                item = {
                    'id': worker.User.id,
                    'matricule': worker.User.matricule,
                    'reference': worker.User.reference,
                    'fullName': str(worker.User),
                    'gender': worker.User.gender,
                    'address': worker.User.address,
                    'phoneNumber': worker.User.phoneNumber,
                    'isActive': worker.User.isActive,
                    'school': worker.School.sigle,
                    'avatar': worker.User.avatar.url
                }
                newStudents.append(item)
        return JsonResponse({'status': status, 'message': message, 'students': newStudents})


# student details
def StudentDetails(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'student': User.objects.get(id=id),
            'studentTutors': TutorAffiliationFeaturing.objects.filter(Student_id=id),
            'tutorAffiliations': TutorAffiliation.objects.all()
        }
        return render(request, 'school/students/StudentDetails.html', context)


# Inscriptions

# School Fees
def SchoolFees(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        academicYear = ''
        schoolFeeDetails = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
            schoolFeeDetails = SchoolFeeBySchool.objects.filter(School_id=request.session['School'],
                                                                AcademicYear_id=request.session['AcademicYear'])

        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:10],
            'school': School.objects.get(id=request.session['School']),
            'SchoolFeesProfiles': SchoolFeeProfile.objects.all(),
            'SchoolFees': SchoolFee.objects.all(),
            'SusGraduationLevels': SusGraduationLevel.objects.all()[:100],
            'schoolFeeDetails': schoolFeeDetails,
            'classes': Classe.objects.filter(School_id=request.session['School'])
        }
        return render(request, 'school/inscriptions/SchoolFees.html', context)


# Schoolfees profiles
def SchoolFeesProfiles(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            schoolFeesProfiles = []

            # Posted Datas
            SchoolFeeProfileId = request.POST.get('SchoolFeeProfileId')
            SchoolFeeProfileWording = request.POST.get('SchoolFeeProfileWording').title()

            # Treatment
            if not SchoolFeeProfileWording:
                status = False
                message = "Des champs importants sont vides"
            else:
                # New saving
                if not SchoolFeeProfileId:
                    if SchoolFeeProfile.objects.filter(wording__exact=SchoolFeeProfileWording).exists():
                        status = False
                        message = "La d??nomination " + SchoolFeeProfileWording + ' existe d??j??'
                    else:
                        SchoolFeeProfile.objects.create(reference=ReferenceMaker('SFP-'),
                                                        wording=SchoolFeeProfileWording.title())
                        message = "Le profile " + SchoolFeeProfileWording + ' a ??t?? enregistr??'
                else:
                    if SchoolFeeProfile.objects.filter(wording__exact=SchoolFeeProfileWording).exclude(
                            id=SchoolFeeProfileId).exists():
                        status = False
                        message = "La d??nomination " + SchoolFeeProfileWording + ' existe d??j??'
                    else:
                        profile = SchoolFeeProfile.objects.get(id=SchoolFeeProfileId)
                        profile.wording = SchoolFeeProfileWording.title()
                        profile.save()
                        message = "Le profile " + SchoolFeeProfileWording + ' a ??t?? enregistr??'

        if status:
            for data in SchoolFeeProfile.objects.all():
                item = {
                    'id': data.id,
                    'reference': data.reference,
                    'wording': data.wording,
                    'createdAt': data.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': data.updatedAt.strftime('%d-%m-%Y')
                }
                schoolFeesProfiles.append(item)
        return JsonResponse({'status': status, 'message': message, 'schoolFeesProfiles': schoolFeesProfiles})


# Get school fee profile by id
def GetSchoolFeeProfileById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucun profile s??lectionn??"
    elif not SchoolFeeProfile.objects.filter(id=id).exists():
        status = False
        message = "Ce profile n'existe plus"
    else:
        profile = SchoolFeeProfile.objects.get(id=id)
        item = {
            'id': profile.id,
            'wording': profile.wording
        }
    return JsonResponse({'status': status, 'message': message, 'profile': item})


# Delete school fee profile
def DeleteSchoolFeeProfileById(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        schoolFeesProfiles = []
        if not id:
            status = False
            message = "Aucun profile s??lectionn??"
        elif not SchoolFeeProfile.objects.filter(id=id).exists():
            status = False
            message = "Ce profile n'existe plus"
        elif SchoolFeeBySchool.objects.filter(SchoolFeeProfile_id=id).exists():
            status = False
            message = "Vous ne pouvez pas supprimer ce profil car li?? ?? au moins un frais de scolarit??"
        else:
            profile = SchoolFeeProfile.objects.get(id=id)
            profile.delete()
            message = "Suppression faite"
        if status:
            for data in SchoolFeeProfile.objects.all():
                item = {
                    'id': data.id,
                    'reference': data.reference,
                    'wording': data.wording,
                    'createdAt': data.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': data.updatedAt.strftime('%d-%m-%Y')
                }
                schoolFeesProfiles.append(item)
        return JsonResponse({'status': status, 'message': message, 'schoolFeesProfiles': schoolFeesProfiles})


# School fee
def SchoolFeeSaving(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            schoolFeesList = []

            SchoolFeeId = request.POST.get('SchoolFeeId')
            SchoolFeeWording = request.POST.get('SchoolFeeWording').title()
            if not SchoolFeeWording:
                status = False
                message = "Des champs importants sont vides"
            else:
                # new savind
                if not SchoolFeeId:
                    if SchoolFee.objects.filter(wording__exact=SchoolFeeWording).exists():
                        status = False
                        message = "Le frais " + SchoolFeeWording + " existe d??j??"
                    else:
                        SchoolFee.objects.create(reference=ReferenceMaker('SCF-'),
                                                 wording=SchoolFeeWording)
                        message = "Le frais " + SchoolFeeWording + " a ??t?? enregistr??"
                else:
                    if SchoolFee.objects.filter(wording__exact=SchoolFeeWording).exclude(id=SchoolFeeId).exists():
                        status = False
                        message = "Le frais " + SchoolFeeWording + " existe d??j??"
                    else:
                        schoolfee = SchoolFee.objects.get(id=SchoolFeeId)
                        schoolfee.wording = SchoolFeeWording
                        schoolfee.save()
                        message = "Le frais " + SchoolFeeWording + " a ??t?? enregistr??"

            if status:
                for data in SchoolFee.objects.all():
                    item = {
                        'id': data.id,
                        'reference': data.reference,
                        'wording': data.wording,
                        'createdAt': data.createdAt.strftime('%d-%m-%Y'),
                        'updatedAt': data.updatedAt.strftime('%d-%m-%Y')
                    }
                    schoolFeesList.append(item)
            return JsonResponse({'status': status, 'message': message, 'schoolFees': schoolFeesList})


# Get School Fee by id
def GetSchoolFeeById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucun fraus s??lectionn??"
    elif not SchoolFee.objects.filter(id=id).exists():
        status = False
        message = "Ce frais n'existe plus"
    else:
        schoolfee = SchoolFee.objects.get(id=id)
        item = {
            'id': schoolfee.id,
            'reference': schoolfee.reference,
            'wording': schoolfee.wording
        }
    return JsonResponse({'status': status, 'message': message, 'schoolFee': item})


# Delete schoolfee
def DeleteSchoolFeeById(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        schoolFeesList = []

        if not id:
            status = False
            message = "Aucun fraus s??lectionn??"
        elif not SchoolFee.objects.filter(id=id).exists():
            status = False
            message = "Ce frais n'existe plus"
        elif SchoolFeeBySchool.objects.filter(SchoolFee_id=id).exists():
            status = False
            message = "Vous ne pouvez pas supprimer ce profil car li?? ?? au moins un niveau d'??tude"
        else:
            schoollfee = SchoolFee.objects.get(id=id)
            schoollfee.delete()
            message = "Suppression faite"

    if status:
        for data in SchoolFee.objects.all():
            item = {
                'id': data.id,
                'reference': data.reference,
                'wording': data.wording,
                'createdAt': data.createdAt.strftime('%d-%m-%Y'),
                'updatedAt': data.updatedAt.strftime('%d-%m-%Y')
            }
            schoolFeesList.append(item)
    return JsonResponse({'status': status, 'message': message, 'schoolFees': schoolFeesList})


# Get schooll fee details by susgraduationid
def GetSchoolFeeDetailsBySusgraduationId(request):
    status = True
    message = ""
    schoolfeedetails = []

    # Posted data
    susgraduationlevelid = request.POST.get('susgraduationlevelid')
    SchoolFeeDetailsProfileId = request.POST.get('SchoolFeeDetailsProfileId')

    if not susgraduationlevelid:
        status = False
        message = "Aucun niveau s??lectionn??"
    elif not request.session['AcademicYear']:
        status = False
        message = "Aucune ann??e scolaire active"
    elif not SusGraduationLevel.objects.filter(id=susgraduationlevelid).exists():
        status = False
        message = "Ce niveau n'existe plus"
    elif not SchoolFeeBySchool.objects.filter(SusGraduationLevel_id=susgraduationlevelid,
                                              AcademicYear_id=request.session['AcademicYear']).exists():
        status = False
        message = "Aucun details trouv?? pour " + str(SusGraduationLevel.objects.get(id=susgraduationlevelid).sigle)
    else:
        if not SchoolFeeDetailsProfileId:
            for data in SchoolFeeBySchool.objects.filter(SusGraduationLevel_id=susgraduationlevelid, School_id=request.session['School'],
                                                         AcademicYear_id=request.session['AcademicYear']):
                item = {
                    'id': data.id,
                    'AcademicYear': data.AcademicYear.wording,
                    'SusGraduationLevel': data.SusGraduationLevel.sigle,
                    'SchoolFeeProfile': data.SchoolFeeProfile.wording,
                    'SchoolFee': data.SchoolFee.wording,
                    'important': data.important,
                    'amount': data.amount
                }
                schoolfeedetails.append(item)
        else:
            for data in SchoolFeeBySchool.objects.filter(SusGraduationLevel_id=susgraduationlevelid, SchoolFeeProfile_id=SchoolFeeDetailsProfileId, School_id=request.session['School'],
                                                         AcademicYear_id=request.session['AcademicYear']):
                item = {
                    'id': data.id,
                    'AcademicYear': data.AcademicYear.wording,
                    'SusGraduationLevel': data.SusGraduationLevel.sigle,
                    'SchoolFeeProfile': data.SchoolFeeProfile.wording,
                    'SchoolFee': data.SchoolFee.wording,
                    'important': data.important,
                    'amount': data.amount
                }
                schoolfeedetails.append(item)
        message ="Message trouv??s"

    return JsonResponse({'status': status, 'message': message, 'schoolFeeDetails': schoolfeedetails})


# New school fee details
def SchoolFeeDetails(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == 'POST':
            status = True
            message = ""
            schoolFeeDetailsList = []
            SusGraduationSchoolFeeDetails = []

            # Posted data
            SchoolFeeDetailsId = request.POST.get('SchoolFeeDetailsId')
            SusGraduationLevelId = request.POST.get('SusGraduationLevelId')
            ProfileId = request.POST.get('ProfileId')
            FeeId = request.POST.get('FeeId')
            Amount = request.POST.get('Amount')
            Important = request.POST.get('Important')

            # TrAITEMENT
            if not ProfileId or not SusGraduationLevelId or not FeeId or not Amount or not Important:
                status = False
                message = "Des champs importants sont vides"
            elif not request.session['School']:
                status = False
                message = "Aucune ann??e scolaire active"
            else:
                # Nouvel enregistrement
                if not SchoolFeeDetailsId:
                    if SchoolFeeBySchool.objects.filter(SusGraduationLevel_id=SusGraduationLevelId,
                                                        SchoolFeeProfile_id=ProfileId,
                                                        SchoolFee_id=FeeId,
                                                        School_id=request.session['School'],
                                                        AcademicYear_id=request.session['AcademicYear']).exists():
                        status = False
                        message = "Vous avez d??j?? d??fini les details des frais pour ce niveau, ce profil et ce frais"
                    else:
                        important = True
                        if Important == '0':
                            important = False
                        SchoolFeeBySchool.objects.create(SusGraduationLevel_id=SusGraduationLevelId,
                                                         SchoolFeeProfile_id=ProfileId,
                                                         SchoolFee_id=FeeId,
                                                         School_id=request.session['School'],
                                                         AcademicYear_id=request.session['AcademicYear'],
                                                         important=important,
                                                         amount=Amount,
                                                         reference=ReferenceMaker('SFD-'))
                        message = "Les details du frais ont ??t?? enregistr??s"
                else:
                    if SchoolFeeBySchool.objects.filter(SusGraduationLevel_id=SusGraduationLevelId,
                                                        SchoolFeeProfile_id=ProfileId,
                                                        SchoolFee_id=FeeId,
                                                        School_id=request.session['School'],
                                                        AcademicYear_id=request.session['AcademicYear']).exclude(
                        id=SchoolFeeDetailsId).exists():
                        status = False
                        message = "Vous avez d??j?? d??fini des detais des frais pour ce niveau, ce profil et ce frais"
                    else:
                        schoolfeedetailsbyschool = SchoolFeeBySchool.objects.get(id=SchoolFeeDetailsId)
                        schoolfeedetailsbyschool.SusGraduationLevel_id = SusGraduationLevelId

                        schoolfeedetailsbyschool.SchoolFeeProfile_id = ProfileId
                        schoolfeedetailsbyschool.SchoolFee_id = FeeId
                        schoolfeedetailsbyschool.important = Important
                        schoolfeedetailsbyschool.amount = Amount
                        schoolfeedetailsbyschool.save()
                        message = "Les details du frais ont ??t?? enregistr??s"
                if status:
                    # Les details des frais par niveau
                    for data in SchoolFeeBySchool.objects.filter(SusGraduationLevel_id=SusGraduationLevelId,
                                                                 School_id=request.session['School'],
                                                                 AcademicYear_id=request.session['AcademicYear']):
                        item = {
                            'id': data.id,
                            'AcademicYear': data.AcademicYear.wording,
                            'SusGraduationLevel': data.SusGraduationLevel.sigle,
                            'SchoolFeeProfile': data.SchoolFeeProfile.wording,
                            'SchoolFee': data.SchoolFee.wording,
                            'important': data.important,
                            'amount': data.amount
                        }
                        SusGraduationSchoolFeeDetails.append(item)
                    # Tous les details des frais
                    for data in SchoolFeeBySchool.objects.filter(School_id=request.session['School'],
                                                                 AcademicYear_id=request.session['AcademicYear']):
                        item = {
                            'id': data.id,
                            'AcademicYear': data.AcademicYear.wording,
                            'SusGraduationLevel': data.SusGraduationLevel.sigle,
                            'SchoolFeeProfile': data.SchoolFeeProfile.wording,
                            'SchoolFee': data.SchoolFee.wording,
                            'important': data.important,
                            'amount': data.amount
                        }
                        schoolFeeDetailsList.append(item)
            return JsonResponse({'status': status, 'message': message, 'SusGraduationSchoolFeeDetails': SusGraduationSchoolFeeDetails,
                 'schoolFeeDetailsList': schoolFeeDetailsList})


# getg school fee details by id
def GetSchoolFeeDetailsById(request, id):
    status = True
    message = "Details trouve"
    item = None

    if not id:
        status = False
        message = "Aucun details de frais s??lectionn??"
    elif not SchoolFeeBySchool.objects.filter(id=id).exists():
        status = False
        message = "Cet details de frais n'existe plus"
    else:
        schoolfeedetails = SchoolFeeBySchool.objects.get(id=id)
        important = None
        if schoolfeedetails.important:
            important = '1'
        else:
            important = '0'
        item = {
            'id': schoolfeedetails.id,
            'AcademicYear': schoolfeedetails.AcademicYear_id,
            'SusGraduationLevel': schoolfeedetails.SusGraduationLevel_id,
            'SchoolFeeProfile': schoolfeedetails.SchoolFeeProfile_id,
            'SchoolFee': schoolfeedetails.SchoolFee_id,
            'important': important,
            'amount': schoolfeedetails.amount
        }
    return JsonResponse({'status': status, 'message': message, 'schoolFeeDetails': item})


# Delete schoollfeedetails by id
def DeleteSchoolFeeDetailsById(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = "Suppression faite"
        schoolFeeDetailsList = []

        if not id:
            status = False
            message = "Aucun details de frais s??lectionn??"
        elif not SchoolFeeBySchool.objects.filter(id=id).exists():
            status = False
            message = "Cet details de frais n'existe plus"
        elif InscriptionSchoolFee.objects.filter(SchoolFeeBySchool_id=id).exists():
            status = False
            message = "Impossible de supprimer ce details car li?? ?? au moins une inscription"
        else:
            schoolfeedetails = SchoolFeeBySchool.objects.get(id=id)
            schoolfeedetails.delete()

        if status:
            # Tous les details des frais
            for data in SchoolFeeBySchool.objects.filter(School_id=request.session['School'],
                                                         AcademicYear_id=request.session['AcademicYear']):
                item = {
                    'id': data.id,
                    'AcademicYear': data.AcademicYear.wording,
                    'SusGraduationLevel': data.SusGraduationLevel.sigle,
                    'SchoolFeeProfile': data.SchoolFeeProfile.wording,
                    'SchoolFee': data.SchoolFee.wording,
                    'important': data.important,
                    'amount': data.amount
                }
                schoolFeeDetailsList.append(item)
        return JsonResponse({'status': status, 'message': message, 'schoolFeeDetailsList': schoolFeeDetailsList})


# New inscription
def Inscriptions(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            newInscriptionsList = []

            # POsted data
            inscriptionId = request.POST.get('inscriptionId')
            studentId = request.POST.get('studentId')
            susGraduationLevelId = request.POST.get('susGraduationLevelId')
            SchoolFeeDetailsProfileId = request.POST.get('SchoolFeeDetailsProfileId')
            classeId = request.POST.get('classeId')
            inscriptionDate = request.POST.get('inscriptionDate')
            SchoolFeeIds = request.POST.getlist('SchoolFeeIds')

            # Traitement
            if not studentId or not susGraduationLevelId or not classeId or not inscriptionDate or not SchoolFeeIds:
                status = False
                message = "Des champs requis sont vides"
            else:
                if Inscription.objects.filter(AcademicYear_id=request.session['AcademicYear'],
                                              Student_id=studentId, School_id=request.session['School']).exists():
                    inscription = Inscription.objects.get(AcademicYear_id=request.session['AcademicYear'],
                                                          Student_id=studentId, School_id=request.session['School'])
                    status = False
                    message = "Cet apprenant est d??j?? inscrit pour cette ann??e acad??mique au degr?? " + str(
                        inscription.SusGraduationLevel.sigle)
                else:
                    newInscription = Inscription.objects.create(AcademicYear_id=request.session['AcademicYear'],
                                               SusGraduationLevel_id=susGraduationLevelId, SchoolFeeProfile_id=SchoolFeeDetailsProfileId,
                                               Student_id=studentId, School_id=request.session['School'],
                                               Classe_id=classeId,
                                               reference=ReferenceMaker('ISC-'), inscriptionDate=inscriptionDate)
                    # Enregistrement des frais de scolarite
                    for ids in SchoolFeeIds:
                        schoolfee = SchoolFeeBySchool.objects.get(id=ids)
                        InscriptionSchoolFee.objects.create(Inscription_id=newInscription.id, SchoolFeeBySchool_id=schoolfee.id,
                                                            amount=schoolfee.amount)
                    message = "Inscription enregistr??e"
            for inscription in Inscription.objects.filter(AcademicYear_id=request.session['AcademicYear'],
                                                          School_id=request.session['School'])[:100]:
                item = {
                    'id': inscription.id,
                    'student': str(inscription.Student),
                    'graduationLevel': str(inscription.SusGraduationLevel.GraduationLevel),
                    'susGraduationLevel': str(inscription.SusGraduationLevel),
                    'classe': str(inscription.Classe.wording),
                    'inscriptionDate': inscription.inscriptionDate,
                    'academicYear': inscription.AcademicYear.wording
                }
                newInscriptionsList.append(item)
            return JsonResponse({'status': status, 'message': message, 'inscriptions': newInscriptionsList})

        academicYear = ''
        inscriptions = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
            inscriptions = Inscription.objects.filter(AcademicYear_id=request.session['AcademicYear'],
                                                      School_id=request.session['School'])[:100]
        else:
            inscriptions = Inscription.objects.filter(School_id=request.session['School'])[:100]
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:10],
            'school': School.objects.get(id=request.session['School']),
            'inscriptions': inscriptions,
            'students': Learner.objects.filter(School_id=request.session['School'])[:100],
            'SusGraduationLevels': SusGraduationLevel.objects.all()[:100],
            'classes': Classe.objects.filter(School_id=request.session['School']),
            'SchoolFeesProfiles': SchoolFeeProfile.objects.all(),
        }
        return render(request, 'school/inscriptions/inscriptions.html', context)


# Student filter
def InscriptionStudentsFilter(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if request.method == 'GET':
            term = request.GET.get('term')
            studentsList = []

            if term:
                if request.session['AcademicYear']:
                    students = User.objects.filter(
                        Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term),
                        id__in=Learner.objects.filter(School_id=request.session['School']).values_list(
                            'User_id')).exclude(
                        id__in=Inscription.objects.filter(School_id=request.session['School'],
                                                          AcademicYear=request.session['AcademicYear']).values(
                            'Student_id')
                    )
                else:
                    students = User.objects.filter(
                        Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term),
                        id__in=Learner.objects.filter(School_id=request.session['School']).values_list(
                            'User_id')).exclude(
                        id__in=Inscription.objects.filter(School_id=request.session['School']).values('Student_id'))
                for student in students:
                    item = {
                        'id': student.id,
                        'fullname': str(student) + ' ' + student.phoneNumber + ' ' + student.email,
                        'phonenumber': student.phoneNumber
                    }
                    studentsList.append(item)
                return JsonResponse(studentsList, safe=False)
            else:
                return JsonResponse(studentsList, safe=False)


# Get incscription
def GetInscriptionById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucune inscrition s??lectionn??e"
    elif not Inscription.objects.filter(id=id).exists():
        status = False
        message = "Cette inscription n'existe plus"
    else:
        inscription = Inscription.objects.get(id=id)
        item = {
            'id': inscription.id,
            'student': str(inscription.Student),
            'graduationLevel': str(inscription.SusGraduationLevel.GraduationLevel),
            'susGraduationLevel': str(inscription.SusGraduationLevel),
            'classe': str(inscription.Classe.wording),
            'inscriptionDate': inscription.inscriptionDate,
            'academicYear': inscription.AcademicYear.wording
        }
    return JsonResponse({'status': status, 'message': message, 'inscription': item})


# get inscription details
def GetInscriptionDetailsById(request, id):
    status = True
    message = ""
    inscriptionItem = None
    schoolfees = []

    if not id:
        status = False
        message = "Aucune insciption s??lectionn??e"
    elif not Inscription.objects.filter(id=id).exists():
        status = False
        message = "Cette insciption n'existe plus"
    else:
        inscription = Inscription.objects.get(id=id)
        inscriptionItem = {
            'id': inscription.id,
            'student': str(inscription.Student),
            'graduationLevel': str(inscription.SusGraduationLevel.GraduationLevel),
            # 'susGraduationLevel': str(inscription.SusGraduationLevel),
            'classe': str(inscription.Classe.wording),
            'inscriptionDate': inscription.inscriptionDate,
            'academicYear': inscription.AcademicYear.wording,
            'date': inscription.inscriptionDate,
            'profile': inscription.SchoolFeeProfile.wording,
            'susgraduationlevel': inscription.SusGraduationLevel.sigle
        }
        for data in InscriptionSchoolFee.objects.filter(Inscription_id=id):
            item = {
                'id': data.id,
                'schoolFee': data.SchoolFeeBySchool.SchoolFee.wording,
                'amount': data.amount
            }
            schoolfees.append(item)
        return JsonResponse({'status': status, 'message': message, 'inscription': inscriptionItem, 'schoolFees': schoolfees})


# Delete inscription
def DeleteInscription(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        newInscriptionsList = []

        if not id:
            status = False
            message = "Aucune inscrition s??lectionn??e"
        elif not Inscription.objects.filter(id=id).exists():
            status = False
            message = "Cette inscription n'existe plus"
        else:
            inscription = Inscription.objects.get(id=id)
            inscription.delete()
            message = "Suppression faite"
        for inscription in Inscription.objects.filter(AcademicYear_id=request.session['AcademicYear'],
                                                      School_id=request.session['School'])[:100]:
            item = {
                'id': inscription.id,
                'student': str(inscription.Student),
                'graduationLevel': str(inscription.SusGraduationLevel.GraduationLevel),
                'susGraduationLevel': str(inscription.SusGraduationLevel),
                'classe': str(inscription.Classe.wording),
                'inscriptionDate': inscription.inscriptionDate,
                'academicYear': inscription.AcademicYear.wording
            }
            newInscriptionsList.append(item)
        return JsonResponse({'status': status, 'message': message, 'inscriptions': newInscriptionsList})


# Filter inscription
def FilterInscription(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        inscriptionsList = []

        susGraduationLevelId = request.POST.get('susGraduationLevelId')
        classeId = request.POST.get('classeId')
        inscriptionStartDate = request.POST.get('inscriptionStartDate')
        inscriptionEndDate = request.POST.get('inscriptionEndDate')
        print(request.POST)

        if request.session['AcademicYear']:
            for inscription in Inscription.objects.filter(AcademicYear_id=request.session['AcademicYear'],
                                                          School_id=request.session['School'],
                                                          Classe_id=classeId, inscriptionDate__gte=inscriptionStartDate,
                                                          inscriptionDate__lte=inscriptionEndDate)[:100]:
                item = {
                    'id': inscription.id,
                    'student': str(inscription.Student),
                    'graduationLevel': str(inscription.SusGraduationLevel.GraduationLevel),
                    'susGraduationLevel': str(inscription.SusGraduationLevel),
                    'classe': str(inscription.Classe.wording),
                    'inscriptionDate': inscription.inscriptionDate,
                    'academicYear': inscription.AcademicYear.wording
                }
                inscriptionsList.append(item)
        else:
            for inscription in Inscription.objects.filter(School_id=request.session['School'],
                                                          Classe_id=classeId, inscriptionDate__gte=inscriptionStartDate,
                                                          inscriptionDate__lte=inscriptionEndDate)[:100]:
                item = {
                    'id': inscription.id,
                    'student': str(inscription.Student),
                    'graduationLevel': str(inscription.SusGraduationLevel.GraduationLevel),
                    'susGraduationLevel': str(inscription.SusGraduationLevel),
                    'classe': str(inscription.Classe.wording),
                    'inscriptionDate': inscription.inscriptionDate,
                    'academicYear': inscription.AcademicYear.wording
                }
                inscriptionsList.append(item)
        return JsonResponse({'status': status, 'message': message, 'inscriptions': inscriptionsList})


# Message session ***************** Message session
# Message session ***************** Message session
# Message session ***************** Message session


# Send email to people
def SendEmailToPeople(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        # Declarations globales
        status = True
        message = ""

        # Donnees postees
        recievers = request.POST.getlist('recievers')
        emailSubject = request.POST.get('emailSubject')
        emailText = request.POST.get('emailText')
        recieverGroup = request.POST.get('recieverGroup')

        if not recievers or not emailSubject or not emailText or not recieverGroup:
            status = False
            message = 'Des champs importants sont vides'
        else:
            # Verifier si une configuration a ete activee
            if not EmailSetting.objects.filter(isActive=True, School_id=request.session['School']).exists():
                status = False
                message = "Vous n'avez aucune configuration d'evoi d'email active"
            else:
                emailsetting = EmailSetting.objects.get(isActive=True, School_id=request.session['School'])
                # Enregistrement du message et des details
                try:
                    with transaction.atomic():
                        # Enregistrement du message
                        newmessage = Message.objects.create(School_id=request.session['School'],
                                                            AcademicYear_id=request.session['AcademicYear'],
                                                            reference=ReferenceMaker('MSG-'), messageType="EMAIL",
                                                            recieverGroup=recieverGroup,
                                                            messageSubject=emailSubject, messageText=emailText,
                                                            messageDate=date.today(), messageHour=datetime.now(),
                                                            messageProvider=emailsetting.provider,
                                                            messageStatus="En attente",
                                                            creator=request.session['Worker'])

                        # Enregistrement des fichiers attach??s
                        if len(request.FILES) != 0:
                            emailFiles = request.FILES.getlist('emailFiles')
                            for file in emailFiles:
                                MessageAttachedFile.objects.create(Message_id=newmessage.id,
                                                                   School_id=request.session['School'],
                                                                   AcademicYear_id=request.session['AcademicYear'],
                                                                   fileType=file.content_type, fileName=file.name,
                                                                   file=file)

                        # Enregistrement des personnes a contacter
                        for user in User.objects.filter(id__in=recievers):
                            if user.email:
                                MessageRecieverDetails.objects.create(Message_id=newmessage.id,
                                                                      School_id=newmessage.School_id,
                                                                      AcademicYear_id=newmessage.AcademicYear_id,
                                                                      messageRecieverId_id=user.id,
                                                                      messageSubject=newmessage.messageSubject,
                                                                      messageText=newmessage.messageText,
                                                                      messageDate=newmessage.messageDate,
                                                                      messageHour=newmessage.messageHour,
                                                                      messageProvider=newmessage.messageProvider,
                                                                      messageStatus='En attente')
                        message = "Message enregistr??"
                except:
                    status = False
                    message = "Une erreur est survenue lors de l'enregistrement"

                # Si le nouveau message a ete cree alors proc??der aux envois en fonction du fournisseur d email activ??
                # Gmail setting active
                if status and newmessage:
                    if emailsetting.provider == "Gmail":
                        gmailsetting = GmailSetting.objects.get(School_id=request.session['School'])
                        if gmailsetting.loginEmail and gmailsetting.loginPassword:
                            send_Gmail_Email_To_People(newmessage.id).start()

        return JsonResponse({'status': status, 'message': message})


# Send sms to people
def SendSmsToPeople(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        # Declarations globales
        status = True
        message = ""

        # Posted data
        recievers = request.POST.getlist('recievers')
        smsSubject = request.POST.get('smsSubject')
        smsText = request.POST.get('smsText')
        recieverGroup = request.POST.get('recieverGroup')

        if not recievers or not smsSubject or not smsText or not recieverGroup:
            status = False
            message = "Des champs importants sont vides"
        else:
            # Verifier si une configuration a ete activee
            if not SmsSetting.objects.filter(isActive=True).exists():
                status = False
                message = "Vous n'avez aucune configuration d'envoi de sms active"
            else:
                smssetting = SmsSetting.objects.get(isActive=True, School_id=request.session['School'])
                # Enregistrement du message et des details
                try:
                    with transaction.atomic():
                        newmessage = Message.objects.create(School_id=request.session['School'],
                                                            AcademicYear_id=request.session['AcademicYear'],
                                                            reference=ReferenceMaker('MSG-'),
                                                            messageType="SMS",
                                                            recieverGroup=recieverGroup,
                                                            messageSubject=smsSubject,
                                                            messageText=smsText,
                                                            messageDate=date.today(),
                                                            messageHour=datetime.now(),
                                                            messageProvider=smssetting.provider,
                                                            messageStatus="En attente", )

                        # Enregistrement des personnes a contacter
                        for user in User.objects.filter(id__in=recievers):
                            if user.email:
                                MessageRecieverDetails.objects.create(Message_id=newmessage.id,
                                                                      School_id=newmessage.School_id,
                                                                      AcademicYear_id=newmessage.AcademicYear_id,
                                                                      messageRecieverId_id=user.id,
                                                                      messageSubject=newmessage.messageSubject,
                                                                      messageText=newmessage.messageText,
                                                                      messageDate=newmessage.messageDate,
                                                                      messageHour=newmessage.messageHour,
                                                                      messageProvider=newmessage.messageProvider,
                                                                      messageStatus='En attente')
                        message = "Votre message a ??t?? enregistr??"
                except:
                    status = False
                    message = "Une erreur est survenue lors de l'enregistrement"

                # Si le nouveau message a ete cree alors proc??der aux envois en fonction du fournisseur d email activ??
                # Sms zedeka setting active
                if status and newmessage:
                    if smssetting.provider == "SMS Zedeka":
                        smszedekasetting = SmsZedekaSetting.objects.get(School_id=request.session['School'])
                        if smszedekasetting.APIkey and smszedekasetting.clientId and smszedekasetting.senderId:
                            send_SmsZedeka_Sms_To_People(newmessage.id).start()

        return JsonResponse({'status': status, 'message': message})


# Send whatsapp message to somebody
def SendWhatsappMessageToSomebody(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""

        message = request.POST.get('whatsappMessage')
        phoneNumber = request.POST.get('phoneNumber')

        if not message or not phoneNumber:
            status = False
            message = "Des champs importants sont vides"
        else:
            import pywhatkit
            pywhatkit.sendwhatmsg_instantly(
                phone_no="+" + str(phoneNumber),
                message=message,
            )
            message = "Message envoy??"
        return JsonResponse({'status': status, 'message': message})


# Get message details
def getMessageDetailsById(request, id):
    status = True
    message = ""
    messagefound = {}
    classes = []
    personsContacted = []
    files = []

    if not id:
        status = False
        message = "Aucun message s??lectionn??"
    elif not Message.objects.filter(id=id).exists():
        status = False
        message = "Ce message n'existe plus"
    else:
        message_ = Message.objects.get(id=id)
        messagefound = {
            'id': message_.id,
            'reference': message_.reference,
            'messageType': message_.messageType,
            'messageProvider': message_.messageProvider,
            'messageSubject': message_.messageSubject,
            'message': message_.messageText,
            'messageDate': message_.messageDate,
            'messageHour': message_.messageHour.strftime('%H:%m'),
            'messageStatus': message_.messageStatus
        }
        # Les classes
        for classe in MessageClasseConcerned.objects.filter(Message_id=id):
            item = {
                'id': classe.Classe_id,
                'wording': classe.Classe.wording,
                'graduation': classe.Classe.SusGraduationLevel.wording
            }
            classes.append(item)
        # les personnes contactes
        for user in MessageRecieverDetails.objects.filter(Message_id=id):
            item = {
                'id': user.messageRecieverId.id,
                'fullname': str(user.messageRecieverId),
                'gender': user.messageRecieverId.gender,
                'phoneNumber': user.messageRecieverId.phoneNumber,
                'email': user.messageRecieverId.email,
                'messageStatus': user.messageStatus
            }
            personsContacted.append(item)
        # Les fichiers
        for file in MessageAttachedFile.objects.filter(Message_id=id):
            item = {
                'fileType': file.fileType,
                'fileName': file.fileName,
                'path': file.file.url
            }
            files.append(item)
    return JsonResponse({'status': status, 'message': message, 'messagefound': messagefound, 'classes': classes,
                         'personsContacted': personsContacted, 'files': files})


# Get message by id
def getMessageById(request, id):
    if is_ajax(request) and request.method == "GET":
        status = True
        message = ""
        item = {}

        if not id:
            status = False
            message = "Aucun message s??lectionn??"
        elif not Message.objects.filter(id=id).exists():
            status = False
            message = "Ce message n'existe plus"
        else:
            message_ = Message.objects.get(id=id)
            item = {
                'id': message_.id,
                'reference': message_.reference,
                'messageType': message_.messageType,
                'messageProvider': message_.messageProvider,
                'messageSubject': message_.messageSubject,
                'messageDate': message_.messageDate,
                'messageHour': message_.messageHour.strftime('%H:%m'),
                'messageStatus': message_.messageStatus
            }
    return JsonResponse({'status': status, 'message': message, 'message': item})


# delete message by id
def deleteMessageById(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""

        if not id:
            status = False
            message = "Aucun message s??lectionn??"
        elif not Message.objects.filter(id=id).exists():
            status = False
            message = "Ce message n'existe plus"
        else:
            message_ = Message.objects.get(id=id)
            # supprimer les fichiers ajout??s si il  en existe
            if MessageAttachedFile.objects.filter(Message_id=id).exists():
                for item in MessageAttachedFile.objects.filter(Message_id=id):
                    try:
                        os.remove(item.file.path)
                    except:
                        pass
            message_.delete()

    return JsonResponse({'status': status, 'message': message})


# End Message session ***************** End Message session
# End Message session ***************** End Message session
# End Message session ***************** End Message session


# Tutors
def Tutors(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            tutorsList = []

            # Posted datas
            # Identit??
            tutorId = request.POST.get('tutorId')
            lastName = request.POST.get('lastName')
            firstName = request.POST.get('firstName')
            gender = request.POST.get('gender')
            avatar = request.FILES.get('avatar')
            # Naissance
            birthDate = request.POST.get('birthDate')
            birthCountry = request.POST.get('birthCountry')
            birthTown = request.POST.get('birthTown')
            nationality = request.POST.get('nationality')
            # Localisation
            livingCountry = request.POST.get('livingCountry')
            livingTown = request.POST.get('livingTown')
            address = request.POST.get('livingAddress')
            email = request.POST.get('email')
            profession = request.POST.get('profession')
            companyName = request.POST.get('companyName')
            phoneNumber = request.POST.get('phoneNumber')

            # Lien avec les etablissement
            schoolId = request.session['School']

            # Traitement
            if not lastName or not firstName or not gender:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not tutorId:
                    if email and User.objects.filter(email=email).exists():
                        status = False
                        message = "L'adresse mail " + email + " est d??j?? attribu??"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exists():
                        status = False
                        message = "Le num??ro de t??l??phone " + phoneNumber + " est d??j?? attribu??"
                    else:
                        if not avatar:
                            avatar = 'avatar.png'
                        searchField = lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        newUser = User.objects.create(reference=ReferenceMaker('USR-'),
                                                      lastName=lastName.upper(), firstName=firstName.title(),
                                                      gender=gender, avatar=avatar,
                                                      birthDate=birthDate,
                                                      birthCountry=birthCountry.upper(), birthTown=birthTown.title(),
                                                      nationality=nationality.upper(),
                                                      livingCountry=livingCountry.upper(),
                                                      livingTown=livingTown.title(), address=address,
                                                      email=email, phoneNumber=phoneNumber,
                                                      password=make_password('00000', 'sha512'),
                                                      searchField=searchField, companyName=companyName,
                                                      profession=profession)
                        # Lien tutor
                        TutorAffiliationFeaturing.objects.create(Tutor_id=newUser.id,
                                                                 School_id=request.session['School'])

                        if gender == "Homme":
                            message = "Le tuteur " + str(newUser) + " a ??t?? enregistr??"
                        else:
                            message = "La tutrice " + str(newUser) + " a ??t?? enregistr??e"
                else:
                    if email and User.objects.filter(email=email).exclude(id=tutorId).exists():
                        status = False
                        message = "L'adresse mail " + email + " est d??j?? attribu??"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exclude(id=tutorId).exists():
                        status = False
                        message = "Le num??ro de t??l??phone " + phoneNumber + " est d??j?? attribu??"
                    else:
                        user = User.objects.get(id=tutorId)
                        searchField = lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        user.lastName = lastName.upper()
                        user.firstName = firstName.title()
                        user.gender = gender
                        if avatar:
                            user.avatar = avatar
                        user.birthDate = birthDate
                        user.birthCountry = birthCountry.upper()
                        user.birthTown = birthTown.title()
                        user.nationality = nationality.upper()
                        user.livingCountry = livingCountry.upper()
                        user.livingTown = livingTown.title()
                        user.address = address
                        user.email = email
                        user.phoneNumber = phoneNumber
                        user.searchField = searchField
                        user.profession = profession
                        user.companyName = companyName
                        user.save()
                        if gender == "Homme":
                            message = "Le tuteur " + str(user) + " a ??t?? enregistr??"
                        else:
                            message = "La tutrice " + str(user) + " a ??t?? enregistr??e"
                        if not TutorAffiliationFeaturing.objects.filter(Tutor_id=user.id, isActive=True).exists():
                            # Lien tutor
                            TutorAffiliationFeaturing.objects.create(Tutor_id=user.id,
                                                                     School_id=request.session['School'])

            if status:
                tutorsId = []
                for item in TutorAffiliationFeaturing.objects.filter(School_id=request.session['School'],
                                                                     isActive=True).distinct()[:100]:
                    tutorsId.append(item.Tutor_id)
                for tutor in User.objects.filter(id__in=tutorsId):
                    item = {
                        'id': tutor.id,
                        'matricule': tutor.matricule,
                        'reference': tutor.reference,
                        'fullName': str(tutor),
                        'gender': tutor.gender,
                        'address': tutor.address,
                        'email': tutor.email,
                        'phoneNumber': tutor.phoneNumber,
                        'isActive': tutor.isActive,
                        'avatar': tutor.avatar.url
                    }
                    tutorsList.append(item)
            return JsonResponse({'status': status, 'message': message, 'tutors': tutorsList})

        tutorsId = []
        for item in TutorAffiliationFeaturing.objects.filter(School_id=request.session['School'],
                                                             isActive=True).distinct()[:100]:
            tutorsId.append(item.Tutor_id)
        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:10],
            'school': School.objects.get(id=request.session['School']),
            'tutors': User.objects.filter(id__in=list(tutorsId)),
            'tutorAffiliations': TutorAffiliation.objects.all()
        }
        return render(request, 'school/tutors/Tutors.html', context)


# Tutor details
def TutorDetails(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:10],
            'school': School.objects.get(id=request.session['School']),
            'tutor': User.objects.get(id=id),
            'TutorStudents': TutorAffiliationFeaturing.objects.filter(Tutor_id=id, Student_id__isnull=False),
            'tutorAffiliations': TutorAffiliation.objects.all()
        }
        return render(request, 'school/tutors/TutorsDetails.html', context)


# Delete tutor
def DeleteTutor(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        tutorsList = []

        if not id:
            status = False
            message = "Aucune personne s??lectionn??e"
        elif not User.objects.filter(id=id).exists():
            status = False
            message = "Cette personne n'existe plus"
        elif not TutorAffiliationFeaturing.objects.filter(Tutor_id=id).exists():
            status = False
            message = "Cette personne n'est li??e ?? aucun apprenant"
        else:
            for link in TutorAffiliationFeaturing.objects.filter(Tutor_id=id):
                link.isActive = False
                link.endDate = date.today()
                link.save()
            message = "Suppression faite"

        if status:
            tutorsId = TutorAffiliationFeaturing.objects.filter(School_id=request.session['School'],
                                                                isActive=True).values('Tutor_id').distinct()[:100]
            for tutor in User.objects.filter(id__in=tutorsId):
                item = {
                    'id': tutor.id,
                    'matricule': tutor.matricule,
                    'reference': tutor.reference,
                    'fullName': str(tutor),
                    'gender': tutor.gender,
                    'address': tutor.address,
                    'email': tutor.email,
                    'phoneNumber': tutor.phoneNumber,
                    'isActive': tutor.isActive,
                    'avatar': tutor.avatar.url
                }
                tutorsList.append(item)
        return JsonResponse({'status': status, 'message': message, 'tutors': tutorsList})


# Student filter withe safe
def TutorFilterWithSafe(request):
    if request.method == 'GET':
        status = True
        message = "Aucun r??sultat trouv??"
        term = request.GET.get('term')
        tutorsList = []
        tutorsId = []

        if term:
            for item in TutorAffiliationFeaturing.objects.filter(School_id=request.session['School'],
                                                                 isActive=True).distinct():
                tutorsId.append(item.Tutor_id)
            tutors = User.objects.filter(Q(searchField__startswith=term) |
                                         Q(searchField__contains=term) |
                                         Q(searchField__endswith=term), id__in=tutorsId).exclude(
                id__in=Learner.objects.filter(School_id=request.session['School']).values('User_id'))[:100]
            for tutor in tutors:
                item = {
                    'id': tutor.id,
                    'matricule': tutor.matricule,
                    'reference': tutor.reference,
                    'fullName': str(tutor),
                    'gender': tutor.gender,
                    'address': tutor.address,
                    'phoneNumber': tutor.phoneNumber,
                    'isActive': tutor.isActive,
                    'school': School.objects.get(id=request.session['School']).sigle,
                    'avatar': tutor.avatar.url
                }
                tutorsList.append(item)
        else:
            for item in TutorAffiliationFeaturing.objects.filter(School_id=request.session['School'],
                                                                 isActive=True).distinct()[:100]:
                tutorsId.append(item.Tutor_id)
            print(tutorsId)
            tutors = User.objects.filter(id__in=tutorsId)[:100]
            for tutor in tutors:
                item = {
                    'id': tutor.id,
                    'matricule': tutor.matricule,
                    'reference': tutor.reference,
                    'fullName': str(tutor),
                    'gender': tutor.gender,
                    'address': tutor.address,
                    'phoneNumber': tutor.phoneNumber,
                    'isActive': tutor.isActive,
                    'school': School.objects.get(id=request.session['School']).sigle,
                    'avatar': tutor.avatar.url
                }
                tutorsList.append(item)

        if tutorsList:
            message = str(len(tutorsList)) + " r??sultats trouv??s"
            return JsonResponse({'status': status, 'message': message, 'tutors': tutorsList})
        else:
            return JsonResponse({'status': status, 'message': message, 'tutors': tutorsList})


# Filter tutors
def FilterTutors(request):
    term = request.GET.get('term')
    tutorsList = []

    if term:
        tutors = ''
        tutors = User.objects.filter(
            Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term)).exclude(
            id__in=Learner.objects.filter(School_id=request.session['School']).values('User_id'))[:100]
        for tutor in tutors:
            item = {
                'id': tutor.id,
                'fullname': str(tutor) + ' ' + tutor.phoneNumber + ' ' + tutor.email,
                'name': str(tutor),
                'email': str(tutor.email),
                'phoneNumber': tutor.phoneNumber
            }
            tutorsList.append(item)
        return JsonResponse(tutorsList, safe=False)
    else:
        return JsonResponse(tutorsList, safe=False)


# Get tutors students
def GetTutorStudents(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        studentTutorsList = []
        item = ''

        if not id:
            status = False
            message = "Aucun tuteur s??lectionn??"
        elif not User.objects.filter(id=id).exists():
            status = False
            message = "Cet tuteur n'existe plus"
        else:

            for student in TutorAffiliationFeaturing.objects.filter(Tutor_id=id, Student_id__isnull=False):
                item = {
                    'tutorId': TutorAffiliationFeaturing.objects.get(Tutor_id=id, Student_id__isnull=True).Tutor_id,
                    'tutorName': str(User.objects.get(id=id)),
                    'id': student.id,
                    'fullname': str(student.Student),
                    'gender': student.Student.gender,
                    'phoneNumber': student.Student.phoneNumber,
                    'affiliation': student.TutorAffiliation.wording
                }
                studentTutorsList.append(item)

            if not studentTutorsList:
                item = {
                    'tutorId': id,
                    'tutorName': str(User.objects.get(id=id))
                }
                studentTutorsList.append(item)
                status = False
                message = "Aucun apprenant li??"
        if status:
            return JsonResponse({'status': status, 'message': message, 'studentTutors': studentTutorsList})
        else:
            return JsonResponse({'status': status, 'message': message, 'studentTutors': item})


# Get student tutors
def GetStudentTutors(request, id):
    status = True
    message = ""
    studentTutorsList = []

    if not id:
        status = False
        message = "Aucun apprenant s??lectionn??"
    elif not User.objects.filter(id=id).exists():
        status = False
        message = "Cet apprenant n'existe plus"
    else:
        for tutor in TutorAffiliationFeaturing.objects.filter(student_id=id):
            item = {
                'id': tutor.Tutor.id,
                'fullname': str(tutor.Tutor),
                'gender': tutor.Tutor.gender,
                'phoneNumber': tutor.Tutor.phoneNumber,
                'affiliation': tutor.TutorAffiliation.wording
            }
            studentTutorsList.append(item)
    return JsonResponse({'status': status, 'message': message, 'studentTutors': studentTutorsList})


# Send emails to classes students tutors
def SendEmailTotutorsByClasses(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":

            # Les declarations globales
            status = True
            message = ""
            tutorsMessages = []

            # Les donn??es post??es
            classes = request.POST.getlist('classes')  # Liste des salles de classes
            emailSubject = request.POST.get('emailSubject')  # Objet de l email
            emailText = request.POST.get('emailText')  # Text de l email

            # Debut du traitement
            if not classes or not emailSubject or not emailText:
                status = False
                message = "Des champs importants sont vides"
            else:
                # Verifier si une configuration a ete activee
                if not EmailSetting.objects.filter(isActive=True, School_id=request.session['School']).exists():
                    status = False
                    message = "Vous n'avez aucune configuration d'evoi d'email active"
                else:
                    emailsetting = EmailSetting.objects.get(isActive=True, School_id=request.session['School'])
                    # Enregistrement du message et des details
                    try:
                        with transaction.atomic():
                            # Enregistrement du message
                            newmessage = Message.objects.create(School_id=request.session['School'],
                                                                AcademicYear_id=request.session['AcademicYear'],
                                                                reference=ReferenceMaker('MSG-'), messageType="EMAIL",
                                                                recieverGroup="Tuteurs",
                                                                messageSubject=emailSubject, messageText=emailText,
                                                                messageDate=date.today(), messageHour=datetime.now(),
                                                                messageProvider=emailsetting.provider,
                                                                messageStatus="En attente",
                                                                creator=request.session['Worker'])

                            # Enregistrement des salles de classes
                            classesId = ""
                            if 'All' in classes:  # Si l utilisateur selectionne toutes les classes
                                classesId = Inscription.objects.filter(School_id=request.session['School'],
                                                                       AcademicYear_id=request.session[
                                                                           'AcademicYear']).values(
                                    'Classe_id').distinct()
                                for classe in Classe.objects.filter(id__in=classesId):
                                    MessageClasseConcerned.objects.create(Message_id=newmessage.id, Classe_id=classe.id)
                            else:  # Si l utilisateur precise les classes concern??es
                                for classe in classes:
                                    MessageClasseConcerned.objects.create(Message_id=newmessage.id, Classe_id=classe)

                            # Enregistrement des fichiers attach??s
                            if len(request.FILES) != 0:
                                emailFiles = request.FILES.getlist('emailFiles')
                                for file in emailFiles:
                                    MessageAttachedFile.objects.create(Message_id=newmessage.id,
                                                                       School_id=request.session['School'],
                                                                       AcademicYear_id=request.session['AcademicYear'],
                                                                       fileType=file.content_type, fileName=file.name,
                                                                       file=file)
                    except:
                        status = False
                        message = "Une erreur est survenue lors de l'enregistrement"

                    # Si le nouveau message a ete cree alors proc??der aux envois en fonction du fournisseur d email activ??
                    # Gmail setting active
                    if status and newmessage:
                        if emailsetting.provider == "Gmail":
                            gmailsetting = GmailSetting.objects.get(School_id=request.session['School'])
                            if gmailsetting.loginEmail and gmailsetting.loginPassword:
                                saveTutorEmailByClassStufs(newmessage.id).start()
                    # End Gmail setting active

        return JsonResponse({'status': status, 'message': message, 'tutorsMessages': tutorsMessages})


# send sms to tutors
def SendSmsTotutorsByClasses(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        tutorsMessages = []
        if is_ajax(request) and request.method == "POST":
            # Posted data
            classes = request.POST.getlist('classes')
            smsSubject = request.POST.get('smsSubject')
            smsText = request.POST.get('smsText')

            if not classes or not smsSubject or not smsText:
                status = False
                message = "Des champs importants sont vides"
            else:
                # Verifier si une configuration a ete activee
                if not SmsSetting.objects.filter(isActive=True).exists():
                    status = False
                    message = "Vous n'avez aucune configuration d'envoi de sms active"
                else:
                    smssetting = SmsSetting.objects.get(isActive=True, School_id=request.session['School'])
                    # Enregistrement du message et des details
                    try:
                        with transaction.atomic():
                            newmessage = Message.objects.create(School_id=request.session['School'],
                                                                AcademicYear_id=request.session['AcademicYear'],
                                                                reference=ReferenceMaker('MSG-'),
                                                                messageType="SMS",
                                                                recieverGroup="Tuteurs",
                                                                messageSubject=smsSubject,
                                                                messageText=smsText,
                                                                messageDate=date.today(),
                                                                messageHour=datetime.now(),
                                                                messageProvider=smssetting.provider,
                                                                messageStatus="En attente", )

                            # Salles de classes concernes
                            classesId = ""
                            if 'All' in classes:
                                classesId = Inscription.objects.filter(School_id=request.session['School'],
                                                                       AcademicYear_id=request.session[
                                                                           'AcademicYear']).values(
                                    'Classe_id').distinct()
                                for classe in Classe.objects.filter(id__in=classesId):
                                    MessageClasseConcerned.objects.create(Message_id=newmessage.id, Classe_id=classe.id)
                            else:
                                for classe in classes:
                                    MessageClasseConcerned.objects.create(Message_id=newmessage.id, Classe_id=classe)
                            message = "Votre message a ??t?? enregistr??"
                    except:
                        status = False
                        message = "Une erreur est survenue lors de l'enregistrement"

                    # Si le nouveau message a ete cree alors proc??der aux envois en fonction du fournisseur d email activ??
                    # Sms zedeka setting active
                    if status and newmessage:
                        if smssetting.provider == "SMS Zedeka":
                            smszedekasetting = SmsZedekaSetting.objects.get(School_id=request.session['School'])
                            if smszedekasetting.APIkey and smszedekasetting.clientId and smszedekasetting.senderId:
                                saveTutorSmsByClassStufs(newmessage.id).start()

                    # Fin envoi sms zedeka

        # if status:
        #     # Recuerer la la liste des messages
        #     for message_ in Message.objects.filter(School_id=request.session['School'],
        #                                            AcademicYear_id=request.session['AcademicYear'])[:100]:
        #         item = {
        #             'id': message_.id,
        #             'messageType': message_.messageType,
        #             'messageProvider': message_.messageProvider,
        #             'messageSubject': message_.messageSubject,
        #             'messageDate': message_.messageDate,
        #             'messageHour': message_.messageHour.strftime('%H:%m'),
        #             'messageStatus': message_.messageStatus
        #         }
        #         tutorsMessages.append(item)
        return JsonResponse({'status': status, 'message': message, 'tutorsMessages': tutorsMessages})


# Link tutor and student
def LinkStudentTutor(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        studentTutorsList = []  # Liste des tuteurs d un apprennant
        tutorsStudentList = []  # liste des apprenant d un tuteur
        if is_ajax(request) and request.method == "POST":
            # Posted data
            tutorAffiliationFeaturingId = request.POST.get('tutorAffiliationFeaturingId')
            tutorId = request.POST.get('tutorId')
            studentId = request.POST.get('studentId')
            tutorAffiliationId = request.POST.get('tutorAffiliationId')

            # Traitement
            if not tutorId or not studentId or not tutorAffiliationId:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not tutorAffiliationFeaturingId:
                    if studentId == tutorId:
                        status = False
                        message = "Un apprenant ne peut ??tre son propre tuteur"
                    elif TutorAffiliationFeaturing.objects.filter(Student_id=studentId,
                                                                  Tutor_id__exact=tutorId).exists():
                        status = False
                        message = "Cet apprenant et ce tuteur sont d??j?? li??s"
                    else:
                        # si le tuteur n avait pas ete ajoute aux tueurs au prealable alorsle faire avant la liaison a l enfant
                        if not TutorAffiliationFeaturing.objects.filter(TutorAffiliation_id__isnull=True,
                                                                        School_id=request.session['School'],
                                                                        Tutor_id=tutorId).exists():
                            TutorAffiliationFeaturing.objects.create(Tutor_id=tutorId,
                                                                     School_id=request.session['School'])

                        # Lier le tuteur et l enfant
                        TutorAffiliationFeaturing.objects.create(TutorAffiliation_id=tutorAffiliationId,
                                                                 School_id=request.session['School'],
                                                                 Student_id=studentId, Tutor_id=tutorId)
                        message = "Liaison ??tablie"
                else:
                    if studentId == tutorId:
                        status = False
                        message = "Un apprenant ne peut ??tre son propre tuteur"
                    elif TutorAffiliationFeaturing.objects.filter(Student_id=studentId, isActive=True,
                                                                  Tutor_id__exact=tutorId).exclude(
                        id=tutorAffiliationFeaturingId).exists():
                        status = False
                        message = "Cet apprenant et ce tuteur sont d??j?? li??s"
                    else:
                        tutorLink = TutorAffiliationFeaturing.objects.get(id=tutorAffiliationFeaturingId)
                        tutorLink.TutorAffiliation_id = tutorAffiliationId
                        tutorLink.Student_id = studentId
                        tutorLink.Tutor_id = tutorId
                        tutorLink.save()
                        message = "Liaison ??tablie"

            if status:
                # Liste des tuteurs d un apprennant
                for data in TutorAffiliationFeaturing.objects.filter(Student_id=studentId):
                    item = {
                        'id': data.id,
                        'tutorId': data.Tutor.id,
                        'fullname': str(data.Tutor),
                        'gender': data.Tutor.gender,
                        'phoneNumber': data.Tutor.phoneNumber,
                        'affiliation': data.TutorAffiliation.wording
                    }
                    studentTutorsList.append(item)
                # Liste des apprenants d un tuteur
                for data in TutorAffiliationFeaturing.objects.filter(Tutor_id=tutorId, Student_id__isnull=False):
                    item = {
                        'id': data.id,
                        'fullname': str(data.Student),
                        'studentId': data.Student_id,
                        'gender': data.Student.gender,
                        'phoneNumber': data.Student.phoneNumber,
                        'affiliation': data.TutorAffiliation.wording
                    }
                    tutorsStudentList.append(item)
        return JsonResponse({'status': status, 'message': message, 'studentTutors': studentTutorsList,
                             'tutorStudents': tutorsStudentList})


# Get tutor link by id
def GetTutorLinkById(request, id):
    status = True
    message = ""
    item = ''

    if not id:
        status = False
        message = "Aucun lien s??lectionn??"
    elif not TutorAffiliationFeaturing.objects.filter(id=id).exists():
        status = False
        message = "Ce lien n'existe plus"
    else:
        tutorlink = TutorAffiliationFeaturing.objects.get(id=id)
        item = {
            'id': tutorlink.id,
            'tutorId': tutorlink.Tutor_id,
            'tutorFullName': str(tutorlink.Tutor) + ' ' + tutorlink.Tutor.phoneNumber + ' ' + tutorlink.Tutor.email,
            'studentId': tutorlink.Student_id,
            'studentFullName': str(
                tutorlink.Student) + ' ' + tutorlink.Student.phoneNumber + ' ' + tutorlink.Student.email,
            'tutorAffiliationId': tutorlink.TutorAffiliation_id,
            'linkwording': tutorlink.TutorAffiliation.wording
        }

    return JsonResponse({'status': status, 'message': message, 'tutorLink': item})


# Remove tutorlik
def RemovetutorStudentLink(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        studentTutorsList = []
        tutorsStudentList = []
        studentId = None
        tutorId = None

        if not id:
            status = False
            message = "Aucun lien s??lectionn??"
        elif not TutorAffiliationFeaturing.objects.filter(id=id).exists():
            status = False
            message = "Ce lien n'existe plus"
        else:
            tutorLink = TutorAffiliationFeaturing.objects.get(id=id)
            studentId = tutorLink.Student_id
            tutorId = tutorLink.Tutor_id
            tutorLink.delete()
            message = "Suppression faite"
        if status:
            # Liste des tuteurs d un apprennant
            for data in TutorAffiliationFeaturing.objects.filter(Student_id=studentId):
                item = {
                    'id': data.id,
                    'tutorId': data.Tutor.id,
                    'fullname': str(data.Tutor),
                    'gender': data.Tutor.gender,
                    'phoneNumber': data.Tutor.phoneNumber,
                    'affiliation': data.TutorAffiliation.wording
                }
                studentTutorsList.append(item)
            # Liste des apprenants d un tuteur
            for data in TutorAffiliationFeaturing.objects.filter(Tutor_id=tutorId, Student_id__isnull=False):
                item = {
                    'id': data.id,
                    'fullname': str(data.Student),
                    'studentId': data.Student_id,
                    'gender': data.Student.gender,
                    'phoneNumber': data.Student.phoneNumber,
                    'affiliation': data.TutorAffiliation.wording
                }
                tutorsStudentList.append(item)
        return JsonResponse({'status': status, 'message': message, 'studentTutors': studentTutorsList,
                             'tutorStudents': tutorsStudentList})


# Tutors message
def TutorsMessages(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        classesId = ''
        classes = ''
        tutorsMessages = ""

        if request.session['AcademicYear']:
            classesId = Inscription.objects.filter(School_id=request.session['School'],
                                                   AcademicYear_id=request.session['AcademicYear']).values(
                'Classe_id').distinct()
            classes = Classe.objects.filter(id__in=classesId)

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
            tutorsMessages = Message.objects.filter(School_id=request.session['School'],
                                                    AcademicYear=request.session['AcademicYear'],
                                                    recieverGroup="Tuteurs")[:100]
        else:
            tutorsMessages = Message.objects.filter(School_id=request.session['School'], recieverGroup="Tuteurs")[:100]
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'classes': classes,
            'tutorsMessages': tutorsMessages
        }
        return render(request, 'school/tutors/TutorsMessages.html', context)


# rechercher les messages des tuteurs
def FilterTutorsMessages(request):
    status = True
    message = ""
    tutorsMessagesList = []

    # Datas
    startDate = request.GET.get('searchStartDate')
    endDate = request.GET.get('searchEndDate')
    messageStatus = request.GET.get('searchMessageStatus')
    messageType = request.GET.get('searchMessageType')
    print(request.GET)
    print(startDate)
    print(endDate)
    print(messageStatus)
    print(messageType)

    # Traitements
    for message_ in Message.objects.filter(School_id=request.session['School'], recieverGroup="Tuteurs",
                                           messageType__startswith=messageType,
                                           messageStatus__startswith=messageStatus, messageDate__gte=startDate,
                                           messageDate__lte=endDate):
        item = {
            'id': message_.id,
            'reference': message_.reference,
            'messageType': message_.messageType,
            'messageProvider': message_.messageProvider,
            'messageSubject': message_.messageSubject,
            'messageDate': message_.messageDate,
            'messageHour': message_.messageHour.strftime('%H:%m'),
            'messageStatus': message_.messageStatus
        }
        tutorsMessagesList.append(item)
    if status:
        message = str(len(tutorsMessagesList)) + " ??l??ment(s) trouv??(s)"
    else:
        message = "Acucun ??l??ment trouv??"

    return JsonResponse({'status': status, 'message': message, 'messages': tutorsMessagesList})


# School
def SchoolInformations(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""

            # Posted data
            schoolId = request.POST.get('schoolId')
            denomination = request.POST.get('denomination')
            sigle = request.POST.get('sigle')
            phoneNumber = request.POST.get('phoneNumber')
            email = request.POST.get('email')
            livingCountry = request.POST.get('livingCountry')
            livingTown = request.POST.get('livingTown')
            address = request.POST.get('address')

            if not schoolId or not denomination or not sigle or not phoneNumber or not email or not livingCountry or not livingTown or not address:
                status = False
                message = "Des champs requis sont vides"
            else:
                if School.objects.filter(sigle__exact=sigle).exclude(id=schoolId).exists():
                    status = False
                    message = "Le sigle " + sigle + " est d??j?? attribu?? ?? une autre ??cole"
                else:
                    school = School.objects.get(id=schoolId)
                    school.denomination = denomination
                    school.sigle = sigle
                    school.phoneNumber = phoneNumber
                    school.email = email
                    school.livingCountry = livingCountry
                    school.livingTown = livingTown
                    school.address = address
                    school.save()
                    message = "Les informations ont ??t?? enregistr??es"
            return JsonResponse({'status': status, 'message': message})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School'])
        }
        return render(request, 'school/School.html', context)


# SMS Email settings
def SmsEmailSettings(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:

        # Create default settings

        # Email section
        # Gmail
        if not EmailSetting.objects.filter(provider__exact='Gmail', School_id=request.session['School']).exists():
            newEmailSetting = EmailSetting.objects.create(provider='Gmail', School_id=request.session['School'])
        if not GmailSetting.objects.filter(School_id=request.session['School'],
                                           EmailSetting=EmailSetting.objects.get(provider__exact='Gmail')).exists():
            GmailSetting.objects.create(School_id=request.session['School'],
                                        EmailSetting=EmailSetting.objects.get(provider='Gmail'), loginEmail='',
                                        loginPassword='')

        # Sms section
        # Sms Zedeka
        if not SmsSetting.objects.filter(provider__exact='SMS Zedeka', School_id=request.session['School']).exists():
            newsmssetting = SmsSetting.objects.create(provider='SMS Zedeka', School_id=request.session['School'])
        if not SmsZedekaSetting.objects.filter(School_id=request.session['School'], SmsSetting=SmsSetting.objects.get(
                provider__exact='SMS Zedeka')).exists():
            SmsZedekaSetting.objects.create(School_id=request.session['School'],
                                            SmsSetting=SmsSetting.objects.get(provider__exact='SMS Zedeka'),
                                            APIkey='', clientId='', senderId='')

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'emailSettings': EmailSetting.objects.all(),
            'smsSettings': SmsSetting.objects.all()
        }
        return render(request, 'school/EmailSmsSettings.html', context)


# Email settings
def EmailSettings(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            emailSettings = []
            provider = request.POST.get('provider')

            # Gmail
            if provider == "Gmail":
                gmailSettingId = request.POST.get('gmailSettingId')
                gmailEmail = request.POST.get('gmailEmail')
                gmailPassword = request.POST.get('gmailPassword')

                # Traitement
                if not gmailEmail or not gmailPassword:
                    status = False
                    message = "Des champs requis sont vides"
                else:
                    gmailsetting = GmailSetting.objects.get(id=gmailSettingId)
                    gmailsetting.loginEmail = gmailEmail
                    gmailsetting.loginPassword = gmailPassword
                    gmailsetting.save()
                    message = "Les  informations ont ??t?? enregistr??es"

            if status:
                for setting in EmailSetting.objects.filter(School_id=request.session['School']):
                    item = {
                        'id': setting.id,
                        'provider': setting.provider,
                        'createdAt': setting.createdAt.strftime('%d-%m-%Y'),
                        'updatedAt': setting.updatedAt.strftime('%d-%m-%Y'),
                        'isActive': setting.isActive
                    }
                    emailSettings.append(item)
            return JsonResponse({'status': status, 'message': message, 'emailSettings': emailSettings})


# Test gmail server connexion
def testEmailServerConnexion(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        print(id)
        status = True
        message = ""

        if not id:
            status = False
            message = "Aucune configuration s??lectionn??e"
        else:
            emailsetting = EmailSetting.objects.get(id=id)
            # Si on verifie la configuration de gmail
            if emailsetting.provider == "Gmail":
                gmailSettingId = request.POST.get('gmailSettingId')
                gmailsetting = GmailSetting.objects.get(EmailSetting_id=id)
                if not gmailsetting.loginEmail or not gmailsetting.loginPassword:
                    status = False
                    message = "Des informations de connexion sont manquantes"
                else:
                    try:
                        context = ssl.create_default_context()
                        server = smtplib.SMTP('smtp.gmail.com', 587)
                        server.ehlo()
                        server.starttls(context=context)
                        server.ehlo()
                        server.login(gmailsetting.loginEmail, gmailsetting.loginPassword)
                        message = "Connexion ??tablie avec success"
                    except:
                        status = False
                        message = "Connexion impossible, assurez-vous que vous ??tes connect?? ?? internet et que les param??tres de connexion soient corrects"
    return JsonResponse({'status': status, 'message': message})


# Activate deactivate email setting
def ActivateDeactivateEmailSetting(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        emailSettings = []

        if not id:
            status = False
            message = "Aucune configurations s??lectionn??e"
        else:
            for setting in EmailSetting.objects.filter(School_id=request.session['School']).exclude(id=id):
                setting.isActive = False
                setting.save()

            setting = EmailSetting.objects.get(id=id)
            if setting.isActive:
                setting.isActive = False
            else:
                setting.isActive = True
            setting.save()
            message = "Op??ration faite"

        if status:
            for setting in EmailSetting.objects.filter(School_id=request.session['School']):
                item = {
                    'id': setting.id,
                    'provider': setting.provider,
                    'createdAt': setting.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': setting.updatedAt.strftime('%d-%m-%Y'),
                    'isActive': setting.isActive
                }
                emailSettings.append(item)
        return JsonResponse({'status': status, 'message': message, 'emailSettings': emailSettings})


# Get email setting
def GetEmailSetting(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucune configuration s??lectionn??e"
    else:
        config = EmailSetting.objects.get(id=id)

        # Gmail
        if config.provider == "Gmail":
            gmailsetting = GmailSetting.objects.get(EmailSetting_id=id, School_id=request.session['School'])
            item = {
                'id': gmailsetting.id,
                'emailSettingId': gmailsetting.EmailSetting_id,
                'provider': gmailsetting.EmailSetting.provider,
                'loginEmail': gmailsetting.loginEmail,
                'loginPassword': gmailsetting.loginPassword
            }
            message = "Configuration gmail trouv??e"

    return JsonResponse({'status': status, 'message': message, 'emailConfig': item})


# Sms settings
def SmsSettings(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        smsSettings = []
        if is_ajax(request) and request.method == 'POST':
            provider = request.POST.get('provider')
            if provider == "SMS Zedeka":
                smszedekaSettingId = request.POST.get('smszedekaSettingId')
                APIkey = request.POST.get('APIkey')
                clientId = request.POST.get('clientId')
                senderId = request.POST.get('senderId')

                setting = SmsZedekaSetting.objects.get(id=smszedekaSettingId)
                setting.APIkey = APIkey
                setting.clientId = clientId
                setting.senderId = senderId
                setting.save()
                message = "Les  informations ont ??t?? enregistr??es"

        if status:
            for setting in SmsSetting.objects.filter(School_id=request.session['School']):
                item = {
                    'id': setting.id,
                    'provider': setting.provider,
                    'createdAt': setting.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': setting.updatedAt.strftime('%d-%m-%Y'),
                    'isActive': setting.isActive
                }
                smsSettings.append(item)
        return JsonResponse({'status': status, 'message': message, 'smsSettings': smsSettings})


# Activate deactivate sms setting
def ActivateDeactivateSMSSetting(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        smsSettings = []

        if not id:
            status = False
            message = "Aucune configurations s??lectionn??e"
        else:
            for setting in SmsSetting.objects.filter(School_id=request.session['School']).exclude(id=id):
                setting.isActive = False
                setting.save()

            setting = SmsSetting.objects.get(id=id)
            if setting.isActive:
                setting.isActive = False
            else:
                setting.isActive = True
            setting.save()
            message = "Op??ration faite"

        if status:
            for setting in SmsSetting.objects.filter(School_id=request.session['School']):
                item = {
                    'id': setting.id,
                    'provider': setting.provider,
                    'createdAt': setting.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': setting.updatedAt.strftime('%d-%m-%Y'),
                    'isActive': setting.isActive
                }
                smsSettings.append(item)
        return JsonResponse({'status': status, 'message': message, 'smsSettings': smsSettings})


# Get sms setting
def GetSMSSetting(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucune configuration s??lectionn??e"
    else:
        config = SmsSetting.objects.get(id=id)

        # Gmail
        if config.provider == "SMS Zedeka":
            smszedekasetting = SmsZedekaSetting.objects.get(SmsSetting_id=id, School_id=request.session['School'])
            item = {
                'id': smszedekasetting.id,
                'smsSettingId': smszedekasetting.SmsSetting_id,
                'provider': smszedekasetting.SmsSetting.provider,
                'APIkey': smszedekasetting.APIkey,
                'clientId': smszedekasetting.clientId,
                'senderId': smszedekasetting.senderId
            }
            message = "Configuration gmail trouv??e"

    return JsonResponse({'status': status, 'message': message, 'smsConfig': item})


# Imporations sections

# Get importation  By id
def getImportationById(request, id):
    status = True
    message = ""
    item = ""

    if not id:
        status = False
        message = "Aucune importation s??lectionn??e"
    elif not Importation.objects.filter(id=id).exists():
        status = False
        message = "Cette importation n'existe plus"
    else:
        importation = Importation.objects.get(id=id)
        item = {
            'reference': importation.reference,
            'id': importation.id,
            'AcademicYear': importation.AcademicYear.wording,
            'file': importation.file.path
        }
    return JsonResponse({'status': status, 'message': message, 'importation': item})


# Importation details
def ImportationDetails(request, id):
    status = True
    message = ""
    importa = ''
    graduationLevels = []
    susGaduationsLevels = []
    classes = []
    studentsList = []

    if not id:
        status = False
        message = "Aucune importation s??lectionn??e"
    elif not Importation.objects.filter(id=id).exists():
        status = False
        message = "Cette importation n'existe plus"
    else:
        importation = Importation.objects.get(id=id)
        importa = {
            'reference': importation.reference,
            'id': importation.id,
            'importationfor': importation.importationfor,
            'Date': importation.Date,
            'Hour': importation.Hour,
            'importationStatus': importation.importationStatus,
            'importationReport': importation.importationReport,
            'AcademicYear': importation.AcademicYear.wording,
            'file': importation.file.path
        }

        if importation.importationfor == "GraduationsLevels":
            for graduationlevel in GraduationLevel.objects.filter(Importation_id=id):
                item = {
                    'reference': graduationlevel.reference,
                    'wording': graduationlevel.wording
                }
                graduationLevels.append(item)
            for item in SusGraduationLevel.objects.filter(Importation_id=id):
                item = {
                    'graduation': item.GraduationLevel.wording,
                    'sigle': item.sigle,
                    'wording': item.wording
                }
                susGaduationsLevels.append(item)
            return JsonResponse(
                {'status': status, 'message': message, 'importation': importa, 'graduationLevels': graduationLevels,
                 'susgraduationlevels': susGaduationsLevels})

        elif importation.importationfor == "Classes":
            for classe in Classe.objects.filter(Importation_id=id):
                item = {
                    'id': classe.id,
                    'reference': classe.reference,
                    'GraduationLevel': str(classe.SusGraduationLevel.GraduationLevel),
                    'SusGraduationLevel': str(classe.SusGraduationLevel),
                    'SusGraduationLevelId': classe.SusGraduationLevel_id,
                    'wording': classe.wording,
                    'capacity': classe.capacity
                }
                classes.append(item)
            return JsonResponse({'status': status, 'message': message, 'importation': importa, 'classes': classes})
        elif importation.importationfor == "Students":
            for students in User.objects.filter(Importation_id=id):
                item = {
                    'id': students.id,
                    'matricule': students.matricule,
                    'reference': students.reference,
                    'fullName': str(students),
                    'gender': students.gender,
                    'address': students.address,
                    'phoneNumber': students.phoneNumber,
                    'isActive': students.isActive,
                    'school': importation.School.sigle,
                    'avatar': students.avatar.url
                }
                studentsList.append(item)
            return JsonResponse(
                {'status': status, 'message': message, 'importation': importa, 'students': studentsList})


# Delete graduation levels importation
def deleteImportation(request, id):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = "test"
        importationsList = []
        if not id:
            status = False
            message = "Aucune importation s??lectionn??e"
        elif not Importation.objects.filter(id=id).exists():
            status = False
            message = "Cette importation n'existe plus"
        elif GraduationLevel.objects.filter(Importation_id=id).exists():
            for graduation in GraduationLevel.objects.filter(Importation_id=id):
                if SusGraduationLevel.objects.filter(GraduationLevel_id=graduation.id).exists():
                    status = False
                    message = "Vous ne pouvez pas supprimer cette importations car est li??e ?? des donn??es importantes"
                    break
        elif SusGraduationLevel.objects.filter(Importation_id=id).exists():
            for susgraduation in SusGraduationLevel.objects.filter(Importation_id=id):
                if Classe.objects.filter(SusGraduationLevel_id=susgraduation.id).exists():
                    status = False
                    message = "Vous ne pouvez pas supprimer cette importations car est li??e ?? des donn??es importantes"
                    break
        elif Classe.objects.filter(Importation_id=id).exists():
            for classe in Classe.objects.filter(Importation_id=id):
                if Inscription.objects.filter(Classe_id=classe.id).exists():
                    status = False
                    message = "Vous ne pouvez pas supprimer cette importations car est li??e ?? des donn??es importantes"
                    break
        elif User.objects.filter(Importation_id=id).exists():
            for student in User.objects.filter(Importation_id=id):
                if Inscription.objects.filter(Student_id=student.id).exists():
                    status = False
                    message = "Vous ne pouvez pas supprimer cette importations car est li??e ?? des donn??es importantes"

        if status:
            importation = Importation.objects.get(id=id)
            os.remove(importation.file.path)
            importation.delete()
            message = "Suppression faite"
            for importation in Importation.objects.filter(School_id=request.session['School'],
                                                          importationfor="GraduationsLevels")[:100]:
                item = {
                    'reference': importation.reference,
                    'id': importation.id,
                    'AcademicYear': importation.AcademicYear.wording,
                    'date': str(importation.Date),
                    'heure': str(importation.Hour),
                    'file': importation.file.path,
                    'status': importation.importationStatus
                }
                importationsList.append(item)

        return JsonResponse({'status': status, 'message': message, 'importations': importationsList})


# handle_uploaded_file(path, importationFile)
# fn = os.path.basename(importationFile.name)
# open(fn, 'wb').write(importationFile.file.read(250000))
# locationpath = '\\media\\ImportationsFiles\\'
# currentDirectoryPath = os.path.abspath(os.curdir)
# finalpath = currentDirectoryPath + locationpath
# handle_uploaded_file(finalpath, importationFile)
# Graduarions importations
def GraduationsLevelsImporations(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        importationsList = []

        if is_ajax(request) and request.method == "POST":
            if len(request.FILES) != 0:
                importationFile = request.FILES.get('importationFile')
                if not importationFile.name.endswith('.xlsx'):
                    status = False
                    message = "Le fichier charg?? n'est pas du format Excel"
                else:
                    # Enregistrement de l importation
                    newImportation = Importation.objects.create(School_id=request.session['School'],
                                                                AcademicYear_id=request.session['AcademicYear'],
                                                                reference=ReferenceMaker('IMP-'),
                                                                importationStatus="En attente de traitement",
                                                                importationfor="GraduationsLevels",
                                                                file=importationFile,
                                                                Date=date.today(), Hour=datetime.now())
                    GraduationsLevelsImportation(newImportation.id).start()
                    message = "Fichier d'importation enregistr??, le traitement est en cours"
                    # importations list
                    for importation in Importation.objects.filter(School_id=request.session['School'],
                                                                  importationfor="GraduationsLevels")[:100]:
                        item = {
                            'reference': importation.reference,
                            'id': importation.id,
                            'AcademicYear': importation.AcademicYear.wording,
                            'date': str(importation.Date),
                            'heure': str(importation.Hour),
                            'file': importation.file.path,
                            'status': importation.importationStatus
                        }
                        importationsList.append(item)
            else:
                status = False
                message = "Aucun fichier n'a ??t?? charg??"

            return JsonResponse({'status': status, 'message': message, 'importations': importationsList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'Importations': Importation.objects.filter(School_id=request.session['School'],
                                                       importationfor="GraduationsLevels"),
            'tutorAffiliations': TutorAffiliation.objects.all()
        }
        return render(request, 'school/imporations/graduationsimportations.html', context)

    # Classes importations


def classesImportation(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        importationsList = []

        if is_ajax(request) and request.method == "POST":
            if len(request.FILES) != 0:
                importationFile = request.FILES.get('importationFile')
                if not importationFile.name.endswith('.xlsx'):
                    status = False
                    message = "Le fichier charg?? n'est pas du format Excel"
                else:
                    # Enregistrement de l importation
                    newImportation = Importation.objects.create(School_id=request.session['School'],
                                                                AcademicYear_id=request.session['AcademicYear'],
                                                                reference=ReferenceMaker('IMP-'),
                                                                importationStatus="En attente de traitement",
                                                                importationfor="Classes",
                                                                file=importationFile,
                                                                Date=date.today(), Hour=datetime.now())
                    ClasseImportation(newImportation.id).start()
                    message = "Fichier d'importation enregistr??, le traitement est en cours"
                    # importations list
                    for importation in Importation.objects.filter(School_id=request.session['School'],
                                                                  importationfor="Classes")[:100]:
                        item = {
                            'reference': importation.reference,
                            'id': importation.id,
                            'AcademicYear': importation.AcademicYear.wording,
                            'date': str(importation.Date),
                            'heure': str(importation.Hour),
                            'file': importation.file.path,
                            'status': importation.importationStatus
                        }
                        importationsList.append(item)
            else:
                status = False
                message = "Aucun fichier n'a ??t?? charg??"

            return JsonResponse({'status': status, 'message': message, 'importations': importationsList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'Importations': Importation.objects.filter(School_id=request.session['School'],
                                                       importationfor="Classes"),
            'tutorAffiliations': TutorAffiliation.objects.all()
        }
        return render(request, 'school/imporations/classesimportations.html', context)


# Students importation
def studentsImportation(request):
    if 'Worker' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'??tes pas connect??(e)"})
        else:
            return redirect('school:Authentication')
    else:
        status = True
        message = ""
        importationsList = []
        if is_ajax(request) and request.method == "POST":
            if len(request.FILES) != 0:
                importationFile = request.FILES.get('importationFile')
                if not importationFile.name.endswith('.xlsx'):
                    status = False
                    message = "Le fichier charg?? n'est pas du format Excel"
                else:
                    # Enregistrement de l importation
                    newImportation = Importation.objects.create(School_id=request.session['School'],
                                                                AcademicYear_id=request.session['AcademicYear'],
                                                                reference=ReferenceMaker('IMP-'),
                                                                importationStatus="En attente de traitement",
                                                                importationfor="Students",
                                                                file=importationFile,
                                                                Date=date.today(), Hour=datetime.now())
                    StudentsImportation(newImportation.id).start()
                    message = "Fichier d'importation enregistr??, le traitement est en cours"
                    # importations list
                    for importation in Importation.objects.filter(School_id=request.session['School'],
                                                                  importationfor="Students")[:100]:
                        item = {
                            'reference': importation.reference,
                            'id': importation.id,
                            'AcademicYear': importation.AcademicYear.wording,
                            'date': str(importation.Date),
                            'heure': str(importation.Hour),
                            'file': importation.file.path,
                            'status': importation.importationStatus
                        }
                        importationsList.append(item)
            else:
                status = False
                message = "Aucun fichier n'a ??t?? charg??"

            return JsonResponse({'status': status, 'message': message, 'importations': importationsList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Worker': User.objects.get(id=request.session['Worker']),
            'UserGroup': UserGroup.objects.get(reference=request.session['WorkerGroup']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'school': School.objects.get(id=request.session['School']),
            'Importations': Importation.objects.filter(School_id=request.session['School'],
                                                       importationfor="Students"),
            'tutorAffiliations': TutorAffiliation.objects.all()
        }
        return render(request, 'school/imporations/studentsimportations.html', context)
