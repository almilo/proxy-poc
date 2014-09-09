#!/bin/sh

openssl genrsa -des3 -passout pass:x -out proxy-mirror.pass.key 2048
echo "Generated proxy-mirror.pass.key"

openssl rsa -passin pass:x -in proxy-mirror.pass.key -out proxy-mirror.key
rm proxy-mirror.pass.key
echo "Generated proxy-mirror.key"

openssl req -new -batch -key proxy-mirror.key -out proxy-mirror.csr -subj /CN=proxy-mirror/emailAddress=fake@mail.com/OU=proxy-mirror/C=PL/O=proxy-mirror
echo "Generated proxy-mirror.csr"

openssl x509 -req -days 365 -in proxy-mirror.csr -signkey proxy-mirror.key -out proxy-mirror.crt
echo "Generated proxy-mirror.crt"
