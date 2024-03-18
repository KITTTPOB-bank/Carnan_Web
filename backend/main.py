from fastapi import FastAPI, Header, File, UploadFile, Form
from pymongo.mongo_client import MongoClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from bson import ObjectId
import json
import jwt 
import boto3
from botocore.exceptions import NoCredentialsError
from io import BytesIO
import numpy as np

uri = "mongoDB"
app = FastAPI()

app.max_request_size = 1024 * 1024  * 1000

client = MongoClient(uri)
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#---------------------------------------------------------------------
def uploads_types(files, folder_path, bucket_name, folder_type, folder):
    s3 = boto3.client('s3', aws_access_key_id='***',
                      aws_secret_access_key='***')
    for file in files:
        s3_file_key = f"{folder}/{folder_path}/{folder_type}/{file.filename}"
        s3.upload_fileobj(file.file, bucket_name, s3_file_key)
        acl = 'public-read'
        s3.put_object_acl(Bucket=bucket_name, Key=s3_file_key, ACL=acl)

    return "สำเร็จ"


@app.post("/uploadscars")
async def uploadscars(files: List[UploadFile] = File(...),
                      name: str = Form(...),
                      brand: str = Form(...),
                      year: int = Form(...),
                      typecheck: int = Form(...)):

    bucket_name = 'carimageapp'
    folder = 'Trendmodelpicture'
    folder_path = brand + ' ' + name + ' ' + str(year)
    folder_type = checkpartall(typecheck)
    print(folder_type)
    print(folder_path)
    print(bucket_name)
    check = uploads_types(files, folder_path, bucket_name, folder_type, folder)
    return {"message": check}


class dropcar(BaseModel):
    delid: int


@app.get("/")
async def check():
    print("life")


@app.get("/cardataadmin")
async def car():
    db = client.carpartdata
    col = db.car
    data = list(col.find({}))
    return JSONResponse(data)

    
@app.put("/dropcar")
async def dropcar(request_body: dropcar):
    delid = request_body.delid
    db = client.carpartdata
    col = db.car
    col.delete_one({"_id": delid})
    return {"message": "ลบสำเร็จ"}


def upload_to_s3(file, folder_path, bucket_name):
    s3 = boto3.client('s3', aws_access_key_id='***',
                      aws_secret_access_key='***')
    try:
        s3_file_key = f"{folder_path}/{file.filename}"
        s3.upload_fileobj(file.file, bucket_name, s3_file_key)
        url = f"https://{bucket_name}.s3.ap-southeast-2.amazonaws.com/{s3_file_key}"
        acl = 'public-read'
        s3.put_object_acl(Bucket=bucket_name, Key=s3_file_key, ACL=acl)
        return url
    except NoCredentialsError:
        return None


@app.post("/addcar")
async def model_car(
    file: UploadFile = File(...),
    name: str = Form(...),
    brand: str = Form(...),
    year: int = Form(...),
    desc: str = Form(...),
):
    print(file)
    folder_path = "imagepeviewcar"
    bucket_name = 'carimageapp'
    uploaded_url = upload_to_s3(file, folder_path, bucket_name)
    db = client.carpartdata
    col = db.car
    latest_doc = col.aggregate([
        {"$sort": {"_id": -1}},
        {"$limit": 1}
    ])
    latest_doc = next(latest_doc, None)
    latest_id = latest_doc['_id'] + 1
    col.insert_one({"_id": latest_id,
                    "name": name,
                    "brand": brand,
                    "year": year,
                    "desc": desc,
                    "frontbumper_list": [],
                    "rearbumper_list": [],
                    "grille_list": [],
                    "headlamp_list": [],
                    "backuplamp_list": [],
                    "mirror_list": [],
                    "door_list": [],
                    "car_image": uploaded_url
                    })
    return {"message": "เพิ่มสำเร็จ"}


@app.post("/jsonfile")
async def jsonfile(typecheck: int = None, file: UploadFile = File(...)):
    db = client.carpartdata
    part_type = checkpartall(typecheck)
    col = db[part_type]
    latest_doc = col.aggregate([
        {"$sort": {"_id": -1}},
        {"$limit": 1}
    ])
    latest_doc = next(latest_doc, None)
    contents = await file.read()
    file_content_str = contents.decode('utf-8')
    file_data = json.loads(file_content_str)
    latest_id = latest_doc['_id'] + 1

    modified_data = [{'_id': latest_id + i, **item}
                     for i, item in enumerate(file_data)]
    col.insert_many(modified_data)
    return {"message": "อัปโหลดข้อมูลสำเร็จ"}


