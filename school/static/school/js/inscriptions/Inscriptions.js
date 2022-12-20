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
            if (data.status == true) {
                classeId.innerHTML = `<option value ="" >Sélectionner...</option>`
                data.classes.forEach(element => {
                    classeId.innerHTML += `<option value ="${ element.id }" >${ element.wording }</option>`
                })
            }
        }
    })
})

//************ Inscription ***************/
//************ Inscription ***************/
//************ Inscription ***************/

// Get susgraduationlevel schoolfee details

document.getElementById('susGraduationLevelId').addEventListener('change', () => {

            susgraduationlevelid = $('#susGraduationLevelId').val()
            SchoolFeeDetailsProfileId = $('#SchoolFeeDetailsProfileId').val()
            mydata = new FormData()
            mydata.append('susgraduationlevelid', susgraduationlevelid)
            mydata.append('SchoolFeeDetailsProfileId', SchoolFeeDetailsProfileId)
            mydata.append('csrfmiddlewaretoken', csrftoken)
            $.ajax({
                        method: 'POST',
                        url: `/school/GetSchoolFeeDetailsBySusgraduationId/`,
                        processData: false,
                        contentType: false,
                        data: mydata,
                        success: function(data) {
                                if (data.status == true) {
                                    SusGraduationSchoolFeesDetailsDataList.innerHTML = ""
                                    $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
                                    data.schoolFeeDetails.forEach(element => {
                                                SusGraduationSchoolFeesDetailsDataList.innerHTML += `
                        <tr>
                            <td class="d-none" id="SchoolFeeId">${element.id}</td>
                            <td>${element.SusGraduationLevel}</td>
                            <td>${element.SchoolFeeProfile}</td>
                            <td>${element.SchoolFee}</td>
                            <td>${element.amount}</td>
                            <td>${element.important?`Oui`:`Non`}</td>
                            <td>${element.important?`<input type="checkbox" disabled="disabled" checked="checked" id="${element.id}">`:`<input type="checkbox" checked="checked" id="${element.id}">`}</td>
                        </tr>
                        `
                    });
                $('#SusGraduationSchoolFeesDetailsTable').DataTable()
                toastr.success(data.message, "Information", {
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
                SusGraduationSchoolFeesDetailsDataList.innerHTML = ""
                $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
                $('#SusGraduationSchoolFeesDetailsTable').DataTable()
                toastr.info(data.message, "Information", {
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
document.getElementById('SchoolFeeDetailsProfileId').addEventListener('change', () => {

            susgraduationlevelid = $('#susGraduationLevelId').val()
            SchoolFeeDetailsProfileId = $('#SchoolFeeDetailsProfileId').val()
            mydata = new FormData()
            mydata.append('susgraduationlevelid', susgraduationlevelid)
            mydata.append('SchoolFeeDetailsProfileId', SchoolFeeDetailsProfileId)
            mydata.append('csrfmiddlewaretoken', csrftoken)
            $.ajax({
                        method: 'POST',
                        url: `/school/GetSchoolFeeDetailsBySusgraduationId/`,
                        processData: false,
                        contentType: false,
                        data: mydata,
                        success: function(data) {
                                if (data.status == true) {
                                    SusGraduationSchoolFeesDetailsDataList.innerHTML = ""
                                    $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
                                    data.schoolFeeDetails.forEach(element => {
                                                SusGraduationSchoolFeesDetailsDataList.innerHTML += `
                        <tr>
                            <td class="d-none" id="SchoolFeeId">${element.id}</td>
                            <td>${element.SusGraduationLevel}</td>
                            <td>${element.SchoolFeeProfile}</td>
                            <td>${element.SchoolFee}</td>
                            <td>${element.amount}</td>
                            <td>${element.important?`Oui`:`Non`}</td>
                            <td>${element.important?`<input type="checkbox" disabled="disabled" checked="checked" id="${element.id}">`:`<input type="checkbox" checked="checked" id="${element.id}">`}</td>
                        </tr>
                        `
                    });
                $('#SusGraduationSchoolFeesDetailsTable').DataTable()
                toastr.success(data.message, "Information", {
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
                SusGraduationSchoolFeesDetailsDataList.innerHTML = ""
                $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
                $('#SusGraduationSchoolFeesDetailsTable').DataTable()
                toastr.info(data.message, "Information", {
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

//Reset du formulaire d inscription
inscriptionForm.addEventListener('reset', ()=>{
    document.getElementById('SusGraduationSchoolFeesDetailsDataList').innerHTML = ""
    $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
    $('#SusGraduationSchoolFeesDetailsTable').DataTable()
})


// Enregistrement d une nouvelle inscription
inscriptionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#inscriptionForm').parsley().isValid()) {

        let inscriptionId = document.getElementById('inscriptionId').value
        let studentId = document.getElementById('studentId').value
        let susGraduationLevelId = document.getElementById('susGraduationLevelId').value
        let classeId = document.getElementById('classeId').value
        let inscriptionDate = document.getElementById('inscriptionDate').value

        mydata = new FormData()
        mydata.append('inscriptionId', inscriptionId)
        mydata.append('studentId', studentId)
        mydata.append('susGraduationLevelId', susGraduationLevelId)
        mydata.append('SchoolFeeDetailsProfileId', SchoolFeeDetailsProfileId)
        mydata.append('classeId', classeId)
        mydata.append('inscriptionDate', inscriptionDate)

        //Frais de scolarite
        
        rowIds = []
        $('#SusGraduationSchoolFeesDetailsTable tr td [type="checkbox"]').each(function(i, chk) {
            if (chk.checked) {
            //     rowIds.push($(this).attr('id'))
            //     console.log(rowIds)
                mydata.append("SchoolFeeIds", $(this).attr('id'));
            }
        });
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

                        document.getElementById('inscriptionBtn').innerHTML = "Enregistrement..."
                        document.getElementById('inscriptionBtn').disabled = true
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
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="GetInscriptionDetailsById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
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
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="GetInscriptionDetailsById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
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

//************ End Inscription ***************/
//************ End Inscription ***************/
//************ End Inscription ***************/


//************ Inscription Informations *************/
//************ Inscription Informations *************/
//************ Inscription Informations *************/

// get inscription details
function GetInscriptionDetailsById(id){
$.ajax({
        method: 'GET',
        url: `/school/GetInscriptionDetailsById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                document.getElementById('inscriptionInformationDate').value = data.inscription.inscriptionDate
                document.getElementById('inscriptionDetailsStudent').value = data.inscription.student
                document.getElementById('inscriptionDetailsProfil').value = data.inscription.profile
                document.getElementById('inscriptionDetailsGraduation').value = data.inscription.susgraduationlevel
                document.getElementById('inscriptionDetailsClasse').value = data.inscription.classe

                document.getElementById('inscriptionSchoolFeesDetailsDataList').innerHTML = ""
                $('#inscriptionSchoolFeesDetailsTable').DataTable().clear().destroy()
                data.schoolFees.forEach(element => {
                    document.getElementById('inscriptionSchoolFeesDetailsDataList').innerHTML += `
                        <tr>
                            <td>${element.schoolFee}</td>
                            <td>${element.amount}</td>
                        </tr>
                        `
                    });
                $('#inscriptionSchoolFeesDetailsTable').DataTable()

                $('#inscriptionInformationModal').modal('show')
            }
        }
    })
}

//************ End Inscription Informations *************/
//************ End Inscription Informations *************/
//************ End Inscription Informations *************/


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
                                            <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="GetInscriptionDetailsById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
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

// End filtring session****************
// End filtring session****************
// End filtring session****************