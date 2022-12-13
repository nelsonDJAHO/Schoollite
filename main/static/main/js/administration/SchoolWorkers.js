$(document).ready(function() {
    $('.dropify').dropify();

    //Utilisateur
    $('#searchUserId').select2({
        ajax: {
            url: '/FilterNotAdministrative/',
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
                        return { id: item.id, text: item.fullname }
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

    //Fonctions
    $('#userGroupId').select2({
        ajax: {
            url: '/FilterUserGroup/',
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
                        return { id: item.id, text: item.wording }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    }
                }
            },
            placeholder: 'Rechercher une fonction',
            minimumInputLength: 1,
        }
    });

    // Etablissement
    $('#schoolId').select2({
        ajax: {
            url: '/FilterSchool/',
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
                        return { id: item.id, text: item.sigle }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    }
                }
            },
            placeholder: 'Rechercher une fonction',
            minimumInputLength: 1,
        }
    });

});


//Global declarations************

const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

//End Global declarations************


// Administration worker form **********************************

const schoolWorkerForm = document.getElementById('schoolWorkerForm')
const schoolWorkersDataList = document.getElementById('schoolWorkersDataList')

// School worker form reset envent
schoolWorkerForm.addEventListener('reset', () => {
    reloadDropify('/media/avatar.png')
        // document.getElementById('schoolId').value = ""
        //Fonctions
    $('#userGroupId').empty()
    $('#userGroupId').select2({
        ajax: {
            url: '/FilterUserGroup/',
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
                        return { id: item.id, text: item.wording }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    }
                }
            },
            placeholder: 'Rechercher une fonction',
            minimumInputLength: 1,
        }
    });

    // Etablissement
    $('#schoolId').empty()
    $('#schoolId').select2({
        ajax: {
            url: '/FilterSchool/',
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
                        return { id: item.id, text: item.sigle }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    }
                }
            },
            placeholder: 'Rechercher une fonction',
            minimumInputLength: 1,
        }
    });
})

// School worker form post event
schoolWorkerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#schoolWorkerForm').parsley().isValid()) {
        document.getElementById('schoolWorkerBtn').innerHTML = "Enregistrement..."
        document.getElementById('schoolWorkerBtn').disabled = true

        let userId = document.getElementById('userId').value
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
        let userGroupId = document.getElementById('userGroupId').value
        let hiringDate = document.getElementById('hiringDate').value
        let schoolId = document.getElementById('schoolId').value

        mydata = new FormData()
        mydata.append('userId', userId)
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
        mydata.append('userGroupId', userGroupId)
        mydata.append('hiringDate', hiringDate)
        mydata.append('schoolId', schoolId)
        mydata.append('avatar', document.getElementById('avatar').files[0])
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/SchoolWorkers/',
            processData: false,
            contentType: false,
            data: mydata,
            mimeType: "multipart/form-data",
            success: function(data) {
                rdata = JSON.parse(data)
                if (rdata.status == true) {
                    schoolWorkerForm.reset();
                    schoolWorkersDataList.innerHTML = ""
                    $('#schoolWorkersTable').DataTable().clear().destroy()
                    rdata.schoolWorkers.forEach(element => {
                        schoolWorkersDataList.innerHTML += `
                             <tr>
                            <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                            <td>${element.fullName}</td>
                            <td>${element.gender}</td>
                            <td>${element.userGroup}</td>
                            <td>${element.school}</td>
                            <td>${element.startDate}</td>
                            <td>
                                <div class="button-list">
                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="removeObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi icon-trash"></i> </button>
                                </div>
                            </td>
                        </tr>
                        `
                    });
                    $('#schoolWorkersTable').DataTable()
                    document.getElementById('schoolWorkerBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('schoolWorkerBtn').disabled = false
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
                    document.getElementById('schoolWorkerBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('schoolWorkerBtn').disabled = false
                }
            }
        })

    }
})

