 $.ajax({
     type: 'POST',
     url: 'MyServerUrl',
     data: {
         'color[]': $('select.select2').val()
     },
     success: function(data, textStatus, jqXHR) {

     },
     error: function(data, textStatus, jqXHR) {}
 });

 var formData = new FormData();
 for (var i = 0; i < $("#upload #file").get(0).files.length; i++)
     formData.append("file" + i, $("#upload #file").get(0).files[i]);