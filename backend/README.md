ปรับ Github เป็น private เวลา gitclone ใช้ token classsic ใน ส่วน Dev ของ github

สำหรับ Http
```
ติดตั้งบน AWS EC2
sudo apt-get update / sudo apt install python3-pip
pip3 install -r requirements.txt
sudo apt install nginx -> cd /etc/nginx/sites-enabled/ -> sudo nano fastapi_nginx
--------------------------------------
server {
    listen 80;
    server_name ***;
    client_max_body_size 100M;
    location / {
        proxy_pass http://127.0.0.1:8000;
    }
}
-------------------------------------
sudo service nginx restart

การรันการทำงาน ใช้ cd .. และ cd ubentu/ และ github ที่ใช้รัน  
uvicorn main:app --host 0.0.0.0 --port 8000
```

สำหรับ Https
```
ติดตั้งบน AWS EC2
sudo apt-get update / sudo apt install python3-pip
pip3 install -r requirements.txt
sudo apt install nginx -> sudo apt-get install openssl 

cd /etc/nginx
sudo mkdir ssl 

sudo openssl req -batch -x509 -nodes -days 365 \
-newkey rsa:2048 \
-keyout /etc/nginx/ssl/server.key \
-out /etc/nginx/ssl/server.crt

cd /etc/nginx/sites-enabled/ -> sudo nano fastapi_nginx
--------------------------------------
server {
    listen 80;
    listen 443 ssl;
    ssl on;
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    server_name ****;
    location / {
        proxy_pass http://127.0.0.1:8000;
    }
}
-------------------------------------
sudo service nginx restart

การรันการทำงาน ใช้ cd .. และ cd ubentu/ และ github ที่ใช้รัน  
python3 -m uvicorn main:app 
```

