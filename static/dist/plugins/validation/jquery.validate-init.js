jQuery(".form-valide").validate({
    ignore: [],
    errorClass: "invalid-feedback animated fadeInDown",
    errorElement: "div",
    errorPlacement: function(e, a) { jQuery(a).parents(".form-group > div").append(e) },
    highlight: function(e) { jQuery(e).closest(".form-group").removeClass("is-invalid").addClass("is-invalid") },
    success: function(e) { jQuery(e).closest(".form-group").removeClass("is-invalid"), jQuery(e).remove() },
    rules: {
        "val-username": { required: !0, minlength: 3 },
        "val-email": { required: !0, email: !0 },
        "val-password": { required: !0, minlength: 5 },
        "val-confirm-password": { required: !0, equalTo: "#val-password" },
        "val-select2": { required: !0 },
        "val-select2-multiple": { required: !0, minlength: 2 },
        "val-suggestions": { required: !0, minlength: 5 },
        "val-skill": { required: !0 },
        "val-currency": { required: !0, currency: ["$", !0] },
        "val-website": { required: !0, url: !0 },
        "val-phoneus": { required: !0, phoneUS: !0 },
        "val-digits": { required: !0, digits: !0 },
        "val-number": { required: !0, number: !0 },
        "val-range": { required: !0, range: [1, 5] },
        "val-terms": { required: !0 },
        "val-required": { required: !0, minlength: 3 }
    },
    messages: {
        "val-username": {
            required: "Please enter a username",
            minlength: "Your username must consist of at least 3 characters"
        },
        "val-email": "Saisissez une adresse email valide",
        "val-password": {
            required: "Saisissez un mot de passe",
            minlength: "Votre mot de passe doit contenir au mois 5 caractères"
        },
        "val-confirm-password": {
            required: "Saisissez un mot de passe",
            minlength: "Votre mot de passe doit contenir au mois 5 caractères",
            equalTo: "Vos mots de passe doivent correspondre"
        },
        "val-required": {
            required: "Ce champs est requis",
            minlength: "Votre mot de passe doit contenir au mois 3 caractères",
        },
        "val-select2": "Please select a value!",
        "val-select2-multiple": "Please select at least 2 values!",
        "val-suggestions": "What can we do to become better?",
        "val-skill": "Faites une sélection !",
        "val-currency": "Please enter a price!",
        "val-website": "Please enter your website!",
        "val-phoneus": "Please enter a US phone!",
        "val-digits": "Please enter only digits!",
        "val-number": "Please enter a number!",
        "val-range": "Please enter a number between 1 and 5!",
        "val-terms": "You must agree to the service terms!"
    }
});