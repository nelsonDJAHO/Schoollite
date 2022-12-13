const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const jobForm = document.getElementById('jobForm')
const jobsDataList = document.getElementById('jobsDataList')

jobForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#jobForm').parsley().isValid()) {
        document.getElementById('jobBtn').innerHTML = "Enregistrement..."
        document.getElementById('jobBtn').disabled = true

        let jobId = document.getElementById('jobId').value
        let reference = document.getElementById('reference').value
        let wording = document.getElementById('wording').value

        mydata = new FormData()
        mydata.append('jobId', jobId)
        mydata.append('reference', reference)
        mydata.append('wording', wording)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/UserGroups/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    jobForm.reset();
                    jobsDataList.innerHTML = ""
                    $('#jobsTable').DataTable().clear().destroy()
                    data.usersGroups.forEach(element => {
                        jobsDataList.innerHTML += `
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
                    $('#jobsTable').DataTable()


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
                    document.getElementById('jobBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('jobBtn').disabled = false
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
                    document.getElementById('jobBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('jobBtn').disabled = false
                }
            }
        })

    }

})


// Get element
function getObjectById(id) {
    $.ajax({
        method: 'GET',
        url: `/GetUserGroupById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                jobForm.reset();
                document.getElementById('jobId').value = data.userGroup.id
                document.getElementById('reference').value = data.userGroup.reference
                document.getElementById('wording').value = data.userGroup.wording
                $('#jobModal').modal('show')
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
    jobForm.reset();
    $.ajax({
        method: "GET",
        url: `/GetUserGroupById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer le niveau " + data.userGroup.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/DeleteUserGroup/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                $('#jobsTable').DataTable().clear().destroy()
                                data.usersGroups.forEach(element => {
                                    jobsDataList.innerHTML += `
                                    <tr>
                                        <td>${element.reference}</td>
                                        <td>${element.wording}</td>
                                        <td>${element.createdAt}</td>
                                        <td>${element.updatedAt}</td>
                                        <td>
                                            <div class="button-list">
                                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${element.id}')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id}')" data-toggle="tooltip" title="Supprimer"><i class="mdi icon-trash"></i> </button>
                                            </div>
                                        </td>
                                    </tr>
                                    `
                                });
                                $('#jobsTable').DataTable()
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