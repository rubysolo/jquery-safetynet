/*

jquery.safetynet
https://github.com/rubysolo/jquery-safetynet

Copyright (c) 2012 Solomon White
Licensed under the MIT, GPL licenses.
*/

(function($) {
  var SafetyNet, backupManager;
  SafetyNet = (function() {

    SafetyNet.name = 'SafetyNet';

    function SafetyNet(options) {
      this.options = options != null ? options : {};
      this.pendingRequests = JSON.parse(localStorage.getItem('offline-backups') || '[]');
      window.addEventListener('online', this.submitPendingRequests);
    }

    SafetyNet.prototype.formKey = function(form) {
      return $(form).attr('id') || $(form).attr('action');
    };

    SafetyNet.prototype.saveProgress = function(e) {
      return localStorage.setItem(backupManager.formKey(this), $(this).serialize());
    };

    SafetyNet.prototype.restoreProgress = function(form) {
      var data, key;
      key = backupManager.formKey(form);
      if (data = localStorage.getItem(key)) {
        $(form).deserialize(data);
        return localStorage.removeItem(key);
      }
    };

    SafetyNet.prototype.submitForm = function(e) {
      var key, method, value;
      if (navigator.onLine) {
        return localStorage.removeItem(backupManager.formKey(this));
      } else {
        method = $(this).find('input[name=_method]').val() || $(this).attr('method') || 'get';
        key = "" + ($(this).attr('action')) + ":" + method + ":" + (new Date().getTime());
        value = $(this).serialize();
        backupManager.addPendingRequest(key, value);
        if (backupManager.options.failure) {
          backupManager.options.failure(this);
        }
        return e.preventDefault();
      }
    };

    SafetyNet.prototype.addPendingRequest = function(key, value) {
      localStorage.setItem(key, value);
      backupManager.pendingRequests.push(key);
      return localStorage.setItem('offline-backups', JSON.stringify(backupManager.pendingRequests));
    };

    SafetyNet.prototype.submitPendingRequests = function() {
      var action, data, method, request, _ref,
        _this = this;
      if (request = backupManager.pendingRequests[0]) {
        data = localStorage.getItem(request);
        _ref = request.split(':'), action = _ref[0], method = _ref[1];
        return $.ajax({
          type: method,
          url: action,
          data: data,
          success: function() {
            backupManager.pendingRequests.shift();
            localStorage.setItem('offline-backups', JSON.stringify(backupManager.pendingRequests));
            localStorage.removeItem(request);
            return backupManager.submitPendingRequests();
          }
        });
      } else {
        if (backupManager.options.success) {
          return backupManager.options.success();
        }
      }
    };

    return SafetyNet;

  })();
  backupManager = null;
  return $.fn.safetyNet = function(options) {
    if (typeof Storage !== 'undefined') {
      backupManager = new SafetyNet(options);
      $(this.selector).on('submit', backupManager.submitForm);
      if (options.progressive) {
        $(this.selector).on('change', backupManager.saveProgress);
        return this.each(function() {
          return backupManager.restoreProgress(this);
        });
      }
    }
  };
})(jQuery);
