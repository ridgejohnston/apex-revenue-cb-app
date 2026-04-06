/* eslint-disable no-undef */
// APEX REVENUE - Chat Message Transform Handler
// *** FULL REPLACEMENT — paste this into the "Chat Message Transform" handler ***

(function() {
  // Quick exit if transform features are all off
  if (!$settings.moderationEnabled && !$settings.messageStyleEnabled) return;

  var body = $message.body;
  var username = $user.username;
  var isOwner = $user.isOwner;
  var isMod = $user.isMod;
  var isFanclub = $user.inFanclub;
  var originalBody = body;

  // ========================================================================
  // PHASE 1: MODERATION (block/filter/mask before display)
  // ========================================================================
  if ($settings.moderationEnabled && !isOwner && !isMod) {

    // -- 1A. Blocked Keywords --
    var blockedKeywords = parseBlockedKeywords($settings.blockedKeywords);
    if (blockedKeywords.length > 0 && containsBlockedKeyword(body, blockedKeywords)) {
      var blockAction = $settings.blockAction || 'replace';
      if (blockAction === 'hide') {
        $message.setSpam(true);
        logModerationAction(username, 'Blocked keyword (hidden)', originalBody);
        return;
      } else if (blockAction === 'flag') {
        logModerationAction(username, 'Blocked keyword (flagged)', originalBody);
      } else {
        body = censorBlockedKeywords(body, blockedKeywords, $settings.replacementText || '***');
        logModerationAction(username, 'Blocked keyword (censored)', originalBody);
      }
    }

    // -- 1B. Spam Detection --
    if ($settings.spamFilterEnabled) {
      var maxCaps = $settings.maxCapsPercent || 70;
      var maxRepeated = $settings.maxRepeatedChars || 5;
      var spamAction = $settings.spamAction || 'fix';
      var spamResult = isSpamMessage(body, maxCaps, maxRepeated);

      if (spamResult) {
        if (spamAction === 'hide') {
          $message.setSpam(true);
          logModerationAction(username, 'Spam detected: ' + spamResult + ' (hidden)', originalBody);
          return;
        } else {
          body = fixExcessiveCaps(body);
          body = trimRepeatedChars(body, maxRepeated);
        }
      }
    }

    // -- 1C. Link Filter --
    if ($settings.linkFilterEnabled && containsLink(body)) {
      var exempt = false;
      if ($settings.linkFilterExemptTippers) {
        var tipperTotals = $kv.get('session_tipper_totals', {});
        var allTimeTotals = $kv.get('all_time_tipper_totals', {});
        var linkMinTips = $settings.linkFilterMinTips || 50;
        var userLifetimeTips = (tipperTotals[username] || 0) + (allTimeTotals[username] || 0);
        if (userLifetimeTips >= linkMinTips) exempt = true;
      }
      if (isFanclub && $settings.linkFilterExemptFanclub) exempt = true;

      if (!exempt) {
        var linkAction = $settings.linkAction || 'hide';
        if (linkAction === 'hide') {
          $message.setSpam(true);
          logModerationAction(username, 'Link blocked (hidden)', originalBody);
          return;
        } else {
          body = body.replace(/https?:\/\/\S+/gi, '[link removed]');
          body = body.replace(/www\.\S+/gi, '[link removed]');
          logModerationAction(username, 'Link removed', originalBody);
        }
      }
    }

    // -- 1D. Data Masking --
    if ($settings.dataMaskingEnabled) {
      body = maskSensitiveData(body);
    }
  }

  // ========================================================================
  // PHASE 2: MESSAGE STYLING (badges, highlights, formatting)
  // ========================================================================
  if ($settings.messageStyleEnabled) {
    var sessionTips = $kv.get('session_tipper_totals', {});
    var allTimeTips = $kv.get('all_time_tipper_totals', {});
    var hasTipped = !!(sessionTips[username] || allTimeTips[username]);

    var style = getTransformStyle(username, isOwner, isMod, isFanclub, hasTipped);

    if (style.badge) {
      body = style.badge + body;
    }
    if (style.bgColor) {
      $message.setBgColor(style.bgColor);
    }
    if (style.textColor) {
      $message.setColor(style.textColor);
    }
    if (style.fontWeight === 'bold') {
      $message.setFont('bold');
    }
  }

  // ========================================================================
  // PHASE 3: APPLY MODIFIED BODY
  // ========================================================================
  if (body !== originalBody) {
    $message.setBody(body);
  }
})();