class Editpartdata(BaseModel):
    type: int
    name: str
    price: float
    code: str
    oldid: int

@app.post("/jsonfileaddcarpart")
async def jsonfile(file: UploadFile = File(...),
                      name: str = Form(...),
                      brand: str = Form(...),
                      year: int = Form(...),
                      typecheck: int = Form(...)):
    db = client.carpartdata
    contents = await file.read()
    file_content_str = contents.decode('utf-8')
    file_data = json.loads(file_content_str)
    partall_type = checkpartall(typecheck)
    codes_from_json   = [item["code"] for item in file_data]
    matching_documents = db[partall_type].find({"code": {"$in": codes_from_json}})
    selected_ids = [document["_id"] for document in matching_documents]
    col = db.car
    list_part = checkpart(typecheck)
    col.update_one(
        {"name": name, "brand": brand, "year": year},
        {'$push': {list_part: {'$each': selected_ids}}}
    )

    return {"message": "อัปโหลดข้อมูลสำเร็จ"}


class Editpartdata(BaseModel):
    type: int
    name: str
    price: float
    code: str
    oldid: int

@app.put("/editallpart")
async def edit_data(request_body: Editpartdata):
    type_value = request_body.type
    name = request_body.name
    price = request_body.price
    code = request_body.code
    oldid = request_body.oldid
    part_type = checkpartall(type_value)
    db = client.carpartdata
    col = db[part_type]
    col.update_one(
        {"_id": oldid},
        {"$set": {
            "code": code,
            "name": name,
            "price": price
        }}
    )

    return {"message": "แก้ไขสำเร็จ"}


class addpartRequest(BaseModel):
    type: int
    name: str
    price: float
    code: str


@app.put("/addallpart")
async def edit_data(request_body: addpartRequest):
    type_value = request_body.type
    name = request_body.name
    price = request_body.price
    code = request_body.code
    part_type = checkpartall(type_value)
    db = client.carpartdata
    col = db[part_type]
    latest_doc = col.aggregate([
        {"$sort": {"_id": -1}},
        {"$limit": 1}
    ])
    latest_doc = next(latest_doc, None)
    latest_id = latest_doc['_id'] + 1
    col.insert_one({"_id": latest_id,
                    "code": code,
                    "name": name,
                    "price": price
                    })
    return {"message": "เพิ่มสำเร็จ"}


class DeletepartRequest(BaseModel):
    delid: int
    type: int


@app.put("/deleteallpart")
async def edit_data(request_body: DeletepartRequest):
    delid = request_body.delid
    type_value = request_body.type
    part_type = checkpartall(type_value)
    db = client.carpartdata
    col = db[part_type]
    col.delete_one({"_id": delid})
    return {"message": "ลบสำเร็จ"}


@app.get("/carpartall")
async def car():
    db = client.carpartdata
    col_frontbumper = db.frontbumper
    col_rearbumper = db.rearbumper
    col_grille = db.grille
    col_door = db.door
    col_mirror = db.mirror
    col_headlamp = db.headlamp
    col_backuplamp = db.backuplamp
    data_frontbumper = list(col_frontbumper.find({}))
    data_rearbumper = list(col_rearbumper.find({}))
    data_grille = list(col_grille.find({}))
    data_door = list(col_door.find({}))
    data_mirror = list(col_mirror.find({}))
    data_headlamp = list(col_headlamp.find({}))
    data_backuplamp = list(col_backuplamp.find({}))
    response_data = {
        "all_frontbumper": list(data_frontbumper),
        "all_rearbumper": list(data_rearbumper),
        "all_grille": list(data_grille),
        "all_mirror": list(data_mirror),
        "all_headlamp": list(data_headlamp),
        "all_backuplamp": list(data_backuplamp),
        "all_door": list(data_door)
    }
    return JSONResponse(response_data)


class cardata(BaseModel):
    brand: str
    name: str
    year: int


