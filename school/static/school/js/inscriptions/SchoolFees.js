// Global declarations
const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;


//**************Profiles session**************/
//**************Profiles session**************/
//**************Profiles session**************/

const SchoolFeeProfileForm = document.getElementById('SchoolFeeProfileForm')
const SchoolFeeProfilesDataList = document.getElementById('SchoolFeeProfilesDataList')

// form validation
SchoolFeeProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#SchoolFeeProfileForm').parsley().isValid()) {
        document.getElementById('SchoolFeeProfileBtn').innerHTML = "Enregistrement..."
        document.getElementById('SchoolFeeProfileBtn').disabled = true

        let SchoolFeeProfileId = document.getElementById('SchoolFeeProfileId').value
        let SchoolFeeProfileWording = document.getElementById('SchoolFeeProfileWording').value

        mydata = new FormData()
        mydata.append('SchoolFeeProfileId', SchoolFeeProfileId)
        mydata.append('SchoolFeeProfileWording', SchoolFeeProfileWording)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/SchoolFeesProfiles/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    SchoolFeeProfileForm.reset();
                    SchoolFeeProfilesDataList.innerHTML = ""
                    $('#SchoolFeeProfilesTable').DataTable().clear().destroy()
                    data.schoolFeesProfiles.forEach(element => {
                        SchoolFeeProfilesDataList.innerHTML += `
                             <tr>
                                <td>${element.reference}</td>
                                <td>${element.wording}</td>
                                <td>${element.createdAt}</td>
                                <td>${element.updatedAt}</td>
                                <td>
                                    <div class="button-list">
                                        <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getSchoolFeeProfileById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                        <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteSchoolFeeProfileById('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                    </div>
                                </td>
                            </tr>
                        `
                    });
                    $('#SchoolFeeProfilesTable').DataTable()

                    //Mettre a jour le combo de selection des profiles au niveau des details des frais
                    document.getElementById('SchoolFeeDetailsProfileId').innerHTML = "<option value ='' >Sélectionner...</option> "
                    data.schoolFeesProfiles.forEach(element => {
                        document.getElementById('SchoolFeeDetailsProfileId').innerHTML += `
                             <option value ="${element.id}" >${element.wording}</option> 
                        `
                    });

                    document.getElementById('SchoolFeeProfileBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('SchoolFeeProfileBtn').disabled = false
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
                    document.getElementById('SchoolFeeProfileBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('SchoolFeeProfileBtn').disabled = false
                }
            }
        })
    }

})


