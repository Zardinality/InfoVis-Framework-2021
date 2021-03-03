from flask import render_template, request, jsonify
import os, json

from decimal import Decimal

import pandas as pd
import numpy as np

from . import main

from app import data


@main.route('/', methods=['GET'])
def index():
	return render_template("home.html")


@main.route('/world', methods=['GET'])
def world():
	return render_template("world.html")


# @main.route('/project', methods = ['GET'])
# def getColors():
#     colors = ['Red', 'Blue', 'Black', 'Orange']
#     return render_template('project.html', colors=colors)

@main.route('/project', methods = ['GET'])
def getUrls():
	urls = data.return_url_list()

	attributes = {}

	return render_template('project.html', urls=urls, attributes=attributes)

@main.route('/newpage')
def getAttributes():
	url = request.args.get("url")

	data_copy =  data.df.set_index("id")
	attributes = data_copy.loc[data_copy["image_url"] == url]
	print(attributes)
	return render_template('project.html', attributes=attributes)



# @main.route('/project', methods = ['GET'])
# def getAttributes():
# 	# url = request.args.get("url")
# 	# attributes = data.return_attributes(url)
# 	# print(attributes)
#
# 	attributes = {"a": 1, "b": 2}
# 	return render_template('project.html', attributes=attributes)
#


# @main.route('/project', methods= ['GET'])
# def showAttributes():
# 	attributes = {"a" :1, "b":2}
# 	return render_template('project.html', attributes=attributes)