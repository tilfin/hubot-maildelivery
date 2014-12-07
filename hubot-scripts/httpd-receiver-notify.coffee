# Description:
#   httpd receiver to notify room
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   None
#
# URLS:
#   /hubot/notify

module.exports = (robot) ->
  robot.router.post '/hubot/notify', (req, res) ->
    data = req.body
    robot.messageRoom data.room, data.message
    res.send 'OK'
