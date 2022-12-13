const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;


// ********************* Email section *********************//
// ********************* Email section *********************//
// ********************* Email section *********************//

// Tester la connexion au serveur
function testEmailServerConnexion(id) {
    $.ajax({
        method: 'GET',
        url: `/school/testEmailServerConnexion/${id}/`,
        success: function(data) {
            if (data.status == true) {
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
                    progressBar:
                        !0,
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
}

//Gmail form
//Gmail form
//Gmail form

const gmailForm = document.getElementById('gmailForm')
const emailConfigurationsDataList = document.getElementById('emailConfigurationsDataList')
const emailConfigurationsTable = document.getElementById('emailConfigurationsTable')

gmailForm.addEventListener('reset', () => {
    $('#emailSettingModal').modal('hide');
})

function getEmailSettings(id) {
    gmailForm.reset()
    $.ajax({
        method: 'GET',
        url: `/school/GetEmailSetting/${id}/`,
        success: function(data) {
            if (data.status == true) {
                document.getElementById('gmailSettingId').value = data.emailConfig.id
                document.getElementById('gmailEmail').value = data.emailConfig.loginEmail
                document.getElementById('gmailPassword').value = data.emailConfig.loginPassword
                $('#emailSettingModal').modal('show');
            } else {

            }
        }
    })
}

gmailForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if ($('#gmailForm').parsley().isValid()) {
                document.getElementById('gmailBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                document.getElementById('gmailBtn').disabled = true

                let gmailSettingId = document.getElementById('gmailSettingId').value
                let gmailEmail = document.getElementById('gmailEmail').value
                let gmailPassword = document.getElementById('gmailPassword').value

                mydata = new FormData()
                mydata.append('gmailSettingId', gmailSettingId)
                mydata.append('provider', 'Gmail')
                mydata.append('gmailEmail', gmailEmail)
                mydata.append('gmailPassword', gmailPassword)
                mydata.append('csrfmiddlewaretoken', csrftoken)

                $.ajax({
                            method: 'POST',
                            url: '/school/EmailSettings/',
                            processData: false,
                            contentType: false,
                            data: mydata,
                            success: function(data) {
                                    if (data.status == true) {
                                        gmailForm.reset();
                                        emailConfigurationsDataList.innerHTML = ""
                                        $('#emailConfigurationsTable').DataTable().clear().destroy()
                                        data.emailSettings.forEach(element => {
                                                    emailConfigurationsDataList.innerHTML += `
                        <tr>
                        <td>${element.provider}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.updatedAt}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" title="Modifier" onclick="getEmailSettings('${element.id}')"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateDeactivateEmailSetting('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateDeactivateEmailSetting('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                <button class="btn waves-effect waves-light btn-info btn-sm text-white" onclick="testEmailServerConnexion('${ element.id }')" data-toggle="tooltip" title="Tester"> <i class="mdi mdi-login"></i> </button>
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#emailConfigurationsTable').DataTable()

                    document.getElementById('gmailBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('gmailBtn').disabled = false
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
                    document.getElementById('gmailBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('gmailBtn').disabled = false
                }
            }
        })

    }

})


// activate or deactivate  configuration
function activateDeactivateDeactivateEmailSetting(id, action) {
    gmailForm.reset();
    $.ajax({
        method: "GET",
        url: `/school/GetEmailSetting/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir contiuer ?",
                    text: action+" la configuration " + data.emailConfig.provider,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, "+action+" !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/ActivateDeactivateEmailSetting/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                               gmailForm.reset();
                                        emailConfigurationsDataList.innerHTML = ""
                                        $('#emailConfigurationsTable').DataTable().clear().destroy()
                                        data.emailSettings.forEach(element => {
                                                    emailConfigurationsDataList.innerHTML += `
                        <tr>
                        <td>${element.provider}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.updatedAt}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" title="Modifier" onclick="getEmailSettings('${element.id}')"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateDeactivateEmailSetting('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateDeactivateEmailSetting('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                <button class="btn waves-effect waves-light btn-info btn-sm text-white" onclick="testEmailServerConnexion('${ element.id }')" data-toggle="tooltip" title="Tester"> <i class="mdi mdi-login"></i> </button>
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#emailConfigurationsTable').DataTable()
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
    })
}



//End Gmail form
//End Gmail form
//End Gmail form


// ********************* End Email section *********************//
// ********************* End Email section *********************//
// ********************* End Email section *********************//





// ********************* SMS section *********************//
// ********************* SMS section *********************//
// ********************* SMS section *********************//


//SMS zedeka form
//SMS zedeka form
//SMS zedeka form
const smsZedekaForm = document.getElementById('smsZedekaForm')
const smsConfigurationsDataList = document.getElementById('smsConfigurationsDataList')
const smsConfigurationsTable = document.getElementById('smsConfigurationsTable')


smsZedekaForm.addEventListener('reset', () => {
    $('#smsSettingModal').modal('hide');
})

function getSmsSettings(id) {
    smsZedekaForm.reset()
    $.ajax({
        method: 'GET',
        url: `/school/GetSMSSetting/${id}/`,
        success: function(data) {
            if (data.status == true) {
                document.getElementById('smszedekaSettingId').value = data.smsConfig.id
                document.getElementById('APIkey').value = data.smsConfig.APIkey
                document.getElementById('clientId').value = data.smsConfig.clientId
                document.getElementById('senderId').value = data.smsConfig.senderId
                $('#smsSettingModal').modal('show');
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
}


smsZedekaForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    if ($('#smsZedekaForm').parsley().isValid()) {
        
        let smszedekaSettingId = document.getElementById('smszedekaSettingId').value
        let APIkey = document.getElementById('APIkey').value
        let clientId = document.getElementById('clientId').value
        let senderId = document.getElementById('senderId').value

        mydata = new FormData()
        mydata.append('smszedekaSettingId', smszedekaSettingId)
        mydata.append('provider', 'SMS Zedeka')
        mydata.append('APIkey', APIkey)
        mydata.append('clientId', clientId)
        mydata.append('senderId', senderId)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
        method: 'POST',
        url: '/school/SmsSettings/',
        processData: false,
        contentType: false,
        data: mydata,
        success: function(data) {
            if (data.status == true) {
                    smsZedekaForm.reset();
                    smsConfigurationsDataList.innerHTML = ""
                    $('#smsConfigurationsTable').DataTable().clear().destroy()
                    data.smsSettings.forEach(element => {
                                smsConfigurationsDataList.innerHTML += `
                        <tr>
                        <td>${element.provider}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.updatedAt}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" title="Modifier" onclick="getSmsSettings('${element.id}')"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateDeactivateSmsSetting('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateDeactivateSmsSetting('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#smsConfigurationsTable').DataTable()

                    document.getElementById('smsZedekaBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('smsZedekaBtn').disabled = false
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
                    document.getElementById('smsZedekaBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('smsZedekaBtn').disabled = false
                }
            }
        })

    }

})


// activate or deactivate  configuration
function activateDeactivateDeactivateSmsSetting(id, action) {
    smsZedekaForm.reset();
    $.ajax({
        method: "GET",
        url: `/school/GetSMSSetting/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir contiuer ?",
                    text: action+" la configuration " + data.smsConfig.provider,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, "+action+" !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/ActivateDeactivateSMSSetting/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                               smsZedekaForm.reset();
                    smsConfigurationsDataList.innerHTML = ""
                    $('#smsConfigurationsTable').DataTable().clear().destroy()
                    data.smsSettings.forEach(element => {
                                smsConfigurationsDataList.innerHTML += `
                        <tr>
                        <td>${element.provider}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.updatedAt}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" title="Modifier" onclick="getSmsSettings('${element.id}')"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateDeactivateSmsSetting('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateDeactivateSmsSetting('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#smsConfigurationsTable').DataTable()
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
    })
}

//End SMS zedeka form
//End SMS zedeka form
//End SMS zedeka form


// ********************* End SMS section *********************//
// ********************* End SMS section *********************//
// ********************* End SMS section *********************//