ARG NGINX_CONTAINER
FROM ${NGINX_CONTAINER}
MAINTAINER Jan Trejbal <jan.trejbal@tremi.cz>

RUN	rm -rf /var/www && \
	mkdir -p /var/www/www

ADD docker/server_base_5.conf /etc/nginx/conf.d/server_base_5.conf

COPY public /var/www/www/

RUN	chown www-data:www-data -R /var/www
