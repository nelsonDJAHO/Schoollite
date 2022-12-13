const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

// Graduation form
const graduationLevelData = document.getElementById('graduationLevelData')
const graduationForm = document.getElementById('graduationForm')

graduationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#graduationForm').parsley().isValid()) {
        document.getElementById('graduationBtn').innerHTML = "Enregistrement..."
        document.getElementById('graduationBtn').disabled = true

        let graduationLevelId = document.getElementById('graduationLevelId').value
        let graduationWording = document.getElementById('graduationWording').value

        mydata = new FormData()
        mydata.append('graduationLevelId', graduationLevelId)
        mydata.append('graduationWording', graduationWording)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/GraduationLevels/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    graduationForm.reset();
                    graduationLevelData.innerHTML = ""
                    document.getElementById('susGraduationLevelGraduationId').innerHTML = `<option value ="">Sélectionner...</option> `
                    $('#graduationLevelsTable').DataTable().clear().destroy()
                    data.graduationLevelsList.forEach(element => {
                        //mise a jour des degres
                        document.getElementById('susGraduationLevelGraduationId').innerHTML += `
                            <option value="${ element.id }">${ element.wording }</option>
                            `
                            //mise a jour des niveaux
                        graduationLevelData.innerHTML += `
                    <tr>
                        <td>${element.reference}</td>
                        <td>${element.wording}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.updatedAt}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                            </div>
                        </td>
                    </tr>
                    `
                    });
                    $('#graduationLevelsTable').DataTable()


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
                    document.getElementById('graduationBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('graduationBtn').disabled = false
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
                    document.getElementById('graduationBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('graduationBtn').disabled = false
                }
            }
        })

    }
})


// Get element
function getObjectById(id) {
    $.ajax({
        method: 'GET',
        url: `/school/GetGraduationLevelById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                console.log(data)
                graduationForm.reset();
                document.getElementById('graduationLevelId').value = data.graduationLevel.id
                document.getElementById('graduationWording').value = data.graduationLevel.wording
                $('#graduationModal').modal('show')
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
    $.ajax({
        method: "GET",
        url: `/school/GetGraduationLevelById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer le niveau " + data.graduationLevel.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteGraduationLevel/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                graduationForm.reset();
                                graduationLevelData.innerHTML = ""
                                $('#graduationLevelsTable').DataTable().clear().destroy()
                                data.graduationLevelsList.forEach(element => {
                                    graduationLevelData.innerHTML += `
                                        <tr>
                                            <td>${element.reference}</td>
                                            <td>${element.wording}</td>
                                            <td>${element.createdAt}</td>
                                            <td>${element.updatedAt}</td>
                                            <td>
                                                <div class="button-list">
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `
                                });
                                $('#graduationLevelsTable').DataTable()
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


// Sus graduiation level
const susGraduationLevelData = document.getElementById('susGraduationLevelData')
const susGraduationForm = document.getElementById('susGraduationForm')

susGraduationForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if ($('#susGraduationForm').parsley().isValid()) {

        document.getElementById('susgraduationBtn').innerHTML = "Enregistrement..."
        document.getElementById('susgraduationBtn').disabled = true

        let susGraduationLevelId = document.getElementById('susGraduationLevelId').value
        let susGraduationSigle = document.getElementById('susGraduationSigle').value
        let susGraduationWording = document.getElementById('susGraduationWording').value
        let susGraduationLevelGraduationId = document.getElementById('susGraduationLevelGraduationId').value

        mydata = new FormData();
        mydata.append('susGraduationLevelId', susGraduationLevelId)
        mydata.append('susGraduationSigle', susGraduationSigle)
        mydata.append('susGraduationWording', susGraduationWording)
        mydata.append('susGraduationLevelGraduationId', susGraduationLevelGraduationId)
        mydata.append('csrfmiddlewaretoken', csrftoken)


        $.ajax({
            method: 'POST',
            url: '/school/SusGraduationLevels/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    susGraduationForm.reset();
                    susGraduationLevelData.innerHTML = ""
                    $('#susGraduationLevelsTable').DataTable().clear().destroy()
                    data.SusGraduationLevels.forEach(element => {
                        susGraduationLevelData.innerHTML += `
                    <tr>
                        <td>${element.sigle}</td>
                        <td>${element.wording}</td>
                        <td>${element.graduationLevel}</td>
                        <td>${element.createdAt}</td>
                        <td>
                            <div class="button-list">
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getSusGraduationLevel('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteSusGraduationLevel('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                            </div>
                        </td>
                    </tr>
                `
                    });
                    $('#susGraduationLevelsTable').DataTable()
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
                    document.getElementById('susgraduationBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('susgraduationBtn').disabled = false
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
                    document.getElementById('susgraduationBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('susgraduationBtn').disabled = false
                }
            }
        })

    }
})

//get suGraduation
function getSusGraduationLevel(id) {
    $.ajax({
        method: 'GET',
        url: `/school/GetSusGraduationLevelById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                susGraduationForm.reset();
                document.getElementById('susGraduationLevelId').value = data.susGraduationLevel.id
                document.getElementById('susGraduationSigle').value = data.susGraduationLevel.sigle
                document.getElementById('susGraduationWording').value = data.susGraduationLevel.wording
                document.getElementById('susGraduationLevelGraduationId').value = data.susGraduationLevel.graduationLevelId
                $('#susGraduationModal').modal('show')
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


// Detele sus
function deleteSusGraduationLevel(id) {
    $.ajax({
        method: "GET",
        url: `/school/GetSusGraduationLevelById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer le niveau " + data.susGraduationLevel.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteSusGraduationLevel/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                susGraduationForm.reset();
                                susGraduationLevelData.innerHTML = ""
                                $('#susGraduationLevelsTable').DataTable().clear().destroy()
                                data.SusGraduationLevels.forEach(element => {
                                    susGraduationLevelData.innerHTML += `
                                    <tr>
                                        <td>${element.sigle}</td>
                                        <td>${element.wording}</td>
                                        <td>${element.graduationLevel}</td>
                                        <td>${element.createdAt}</td>
                                        <td>
                                            <div class="button-list">
                                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getSusGraduationLevel('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteSusGraduationLevel('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                            </div>
                                        </td>
                                    </tr>
                                    `
                                });
                                $('#susGraduationLevelsTable').DataTable()
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