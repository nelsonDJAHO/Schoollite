const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const schoolForm = document.getElementById('schoolForm')


schoolForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let schoolId = document.getElementById('schoolId').value
    let denomination = document.getElementById('denomination').value
    let sigle = document.getElementById('sigle').value
    let livingCountry = document.getElementById('livingCountry').value
    let livingTown = document.getElementById('livingTown').value
    let address = document.getElementById('address').value
    let phoneNumber = document.getElementById('phoneNumber').value
    let email = document.getElementById('email').value

    mydata = new FormData()
    mydata.append('schoolId', schoolId)
    mydata.append('denomination', denomination)
    mydata.append('sigle', sigle)
    mydata.append('livingCountry', livingCountry)
    mydata.append('livingTown', livingTown)
    mydata.append('address', address)
    mydata.append('phoneNumber', phoneNumber)
    mydata.append('email', email)
    mydata.append('csrfmiddlewaretoken', csrftoken)

    $.ajax({
        method: 'POST',
        url: '/school/SchoolInformations/',
        processData: false,
        contentType: false,
        data: mydata,
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
                document.getElementById('spinner').classList.add('d-none')
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

})