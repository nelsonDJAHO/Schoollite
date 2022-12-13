function reloadPage() {
    document.location.reload()
}

// change academic year in session
function changeAcademicYear(id) {
    $.ajax({
        method: "GET",
        url: `/changeAcademicYear/${id}/`,
        success: function(data) {
            if (data.status == true) {
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
                setTimeout(reloadPage, 2000)
            } else {
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
        }
    })
}


// ResetForm
function resetForm(formId) {
    document.getElementById('' + formId + '').reset()
}


// Dropify
$(document).ready(function() {
    $('.dropify').dropify();
});

function reloadDropify(imageUrl) {
    var drEvent = $('.dropify').dropify({
        defaultFile: imageUrl
    })
    drEvent = drEvent.data('dropify')
    drEvent.resetPreview()
    drEvent.clearElement()
    drEvent.settings.defaultFile = imageUrl
    drEvent.destroy()
    drEvent.init()
}


// reset select 2
function resetSelect2(selectId) {
    $('#' + selectId + '').empty()
}

//open page in modal window*****************
//open page in modal window*****************
//open page in modal window*****************
function openModalPopUpPage(link) {
    var popOpObj;
    popOpObj = window.open(`${link}`, "ModalPopUp", "widt=1000," + "height=400")
    popOpObj.focus()
}
//open page in modal window*****************
//open page in modal window*****************
//open page in modal window*****************