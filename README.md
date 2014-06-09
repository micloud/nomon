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

```
curl -sS http://107.167.182.43:443/ | json
```