// Get element
function getObjectById(id) {
    schoolWorkerForm.reset();
    $.ajax({
        method: 'GET',
        url: `/getSchoolworkerbyid/${id}/`,
        success: function(data) {
            if (data.status == true) {
                // $('#userGroupId').select2('destroy');
                // $('#schoolId').select2('destroy');
                document.getElementById('userId').value = data.schoolWorker.id
                document.getElementById('lastName').value = data.schoolWorker.lastName
                document.getElementById('firstName').value = data.schoolWorker.firstName
                document.getElementById('gender').value = data.schoolWorker.gender
                document.getElementById('birthDate').value = data.schoolWorker.birthDate
                document.getElementById('birthCountry').value = data.schoolWorker.birthCountry
                document.getElementById('birthTown').value = data.schoolWorker.birthTown
                document.getElementById('nationality').value = data.schoolWorker.nationality
                document.getElementById('livingCountry').value = data.schoolWorker.livingCountry
                document.getElementById('livingTown').value = data.schoolWorker.livingTown
                document.getElementById('livingAddress').value = data.schoolWorker.livingAddress
                document.getElementById('email').value = data.schoolWorker.email
                document.getElementById('phoneNumber').value = data.schoolWorker.phoneNumber
                document.getElementById('userGroupId').value = data.schoolWorker.userGroupId
                $('#userGroupId').empty().append('<option value="' + data.schoolWorker.userGroupId + '">' + data.schoolWorker.userGroup + '</option>').val(data.schoolWorker.userGroupId).trigger('change')
                document.getElementById('hiringDate').value = data.schoolWorker.hiringDate
                document.getElementById('schoolId').value = data.schoolWorker.schoolId
                $('#schoolId').empty().append('<option value="' + data.schoolWorker.schoolId + '">' + data.schoolWorker.school + '</option>').val(data.schoolWorker.schoolId).trigger('change')
                reloadDropify(data.schoolWorker.avatar)
                $('#schoolWorkerModal').modal('show')
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
function removeObject(id) {
    schoolWorkerForm.reset();
    $.ajax({
        method: "GET",
        url: `/getSchoolworkerbyid/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir continuer ?",
                    text: "Retirer " + data.schoolWorker.fullName + " du personnel administratif ?",
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Retirer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/RetireUserFromSchoolWorkers/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                schoolWorkerForm.reset();
                                schoolWorkersDataList.innerHTML = ""
                                $('#schoolWorkersTable').DataTable().clear().destroy()
                                data.schoolWorkers.forEach(element => {
                                    schoolWorkersDataList.innerHTML += `
                                    <tr>
                                    <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                                    <td>${element.fullName}</td>
                                    <td>${element.gender}</td>
                                    <td>${element.userGroup}</td>
                                    <td>${element.school}</td>
                                    <td>${element.startDate}</td>
                                    <td>
                                        <div class="button-list">
                                            <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                            <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="removeObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi icon-trash"></i> </button>
                                        </div>
                                    </td>
                                </tr>
                                `
                                });
                                $('#schoolWorkersTable').DataTable()
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

// Administration worker form **********************************


// Old member ****************************************

//add old member
const schoolAddWorkerForm = document.getElementById('schoolAddWorkerForm')

schoolAddWorkerForm.addEventListener('reset', () => {
    $('#searchUserId').empty()
    $('#searchUserId').select2({
        ajax: {
            url: '/FilterNotAdministrative/',
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
                        return { id: item.id, text: item.fullname }
                    }),
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    }
                }
            },
            placeholder: 'Rechercher',
            minimumInputLength: 1,
        },
        placeholder: 'Rechercher un membre',
    });
})

schoolAddWorkerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if ($('#schoolAddWorkerForm').parsley().isValid()) {
        document.getElementById('schoolAddWorkerBtn').innerHTML = "Enregistrement..."
        document.getElementById('schoolAddWorkerBtn').disabled = true

        let userId = document.getElementById('searchUserId').value
        let schoolId = document.getElementById('searchSchoolId').value
        let userGroupId = document.getElementById('searchUserGroupId').value

        mydata = new FormData()
        mydata.append('userId', userId)
        mydata.append('schoolId', schoolId)
        mydata.append('userGroupId', userGroupId)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: `/AddMemberToAdministrative/`,
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    schoolAddWorkerForm.reset();
                    schoolWorkersDataList.innerHTML = ""
                    $('#schoolWorkersTable').DataTable().clear().destroy()
                    data.schoolWorkers.forEach(element => {
                        schoolWorkersDataList.innerHTML += `
                             <tr>
                            <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                            <td>${element.fullName}</td>
                            <td>${element.gender}</td>
                            <td>${element.userGroup}</td>
                            <td>${element.school}</td>
                            <td>${element.startDate}</td>
                            <td>
                                <div class="button-list">
                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="removeObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi icon-trash"></i> </button>
                                </div>
                            </td>
                        </tr>
                        `
                    });
                    $('#schoolWorkersTable').DataTable()
                    document.getElementById('schoolAddWorkerBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('schoolAddWorkerBtn').disabled = false
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
                    document.getElementById('schoolAddWorkerBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('schoolAddWorkerBtn').disabled = false
                }
            }
        })

    }

})

// Old member ****************************************