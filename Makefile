#-----------------------------------------------------------------------
# Frontend
#-----------------------------------------------------------------------

install-dev-js:
	npm i -D typescript tslint ts-loader

install-dev-bundler:
	npm i -D webpack @types/webpack webpack-cli webpack-dev-server file-loader

init-npm:
	npm init -y

install-dev-front: init-npm install-dev-js install-dev-bundler

#-----------------------------------------------------------------------
# Deploy
#-----------------------------------------------------------------------

deploy:
	rsync -avhpz --exclude-from=.syncignore ./public/ pi@192.168.1.4:www/portfolio

deploy-test:
	rsync -avhpzn --exclude-from=.syncignore ./public/ pi@192.168.1.4:www/portfolio

# backup-live:
# 	rsync -avhpz trainthetrainerbe.insideapp.be:www/ ./backup

# backup-live-test:
# 	rsync -avhpzn trainthetrainerbe.insideapp.be:www/ ./backup
