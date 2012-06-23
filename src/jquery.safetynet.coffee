###

jquery.safetynet
https://github.com/rubysolo/jquery-safetynet

Copyright (c) 2012 Solomon White
Licensed under the MIT, GPL licenses.

###

(($) ->

  class SafetyNet
    constructor: (@options={}) ->
      @pendingRequests = JSON.parse(localStorage.getItem('offline-backups') || '[]')
      window.addEventListener 'online', @submitPendingRequests

    formKey: (form) -> $(form).attr('id') || $(form).attr('action')

    saveProgress: (e) ->
      localStorage.setItem(backupManager.formKey(this), $(this).serialize())
      e.stopPropagation()

    restoreProgress: (form) ->
      key = backupManager.formKey(form)
      if data = localStorage.getItem(key)
        $(form).deserialize(data)
        localStorage.removeItem(key)

    submitForm: (e) ->
      if navigator.onLine
        # form will be submitted to server, remove any backup
        localStorage.removeItem(backupManager.formKey(this))
      else
        # network connection lost, store form data in localStorage until we reconnect
        method = $(this).find('input[name=_method]').val() || $(this).attr('method') || 'get'
        key    = "#{ $(this).attr('action') }:#{ method }:#{ new Date().getTime() }"
        value  = $(this).serialize()

        backupManager.addPendingRequest(key, value)
        backupManager.options.failure(this) if backupManager.options.failure

        e.preventDefault()

    addPendingRequest: (key, value) ->
      localStorage.setItem(key, value)
      backupManager.pendingRequests.push(key)
      localStorage.setItem('offline-backups', JSON.stringify(backupManager.pendingRequests))

    submitPendingRequests: ->
      if request = backupManager.pendingRequests[0]
        # submit next request in queue
        data = localStorage.getItem(request)
        [ action, method ] = request.split(':')

        $.ajax
          type: method
          url:  action
          data: data
          success: =>
            backupManager.pendingRequests.shift()
            localStorage.setItem('offline-backups', JSON.stringify(backupManager.pendingRequests))
            localStorage.removeItem(request)
            backupManager.submitPendingRequests()

      else
        # all queued requests submitted, fire success callback
        backupManager.options.success() if backupManager.options.success


  backupManager = null

  $.fn.safetyNet = (options) ->
    if typeof(Storage) isnt 'undefined'
      backupManager = new SafetyNet(options)
      $(this.selector).on 'submit', backupManager.submitForm
      if options.progressive
        $(this.selector).on 'change', backupManager.saveProgress
        this.each -> backupManager.restoreProgress(this)


) jQuery
