const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
const academicYearsDataList = document.getElementById('academicYearsDataList')
const academicYearForm = document.getElementById('academicYearForm')

academicYearForm.addEventListener('submit', (e) => {
            e.preventDefault()

            if ($('#academicYearForm').parsley().isValid()) {
                document.getElementById('academicYearBtn').innerHTML = "Enregistrement..."
                document.getElementById('academicYearBtn').disabled = true

                let academicYearlId = document.getElementById('academicYearlId').value
                let wording = document.getElementById('wording').value
                let startDate = document.getElementById('startDate').value
                let endDate = document.getElementById('endDate').value

                mydata = new FormData()
                mydata.append('academicYearlId', academicYearlId)
                mydata.append('wording', wording)
                mydata.append('startDate', startDate)
                mydata.append('endDate', endDate)
                mydata.append('csrfmiddlewaretoken', csrftoken)

                $.ajax({
                            method: 'POST',
                            url: '/AcademicYears/',
                            processData: false,
                            contentType: false,
                            data: mydata,
                            success: function(data) {
                                    if (data.status == true) {
                                        academicYearForm.reset();
                                        academicYearsDataList.innerHTML = ""
                                        $('#academicYearsTable').DataTable().clear().destroy()
                                        data.academicYears.forEach(element => {
                                                    academicYearsDataList.innerHTML += `
                    <tr>
                        <td>${element.reference}</td>
                        <td>${element.wording}</td>
                        <td>${element.startDate}</td>
                        <td>${element.endDate}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="ActivDeactivAcademicYear('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="ActivDeactivAcademicYear('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                            </div>
                        </td>
                    </tr>
                `
                    });
                    $('#academicYearsTable').DataTable()


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
                    document.getElementById('academicYearBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('academicYearBtn').disabled = false
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
                    document.getElementById('academicYearBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('academicYearBtn').disabled = false
                }
            }
        })

    }
})


// Get element
function getObjectById(id) {
    $.ajax({
        method: 'GET',
        url: `/GetAcademicYearById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                academicYearForm.reset();
                document.getElementById('academicYearlId').value = data.academicYear.id
                document.getElementById('wording').value = data.academicYear.wording
                document.getElementById('startDate').value = data.academicYear.startDate
                document.getElementById('endDate').value = data.academicYear.endDate
                $('#academicYearModal').modal('show')
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
academicYearForm.reset();
    $.ajax({
        method: "GET",
        url: `/GetAcademicYearById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer l'année scolaire " + data.academicYear.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/DeleteAcademicYear/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                academicYearForm.reset();
                                        academicYearsDataList.innerHTML = ""
                                        $('#academicYearsTable').DataTable().clear().destroy()
                                        data.academicYears.forEach(element => {
                                                    academicYearsDataList.innerHTML += `
                                        <tr>
                                            <td>${element.reference}</td>
                                            <td>${element.wording}</td>
                                            <td>${element.startDate}</td>
                                            <td>${element.endDate}</td>
                                            <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Active</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactive</span>`}</td>
                                            <td>
                                                <div class="button-list">
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                                </div>
                                            </td>
                                        </tr>
                                    `
                                        });
                                $('#academicYearsTable').DataTable()
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


// Activate or deactivate academic year
function ActivDeactivAcademicYear(id, action){
academicYearForm.reset();
    $.ajax({
        method: "GET",
        url: `/GetAcademicYearById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir poursuivre ?",
                    text: action+" l'année scolaire " + data.academicYear.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, "+action+" !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/ActivDeactivAcademicYear/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                        academicYearsDataList.innerHTML = ""
                                        $('#academicYearsTable').DataTable().clear().destroy()
                                        data.academicYears.forEach(element => {
                                                    academicYearsDataList.innerHTML += `
                                        <tr>
                                            <td>${element.reference}</td>
                                            <td>${element.wording}</td>
                                            <td>${element.startDate}</td>
                                            <td>${element.endDate}</td>
                                            <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Actif</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactif</span>`}</td>
                                            <td>
                                                <div class="button-list">
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                                    ${element.isActive?`<button class="btn waves-effect waves-light btn-danger btn-sm" onclick="ActivDeactivAcademicYear('${ element.id }', 'Désactiver')" data-toggle="tooltip" title="Désactiver"><i class="mdi mdi-lock "></i> </button>`:`<button class="btn waves-effect waves-light btn-success btn-sm text-white" onclick="ActivDeactivAcademicYear('${ element.id }', 'Activer')" data-toggle="tooltip" title="Activer"><i class="mdi mdi-check "></i> </button>`}
                                                </div>
                                            </td>
                                        </tr>
                                    `
                                        });
                                $('#academicYearsTable').DataTable()
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