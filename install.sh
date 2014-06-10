#!/bin/bash
cd /opt
wget https://github.com/micloud/nomon/archive/master.zip
unzip master.zip
mv nomon-master nomon

cd /opt/nomon
echo "Install nomon to service..."
cp ./nomon /etc/init.d/

echo "Grant executable permission..."
chmod 755 /etc/init.d/nomon

echo "Add symbolic link to rc*.d..."
echo "chkconfig add..."
chkconfig --add nomon

