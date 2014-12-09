hubot-maildelivery
==================

[![Build Status](https://travis-ci.org/tilfin/hubot-maildelivery.svg?branch=master)](https://travis-ci.org/tilfin/hubot-maildelivery)

mail delivery to room as message by hubot


Install
-------

```
$ cd /usr/local
$ sudo git clone https://github.com/tilfin/hubot-maildelivery.git
$ sudo useradd -b /user/local/hubot-maildelivery -s /bin/false hubotmail
$ sudo chown -R hubotmail:hubotmail hubot-maildelivery
$ cd hubot-maildelivery
$ sudo -u hubotmail -H npm install
```

Deploy receiver script
----------------------

copy receiver script to hubot scripts folder

```
$ cd /usr/local/hubot-maildelivery
$ cp hubot-scripts/httpd-receiver-notify.coffee <hubot folder>/scripts/
```

Setup Postfix
-------------

### Package install and copy config

following example for Ubuntu

```
$ sudo apt-get install -y postfix
$ cp /usr/share/postfix/main.cf.dist /etc/postfix/
$ vi /etc/postfix/main.cf
```

### main.cf

```
default_privs = hubotmail
myhostname = host.yourdomain.tld
mydomain = yourdomain.tld
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
alias_maps = hash:/etc/aliases
sendmail_path = /usr/sbin/sendmail
newaliases_path = /usr/bin/newaliases
mailq_path = /usr/bin/mailq
setgid_group = postdrop
#html_directory =
#manpage_directory =
#sample_directory =
#readme_directory =
```

apply configuration

```
$ sudo service postfix reload
```


### Mail routing

define mail accounts to pipe script

```
$ sudo vi /etc/aliases
```

```
# See man 5 aliases for format
postmaster:    root
general: "|/usr/local/hubot-maildelivery/run.sh"
server:  "|/usr/local/hubot-maildelivery/run.sh"
```

apply new setting

```
$ sudo newaliases
```

Configuration
-------------

### config/default.json

```
{
  "notifyUrl": "http://localhost:8080/hubot/notify",
  "deliveryToRoom": {
    "^general@": "#general",
    "^slack-channel@": "#slackchannel",
    "^hipchat-room@" : "DDDDD_XXXXXX_XXXXX@conf.hipchat.com",
    "^secret@": { "id": "#secret", "mention": "@group" },
    "^admin@": { "id": "EEEEEE_XXXXXX_XXXXX@conf.hipchat.com", "mention": "@all" }
  },
  "logger": {
    "name": "hubot-maildelivery",
    "streams": [{
      "level": "debug",
      "path": "/var/log/hubot-maildelivery.log"
    }]
  }
}
```

_notifyUrl_ is post destination of hubot.
_deliveryToRoom_ is mapping room by To:, for example slack channel, hipchat room.
If you want to add the mention, change the value as an object with _id_ and _mention_.
See [bunyan](https://github.com/trentm/node-bunyan) about _logger_.

### Prepare default log file

```
$ sudo touch /var/log/hubot-maildelivery.log
$ sudo chown hubotmail:hubotmail /var/log/hubot-maildelivery.log
```