@app.get("/cardata")
async def car():
    db = client.carpartdata
    col = db.car
    filters = {"name": 1, "brand": 1, "year": 1}
    data = list(col.find({}, filters))
    return JSONResponse(data)


@app.get("/cardataadmin")
async def car():
    db = client.carpartdata
    col = db.car
    data = list(col.find({}))
    return JSONResponse(data)


@app.get("/carpart")
async def carpart(name: str, brand: str, year: int, check: int):
    db = client.carpartdata

    filters = {"frontbumper_list": 1, "rearbumper_list": 1, "grille_list": 1,
               "headlamp_list": 1, "backuplamp_list": 1, "mirror_list": 1, "door_list": 1}

    documents = db.car.find_one(
        {"name": name, "brand": brand, "year": year}, filters)
    frontbumper_data = db.frontbumper.find(
        {"_id": {"$in": documents['frontbumper_list']}})
    rearbumper_data = db.rearbumper.find(
        {"_id": {"$in": documents['rearbumper_list']}})
    grille_data = db.grille.find(
        {"_id": {"$in": documents['grille_list']}})
    door_data = db.door.find(
        {"_id": {"$in": documents['door_list']}})
    mirror_data = db.mirror.find(
        {"_id": {"$in": documents['mirror_list']}})
    headlamp_data = db.headlamp.find(
        {"_id": {"$in": documents['headlamp_list']}})
    backuplamp_data = db.backuplamp.find(
        {"_id": {"$in": documents['backuplamp_list']}})

    if check == 1:
        frontbumper_all = db.frontbumper.find(
            {"_id": {"$nin": documents['frontbumper_list']}})
        rearbumper_all = db.rearbumper.find(
            {"_id": {"$nin": documents['rearbumper_list']}})
        grille_all = db.grille.find(
            {"_id": {"$nin": documents['grille_list']}})
        door_all = db.door.find(
            {"_id": {"$nin": documents['door_list']}})
        mirror_all = db.mirror.find(
            {"_id": {"$nin": documents['mirror_list']}})
        headlamp_all = db.headlamp.find(
            {"_id": {"$nin": documents['headlamp_list']}})
        backuplamp_all = db.backuplamp.find(
            {"_id": {"$nin": documents['backuplamp_list']}})
    else:
        frontbumper_all = []
        rearbumper_all = []
        grille_all = []
        door_all = []
        mirror_all = []
        headlamp_all = []
        backuplamp_all = []

    response_data = {
        "frontbumper": list(frontbumper_data),
        "rearbumper": list(rearbumper_data),
        "grille": list(grille_data),
        "door": list(door_data),
        "mirror": list(mirror_data),
        "headlamp": list(headlamp_data),
        "backuplamp": list(backuplamp_data),
        "all_frontbumper": list(frontbumper_all),
        "all_rearbumper": list(rearbumper_all),
        "all_grille": list(grille_all),
        "all_door": list(door_all),
        "all_mirror": list(mirror_all),
        "all_headlamp": list(headlamp_all),
        "all_backuplamp": list(backuplamp_all),
    }
    return JSONResponse(response_data)


class UpdateDataRequest(BaseModel):
    selected_ids: List[int]
    type: int
    brand: str
    name: str
    year: int


def checkpart(type_value):
    if type_value == 0:
        list_part = 'frontbumper_list'
    elif type_value == 1:
        list_part = 'rearbumper_list'
    elif type_value == 2:
        list_part = 'grille_list'
    elif type_value == 3:
        list_part = 'mirror_list'
    elif type_value == 4:
        list_part = 'headlamp_list'
    elif type_value == 5:
        list_part = 'backuplamp_list'
    elif type_value == 6:
        list_part = 'door_list'
    return list_part


def checkpartall(type_value):
    if type_value == 0:
        part_type = 'frontbumper'
    elif type_value == 1:
        part_type = 'rearbumper'
    elif type_value == 2:
        part_type = 'grille'
    elif type_value == 3:
        part_type = 'mirror'
    elif type_value == 4:
        part_type = 'headlamp'
    elif type_value == 5:
        part_type = 'backuplamp'
    elif type_value == 6:
        part_type = 'door'
    elif type_value == 7:
        part_type = 'body'
    return part_type


