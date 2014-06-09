#!/bin/bash
export LANG=en_US.UTF-8
echo "Install nomon to service..."
cp ./nomon /etc/init.d/

echo "Grant executable permission..."
chmod 755 /etc/init.d/nomon

echo "Add symbolic link to rc*.d..."
echo "chkconfig add..."
chkconfig --add nomon
