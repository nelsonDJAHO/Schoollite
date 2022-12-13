// Initialisation
// Initialisation

const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const tutorsEmailsDataList = document.getElementById('tutorsEmailsDataList')

function reloadPage() {
    document.location.reload()
}

$(document).ready(function() {
    $('#classesEmailClasses').select2({
        multiple: true,
    })
    $('#classesEmailText').summernote({ height: 250, minHeight: null, maxHeight: null, focus: !1 })
    $('#classesSmsClasses').select2({
        multiple: true,
        tags: true,
    })

    $('#indivEmailTutors').select2({
        width: '100%',
        multiple: true,
        ajax: {
            url: '/school/FilterTutors/',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    term: params.term
                }
            },
            processResults: function(data, params) {
                params.page = params.page || 1
                return {
                    results: $.map(data, function(item) {
                        return { id: item.id, text: (item.name + ' (' + item.email) + ')' }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    }
                }
            },
            placeholder: 'Rechercher un membre',
            minimumInputLength: 1,
        }
    });
    $('#indivSmsTutors').select2({
        width: '100%',
        multiple: true,
        ajax: {
            url: '/school/FilterTutors/',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    term: params.term
                }
            },
            processResults: function(data, params) {
                params.page = params.page || 1
                return {
                    results: $.map(data, function(item) {
                        return { id: item.id, text: (item.name + ' (' + item.phoneNumber) + ')' }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    }
                }
            },
            placeholder: 'Rechercher un membre',
            minimumInputLength: 1,
        }
    });
    $('#indivEmailText').summernote({ height: 250, minHeight: null, maxHeight: null, focus: !1 })

})

// End Initialisation
// End Initialisation


//********************* Email by classes session *********************/
//********************* Email by classes session *********************/
//********************* Email by classes session *********************/
const classesEmailForm = document.getElementById('classesEmailForm')
    //On reset of the form

