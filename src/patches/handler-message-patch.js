// ═══════════════════════════════════════════════════════════════════════════════
// ApexRevenue CB App — Message Handler Patch
// Add these commands to handler-message.js inside the command switch
// Add AFTER the existing 'theme' command block, BEFORE the final else
// ═══════════════════════════════════════════════════════════════════════════════

// ── /apex sync — Announce fan sync feature ───────────────────────────────────
/*
} else if (sub === 'sync') {
    // /apex sync — broadcast sync instructions to room
    var syncUrl = $settings.syncPageUrl || 'apexrevenue.works/sync';
    var roomSlug = $room.owner || '';
    sendThemedBanner(
        '🔗 DIGITAL SYNC AVAILABLE!\n'
        + 'Sync your Lovense toy and feel every vibe in real time!\n'
        + '1. Download Intiface Central (free): intiface.com/central\n'
        + '2. Visit: ' + syncUrl + '?room=' + roomSlug + '\n'
        + 'Type /sync in chat for personal instructions.'
    );
    apexWhisper(username, 'Sync announcement sent.');
} else if (sub === 'endcontrol') {
    // /apex endcontrol — end active Give Control session
    var activeSession = $kv.get('active_control_session', null);
    if (activeSession) {
        $kv.set('active_control_session', null);

        // Send hidden termination message for Chrome Extension
        $room.sendNotice('[APEX_END_CONTROL]' + JSON.stringify({ otp: activeSession.otp }), {
            toUser: $room.owner,
            color: '#000000',
            bgColor: '#000000'
        });

        sendThemedAnnouncement('🎮 Give Control session ENDED. Toy stopped.');
        apexWhisper(username, 'Control session terminated for ' + activeSession.fan);
    } else {
        apexWhisper(username, 'No active Give Control session.');
    }
} else if (sub === 'extendcontrol') {
    // /apex extendcontrol <secs> — extend active control session
    var extendSecs = parseInt(parts[2]) || 30;
    var session = $kv.get('active_control_session', null);
    if (session) {
        session.duration += extendSecs;
        $kv.set('active_control_session', session);

        $room.sendNotice('[APEX_EXTEND_CONTROL]' + JSON.stringify({
            otp: session.otp,
            extraSecs: extendSecs
        }), {
            toUser: $room.owner,
            color: '#000000',
            bgColor: '#000000'
        });

        sendThemedAnnouncement('🎮 Give Control extended by ' + extendSecs + 's for ' + session.fan + '!');
    } else {
        apexWhisper(username, 'No active Give Control session to extend.');
    }
*/
