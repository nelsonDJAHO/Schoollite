const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const administratorForm = document.getElementById('administratorForm')
const adminsDataList = document.getElementById('adminsDataList')

administratorForm.addEventListener('reset', () => {
    reloadDropify('/media/avatar.png')
})


administratorForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if ($('#administratorForm').parsley().isValid()) {
                document.getElementById('adminBtn').innerHTML = "Enregistrement..."
                document.getElementById('adminBtn').disabled = true

                let adminId = document.getElementById('adminId').value
                let lastName = document.getElementById('lastName').value
                let firstName = document.getElementById('firstName').value
                let gender = document.getElementById('gender').value
                let birthDate = document.getElementById('birthDate').value
                let birthCountry = document.getElementById('birthCountry').value
                let birthTown = document.getElementById('birthTown').value
                let nationality = document.getElementById('nationality').value
                let livingCountry = document.getElementById('livingCountry').value
                let livingTown = document.getElementById('livingTown').value
                let livingAddress = document.getElementById('livingAddress').value
                let email = document.getElementById('email').value
                let phoneNumber = document.getElementById('phoneNumber').value

                mydata = new FormData()
                mydata.append('adminId', adminId)
                mydata.append('lastName', lastName)
                mydata.append('firstName', firstName)
                mydata.append('gender', gender)
                mydata.append('birthDate', birthDate)
                mydata.append('birthCountry', birthCountry)
                mydata.append('birthTown', birthTown)
                mydata.append('nationality', nationality)
                mydata.append('livingCountry', livingCountry)
                mydata.append('livingTown', livingTown)
                mydata.append('livingAddress', livingAddress)
                mydata.append('email', email)
                mydata.append('phoneNumber', phoneNumber)
                mydata.append('avatar', document.getElementById('avatar').files[0])
                mydata.append('csrfmiddlewaretoken', csrftoken)

                $.ajax({
                            method: 'POST',
                            url: '/Administrators/',
                            processData: false,
                            contentType: false,
                            data: mydata,
                            mimeType: "multipart/form-data",
                            success: function(data) {
                                    rdata = JSON.parse(data)
                                    if (rdata.status == true) {
                                        administratorForm.reset();
                                        adminsDataList.innerHTML = ""
                                        $('#adminsTable').DataTable().clear().destroy()
                                        rdata.admins.forEach(element => {
                                                    adminsDataList.innerHTML += `
                             <tr>
                        <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                        <td>${element.fullName}</td>
                        <td>${element.gender}</td>
                        <td>${element.userGroup}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Actif (ve)</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactif (ve)</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-danger btn-sm" data-toggle="tooltip" title="Supprimer" onclick="deleteObject('${element.id}')"> <i class="icon-trash"></i> </button>
                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateObject('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateObject('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#adminsTable').DataTable()

                    document.getElementById('adminBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('adminBtn').disabled = false
                    toastr.success(rdata.message, "Succès", {
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
                    toastr.error(rdata.message, "Erreur", {
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
                    document.getElementById('adminBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('adminBtn').disabled = false
                }
            }
        })
    }

})


// DeactiveAdministrator
function activateDeactivateObject(id, action) {
    administratorForm.reset();
    $.ajax({
        method: "GET",
        url: `/getUserById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir contiuer ?",
                    text: action+" " + data.user.fullName,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, "+action+" !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/DeactiveAdministrator/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                administratorForm.reset();
                                        adminsDataList.innerHTML = ""
                                        $('#adminsTable').DataTable().clear().destroy()
                                        data.admins.forEach(element => {
                                                    adminsDataList.innerHTML += `
                                            <tr>
                                        <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                                        <td>${element.fullName}</td>
                                        <td>${element.gender}</td>
                                        <td>${element.userGroup}</td>
                                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Actif (ve)</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactif (ve)</span>`}</td>
                                        <td>
                                            <div class="button-list">
                                                <button class="btn waves-effect waves-light btn-danger btn-sm" data-toggle="tooltip" title="Supprimer" onclick="deleteObject('${element.id}')"> <i class="icon-trash"></i> </button>
                                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateObject('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateObject('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                            </div>
                                        </td>
                                    </tr>
                                        `
                                    });
                                    $('#adminsTable').DataTable()
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


//Delete object
function deleteObject(id) {
administratorForm.reset();
    $.ajax({
        method: "GET",
        url: `/getUserById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer " + data.user.fullName,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/DeleteAdministrator/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                administratorForm.reset();
                                        adminsDataList.innerHTML = ""
                                        $('#adminsTable').DataTable().clear().destroy()
                                        data.admins.forEach(element => {
                                                    adminsDataList.innerHTML += `
                                        <tr>
                                    <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                                    <td>${element.fullName}</td>
                                    <td>${element.gender}</td>
                                    <td>${element.userGroup}</td>
                                    <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Actif (ve)</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactif (ve)</span>`}</td>
                                    <td>
                                        <div class="button-list">
                                            <button class="btn waves-effect waves-light btn-danger btn-sm" data-toggle="tooltip" title="Supprimer" onclick="deleteObject('${element.id}')"> <i class="icon-trash"></i> </button>
                                                ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="activateDeactivateObject('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="activateDeactivateObject('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                        </div>
                                    </td>
                                </tr>
                                    `
                                });
                                $('#adminsTable').DataTable()
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