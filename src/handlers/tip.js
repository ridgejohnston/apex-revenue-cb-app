// APEX REVENUE - Tip Received Handler (v0.3.0)
// *** FULL REPLACEMENT – paste this into the "Tip Received" handler ***
// v0.3.0: Tip-triggered toy events, event queue, Give Control auto-deduct

var tokens = $tip.tokens;
var tipper = $tip.isAnon ? null : $user.username;

$kv.incr('session_total_tips', tokens);
$kv.incr('session_tip_count');
$kv.incr('all_time_tips', tokens);
$kv.incr('all_time_tip_count');

var currentHighest = $kv.get('session_highest_tip', 0);
if (tokens > currentHighest) {
  $kv.set('session_highest_tip', tokens);
  $kv.set('session_highest_tipper', tipper || 'Anonymous');
}

var tipperTotals = $kv.get('session_tipper_totals', {});
tipperTotals[tipper] = (tipperTotals[tipper] || 0) + tokens;
$kv.set('session_tipper_totals', tipperTotals);

var uniqueTippers = $kv.get('session_unique_tippers', []);
if (uniqueTippers.indexOf(tipper) === -1) {
  uniqueTippers.push(tipper);
  $kv.set('session_unique_tippers', uniqueTippers);
}

var allTimeTotals = $kv.get('all_time_tipper_totals', {});
allTimeTotals[tipper] = (allTimeTotals[tipper] || 0) + tokens;
$kv.set('all_time_tipper_totals', allTimeTotals);

// —— Custom Announcement ————————————————————————————————————————————————————
var sessionTotal = $kv.get('session_total_tips', 0);
sendTipAnnouncement(tipper || 'Anonymous', tokens, sessionTotal, $tip.isAnon);

// —— Notify extension overlay ———————————————————————————————————————————————
$overlay.emit('apex_tip', {
  tokens: tokens,
  tipper: tipper,
  isAnon: $tip.isAnon,
  message: $tip.message,
  sessionTotal: sessionTotal,
  tipperTotal: tipperTotals[tipper] || tokens
});

// ═════════════════════════════════════════════════════════════════════════════
// v0.3.0: TIP-TRIGGERED TOY EVENTS
// Any fan tips the right amount → toy event fires immediately (or queues)
// Works WITHOUT Give Control — this is for everyone in the room
// ═════════════════════════════════════════════════════════════════════════════

var tipEventTriggered = false;

