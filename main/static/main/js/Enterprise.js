const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const enterpriseForm = document.getElementById('enterpriseForm')

enterpriseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($('#enterpriseForm').parsley().isValid()) {

        let mainschoolId = document.getElementById('mainschoolId').value
        let denomination = document.getElementById('denomination').value
        let sigle = document.getElementById('sigle').value
        let livingCountry = document.getElementById('livingCountry').value
        let livingTown = document.getElementById('livingTown').value
        let address = document.getElementById('address').value
        let phoneNumber = document.getElementById('phoneNumber').value
        let phoneNumber1 = document.getElementById('phoneNumber1').value
        let email = document.getElementById('email').value
        let postBox = document.getElementById('postBox').value

        let monday = document.getElementById('monday').value
        let tuesday = document.getElementById('tuesday').value
        let wednesday = document.getElementById('wednesday').value
        let thursday = document.getElementById('thursday').value
        let friday = document.getElementById('friday').value
        let saturday = document.getElementById('saturday').value

        mydata = new FormData()
        mydata.append('mainschoolId', mainschoolId)
        mydata.append('denomination', denomination)
        mydata.append('sigle', sigle)
        mydata.append('livingCountry', livingCountry)
        mydata.append('livingTown', livingTown)
        mydata.append('address', address)
        mydata.append('phoneNumber', phoneNumber)
        mydata.append('phoneNumber1', phoneNumber1)
        mydata.append('email', email)
        mydata.append('postBox', postBox)
        mydata.append('monday', monday)
        mydata.append('tuesday', tuesday)
        mydata.append('wednesday', wednesday)
        mydata.append('thursday', thursday)
        mydata.append('friday', friday)
        mydata.append('saturday', saturday)
        mydata.append('logo', document.getElementById('logo').files[0])
        mydata.append('csrfmiddlewaretoken', csrftoken)

        $.ajax({
            method: 'POST',
            url: '/Enterprise/',
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: mydata,
            success: function(data) {
                data = JSON.parse(data);
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
    }

})