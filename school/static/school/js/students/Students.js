const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const studentForm = document.getElementById('studentForm')
const studentDataList = document.getElementById('studentDataList')

$(document).ready(function() {

})

studentForm.addEventListener('reset', () => {
    reloadDropify('/media/avatar.png')
})

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#studentForm').parsley().isValid()) {
        document.getElementById('studentBtn').innerHTML = "Enregistrement..."
        document.getElementById('studentBtn').disabled = true

        let studentId = document.getElementById('studentId').value
        let matricule = document.getElementById('matricule').value
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

        mydata = new FormData()
        mydata.append('studentId', studentId)
        mydata.append('matricule', matricule)
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
        mydata.append('avatar', document.getElementById('avatar').files[0])
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/Students/',
            processData: false,
            contentType: false,
            data: mydata,
            mimeType: "multipart/form-data",
            success: function(data) {
                rdata = JSON.parse(data)
                if (rdata.status == true) {
                    studentForm.reset();
                    studentDataList.innerHTML = ""
                    $('#studentsTable').DataTable().clear().destroy()
                    rdata.students.forEach(element => {
                        studentDataList.innerHTML += `
                             <tr>
                        <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                        <td>${element.matricule}</td>
                        <td>${element.fullName}</td>
                        <td>${element.gender}</td>
                        <td>${element.address}</td>
                        <td>${element.phoneNumber}</td>
                        <td>
                            <div class="button-list">
                                <a href="/school/StudentDetails/${element.id}/" class="btn waves-effect waves-light btn-info btn-sm" data-toggle="tooltip" title="Consulter"><i class="icon-eye"></i></a>
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#studentsTable').DataTable()

                    document.getElementById('studentBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('studentBtn').disabled = false
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
                    document.getElementById('studentBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('studentBtn').disabled = false
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
                studentForm.reset();
                document.getElementById('studentId').value = data.user.id
                document.getElementById('matricule').value = data.user.matricule
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
                reloadDropify(data.user.avatar)

                $('#studentModal').modal('show')
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
    studentForm.reset();
    $.ajax({
        method: "GET",
        url: `/getUserById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer l'apprenant " + data.user.fullName,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteStudent/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                studentDataList.innerHTML = ""
                                $('#studentsTable').DataTable().clear().destroy()
                                data.students.forEach(element => {
                                    studentDataList.innerHTML += `
                                        <tr>
                                    <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                                    <td>${element.matricule}</td>
                                    <td>${element.fullName}</td>
                                    <td>${element.gender}</td>
                                    <td>${element.address}</td>
                                    <td>${element.phoneNumber}</td>
                                    <td>
                                        <div class="button-list">
                                            <a href="/school/StudentDetails/${element.id}/" class="btn waves-effect waves-light btn-info btn-sm" data-toggle="tooltip" title="Consulter"><i class="icon-eye"></i></a>
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                        </div>
                                    </td>
                                </tr>
                        `
                                });
                                $('#studentsTable').DataTable()
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


// Rechercher un apprennant
const searchStudentForm = document.getElementById("searchStudentForm")

searchStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchTerm = document.getElementById("searchTerm").value
    searchstudents(searchTerm)
})

searchStudentForm.addEventListener('reset', (e) => {
    searchTerm = ""
    searchstudents(searchTerm)
})

function searchstudents(searchTerm) {
    if ($('#searchStudentForm').parsley().isValid()) {
        document.getElementById('searchStudentBtn').innerHTML = "Recherche..."
        document.getElementById('searchStudentBtn').disabled = true

        $.ajax({
            method: 'GET',
            url: `/school/StudentFilterWithSafe?term=${searchTerm}`,
            success: function(data) {
                if (data.status == true) {
                    studentDataList.innerHTML = ""
                    $('#studentsTable').DataTable().clear().destroy()
                    data.students.forEach(element => {
                        studentDataList.innerHTML += `
                             <tr>
                        <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                        <td>${element.matricule}</td>
                        <td>${element.fullName}</td>
                        <td>${element.gender}</td>
                        <td>${element.address}</td>
                        <td>${element.phoneNumber}</td>
                        <td>
                            <div class="button-list">
                                <a href="/school/StudentDetails/${element.id}/" class="btn waves-effect waves-light btn-info btn-sm" data-toggle="tooltip" title="Consulter"><i class="icon-eye"></i></a>
                                <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getObjectById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                            </div>
                        </td>
                    </tr>
                        `
                    });
                    $('#studentsTable').DataTable()

                    document.getElementById('searchStudentBtn').innerHTML = '<i class="mdi mdi-account-search"></i>  Rechercher'
                    document.getElementById('searchStudentBtn').disabled = false
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
                    document.getElementById('searchStudentBtn').innerHTML = '<i class="mdi mdi-account-search"></i>  Rechercher'
                    document.getElementById('searchStudentBtn').disabled = false
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

}