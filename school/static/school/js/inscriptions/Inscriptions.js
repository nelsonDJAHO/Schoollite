$(document).ready(function() {
    $('#studentId').select2({
        width: '100%',
        ajax: {
            url: '/school/InscriptionStudentsFilter/',
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
const inscriptionForm = document.getElementById('inscriptionForm')
const inscriptionsDataList = document.getElementById('inscriptionsDataList')

inscriptionForm.addEventListener('reset', () => {
    $('#studentId').empty()
    document.getElementById('classeId').innerHTML = `<option value ="" >Sélectionner...</option>`
    $('#studentId').select2({
        width: '100%',
        ajax: {
            url: '/school/InscriptionStudentsFilter/',
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

// filtre des salles de classe en fonction du degre d etude
document.getElementById('susGraduationLevelId').addEventListener('change', () => {
    susGraduationLevelId = document.getElementById('susGraduationLevelId').value
    const classeId = document.getElementById('classeId')
    $.ajax({
        method: 'GET',
        url: `/school/FilterClassesBySusgraduation/${susGraduationLevelId}/`,
        success: function(data) {
            console.log(data)
            if (data.status == true) {
                classeId.innerHTML = `<option value ="" >Sélectionner...</option>`
                data.classes.forEach(element => {
                    classeId.innerHTML += `<option value ="${ element.id }" >${ element.wording }</option>`
                })
            }
        }
    })
})

inscriptionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#inscriptionForm').parsley().isValid()) {
        document.getElementById('inscriptionBtn').innerHTML = "Enregistrement..."
        document.getElementById('inscriptionBtn').disabled = true

        let inscriptionId = document.getElementById('inscriptionId').value
        let studentId = document.getElementById('studentId').value
        let susGraduationLevelId = document.getElementById('susGraduationLevelId').value
        let classeId = document.getElementById('classeId').value
        let inscriptionDate = document.getElementById('inscriptionDate').value

        mydata = new FormData()
        mydata.append('inscriptionId', inscriptionId)
        mydata.append('studentId', studentId)
        mydata.append('susGraduationLevelId', susGraduationLevelId)
        mydata.append('classeId', classeId)
        mydata.append('inscriptionDate', inscriptionDate)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: "GET",
            url: '/CheckActiveAcademicYear/',
            success: function(data) {
                if (data.status == true) {
                    swal({
                        title: "Etes-vous sûr de vouloir continuer ?",
                        text: "Enregistrer cette inscription pour l'année académique " + data.academicYear.wording,
                        type: "warning",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Oui, Enregistrer !!",
                        cancelButtonText: "Non, Annuler !!",
                        showCancelButton: !0,
                        closeOnConfirm: !1,
                    }, function() {
                        $.ajax({
                            method: 'POST',
                            url: '/school/Inscriptions/',
                            processData: false,
                            contentType: false,
                            data: mydata,
                            success: function(data) {
                                if (data.status == true) {
                                    inscriptionForm.reset()
                                    inscriptionsDataList.innerHTML = ""
                                    $('#inscriptionsTable').DataTable().clear().destroy()
                                    data.inscriptions.forEach(element => {
                                        inscriptionsDataList.innerHTML += `
                                            <tr>
                                        <td>${element.student}</td>
                                        <td>${element.graduationLevel}</td>
                                        <td>${element.susGraduationLevel}</td>
                                        <td>${element.classe}</td>
                                        <td>${element.inscriptionDate}</td>
                                        <td>${element.academicYear}</td>
                                        <td>
                                            <div class="button-list">
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                            </div>
                                        </td>
                                    </tr>
                                        `
                                    });
                                    $('#inscriptionsTable').DataTable()
                                    swal("Succès !!", data.message, "success")

                                    document.getElementById('inscriptionBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                                    document.getElementById('inscriptionBtn').disabled = false
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
                                    document.getElementById('inscriptionBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                                    document.getElementById('inscriptionBtn').disabled = false
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

})


//Delete object
function deleteObject(id) {
    inscriptionForm.reset();
    $.ajax({
        method: "GET",
        url: `/school/GetInscriptionById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer l'inscription de l'apprenant " + data.inscription.student + " du degré " + data.inscription.susGraduationLevel + " de l'année académique " + data.inscription.academicYear + " ?",
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteInscription/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                inscriptionsDataList.innerHTML = ""
                                $('#inscriptionsTable').DataTable().clear().destroy()
                                data.inscriptions.forEach(element => {
                                    inscriptionsDataList.innerHTML += `
                                            <tr>
                                        <td>${element.student}</td>
                                        <td>${element.graduationLevel}</td>
                                        <td>${element.susGraduationLevel}</td>
                                        <td>${element.classe}</td>
                                        <td>${element.inscriptionDate}</td>
                                        <td>${element.academicYear}</td>
                                        <td>
                                            <div class="button-list">
                                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                            </div>
                                        </td>
                                    </tr>
                                        `
                                });
                                $('#inscriptionsTable').DataTable()
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


// filtring session****************
// filtring session****************
// filtring session****************
// filtring session****************
// filtring session****************
// filtring session****************

// filtre des salles de classe en fonction du degre d etude
document.getElementById('searchSusGraduationLevelId').addEventListener('change', () => {
    searchSusGraduationLevelId = document.getElementById('searchSusGraduationLevelId').value
    const classeId = document.getElementById('searchClasseId')
    $.ajax({
        method: 'GET',
        url: `/school/FilterClassesBySusgraduation/${searchSusGraduationLevelId}/`,
        success: function(data) {
            if (data.status == true) {
                classeId.innerHTML = `<option value ="" >Sélectionner...</option>`
                data.classes.forEach(element => {
                    classeId.innerHTML += `<option value ="${ element.id }" >${ element.wording }</option>`
                })
            }
        }
    })
})

const searchForm = document.getElementById('searchForm')

searchForm.addEventListener('reset', () => {
    document.getElementById('searchClasseId').innerHTML = `<option value ="" >Sélectionner...</option>`
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if ($('#searchForm').parsley().isValid()) {
        let classeId = document.getElementById('searchClasseId').value
        let inscriptionStartDate = document.getElementById('inscriptionStartDate').value
        let inscriptionEndDate = document.getElementById('inscriptionEndDate').value

        mydata = new FormData();
        mydata.append('classeId', classeId)
        mydata.append('inscriptionStartDate', inscriptionStartDate)
        mydata.append('inscriptionEndDate', inscriptionEndDate)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/FilterInscription/',
            data: mydata,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.status == true) {
                    inscriptionsDataList.innerHTML = ""
                    $('#inscriptionsTable').DataTable().clear().destroy()
                    data.inscriptions.forEach(element => {
                        inscriptionsDataList.innerHTML += `
                            <tr>
                                <td>${element.student}</td>
                                <td>${element.graduationLevel}</td>
                                <td>${element.susGraduationLevel}</td>
                                <td>${element.classe}</td>
                                <td>${element.inscriptionDate}</td>
                                <td>${element.academicYear}</td>
                                <td>
                                    <div class="button-list">
                                            <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                    </div>
                                </td>
                            </tr>
                                        `
                    });
                    $('#inscriptionsTable').DataTable()
                }
            }
        })

    }
})