from django import forms
from main.models import MessageAttachedFile


class attachedFilesForm(forms.ModelForm):

    class Meta:
        model = MessageAttachedFile
        fields = ['Message', 'School', 'AcademicYear', 'fileType', 'fileName', 'file']

        def post(self, request, *args, **kwargs):
            files = request.FILES.getlist('emailFiles')
