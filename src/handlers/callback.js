// APEX REVENUE - Callback Handler (v0.3.0)
// *** FULL REPLACEMENT – paste this into the "Callback" handler ***
// v0.3.0: Added event queue processing

if ($callback.label === 'auto_announce') {
  sendRoomAnnouncement();
  $room.reloadPanel();
} else if ($callback.label === 'recurring_banner') {
  sendRecurringBanner();
  $room.reloadPanel();

// ── v0.3.0: Event Queue Processing ─────────────────────────────────────────
} else if ($callback.label === 'processEventQueue') {
  var eventQueue = $kv.get('event_queue', []);
  if (eventQueue.length > 0) {
    var nextEvent = eventQueue.shift();
    $kv.set('event_queue', eventQueue);

    // Fire the toy event via [PS_CMD]
    $room.sendNotice('[PS_CMD]' + JSON.stringify({
      app: 'apexrevenue',
      event: 'queued_trigger',
      pattern: nextEvent.pattern,
      vibe: nextEvent.vibe,
      rotate: 0,
      pump: 0,
      secs: nextEvent.secs,
      fan: nextEvent.fan
    }), {
      toUser: $room.owner,
      color: '#000000',
      bgColor: '#000000'
    });

    $overlay.emit('apex_toy_event', {
      pattern: nextEvent.pattern,
      vibe: nextEvent.vibe,
      secs: nextEvent.secs,
      triggeredBy: nextEvent.fan,
      queued: true
    });

    // If more events in queue, schedule next after this one's duration
    if (eventQueue.length > 0) {
      $callback.create('processEventQueue', nextEvent.secs + 1);
    }
  }

// ── Give Control: Auto-end session ─────────────────────────────────────────
} else if ($callback.label === 'endGiveControl') {
  var session = $kv.get('active_control_session', null);
  if (session) {
    var initialDeposit = parseInt($settings.giveControlTokens || '0');
    var remaining = session.balance || 0;
    var spent = initialDeposit - remaining;
    sendThemedAnnouncement(
        '🎮 Give Control ended — ' + session.fan + ' 🔥\n'
        + 'Tokens spent: ' + Math.max(0, spent) + ' tk | Remaining: ' + remaining + ' tk'
    );
    $kv.set('active_control_session', null);
  }

// ── Digital Sync: Periodic announcement ────────────────────────────────────
} else if ($callback.label === 'syncAnnounce') {
  if ($settings.syncEnabled) {
    var syncUrl = $settings.syncPageUrl || 'apexrevenue.works/sync';
    var roomSlug = $room.owner || '';
    sendThemedAnnouncement(
        '🔗 DIGITAL SYNC — Sync your toy and feel every vibe in real time!\n'
        + 'Visit: ' + syncUrl + '?room=' + roomSlug + ' | Type /apex sync for setup.'
    );
    var interval = parseInt($settings.syncAnnounceInterval || '15');
    if (interval > 0) {
      $callback.create('syncAnnounce', interval * 60);
    }
  }
}
