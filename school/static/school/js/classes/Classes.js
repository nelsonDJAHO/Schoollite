const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
const classesDataList = document.getElementById('classesDataList')
const classeForm = document.getElementById('classeForm')

classeForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if ($('#classeForm').parsley().isValid()) {

        document.getElementById('classeBtn').innerHTML = "Enregistrement..."
        document.getElementById('classeBtn').disabled = true

        let classeId = document.getElementById('classeId').value
        let wording = document.getElementById('wording').value
        let susGraduationLevelId = document.getElementById('susGraduationLevelId').value
        let capacity = document.getElementById('capacity').value

        mydata = new FormData()

        mydata.append('classeId', classeId)
        mydata.append('wording', wording)
        mydata.append('susGraduationLevelId', susGraduationLevelId)
        mydata.append('capacity', capacity)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/Classes/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    classeForm.reset();
                    classesDataList.innerHTML = ""
                    $('#classesTable').DataTable().clear().destroy()
                    data.classes.forEach(element => {
                        classesDataList.innerHTML += `
                        <tr>
                            <td>${element.wording}</td>
                            <td>${element.GraduationLevel}</td>
                            <td>${element.SusGraduationLevel}</td>
                            <td>${element.capacity}</td>
                            <td>
                                <div class="button-list">
                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                </div>
                            </td>
                        </tr>
                        `
                    });
                    $('#classesTable').DataTable()


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
                    document.getElementById('classeBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('classeBtn').disabled = false
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
                    document.getElementById('classeBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('classeBtn').disabled = false
                }
            }
        })

    }


})



// Get element
function getObjectById(id) {
    $.ajax({
        method: 'GET',
        url: `/school/GetClasseById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                classeForm.reset();
                document.getElementById('classeId').value = data.classe.id
                document.getElementById('wording').value = data.classe.wording
                document.getElementById('susGraduationLevelId').value = data.classe.SusGraduationLevelId
                document.getElementById('capacity').value = data.classe.capacity
                $('#classeModal').modal('show')
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
        url: `/school/GetClasseById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer la classe " + data.classe.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteClasse/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                classeForm.reset();
                                classesDataList.innerHTML = ""
                                $('#classesTable').DataTable().clear().destroy()
                                data.classes.forEach(element => {
                                    classesDataList.innerHTML += `
                                    <tr>
        
                                        <td>${element.wording}</td>
                                        <td>${element.GraduationLevel}</td>
                                        <td>${element.SusGraduationLevel}</td>
                                        <td>${element.capacity}</td>
                                        <td>
                                            <div class="button-list">
                                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                            </div>
                                        </td>
                                    </tr>
                                     `
                                });
                                $('#classesTable').DataTable()
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