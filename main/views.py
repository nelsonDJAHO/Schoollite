from datetime import datetime, date
from http.client import HTTPResponse

from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import *


# Create your views here.

# Reference constructor
def ReferenceMaker(sigle):
    time = datetime.now()
    datepart = str(date.today().year) + str(date.today().month) + str(date.today().day)
    reference = sigle + str(datepart) + "-" + str(time.strftime("%H%M%S"))
    return reference


# First initialisation
def FirstInitialisatiion():
    # Les enregistrement de base

    # les informations de l entreprise
    if not MainSchool.objects.all():
        MainSchool.objects.create(denomination="Schoollite", sigle="SC-LT", logo='yourlogo.png')

    # Les groupes d utilisateurs
    if not UserGroup.objects.filter(reference='ADMIN').exists():
        UserGroup.objects.create(reference='ADMIN', wording='Administrateur')

    # Le premier utilisateur Administrateur
    if not User.objects.filter(UserGroup_id=UserGroup.objects.get(reference="ADMIN")).exists():
        time = datetime.now()
        datepart = str(date.today().year) + str(date.today().month) + str(date.today().day)
        reference = "USR-" + str(datepart) + "-" + str(time.strftime("%H%M%S"))
        User.objects.create(reference=reference, UserGroup=UserGroup.objects.get(reference='ADMIN'),
                            lastName='Administrateur', firstName='Administrateur',
                            email='admin@admin.com', password=make_password('admin', 'sha512'))

    # Les Affiliation
    if not TutorAffiliation.objects.filter(wording='Grand père').exists():
        TutorAffiliation.objects.create(wording='Grand père')
    if not TutorAffiliation.objects.filter(wording='Grand mère').exists():
        TutorAffiliation.objects.create(wording='Grand mère')
    if not TutorAffiliation.objects.filter(wording='Père').exists():
        TutorAffiliation.objects.create(wording='Père')
    if not TutorAffiliation.objects.filter(wording='Mère').exists():
        TutorAffiliation.objects.create(wording='Mère')
    if not TutorAffiliation.objects.filter(wording='Frère').exists():
        TutorAffiliation.objects.create(wording='Frère')
    if not TutorAffiliation.objects.filter(wording='Soeur').exists():
        TutorAffiliation.objects.create(wording='Soeur')
    if not TutorAffiliation.objects.filter(wording='Oncle').exists():
        TutorAffiliation.objects.create(wording='Oncle')
    if not TutorAffiliation.objects.filter(wording='Tante').exists():
        TutorAffiliation.objects.create(wording='Tante')
    if not TutorAffiliation.objects.filter(wording='Parrain').exists():
        TutorAffiliation.objects.create(wording='Parrain')
    if not TutorAffiliation.objects.filter(wording='Marraine').exists():
        TutorAffiliation.objects.create(wording='Marraine')
    if not TutorAffiliation.objects.filter(wording='Neuveu').exists():
        TutorAffiliation.objects.create(wording='Neuveu')
    if not TutorAffiliation.objects.filter(wording='Nièce').exists():
        TutorAffiliation.objects.create(wording='Nièce')
    if not TutorAffiliation.objects.filter(wording='Cousin').exists():
        TutorAffiliation.objects.create(wording='Cousin')
    if not TutorAffiliation.objects.filter(wording='Cousine').exists():
        TutorAffiliation.objects.create(wording='Cousine')
    if not TutorAffiliation.objects.filter(wording='Tuteur').exists():
        TutorAffiliation.objects.create(wording='Tuteur')
    if not TutorAffiliation.objects.filter(wording='Tutrice').exists():
        TutorAffiliation.objects.create(wording='Tutrice')


# update connected user informations
def UserLogged(request):
    if 'Admin' in request.session:
        user = User.objects.get(id=request.session['User'])
        request.session['AdminGroup'] = user.UserGroup.reference


# Ajax request
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


# authentication page
def Authentication(request):
    FirstInitialisatiion()

    if not 'Admin' in request.session:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""

            # Posted data
            email = request.POST.get('email')
            password = request.POST.get('password')

            # Traitement
            if not email or not password:
                status = False
                message = "Des champs requis sont vides"
            else:
                if User.objects.filter(email=email).exists():
                    userFound = User.objects.get(email=email)
                    if check_password(password, userFound.password):
                        if userFound.isActive:
                            if userFound.UserGroup and userFound.UserGroup.reference == "ADMIN":
                                request.session['Admin'] = str(userFound.id)
                                request.session['AdminGroup'] = str(userFound.UserGroup.reference)
                                request.session['lockDown'] = False
                                request.session['School'] = None
                                if AcademicYear.objects.filter(isActive=True).exists():
                                    request.session['AcademicYear'] = str(AcademicYear.objects.get(isActive=True).id)
                                else:
                                    request.session['AcademicYear'] = ""
                                message = "Vous êtes connecté(e)"
                            else:
                                message = "Accès refusé"
                        else:
                            status = False
                            message = "Votre compte est désactivé"
                    else:
                        status = False
                        message = "Identifiants incorrects"
                else:
                    status = False
                    message = "Identifiants incorrects"

            return JsonResponse({'status': status, 'message': message})

        context = {
            'mainSchool': MainSchool.objects.all()[0]
        }
        return render(request, 'main/Authentication.html', context)
    else:
        if request.session['AdminGroup'] == 'ADMIN':
            return redirect('main:Dashboard')