// Get school fee profile
function getSchoolFeeProfileById(id) {
    $.ajax({
        method: 'GET',
        url: `/school/GetSchoolFeeProfileById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                SchoolFeeProfileForm.reset();
                document.getElementById('SchoolFeeProfileId').value = data.profile.id
                document.getElementById('SchoolFeeProfileWording').value = data.profile.wording
                $('#schoolFeeProfileModal').modal('show')
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


//Delete schoolfee profile
function deleteSchoolFeeProfileById(id) {
    SchoolFeeProfileForm.reset();
    $.ajax({
        method: "GET",
        url: `/school/GetSchoolFeeProfileById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer le profil " + data.profile.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteSchoolFeeProfileById/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                SchoolFeeProfilesDataList.innerHTML = ""
                                $('#SchoolFeeProfilesTable').DataTable().clear().destroy()
                                data.schoolFeesProfiles.forEach(element => {
                                    SchoolFeeProfilesDataList.innerHTML += `
                                        <tr>
                                            <td>${element.reference}</td>
                                            <td>${element.wording}</td>
                                            <td>${element.createdAt}</td>
                                            <td>${element.updatedAt}</td>
                                            <td>
                                                <div class="button-list">
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getSchoolFeeProfileById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteSchoolFeeProfileById('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `
                                });
                                $('#SchoolFeeProfilesTable').DataTable()

                                //Mettre a jour le combo de selection des profiles au niveau des details des frais
                                document.getElementById('SchoolFeeDetailsProfileId').innerHTML = "<option value ='' >Sélectionner...</option> "
                                data.schoolFeesProfiles.forEach(element => {
                                    document.getElementById('SchoolFeeDetailsProfileId').innerHTML += `
                                        <option value ="${element.id}" >${element.wording}</option> 
                                    `
                                });

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

//**************End Profiles session**************/
//**************End Profiles session**************/
//**************End Profiles session**************/



//**************SchoolFees session**************/
//**************SchoolFees session**************/
//**************SchoolFees session**************/

const schoolFeeForm = document.getElementById('schoolFeeForm')
const schoolFeesDataList = document.getElementById('schoolFeesDataList')

// form validation
schoolFeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#schoolFeeForm').parsley().isValid()) {
        document.getElementById('SchoolFeeBtn').innerHTML = "Enregistrement..."
        document.getElementById('SchoolFeeBtn').disabled = true

        let SchoolFeeId = document.getElementById('SchoolFeeId').value
        let SchoolFeeWording = document.getElementById('SchoolFeeWording').value

        mydata = new FormData()
        mydata.append('SchoolFeeId', SchoolFeeId)
        mydata.append('SchoolFeeWording', SchoolFeeWording)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/SchoolFeeSaving/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    schoolFeeForm.reset();
                    schoolFeesDataList.innerHTML = ""
                    $('#schoolFeesTable').DataTable().clear().destroy()
                    data.schoolFees.forEach(element => {
                        schoolFeesDataList.innerHTML += `
                             <tr>
                                <td>${element.reference}</td>
                                <td>${element.wording}</td>
                                <td>${element.createdAt}</td>
                                <td>${element.updatedAt}</td>
                                <td>
                                    <div class="button-list">
                                        <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getSchoolFeeById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                        <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteSchoolFeeById('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                    </div>
                                </td>
                            </tr>
                        `
                    });
                    $('#schoolFeesTable').DataTable()

                    //Mettre a jour le combo de selection des frais au niveau des details des frais
                    document.getElementById('SchoolFeeDetailsFeeId').innerHTML = "<option value ='' >Sélectionner...</option> "
                    data.schoolFees.forEach(element => {
                        document.getElementById('SchoolFeeDetailsFeeId').innerHTML += `
                             <option value ="${element.id}" >${element.wording}</option> 
                        `
                    });

                    document.getElementById('SchoolFeeBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('SchoolFeeBtn').disabled = false
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
                    document.getElementById('SchoolFeeBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('SchoolFeeBtn').disabled = false
                }
            }
        })
    }

})


