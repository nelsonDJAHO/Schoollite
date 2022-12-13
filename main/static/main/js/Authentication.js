// Formulaire d authentification
const AuthenticationForm = document.getElementById('AuthenticationForm')
const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

function reloadPage() {
    document.location.reload()
}

AuthenticationForm.addEventListener('submit', (e) => {
    e.preventDefault()

    document.getElementById('connexionBtn').innerHTML = "CONNEXION..."
    document.getElementById('connexionBtn').disabled = true
    let email = document.getElementById('val-email').value
    let password = document.getElementById('val-password').value

    mydata = new FormData()
    mydata.append('email', email)
    mydata.append('password', password)
    mydata.append('csrfmiddlewaretoken', csrftoken)

    $.ajax({
        method: 'POST',
        url: '/',
        data: mydata,
        processData: false,
        contentType: false,
        success: function(data) {
            if (data.status == true) {
                AuthenticationForm.reset()
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
                reloadPage()
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
                document.getElementById('connexionBtn').innerHTML = "CONNEXION"
                document.getElementById('connexionBtn').disabled = false
            }
        }
    })
})