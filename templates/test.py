def test() :
    gmailsetting = GmailSetting.objects.get(School_id=request.session['School'])
                        if not gmailsetting.loginEmail or not gmailsetting.loginPassword:
                            status = False
                            message = "Aucun paramètre de connexion renseigné"
                        else:
                            # Pour toutes les classes dans lesqueslles il y a une insctiption pour l'annees
                            # scolaire en cours
                            if 'All' in classes:
                                # verifier si il existe des classes avec inscriptions
                                if not Inscription.objects.filter(School_id=request.session['School'],AcademicYear_id=request.session['AcademicYear']).exists():
                                    status = False
                                    message = 'Aucune classe avec des apprennants incrits trouvée'
                                else:
                                    # recuperations de  la liste des classes de toutes les classes avec une
                                    # inscriptions pour l annee scolaire en cours
                                    inscriptionClasses = Inscription.objects.filter(AcademicYear_id=request.session['AcademicYear'],School_id=request.session['School']).values('Classe_id').distinct()
                                    for classe in Classe.objects.filter(id__in=inscriptionClasses):
                                        # Recuperation des apprenants inscrits dans chaque salle de classe
                                        inscriptionStudents = Inscription.objects.filter(AcademicYear_id=request.session['AcademicYear'],School_id=request.session['School'], Classe_id=classe.id).values('Student_id').distinct()
                                        for student in User.objects.filter(id__in=inscriptionStudents):
                                            # Verifier en premier lieu si chaque enfant a un parent avec un email
                                            if TutorAffiliationFeaturing.objects.filter(Student_id=student.id).exists():
                                                # Verifier si les tuteurs ont des email et envoyer le message
                                                for tutor in TutorAffiliationFeaturing.objects.filter(
                                                        Student_id=student.id):
                                                    if tutor.Tutor.email:
                                                        print(tutor.Tutor.email)
                                                        schoolname = School.objects.get(id=request.session['School']).denomination
                                                        msg = EmailMessage()
                                                        msg['Subject'] = emailSubject
                                                        msg['From'] = formataddr((schoolname, gmailsetting.loginEmail))
                                                        msg['To'] = tutor.Tutor.email
                                                        msg["BCC"] = gmailsetting.loginEmail
                                                        academicyear = AcademicYear.objects.get(id=request.session['AcademicYear']).wording
                                                        msg.set_content(
                                                            f"""\
                                                            <html>
                                                                <body>
                                                                    {emailText}                                                                   
                                                                </body>
                                                            </html>
                                                            """,
                                                            subtype="html"
                                                        )
                                                        with smtplib.SMTP('smtp.gmail.com', 587) as server:
                                                            server.starttls()
                                                            server.login(gmailsetting.loginEmail, gmailsetting.loginPassword)
                                                            server.sendmail(gmailsetting.loginEmail, tutor.Tutor.email, msg.as_string())
                                                        print('Emails sent')
                            else:
                                print('Liste definie')