# Enregistrement d un utilisateur
def SaveUser(request):
    if is_ajax(request) and request.method == "POST":
        status = True
        message = ""

        # Posted datas
        userGroupId = request.POST.get('userGroupId')
        # Identité
        userId = request.POST.get('userId')
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
        # Les fonctions des tuteurs
        profession = request.POST.get('profession')
        companyName = request.POST.get('companyName')
        # Administration member
        isAdministrationMember = request.POST.get('isAdministrationMember')
        if isAdministrationMember == 'on':
            isAdministrationMember = True
        else:
            isAdministrationMember = False
        hiringDate = request.POST.get('hiringDate')

        # Traitement
        if not lastName or not firstName or not gender:
            status = False
            message = "Des champs requis sont vides"
        else:
            if not userId:
                if matricule and User.objects.filter(matricule=matricule).exists():
                    status = False
                    message = "Le matricule " + matricule + " est déjà attribué"
                elif email and User.objects.filter(email=email).exists():
                    status = False
                    message = "L'adresse mail " + email + " est déjà attribué"
                elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exists():
                    status = False
                    message = "Le numéro de téléphone " + phoneNumber + " est déjà attribué"
                else:
                    if not avatar:
                        avatar = 'avatar.png'
                    User.objects.create(reference=ReferenceMaker('USR-'), matricule=matricule, lastName=lastName,
                                        firstName=firstName, gender=gender, avatar=avatar, birthDate=birthDate,
                                        birthCountry=birthCountry, birthTown=birthTown, nationality=nationality,
                                        livingCountry=livingCountry, livingTown=livingTown, address=address,
                                        profession=profession, companyName=companyName, email=email,
                                        phoneNumber=phoneNumber,
                                        password=make_password('admin', 'sha512'),
                                        isAdministrationMember=isAdministrationMember, hiringDate=hiringDate)
                    message = ""
            else:
                if matricule and User.objects.filter(matricule=matricule).exclude(id=userId).exists():
                    status = False
                    message = "Le matricule " + matricule + " est déjà attribué"
                elif email and User.objects.filter(email=email).exclude(id=userId).exists():
                    status = False
                    message = "L'adresse mail " + email + " est déjà attribué"
                elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exclude(id=userId).exists():
                    status = False
                    message = "Le numéro de téléphone " + phoneNumber + " est déjà attribué"
                else:
                    user = User.objects.get(id=userId)
                    matricule = matricule
                    user.lastName = lastName,
                    user.firstName = firstName
                    user.gender = gender
                    if avatar:
                        user.avatar = avatar
                    user.birthDate = birthDate,
                    user.birthCountry = birthCountry
                    user.birthTown = birthTown
                    user.nationality = nationality
                    user.livingCountry = livingCountry
                    user.livingTown = livingTown
                    user.address = address,
                    user.profession = profession
                    user.companyName = companyName
                    user.email = email
                    user.phoneNumber = phoneNumber,
                    user.isAdministrationMember = isAdministrationMember
                    user.hiringDate = hiringDate
                    user.save()


# Get User
def getUserById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucune personne sélectionnée"
    elif not User.objects.filter(id=id).exists():
        status = False
        message = "Cette personne n'existe plus"
    else:
        user = User.objects.get(id=id)
        item = {
            'id': user.id,
            'reference': user.reference,
            'matricule': user.matricule,
            'lastName': user.lastName,
            'firstName': user.firstName,
            'fullName': str(user),
            'gender': user.gender,
            'avatar': user.avatar.url,
            'birthDate': user.birthDate,
            'birthCountry': user.birthCountry,
            'birthTown': user.birthTown,
            'nationality': user.nationality,
            'livingCountry': user.livingCountry,
            'livingTown': user.livingTown,
            'address': user.address,
            'profession': user.profession,
            'companyName': user.companyName,
            'email': user.email,
            'phoneNumber': user.phoneNumber,
            'hiringDate': user.hiringDate
        }
    return JsonResponse({'status': status, 'message': message, 'user': item})


# Gestion des informations du profil connecté
def Profile(request):
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
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
                    message = "l'adresse mail " + email + " est déjà attribuée"
                elif User.objects.filter(phoneNumber=phoneNumber).exclude(id=userId).exists():
                    status = False
                    message = "Le numéro de téléphone " + phoneNumber + " est déjà attribué"
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
                    message = "Vos informations ont été enregistrées"

            return JsonResponse({'status': status, 'message': message})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
        }
        return render(request, 'main/Profile.html', context)


# Password update
def passwordUpdate(request):
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            print(request.POST)
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
                message = "Le mot de passe a été changé"
            else:
                status = False
                message = "L'ancien mot de passe ne correspond pas"

            return JsonResponse({'status': status, 'message': message})


# Logout
def LogOut(request):
    if 'Admin' in request.session:
        del request.session['Admin']
        if request.session['AdminGroup']:
            del request.session['AdminGroup']
        if request.session['lockDown']:
            del request.session['lockDown']
        if request.session['AcademicYear']:
            del request.session['AcademicYear']
        if request.session['School']:
            del request.session['School']
        return redirect('main:Authentication')
    else:
        return redirect('main:Authentication')


# Enterprise
def Enterprise(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == 'POST':
            print(request.POST)
            status = True
            message = "Les données ont été enregistrées"

            # Posted data
            mainschoolId = request.POST.get('mainschoolId')
            denomination = request.POST.get('denomination')
            sigle = request.POST.get('sigle')
            livingCountry = request.POST.get('livingCountry')
            livingTown = request.POST.get('livingTown')
            address = request.POST.get('address')
            phoneNumber = request.POST.get('phoneNumber')
            phoneNumber1 = request.POST.get('phoneNumber1')
            email = request.POST.get('email')
            postBox = request.POST.get('postBox')
            logo = request.FILES.get('logo')
            # Opening times
            monday = request.POST.get('monday')
            tuesday = request.POST.get('tuesday')
            wednesday = request.POST.get('wednesday')
            thursday = request.POST.get('thursday')
            friday = request.POST.get('friday')
            saturday = request.POST.get('saturday')

            status = True
            message = "Les données ont été enregistrées"

            if not denomination or not sigle or not livingCountry or not livingTown or not address or not phoneNumber or not phoneNumber1 or not email or not postBox:
                status = False
                message = "Des champs requis sont vides"
            elif not monday or not tuesday or not wednesday or not thursday or not friday or not saturday:
                status = False
                message = "Des champs requis sont vides"
            # elif not validate_email(email):
            #     status = False
            #     message = "L'adresse mail " + email + " n'est pas valide"
            else:
                if mainschoolId:
                    mainschool = MainSchool.objects.get(id=mainschoolId)
                    mainschool.denomination = denomination
                    mainschool.sigle = sigle
                    if logo:
                        mainschool.logo = logo
                    mainschool.phoneNumber = phoneNumber
                    mainschool.phoneNumber1 = phoneNumber1
                    mainschool.email = email
                    mainschool.livingCountry = livingCountry.upper()
                    mainschool.livingTown = livingTown.title()
                    mainschool.address = address.title()
                    mainschool.postBox = postBox
                    mainschool.day1 = 'Lundi'
                    mainschool.duration1 = monday
                    mainschool.day2 = 'Mardi'
                    mainschool.duration2 = tuesday
                    mainschool.day3 = 'Mercredi'
                    mainschool.duration3 = wednesday
                    mainschool.day4 = 'Jeudi'
                    mainschool.duration4 = thursday
                    mainschool.day5 = 'Vendredi'
                    mainschool.duration5 = friday
                    mainschool.day6 = 'Samedi'
                    mainschool.duration6 = saturday
                    mainschool.save()
                    message = "Les informations de l'entreprise ont été enregistrées"
            return JsonResponse({'status': status, 'message': message})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
        }
        return render(request, 'main/Enterprise.html', context)


