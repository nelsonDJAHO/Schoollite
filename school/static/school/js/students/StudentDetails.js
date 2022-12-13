//*************** ************************ */
//*************** ************************ */
// Tutor section
//*************** ************************ */
//*************** ************************ */

$(document).ready(function() {

    $('#tutorId').select2({
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

});



const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const tutorForm = document.getElementById('tutorForm')
const tutorsDataList = document.getElementById('tutorsDataList')



tutorForm.addEventListener('reset', () => {
    $('#tutorId').empty()
    $('#tutorId').select2({
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

        document.getElementById('linkTutorBtn').innerHTML = "Enregistrer..."
        document.getElementById('linkTutorBtn').disabled = true

        let tutorAffiliationFeaturingId = document.getElementById('tutorAffiliationFeaturingId').value
        let tutorId = document.getElementById('tutorId').value
        let studentId = document.getElementById('studentId').value
        let tutorAffiliationId = document.getElementById('tutorAffiliationId').value

        mydata = new FormData();
        mydata.append('tutorAffiliationFeaturingId', tutorAffiliationFeaturingId)
        mydata.append('tutorId', tutorId)
        mydata.append('studentId', studentId)
        mydata.append('tutorAffiliationId', tutorAffiliationId)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/LinkStudentTutor/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    tutorForm.reset();
                    tutorsDataList.innerHTML = ""
                    $('#tutorsTable').DataTable().clear().destroy()
                    data.studentTutors.forEach(element => {
                        tutorsDataList.innerHTML += `
                             <tr>
                            <td>${element.fullname}</td>
                            <td>${element.gender}</td>
                            <td>${element.affiliation}</td>
                            <td>${element.phoneNumber}</td>
                            <td>
                                <div class="button-list">
                                    <a href="/school/TutorDetails/${element.tutorId}/" class="btn waves-effect waves-light btn-info btn-sm" data-toggle="tooltip" title="Consulter"><i class="icon-eye"></i></a>
                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getTutorLink('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="removeTutorLink('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                </div>
                            </td>
                        </tr>
                        `
                    });
                    $('#tutorsTable').DataTable()
                    document.getElementById('linkTutorBtn').innerHTML = "Enregistrer"
                    document.getElementById('linkTutorBtn').disabled = false
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
                    document.getElementById('linkTutorBtn').innerHTML = "Enregistrer"
                    document.getElementById('linkTutorBtn').disabled = false
                }
            }
        })

    }

})


//Get tutor link
function getTutorLink(id) {
    $.ajax({
        method: 'GET',
        url: `/school/GetTutorLinkById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                document.getElementById('tutorAffiliationFeaturingId').value = data.tutorLink.id
                $('#tutorId').empty().append('<option value="' + data.tutorLink.tutorId + '">' + data.tutorLink.tutorFullName + '</option>').val(data.tutorLink.tutorId).trigger('change')
                document.getElementById('tutorAffiliationId').value = data.tutorLink.tutorAffiliationId
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
function removeTutorLink(id) {
    tutorForm.reset();
    $.ajax({
        method: "GET",
        url: `/school/GetTutorLinkById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir continuer ?",
                    text: "Supprimer le lien " + data.tutorLink.linkwording + " ?",
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Retirer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/RemovetutorStudentLink/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                tutorForm.reset();
                                tutorsDataList.innerHTML = ""
                                $('#tutorsTable').DataTable().clear().destroy()
                                data.studentTutors.forEach(element => {
                                    tutorsDataList.innerHTML += `
                                        <tr>
                                        <td>${element.fullname}</td>
                                        <td>${element.gender}</td>
                                        <td>${element.affiliation}</td>
                                        <td>${element.phoneNumber}</td>
                                        <td>
                                            <div class="button-list">
                                                <a href="/school/TutorDetails/${element.tutorId}/" class="btn waves-effect waves-light btn-info btn-sm" data-toggle="tooltip" title="Consulter"><i class="icon-eye"></i></a>
                                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getTutorLink('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="removeTutorLink('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
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


//*************** ************************ */
//*************** ************************ */
// End Tutor section
//*************** ************************ */
//*************** ************************ */