// On post of the form
classesEmailForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Validation du formulaire
    if ($('#classesEmailForm').parsley().isValid()) {
        document.getElementById('classesEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Enregistrement..."
        document.getElementById('classesEmailBtn').disabled = true

        mydata = new FormData()
        $('#classesEmailClasses').val().forEach(element => {
            mydata.append("classes", element)
        })
        mydata.append("emailSubject", $('#classesEmailSubject').val())
        mydata.append("emailText", $('#classesEmailText').val())

        // Attatchment
        var totalfiles = document.getElementById('classesEmailAttatchment').files.length;
        for (var index = 0; index < totalfiles; index++) {
            // console.log(document.getElementById('classesEmailAttatchment').files[index])
            mydata.append("emailFiles", document.getElementById('classesEmailAttatchment').files[index]);
        }
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/SendEmailTotutorsByClasses/',
            processData: false,
            contentType: false,
            data: mydata,
            enctype: "multipart/form-data",
            success: function(data) {
                if (data.status == true) {
                    classesEmailForm.reset();
                    // tutorsEmailsDataList.innerHTML = ""
                    // $('#tutorsEmailsTable').DataTable().clear().destroy()
                    // data.tutorsMessages.forEach(element => {
                    //     tutorsEmailsDataList.innerHTML += `
                    //             <tr>
                    //                 <td>${element.messageType}</td>
                    //                 <td>${element.messageProvider}</td>
                    //                 <td>${element.messageSubject}</td>
                    //                 <td>${element.messageDate} / ${element.messageHour }</td>
                    //                 <td>${element.messageStatus}</td>
                    //                 <td>
                    //                     <div class="button-list">
                    //                         <button class="btn waves-effect waves-light btn-info btn-sm" onclick="getObjectById('${element.id }')" data-toggle="tooltip" title="Informations"> <i class="mdi mdi-information-outline"></i> </button>
                    //                         <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                    //                     </div>
                    //                 </td>
                    //             </tr>
                    //         `
                    // })
                    // $('#tutorsEmailsTable').DataTable()

                    document.getElementById('classesEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('classesEmailBtn').disabled = false
                    toastr.success(data.message, "Succès", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                    setTimeout(reloadPage, 1000)
                } else {
                    document.getElementById('classesEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('classesEmailBtn').disabled = false
                    toastr.error(data.message, "erreur", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                }
            },
            error: function(error) {
                document.getElementById('classesEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                document.getElementById('classesEmailBtn').disabled = false
                toastr.error("Une erreur es survenue", "erreur", {
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    positionClass: "toast-top-right",
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                })
            }
        })

    }

})


//********************* End Email by classes session *********************/
//********************* End Email by classes session *********************/
//********************* End Email by classes session *********************/



//********************* Individual Email session *********************/
//********************* Individual Email session *********************/
//********************* Individual Email session *********************/
const indivEmailForm = document.getElementById('indivEmailForm')

indivEmailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('submit')

    // Validation du formulaire
    if ($('#indivEmailForm').parsley().isValid()) {
        document.getElementById('indivEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Enregistrement..."
        document.getElementById('indivEmailBtn').disabled = true

        mydata = new FormData()
        $('#indivEmailTutors').val().forEach(element => {
            mydata.append("recievers", element)
        })
        mydata.append("emailSubject", $('#indivEmailSubject').val())
        mydata.append("emailText", $('#indivEmailText').val())
        mydata.append("recieverGroup", 'Tuteurs')

        // Attatchment
        var totalfiles = document.getElementById('indivEmailAttatchment').files.length;
        for (var index = 0; index < totalfiles; index++) {
            // console.log(document.getElementById('indivEmailAttatchment').files[index])
            mydata.append("emailFiles", document.getElementById('indivEmailAttatchment').files[index]);
        }
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/SendEmailToPeople/',
            processData: false,
            contentType: false,
            data: mydata,
            enctype: "multipart/form-data",
            success: function(data) {
                if (data.status == true) {
                    classesEmailForm.reset();
                    // tutorsEmailsDataList.innerHTML = ""
                    // $('#tutorsEmailsTable').DataTable().clear().destroy()
                    // data.tutorsMessages.forEach(element => {
                    //     tutorsEmailsDataList.innerHTML += `
                    //             <tr>
                    //                 <td>${element.messageType}</td>
                    //                 <td>${element.messageProvider}</td>
                    //                 <td>${element.messageSubject}</td>
                    //                 <td>${element.messageDate} / ${element.messageHour }</td>
                    //                 <td>${element.messageStatus}</td>
                    //                 <td>
                    //                     <div class="button-list">
                    //                         <button class="btn waves-effect waves-light btn-info btn-sm" onclick="getObjectById('${element.id }')" data-toggle="tooltip" title="Informations"> <i class="mdi mdi-information-outline"></i> </button>
                    //                         <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                    //                     </div>
                    //                 </td>
                    //             </tr>
                    //         `
                    // })
                    // $('#tutorsEmailsTable').DataTable()

                    document.getElementById('indivEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('indivEmailBtn').disabled = false
                    toastr.success(data.message, "Succès", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                    setTimeout(reloadPage, 1000)
                } else {
                    document.getElementById('indivEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('indivEmailBtn').disabled = false
                    toastr.error(data.message, "erreur", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                }
            },
            error: function(error) {
                document.getElementById('indivEmailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                document.getElementById('indivEmailBtn').disabled = false
                toastr.error("Une erreur es survenue", "erreur", {
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    positionClass: "toast-top-right",
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                })
            }
        })

    }

})

//********************* End Individual Email session *********************/
//********************* End Individual Email session *********************/
//********************* End Individual Email session *********************/



//********************* Sms by classes session *********************/
//********************* Sms by classes session *********************/
//********************* Sms by classes session *********************/

const classesSmsForm = document.getElementById('classesSmsForm')

classesSmsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Validation du formulaire
    if ($('#classesSmsForm').parsley().isValid()) {

        document.getElementById('classesSmsBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Enregistrement..."
        document.getElementById('classesSmsBtn').disabled = true

        mydata = new FormData()
        $('#classesSmsClasses').val().forEach(element => {
            mydata.append("classes", element)
        })
        mydata.append("smsSubject", $('#classesSmsSubject').val())
        mydata.append("smsText", $('#classesSmsText').val())
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/SendSmsTotutorsByClasses/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                console.log(data)
                if (data.status == true) {
                    classesSmsForm.reset();
                    // tutorsEmailsDataList.innerHTML = ""
                    // $('#tutorsEmailsTable').DataTable().clear().destroy()
                    // data.tutorsMessages.forEach(element => {
                    //     tutorsEmailsDataList.innerHTML += `
                    //             <tr>
                    //                 <td>${element.messageType}</td>
                    //                 <td>${element.messageProvider}</td>
                    //                 <td>${element.messageSubject}</td>
                    //                 <td>${element.messageDate} / ${element.messageHour }</td>
                    //                 <td>${element.messageStatus}</td>
                    //                 <td>
                    //                     <div class="button-list">
                    //                         <button class="btn waves-effect waves-light btn-info btn-sm" onclick="getObjectById('${element.id }')" data-toggle="tooltip" title="Informations"> <i class="mdi mdi-information-outline"></i> </button>
                    //                         <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                    //                     </div>
                    //                 </td>
                    //             </tr>
                    //         `
                    // })
                    // $('#tutorsEmailsTable').DataTable()

                    document.getElementById('classesSmsBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('classesSmsBtn').disabled = false
                    toastr.success(data.message, "Succès", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                    setTimeout(reloadPage, 1000)
                } else {
                    document.getElementById('classesSmsBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('classesSmsBtn').disabled = false
                    toastr.error(data.message, "erreur", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                }
            },
            error: function(error) {
                document.getElementById('emailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                document.getElementById('emailBtn').disabled = false
                toastr.error("Une erreur es survenue", "erreur", {
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    positionClass: "toast-top-right",
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                })
            }
        })

    }

})

//********************* End Sms by classes session *********************/
//********************* End Sms by classes session *********************/
//********************* End Sms by classes session *********************/



//********************* Indiv Sms session *********************/
//********************* Indiv Sms session *********************/
//********************* Indiv Sms session *********************/

const indivSmsForm = document.getElementById('indivSmsForm')

indivSmsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Validation du formulaire
    if ($('#indivSmsForm').parsley().isValid()) {

        document.getElementById('indivSmsBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Enregistrement..."
        document.getElementById('indivSmsBtn').disabled = true

        mydata = new FormData()
        $('#indivSmsTutors').val().forEach(element => {
            mydata.append("recievers", element)
        })
        mydata.append("smsSubject", $('#indivSmsSubject').val())
        mydata.append("smsText", $('#indivSmsText').val())
        mydata.append("recieverGroup", 'Tuteurs')
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/SendSmsToPeople/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                console.log(data)
                if (data.status == true) {
                    indivSmsForm.reset();
                    // tutorsEmailsDataList.innerHTML = ""
                    // $('#tutorsEmailsTable').DataTable().clear().destroy()
                    // data.tutorsMessages.forEach(element => {
                    //     tutorsEmailsDataList.innerHTML += `
                    //             <tr>
                    //                 <td>${element.messageType}</td>
                    //                 <td>${element.messageProvider}</td>
                    //                 <td>${element.messageSubject}</td>
                    //                 <td>${element.messageDate} / ${element.messageHour }</td>
                    //                 <td>${element.messageStatus}</td>
                    //                 <td>
                    //                     <div class="button-list">
                    //                         <button class="btn waves-effect waves-light btn-info btn-sm" onclick="getObjectById('${element.id }')" data-toggle="tooltip" title="Informations"> <i class="mdi mdi-information-outline"></i> </button>
                    //                         <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                    //                     </div>
                    //                 </td>
                    //             </tr>
                    //         `
                    // })
                    // $('#tutorsEmailsTable').DataTable()

                    document.getElementById('indivSmsBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('indivSmsBtn').disabled = false
                    toastr.success(data.message, "Succès", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                    setTimeout(reloadPage, 1000)
                } else {
                    document.getElementById('indivSmsBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                    document.getElementById('indivSmsBtn').disabled = false
                    toastr.error(data.message, "erreur", {
                        timeOut: 5e3,
                        closeButton: !0,
                        debug: !1,
                        newestOnTop: !0,
                        progressBar: !0,
                        positionClass: "toast-top-right",
                        preventDuplicates: !0,
                        onclick: null,
                        showDuration: "300",
                        hideDuration: "1000",
                        extendedTimeOut: "1000",
                        showEasing: "swing",
                        hideEasing: "linear",
                        showMethod: "fadeIn",
                        hideMethod: "fadeOut",
                        tapToDismiss: !1
                    })
                }
            },
            error: function(error) {
                document.getElementById('emailBtn').innerHTML = "<i class='fa fa-paper-plane'></i>  Envoyer"
                document.getElementById('emailBtn').disabled = false
                toastr.error("Une erreur es survenue", "erreur", {
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    positionClass: "toast-top-right",
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                })
            }
        })

    }

})

//********************* End Indiv Sms session *********************/
//********************* End Indiv Sms session *********************/
//********************* End Indiv Sms session *********************/



//*********************  get message informations session *********************/
//*********************  get message informations session *********************/
//*********************  get message informations session *********************/

function getObjectById(id) {
    $.ajax({
        method: 'GET',
        url: `/school/getMessageDetailsById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                document.getElementById('messageDetailsform').reset();
                $('#messageDetailsMessage').summernote('destroy')
                $('#messageDetailsFilesTable').DataTable().clear().destroy()
                $('#messageDetailsClassesTable').DataTable().clear().destroy()
                $('#messageDetailsContactedPersonsTable').DataTable().clear().destroy()

                document.getElementById('messageDetailsReference').value = data.messagefound.reference
                document.getElementById('messageDetailsDate').value = data.messagefound.messageDate + "/ " + data.messagefound.messageHour
                document.getElementById('messageDetailsType').value = data.messagefound.messageType
                document.getElementById('messageDetailsProvider').value = data.messagefound.messageProvider
                document.getElementById('messageDetailsStatus').value = data.messagefound.messageStatus
                document.getElementById('messageDetailsObject').value = data.messagefound.messageSubject
                document.getElementById('messageDetailsMessage').value = data.messagefound.message
                $('#messageDetailsMessage').summernote({ height: 250, minHeight: null, maxHeight: null, focus: !1 })

                //Message files
                data.files.forEach(element => {
                    document.getElementById('messageDetailsFilesDataList').innerHTML += `
                                <tr>
                                    <td>${element.fileName}</td>
                                    <td>${element.fileType}</td>
                                    <td><a href="${element.path}">Telecharger</a></td>
                                </tr>
                            `
                })
                $('#messageDetailsFilesTable').DataTable()

                //Message Classes
                data.classes.forEach(element => {
                    document.getElementById('messageDetailsClassesDataList').innerHTML += `
                                <tr>
                                    <td>${element.wording}</td>
                                    <td>${element.graduation}</td>
                                </tr>
                            `
                })
                $('#messageDetailsClassesTable').DataTable()

                //Message contacted persons
                data.personsContacted.forEach(element => {
                    document.getElementById('messageDetailsContactedPersonsDataList').innerHTML += `
                                <tr>
                                    <td>${element.fullname}</td>
                                    <td>${element.gender}</td>
                                    <td>${element.phoneNumber}</td>
                                    <td>${element.email}</td>
                                    <td>${element.messageStatus}</td>
                                </tr>
                            `
                })
                $('#messageDetailsContactedPersonsTable').DataTable()


                $('#messageInformationsModal').modal('show')
            } else {
                console.log(data)
                toastr.error(data.message, "Erreur", {
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    positionClass: "toast-top-right",
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                })
            }
        },
        error: function(error) {
            toastr.error("Une erreur est survenue", "Erreur", {
                timeOut: 5e3,
                closeButton: !0,
                debug: !1,
                newestOnTop: !0,
                progressBar: !0,
                positionClass: "toast-top-right",
                preventDuplicates: !0,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                tapToDismiss: !1
            })
        }
    })
}

//********************* End get message informations session *********************/
//********************* End get message informations session *********************/
//********************* End get message informations session *********************/



//********************* delete message informations session *********************/
//********************* delete message informations session *********************/
//********************* delete message informations session *********************/

function deleteObject(id) {
    $.ajax({
        method: "GET",
        url: `/school/getMessageById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer le message " + data.message.reference,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/deleteMessageById/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                document.location.reload()
                                    // swal("Succès !!", data.message, "success")
                                    // setTimeout(reloadPage, 2000)
                            } else {
                                toastr.error(data.message, "Erreur", {
                                    timeOut: 5e3,
                                    closeButton: !0,
                                    debug: !1,
                                    newestOnTop: !0,
                                    progressBar: !0,
                                    positionClass: "toast-top-right",
                                    preventDuplicates: !0,
                                    onclick: null,
                                    showDuration: "300",
                                    hideDuration: "1000",
                                    extendedTimeOut: "1000",
                                    showEasing: "swing",
                                    hideEasing: "linear",
                                    showMethod: "fadeIn",
                                    hideMethod: "fadeOut",
                                    tapToDismiss: !1
                                })
                            }
                        }
                    })
                })
            } else {
                swal("Message !!", data.message, "error")
            }
        },
        error: function(error) {
            swal("Message !!", "Une erreur est survenue !!", "error")
        }
    })
}

//********************* End delete message informations session *********************/
//********************* End delete message informations session *********************/
//********************* End delete message informations session *********************/