if ($settings.tipEventsEnabled) {
    var eventMap = {
        wave:       { amount: parseInt($settings.waveTipAmount || '15'),       vibe: 12, secs: parseInt($settings.waveDuration || '10'),       label: 'WAVE 🌊' },
        pulse:      { amount: parseInt($settings.pulseTipAmount || '25'),      vibe: 15, secs: parseInt($settings.pulseDuration || '10'),      label: 'PULSE 💓' },
        earthquake: { amount: parseInt($settings.earthquakeTipAmount || '50'), vibe: 20, secs: parseInt($settings.earthquakeDuration || '8'),  label: 'EARTHQUAKE 🌋' },
        max:        { amount: parseInt($settings.maxTipAmount || '100'),       vibe: 20, secs: parseInt($settings.maxDuration || '5'),         label: 'MAX POWER ⚡' }
    };

    var triggeredEvent = null;
    var eventNames = ['wave', 'pulse', 'earthquake', 'max'];
    for (var ei = 0; ei < eventNames.length; ei++) {
        var eName = eventNames[ei];
        if (tokens === eventMap[eName].amount) {
            triggeredEvent = eventMap[eName];
            triggeredEvent.pattern = eName;
            break;
        }
    }

    if (triggeredEvent) {
        tipEventTriggered = true;

        // Send [PS_CMD] for extension to intercept and forward to toy
        var psCmdPayload = {
            app: 'apexrevenue',
            event: 'tip_trigger',
            pattern: triggeredEvent.pattern,
            vibe: triggeredEvent.vibe,
            rotate: 0,
            pump: 0,
            secs: triggeredEvent.secs,
            fan: tipper || 'Anonymous'
        };

        $room.sendNotice('[PS_CMD]' + JSON.stringify(psCmdPayload), {
            toUser: $room.owner,
            color: '#000000',
            bgColor: '#000000'
        });

        // Also emit overlay event for visual feedback
        $overlay.emit('apex_toy_event', {
            pattern: triggeredEvent.pattern,
            vibe: triggeredEvent.vibe,
            secs: triggeredEvent.secs,
            triggeredBy: tipper || 'Anonymous'
        });

        // Event queue: if enabled, store in queue for sequential processing
        if ($settings.eventQueueEnabled) {
            var eventQueue = $kv.get('event_queue', []);
            eventQueue.push({
                pattern: triggeredEvent.pattern,
                vibe: triggeredEvent.vibe,
                secs: triggeredEvent.secs,
                fan: tipper || 'Anonymous',
                queuedAt: Date.now()
            });
            $kv.set('event_queue', eventQueue);

            // If this is the only item, schedule processing; otherwise it'll chain
            if (eventQueue.length === 1) {
                $callback.create('processEventQueue', 0);
            }
        }

        // Public announcement
        sendThemedBanner(
            triggeredEvent.label + ' triggered by ' + (tipper || 'Anonymous') + '!\n'
            + triggeredEvent.secs + ' seconds of ' + triggeredEvent.pattern + ' pattern!'
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// v0.3.0: GIVE CONTROL ACTIVATION
// Fan tips the activation amount → gets a control session with token account
// Their activation tip IS their token account balance
// ═════════════════════════════════════════════════════════════════════════════

if ($settings.giveControlEnabled && !tipEventTriggered
    && tokens === parseInt($settings.giveControlTokens || '0')) {

    var controlDuration = parseInt($settings.giveControlDuration || '60');
    var controlUrl = $settings.controlPageUrl || 'apexrevenue.works/control';
    var tokensPerMin = parseInt($settings.tokensPerExtraMinute || '100');

    // Generate 14-char OTP
    var otpChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var otp = '';
    for (var ci = 0; ci < 14; ci++) {
        otp += otpChars.charAt(Math.floor(Math.random() * otpChars.length));
    }

    // Build event costs from tip_event_settings (shared costs)
    var eventCosts = {
        wave: parseInt($settings.waveTipAmount || '15'),
        pulse: parseInt($settings.pulseTipAmount || '25'),
        earthquake: parseInt($settings.earthquakeTipAmount || '50'),
        max: parseInt($settings.maxTipAmount || '100')
    };

    // Event durations from settings
    var eventDurations = {
        wave: parseInt($settings.waveDuration || '10'),
        pulse: parseInt($settings.pulseDuration || '10'),
        earthquake: parseInt($settings.earthquakeDuration || '8'),
        max: parseInt($settings.maxDuration || '5')
    };

    // Store active session — balance = the activation tip amount
    $kv.set('active_control_session', {
        otp: otp,
        fan: tipper || 'Anonymous',
        duration: controlDuration,
        startedAt: Date.now(),
        balance: tokens,
        eventCosts: eventCosts,
        eventDurations: eventDurations,
        tokensPerMinute: tokensPerMin
    });

    // Hidden message for Chrome Extension → relay → fan control page
    $room.sendNotice('[APEX_CONTROL_SESSION]' + JSON.stringify({
        otp: otp,
        fan: tipper || 'Anonymous',
        duration: controlDuration,
        room: $room.owner,
        balance: tokens,
        eventCosts: eventCosts,
        eventDurations: eventDurations,
        tokensPerMinute: tokensPerMin
    }), {
        toUser: $room.owner,
        color: '#000000',
        bgColor: '#000000'
    });

    // Public room announcement
    sendThemedBanner(
        '🎮 ' + (tipper || 'Anonymous') + ' just bought GIVE CONTROL!\n'
        + controlDuration + 's of control | Token account: ' + tokens + ' tk\n'
        + 'Wave: ' + eventCosts.wave + 'tk | Pulse: ' + eventCosts.pulse + 'tk | Quake: ' + eventCosts.earthquake + 'tk | Max: ' + eventCosts.max + 'tk 🔥'
    );

    // Private whisper with control URL
    $room.sendNotice(
        '🎮 YOU HAVE GIVE CONTROL!\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + 'Open: ' + controlUrl + '?token=' + otp + '\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + 'Token account: ' + tokens + ' tk\n'
        + 'Clicking event buttons auto-tips the cost!\n'
        + 'Tip more tokens to add time & reload your account.',
        {
            toUser: tipper,
            color: '#FF6B00',
            bgColor: '#000000',
            fontWeight: 'bold'
        }
    );

    $callback.create('endGiveControl', controlDuration + 2);
}

// ═════════════════════════════════════════════════════════════════════════════
// v0.3.0: ADDITIONAL TIPS DURING ACTIVE CONTROL SESSION
// Same fan tips again → tokens add to their account + extends time
// ═════════════════════════════════════════════════════════════════════════════

var activeSession = $kv.get('active_control_session', null);
if (activeSession && tipper && tipper === activeSession.fan
    && tokens !== parseInt($settings.giveControlTokens || '0')
    && !tipEventTriggered) {

    // Add tokens to account balance
    activeSession.balance = (activeSession.balance || 0) + tokens;

    // Calculate extra time
    var tpm = activeSession.tokensPerMinute || parseInt($settings.tokensPerExtraMinute || '100');
    var extraSecs = Math.floor((tokens / tpm) * 60);
    if (extraSecs < 10) extraSecs = 10;
    activeSession.duration += extraSecs;

    $kv.set('active_control_session', activeSession);

    // Balance update → extension → relay → fan's control page
    $room.sendNotice('[APEX_CONTROL_BALANCE]' + JSON.stringify({
        otp: activeSession.otp,
        balance: activeSession.balance,
        addedTokens: tokens,
        extraSecs: extraSecs
    }), {
        toUser: $room.owner,
        color: '#000000',
        bgColor: '#000000'
    });

    // Extend session timer
    $room.sendNotice('[APEX_EXTEND_CONTROL]' + JSON.stringify({
        otp: activeSession.otp,
        extraSecs: extraSecs
    }), {
        toUser: $room.owner,
        color: '#000000',
        bgColor: '#000000'
    });

    sendThemedAnnouncement(
        '🎮 ' + tipper + ' reloaded +' + tokens + ' tk!\n'
        + 'Account: ' + activeSession.balance + ' tk | +' + extraSecs + 's time'
    );

    $room.sendNotice(
        '🎮 ACCOUNT RELOADED!\n'
        + '+' + tokens + ' tk → Balance: ' + activeSession.balance + ' tk\n'
        + '+' + extraSecs + 's added to session!',
        {
            toUser: tipper,
            color: '#6aff6a',
            bgColor: '#000000',
            fontWeight: 'bold'
        }
    );
}

$room.reloadPanel();
