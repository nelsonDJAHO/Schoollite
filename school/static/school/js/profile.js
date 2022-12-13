$(document).ready(function() {
    $('.dropify').dropify();
});

const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

// Informations personnelles
const profileForm = document.getElementById('profileForm')
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#profileForm').parsley().isValid()) {
        document.getElementById('informationBtn').innerHTML = "Enregistrement..."
        document.getElementById('informationBtn').disabled = true

        let userId = document.getElementById('userId').value
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
        mydata.append('userId', userId)
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
            url: '/school/profile/',
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: mydata,
            success: function(data) {
                rdata = JSON.parse(data)
                if (rdata.status == true) {
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
                    setTimeout(reloadPage, 2000)
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
                    document.getElementById('informationBtn').innerHTML = "Enregistrer"
                    document.getElementById('informationBtn').disabled = false
                }
            }
        })
    }
})


//Password change
const passwordForm = document.getElementById('passwordForm')
passwordForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if ($('#passwordForm').parsley().isValid()) {
        document.getElementById('passwordBtn').innerHTML = "Enregistrement..."
        document.getElementById('passwordBtn').disabled = true

        let userId = document.getElementById('userId').value
        let oldPassword = document.getElementById('oldPassword').value
        let newPassword = document.getElementById('newPassword').value
        mydata = new FormData()
        mydata.append('userId', userId)
        mydata.append('oldPassword', oldPassword)
        mydata.append('newPassword', newPassword)
        mydata.append('csrfmiddlewaretoken', csrftoken)
        $.ajax({
            method: 'POST',
            url: '/school/passwordUpdate/',
            processData: false,
            contentType: false,
            data: mydata,
            success: function(data) {
                if (data.status == true) {
                    passwordForm.reset()
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
                    document.getElementById('passwordBtn').innerHTML = "Enregistrer"
                    document.getElementById('passwordBtn').disabled = false
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
                    document.getElementById('passwordBtn').innerHTML = "Enregistrer"
                    document.getElementById('passwordBtn').disabled = false
                }
            }
        })
    }
})