// Get school fee 
function getSchoolFeeById(id) {
    $.ajax({
        method: 'GET',
        url: `/school/GetSchoolFeeById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                SchoolFeeProfileForm.reset();
                document.getElementById('SchoolFeeId').value = data.schoolFee.id
                document.getElementById('SchoolFeeWording').value = data.schoolFee.wording
                $('#schoolFeeModal').modal('show')
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


//Delete schoolfee
function deleteSchoolFeeById(id) {
    schoolFeeForm.reset();
    $.ajax({
        method: "GET",
        url: `/school/GetSchoolFeeById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer le frais " + data.schoolFee.wording,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteSchoolFeeById/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                schoolFeesDataList.innerHTML = ""
                                $('#schoolFeesTable').DataTable().clear().destroy()
                                data.schoolFees.forEach(element => {
                                    schoolFeesDataList.innerHTML += `
                                        <tr>
                                            <td>${element.reference}</td>
                                            <td>${element.wording}</td>
                                            <td>${element.createdAt}</td>
                                            <td>${element.updatedAt}</td>
                                            <td>
                                                <div class="button-list">
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="getSchoolFeeById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteSchoolFeeById('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `
                                });
                                $('#schoolFeesTable').DataTable()

                                //Mettre a jour le combo de selection des frais au niveau des details des frais
                                document.getElementById('SchoolFeeDetailsFeeId').innerHTML = "<option value ='' >Sélectionner...</option> "
                                data.schoolFees.forEach(element => {
                                    document.getElementById('SchoolFeeDetailsFeeId').innerHTML += `
                                        <option value ="${element.id}" >${element.wording}</option> 
                                    `
                                });

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

//**************End SchoolFees session**************/
//**************End SchoolFees session**************/
//**************End SchoolFees session**************/


//**************SchoolDetailsFees session**************/
//**************SchoolDetailsFees session**************/
//**************SchoolDetailsFees session**************/

const schoolFeesDetailsDataList = document.getElementById('schoolFeesDetailsDataList')
const SusGraduationSchoolFeesDetailsDataList = document.getElementById('SusGraduationSchoolFeesDetailsDataList')

// Get susgraduationlevel schoolfee details

document.getElementById('SchoolFeeDetailsSusGraduationLevelId').addEventListener('change', () => {
            document.getElementById('SchoolFeeDetailsId').value = ""
            document.getElementById('SchoolFeeDetailsProfileId').value = ""
            document.getElementById('SchoolFeeDetailsFeeId').value = ""
            document.getElementById('SchoolFeeDetailsAmount').value = ""
            document.getElementById('SchoolFeeDetailsImportantId').value = ""

            susgraduationlevelid = $('#SchoolFeeDetailsSusGraduationLevelId').val()
            mydata = new FormData()
            mydata.append('susgraduationlevelid', susgraduationlevelid)
            mydata.append('csrfmiddlewaretoken', csrftoken)
            $.ajax({
                        method: 'POST',
                        url: `/school/GetSchoolFeeDetailsBySusgraduationId/`,
                        processData: false,
                        contentType: false,
                        data: mydata,
                        success: function(data) {
                                console.log(data)
                                if (data.status == true) {
                                    SusGraduationSchoolFeesDetailsDataList.innerHTML = ""
                                    $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
                                    data.schoolFeeDetails.forEach(element => {
                                                SusGraduationSchoolFeesDetailsDataList.innerHTML += `
                        <tr>
                            <td>${element.SusGraduationLevel}</td>
                            <td>${element.SchoolFeeProfile}</td>
                            <td>${element.SchoolFee}</td>
                            <td>${element.amount}</td>
                            <td>${element.important?`Oui`:`Non`}</td>
                            <td>
                                <div class="button-list">
                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="GetSchoolFeeDetailsById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                </div>
                            </td>
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

const schoolFeesDetailsForm = document.getElementById('schoolFeesDetailsForm')

schoolFeesDetailsForm.addEventListener('reset', ()=>{
    SusGraduationSchoolFeesDetailsDataList.innerHTML = ""
    $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
    $('#SusGraduationSchoolFeesDetailsTable').DataTable()
})

schoolFeesDetailsForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    if ($('#schoolFeesDetailsForm').parsley().isValid()) {
        document.getElementById('SchoolFeeDetailsBtn').innerHTML = "Enregistrement..."
        document.getElementById('SchoolFeeDetailsBtn').disabled = true
    
        let SchoolFeeDetailsId = document.getElementById('SchoolFeeDetailsId').value
        let SchoolFeeDetailsSusGraduationLevelId = document.getElementById('SchoolFeeDetailsSusGraduationLevelId').value
        let SchoolFeeDetailsProfileId = document.getElementById('SchoolFeeDetailsProfileId').value
        let SchoolFeeDetailsFeeId = document.getElementById('SchoolFeeDetailsFeeId').value
        let SchoolFeeDetailsAmount = document.getElementById('SchoolFeeDetailsAmount').value
        let SchoolFeeDetailsImportantId = document.getElementById('SchoolFeeDetailsImportantId').value

        mydata = new FormData()
        mydata.append('SchoolFeeDetailsId', SchoolFeeDetailsId)
        mydata.append('SusGraduationLevelId', SchoolFeeDetailsSusGraduationLevelId)
        mydata.append('ProfileId', SchoolFeeDetailsProfileId)
        mydata.append('FeeId', SchoolFeeDetailsFeeId)
        mydata.append('Amount', SchoolFeeDetailsAmount)
        mydata.append('Important', SchoolFeeDetailsImportantId)
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method:'POST',
            url: '/school/SchoolFeeDetails/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data){
                if (data.status == true) {
                    document.getElementById('SchoolFeeDetailsId').value = ""
                    // Les details des frais par niveau
                    SusGraduationSchoolFeesDetailsDataList.innerHTML = ""
                    $('#SusGraduationSchoolFeesDetailsTable').DataTable().clear().destroy()
                    data.SusGraduationSchoolFeeDetails.forEach(element => {
                        SusGraduationSchoolFeesDetailsDataList.innerHTML += `
                            <tr>
                                <td>${element.SusGraduationLevel}</td>
                                <td>${element.SchoolFeeProfile}</td>
                                <td>${element.SchoolFee}</td>
                                <td>${element.amount}</td>
                                <td>${element.important?`Oui`:`Non`}</td>
                                <td>
                                    <div class="button-list">
                                        <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="GetSchoolFeeDetailsById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                    </div>
                                </td>
                            </tr>
                            `
                        });
                    $('#SusGraduationSchoolFeesDetailsTable').DataTable()

                    // Tous les details des frais
                    schoolFeesDetailsDataList.innerHTML = ""
                    $('#schoolFeesDetailsTable').DataTable().clear().destroy()
                    data.schoolFeeDetailsList.forEach(element => {
                        schoolFeesDetailsDataList.innerHTML += `
                            <tr>
                                <td>${element.SusGraduationLevel}</td>
                                <td>${element.SchoolFeeProfile}</td>
                                <td>${element.SchoolFee}</td>
                                <td>${element.amount}</td>
                                <td>${element.important?`Oui`:`Non`}</td>
                                <td>
                                    <div class="button-list">
                                        <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="GetSchoolFeeDetailsById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                        <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                    </div>
                                </td>
                            </tr>
                            `
                        });
                    $('#schoolFeesDetailsTable').DataTable()
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
                document.getElementById('SchoolFeeDetailsBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                document.getElementById('SchoolFeeDetailsBtn').disabled = false
                
                } else {
                    document.getElementById('SchoolFeeDetailsBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('SchoolFeeDetailsBtn').disabled = false
                    toastr.error(data.message, "Information", {
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

    }

})


//Get schoolfeedetails by id
function GetSchoolFeeDetailsById(id){
$.ajax({
        method: 'GET',
        url: `/school/GetSchoolFeeDetailsById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                
                document.getElementById('SchoolFeeDetailsId').value = ""
                document.getElementById('SchoolFeeDetailsSusGraduationLevelId').value = ""
                document.getElementById('SchoolFeeDetailsProfileId').value = ""
                document.getElementById('SchoolFeeDetailsFeeId').value = ""
                document.getElementById('SchoolFeeDetailsAmount').value = ""
                document.getElementById('SchoolFeeDetailsImportantId').value = ""

                document.getElementById('SchoolFeeDetailsId').value = data.schoolFeeDetails.id
                document.getElementById('SchoolFeeDetailsSusGraduationLevelId').value = data.schoolFeeDetails.SusGraduationLevel
                document.getElementById('SchoolFeeDetailsProfileId').value = data.schoolFeeDetails.SchoolFeeProfile
                document.getElementById('SchoolFeeDetailsFeeId').value = data.schoolFeeDetails.SchoolFee
                document.getElementById('SchoolFeeDetailsAmount').value = data.schoolFeeDetails.amount
                document.getElementById('SchoolFeeDetailsImportantId').value = data.schoolFeeDetails.important

                $('#SchoolFeeDetailsModal').modal('show')
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


//delete school fee details by id
function DeleteSchoolFeeDetailsById(id){
schoolFeesDetailsForm.reset();
    $.ajax({
        method: "GET",
        url: `/school/GetSchoolFeeDetailsById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous sûr de vouloir supprimer ?",
                    text: "Supprimer les details du niveau " + data.schoolFeeDetails.SusGraduationLevel,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/DeleteSchoolFeeDetailsById/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                schoolFeesDetailsDataList.innerHTML = ""
                                $('#schoolFeesDetailsTable').DataTable().clear().destroy()
                                data.schoolFeeDetailsList.forEach(element => {
                                    schoolFeesDetailsDataList.innerHTML += `
                                        <tr>
                                            <td>${element.SusGraduationLevel}</td>
                                            <td>${element.SchoolFeeProfile}</td>
                                            <td>${element.SchoolFee}</td>
                                            <td>${element.amount}</td>
                                            <td>${element.important?`Oui`:`Non`}</td>
                                            <td>
                                                <div class="button-list">
                                                    <button class="btn waves-effect waves-light btn-warning btn-sm text-white" onclick="GetSchoolFeeDetailsById('${ element.id }')" data-toggle="tooltip" title="Modifier"> <i class="mdi mdi-pencil-box-outline"></i> </button>
                                                    <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${ element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                                </div>
                                            </td>
                                        </tr>
                                        `
                                    });
                                $('#schoolFeesDetailsTable').DataTable()
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


//**************End SchoolDetailsFees session**************/
//**************End SchoolDetailsFees session**************/
//**************End SchoolDetailsFees session**************/