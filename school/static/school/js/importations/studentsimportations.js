const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const importationForm = document.getElementById('importationForm')
const importationsDataList = document.getElementById('importationsDataList')
const imporationsTable = document.getElementById('imporationsTable')




importationForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if ($('#importationForm').parsley().isValid()) {

        document.getElementById('importationBtn').innerHTML = "Enregistrement..."
        document.getElementById('importationBtn').disabled = true

        mydata = new FormData()

        // Attatchment
        var totalfiles = document.getElementById('importationFile').files.length;
        for (var index = 0; index < totalfiles; index++) {
            // console.log(document.getElementById('emailAttatchment').files[index])
            mydata.append("importationFile", document.getElementById('importationFile').files[index]);
        }
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/school/studentsImportation/',
            processData: false,
            contentType: false,
            data: mydata,
            enctype: "multipart/form-data",
            success: function(data) {
                if (data.status == true) {
                    importationForm.reset();
                    importationsDataList.innerHTML = ""
                    $('#imporationsTable').DataTable().clear().destroy()
                    data.importations.forEach(element => {
                        importationsDataList.innerHTML += `
                                <tr>
                                    <td>${element.reference}</td>
                                    <td>${element.AcademicYear}</td>
                                    <td>${element.date}</td>
                                    <td>${element.heure}</td>
                                    <td><a href="${ element.file}"><i class="mdi mdi-file-excel "></i> Telecharger le fichier</a></td>
                                    <td>${element.status}</td>
                                    <td>
                                        <div class="button-list">
                                            <button class="btn waves-effect waves-light btn-info btn-sm" onclick="importationDetails('${ element.id }')" data-toggle="tooltip" title="Consulter"><i class="icon-eye"></i> </button>
                                            <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id }')" data-toggle="tooltip" title="Supprimer"><i class="icon-trash"></i> </button>
                                        </div>
                                    </td>
                                </tr>
                            `
                    })
                    $('#imporationsTable').DataTable()

                    document.getElementById('importationBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('importationBtn').disabled = false
                    toastr.success(data.message, "Succ??s", {
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

                    // setTimeout(reloadPage, 2000)
                } else {
                    document.getElementById('importationBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                    document.getElementById('importationBtn').disabled = false
                    toastr.error(data.message, "erreur", {
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
                document.getElementById('importationBtn').innerHTML = '<i class="mdi mdi-content-save"></i>  Enregistrer'
                document.getElementById('importationBtn').disabled = false
                toastr.error("Une erreur es survenue", "erreur", {
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

})


// Detele sus
function deleteObject(id) {
    $.ajax({
        method: "GET",
        url: `/school/getImportationById/${id}/`,
        success: function(data) {
            if (data.status == true) {
                swal({
                    title: "Etes-vous s??r de vouloir supprimer ?",
                    text: "Supprimer le fichier d'importation " + data.importation.reference,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer !!",
                    cancelButtonText: "Non, Annuler !!",
                    showCancelButton: !0,
                    closeOnConfirm: !1,
                }, function() {
                    $.ajax({
                        method: 'GET',
                        url: `/school/deleteImportation/${id}/`,
                        success: function(data) {
                            if (data.status == true) {
                                document.location.reload()
                                    //     importationForm.reset();
                                    //     importationsDataList.innerHTML = ""
                                    //     $('#imporationsTable').DataTable().clear().destroy()
                                    //     data.importations.forEach(element => {
                                    //         importationsDataList.innerHTML += `
                                    //     <tr>
                                    //         <td>${element.reference}</td>
                                    //         <td>${element.AcademicYear}</td>
                                    //         <td>${element.date}</td>
                                    //         <td>${element.heure}</td>
                                    //         <td><a href="${ element.file}"><i class="mdi mdi-file-excel "></i> Telecharger le fichier</a></td>
                                    //         <td>${element.status}</td>
                                    //         <td>
                                    //             <div class="button-list">
                                    //                 <button class="btn waves-effect waves-light btn-danger btn-sm" onclick="deleteObject('${element.id }')" data-toggle="tooltip" title="Supprimer"><i class="mdi mdi-close "></i> </button>
                                    //             </div>
                                    //         </td>
                                    //     </tr>
                                    // `
                                    //     })
                                    //     $('#imporationsTable').DataTable()
                                    //     swal("Succ??s !!", data.message, "success")
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


//***********Importation details Modal**********/
//***********Importation details Modal**********/
//***********Importation details Modal**********/

function importationDetails(id) {
    $.ajax({
        method: 'GET',
        url: `/school/ImportationDetails/${id}`,
        success: function(data) {
            if (data.status == true) {
                $('#StudentsTable').DataTable().clear().destroy();

                //Importation
                document.getElementById('importationDetailsReference').value = data.importation.reference
                document.getElementById('importationDetailsAcademicYear').value = data.importation.AcademicYear
                document.getElementById('importationDetailsDate').value = data.importation.Date
                document.getElementById('importationDetailsHour').value = data.importation.Hour
                document.getElementById('importationDetailsStatus').value = data.importation.importationStatus
                document.getElementById('importationDetailsReport').value = data.importation.importationReport


                // Graduations
                data.students.forEach(element => {
                    document.getElementById('StudentsDataList').innerHTML += `
                        <tr>
                            <td><img src="${element.avatar}" alt="" class="rounded-circle" style="width:30px; height:30px;"></td>
                            <td>${element.matricule}</td>
                            <td>${element.fullName}</td>
                            <td>${element.gender}</td>
                            <td>${element.address}</td>
                            <td>${element.phoneNumber}</td>
                        </tr>
                            `
                })
                $('#StudentsTable').DataTable()
                    // table.responsive.recalc()
                    // $('#StudentsTable').DataTable({
                    //         scrollY: "100%",
                    //         scrollX: true,
                    //         scrollCollapse: true,
                    //         // columns: [
                    //         //     { width: '100%', targets: 0 }
                    //         // ]
                    // })
                    // $("#tableContainer").css('display', 'block')
                    // table.columns.adjust().draw()


                $('#importationDetailsModal').modal('show');

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
            toastr.error("Une erreur s'est produite", "Erreur", {
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

//***********Importation details Modal**********/
//***********Importation details Modal**********/
//***********Importation details Modal**********/