const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const emailSettingForm = document.getElementById('emailSettingForm')
const emailSettingDataList = document.getElementById('emailSettingDataList')

emailSettingForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    if($('#emailSettingForm').parsley().isValid()){

    document.getElementById('emailSettingBtn').innerHTML = "Enregistrer..."
    document.getElementById('emailSettingBtn').disabled = true

    let emailSettingId = document.getElementById('emailSettingId').value
    let smtpServer = document.getElementById('smtpServer').value
    let smtpServerPort = document.getElementById('smtpServerPort').value
    let loginEmail = document.getElementById('loginEmail').value
    let loginPassword = document.getElementById('loginPassword').value

    mydata = new FormData()
    mydata.append('emailSettingId', emailSettingId)
    mydata.append('smtpServer', smtpServer)
    mydata.append('smtpServerPort', smtpServerPort)
    mydata.append('loginEmail', loginEmail)
    mydata.append('loginPassword', loginPassword)
    mydata.append('csrfmiddlewaretoken', csrftoken)
    $.ajax({
        method:'POST',
        url: '/EmailSettings/',
        processData: false,
        contentType: false,
        data:mydata,
        success:function(data){
            if (data.status == true) {
                    emailSettingForm.reset();
                    emailSettingDataList.innerHTML = ""
                    $('#emailSettingsTable').DataTable().clear().destroy()
                    data.emailSettings.forEach(element => {
                        emailSettingDataList.innerHTML += `
                    <tr>
                        <td>${element.smtpServer}</td>
                        <td>${element.smtpServerPort}</td>
                        <td>${element.loginEmail}</td>
                        <td>${element.loginPassword}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getEmailSetting('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteEmailSetting('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                                ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateEmailSetting('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateEmailSetting('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                            </div>
                        </td>
                    </tr>
                `
                    });
                    $('#emailSettingsTable').DataTable()


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
                    document.getElementById('emailSettingBtn').innerHTML = "Enregistrer"
                    document.getElementById('emailSettingBtn').disabled = false
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
                    document.getElementById('academicYearBtn').innerHTML = "Enregistrer"
                    document.getElementById('academicYearBtn').disabled = false
                }
        }
    })
}

})


// Get element
function getEmailSetting(id) {
    $.ajax({
        method: 'GET',
        url: `/GetEmailSettingById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                emailSettingForm.reset();
                document.getElementById('emailSettingId').value = data.emailSetting.id
                document.getElementById('smtpServer').value = data.emailSetting.smtpServer
                document.getElementById('smtpServerPort').value = data.emailSetting.smtpServerPort
                document.getElementById('loginEmail').value = data.emailSetting.loginEmail
                document.getElementById('loginPassword').value = data.emailSetting.loginPassword
                $('#emailModal').modal('show')
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



//Delete object
function deleteEmailSetting(id) {
emailSettingForm.reset();
    $.ajax({
        method: "GET",
        url: `/GetEmailSettingById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer la configuration du serveur " + data.emailSetting.smtpServer,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !0,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/DeleteEmailSetting/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                emailSettingForm.reset();
                                emailSettingDataList.innerHTML = ""
                                $('#emailSettingsTable').DataTable().clear().destroy()
                                data.emailSettings.forEach(element => {
                                    emailSettingDataList.innerHTML += `
                                <tr>
                                    <td>${element.smtpServer}</td>
                                    <td>${element.smtpServerPort}</td>
                                    <td>${element.loginEmail}</td>
                                    <td>${element.loginPassword}</td>
                                    <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                                    <td>
                                        <div class="button-list">
                                            <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getEmailSetting('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                            <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteEmailSetting('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                                            ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateEmailSetting('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateEmailSetting('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                        </div>
                                    </td>
                                </tr>
                            `
                                });
                                $('#emailSettingsTable').DataTable()
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


// Activate or deactivate email
function activateDeactivateEmailSetting(id, action){
emailSettingForm.reset();
    $.ajax({
        method: "GET",
        url: `/GetEmailSettingById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir poursuivre ?",
                    text: action+" la configuration du servereur " + data.emailSetting.smtpServer,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, "+action+" !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/ActivateDeactivateEmailSetting/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                        emailSettingDataList.innerHTML = ""
                                $('#emailSettingsTable').DataTable().clear().destroy()
                                data.emailSettings.forEach(element => {
                                    emailSettingDataList.innerHTML += `
                                <tr>
                                    <td>${element.smtpServer}</td>
                                    <td>${element.smtpServerPort}</td>
                                    <td>${element.loginEmail}</td>
                                    <td>${element.loginPassword}</td>
                                    <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                                    <td>
                                        <div class="button-list">
                                            <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getEmailSetting('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                            <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteEmailSetting('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                                            ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateEmailSetting('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateEmailSetting('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                        </div>
                                    </td>
                                </tr>
                            `
                                });
                                $('#emailSettingsTable').DataTable()
                                swal("Succès !!", data.message, "success")
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



//SMS
