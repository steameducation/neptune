cp supervisor/neptune.conf /etc/supervisor/conf.d/

cp nginx/neptune /etc/nginx/sites-available/
cd /etc/nginx/sites-enabled/
ln -s ../sites-available/neptune .

# Deploy instructions
(of course this could be automated, but no need for the moment)

log into aws (to allow incoming ssh from current IP)
```
sudo su
cd /app/neptune
git pull
supervisorctl restart neptune
```
