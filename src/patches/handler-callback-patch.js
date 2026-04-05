// ═══════════════════════════════════════════════════════════════════════════════
// ApexRevenue CB App — Callback Handler Patch (handler-callback.js)
// Add this block to handle Give Control session end and sync announcements
// ═══════════════════════════════════════════════════════════════════════════════

// ADD to the callback handler:

/*
if ($callback.label === 'endGiveControl') {
    var session = $kv.get('active_control_session', null);
    if (session) {
        sendThemedAnnouncement('🎮 Give Control session ended. Thanks ' + session.fan + '! 🔥');
        $kv.set('active_control_session', null);
    }
}

if ($callback.label === 'syncAnnounce') {
    if ($settings.syncEnabled) {
        var syncUrl = $settings.syncPageUrl || 'apexrevenue.works/sync';
        var roomSlug = $room.owner || '';
        sendThemedAnnouncement(
            '🔗 DIGITAL SYNC — Sync your toy and feel every vibe in real time!\n'
            + 'Visit: ' + syncUrl + '?room=' + roomSlug + ' | Type /sync for setup.'
        );
        // Schedule next announcement
        var interval = parseInt($settings.syncAnnounceInterval || '15');
        if (interval > 0) {
            $callback.create('syncAnnounce', interval * 60);
        }
    }
}
*/
