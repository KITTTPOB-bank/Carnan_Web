# backend
-
ติดตั้งบน AWS EC2
sudo apt-get update / sudo apt install python3-pip
pip3 install -r requirements.txt
udo apt install nginx -> cd /etc/nginx/sites-enabled/ -> sudo nano fastapi_nginx
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
uvicorn main:app --host 0.0.0.0 --port 8000