# Dashboard
def Dashboard(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        # Les données de l entreprise
        # Nombre d etablissement
        schoolsCount = School.objects.all().count()
        # Nombre d'apprenants
        studentsCount = Learner.objects.all().count()
        # Nombre des professeurs
        professorsCount = Teacher.objects.all().count()
        # Nombre de classes
        classesCount = Classe.objects.all().count()
        # Nombre des membres du personnel administratif
        administrationMembersCount = AdministrationMember.objects.values_list('User').distinct().count()

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'schoolsCount': schoolsCount,
            'studentsCount': studentsCount,
            'professorsCount': professorsCount,
            'classesCount': classesCount,
            'administrationMembersCount': administrationMembersCount
        }
        return render(request, 'main/Dashboard.html', context)


# Administrators
def Administrators(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            print(request.POST)
            status = True
            message = ""
            newAdmins = []

            # Posted datas
            userGroupId = UserGroup.objects.get(reference='ADMIN').id
            # Identité
            adminId = request.POST.get('adminId')
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

            # Traitement
            if not lastName or not firstName or not gender:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not adminId:
                    if email and User.objects.filter(email=email).exists():
                        status = False
                        message = "L'adresse mail " + email + " est déjà attribué"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exists():
                        status = False
                        message = "Le numéro de téléphone " + phoneNumber + " est déjà attribué"
                    else:
                        if not avatar:
                            avatar = 'avatar.png'
                        searchField = lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        newUser = User.objects.create(UserGroup_id=userGroupId, reference=ReferenceMaker('USR-'),
                                                      lastName=lastName.upper(), firstName=firstName.title(),
                                                      gender=gender, avatar=avatar, birthDate=birthDate,
                                                      birthCountry=birthCountry.upper(), birthTown=birthTown.title(),
                                                      nationality=nationality.upper(),
                                                      livingCountry=livingCountry.upper(),
                                                      livingTown=livingTown.title(), address=address,
                                                      email=email, phoneNumber=phoneNumber,
                                                      password=make_password('00000', 'sha512'),
                                                      searchField=searchField)

                        message = "L'administrateur " + str(newUser) + " a été enregistré(e)"
                else:
                    if email and User.objects.filter(email=email).exclude(id=adminId).exists():
                        status = False
                        message = "L'adresse mail " + email + " est déjà attribué"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exclude(id=adminId).exists():
                        status = False
                        message = "Le numéro de téléphone " + phoneNumber + " est déjà attribué"
                    else:
                        searchField = lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        admin = User.objects.get(id=adminId)
                        admin = lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        admin.lastName = lastName.upper()
                        admin.firstName = firstName.title()
                        admin.gender = gender
                        if avatar:
                            admin.avatar = avatar
                        admin.birthDate = birthDate
                        admin.birthCountry = birthCountry.upper()
                        admin.birthTown = birthTown.title()
                        admin.nationality = nationality.upper()
                        admin.livingCountry = livingCountry.upper()
                        admin.livingTown = livingTown.title()
                        admin.address = address
                        admin.email = email
                        admin.phoneNumber = phoneNumber
                        admin.searchField = searchField
                        admin.save()
                        message = "L'administrateur " + str(admin) + " a été enregistré(e)"

            for admin in User.objects.filter(UserGroup_id=UserGroup.objects.get(reference='ADMIN').id)[:100]:
                item = {
                    'id': admin.id,
                    'reference': admin.reference,
                    'fullName': str(admin),
                    'gender': admin.gender,
                    'address': admin.address,
                    'phoneNumber': admin.phoneNumber,
                    'isActive': admin.isActive,
                    'userGroup': admin.UserGroup.wording,
                    'avatar': admin.avatar.url
                }
                newAdmins.append(item)
            return JsonResponse({'status': status, 'message': message, 'admins': newAdmins})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'administrators': User.objects.filter(UserGroup=UserGroup.objects.get(reference='ADMIN'))[:100],
        }
        return render(request, 'main/administration/Administrators.html', context)


# Deactive administrator
def DeactiveAdministrator(request, id):
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newAdmins = []

        if not id:
            status = False
            message = "Aucune personne sélectionnée"
        elif not User.objects.filter(id=id).exists():
            status = False
            message = ""
        elif id == request.session['Admin']:
            status = False
            message = "Vous ne pouvez pas désactiver votre propre compte"
        else:
            admin = User.objects.get(id=id)
            if admin.isActive:
                admin.isActive = False
                message = "L'administrateur " + str(admin) + " a été désactivé(e)"
            else:
                admin.isActive = True
                message = "L'administrateur " + str(admin) + " a été activé(e)"
            admin.save()
        for admin in User.objects.filter(UserGroup_id=UserGroup.objects.get(reference='ADMIN').id)[:100]:
            item = {
                'id': admin.id,
                'reference': admin.reference,
                'fullName': str(admin),
                'gender': admin.gender,
                'address': admin.address,
                'phoneNumber': admin.phoneNumber,
                'isActive': admin.isActive,
                'userGroup': admin.UserGroup.wording,
                'avatar': admin.avatar.url
            }
            newAdmins.append(item)
        return JsonResponse({'status': status, 'message': message, 'admins': newAdmins})


# Delete administrator
def DeleteAdministrator(request, id):
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newAdmins = []

        if not id:
            status = False
            message = "Aucune personne sélectionnée"
        elif not User.objects.filter(id=id).exists():
            status = False
            message = "Cet administrateur n'existe plus"
        elif id == request.session['Admin']:
            status = False
            message = "Vous ne pouvez pas supprimer votre propre compte"
        elif TutorAffiliationFeaturing.objects.filter(Tutor_id=id).exists():
            status = False
            message = "Impossble de supprimer cet administrateur car est enregistré en tant que tuteur"
        else:
            admin = User.objects.get(id=id)
            admin.delete()
            message = "Suppression faite"
        if status:
            for admin in User.objects.filter(UserGroup_id=UserGroup.objects.get(reference='ADMIN').id)[:100]:
                item = {
                    'id': admin.id,
                    'reference': admin.reference,
                    'fullName': str(admin),
                    'gender': admin.gender,
                    'address': admin.address,
                    'phoneNumber': admin.phoneNumber,
                    'isActive': admin.isActive,
                    'userGroup': admin.UserGroup.wording,
                    'avatar': admin.avatar.url
                }
                newAdmins.append(item)
        return JsonResponse({'status': status, 'message': message, 'admins': newAdmins})