@app.put("/addpart")
async def update_data(request_body: UpdateDataRequest):
    selected_ids = request_body.selected_ids
    type_value = request_body.type
    brand = request_body.brand
    name = request_body.name
    year = request_body.year
    db = client.carpartdata
    col = db.car
    list_part = checkpart(type_value)
    col.update_one({"name": name, "brand": brand, "year": year}, {
        '$push': {list_part: {'$each': selected_ids}}})


class editDataRequest(BaseModel):
    type: int
    brand: str
    name: str
    year: int
    newid: int
    oldid: int


@app.put("/editpart")
async def edit_data(request_body: editDataRequest):
    brand = request_body.brand
    name = request_body.name
    year = request_body.year
    newid = request_body.newid
    oldid = request_body.oldid
    type_value = request_body.type
    print(brand, name, year, newid, oldid, type_value)
    part = checkpart(type_value)
    db = client.carpartdata
    filters = {part: 1}
    documents = db.car.find_one(
        {"name": name, "brand": brand, "year": year}, filters)
    new_data = [newid if item == oldid else item for item in documents[part]]

    db.car.update_one(
        {"name": name, "brand": brand, "year": year},
        {"$set": {part: new_data}}
    )


class DeleteDataRequest(BaseModel):
    delid: int
    type: int
    brand: str
    name: str
    year: int


@app.put("/deletepart")
async def edit_data(request_body: DeleteDataRequest):
    brand = request_body.brand
    name = request_body.name
    year = request_body.year
    delid = request_body.delid
    type_value = request_body.type

    print(brand, name, year, delid, type_value)
    part = checkpart(type_value)
    db = client.carpartdata
    filters = {part: 1}
    documents = db.car.find_one(
        {"name": name, "brand": brand, "year": year}, filters)
    print(documents[part])
    documents[part].remove(delid)

    db.car.update_one(
        {"name": name, "brand": brand, "year": year},
        {"$set": {part: documents[part]}}
    )


@app.get("/getallcar")
async def getallcar():
    db = client.carpartdata
    col = db.car
    filters = {"name": 1, "brand": 1, "year": 1, "car_image": 1, "desc": 1}
    data = list(col.find({}, filters))
    return JSONResponse(data)

@app.get("/getaws3image")
async def getimagecar(name: str, brand: str, year: int):
    try:
        s3 = boto3.client('s3', aws_access_key_id='***', aws_secret_access_key='***')
        bucket_name = '***'
        s3_folders = {
            'frontbumper': f'Trendmodelpicture/{brand} {name} {year}/frontbumper',
            'rearbumper': f'Trendmodelpicture/{brand} {name} {year}/rearbumper',
            'headlamp': f'Trendmodelpicture/{brand} {name} {year}/headlamp',
            'backuplamp': f'Trendmodelpicture/{brand} {name} {year}/backuplamp',
            'door': f'Trendmodelpicture/{brand} {name} {year}/door',
            'body': f'Trendmodelpicture/{brand} {name} {year}/body',
        }
                
        image_uris_by_category = {category: [] for category in s3_folders.keys()}
        
        for category, folder in s3_folders.items():
            response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder)
            for obj in response.get('Contents', []):
                image_uri = f"https://{bucket_name}.s3.ap-southeast-2.amazonaws.com/{obj['Key']}"
                image_uris_by_category[category].append(image_uri)
        
        return image_uris_by_category
        
    except Exception as e:
        return JSONResponse(content={'error': str(e)}, status_code=500)


@app.get("/downloadfile")
def download_images_from_s3(name: str, brand: str, year: int):
    bucket_name = 'carimageapp'
    s3_folder = f'Trendmodelpicture/{brand} {name} {year}/'

    s3 = boto3.client('s3', aws_access_key_id='****',
                        aws_secret_access_key='****')
    try:
        objects = s3.list_objects(Bucket=bucket_name, Prefix=s3_folder)['Contents']
        
        def generate_zip():
            with io.BytesIO() as buffer:
                with zipfile.ZipFile(buffer, 'w') as zipf:
                    for obj in objects:
                        key = obj['Key']
                        s3_object = s3.get_object(Bucket=bucket_name, Key=key)
                        zipf.writestr(key, s3_object['Body'].read())

                buffer.seek(0)
                yield from buffer

        return StreamingResponse(generate_zip(), media_type='application/zip', headers={'Content-Disposition': f'attachment; filename={brand}_{name}_{year}.zip'})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    








