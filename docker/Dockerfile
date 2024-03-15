FROM wordpress:6.4.3-php8.1-apache

RUN apt-get update 
RUN apt-get install --no-install-recommends -y \
    vim \
    less \
    sudo \
    ; \
    rm -rf /var/lib/apt/lists/*

RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini \
    && sed -i 's/upload_max_filesize.*/upload_max_filesize = 1G/' /usr/local/etc/php/php.ini