# Graduations
def GraduationLevels(request):
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
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
                if not graduationLevelId:
                    if GraduationLevel.objects.filter(wording__exact=graduationWording).exists():
                        status = False
                        message = "Le niveau d'enseignement " + graduationWording + " existe déjà"
                    else:
                        GraduationLevel.objects.create(reference=ReferenceMaker('NE-'), wording=graduationWording)
                        message = "Le niveau d'enseignement " + graduationWording + " a été enregistré"
                else:
                    if not GraduationLevel.objects.filter(id=graduationLevelId).exists():
                        status = False
                        message = "Ce niveaux d'enseignement n'existe plus"
                    else:
                        grauationlevel = GraduationLevel.objects.get(id=graduationLevelId)
                        grauationlevel.wording = graduationWording
                        grauationlevel.save()
                        message = "Le niveau d'enseignement " + graduationWording + " a été enregistré"

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
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'graduationLevels': GraduationLevel.objects.all()[:100],
            'susGraduationLevel': SusGraduationLevel.objects.all()[:100]
        }
        return render(request, 'main/administration/GraduationLevels.html', context)


# Get graduation level by Id
def GetGraduationLevelById(request, id):
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        item = None

        if not id:
            status = False
            message = "Aucun niveau sélectionné"
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
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newGraduationLevellist = []

        if not id:
            status = False
            message = "Aucun niveau sélectionné"
        else:
            if not GraduationLevel.objects.filter(id=id).exists():
                status = False
                message = "Ce niveau n'existe plus"
            elif SusGraduationLevel.objects.filter(GraduationLevel_id=id).exists():
                status = False
                message = "Impossible de supprimer ce niveau car lié à au moins un degré"
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
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            print(request.POST)
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
                        message = "Le degré " + susGraduationSigle + " esiste déjà pour ce niveau"
                    else:
                        SusGraduationLevel.objects.create(reference=ReferenceMaker('SNE-'), sigle=susGraduationSigle,
                                                          wording=susGraduationWording,
                                                          GraduationLevel_id=susGraduationLevelGraduationId)
                        message = "Le degré d'enseignement " + susGraduationWording + " a été enregistré"
                else:
                    if SusGraduationLevel.objects.filter(sigle=susGraduationSigle,
                                                         GraduationLevel_id=susGraduationLevelGraduationId).exclude(
                        id=susGraduationLevelId).exists():
                        status = False
                        message = "Le degré " + susGraduationWording + " esiste déjà pour ce niveau"
                    else:
                        susgraduationlevel = SusGraduationLevel.objects.get(id=susGraduationLevelId)
                        susgraduationlevel.sigle = susGraduationSigle
                        susgraduationlevel.wording = susGraduationWording
                        susgraduationlevel.GraduationLevel_id = susGraduationLevelGraduationId
                        susgraduationlevel.save()
                        message = "Le degré d'enseignement " + susGraduationWording + " a été enregistré"

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
        message = "Aucun degré sélectionné"
    elif not SusGraduationLevel.objects.filter(id=id).exists():
        status = False
        message = "Ce degré d'enseignement n'existe plus"
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
    if 'Admin' not in request.session:
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newSusGraduationLevels = []

        if not id:
            status = False
            message = "Aucun degré sélectionné"
        elif not SusGraduationLevel.objects.filter(id=id).exists():
            status = False
            message = "Ce degré d'enseignement n'existe plus"
        elif Classe.objects.filter(SusGraduationLevel_id=id).exists():
            status = False
            message = "Impossible de supprimer ce degré car lié à au moins une classe"
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


