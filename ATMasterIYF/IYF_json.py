import json
import sys
import re
import xlrd
import datetime
from pymongo import MongoClient
#workbook = xlrd.open_workbook("/home/govind/js/angular_projects/ATMasterIYF/test_iyf.xlsx")
#workbook = xlrd.open_workbook("/home/govind/Downloads/test_iyf.xlsx")
workbook = xlrd.open_workbook("/home/govind/Downloads/IYF_DB.xlsx")
worksheet = workbook.sheet_by_name("MasterSheet")
client = MongoClient('mongodb://localhost:27017/')
db = client.iyfdb
devotees = db.devotees


data = []
keys = [v.value for v in worksheet.row(0)]
date_col_nos = [col_dt for col_dt,dt in enumerate(keys) if re.match(r'.*([1-3][0-9]{3})', str(dt))]

counslr_map = {"KVP" : "HG Kalpvraksha Prabhuji", "SGP" : "HG Shyam Gopal Prabhuji", "VCP" : "HG Vaidant Chaitnya Prabhuji",\
               "JNP" : "HG Jagadanand Pandit Prabhuji","PVNP" : "HG Pundrik Vidhyanidhi Prabhuji"}
for row_number in range(worksheet.nrows):
    for_date_col = []
    if row_number == 0:
        continue
    row_data = {}
    for col_number, cell in enumerate(worksheet.row(row_number)):
        if col_number in date_col_nos:
            col_date_  = datetime.datetime(*xlrd.xldate_as_tuple(keys[col_number], workbook.datemode)) 
            col_date_ = col_date_.strftime('%d-%m-%Y')
            for_date_col.append({'date':str(col_date_),'present':"NO" if cell.ctype == xlrd.XL_CELL_ERROR  else cell.value})       
        
        else:
            if keys[col_number] == 'Counsellor':
                couslr_name = str(cell.value).upper()
                if  couslr_name in counslr_map.keys():
                    row_data[(keys[col_number]).lower()] = counslr_map[couslr_name]
            elif keys[col_number] == 'contact':
                row_data[(keys[col_number]).lower()] = cell.value.__str__().split('.')[0]

            elif keys[col_number] == 'BACE':
                if cell.value == '':
                    row_data[(keys[col_number]).lower()] = "NO"
                else:
                    row_data[(keys[col_number]).lower()] = cell.value
            elif keys[col_number] == 'DOB':
                row_data['age'] = cell.value.__str__().split('.')[0]
            elif keys[col_number] == 'Course' and cell.value == 'UMANG':
                row_data[(keys[col_number]).lower()] = "OTP"
            else:
                row_data[(keys[col_number]).lower()] = cell.value
    row_data['attendance'] = for_date_col
    print row_data
    #if not devotees.find_one({"contact": row_data["contact"]}):
    #    print "data row", row_data
    #    devotee_id = devotees.insert_one(row_data).inserted_id
    #    print "id is", devotee_id
    #else:
    #    print "found.."

    #data.append(row_data)

#json_file = "/home/govind/js/angular_projects/ATMasterIYF/test_json.json"
#with open(json_file, 'w') as json_file:
#    json_file.write(json.dumps({'data': data}))
