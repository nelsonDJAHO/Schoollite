function reloadPage() {
    document.location.reload()
}

// change academic year in session
function changeAcademicYear(id) {
    $.ajax({
        method: "GET",
        url: `/changeAcademicYear/${id}/`,
        processData: false,
        contentType: false,
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

            }
        }
    })
}