# Schools
def Schools(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            newSchoolsList = []

            # Posted data
            schoolId = request.POST.get('schoolId')
            schoolSigle = request.POST.get('schoolSigle')
            schooName = request.POST.get('schooName')
            schoolPhoneNumber = request.POST.get('schoolPhoneNumber')
            schoolEmail = request.POST.get('schoolEmail')
            livingCountry = request.POST.get('livingCountry')
            livingTown = request.POST.get('livingTown')
            address = request.POST.get('address')

            # Traitement
            if not schoolSigle or not schooName or not schoolPhoneNumber or not schoolEmail or not livingCountry or not livingTown or not address:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not schoolId:
                    if School.objects.filter(sigle=schoolSigle).exists():
                        status = False
                        message = "La référence " + schoolSigle + " existe déjà"
                    else:
                        searchTerm = schooName + ' ' + schoolSigle + ' ' + schoolPhoneNumber + ' ' + schoolEmail + ' ' + livingCountry + ' ' + livingTown + ' ' + address
                        School.objects.create(denomination=schooName, sigle=schoolSigle, phoneNumber=schoolPhoneNumber,
                                              email=schoolEmail, livingCountry=livingCountry.upper(),
                                              livingTown=livingTown.title(), address=address, searchField=searchTerm)
                        message = "L'etablissement " + schoolSigle + " a été enregistré"
                else:
                    if School.objects.filter(sigle=schoolSigle).exclude(id=schoolId).exists():
                        status = False
                        message = "La référence " + schoolSigle + " existe déjà"
                    else:
                        searchTerm = schooName + ' ' + schoolSigle + ' ' + schoolPhoneNumber + ' ' + schoolEmail + ' ' + livingCountry + ' ' + livingTown + ' ' + address
                        school = School.objects.get(id=schoolId)
                        school.sigle = schoolSigle
                        school.denomination = schooName
                        school.phoneNumber = schoolPhoneNumber
                        school.email = schoolEmail
                        school.livingCountry = livingCountry.upper()
                        school.livingTown = livingTown.title()
                        school.address = address
                        school.searchField = searchTerm
                        school.save()
                        message = "L'etablissement " + schoolSigle + " a été enregistré"

            for school in School.objects.all():
                item = {
                    'id': school.id,
                    'sigle': school.sigle,
                    'denomination': school.denomination,
                    'phoneNumber': school.phoneNumber,
                    'email': school.email,
                    'livingCountry': school.livingCountry,
                    'livingTown': school.livingTown,
                    'address': school.address,
                    'isActive': school.isActive
                }
                newSchoolsList.append(item)
            return JsonResponse({'status': status, 'message': message, 'schools': newSchoolsList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'schools': School.objects.all()[:100],
        }
        return render(request, 'main/administration/Schools.html', context)


# Get school by Id
def GetShoolByid(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucun établissement sélectionné"
    elif not School.objects.filter(id=id).exists():
        status = False
        message = "Cet établissement n'existe plus"
    else:
        school = School.objects.get(id=id)
        item = {
            'id': school.id,
            'sigle': school.sigle,
            'denomination': school.denomination,
            'phoneNumber': school.phoneNumber,
            'email': school.email,
            'livingCountry': school.livingCountry,
            'livingTown': school.livingTown,
            'address': school.address,
            'isActive': school.isActive
        }

    return JsonResponse({'status': status, 'message': message, 'school': item})


# Delete school
def DeleteSchool(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newSchoolsList = []

        if not id:
            status = False
            message = "Aucun établissement sélectionné"
        elif not School.objects.filter(id=id).exists():
            status = False
            message = "Cet établissement n'existe plus"
        elif Classe.objects.filter(School_id=id).exists():
            status = False
            message = "Impossible de supprimer cet établissement car lié à au moins une salle de classe"
        else:
            school = School.objects.get(id=id)
            school.delete()
            message = "Suppression faite"
    for school in School.objects.all():
        item = {
            'id': school.id,
            'sigle': school.sigle,
            'denomination': school.denomination,
            'phoneNumber': school.phoneNumber,
            'email': school.email,
            'livingCountry': school.livingCountry,
            'livingTown': school.livingTown,
            'address': school.address,
            'isActive': school.isActive
        }
        newSchoolsList.append(item)
    return JsonResponse({'status': status, 'message': message, 'schools': newSchoolsList})


# Filter school
def FilterSchool(request):
    if request.method == 'GET':
        term = request.GET.get('term')
        schoolList = []

        if term:
            schools = School.objects.filter(
                Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term))
            for school in schools:
                item = {
                    'id': school.id,
                    'sigle': school.sigle,
                    'denomination': school.denomination,
                    'phoneNumber': school.phoneNumber,
                    'email': school.email,
                    'livingCountry': school.livingCountry,
                    'livingTown': school.livingTown,
                    'address': school.address,
                    'isActive': school.isActive
                }
                print(item)
                schoolList.append(item)

    return JsonResponse(schoolList, safe=False)


# Academic year
def AcademicYears(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == 'POST':
            status = True
            message = ""
            newAcademicyearList = []

            # Posted Data
            academicYearlId = request.POST.get('academicYearlId')
            wording = request.POST.get('wording')
            startDate = request.POST.get('startDate')
            endDate = request.POST.get('endDate')

            # Traitement
            if not wording or not startDate or not endDate:
                status = True
                message = "Des champs requis sont vides"
            else:
                if not academicYearlId:
                    if AcademicYear.objects.filter(wording=wording).exists():
                        status = False
                        message = "L'années scolaire " + wording + " existe déjà"
                    else:
                        AcademicYear.objects.create(reference=ReferenceMaker('AS-'), wording=wording,
                                                    startDate=startDate, endDate=endDate)
                        message = "L'année scolaire " + wording + " a été créé"
                else:
                    if AcademicYear.objects.filter(wording=wording).exclude(id=academicYearlId).exists():
                        status = False
                        message = "L'années scolaire " + wording + " existe déjà"
                    else:
                        academicyear = AcademicYear.objects.get(id=academicYearlId)
                        academicyear.wording = wording
                        academicyear.startDate = startDate
                        academicyear.endDate = endDate
                        academicyear.save()
                        message = "L'années scolaire " + wording + " a été enregistrée"

            for academicyear in AcademicYear.objects.all():
                item = {
                    'id': academicyear.id,
                    'reference': academicyear.reference,
                    'wording': academicyear.wording,
                    'startDate': academicyear.startDate,
                    'endDate': academicyear.endDate,
                    'isActive': academicyear.isActive
                }
                newAcademicyearList.append(item)
            return JsonResponse({'status': status, 'message': message, 'academicYears': newAcademicyearList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
        }
        return render(request, 'main/administration/AcademicYears.html', context)


# Get academic year by id
def GetAcademicYearById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Acune année scolaire sélectionnée"
    elif not AcademicYear.objects.filter(id=id).exists():
        status = False
        message = "Cette année académique n'existe plus"
    else:
        academicyear = AcademicYear.objects.get(id=id)
        item = {
            'id': academicyear.id,
            'reference': academicyear.reference,
            'wording': academicyear.wording,
            'startDate': academicyear.startDate,
            'endDate': academicyear.endDate,
            'isActive': academicyear.isActive
        }
    return JsonResponse({'status': status, 'message': message, 'academicYear': item})


# Check if active academic year
def CheckActiveAcademicYear(request):
    status = True
    message = ""
    item = None

    if not request.session['AcademicYear']:
        status = False
        message = "Aucune année académique en cours"
    else:
        academicyear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        item = {
            'id': academicyear.id,
            'reference': academicyear.reference,
            'wording': academicyear.wording,
            'startDate': academicyear.startDate,
            'endDate': academicyear.endDate,
            'isActive': academicyear.isActive
        }
        message = "Année académique " + academicyear.wording + " en cours"
    return JsonResponse({'status': status, 'message': message, 'academicYear': item})


# Delete academic year
def DeleteAcademicYear(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newAcademicyearList = []

        if not id:
            status = False
            message = "Aucune année scolaire sélectionnée"
        elif not AcademicYear.objects.filter(id=id).exists():
            status = False
            message = "Cette année scolaire n'existe plus"
        elif Inscription.objects.filter(AcademicYear_id=id).exists():
            status = False
            message = "Impossible de supprimer cette année scolaire car liée à au moins une inscription"
        else:
            if request.session['AcademicYear'] == id:
                request.session['AcademicYear'] = ""

            academicyear = AcademicYear.objects.get(id=id)
            academicyear.delete()
            message = "Suppresion faite"

        for academicyear in AcademicYear.objects.all():
            item = {
                'id': academicyear.id,
                'reference': academicyear.reference,
                'wording': academicyear.wording,
                'startDate': academicyear.startDate,
                'endDate': academicyear.endDate,
                'isActive': academicyear.isActive
            }
            newAcademicyearList.append(item)
        return JsonResponse({'status': status, 'message': message, 'academicYears': newAcademicyearList})


# Activate deactivate academic year
def ActivDeactivAcademicYear(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newAcademicyearList = []

        if not id:
            status = False
            message = "Aucune année scolaire sélectionnée"
        elif not AcademicYear.objects.filter(id=id).exists():
            status = False
            message = "Cette année scolaire n'existe plus"
        else:
            for academicyear in AcademicYear.objects.all().exclude(id=id):
                # ac = academicyear.objects.get(id=academicyear.id)
                academicyear.isActive = False
                academicyear.save()

            academicyear = AcademicYear.objects.get(id=id)
            if not academicyear.isActive:
                academicyear.isActive = True
                message = "Année scolaire " + academicyear.wording + " activée"
                if not request.session['AcademicYear']:
                    request.session['AcademicYear'] = str(academicyear.id)
            else:
                academicyear.isActive = False
                message = "Année scolaire " + academicyear.wording + " désactivée"
            academicyear.save()

        for academicyear in AcademicYear.objects.all():
            item = {
                'id': academicyear.id,
                'reference': academicyear.reference,
                'wording': academicyear.wording,
                'startDate': academicyear.startDate,
                'endDate': academicyear.endDate,
                'isActive': academicyear.isActive
            }
            newAcademicyearList.append(item)
        return JsonResponse({'status': status, 'message': message, 'academicYears': newAcademicyearList})


# Change academic year
def changeAcademicYear(request, id):
    # if 'Admin' not in request.session or 'Worker' not in request.session:
    #     if is_ajax(request):
    #         return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
    #     else:
    #         return redirect('main:Authentication')
    # else:
    status = True
    message = False
    ac = ''
    # Posted datas
    academicYearId = id

    # Traitement
    if not academicYearId:
        status = False
        message = "Acune année scolaire sélectionnée"
    elif not AcademicYear.objects.filter(id=academicYearId).exists():
        status = False
        message = "Cette année académique n'existe plus"
    else:
        request.session['AcademicYear'] = academicYearId
        ac = AcademicYear.objects.get(id=academicYearId)
        message = "Année académique " + ac.wording + " en instance"
    return JsonResponse({'status': status, 'message': message, })


# GESTION PEDAGOGIQUE

# Postes
def UserGroups(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            usersGroupsList = []

            # Posted data
            jobId = request.POST.get('jobId')
            reference = request.POST.get('reference')
            wording = request.POST.get('wording')

            # Traitement
            if not reference or not wording:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not jobId:
                    if UserGroup.objects.filter(reference__exact=reference).exists():
                        status = False
                        message = "La référence " + reference + " existe déjà"
                    else:
                        searchTerm = ' ' + reference + ' ' + wording
                        UserGroup.objects.create(reference=reference, wording=wording, searchField=searchTerm)
                        message = "La fonction " + wording + " a été crée"
                else:
                    if UserGroup.objects.filter(reference__exact=reference).exclude(id=jobId).exists():
                        status = False
                        message = "La référence " + reference + " existe déjà"
                    else:
                        searchTerm = ' ' + reference + ' ' + wording
                        usergroup = UserGroup.objects.get(id=jobId)
                        usergroup.reference = reference
                        usergroup.wording = wording
                        usergroup.searchField = searchTerm
                        usergroup.save()
                        message = "La fonction " + wording + " a été crée"

            if status:
                for usergroup in UserGroup.objects.all().exclude(reference="ADMIN"):
                    item = {
                        'id': usergroup.id,
                        'reference': usergroup.reference,
                        'wording': usergroup.wording,
                        'createdAt': usergroup.createdAt.strftime('%d-%m-%Y'),
                        'updatedAt': usergroup.updatedAt.strftime('%d-%m-%Y')
                    }
                    usersGroupsList.append(item)
                return JsonResponse({'status': status, 'message': message, 'usersGroups': usersGroupsList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'userGroups': UserGroup.objects.all().exclude(reference='ADMIN')
        }
        return render(request, 'main/administration/Jobs.html', context)


# Get Usergroup by id
def GetUserGroupById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucune fonction sélectionnée"
    elif not UserGroup.objects.filter(id=id).exists():
        status = False
        message = "Cette fonction n'existe plus"
    else:
        usergroup = UserGroup.objects.get(id=id)
        item = {
            'id': usergroup.id,
            'reference': usergroup.reference,
            'wording': usergroup.wording,
            'createdAt': usergroup.createdAt.strftime('%d-%m-%Y'),
            'updatedAt': usergroup.updatedAt.strftime('%d-%m-%Y')
        }
    return JsonResponse({'status': status, 'message': message, 'userGroup': item})


# User group filter
def FilterUserGroup(request):
    if request.method == 'GET':
        term = request.GET.get('term')
        usersGroupsList = []

        if term:
            usergroups = UserGroup.objects.filter(
                Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term))
            print(usergroups)
            for usergroup in usergroups:
                item = {
                    'id': usergroup.id,
                    'reference': usergroup.reference,
                    'wording': usergroup.wording,
                    'createdAt': usergroup.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': usergroup.updatedAt.strftime('%d-%m-%Y')
                }
                usersGroupsList.append(item)

    return JsonResponse(usersGroupsList, safe=False)


# Detele user group
def DeleteUserGroup(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        usersGroupsList = []

        if not id:
            status = False
            message = "Aucune fonction sélectionnée"
        elif not UserGroup.objects.filter(id=id).exists():
            status = False
            message = "Cette fonction n'existe plus"
        elif User.objects.filter(UserGroup_id=id).exists():
            status = False
            message = "Impossible de supprimer cette fonction car liée à au moins un utilisateur"
        elif AdministrationMember.objects.filter(UserGroup_id=id).exists():
            status = False
            message = "Impossible de supprimer cette fonction car liée à au moins un utilisateur"
        else:
            usergroup = UserGroup.objects.get(id=id)
            usergroup.delete()
            message = "Suppression faite"

        if status:
            for usergroup in UserGroup.objects.all().exclude(reference="ADMIN"):
                item = {
                    'id': usergroup.id,
                    'reference': usergroup.reference,
                    'wording': usergroup.wording,
                    'createdAt': usergroup.createdAt.strftime('%d-%m-%Y'),
                    'updatedAt': usergroup.updatedAt.strftime('%d-%m-%Y')
                }
                usersGroupsList.append(item)
        return JsonResponse({'status': status, 'message': message, 'usersGroups': usersGroupsList})


# Personnel Administratif
def SchoolWorkers(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        if is_ajax(request) and request.method == "POST":
            status = True
            message = ""
            newSchoolWorkersList = []

            # Posted datas
            userGroupId = request.POST.get('userGroupId')
            # Identité
            userId = request.POST.get('userId')
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
            # Administration member
            isAdministrationMember = True
            hiringDate = request.POST.get('hiringDate')

            # Lien avec les etablissement
            schoolId = request.POST.get('schoolId')

            # Traitement
            if not lastName or not firstName or not gender:
                status = False
                message = "Des champs requis sont vides"
            else:
                if not userId:
                    if email and User.objects.filter(email=email).exists():
                        status = False
                        message = "L'adresse mail " + email + " est déjà attribué"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exists():
                        status = False
                        message = "Le numéro de téléphone " + phoneNumber + " est déjà attribué"
                    else:
                        if not avatar:
                            avatar = 'avatar.png'
                        searchField = lastName + " " + firstName + " " + birthDate + " " + email + " " + phoneNumber
                        newUser = User.objects.create(reference=ReferenceMaker('USR-')
                                                      , lastName=lastName.upper(),
                                                      firstName=firstName.title(), gender=gender, avatar=avatar,
                                                      birthDate=birthDate,
                                                      birthCountry=birthCountry.upper(), birthTown=birthTown.title(),
                                                      nationality=nationality.upper(),
                                                      livingCountry=livingCountry.upper(),
                                                      livingTown=livingTown.title(), address=address,
                                                      email=email, phoneNumber=phoneNumber,
                                                      password=make_password('00000', 'sha512'),
                                                      hiringDate=hiringDate, searchField=searchField)

                        # Lien avec l ecole
                        AdministrationMember.objects.create(User=newUser, UserGroup_id=userGroupId, School_id=schoolId,
                                                            startDate=hiringDate)
                        message = "Le membre " + str(newUser) + " a été enregistré"
                else:
                    if email and User.objects.filter(email=email).exclude(id=userId).exists():
                        status = False
                        message = "L'adresse mail " + email + " est déjà attribué"
                    elif phoneNumber and User.objects.filter(phoneNumber=phoneNumber).exclude(id=userId).exists():
                        status = False
                        message = "Le numéro de téléphone " + phoneNumber + " est déjà attribué"
                    else:
                        user = User.objects.get(id=userId)
                        # verifier si le groupe ou l ecole ont change
                        # Si c est le cas alors mettre fin a l ancien lien et en creer un nouveau
                        # Si ce n est pas le cas alors creer le nouveau lien directement
                        if AdministrationMember.objects.filter(User_id=userId, School_id=schoolId,
                                                               isActive=True).exists():
                            userlink = AdministrationMember.objects.get(User_id=userId, isActive=True,
                                                                        School_id=schoolId)
                            if str(userlink.UserGroup_id) == str(userGroupId) and str(userlink.School_id) == str(
                                    schoolId):
                                print('Pas differennt')
                            else:
                                print('Different')
                                userlink.isActive = False
                                userlink.endDate = date.today()
                                userlink.save()
                                # Nouvel enregistrement
                                AdministrationMember.objects.create(User=user, UserGroup_id=userGroupId,
                                                                    School_id=schoolId,
                                                                    startDate=date.today())
                        else:
                            # Nouvel enregistrement
                            AdministrationMember.objects.create(User=user, UserGroup_id=userGroupId, School_id=schoolId,
                                                                startDate=date.today())

                        # Enregistrement des informations de l utilisateur
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
                        user.hiringDate = hiringDate
                        user.UserGroup_id = userGroupId
                        user.searchField = searchField
                        user.save()
                        message = "Le membre " + str(user) + " a été enregistré"

            if status:
                for worker in AdministrationMember.objects.filter(isActive=True)[:100]:
                    item = {
                        'id': worker.id,
                        'userId': worker.User.id,
                        'reference': worker.User.reference,
                        'fullName': str(worker.User),
                        'gender': worker.User.gender,
                        'isActive': worker.User.isActive,
                        'userGroup': worker.UserGroup.wording,
                        'admin': 'Oui',
                        'school': worker.School.sigle,
                        'avatar': worker.User.avatar.url,
                        'startDate': worker.startDate
                    }
                    newSchoolWorkersList.append(item)
            return JsonResponse({'status': status, 'message': message, 'schoolWorkers': newSchoolWorkersList})

        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'SchoolWorkers': AdministrationMember.objects.filter(isActive=True)[:100],
            'userGroups': UserGroup.objects.all().exclude(reference='ADMIN'),
            'schools': School.objects.all()[:100]
        }
        return render(request, 'main/administration/SchoolWorkers.html', context)


# schoolworker details
def SchoolWorkerDetails(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:10],
            'schoolWorker': AdministrationMember.objects.get(id=id),
        }
        return render(request, 'main/administration/SchoolWorkersDetails.html', context)


# Get scoolworker by id
def getSchoolworkerbyid(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Aucune personne sélectionnée"
    elif not AdministrationMember.objects.filter(id=id).exists():
        status = False
        message = "Cet lien n'existe plus"
    else:
        worker = AdministrationMember.objects.get(id=id)
        item = {
            'id': worker.User.id,
            'fullName': str(worker.User),
            'lastName': worker.User.lastName,
            'firstName': worker.User.firstName,
            'gender': worker.User.gender,
            'birthDate': worker.User.birthDate,
            'birthCountry': worker.User.birthCountry,
            'birthTown': worker.User.birthTown,
            'nationality': worker.User.nationality,
            'livingCountry': worker.User.livingCountry,
            'livingTown': worker.User.livingTown,
            'livingAddress': worker.User.address,
            'email': worker.User.email,
            'hiringDate': worker.User.hiringDate,
            'phoneNumber': worker.User.phoneNumber,
            'userGroupId': worker.UserGroup_id,
            'userGroup': worker.UserGroup.wording,
            'admin': 'Oui',
            'schoolId': worker.School_id,
            'school': worker.School.sigle,
            'avatar': worker.User.avatar.url
        }
    return JsonResponse({'status': status, 'message': message, 'schoolWorker': item})


# Add  old member ton school staff
def AddMemberToAdministrative(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        # print(request.POST)
        status = True
        message = ""
        newSchoolWorkersList = []

        userId = request.POST.get('userId')
        schoolId = request.POST.get('schoolId')
        userGroupId = request.POST.get('userGroupId')

        if not userId or not schoolId:
            status = False
            message = "Des champs requis sont vides"
        elif not User.objects.filter(id=userId).exists():
            status = False
            message = "Cette personne n'existe plus"
        elif not School.objects.filter(id=schoolId).exists():
            status = False
            message = "Cet etablissement n'existe plus"
        elif not UserGroup.objects.filter(id=userGroupId).exists():
            status = False
            message = "Cette fonction n'existe plus"
        elif AdministrationMember.objects.filter(User_id=userId, School_id=schoolId, isActive=True).exists():
            link = AdministrationMember.objects.get(User_id=userId, School_id=schoolId, isActive=True)
            status = False
            message = "Le membre " + str(link.User) + " est lié à l'établissement " + str(
                link.School.denomination) + " en tant que " + str(link.UserGroup.wording)
        else:
            user = AdministrationMember.objects.create(User_id=userId, School_id=schoolId, startDate=date.today(),
                                                       UserGroup_id=userGroupId, isActive=True)
            message = "Membre " + str(user.User) + " ajouté au personnel administratif"
        if status:
            for worker in AdministrationMember.objects.filter(isActive=True)[:100]:
                item = {
                    'id': worker.id,
                    'userId': worker.User.id,
                    'reference': worker.User.reference,
                    'fullName': str(worker.User),
                    'gender': worker.User.gender,
                    'isActive': worker.User.isActive,
                    'userGroup': worker.UserGroup.wording,
                    'admin': 'Oui',
                    'school': worker.School.sigle,
                    'avatar': worker.User.avatar.url,
                    'startDate': worker.startDate
                }
                newSchoolWorkersList.append(item)
        return JsonResponse({'status': status, 'message': message, 'schoolWorkers': newSchoolWorkersList})


# Retire from school workers
def RetireUserFromSchoolWorkers(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        newSchoolWorkersList = []

        if not id:
            status = False
            message = "Aucune personne sélectionnée"
        elif not AdministrationMember.objects.filter(id=id).exists():
            status = False
            message = "Cet lien n'existe plus"
        else:
            worker = AdministrationMember.objects.get(id=id)
            worker.endDate = date.today()
            worker.isActive = False
            worker.save()
            message = "Le membre " + str(worker.User) + " a été retiré de l'administrattion"

        if status:
            for worker in AdministrationMember.objects.filter(isActive=True)[:100]:
                item = {
                    'id': worker.id,
                    'userId': worker.User.id,
                    'reference': worker.User.reference,
                    'fullName': str(worker.User),
                    'gender': worker.User.gender,
                    'isActive': worker.User.isActive,
                    'userGroup': worker.UserGroup.wording,
                    'admin': 'Oui',
                    'school': worker.School.sigle,
                    'avatar': worker.User.avatar.url,
                    'startDate': worker.startDate
                }
                newSchoolWorkersList.append(item)
        return JsonResponse({'status': status, 'message': message, 'schoolWorkers': newSchoolWorkersList})


# Filter non administrative persons
def FilterNotAdministrative(request):
    personsList = []
    if is_ajax(request) and request.method == 'GET':
        term = request.GET.get('term')
        if term:
            persons = User.objects.filter(
                Q(searchField__startswith=term) | Q(searchField__contains=term) | Q(searchField__endswith=term))[:50]
            for person in persons:
                item = {
                    'id': person.id,
                    'avatar': person.avatar.url,
                    'fullname': str(person) + " " + person.phoneNumber + " " + person.email
                }
                personsList.append(item)
            return JsonResponse(personsList, safe=False)
        else:
            return JsonResponse(personsList, safe=False)


# Email and sms configurations
def EmailSmsSettings(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        academicYear = ''
        if request.session['AcademicYear']:
            academicYear = AcademicYear.objects.get(id=request.session['AcademicYear'])
        context = {
            'Admin': User.objects.get(id=request.session['Admin']),
            'MainSchool': MainSchool.objects.get(id=1),
            'AcademicYear': academicYear,
            'academicYears': AcademicYear.objects.all()[:100],
            'emailSettings': EmailSetting.objects.all()
        }
        return render(request, 'main/administration/emailsmsConfigurations.html', context)


# EmailSettings
def EmailSettings(request):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        emailSettingList = []

        # Posted data
        emailSettingId = request.POST.get('emailSettingId')
        smtpServerPort = request.POST.get('smtpServerPort')
        smtpServer = request.POST.get('smtpServer')
        loginEmail = request.POST.get('loginEmail')
        loginPassword = request.POST.get('loginPassword')

        # Traitement
        if not smtpServer or not loginEmail or not loginPassword:
            status = False
            message = "Des champs requis sont vides"
        else:
            if not emailSettingId:
                EmailSetting.objects.create(smtpServer=smtpServer, smtpServerPort=smtpServerPort, loginEmail=loginEmail,
                                            loginPassword=loginPassword)
                message = "Configurations d'email enregistrées"
            else:
                emailsetting = EmailSetting.objects.get(id=emailSettingId)
                emailsetting.smtpServer = smtpServer
                emailsetting.smtpServerPort = smtpServerPort
                emailsetting.loginEmail = loginEmail
                emailsetting.loginPassword = loginPassword
                emailsetting.save()
                message = "Configurations d'email enregistrées"
        if status:
            for setting in EmailSetting.objects.all():
                item = {
                    'id': setting.id,
                    'smtpServer': setting.smtpServer,
                    'smtpServerPort': setting.smtpServerPort,
                    'loginEmail': setting.loginEmail,
                    'loginPassword': setting.loginPassword,
                    'isActive': setting.isActive
                }
                emailSettingList.append(item)
        return JsonResponse({'status': status, 'message': message, 'emailSettings': emailSettingList})


# Get email setting By id
def GetEmailSettingById(request, id):
    status = True
    message = ""
    item = None

    if not id:
        status = False
        message = "Acune configuration sélectionnée"
    elif not EmailSetting.objects.filter(id=id).exists():
        status = False
        message = "Cette configuration n'existe plus"
    else:
        emailsetting = EmailSetting.objects.get(id=id)
        message = "Configuration trouvée"
        item = {
            'id': emailsetting.id,
            'smtpServer': emailsetting.smtpServer,
            'smtpServerPort': emailsetting.smtpServerPort,
            'loginEmail': emailsetting.loginEmail,
            'loginPassword': emailsetting.loginPassword,
            'isActive': emailsetting.isActive
        }
    return JsonResponse({'status': status, 'message': message, 'emailSetting': item})


# Delete email setting
def DeleteEmailSetting(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        emailSettingList = []

        if not id:
            status = False
            message = "Acune configuration sélectionnée"
        elif not EmailSetting.objects.filter(id=id).exists():
            status = False
            message = "Cette configuration n'existe plus"
        else:
            emailsetting = EmailSetting.objects.get(id=id)
            emailsetting.delete()
            message = "Suppression faite"

        if status:
            for setting in EmailSetting.objects.all():
                item = {
                    'id': setting.id,
                    'smtpServer': setting.smtpServer,
                    'smtpServerPort': setting.smtpServerPort,
                    'loginEmail': setting.loginEmail,
                    'loginPassword': setting.loginPassword,
                    'isActive': setting.isActive
                }
                emailSettingList.append(item)
        return JsonResponse({'status': status, 'message': message, 'emailSettings': emailSettingList})


# activate deactivate email setting
def ActivateDeactivateEmailSetting(request, id):
    if 'Admin' not in request.session or request.session['AdminGroup'] != "ADMIN":
        if is_ajax(request):
            return JsonResponse({'status': False, 'message': "Vous n'êtes pas connecté(e)"})
        else:
            return redirect('main:Authentication')
    else:
        status = True
        message = ""
        emailSettingList = []

        if not id:
            status = False
            message = "Acune configuration sélectionnée"
        elif not EmailSetting.objects.filter(id=id).exists():
            status = False
            message = "Cette configuration n'existe plus"
        else:
            for setting in EmailSetting.objects.all().exclude(id=id):
                setting.isActive = False
                setting.save()
            emailsetting = EmailSetting.objects.get(id=id)
            if emailsetting.isActive:
                emailsetting.isActive = False
                message = "Désactivation faite"
            else:
                emailsetting.isActive = True
            emailsetting.save()
            message = "Activation faite"
        if status:
            for setting in EmailSetting.objects.all():
                item = {
                    'id': setting.id,
                    'smtpServer': setting.smtpServer,
                    'smtpServerPort': setting.smtpServerPort,
                    'loginEmail': setting.loginEmail,
                    'loginPassword': setting.loginPassword,
                    'isActive': setting.isActive
                }
                emailSettingList.append(item)
        return JsonResponse({'status': status, 'message': message, 'emailSettings': emailSettingList})
