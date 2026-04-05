// ═══════════════════════════════════════════════════════════════════════════════
// ApexRevenue CB App — Tip Handler Patch (handler-tip.js)
// Add this block AFTER the $overlay.emit('apex_tip', ...) call
// and BEFORE $room.reloadPanel()
// ═══════════════════════════════════════════════════════════════════════════════

// ── Give Control Activation ──────────────────────────────────────────────────
// Checks if the tip amount matches the Give Control trigger
// and activates a real-time control session with OTP

/*
// Check for Give Control trigger
if ($settings.giveControlEnabled && tokens === parseInt($settings.giveControlTokens || '0')) {
    var controlDuration = parseInt($settings.giveControlDuration || '60');
    var controlUrl = $settings.controlPageUrl || 'apexrevenue.works/control';

    // Generate 14-char OTP
    var otpChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var otp = '';
    for (var ci = 0; ci < 14; ci++) {
        otp += otpChars.charAt(Math.floor(Math.random() * otpChars.length));
    }

    // Store active session
    $kv.set('active_control_session', {
        otp: otp,
        fan: tipper || 'Anonymous',
        duration: controlDuration,
        startedAt: Date.now()
    });

    // Hidden message for Chrome Extension to intercept
    $room.sendNotice('[APEX_CONTROL_SESSION]' + JSON.stringify({
        otp: otp,
        fan: tipper || 'Anonymous',
        duration: controlDuration,
        room: $room.owner
    }), {
        toUser: $room.owner,
        color: '#000000',
        bgColor: '#000000'
    });

    // Public room announcement
    sendThemedBanner(
        '🎮 ' + (tipper || 'Anonymous') + ' just bought GIVE CONTROL!\n'
        + 'They now control the toy for ' + controlDuration + ' seconds! 🔥'
    );

    // Private whisper to winner with control URL
    $room.sendNotice(
        '🎮 YOU HAVE GIVE CONTROL!\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + 'Visit: ' + controlUrl + '?token=' + otp + '\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + controlDuration + ' seconds of control. Session expires in 5 min.',
        {
            toUser: tipper,
            color: '#FF6B00',
            bgColor: '#000000',
            fontWeight: 'bold'
        }
    );

    // Auto-end announcement
    $callback.create('endGiveControl', controlDuration + 2);
}
*/
