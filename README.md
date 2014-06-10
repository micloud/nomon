NOMON - Node.js Monitor
====

A lightware web show the current system information that include cpu, memory, disk...

## Install

```
git clone git@github.com:micloud/nomon.git
```

You can change your service port in service.js.

## Start

```
cd nomon
./service.js
```

## Install to init.d

```
cd nomon
./install.sh
```

then, start in initld

```
/etc/init.d/nomon start

or

service nomon start
```

In init.d scrtip, also accept: start|stop|restart|status|log

## Client invoke

nomon server default start at 1337 port, you can request by the following request:

```
$ curl -sS http://107.167.182.43:1337/ | json
{
  "cpu": {
    "p1": 0.29296875,
    "p2": 1.46484375
  },
  "mem": {
    "p1": 6054.33203125,
    "p2": 13058.375,
    "usage": 0.5363640551561737
  },
  "disk": [
    {
      "name": "/dev/disk/by-uuid/677bda0a-ac9f-4a6f-9947-0bc8dceda7de",
      "p1": 3943204,
      "p2": 10320184,
      "usage": 0.3820865984559965
    },
    {
      "name": "/dev/sdb",
      "p1": 14249804,
      "p2": 216744944,
      "usage": 0.065744573954168
    }
  ],
  "uptime": 251901.160023307,
  "hostname": "simon-debian-tw",
  "ts": 1402355871144
}
```

## Change the nomon server listen port

Update the nomon file in download folder and reinstall or update the /etc/init.d/nomon file directly...

```
# Update this block to your prefer port
# In this case, I use port 3000.
export PORT=3000
```

