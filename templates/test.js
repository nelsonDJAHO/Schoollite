$(document).ready(function() {

    $('#searchTutor').select2({
        width: '100%',
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

    $('#studentId').select2({
        width: '100%',
        ajax: {
            url: '/school/StudentFilter/',
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

});

$(document).ready(function() {
    $('.dropify').dropify();
    $('#emailText').summernote({ height: 250, minHeight: null, maxHeight: null, focus: !1 })
});


//search a tutor
var $select = $('#searchTutor')
$select.on("change", function(e) {
    id = document.getElementById('searchTutor').value
    $.ajax({
        method: 'GET',
        url: `/getUserById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                tutorForm.reset();
                document.getElementById('tutorId').value = data.user.id
                document.getElementById('lastName').value = data.user.lastName
                document.getElementById('firstName').value = data.user.firstName
                document.getElementById('gender').value = data.user.gender
                document.getElementById('birthDate').value = data.user.birthDate
                document.getElementById('birthCountry').value = data.user.birthCountry
                document.getElementById('birthTown').value = data.user.birthTown
                document.getElementById('nationality').value = data.user.nationality
                document.getElementById('livingCountry').value = data.user.livingCountry
                document.getElementById('livingTown').value = data.user.livingTown
                document.getElementById('livingAddress').value = data.user.address
                document.getElementById('email').value = data.user.email
                document.getElementById('phoneNumber').value = data.user.phoneNumber
                document.getElementById('profession').value = data.user.profession
                document.getElementById('companyName', companyName).value = data.user.companyName
                reloadDropify(data.user.avatar)
                $('#tutorModal').modal('show')
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
});

const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const tutorForm = document.getElementById('tutorForm')
const tutorsDataList = document.getElementById('tutorsDataList')

tutorForm.addEventListener('reset', () => {
    reloadDropify('/media/avatar.png')

    $('#searchTutor').empty()
    $('#searchTutor').select2({
        width: '100%',
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
})

tutorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#tutorForm').parsley().isValid()) {
        document.getElementById('tutorBtn').innerHTML = "Enregistrement..."
        document.getElementById('tutorBtn').disabled = true

        let tutorId = document.getElementById('tutorId').value
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
        let profession = document.getElementById('profession').value
        let companyName = document.getElementById('companyName').value

        mydata = new FormData()
        mydata.append('tutorId', tutorId)
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
        mydata.append('profession', profession)
        mydata.append('companyName', companyName)
        mydata.append('avatar', document.getElementById('avatar').files[0])
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/Tutors/',
            processData: false,
            contentType: false,
            data: mydata,
            mimeType: "multipart/form-data",
            success: function(data) {
                rdata = JSON.parse(data)
                if (rdata.status == true) {
                    tutorForm.reset();
                    tutorsDataList.innerHTML = ""
                    $('#tutorsTable').DataTable().clear().destroy()
                    rdata.tutors.forEach(element => {
                        tutorsDataList.innerHTML += `
                             <tr>
                        <td>${element.fullName}</td>
                        <td>${element.gender}</td>
                        <td>${element.address}</td>
                        <td>${element.phoneNumber}</td>
                        <td>${element.email}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                                <button class="btn waves-effect waves-light btn-info btn-sm text-white" onclick="tutorLink('${ element.id }')" data-toggle="tooltip" title="liaison tuteur"><i class="fa fa-share-alt "></i> </button>
                                <button class="btn waves-effect waves-light btn-secondary btn-sm text-white" onclick="openMessageModal('${ element.id }')" data-toggle="tooltip" title="Envoyer un message"> <i class="fa fa-envelope"></i> </button>
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#tutorsTable').DataTable()

                    document.getElementById('tutorBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('tutorBtn').disabled = false
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
                    document.getElementById('tutorBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('tutorBtn').disabled = false
                }
            }
        })
    }

})




// Get element
function getObjectById(id) {
    $.ajax({
        method: 'GET',
        url: `/getUserById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                tutorForm.reset();
                document.getElementById('tutorId').value = data.user.id
                document.getElementById('lastName').value = data.user.lastName
                document.getElementById('firstName').value = data.user.firstName
                document.getElementById('gender').value = data.user.gender
                document.getElementById('birthDate').value = data.user.birthDate
                document.getElementById('birthCountry').value = data.user.birthCountry
                document.getElementById('birthTown').value = data.user.birthTown
                document.getElementById('nationality').value = data.user.nationality
                document.getElementById('livingCountry').value = data.user.livingCountry
                document.getElementById('livingTown').value = data.user.livingTown
                document.getElementById('livingAddress').value = data.user.address
                document.getElementById('email').value = data.user.email
                document.getElementById('phoneNumber').value = data.user.phoneNumber
                document.getElementById('profession').value = data.user.profession
                document.getElementById('companyName', companyName).value = data.user.companyName
                reloadDropify(data.user.avatar)
                $('#tutorModal').modal('show')
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
function deleteObject(id) {
    tutorForm.reset();
    $.ajax({
        method: "GET",
        url: `/getUserById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer le tuteur " + data.user.fullName + " PS: Toutes les liaisons avec vos apprenants seront supprimer",
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteTutor/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                // console.log(data)
                                tutorForm.reset();
                                tutorsDataList.innerHTML = ""
                                $('#tutorsTable').DataTable().clear().destroy()
                                data.tutors.forEach(element => {
                                    tutorsDataList.innerHTML += `
                                <tr>
                                    <td>${element.fullName}</td>
                                    <td>${element.gender}</td>
                                    <td>${element.address}</td>
                                    <td>${element.phoneNumber}</td>
                                    <td>${element.email}</td>
                                    <td>
                                        <div class="button-list">
                                            <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                                                <button class="btn waves-effect waves-light btn-info btn-sm text-white" onclick="tutorLink('${ element.id }')" data-toggle="tooltip" title="liaison tuteur"><i class="fa fa-share-alt "></i> </button>
                                <button class="btn waves-effect waves-light btn-secondary btn-sm text-white" onclick="openMessageModal('{{ tutor.id }}')" data-toggle="tooltip" title="Envoyer un message"> <i class="fa fa-envelope"></i> </button>
                                        </div>
                                    </td>
                                </tr>
                                    `
                                });
                                $('#tutorsTable').DataTable()
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



// Tutor link
const studentsDataList = document.getElementById('studentsDataList')

function tutorLink(id) {
    $.ajax({
        url: `/school/GetTutorStudents/${id}/`,
        method: "GET",
        success: function(data) {
            if (data.status == true) {
                // // console.log(data)
                studentsDataList.innerHTML = ""
                $('#studentsTable').DataTable().clear().destroy()
                data.studentTutors.forEach(element => {
                    document.getElementById('linkTutorId').value = element.tutorId
                    document.getElementById('tutorName').innerHTML = element.tutorName
                    studentsDataList.innerHTML += `
                             <tr>
                        <td>${element.fullname}</td>
                        <td>${element.gender}</td>
                        <td>${element.phoneNumber}</td>
                        <td>${element.affiliation}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getTutorLink('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="removeTutorLink('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                            </div>
                        </td>
                    </tr>
                        `
                });
                $('#studentsTable').DataTable()
                $('#studentsModal').modal('show');
            } else {
                document.getElementById('tutorName').innerHTML = data.studentTutors.tutorName
                document.getElementById('linkTutorId').value = data.studentTutors.tutorId
                studentsDataList.innerHTML = ""
                $('#studentsTable').DataTable().clear().destroy()
                $('#studentsTable').DataTable()
                $('#studentsModal').modal('show');
                toastr.warning(data.message, "message", {
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


//Get tutor link
function getTutorLink(id) {
    $.ajax({
        method: 'GET',
        url: `/school/GetTutorLinkById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                document.getElementById('tutorAffiliationFeaturingId').value = data.tutorLink.id
                $('#studentId').empty().append('<option value="' + data.tutorLink.studentId + '">' + data.tutorLink.studentFullName + '</option>').val(data.tutorLink.studentId).trigger('change')
                document.getElementById('tutorAffiliationId').value = data.tutorLink.tutorAffiliationId
                    // $('#studentsModal').modal('show')
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



//*********************************** TUTOR MESSAGE SESSION ****************************/
//*********************************** TUTOR MESSAGE SESSION ****************************/
//*********************************** TUTOR MESSAGE SESSION ****************************/

//Get tutor informations befor open message modal
function openMessageModal(tutorId) {
    $.ajax({
        method: "GET",
        url: `/getUserById/${tutorId}/`,
        success: function(data) {
            if (data.status == true) {
                $('#emailModal').modal('show');
                document.getElementById('tutorEmail').value = data.user.email
                document.getElementById('tutorPhonenumber').value = data.user.phoneNumber
            }
        }
    })
}

//*********************************** END TUTOR MESSAGE SESSION ****************************/
//*********************************** END TUTOR MESSAGE SESSION ****************************/
//*********************************** END TUTOR MESSAGE SESSION ****************************/