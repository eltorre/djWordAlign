from django.shortcuts import render
from django.views import generic
from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect, Http404


# Create your views here.

def index(request):
    template = loader.get_template('main/index.html')
    context = {}
    return HttpResponse(template.render(context, request))
