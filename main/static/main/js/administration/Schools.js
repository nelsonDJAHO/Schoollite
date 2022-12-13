const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
const schoolsDataList = document.getElementById('schoolsDataList')
const schoolForm = document.getElementById('schoolForm')

schoolForm.addEventListener('submit', (e) => {
            e.preventDefault()

            if ($('#schoolForm').parsley().isValid()) {
                document.getElementById('schoolBtn').innerHTML = "Enregistrement..."
                document.getElementById('schoolBtn').disabled = true

                let schoolId = document.getElementById('schoolId').value
                let schoolSigle = document.getElementById('schoolSigle').value
                let schooName = document.getElementById('schooName').value
                let schoolPhoneNumber = document.getElementById('schoolPhoneNumber').value
                let schoolEmail = document.getElementById('schoolEmail').value
                let livingCountry = document.getElementById('livingCountry').value
                let livingTown = document.getElementById('livingTown').value
                let address = document.getElementById('address').value

                mydata = new FormData()
                mydata.append('schoolId', schoolId)
                mydata.append('schoolSigle', schoolSigle)
                mydata.append('schooName', schooName)
                mydata.append('schoolPhoneNumber', schoolPhoneNumber)
                mydata.append('schoolEmail', schoolEmail)
                mydata.append('livingCountry', livingCountry)
                mydata.append('livingTown', livingTown)
                mydata.append('address', address)
                mydata.append('csrfmiddlewaretoken', csrftoken)

                $.ajax({
                            method: 'POST',
                            url: '/Schools/',
                            processData: false,
                            contentType: false,
                            data: mydata,
                            success: function(data) {
                                    if (data.status == true) {
                                        schoolForm.reset();
                                        schoolsDataList.innerHTML = ""
                                        $('#schoolsTable').DataTable().clear().destroy()
                                        data.schools.forEach(element => {
                                                    schoolsDataList.innerHTML += `
                    <tr>
                        <td>${element.sigle}</td>
                        <td>${element.denomination}</td>
                        <td>${element.livingCountry}</td>
                        <td>${element.livingTown}</td>
                        <td>${element.address}</td>
                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Actif</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactif</span>`}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                            </div>
                        </td>
                    </tr>
                `
                    });
                    $('#schoolsTable').DataTable()


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
                    document.getElementById('schoolBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('schoolBtn').disabled = false
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
                    document.getElementById('schoolBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('schoolBtn').disabled = false
                }
            }
        })

    }

})


// Get element
function getObjectById(id) {
    $.ajax({
        method: 'GET',
        url: `/GetShoolByid/${id}/`,
        success: function(data) {
            if (data.status == true) {
                schoolForm.reset();
                document.getElementById('schoolId').value = data.school.id
                document.getElementById('schoolSigle').value = data.school.sigle
                document.getElementById('schooName').value = data.school.denomination
                document.getElementById('schoolPhoneNumber').value = data.school.phoneNumber
                document.getElementById('schoolEmail').value = data.school.email
                document.getElementById('livingCountry').value = data.school.livingCountry
                document.getElementById('livingTown').value = data.school.livingTown
                document.getElementById('address').value = data.school.address
                $('#schoolModal').modal('show')
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
schoolForm.reset();
    $.ajax({
        method: "GET",
        url: `/GetShoolByid/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer l'etablissement " + data.school.sigle,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/DeleteSchool/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                schoolsDataList.innerHTML = ""
                                $('#schoolsTable').DataTable().clear().destroy()
                                    data.schools.forEach(element => {
                                    schoolsDataList.innerHTML += `
                                    <tr>
                                        <td>${element.sigle}</td>
                                        <td>${element.denomination}</td>
                                        <td>${element.livingCountry}</td>
                                        <td>${element.livingTown}</td>
                                        <td>${element.address}</td>
                                        <td>${element.isActive?`<span class="badge badge-pill badge-success text-white" style="width:90%">Actif</span>`:`<span class="badge badge-pill badge-danger text-white" style="width:90%">Inactif</span>`}</td>
                                        <td>
                                            <div class="button-list">
                                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                            </div>
                                        </td>
                                    </tr>
                                `
                                    });
                                    $('#schoolsTable').DataTable()
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