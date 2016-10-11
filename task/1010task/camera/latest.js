!function (e) {
    if ("function" == typeof bootstrap)bootstrap("simplewebrtc", e); else if ("object" == typeof exports)module.exports = e(); else if ("function" == typeof define && define.amd)define(e); else if ("undefined" != typeof ses) {
        if (!ses.ok())return;
        ses.makeSimpleWebRTC = e
    } else"undefined" != typeof window ? window.SimpleWebRTC = e() : global.SimpleWebRTC = e()
}(function () {
    var define, ses, bootstrap, module, exports;
    return function (e, t, n) {
        function o(n, r) {
            if (!t[n]) {
                if (!e[n]) {
                    var a = "function" == typeof require && require;
                    if (!r && a)return a(n, !0);
                    if (i)return i(n, !0);
                    throw new Error("Cannot find module '" + n + "'")
                }
                var s = t[n] = {exports: {}};
                e[n][0].call(s.exports, function (t) {
                    var i = e[n][1][t];
                    return o(i ? i : t)
                }, s, s.exports)
            }
            return t[n].exports
        }

        for (var i = "function" == typeof require && require, r = 0; r < n.length; r++)o(n[r]);
        return o
    }({
        1: [function (e, t) {
            function n(e) {
                var t, n, u = this, d = e || {}, p = this.config = {
                    url: "https://signaling.simplewebrtc.com:443/",
                    socketio: {},
                    connection: null,
                    debug: !1,
                    localVideoEl: "",
                    remoteVideosEl: "",
                    enableDataChannels: !0,
                    autoRequestMedia: !1,
                    autoRemoveVideos: !0,
                    adjustPeerVolume: !0,
                    peerVolumeWhenSpeaking: .25,
                    media: {video: !0, audio: !0},
                    receiveMedia: {mandatory: {OfferToReceiveAudio: !0, OfferToReceiveVideo: !0}},
                    localVideo: {autoplay: !0, mirror: !0, muted: !0}
                };
                this.logger = function () {
                    return e.debug ? e.logger || console : e.logger || s
                }();
                for (t in d)this.config[t] = d[t];
                this.capabilities = r, i.call(this), n = this.connection = null === this.config.connection ? new c(this.config) : this.config.connection, n.on("connect", function () {
                    u.emit("connectionReady", n.getSessionid()), u.sessionReady = !0, u.testReadiness()
                }), n.on("message", function (e) {
                    var t, n = u.webrtc.getPeers(e.from, e.roomType);
                    "offer" === e.type ? (n.length && n.forEach(function (n) {
                        n.sid == e.sid && (t = n)
                    }), t || (t = u.webrtc.createPeer({
                        id: e.from,
                        sid: e.sid,
                        type: e.roomType,
                        enableDataChannels: u.config.enableDataChannels && "screen" !== e.roomType,
                        sharemyscreen: "screen" === e.roomType && !e.broadcaster,
                        broadcaster: "screen" !== e.roomType || e.broadcaster ? null : u.connection.getSessionid()
                    }), u.emit("createdPeer", t)), t.handleMessage(e)) : n.length && n.forEach(function (t) {
                        e.sid ? t.sid === e.sid && t.handleMessage(e) : t.handleMessage(e)
                    })
                }), n.on("remove", function (e) {
                    e.id !== u.connection.getSessionid() && u.webrtc.removePeers(e.id, e.type)
                }), e.logger = this.logger, e.debug = !1, this.webrtc = new o(e), ["mute", "unmute", "pauseVideo", "resumeVideo", "pause", "resume", "sendToAll", "sendDirectlyToAll", "getPeers"].forEach(function (e) {
                    u[e] = u.webrtc[e].bind(u.webrtc)
                }), this.webrtc.on("*", function () {
                    u.emit.apply(u, arguments)
                }), p.debug && this.on("*", this.logger.log.bind(this.logger, "SimpleWebRTC event:")), this.webrtc.on("localStream", function () {
                    u.testReadiness()
                }), this.webrtc.on("message", function (e) {
                    u.connection.emit("message", e)
                }), this.webrtc.on("peerStreamAdded", this.handlePeerStreamAdded.bind(this)), this.webrtc.on("peerStreamRemoved", this.handlePeerStreamRemoved.bind(this)), this.config.adjustPeerVolume && (this.webrtc.on("speaking", this.setVolumeForAll.bind(this, this.config.peerVolumeWhenSpeaking)), this.webrtc.on("stoppedSpeaking", this.setVolumeForAll.bind(this, 1))), n.on("stunservers", function (e) {
                    u.emit("stunservers", e)
                }), n.on("turnservers", function (e) {
                    u.emit("turnservers", e)
                }), this.webrtc.on("iceFailed", function () {
                }), this.webrtc.on("connectivityError", function () {
                }), this.webrtc.on("audioOn", function () {
                    u.webrtc.sendToAll("unmute", {name: "audio"})
                }), this.webrtc.on("audioOff", function () {
                    u.webrtc.sendToAll("mute", {name: "audio"})
                }), this.webrtc.on("videoOn", function () {
                    u.webrtc.sendToAll("unmute", {name: "video"})
                }), this.webrtc.on("videoOff", function () {
                    u.webrtc.sendToAll("mute", {name: "video"})
                }), this.webrtc.on("localScreen", function (e) {
                    var t = document.createElement("video"), n = u.getRemoteVideoContainer();
                    t.oncontextmenu = function () {
                        return !1
                    }, t.id = "localScreen", a(e, t), n && n.appendChild(t), u.emit("localScreenAdded", t), u.connection.emit("shareScreen"), u.webrtc.peers.forEach(function (e) {
                        var t;
                        "video" === e.type && (t = u.webrtc.createPeer({
                            id: e.id,
                            type: "screen",
                            sharemyscreen: !0,
                            enableDataChannels: !1,
                            receiveMedia: {mandatory: {OfferToReceiveAudio: !1, OfferToReceiveVideo: !1}},
                            broadcaster: u.connection.getSessionid()
                        }), u.emit("createdPeer", t), t.start())
                    })
                }), this.webrtc.on("localScreenStopped", function () {
                    u.stopScreenShare()
                }), this.webrtc.on("channelMessage", function (e, t, n) {
                    "volume" == n.type && u.emit("remoteVolumeChange", e, n.volume)
                }), this.config.autoRequestMedia && this.startLocalVideo()
            }

            var o = e("./webrtc"), i = e("wildemitter"), r = e("webrtcsupport"), a = e("attachmediastream"), s = e("mockconsole"), c = e("./socketioconnection");
            n.prototype = Object.create(i.prototype, {constructor: {value: n}}), n.prototype.leaveRoom = function () {
                this.roomName && (this.connection.emit("leave"), this.webrtc.peers.forEach(function (e) {
                    e.end()
                }), this.getLocalScreen() && this.stopScreenShare(), this.emit("leftRoom", this.roomName), this.roomName = void 0)
            }, n.prototype.disconnect = function () {
                this.connection.disconnect(), delete this.connection
            }, n.prototype.handlePeerStreamAdded = function (e) {
                var t = this, n = this.getRemoteVideoContainer(), o = a(e.stream);
                e.videoEl = o, o.id = this.getDomId(e), n && n.appendChild(o), this.emit("videoAdded", o, e), window.setTimeout(function () {
                    t.webrtc.isAudioEnabled() || e.send("mute", {name: "audio"}), t.webrtc.isVideoEnabled() || e.send("mute", {name: "video"})
                }, 250)
            }, n.prototype.handlePeerStreamRemoved = function (e) {
                var t = this.getRemoteVideoContainer(), n = e.videoEl;
                this.config.autoRemoveVideos && t && n && t.removeChild(n), n && this.emit("videoRemoved", n, e)
            }, n.prototype.getDomId = function (e) {
                return [e.id, e.type, e.broadcaster ? "broadcasting" : "incoming"].join("_")
            }, n.prototype.setVolumeForAll = function (e) {
                this.webrtc.peers.forEach(function (t) {
                    t.videoEl && (t.videoEl.volume = e)
                })
            }, n.prototype.joinRoom = function (e, t) {
                var n = this;
                this.roomName = e, this.connection.emit("join", e, function (o, i) {
                    if (o)n.emit("error", o); else {
                        var r, a, s, c;
                        for (r in i.clients) {
                            a = i.clients[r];
                            for (s in a)a[s] && (c = n.webrtc.createPeer({
                                id: r,
                                type: s,
                                enableDataChannels: n.config.enableDataChannels && "screen" !== s,
                                receiveMedia: {
                                    mandatory: {
                                        OfferToReceiveAudio: "screen" !== s && n.config.receiveMedia.mandatory.OfferToReceiveAudio,
                                        OfferToReceiveVideo: n.config.receiveMedia.mandatory.OfferToReceiveVideo
                                    }
                                }
                            }), n.emit("createdPeer", c), c.start())
                        }
                    }
                    t && t(o, i), n.emit("joinedRoom", e)
                })
            }, n.prototype.getEl = function (e) {
                return "string" == typeof e ? document.getElementById(e) : e
            }, n.prototype.startLocalVideo = function () {
                var e = this;
                this.webrtc.startLocalMedia(this.config.media, function (t, n) {
                    t ? e.emit("localMediaError", t) : a(n, e.getLocalVideoContainer(), e.config.localVideo)
                })
            }, n.prototype.stopLocalVideo = function () {
                this.webrtc.stopLocalMedia()
            }, n.prototype.getLocalVideoContainer = function () {
                var e = this.getEl(this.config.localVideoEl);
                if (e && "VIDEO" === e.tagName)return e.oncontextmenu = function () {
                    return !1
                }, e;
                if (e) {
                    var t = document.createElement("video");
                    return t.oncontextmenu = function () {
                        return !1
                    }, e.appendChild(t), t
                }
            }, n.prototype.getRemoteVideoContainer = function () {
                return this.getEl(this.config.remoteVideosEl)
            }, n.prototype.shareScreen = function (e) {
                this.webrtc.startScreenShare(e)
            }, n.prototype.getLocalScreen = function () {
                return this.webrtc.localScreen
            }, n.prototype.stopScreenShare = function () {
                this.connection.emit("unshareScreen");
                var e = document.getElementById("localScreen"), t = this.getRemoteVideoContainer(), n = this.getLocalScreen();
                this.config.autoRemoveVideos && t && e && t.removeChild(e), e && this.emit("videoRemoved", e), n && n.stop(), this.webrtc.peers.forEach(function (e) {
                    e.broadcaster && e.end()
                })
            }, n.prototype.testReadiness = function () {
                var e = this;
                this.webrtc.localStream && this.sessionReady && e.emit("readyToCall", e.connection.getSessionid())
            }, n.prototype.createRoom = function (e, t) {
                2 === arguments.length ? this.connection.emit("create", e, t) : this.connection.emit("create", e)
            }, n.prototype.sendFile = function () {
                return r.dataChannel ? void 0 : this.emit("error", new Error("DataChannelNotSupported"))
            }, t.exports = n
        }, {
            "./socketioconnection": 3,
            "./webrtc": 2,
            attachmediastream: 5,
            mockconsole: 7,
            webrtcsupport: 6,
            wildemitter: 4
        }],
        4: [function (e, t) {
            function n() {
                this.isWildEmitter = !0, this.callbacks = {}
            }

            t.exports = n, n.prototype.on = function (e) {
                var t = 3 === arguments.length, n = t ? arguments[1] : void 0, o = t ? arguments[2] : arguments[1];
                return o._groupName = n, (this.callbacks[e] = this.callbacks[e] || []).push(o), this
            }, n.prototype.once = function (e) {
                function t() {
                    n.off(e, t), r.apply(this, arguments)
                }

                var n = this, o = 3 === arguments.length, i = o ? arguments[1] : void 0, r = o ? arguments[2] : arguments[1];
                return this.on(e, i, t), this
            }, n.prototype.releaseGroup = function (e) {
                var t, n, o, i;
                for (t in this.callbacks)for (i = this.callbacks[t], n = 0, o = i.length; o > n; n++)i[n]._groupName === e && (i.splice(n, 1), n--, o--);
                return this
            }, n.prototype.off = function (e, t) {
                var n, o = this.callbacks[e];
                return o ? 1 === arguments.length ? (delete this.callbacks[e], this) : (n = o.indexOf(t), o.splice(n, 1), 0 === o.length && delete this.callbacks[e], this) : this
            }, n.prototype.emit = function (e) {
                var t, n, o, i = [].slice.call(arguments, 1), r = this.callbacks[e], a = this.getWildcardCallbacks(e);
                if (r)for (o = r.slice(), t = 0, n = o.length; n > t && o[t]; ++t)o[t].apply(this, i);
                if (a)for (n = a.length, o = a.slice(), t = 0, n = o.length; n > t && o[t]; ++t)o[t].apply(this, [e].concat(i));
                return this
            }, n.prototype.getWildcardCallbacks = function (e) {
                var t, n, o = [];
                for (t in this.callbacks)n = t.split("*"), ("*" === t || 2 === n.length && e.slice(0, n[0].length) === n[0]) && (o = o.concat(this.callbacks[t]));
                return o
            }
        }, {}],
        6: [function (e, t) {
            var n, o;
            window.mozRTCPeerConnection || navigator.mozGetUserMedia ? (n = "moz", o = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10)) : (window.webkitRTCPeerConnection || navigator.webkitGetUserMedia) && (n = "webkit", o = navigator.userAgent.match(/Chrom(e|ium)/) && parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10));
            var i = window.mozRTCPeerConnection || window.webkitRTCPeerConnection, r = window.mozRTCIceCandidate || window.RTCIceCandidate, a = window.mozRTCSessionDescription || window.RTCSessionDescription, s = window.webkitMediaStream || window.MediaStream, c = "https:" === window.location.protocol && ("webkit" === n && o >= 26 || "moz" === n && o >= 33), u = window.AudioContext || window.webkitAudioContext, d = document.createElement("video"), p = d && d.canPlayType && "probably" === d.canPlayType('video/webm; codecs="vp8", vorbis'), l = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia;
            t.exports = {
                prefix: n,
                browserVersion: o,
                support: !!i && p && !!l,
                supportRTCPeerConnection: !!i,
                supportVp8: p,
                supportGetUserMedia: !!l,
                supportDataChannel: !!(i && i.prototype && i.prototype.createDataChannel),
                supportWebAudio: !(!u || !u.prototype.createMediaStreamSource),
                supportMediaStream: !(!s || !s.prototype.removeTrack),
                supportScreenSharing: !!c,
                dataChannel: !!(i && i.prototype && i.prototype.createDataChannel),
                webAudio: !(!u || !u.prototype.createMediaStreamSource),
                mediaStream: !(!s || !s.prototype.removeTrack),
                screenSharing: !!c,
                AudioContext: u,
                PeerConnection: i,
                SessionDescription: a,
                IceCandidate: r,
                MediaStream: s,
                getUserMedia: l
            }
        }, {}],
        7: [function (e, t) {
            for (var n = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), o = n.length, i = function () {
            }, r = {}; o--;)r[n[o]] = i;
            t.exports = r
        }, {}],
        5: [function (e, t) {
            t.exports = function (e, t, n) {
                var o, i = window.URL, r = {
                    autoplay: !0,
                    mirror: !1,
                    muted: !1
                }, a = t || document.createElement("video");
                if (n)for (o in n)r[o] = n[o];
                if (r.autoplay && (a.autoplay = "autoplay"), r.muted && (a.muted = !0), r.mirror && ["", "moz", "webkit", "o", "ms"].forEach(function (e) {
                        var t = e ? e + "Transform" : "transform";
                        a.style[t] = "scaleX(-1)"
                    }), i && i.createObjectURL)a.src = i.createObjectURL(e); else if (a.srcObject)a.srcObject = e; else {
                    if (!a.mozSrcObject)return !1;
                    a.mozSrcObject = e
                }
                return a
            }
        }, {}],
        3: [function (e, t) {
            function n(e) {
                this.connection = o.connect(e.url, e.socketio)
            }

            var o = e("socket.io-client");
            n.prototype.on = function (e, t) {
                this.connection.on(e, t)
            }, n.prototype.emit = function () {
                this.connection.emit.apply(this.connection, arguments)
            }, n.prototype.getSessionid = function () {
                return this.connection.socket.sessionid
            }, n.prototype.disconnect = function () {
                return this.connection.disconnect()
            }, t.exports = n
        }, {"socket.io-client": 8}],
        2: [function (e, t) {
            function n(e) {
                var t = this, n = e || {};
                this.config = {
                    debug: !1,
                    peerConnectionConfig: {iceServers: [{url: "stun:stun.l.google.com:19302"}]},
                    peerConnectionConstraints: {optional: [{DtlsSrtpKeyAgreement: !0}]},
                    receiveMedia: {mandatory: {OfferToReceiveAudio: !0, OfferToReceiveVideo: !0}},
                    enableDataChannels: !0
                };
                var o;
                this.screenSharingSupport = i.screenSharing, this.logger = function () {
                    return e.debug ? e.logger || console : e.logger || r
                }();
                for (o in n)this.config[o] = n[o];
                i.support || this.logger.error("Your browser doesn't seem to support WebRTC"), this.peers = [], a.call(this, this.config), this.on("speaking", function () {
                    t.hardMuted || t.peers.forEach(function (e) {
                        if (e.enableDataChannels) {
                            var t = e.getDataChannel("hark");
                            if ("open" != t.readyState)return;
                            t.send(JSON.stringify({type: "speaking"}))
                        }
                    })
                }), this.on("stoppedSpeaking", function () {
                    t.hardMuted || t.peers.forEach(function (e) {
                        if (e.enableDataChannels) {
                            var t = e.getDataChannel("hark");
                            if ("open" != t.readyState)return;
                            t.send(JSON.stringify({type: "stoppedSpeaking"}))
                        }
                    })
                }), this.on("volumeChange", function (e) {
                    t.hardMuted || t.peers.forEach(function (t) {
                        if (t.enableDataChannels) {
                            var n = t.getDataChannel("hark");
                            if ("open" != n.readyState)return;
                            n.send(JSON.stringify({type: "volume", volume: e}))
                        }
                    })
                }), this.config.debug && this.on("*", function (e, n, o) {
                    var i;
                    i = t.config.logger === r ? console : t.logger, i.log("event:", e, n, o)
                })
            }

            var o = e("util"), i = e("webrtcsupport");
            e("wildemitter");
            var r = e("mockconsole"), a = e("localmedia"), s = e("./peer");
            o.inherits(n, a), n.prototype.createPeer = function (e) {
                var t;
                return e.parent = this, t = new s(e), this.peers.push(t), t
            }, n.prototype.removePeers = function (e, t) {
                this.getPeers(e, t).forEach(function (e) {
                    e.end()
                })
            }, n.prototype.getPeers = function (e, t) {
                return this.peers.filter(function (n) {
                    return !(e && n.id !== e || t && n.type !== t)
                })
            }, n.prototype.sendToAll = function (e, t) {
                this.peers.forEach(function (n) {
                    n.send(e, t)
                })
            }, n.prototype.sendDirectlyToAll = function (e, t, n) {
                this.peers.forEach(function (o) {
                    o.enableDataChannels && o.sendDirectly(e, t, n)
                })
            }, t.exports = n
        }, {"./peer": 10, localmedia: 11, mockconsole: 7, util: 9, webrtcsupport: 6, wildemitter: 4}],
        9: [function (e, t, n) {
            function o(e) {
                return Array.isArray(e) || "object" == typeof e && "[object Array]" === Object.prototype.toString.call(e)
            }

            function i(e) {
                "object" == typeof e && "[object RegExp]" === Object.prototype.toString.call(e)
            }

            function r(e) {
                return "object" == typeof e && "[object Date]" === Object.prototype.toString.call(e)
            }

            e("events"), n.isArray = o, n.isDate = function (e) {
                return "[object Date]" === Object.prototype.toString.call(e)
            }, n.isRegExp = function (e) {
                return "[object RegExp]" === Object.prototype.toString.call(e)
            }, n.print = function () {
            }, n.puts = function () {
            }, n.debug = function () {
            }, n.inspect = function (e, t, c, u) {
                function d(e, c) {
                    if (e && "function" == typeof e.inspect && e !== n && (!e.constructor || e.constructor.prototype !== e))return e.inspect(c);
                    switch (typeof e) {
                        case"undefined":
                            return l("undefined", "undefined");
                        case"string":
                            var u = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                            return l(u, "string");
                        case"number":
                            return l("" + e, "number");
                        case"boolean":
                            return l("" + e, "boolean")
                    }
                    if (null === e)return l("null", "null");
                    var f = a(e), h = t ? s(e) : f;
                    if ("function" == typeof e && 0 === h.length) {
                        if (i(e))return l("" + e, "regexp");
                        var m = e.name ? ": " + e.name : "";
                        return l("[Function" + m + "]", "special")
                    }
                    if (r(e) && 0 === h.length)return l(e.toUTCString(), "date");
                    var g, v, y;
                    if (o(e) ? (v = "Array", y = ["[", "]"]) : (v = "Object", y = ["{", "}"]), "function" == typeof e) {
                        var b = e.name ? ": " + e.name : "";
                        g = i(e) ? " " + e : " [Function" + b + "]"
                    } else g = "";
                    if (r(e) && (g = " " + e.toUTCString()), 0 === h.length)return y[0] + g + y[1];
                    if (0 > c)return i(e) ? l("" + e, "regexp") : l("[Object]", "special");
                    p.push(e);
                    var w = h.map(function (t) {
                        var n, i;
                        if (e.__lookupGetter__ && (e.__lookupGetter__(t) ? i = e.__lookupSetter__(t) ? l("[Getter/Setter]", "special") : l("[Getter]", "special") : e.__lookupSetter__(t) && (i = l("[Setter]", "special"))), f.indexOf(t) < 0 && (n = "[" + t + "]"), i || (p.indexOf(e[t]) < 0 ? (i = null === c ? d(e[t]) : d(e[t], c - 1), i.indexOf("\n") > -1 && (i = o(e) ? i.split("\n").map(function (e) {
                                return "  " + e
                            }).join("\n").substr(2) : "\n" + i.split("\n").map(function (e) {
                                return "   " + e
                            }).join("\n"))) : i = l("[Circular]", "special")), "undefined" == typeof n) {
                            if ("Array" === v && t.match(/^\d+$/))return i;
                            n = JSON.stringify("" + t), n.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (n = n.substr(1, n.length - 2), n = l(n, "name")) : (n = n.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), n = l(n, "string"))
                        }
                        return n + ": " + i
                    });
                    p.pop();
                    var S = 0, k = w.reduce(function (e, t) {
                        return S++, t.indexOf("\n") >= 0 && S++, e + t.length + 1
                    }, 0);
                    return w = k > 50 ? y[0] + ("" === g ? "" : g + "\n ") + " " + w.join(",\n  ") + " " + y[1] : y[0] + g + " " + w.join(", ") + " " + y[1]
                }

                var p = [], l = function (e, t) {
                    var n = {
                        bold: [1, 22],
                        italic: [3, 23],
                        underline: [4, 24],
                        inverse: [7, 27],
                        white: [37, 39],
                        grey: [90, 39],
                        black: [30, 39],
                        blue: [34, 39],
                        cyan: [36, 39],
                        green: [32, 39],
                        magenta: [35, 39],
                        red: [31, 39],
                        yellow: [33, 39]
                    }, o = {
                        special: "cyan",
                        number: "blue",
                        "boolean": "yellow",
                        undefined: "grey",
                        "null": "bold",
                        string: "green",
                        date: "magenta",
                        regexp: "red"
                    }[t];
                    return o ? "[" + n[o][0] + "m" + e + "[" + n[o][1] + "m" : e
                };
                return u || (l = function (e) {
                    return e
                }), d(e, "undefined" == typeof c ? 2 : c)
            }, n.log = function () {
            }, n.pump = null;
            var a = Object.keys || function (e) {
                    var t = [];
                    for (var n in e)t.push(n);
                    return t
                }, s = Object.getOwnPropertyNames || function (e) {
                    var t = [];
                    for (var n in e)Object.hasOwnProperty.call(e, n) && t.push(n);
                    return t
                }, c = Object.create || function (e, t) {
                    var n;
                    if (null === e)n = {__proto__: null}; else {
                        if ("object" != typeof e)throw new TypeError("typeof prototype[" + typeof e + "] != 'object'");
                        var o = function () {
                        };
                        o.prototype = e, n = new o, n.__proto__ = e
                    }
                    return "undefined" != typeof t && Object.defineProperties && Object.defineProperties(n, t), n
                };
            n.inherits = function (e, t) {
                e.super_ = t, e.prototype = c(t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                })
            };
            var u = /%[sdj%]/g;
            n.format = function (e) {
                if ("string" != typeof e) {
                    for (var t = [], o = 0; o < arguments.length; o++)t.push(n.inspect(arguments[o]));
                    return t.join(" ")
                }
                for (var o = 1, i = arguments, r = i.length, a = String(e).replace(u, function (e) {
                    if ("%%" === e)return "%";
                    if (o >= r)return e;
                    switch (e) {
                        case"%s":
                            return String(i[o++]);
                        case"%d":
                            return Number(i[o++]);
                        case"%j":
                            return JSON.stringify(i[o++]);
                        default:
                            return e
                    }
                }), s = i[o]; r > o; s = i[++o])a += null === s || "object" != typeof s ? " " + s : " " + n.inspect(s);
                return a
            }
        }, {events: 12}],
        8: [function (require, module, exports) {
            var io = "undefined" == typeof module ? {} : module.exports;
            !function () {
                if (function (e, t) {
                        var n = e;
                        n.version = "0.9.16", n.protocol = 1, n.transports = [], n.j = [], n.sockets = {}, n.connect = function (e, o) {
                            var i, r, a = n.util.parseUri(e);
                            t && t.location && (a.protocol = a.protocol || t.location.protocol.slice(0, -1), a.host = a.host || (t.document ? t.document.domain : t.location.hostname), a.port = a.port || t.location.port), i = n.util.uniqueUri(a);
                            var s = {
                                host: a.host,
                                secure: "https" == a.protocol,
                                port: a.port || ("https" == a.protocol ? 443 : 80),
                                query: a.query || ""
                            };
                            return n.util.merge(s, o), (s["force new connection"] || !n.sockets[i]) && (r = new n.Socket(s)), !s["force new connection"] && r && (n.sockets[i] = r), r = r || n.sockets[i], r.of(a.path.length > 1 ? a.path : "")
                        }
                    }("object" == typeof module ? module.exports : this.io = {}, this), function (e, t) {
                        var n = e.util = {}, o = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, i = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
                        n.parseUri = function (e) {
                            for (var t = o.exec(e || ""), n = {}, r = 14; r--;)n[i[r]] = t[r] || "";
                            return n
                        }, n.uniqueUri = function (e) {
                            var n = e.protocol, o = e.host, i = e.port;
                            return "document" in t ? (o = o || document.domain, i = i || ("https" == n && "https:" !== document.location.protocol ? 443 : document.location.port)) : (o = o || "localhost", i || "https" != n || (i = 443)), (n || "http") + "://" + o + ":" + (i || 80)
                        }, n.query = function (e, t) {
                            var o = n.chunkQuery(e || ""), i = [];
                            n.merge(o, n.chunkQuery(t || ""));
                            for (var r in o)o.hasOwnProperty(r) && i.push(r + "=" + o[r]);
                            return i.length ? "?" + i.join("&") : ""
                        }, n.chunkQuery = function (e) {
                            for (var t, n = {}, o = e.split("&"), i = 0, r = o.length; r > i; ++i)t = o[i].split("="), t[0] && (n[t[0]] = t[1]);
                            return n
                        };
                        var r = !1;
                        n.load = function (e) {
                            return "document" in t && "complete" === document.readyState || r ? e() : (n.on(t, "load", e, !1), void 0)
                        }, n.on = function (e, t, n, o) {
                            e.attachEvent ? e.attachEvent("on" + t, n) : e.addEventListener && e.addEventListener(t, n, o)
                        }, n.request = function (e) {
                            if (e && "undefined" != typeof XDomainRequest && !n.ua.hasCORS)return new XDomainRequest;
                            if ("undefined" != typeof XMLHttpRequest && (!e || n.ua.hasCORS))return new XMLHttpRequest;
                            if (!e)try {
                                return new (window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                            } catch (t) {
                            }
                            return null
                        }, "undefined" != typeof window && n.load(function () {
                            r = !0
                        }), n.defer = function (e) {
                            return n.ua.webkit && "undefined" == typeof importScripts ? (n.load(function () {
                                setTimeout(e, 100)
                            }), void 0) : e()
                        }, n.merge = function (e, t, o, i) {
                            var r, a = i || [], s = "undefined" == typeof o ? 2 : o;
                            for (r in t)t.hasOwnProperty(r) && n.indexOf(a, r) < 0 && ("object" == typeof e[r] && s ? n.merge(e[r], t[r], s - 1, a) : (e[r] = t[r], a.push(t[r])));
                            return e
                        }, n.mixin = function (e, t) {
                            n.merge(e.prototype, t.prototype)
                        }, n.inherit = function (e, t) {
                            function n() {
                            }

                            n.prototype = t.prototype, e.prototype = new n
                        }, n.isArray = Array.isArray || function (e) {
                                return "[object Array]" === Object.prototype.toString.call(e)
                            }, n.intersect = function (e, t) {
                            for (var o = [], i = e.length > t.length ? e : t, r = e.length > t.length ? t : e, a = 0, s = r.length; s > a; a++)~n.indexOf(i, r[a]) && o.push(r[a]);
                            return o
                        }, n.indexOf = function (e, t, n) {
                            for (var o = e.length, n = 0 > n ? 0 > n + o ? 0 : n + o : n || 0; o > n && e[n] !== t; n++);
                            return n >= o ? -1 : n
                        }, n.toArray = function (e) {
                            for (var t = [], n = 0, o = e.length; o > n; n++)t.push(e[n]);
                            return t
                        }, n.ua = {}, n.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function () {
                                try {
                                    var e = new XMLHttpRequest
                                } catch (t) {
                                    return !1
                                }
                                return void 0 != e.withCredentials
                            }(), n.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent), n.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)
                    }("undefined" != typeof io ? io : module.exports, this), function (e, t) {
                        function n() {
                        }

                        e.EventEmitter = n, n.prototype.on = function (e, n) {
                            return this.$events || (this.$events = {}), this.$events[e] ? t.util.isArray(this.$events[e]) ? this.$events[e].push(n) : this.$events[e] = [this.$events[e], n] : this.$events[e] = n, this
                        }, n.prototype.addListener = n.prototype.on, n.prototype.once = function (e, t) {
                            function n() {
                                o.removeListener(e, n), t.apply(this, arguments)
                            }

                            var o = this;
                            return n.listener = t, this.on(e, n), this
                        }, n.prototype.removeListener = function (e, n) {
                            if (this.$events && this.$events[e]) {
                                var o = this.$events[e];
                                if (t.util.isArray(o)) {
                                    for (var i = -1, r = 0, a = o.length; a > r; r++)if (o[r] === n || o[r].listener && o[r].listener === n) {
                                        i = r;
                                        break
                                    }
                                    if (0 > i)return this;
                                    o.splice(i, 1), o.length || delete this.$events[e]
                                } else(o === n || o.listener && o.listener === n) && delete this.$events[e]
                            }
                            return this
                        }, n.prototype.removeAllListeners = function (e) {
                            return void 0 === e ? (this.$events = {}, this) : (this.$events && this.$events[e] && (this.$events[e] = null), this)
                        }, n.prototype.listeners = function (e) {
                            return this.$events || (this.$events = {}), this.$events[e] || (this.$events[e] = []), t.util.isArray(this.$events[e]) || (this.$events[e] = [this.$events[e]]), this.$events[e]
                        }, n.prototype.emit = function (e) {
                            if (!this.$events)return !1;
                            var n = this.$events[e];
                            if (!n)return !1;
                            var o = Array.prototype.slice.call(arguments, 1);
                            if ("function" == typeof n)n.apply(this, o); else {
                                if (!t.util.isArray(n))return !1;
                                for (var i = n.slice(), r = 0, a = i.length; a > r; r++)i[r].apply(this, o)
                            }
                            return !0
                        }
                    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (exports, nativeJSON) {
                        "use strict";
                        function f(e) {
                            return 10 > e ? "0" + e : e
                        }

                        function date(e) {
                            return isFinite(e.valueOf()) ? e.getUTCFullYear() + "-" + f(e.getUTCMonth() + 1) + "-" + f(e.getUTCDate()) + "T" + f(e.getUTCHours()) + ":" + f(e.getUTCMinutes()) + ":" + f(e.getUTCSeconds()) + "Z" : null
                        }

                        function quote(e) {
                            return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function (e) {
                                var t = meta[e];
                                return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                            }) + '"' : '"' + e + '"'
                        }

                        function str(e, t) {
                            var n, o, i, r, a, s = gap, c = t[e];
                            switch (c instanceof Date && (c = date(e)), "function" == typeof rep && (c = rep.call(t, e, c)), typeof c) {
                                case"string":
                                    return quote(c);
                                case"number":
                                    return isFinite(c) ? String(c) : "null";
                                case"boolean":
                                case"null":
                                    return String(c);
                                case"object":
                                    if (!c)return "null";
                                    if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(c)) {
                                        for (r = c.length, n = 0; r > n; n += 1)a[n] = str(n, c) || "null";
                                        return i = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]" : "[" + a.join(",") + "]", gap = s, i
                                    }
                                    if (rep && "object" == typeof rep)for (r = rep.length, n = 0; r > n; n += 1)"string" == typeof rep[n] && (o = rep[n], i = str(o, c), i && a.push(quote(o) + (gap ? ": " : ":") + i)); else for (o in c)Object.prototype.hasOwnProperty.call(c, o) && (i = str(o, c), i && a.push(quote(o) + (gap ? ": " : ":") + i));
                                    return i = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}" : "{" + a.join(",") + "}", gap = s, i
                            }
                        }

                        if (nativeJSON && nativeJSON.parse)return exports.JSON = {
                            parse: nativeJSON.parse,
                            stringify: nativeJSON.stringify
                        };
                        var JSON = exports.JSON = {}, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
                            "\b": "\\b",
                            "	": "\\t",
                            "\n": "\\n",
                            "\f": "\\f",
                            "\r": "\\r",
                            '"': '\\"',
                            "\\": "\\\\"
                        }, rep;
                        JSON.stringify = function (e, t, n) {
                            var o;
                            if (gap = "", indent = "", "number" == typeof n)for (o = 0; n > o; o += 1)indent += " "; else"string" == typeof n && (indent = n);
                            if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length))throw new Error("JSON.stringify");
                            return str("", {"": e})
                        }, JSON.parse = function (text, reviver) {
                            function walk(e, t) {
                                var n, o, i = e[t];
                                if (i && "object" == typeof i)for (n in i)Object.prototype.hasOwnProperty.call(i, n) && (o = walk(i, n), void 0 !== o ? i[n] = o : delete i[n]);
                                return reviver.call(e, t, i)
                            }

                            var j;
                            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (e) {
                                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j;
                            throw new SyntaxError("JSON.parse")
                        }
                    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof JSON ? JSON : void 0), function (e, t) {
                        var n = e.parser = {}, o = n.packets = ["disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop"], i = n.reasons = ["transport not supported", "client not handshaken", "unauthorized"], r = n.advice = ["reconnect"], a = t.JSON, s = t.util.indexOf;
                        n.encodePacket = function (e) {
                            var t = s(o, e.type), n = e.id || "", c = e.endpoint || "", u = e.ack, d = null;
                            switch (e.type) {
                                case"error":
                                    var p = e.reason ? s(i, e.reason) : "", l = e.advice ? s(r, e.advice) : "";
                                    ("" !== p || "" !== l) && (d = p + ("" !== l ? "+" + l : ""));
                                    break;
                                case"message":
                                    "" !== e.data && (d = e.data);
                                    break;
                                case"event":
                                    var f = {name: e.name};
                                    e.args && e.args.length && (f.args = e.args), d = a.stringify(f);
                                    break;
                                case"json":
                                    d = a.stringify(e.data);
                                    break;
                                case"connect":
                                    e.qs && (d = e.qs);
                                    break;
                                case"ack":
                                    d = e.ackId + (e.args && e.args.length ? "+" + a.stringify(e.args) : "")
                            }
                            var h = [t, n + ("data" == u ? "+" : ""), c];
                            return null !== d && void 0 !== d && h.push(d), h.join(":")
                        }, n.encodePayload = function (e) {
                            var t = "";
                            if (1 == e.length)return e[0];
                            for (var n = 0, o = e.length; o > n; n++) {
                                var i = e[n];
                                t += "�" + i.length + "�" + e[n]
                            }
                            return t
                        };
                        var c = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
                        n.decodePacket = function (e) {
                            var t = e.match(c);
                            if (!t)return {};
                            var n = t[2] || "", e = t[5] || "", s = {type: o[t[1]], endpoint: t[4] || ""};
                            switch (n && (s.id = n, s.ack = t[3] ? "data" : !0), s.type) {
                                case"error":
                                    var t = e.split("+");
                                    s.reason = i[t[0]] || "", s.advice = r[t[1]] || "";
                                    break;
                                case"message":
                                    s.data = e || "";
                                    break;
                                case"event":
                                    try {
                                        var u = a.parse(e);
                                        s.name = u.name, s.args = u.args
                                    } catch (d) {
                                    }
                                    s.args = s.args || [];
                                    break;
                                case"json":
                                    try {
                                        s.data = a.parse(e)
                                    } catch (d) {
                                    }
                                    break;
                                case"connect":
                                    s.qs = e || "";
                                    break;
                                case"ack":
                                    var t = e.match(/^([0-9]+)(\+)?(.*)/);
                                    if (t && (s.ackId = t[1], s.args = [], t[3]))try {
                                        s.args = t[3] ? a.parse(t[3]) : []
                                    } catch (d) {
                                    }
                                    break;
                                case"disconnect":
                                case"heartbeat":
                            }
                            return s
                        }, n.decodePayload = function (e) {
                            if ("�" == e.charAt(0)) {
                                for (var t = [], o = 1, i = ""; o < e.length; o++)"�" == e.charAt(o) ? (t.push(n.decodePacket(e.substr(o + 1).substr(0, i))), o += Number(i) + 1, i = "") : i += e.charAt(o);
                                return t
                            }
                            return [n.decodePacket(e)]
                        }
                    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t) {
                        function n(e, t) {
                            this.socket = e, this.sessid = t
                        }

                        e.Transport = n, t.util.mixin(n, t.EventEmitter), n.prototype.heartbeats = function () {
                            return !0
                        }, n.prototype.onData = function (e) {
                            if (this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout(), "" !== e) {
                                var n = t.parser.decodePayload(e);
                                if (n && n.length)for (var o = 0, i = n.length; i > o; o++)this.onPacket(n[o])
                            }
                            return this
                        }, n.prototype.onPacket = function (e) {
                            return this.socket.setHeartbeatTimeout(), "heartbeat" == e.type ? this.onHeartbeat() : ("connect" == e.type && "" == e.endpoint && this.onConnect(), "error" == e.type && "reconnect" == e.advice && (this.isOpen = !1), this.socket.onPacket(e), this)
                        }, n.prototype.setCloseTimeout = function () {
                            if (!this.closeTimeout) {
                                var e = this;
                                this.closeTimeout = setTimeout(function () {
                                    e.onDisconnect()
                                }, this.socket.closeTimeout)
                            }
                        }, n.prototype.onDisconnect = function () {
                            return this.isOpen && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), this
                        }, n.prototype.onConnect = function () {
                            return this.socket.onConnect(), this
                        }, n.prototype.clearCloseTimeout = function () {
                            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
                        }, n.prototype.clearTimeouts = function () {
                            this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout)
                        }, n.prototype.packet = function (e) {
                            this.send(t.parser.encodePacket(e))
                        }, n.prototype.onHeartbeat = function () {
                            this.packet({type: "heartbeat"})
                        }, n.prototype.onOpen = function () {
                            this.isOpen = !0, this.clearCloseTimeout(), this.socket.onOpen()
                        }, n.prototype.onClose = function () {
                            this.isOpen = !1, this.socket.onClose(), this.onDisconnect()
                        }, n.prototype.prepareUrl = function () {
                            var e = this.socket.options;
                            return this.scheme() + "://" + e.host + ":" + e.port + "/" + e.resource + "/" + t.protocol + "/" + this.name + "/" + this.sessid
                        }, n.prototype.ready = function (e, t) {
                            t.call(this)
                        }
                    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
                        function o(e) {
                            if (this.options = {
                                    port: 80,
                                    secure: !1,
                                    document: "document" in n ? document : !1,
                                    resource: "socket.io",
                                    transports: t.transports,
                                    "connect timeout": 1e4,
                                    "try multiple transports": !0,
                                    reconnect: !0,
                                    "reconnection delay": 500,
                                    "reconnection limit": 1 / 0,
                                    "reopen delay": 3e3,
                                    "max reconnection attempts": 10,
                                    "sync disconnect on unload": !1,
                                    "auto connect": !0,
                                    "flash policy port": 10843,
                                    manualFlush: !1
                                }, t.util.merge(this.options, e), this.connected = !1, this.open = !1, this.connecting = !1, this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1, this.options["sync disconnect on unload"] && (!this.isXDomain() || t.util.ua.hasCORS)) {
                                var o = this;
                                t.util.on(n, "beforeunload", function () {
                                    o.disconnectSync()
                                }, !1)
                            }
                            this.options["auto connect"] && this.connect()
                        }

                        function i() {
                        }

                        e.Socket = o, t.util.mixin(o, t.EventEmitter), o.prototype.of = function (e) {
                            return this.namespaces[e] || (this.namespaces[e] = new t.SocketNamespace(this, e), "" !== e && this.namespaces[e].packet({type: "connect"})), this.namespaces[e]
                        }, o.prototype.publish = function () {
                            this.emit.apply(this, arguments);
                            var e;
                            for (var t in this.namespaces)this.namespaces.hasOwnProperty(t) && (e = this.of(t), e.$emit.apply(e, arguments))
                        }, o.prototype.handshake = function (e) {
                            function n(t) {
                                t instanceof Error ? (o.connecting = !1, o.onError(t.message)) : e.apply(null, t.split(":"))
                            }

                            var o = this, r = this.options, a = ["http" + (r.secure ? "s" : "") + ":/", r.host + ":" + r.port, r.resource, t.protocol, t.util.query(this.options.query, "t=" + +new Date)].join("/");
                            if (this.isXDomain() && !t.util.ua.hasCORS) {
                                var s = document.getElementsByTagName("script")[0], c = document.createElement("script");
                                c.src = a + "&jsonp=" + t.j.length, s.parentNode.insertBefore(c, s), t.j.push(function (e) {
                                    n(e), c.parentNode.removeChild(c)
                                })
                            } else {
                                var u = t.util.request();
                                u.open("GET", a, !0), this.isXDomain() && (u.withCredentials = !0), u.onreadystatechange = function () {
                                    4 == u.readyState && (u.onreadystatechange = i, 200 == u.status ? n(u.responseText) : 403 == u.status ? o.onError(u.responseText) : (o.connecting = !1, !o.reconnecting && o.onError(u.responseText)))
                                }, u.send(null)
                            }
                        }, o.prototype.getTransport = function (e) {
                            for (var n, o = e || this.transports, i = 0; n = o[i]; i++)if (t.Transport[n] && t.Transport[n].check(this) && (!this.isXDomain() || t.Transport[n].xdomainCheck(this)))return new t.Transport[n](this, this.sessionid);
                            return null
                        }, o.prototype.connect = function (e) {
                            if (this.connecting)return this;
                            var n = this;
                            return n.connecting = !0, this.handshake(function (o, i, r, a) {
                                function s(e) {
                                    return n.transport && n.transport.clearTimeouts(), n.transport = n.getTransport(e), n.transport ? (n.transport.ready(n, function () {
                                        n.connecting = !0, n.publish("connecting", n.transport.name), n.transport.open(), n.options["connect timeout"] && (n.connectTimeoutTimer = setTimeout(function () {
                                            if (!n.connected && (n.connecting = !1, n.options["try multiple transports"])) {
                                                for (var e = n.transports; e.length > 0 && e.splice(0, 1)[0] != n.transport.name;);
                                                e.length ? s(e) : n.publish("connect_failed")
                                            }
                                        }, n.options["connect timeout"]))
                                    }), void 0) : n.publish("connect_failed")
                                }

                                n.sessionid = o, n.closeTimeout = 1e3 * r, n.heartbeatTimeout = 1e3 * i, n.transports || (n.transports = n.origTransports = a ? t.util.intersect(a.split(","), n.options.transports) : n.options.transports), n.setHeartbeatTimeout(), s(n.transports), n.once("connect", function () {
                                    clearTimeout(n.connectTimeoutTimer), e && "function" == typeof e && e()
                                })
                            }), this
                        }, o.prototype.setHeartbeatTimeout = function () {
                            if (clearTimeout(this.heartbeatTimeoutTimer), !this.transport || this.transport.heartbeats()) {
                                var e = this;
                                this.heartbeatTimeoutTimer = setTimeout(function () {
                                    e.transport.onClose()
                                }, this.heartbeatTimeout)
                            }
                        }, o.prototype.packet = function (e) {
                            return this.connected && !this.doBuffer ? this.transport.packet(e) : this.buffer.push(e), this
                        }, o.prototype.setBuffer = function (e) {
                            this.doBuffer = e, !e && this.connected && this.buffer.length && (this.options.manualFlush || this.flushBuffer())
                        }, o.prototype.flushBuffer = function () {
                            this.transport.payload(this.buffer), this.buffer = []
                        }, o.prototype.disconnect = function () {
                            return (this.connected || this.connecting) && (this.open && this.of("").packet({type: "disconnect"}), this.onDisconnect("booted")), this
                        }, o.prototype.disconnectSync = function () {
                            var e = t.util.request(), n = ["http" + (this.options.secure ? "s" : "") + ":/", this.options.host + ":" + this.options.port, this.options.resource, t.protocol, "", this.sessionid].join("/") + "/?disconnect=1";
                            e.open("GET", n, !1), e.send(null), this.onDisconnect("booted")
                        }, o.prototype.isXDomain = function () {
                            var e = n.location.port || ("https:" == n.location.protocol ? 443 : 80);
                            return this.options.host !== n.location.hostname || this.options.port != e
                        }, o.prototype.onConnect = function () {
                            this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
                        }, o.prototype.onOpen = function () {
                            this.open = !0
                        }, o.prototype.onClose = function () {
                            this.open = !1, clearTimeout(this.heartbeatTimeoutTimer)
                        }, o.prototype.onPacket = function (e) {
                            this.of(e.endpoint).onPacket(e)
                        }, o.prototype.onError = function (e) {
                            e && e.advice && "reconnect" === e.advice && (this.connected || this.connecting) && (this.disconnect(), this.options.reconnect && this.reconnect()), this.publish("error", e && e.reason ? e.reason : e)
                        }, o.prototype.onDisconnect = function (e) {
                            var t = this.connected, n = this.connecting;
                            this.connected = !1, this.connecting = !1, this.open = !1, (t || n) && (this.transport.close(), this.transport.clearTimeouts(), t && (this.publish("disconnect", e), "booted" != e && this.options.reconnect && !this.reconnecting && this.reconnect()))
                        }, o.prototype.reconnect = function () {
                            function e() {
                                if (n.connected) {
                                    for (var e in n.namespaces)n.namespaces.hasOwnProperty(e) && "" !== e && n.namespaces[e].packet({type: "connect"});
                                    n.publish("reconnect", n.transport.name, n.reconnectionAttempts)
                                }
                                clearTimeout(n.reconnectionTimer), n.removeListener("connect_failed", t), n.removeListener("connect", t), n.reconnecting = !1, delete n.reconnectionAttempts, delete n.reconnectionDelay, delete n.reconnectionTimer, delete n.redoTransports, n.options["try multiple transports"] = i
                            }

                            function t() {
                                return n.reconnecting ? n.connected ? e() : n.connecting && n.reconnecting ? n.reconnectionTimer = setTimeout(t, 1e3) : (n.reconnectionAttempts++ >= o ? n.redoTransports ? (n.publish("reconnect_failed"), e()) : (n.on("connect_failed", t), n.options["try multiple transports"] = !0, n.transports = n.origTransports, n.transport = n.getTransport(), n.redoTransports = !0, n.connect()) : (n.reconnectionDelay < r && (n.reconnectionDelay *= 2), n.connect(), n.publish("reconnecting", n.reconnectionDelay, n.reconnectionAttempts), n.reconnectionTimer = setTimeout(t, n.reconnectionDelay)), void 0) : void 0
                            }

                            this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
                            var n = this, o = this.options["max reconnection attempts"], i = this.options["try multiple transports"], r = this.options["reconnection limit"];
                            this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(t, this.reconnectionDelay), this.on("connect", t)
                        }
                    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t) {
                        function n(e, t) {
                            this.socket = e, this.name = t || "", this.flags = {}, this.json = new o(this, "json"), this.ackPackets = 0, this.acks = {}
                        }

                        function o(e, t) {
                            this.namespace = e, this.name = t
                        }

                        e.SocketNamespace = n, t.util.mixin(n, t.EventEmitter), n.prototype.$emit = t.EventEmitter.prototype.emit, n.prototype.of = function () {
                            return this.socket.of.apply(this.socket, arguments)
                        }, n.prototype.packet = function (e) {
                            return e.endpoint = this.name, this.socket.packet(e), this.flags = {}, this
                        }, n.prototype.send = function (e, t) {
                            var n = {type: this.flags.json ? "json" : "message", data: e};
                            return "function" == typeof t && (n.id = ++this.ackPackets, n.ack = !0, this.acks[n.id] = t), this.packet(n)
                        }, n.prototype.emit = function (e) {
                            var t = Array.prototype.slice.call(arguments, 1), n = t[t.length - 1], o = {
                                type: "event",
                                name: e
                            };
                            return "function" == typeof n && (o.id = ++this.ackPackets, o.ack = "data", this.acks[o.id] = n, t = t.slice(0, t.length - 1)), o.args = t, this.packet(o)
                        }, n.prototype.disconnect = function () {
                            return "" === this.name ? this.socket.disconnect() : (this.packet({type: "disconnect"}), this.$emit("disconnect")), this
                        }, n.prototype.onPacket = function (e) {
                            function n() {
                                o.packet({type: "ack", args: t.util.toArray(arguments), ackId: e.id})
                            }

                            var o = this;
                            switch (e.type) {
                                case"connect":
                                    this.$emit("connect");
                                    break;
                                case"disconnect":
                                    "" === this.name ? this.socket.onDisconnect(e.reason || "booted") : this.$emit("disconnect", e.reason);
                                    break;
                                case"message":
                                case"json":
                                    var i = ["message", e.data];
                                    "data" == e.ack ? i.push(n) : e.ack && this.packet({
                                        type: "ack",
                                        ackId: e.id
                                    }), this.$emit.apply(this, i);
                                    break;
                                case"event":
                                    var i = [e.name].concat(e.args);
                                    "data" == e.ack && i.push(n), this.$emit.apply(this, i);
                                    break;
                                case"ack":
                                    this.acks[e.ackId] && (this.acks[e.ackId].apply(this, e.args), delete this.acks[e.ackId]);
                                    break;
                                case"error":
                                    e.advice ? this.socket.onError(e) : "unauthorized" == e.reason ? this.$emit("connect_failed", e.reason) : this.$emit("error", e.reason)
                            }
                        }, o.prototype.send = function () {
                            this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments)
                        }, o.prototype.emit = function () {
                            this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments)
                        }
                    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
                        function o() {
                            t.Transport.apply(this, arguments)
                        }

                        e.websocket = o, t.util.inherit(o, t.Transport), o.prototype.name = "websocket", o.prototype.open = function () {
                            var e, o = t.util.query(this.socket.options.query), i = this;
                            return e || (e = n.MozWebSocket || n.WebSocket), this.websocket = new e(this.prepareUrl() + o), this.websocket.onopen = function () {
                                i.onOpen(), i.socket.setBuffer(!1)
                            }, this.websocket.onmessage = function (e) {
                                i.onData(e.data)
                            }, this.websocket.onclose = function () {
                                i.onClose(), i.socket.setBuffer(!0)
                            }, this.websocket.onerror = function (e) {
                                i.onError(e)
                            }, this
                        }, o.prototype.send = t.util.ua.iDevice ? function (e) {
                            var t = this;
                            return setTimeout(function () {
                                t.websocket.send(e)
                            }, 0), this
                        } : function (e) {
                            return this.websocket.send(e), this
                        }, o.prototype.payload = function (e) {
                            for (var t = 0, n = e.length; n > t; t++)this.packet(e[t]);
                            return this
                        }, o.prototype.close = function () {
                            return this.websocket.close(), this
                        }, o.prototype.onError = function (e) {
                            this.socket.onError(e)
                        }, o.prototype.scheme = function () {
                            return this.socket.options.secure ? "wss" : "ws"
                        }, o.check = function () {
                            return "WebSocket" in n && !("__addTask" in WebSocket) || "MozWebSocket" in n
                        }, o.xdomainCheck = function () {
                            return !0
                        }, t.transports.push("websocket")
                    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t) {
                        function n() {
                            t.Transport.websocket.apply(this, arguments)
                        }

                        e.flashsocket = n, t.util.inherit(n, t.Transport.websocket), n.prototype.name = "flashsocket", n.prototype.open = function () {
                            var e = this, n = arguments;
                            return WebSocket.__addTask(function () {
                                t.Transport.websocket.prototype.open.apply(e, n)
                            }), this
                        }, n.prototype.send = function () {
                            var e = this, n = arguments;
                            return WebSocket.__addTask(function () {
                                t.Transport.websocket.prototype.send.apply(e, n)
                            }), this
                        }, n.prototype.close = function () {
                            return WebSocket.__tasks.length = 0, t.Transport.websocket.prototype.close.call(this), this
                        }, n.prototype.ready = function (e, o) {
                            function i() {
                                var t = e.options, i = t["flash policy port"], a = ["http" + (t.secure ? "s" : "") + ":/", t.host + ":" + t.port, t.resource, "static/flashsocket", "WebSocketMain" + (e.isXDomain() ? "Insecure" : "") + ".swf"];
                                n.loaded || ("undefined" == typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = a.join("/")), 843 !== i && WebSocket.loadFlashPolicyFile("xmlsocket://" + t.host + ":" + i), WebSocket.__initialize(), n.loaded = !0), o.call(r)
                            }

                            var r = this;
                            return document.body ? i() : (t.util.load(i), void 0)
                        }, n.check = function () {
                            return "undefined" != typeof WebSocket && "__initialize" in WebSocket && swfobject ? swfobject.getFlashPlayerVersion().major >= 10 : !1
                        }, n.xdomainCheck = function () {
                            return !0
                        }, "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0), t.transports.push("flashsocket")
                    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), "undefined" != typeof window)var swfobject = function () {
                    function e() {
                        if (!J) {
                            try {
                                var e = L.getElementsByTagName("body")[0].appendChild(g("span"));
                                e.parentNode.removeChild(e)
                            } catch (t) {
                                return
                            }
                            J = !0;
                            for (var n = W.length, o = 0; n > o; o++)W[o]()
                        }
                    }

                    function t(e) {
                        J ? e() : W[W.length] = e
                    }

                    function n(e) {
                        if (typeof P.addEventListener != x)P.addEventListener("load", e, !1); else if (typeof L.addEventListener != x)L.addEventListener("load", e, !1); else if (typeof P.attachEvent != x)v(P, "onload", e); else if ("function" == typeof P.onload) {
                            var t = P.onload;
                            P.onload = function () {
                                t(), e()
                            }
                        } else P.onload = e
                    }

                    function o() {
                        F ? i() : r()
                    }

                    function i() {
                        var e = L.getElementsByTagName("body")[0], t = g(j);
                        t.setAttribute("type", A);
                        var n = e.appendChild(t);
                        if (n) {
                            var o = 0;
                            !function () {
                                if (typeof n.GetVariable != x) {
                                    var i = n.GetVariable("$version");
                                    i && (i = i.split(" ")[1].split(","), z.pv = [parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10)])
                                } else if (10 > o)return o++, setTimeout(arguments.callee, 10), void 0;
                                e.removeChild(t), n = null, r()
                            }()
                        } else r()
                    }

                    function r() {
                        var e = U.length;
                        if (e > 0)for (var t = 0; e > t; t++) {
                            var n = U[t].id, o = U[t].callbackFn, i = {success: !1, id: n};
                            if (z.pv[0] > 0) {
                                var r = m(n);
                                if (r)if (!y(U[t].swfVersion) || z.wk && z.wk < 312)if (U[t].expressInstall && s()) {
                                    var d = {};
                                    d.data = U[t].expressInstall, d.width = r.getAttribute("width") || "0", d.height = r.getAttribute("height") || "0", r.getAttribute("class") && (d.styleclass = r.getAttribute("class")), r.getAttribute("align") && (d.align = r.getAttribute("align"));
                                    for (var p = {}, l = r.getElementsByTagName("param"), f = l.length, h = 0; f > h; h++)"movie" != l[h].getAttribute("name").toLowerCase() && (p[l[h].getAttribute("name")] = l[h].getAttribute("value"));
                                    c(d, p, n, o)
                                } else u(r), o && o(i); else w(n, !0), o && (i.success = !0, i.ref = a(n), o(i))
                            } else if (w(n, !0), o) {
                                var g = a(n);
                                g && typeof g.SetVariable != x && (i.success = !0, i.ref = g), o(i)
                            }
                        }
                    }

                    function a(e) {
                        var t = null, n = m(e);
                        if (n && "OBJECT" == n.nodeName)if (typeof n.SetVariable != x)t = n; else {
                            var o = n.getElementsByTagName(j)[0];
                            o && (t = o)
                        }
                        return t
                    }

                    function s() {
                        return !V && y("6.0.65") && (z.win || z.mac) && !(z.wk && z.wk < 312)
                    }

                    function c(e, t, n, o) {
                        V = !0, E = o || null, T = {success: !1, id: n};
                        var i = m(n);
                        if (i) {
                            "OBJECT" == i.nodeName ? (k = d(i), C = null) : (k = i, C = n), e.id = I, (typeof e.width == x || !/%$/.test(e.width) && parseInt(e.width, 10) < 310) && (e.width = "310"), (typeof e.height == x || !/%$/.test(e.height) && parseInt(e.height, 10) < 137) && (e.height = "137"), L.title = L.title.slice(0, 47) + " - Flash Player Installation";
                            var r = z.ie && z.win ? ["Active"].concat("").join("X") : "PlugIn", a = "MMredirectURL=" + P.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + r + "&MMdoctitle=" + L.title;
                            if (typeof t.flashvars != x ? t.flashvars += "&" + a : t.flashvars = a, z.ie && z.win && 4 != i.readyState) {
                                var s = g("div");
                                n += "SWFObjectNew", s.setAttribute("id", n), i.parentNode.insertBefore(s, i), i.style.display = "none", function () {
                                    4 == i.readyState ? i.parentNode.removeChild(i) : setTimeout(arguments.callee, 10)
                                }()
                            }
                            p(e, t, n)
                        }
                    }

                    function u(e) {
                        if (z.ie && z.win && 4 != e.readyState) {
                            var t = g("div");
                            e.parentNode.insertBefore(t, e), t.parentNode.replaceChild(d(e), t), e.style.display = "none", function () {
                                4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
                            }()
                        } else e.parentNode.replaceChild(d(e), e)
                    }

                    function d(e) {
                        var t = g("div");
                        if (z.win && z.ie)t.innerHTML = e.innerHTML; else {
                            var n = e.getElementsByTagName(j)[0];
                            if (n) {
                                var o = n.childNodes;
                                if (o)for (var i = o.length, r = 0; i > r; r++)1 == o[r].nodeType && "PARAM" == o[r].nodeName || 8 == o[r].nodeType || t.appendChild(o[r].cloneNode(!0))
                            }
                        }
                        return t
                    }

                    function p(e, t, n) {
                        var o, i = m(n);
                        if (z.wk && z.wk < 312)return o;
                        if (i)if (typeof e.id == x && (e.id = n), z.ie && z.win) {
                            var r = "";
                            for (var a in e)e[a] != Object.prototype[a] && ("data" == a.toLowerCase() ? t.movie = e[a] : "styleclass" == a.toLowerCase() ? r += ' class="' + e[a] + '"' : "classid" != a.toLowerCase() && (r += " " + a + '="' + e[a] + '"'));
                            var s = "";
                            for (var c in t)t[c] != Object.prototype[c] && (s += '<param name="' + c + '" value="' + t[c] + '" />');
                            i.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + r + ">" + s + "</object>", B[B.length] = e.id, o = m(e.id)
                        } else {
                            var u = g(j);
                            u.setAttribute("type", A);
                            for (var d in e)e[d] != Object.prototype[d] && ("styleclass" == d.toLowerCase() ? u.setAttribute("class", e[d]) : "classid" != d.toLowerCase() && u.setAttribute(d, e[d]));
                            for (var p in t)t[p] != Object.prototype[p] && "movie" != p.toLowerCase() && l(u, p, t[p]);
                            i.parentNode.replaceChild(u, i), o = u
                        }
                        return o
                    }

                    function l(e, t, n) {
                        var o = g("param");
                        o.setAttribute("name", t), o.setAttribute("value", n), e.appendChild(o)
                    }

                    function f(e) {
                        var t = m(e);
                        t && "OBJECT" == t.nodeName && (z.ie && z.win ? (t.style.display = "none", function () {
                            4 == t.readyState ? h(e) : setTimeout(arguments.callee, 10)
                        }()) : t.parentNode.removeChild(t))
                    }

                    function h(e) {
                        var t = m(e);
                        if (t) {
                            for (var n in t)"function" == typeof t[n] && (t[n] = null);
                            t.parentNode.removeChild(t)
                        }
                    }

                    function m(e) {
                        var t = null;
                        try {
                            t = L.getElementById(e)
                        } catch (n) {
                        }
                        return t
                    }

                    function g(e) {
                        return L.createElement(e)
                    }

                    function v(e, t, n) {
                        e.attachEvent(t, n), $[$.length] = [e, t, n]
                    }

                    function y(e) {
                        var t = z.pv, n = e.split(".");
                        return n[0] = parseInt(n[0], 10), n[1] = parseInt(n[1], 10) || 0, n[2] = parseInt(n[2], 10) || 0, t[0] > n[0] || t[0] == n[0] && t[1] > n[1] || t[0] == n[0] && t[1] == n[1] && t[2] >= n[2] ? !0 : !1
                    }

                    function b(e, t, n, o) {
                        if (!z.ie || !z.mac) {
                            var i = L.getElementsByTagName("head")[0];
                            if (i) {
                                var r = n && "string" == typeof n ? n : "screen";
                                if (o && (O = null, _ = null), !O || _ != r) {
                                    var a = g("style");
                                    a.setAttribute("type", "text/css"), a.setAttribute("media", r), O = i.appendChild(a), z.ie && z.win && typeof L.styleSheets != x && L.styleSheets.length > 0 && (O = L.styleSheets[L.styleSheets.length - 1]), _ = r
                                }
                                z.ie && z.win ? O && typeof O.addRule == j && O.addRule(e, t) : O && typeof L.createTextNode != x && O.appendChild(L.createTextNode(e + " {" + t + "}"))
                            }
                        }
                    }

                    function w(e, t) {
                        if (q) {
                            var n = t ? "visible" : "hidden";
                            J && m(e) ? m(e).style.visibility = n : b("#" + e, "visibility:" + n)
                        }
                    }

                    function S(e) {
                        var t = /[\\\"<>\.;]/, n = null != t.exec(e);
                        return n && typeof encodeURIComponent != x ? encodeURIComponent(e) : e
                    }

                    var k, C, E, T, O, _, x = "undefined", j = "object", D = "Shockwave Flash", M = "ShockwaveFlash.ShockwaveFlash", A = "application/x-shockwave-flash", I = "SWFObjectExprInst", R = "onreadystatechange", P = window, L = document, N = navigator, F = !1, W = [o], U = [], B = [], $ = [], J = !1, V = !1, q = !0, z = function () {
                        var e = typeof L.getElementById != x && typeof L.getElementsByTagName != x && typeof L.createElement != x, t = N.userAgent.toLowerCase(), n = N.platform.toLowerCase(), o = n ? /win/.test(n) : /win/.test(t), i = n ? /mac/.test(n) : /mac/.test(t), r = /webkit/.test(t) ? parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, a = !1, s = [0, 0, 0], c = null;
                        if (typeof N.plugins != x && typeof N.plugins[D] == j)c = N.plugins[D].description, !c || typeof N.mimeTypes != x && N.mimeTypes[A] && !N.mimeTypes[A].enabledPlugin || (F = !0, a = !1, c = c.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), s[0] = parseInt(c.replace(/^(.*)\..*$/, "$1"), 10), s[1] = parseInt(c.replace(/^.*\.(.*)\s.*$/, "$1"), 10), s[2] = /[a-zA-Z]/.test(c) ? parseInt(c.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof P[["Active"].concat("Object").join("X")] != x)try {
                            var u = new (window[["Active"].concat("Object").join("X")])(M);
                            u && (c = u.GetVariable("$version"), c && (a = !0, c = c.split(" ")[1].split(","), s = [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)]))
                        } catch (d) {
                        }
                        return {w3: e, pv: s, wk: r, ie: a, win: o, mac: i}
                    }();
                    return function () {
                        z.w3 && ((typeof L.readyState != x && "complete" == L.readyState || typeof L.readyState == x && (L.getElementsByTagName("body")[0] || L.body)) && e(), J || (typeof L.addEventListener != x && L.addEventListener("DOMContentLoaded", e, !1), z.ie && z.win && (L.attachEvent(R, function () {
                            "complete" == L.readyState && (L.detachEvent(R, arguments.callee), e())
                        }), P == top && function () {
                            if (!J) {
                                try {
                                    L.documentElement.doScroll("left")
                                } catch (t) {
                                    return setTimeout(arguments.callee, 0), void 0
                                }
                                e()
                            }
                        }()), z.wk && function () {
                            return J ? void 0 : /loaded|complete/.test(L.readyState) ? (e(), void 0) : (setTimeout(arguments.callee, 0), void 0)
                        }(), n(e)))
                    }(), function () {
                        z.ie && z.win && window.attachEvent("onunload", function () {
                            for (var e = $.length, t = 0; e > t; t++)$[t][0].detachEvent($[t][1], $[t][2]);
                            for (var n = B.length, o = 0; n > o; o++)f(B[o]);
                            for (var i in z)z[i] = null;
                            z = null;
                            for (var r in swfobject)swfobject[r] = null;
                            swfobject = null
                        })
                    }(), {
                        registerObject: function (e, t, n, o) {
                            if (z.w3 && e && t) {
                                var i = {};
                                i.id = e, i.swfVersion = t, i.expressInstall = n, i.callbackFn = o, U[U.length] = i, w(e, !1)
                            } else o && o({success: !1, id: e})
                        }, getObjectById: function (e) {
                            return z.w3 ? a(e) : void 0
                        }, embedSWF: function (e, n, o, i, r, a, u, d, l, f) {
                            var h = {success: !1, id: n};
                            z.w3 && !(z.wk && z.wk < 312) && e && n && o && i && r ? (w(n, !1), t(function () {
                                o += "", i += "";
                                var t = {};
                                if (l && typeof l === j)for (var m in l)t[m] = l[m];
                                t.data = e, t.width = o, t.height = i;
                                var g = {};
                                if (d && typeof d === j)for (var v in d)g[v] = d[v];
                                if (u && typeof u === j)for (var b in u)typeof g.flashvars != x ? g.flashvars += "&" + b + "=" + u[b] : g.flashvars = b + "=" + u[b];
                                if (y(r)) {
                                    var S = p(t, g, n);
                                    t.id == n && w(n, !0), h.success = !0, h.ref = S
                                } else {
                                    if (a && s())return t.data = a, c(t, g, n, f), void 0;
                                    w(n, !0)
                                }
                                f && f(h)
                            })) : f && f(h)
                        }, switchOffAutoHideShow: function () {
                            q = !1
                        }, ua: z, getFlashPlayerVersion: function () {
                            return {major: z.pv[0], minor: z.pv[1], release: z.pv[2]}
                        }, hasFlashPlayerVersion: y, createSWF: function (e, t, n) {
                            return z.w3 ? p(e, t, n) : void 0
                        }, showExpressInstall: function (e, t, n, o) {
                            z.w3 && s() && c(e, t, n, o)
                        }, removeSWF: function (e) {
                            z.w3 && f(e)
                        }, createCSS: function (e, t, n, o) {
                            z.w3 && b(e, t, n, o)
                        }, addDomLoadEvent: t, addLoadEvent: n, getQueryParamValue: function (e) {
                            var t = L.location.search || L.location.hash;
                            if (t) {
                                if (/\?/.test(t) && (t = t.split("?")[1]), null == e)return S(t);
                                for (var n = t.split("&"), o = 0; o < n.length; o++)if (n[o].substring(0, n[o].indexOf("=")) == e)return S(n[o].substring(n[o].indexOf("=") + 1))
                            }
                            return ""
                        }, expressInstallCallback: function () {
                            if (V) {
                                var e = m(I);
                                e && k && (e.parentNode.replaceChild(k, e), C && (w(C, !0), z.ie && z.win && (k.style.display = "block")), E && E(T)), V = !1
                            }
                        }
                    }
                }();
                !function () {
                    if ("undefined" != typeof window && !window.WebSocket) {
                        var e = window.console;
                        if (e && e.log && e.error || (e = {
                                log: function () {
                                }, error: function () {
                                }
                            }), !swfobject.hasFlashPlayerVersion("10.0.0"))return e.error("Flash Player >= 10.0.0 is required."), void 0;
                        "file:" == location.protocol && e.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function (e, t, n, o, i) {
                            var r = this;
                            r.__id = WebSocket.__nextId++, WebSocket.__instances[r.__id] = r, r.readyState = WebSocket.CONNECTING, r.bufferedAmount = 0, r.__events = {}, t ? "string" == typeof t && (t = [t]) : t = [], setTimeout(function () {
                                WebSocket.__addTask(function () {
                                    WebSocket.__flash.create(r.__id, e, t, n || null, o || 0, i || null)
                                })
                            }, 0)
                        }, WebSocket.prototype.send = function (e) {
                            if (this.readyState == WebSocket.CONNECTING)throw"INVALID_STATE_ERR: Web Socket connection has not been established";
                            var t = WebSocket.__flash.send(this.__id, encodeURIComponent(e));
                            return 0 > t ? !0 : (this.bufferedAmount += t, !1)
                        }, WebSocket.prototype.close = function () {
                            this.readyState != WebSocket.CLOSED && this.readyState != WebSocket.CLOSING && (this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id))
                        }, WebSocket.prototype.addEventListener = function (e, t) {
                            e in this.__events || (this.__events[e] = []), this.__events[e].push(t)
                        }, WebSocket.prototype.removeEventListener = function (e, t) {
                            if (e in this.__events)for (var n = this.__events[e], o = n.length - 1; o >= 0; --o)if (n[o] === t) {
                                n.splice(o, 1);
                                break
                            }
                        }, WebSocket.prototype.dispatchEvent = function (e) {
                            for (var t = this.__events[e.type] || [], n = 0; n < t.length; ++n)t[n](e);
                            var o = this["on" + e.type];
                            o && o(e)
                        }, WebSocket.prototype.__handleEvent = function (e) {
                            "readyState" in e && (this.readyState = e.readyState), "protocol" in e && (this.protocol = e.protocol);
                            var t;
                            if ("open" == e.type || "error" == e.type)t = this.__createSimpleEvent(e.type); else if ("close" == e.type)t = this.__createSimpleEvent("close"); else {
                                if ("message" != e.type)throw"unknown event type: " + e.type;
                                var n = decodeURIComponent(e.message);
                                t = this.__createMessageEvent("message", n)
                            }
                            this.dispatchEvent(t)
                        }, WebSocket.prototype.__createSimpleEvent = function (e) {
                            if (document.createEvent && window.Event) {
                                var t = document.createEvent("Event");
                                return t.initEvent(e, !1, !1), t
                            }
                            return {type: e, bubbles: !1, cancelable: !1}
                        }, WebSocket.prototype.__createMessageEvent = function (e, t) {
                            if (document.createEvent && window.MessageEvent && !window.opera) {
                                var n = document.createEvent("MessageEvent");
                                return n.initMessageEvent("message", !1, !1, t, null, null, window, null), n
                            }
                            return {type: e, data: t, bubbles: !1, cancelable: !1}
                        }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function (e) {
                            WebSocket.__addTask(function () {
                                WebSocket.__flash.loadManualPolicyFile(e)
                            })
                        }, WebSocket.__initialize = function () {
                            if (!WebSocket.__flash) {
                                if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), !window.WEB_SOCKET_SWF_LOCATION)return e.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf"), void 0;
                                var t = document.createElement("div");
                                t.id = "webSocketContainer", t.style.position = "absolute", WebSocket.__isFlashLite() ? (t.style.left = "0px", t.style.top = "0px") : (t.style.left = "-100px", t.style.top = "-100px");
                                var n = document.createElement("div");
                                n.id = "webSocketFlash", t.appendChild(n), document.body.appendChild(t), swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
                                    hasPriority: !0,
                                    swliveconnect: !0,
                                    allowScriptAccess: "always"
                                }, null, function (t) {
                                    t.success || e.error("[WebSocket] swfobject.embedSWF failed")
                                })
                            }
                        }, WebSocket.__onFlashInitialized = function () {
                            setTimeout(function () {
                                WebSocket.__flash = document.getElementById("webSocketFlash"), WebSocket.__flash.setCallerUrl(location.href), WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                                for (var e = 0; e < WebSocket.__tasks.length; ++e)WebSocket.__tasks[e]();
                                WebSocket.__tasks = []
                            }, 0)
                        }, WebSocket.__onFlashEvent = function () {
                            return setTimeout(function () {
                                try {
                                    for (var t = WebSocket.__flash.receiveEvents(), n = 0; n < t.length; ++n)WebSocket.__instances[t[n].webSocketId].__handleEvent(t[n])
                                } catch (o) {
                                    e.error(o)
                                }
                            }, 0), !0
                        }, WebSocket.__log = function (t) {
                            e.log(decodeURIComponent(t))
                        }, WebSocket.__error = function (t) {
                            e.error(decodeURIComponent(t))
                        }, WebSocket.__addTask = function (e) {
                            WebSocket.__flash ? e() : WebSocket.__tasks.push(e)
                        }, WebSocket.__isFlashLite = function () {
                            if (!window.navigator || !window.navigator.mimeTypes)return !1;
                            var e = window.navigator.mimeTypes["application/x-shockwave-flash"];
                            return e && e.enabledPlugin && e.enabledPlugin.filename ? e.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1 : !1
                        }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load", function () {
                            WebSocket.__initialize()
                        }, !1) : window.attachEvent("onload", function () {
                            WebSocket.__initialize()
                        }))
                    }
                }(), function (e, t, n) {
                    function o(e) {
                        e && (t.Transport.apply(this, arguments), this.sendBuffer = [])
                    }

                    function i() {
                    }

                    e.XHR = o, t.util.inherit(o, t.Transport), o.prototype.open = function () {
                        return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), this
                    }, o.prototype.payload = function (e) {
                        for (var n = [], o = 0, i = e.length; i > o; o++)n.push(t.parser.encodePacket(e[o]));
                        this.send(t.parser.encodePayload(n))
                    }, o.prototype.send = function (e) {
                        return this.post(e), this
                    }, o.prototype.post = function (e) {
                        function t() {
                            4 == this.readyState && (this.onreadystatechange = i, r.posting = !1, 200 == this.status ? r.socket.setBuffer(!1) : r.onClose())
                        }

                        function o() {
                            this.onload = i, r.socket.setBuffer(!1)
                        }

                        var r = this;
                        this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), n.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = o : this.sendXHR.onreadystatechange = t, this.sendXHR.send(e)
                    }, o.prototype.close = function () {
                        return this.onClose(), this
                    }, o.prototype.request = function (e) {
                        var n = t.util.request(this.socket.isXDomain()), o = t.util.query(this.socket.options.query, "t=" + +new Date);
                        if (n.open(e || "GET", this.prepareUrl() + o, !0), "POST" == e)try {
                            n.setRequestHeader ? n.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : n.contentType = "text/plain"
                        } catch (i) {
                        }
                        return n
                    }, o.prototype.scheme = function () {
                        return this.socket.options.secure ? "https" : "http"
                    }, o.check = function (e, o) {
                        try {
                            var i = t.util.request(o), r = n.XDomainRequest && i instanceof XDomainRequest, a = e && e.options && e.options.secure ? "https:" : "http:", s = n.location && a != n.location.protocol;
                            if (i && (!r || !s))return !0
                        } catch (c) {
                        }
                        return !1
                    }, o.xdomainCheck = function (e) {
                        return o.check(e, !0)
                    }
                }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t) {
                    function n() {
                        t.Transport.XHR.apply(this, arguments)
                    }

                    e.htmlfile = n, t.util.inherit(n, t.Transport.XHR), n.prototype.name = "htmlfile", n.prototype.get = function () {
                        this.doc = new (window[["Active"].concat("Object").join("X")])("htmlfile"), this.doc.open(), this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
                        var e = this.doc.createElement("div");
                        e.className = "socketio", this.doc.body.appendChild(e), this.iframe = this.doc.createElement("iframe"), e.appendChild(this.iframe);
                        var n = this, o = t.util.query(this.socket.options.query, "t=" + +new Date);
                        this.iframe.src = this.prepareUrl() + o, t.util.on(window, "unload", function () {
                            n.destroy()
                        })
                    }, n.prototype._ = function (e, t) {
                        e = e.replace(/\\\//g, "/"), this.onData(e);
                        try {
                            var n = t.getElementsByTagName("script")[0];
                            n.parentNode.removeChild(n)
                        } catch (o) {
                        }
                    }, n.prototype.destroy = function () {
                        if (this.iframe) {
                            try {
                                this.iframe.src = "about:blank"
                            } catch (e) {
                            }
                            this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, CollectGarbage()
                        }
                    }, n.prototype.close = function () {
                        return this.destroy(), t.Transport.XHR.prototype.close.call(this)
                    }, n.check = function (e) {
                        if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window)try {
                            var n = new (window[["Active"].concat("Object").join("X")])("htmlfile");
                            return n && t.Transport.XHR.check(e)
                        } catch (o) {
                        }
                        return !1
                    }, n.xdomainCheck = function () {
                        return !1
                    }, t.transports.push("htmlfile")
                }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
                    function o() {
                        t.Transport.XHR.apply(this, arguments)
                    }

                    function i() {
                    }

                    e["xhr-polling"] = o, t.util.inherit(o, t.Transport.XHR), t.util.merge(o, t.Transport.XHR), o.prototype.name = "xhr-polling", o.prototype.heartbeats = function () {
                        return !1
                    }, o.prototype.open = function () {
                        var e = this;
                        return t.Transport.XHR.prototype.open.call(e), !1
                    }, o.prototype.get = function () {
                        function e() {
                            4 == this.readyState && (this.onreadystatechange = i, 200 == this.status ? (r.onData(this.responseText), r.get()) : r.onClose())
                        }

                        function t() {
                            this.onload = i, this.onerror = i, r.retryCounter = 1, r.onData(this.responseText), r.get()
                        }

                        function o() {
                            r.retryCounter++, !r.retryCounter || r.retryCounter > 3 ? r.onClose() : r.get()
                        }

                        if (this.isOpen) {
                            var r = this;
                            this.xhr = this.request(), n.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = t, this.xhr.onerror = o) : this.xhr.onreadystatechange = e, this.xhr.send(null)
                        }
                    }, o.prototype.onClose = function () {
                        if (t.Transport.XHR.prototype.onClose.call(this), this.xhr) {
                            this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = i;
                            try {
                                this.xhr.abort()
                            } catch (e) {
                            }
                            this.xhr = null
                        }
                    }, o.prototype.ready = function (e, n) {
                        var o = this;
                        t.util.defer(function () {
                            n.call(o)
                        })
                    }, t.transports.push("xhr-polling")
                }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t, n) {
                    function o() {
                        t.Transport["xhr-polling"].apply(this, arguments), this.index = t.j.length;
                        var e = this;
                        t.j.push(function (t) {
                            e._(t)
                        })
                    }

                    var i = n.document && "MozAppearance" in n.document.documentElement.style;
                    e["jsonp-polling"] = o, t.util.inherit(o, t.Transport["xhr-polling"]), o.prototype.name = "jsonp-polling", o.prototype.post = function (e) {
                        function n() {
                            o(), i.socket.setBuffer(!1)
                        }

                        function o() {
                            i.iframe && i.form.removeChild(i.iframe);
                            try {
                                a = document.createElement('<iframe name="' + i.iframeId + '">')
                            } catch (e) {
                                a = document.createElement("iframe"), a.name = i.iframeId
                            }
                            a.id = i.iframeId, i.form.appendChild(a), i.iframe = a
                        }

                        var i = this, r = t.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
                        if (!this.form) {
                            var a, s = document.createElement("form"), c = document.createElement("textarea"), u = this.iframeId = "socketio_iframe_" + this.index;
                            s.className = "socketio", s.style.position = "absolute", s.style.top = "0px", s.style.left = "0px", s.style.display = "none", s.target = u, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), c.name = "d", s.appendChild(c), document.body.appendChild(s), this.form = s, this.area = c
                        }
                        this.form.action = this.prepareUrl() + r, o(), this.area.value = t.JSON.stringify(e);
                        try {
                            this.form.submit()
                        } catch (d) {
                        }
                        this.iframe.attachEvent ? a.onreadystatechange = function () {
                            "complete" == i.iframe.readyState && n()
                        } : this.iframe.onload = n, this.socket.setBuffer(!0)
                    }, o.prototype.get = function () {
                        var e = this, n = document.createElement("script"), o = t.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
                        this.script && (this.script.parentNode.removeChild(this.script), this.script = null), n.async = !0, n.src = this.prepareUrl() + o, n.onerror = function () {
                            e.onClose()
                        };
                        var r = document.getElementsByTagName("script")[0];
                        r.parentNode.insertBefore(n, r), this.script = n, i && setTimeout(function () {
                            var e = document.createElement("iframe");
                            document.body.appendChild(e), document.body.removeChild(e)
                        }, 100)
                    }, o.prototype._ = function (e) {
                        return this.onData(e), this.isOpen && this.get(), this
                    }, o.prototype.ready = function (e, n) {
                        var o = this;
                        return i ? (t.util.load(function () {
                            n.call(o)
                        }), void 0) : n.call(this)
                    }, o.check = function () {
                        return "document" in n
                    }, o.xdomainCheck = function () {
                        return !0
                    }, t.transports.push("jsonp-polling")
                }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), "function" == typeof define && define.amd && define([], function () {
                    return io
                })
            }()
        }, {}],
        13: [function (e, t) {
            var n = t.exports = {};
            n.nextTick = function () {
                var e = "undefined" != typeof window && window.setImmediate, t = "undefined" != typeof window && window.postMessage && window.addEventListener;
                if (e)return function (e) {
                    return window.setImmediate(e)
                };
                if (t) {
                    var n = [];
                    return window.addEventListener("message", function (e) {
                        var t = e.source;
                        if ((t === window || null === t) && "process-tick" === e.data && (e.stopPropagation(), n.length > 0)) {
                            var o = n.shift();
                            o()
                        }
                    }, !0), function (e) {
                        n.push(e), window.postMessage("process-tick", "*")
                    }
                }
                return function (e) {
                    setTimeout(e, 0)
                }
            }(), n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.binding = function () {
                throw new Error("process.binding is not supported")
            }, n.cwd = function () {
                return "/"
            }, n.chdir = function () {
                throw new Error("process.chdir is not supported")
            }
        }, {}],
        12: [function (e, t, n) {
            function o(e, t) {
                if (e.indexOf)return e.indexOf(t);
                for (var n = 0; n < e.length; n++)if (t === e[n])return n;
                return -1
            }

            var i = e("__browserify_process");
            i.EventEmitter || (i.EventEmitter = function () {
            });
            var r = n.EventEmitter = i.EventEmitter, a = "function" == typeof Array.isArray ? Array.isArray : function (e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            }, s = 10;
            r.prototype.setMaxListeners = function (e) {
                this._events || (this._events = {}), this._events.maxListeners = e
            }, r.prototype.emit = function (e) {
                if ("error" === e && (!this._events || !this._events.error || a(this._events.error) && !this._events.error.length))throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");
                if (!this._events)return !1;
                var t = this._events[e];
                if (!t)return !1;
                if ("function" == typeof t) {
                    switch (arguments.length) {
                        case 1:
                            t.call(this);
                            break;
                        case 2:
                            t.call(this, arguments[1]);
                            break;
                        case 3:
                            t.call(this, arguments[1], arguments[2]);
                            break;
                        default:
                            var n = Array.prototype.slice.call(arguments, 1);
                            t.apply(this, n)
                    }
                    return !0
                }
                if (a(t)) {
                    for (var n = Array.prototype.slice.call(arguments, 1), o = t.slice(), i = 0, r = o.length; r > i; i++)o[i].apply(this, n);
                    return !0
                }
                return !1
            }, r.prototype.addListener = function (e, t) {
                if ("function" != typeof t)throw new Error("addListener only takes instances of Function");
                if (this._events || (this._events = {}), this.emit("newListener", e, t), this._events[e])if (a(this._events[e])) {
                    if (!this._events[e].warned) {
                        var n;
                        n = void 0 !== this._events.maxListeners ? this._events.maxListeners : s, n && n > 0 && this._events[e].length > n && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), console.trace())
                    }
                    this._events[e].push(t)
                } else this._events[e] = [this._events[e], t]; else this._events[e] = t;
                return this
            }, r.prototype.on = r.prototype.addListener, r.prototype.once = function (e, t) {
                var n = this;
                return n.on(e, function o() {
                    n.removeListener(e, o), t.apply(this, arguments)
                }), this
            }, r.prototype.removeListener = function (e, t) {
                if ("function" != typeof t)throw new Error("removeListener only takes instances of Function");
                if (!this._events || !this._events[e])return this;
                var n = this._events[e];
                if (a(n)) {
                    var i = o(n, t);
                    if (0 > i)return this;
                    n.splice(i, 1), 0 == n.length && delete this._events[e]
                } else this._events[e] === t && delete this._events[e];
                return this
            }, r.prototype.removeAllListeners = function (e) {
                return 0 === arguments.length ? (this._events = {}, this) : (e && this._events && this._events[e] && (this._events[e] = null), this)
            }, r.prototype.listeners = function (e) {
                return this._events || (this._events = {}), this._events[e] || (this._events[e] = []), a(this._events[e]) || (this._events[e] = [this._events[e]]), this._events[e]
            }, r.listenerCount = function (e, t) {
                var n;
                return n = e._events && e._events[t] ? "function" == typeof e._events[t] ? 1 : e._events[t].length : 0
            }
        }, {__browserify_process: 13}],
        10: [function (e, t) {
            function n(e) {
                var t = this;
                this.id = e.id, this.parent = e.parent, this.type = e.type || "video", this.oneway = e.oneway || !1, this.sharemyscreen = e.sharemyscreen || !1, this.browserPrefix = e.prefix, this.stream = e.stream, this.enableDataChannels = void 0 === e.enableDataChannels ? this.parent.config.enableDataChannels : e.enableDataChannels, this.receiveMedia = e.receiveMedia || this.parent.config.receiveMedia, this.channels = {}, this.sid = e.sid || Date.now().toString(), this.pc = new r(this.parent.config.peerConnectionConfig, this.parent.config.peerConnectionConstraints), this.pc.on("ice", this.onIceCandidate.bind(this)), this.pc.on("endOfCandidates", function (e) {
                    t.send("endOfCandidates", e)
                }), this.pc.on("offer", function (e) {
                    t.parent.config.nick && (e.nick = t.parent.config.nick), t.send("offer", e)
                }), this.pc.on("answer", function (e) {
                    t.parent.config.nick && (e.nick = t.parent.config.nick), t.send("answer", e)
                }), this.pc.on("addStream", this.handleRemoteStreamAdded.bind(this)), this.pc.on("addChannel", this.handleDataChannelAdded.bind(this)), this.pc.on("removeStream", this.handleStreamRemoved.bind(this)), this.pc.on("negotiationNeeded", this.emit.bind(this, "negotiationNeeded")), this.pc.on("iceConnectionStateChange", this.emit.bind(this, "iceConnectionStateChange")), this.pc.on("iceConnectionStateChange", function () {
                    switch (t.pc.iceConnectionState) {
                        case"failed":
                            "offer" === t.pc.pc.peerconnection.localDescription.type && (t.parent.emit("iceFailed", t), t.send("connectivityError"))
                    }
                }), this.pc.on("signalingStateChange", this.emit.bind(this, "signalingStateChange")), this.logger = this.parent.logger, "screen" === e.type ? this.parent.localScreen && this.sharemyscreen && (this.logger.log("adding local screen stream to peer connection"), this.pc.addStream(this.parent.localScreen), this.broadcaster = e.broadcaster) : this.parent.localStreams.forEach(function (e) {
                    t.pc.addStream(e)
                }), a.call(this), this.on("channelOpen", function (e) {
                    e.protocol === c && (e.onmessage = function (n) {
                        var o = JSON.parse(n.data), i = new s.Receiver;
                        i.receive(o, e), t.emit("fileTransfer", o, i), i.on("receivedFile", function () {
                            i.channel.close()
                        })
                    })
                }), this.on("*", function () {
                    t.parent.emit.apply(t.parent, arguments)
                })
            }

            var o = e("util"), i = e("webrtcsupport"), r = e("rtcpeerconnection"), a = e("wildemitter"), s = e("filetransfer"), c = "https://simplewebrtc.com/protocol/filetransfer#inband-v1";
            o.inherits(n, a), n.prototype.handleMessage = function (e) {
                var t = this;
                this.logger.log("getting", e.type, e), e.prefix && (this.browserPrefix = e.prefix), "offer" === e.type ? (this.nick || (this.nick = e.payload.nick), delete e.payload.nick, e.payload.sdp = e.payload.sdp.replace("a=fmtp:0 profile-level-id=0x42e00c;packetization-mode=1\r\n", ""), this.pc.handleOffer(e.payload, function (e) {
                    e || t.pc.answer(t.receiveMedia, function () {
                    })
                })) : "answer" === e.type ? (this.nick || (this.nick = e.payload.nick), delete e.payload.nick, this.pc.handleAnswer(e.payload)) : "candidate" === e.type ? this.pc.processIce(e.payload) : "connectivityError" === e.type ? this.parent.emit("connectivityError", t) : "mute" === e.type ? this.parent.emit("mute", {
                    id: e.from,
                    name: e.payload.name
                }) : "unmute" === e.type ? this.parent.emit("unmute", {
                    id: e.from,
                    name: e.payload.name
                }) : "endOfCandidates" === e.type && console.log("remote end of candidates", e)
            }, n.prototype.send = function (e, t) {
                var n = {
                    to: this.id,
                    sid: this.sid,
                    broadcaster: this.broadcaster,
                    roomType: this.type,
                    type: e,
                    payload: t,
                    prefix: i.prefix
                };
                this.logger.log("sending", e, n), this.parent.emit("message", n)
            }, n.prototype.sendDirectly = function (e, t, n) {
                var o = {type: t, payload: n};
                this.logger.log("sending via datachannel", e, t, o);
                var i = this.getDataChannel(e);
                return "open" != i.readyState ? !1 : (i.send(JSON.stringify(o)), !0)
            }, n.prototype._observeDataChannel = function (e) {
                var t = this;
                e.onclose = this.emit.bind(this, "channelClose", e), e.onerror = this.emit.bind(this, "channelError", e), e.onmessage = function (n) {
                    t.emit("channelMessage", t, e.label, JSON.parse(n.data), e, n)
                }, e.onopen = this.emit.bind(this, "channelOpen", e)
            }, n.prototype.getDataChannel = function (e, t) {
                if (!i.supportDataChannel)return this.emit("error", new Error("createDataChannel not supported"));
                var n = this.channels[e];
                return t || (t = {}), n ? n : (n = this.channels[e] = this.pc.createDataChannel(e, t), this._observeDataChannel(n), n)
            }, n.prototype.onIceCandidate = function (e) {
                if (!this.closed)if (e) {
                    var t = this.parent.config.peerConnectionConfig;
                    "moz" === i.prefix && t && t.iceTransports && e.candidate && e.candidate.candidate && e.candidate.candidate.indexOf(t.iceTransports) < 0 ? this.logger.log("Ignoring ice candidate not matching pcConfig iceTransports type: ", t.iceTransports) : this.send("candidate", e)
                } else this.logger.log("End of candidates.")
            }, n.prototype.start = function () {
                this.enableDataChannels && this.getDataChannel("simplewebrtc"), this.pc.offer(this.receiveMedia, function () {
                })
            }, n.prototype.icerestart = function () {
                var e = this.receiveMedia;
                e.mandatory.IceRestart = !0, this.pc.offer(e, function () {
                })
            }, n.prototype.end = function () {
                this.closed || (this.pc.close(), this.handleStreamRemoved())
            }, n.prototype.handleRemoteStreamAdded = function (e) {
                var t = this;
                this.stream ? this.logger.warn("Already have a remote stream") : (this.stream = e.stream, this.stream.onended = function () {
                    t.end()
                }, this.parent.emit("peerStreamAdded", this))
            }, n.prototype.handleStreamRemoved = function () {
                this.parent.peers.splice(this.parent.peers.indexOf(this), 1), this.closed = !0, this.parent.emit("peerStreamRemoved", this)
            }, n.prototype.handleDataChannelAdded = function (e) {
                this.channels[e.label] = e, this._observeDataChannel(e)
            }, n.prototype.sendFile = function (e) {
                var t = new s.Sender, n = this.getDataChannel("filetransfer" + (new Date).getTime(), {protocol: c});
                return n.onopen = function () {
                    n.send(JSON.stringify({size: e.size, name: e.name})), t.send(e, n)
                }, n.onclose = function () {
                    console.log("sender received transfer"), t.emit("complete")
                }, t
            }, t.exports = n
        }, {filetransfer: 14, rtcpeerconnection: 15, util: 9, webrtcsupport: 6, wildemitter: 4}],
        11: [function (e, t) {
            function n(e) {
                c.call(this);
                var t, n = this.config = {
                    autoAdjustMic: !1,
                    detectSpeakingEvents: !0,
                    audioFallback: !1,
                    media: {audio: !0, video: !0},
                    logger: d
                };
                for (t in e)this.config[t] = e[t];
                this.logger = n.logger, this._log = this.logger.log.bind(this.logger, "LocalMedia:"), this._logerror = this.logger.error.bind(this.logger, "LocalMedia:"), this.screenSharingSupport = r.screenSharing, this.localStreams = [], this.localScreens = [], r.support || this._logerror("Your browser does not support local media capture.")
            }

            var o = e("util"), i = e("hark"), r = e("webrtcsupport"), a = e("getusermedia"), s = e("getscreenmedia"), c = e("wildemitter"), u = e("mediastream-gain"), d = e("mockconsole");
            o.inherits(n, c), n.prototype.start = function (e, t) {
                var n = this, o = e || this.config.media;
                a(o, function (e, i) {
                    if (e) {
                        if (n.config.audioFallback && "DevicesNotFoundError" === e.name && o.video !== !1)return o.video = !1, n.start(o, t), void 0
                    } else o.audio && n.config.detectSpeakingEvents && n.setupAudioMonitor(i, n.config.harkOptions), n.localStreams.push(i), n.config.autoAdjustMic && (n.gainController = new u(i), n.setMicIfEnabled(.5)), i.onended = function () {
                    }, n.emit("localStream", i);
                    return t ? t(e, i) : void 0
                })
            }, n.prototype.stop = function (e) {
                var t = this;
                if (e) {
                    e.getTracks().forEach(function (e) {
                        e.stop()
                    });
                    var n = t.localStreams.indexOf(e);
                    n > -1 ? (t.emit("localStreamStopped", e), t.localStreams = t.localStreams.splice(n, 1)) : (n = t.localScreens.indexOf(e), n > -1 && (t.emit("localScreenStopped", e), t.localScreens = t.localScreens.splce(n, 1)))
                } else this.stopStreams(), this.stopScreenShare()
            }, n.prototype.stopStreams = function () {
                var e = this;
                this.audioMonitor && (this.audioMonitor.stop(), delete this.audioMonitor), this.localStreams.forEach(function (t) {
                    t.getTracks().forEach(function (e) {
                        e.stop()
                    }), e.emit("localStreamStopped", t)
                }), this.localStreams = []
            }, n.prototype.startScreenShare = function (e) {
                var t = this;
                s(function (n, o) {
                    return n || (t.localScreens.push(o), o.onended = function () {
                        var e = t.localScreens.indexOf(o);
                        e > -1 && t.localScreens.splice(e, 1), t.emit("localScreenStopped", o)
                    }, t.emit("localScreen", o)), e ? e(n, o) : void 0
                })
            }, n.prototype.stopScreenShare = function (e) {
                var t = this;
                e ? (e.getTracks().forEach(function (e) {
                    e.stop()
                }), this.emit("localScreenStopped", e)) : (this.localScreens.forEach(function (e) {
                    e.getTracks().forEach(function (e) {
                        e.stop()
                    }), t.emit("localScreenStopped", e)
                }), this.localScreens = [])
            }, n.prototype.mute = function () {
                this._audioEnabled(!1), this.hardMuted = !0, this.emit("audioOff")
            }, n.prototype.unmute = function () {
                this._audioEnabled(!0), this.hardMuted = !1, this.emit("audioOn")
            }, n.prototype.setupAudioMonitor = function (e, t) {
                this._log("Setup audio");
                var n, o = this.audioMonitor = i(e, t), r = this;
                o.on("speaking", function () {
                    r.emit("speaking"), r.hardMuted || r.setMicIfEnabled(1)
                }), o.on("stopped_speaking", function () {
                    n && clearTimeout(n), n = setTimeout(function () {
                        r.emit("stoppedSpeaking"), r.hardMuted || r.setMicIfEnabled(.5)
                    }, 1e3)
                }), o.on("volume_change", function (e, t) {
                    r.emit("volumeChange", e, t)
                })
            }, n.prototype.setMicIfEnabled = function (e) {
                this.config.autoAdjustMic && this.gainController.setGain(e)
            }, n.prototype.pauseVideo = function () {
                this._videoEnabled(!1), this.emit("videoOff")
            }, n.prototype.resumeVideo = function () {
                this._videoEnabled(!0), this.emit("videoOn")
            }, n.prototype.pause = function () {
                this.mute(), this.pauseVideo()
            }, n.prototype.resume = function () {
                this.unmute(), this.resumeVideo()
            }, n.prototype._audioEnabled = function (e) {
                this.setMicIfEnabled(e ? 1 : 0), this.localStreams.forEach(function (t) {
                    t.getAudioTracks().forEach(function (t) {
                        t.enabled = !!e
                    })
                })
            }, n.prototype._videoEnabled = function (e) {
                this.localStreams.forEach(function (t) {
                    t.getVideoTracks().forEach(function (t) {
                        t.enabled = !!e
                    })
                })
            }, n.prototype.isAudioEnabled = function () {
                var e = !0;
                return this.localStreams.forEach(function (t) {
                    t.getAudioTracks().forEach(function (t) {
                        e = e && t.enabled
                    })
                }), e
            }, n.prototype.isVideoEnabled = function () {
                var e = !0;
                return this.localStreams.forEach(function (t) {
                    t.getVideoTracks().forEach(function (t) {
                        e = e && t.enabled
                    })
                }), e
            }, n.prototype.startLocalMedia = n.prototype.start, n.prototype.stopLocalMedia = n.prototype.stop, Object.defineProperty(n.prototype, "localStream", {
                get: function () {
                    return this.localStreams.length > 0 ? this.localStreams[0] : null
                }
            }), Object.defineProperty(n.prototype, "localScreen", {
                get: function () {
                    return this.localScreens.length > 0 ? this.localScreens[0] : null
                }
            }), t.exports = n
        }, {
            getscreenmedia: 17,
            getusermedia: 18,
            hark: 16,
            "mediastream-gain": 19,
            mockconsole: 7,
            util: 9,
            webrtcsupport: 6,
            wildemitter: 4
        }],
        20: [function (e, t) {
            "use strict";
            function n(e) {
                return new Promise(function (t, n) {
                    o(e, t, n)
                })
            }

            var o = null, i = null, r = null, a = null, s = null, c = null, u = {
                log: function () {
                    "undefined" != typeof t || "function" == typeof e && "function" == typeof define || console.log.apply(console, arguments)
                }
            };
            if ("object" == typeof window && (!window.HTMLMediaElement || "srcObject" in window.HTMLMediaElement.prototype || Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", {
                    get: function () {
                        return "mozSrcObject" in this ? this.mozSrcObject : this._srcObject
                    }, set: function (e) {
                        "mozSrcObject" in this ? this.mozSrcObject = e : (this._srcObject = e, this.src = URL.createObjectURL(e))
                    }
                }), o = window.navigator && window.navigator.getUserMedia), i = function (e, t) {
                    e.srcObject = t
                }, r = function (e, t) {
                    e.srcObject = t.srcObject
                }, "undefined" != typeof window && window.navigator)if (navigator.mozGetUserMedia && window.mozRTCPeerConnection) {
                if (u.log("This appears to be Firefox"), a = "firefox", s = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10), c = 31, window.RTCPeerConnection = function (e, t) {
                        if (38 > s && e && e.iceServers) {
                            for (var n = [], o = 0; o < e.iceServers.length; o++) {
                                var i = e.iceServers[o];
                                if (i.hasOwnProperty("urls"))for (var r = 0; r < i.urls.length; r++) {
                                    var a = {url: i.urls[r]};
                                    0 === i.urls[r].indexOf("turn") && (a.username = i.username, a.credential = i.credential), n.push(a)
                                } else n.push(e.iceServers[o])
                            }
                            e.iceServers = n
                        }
                        return new mozRTCPeerConnection(e, t)
                    }, window.RTCSessionDescription = mozRTCSessionDescription, window.RTCIceCandidate = mozRTCIceCandidate, o = function (e, t, n) {
                        var o = function (e) {
                            if ("object" != typeof e || e.require)return e;
                            var t = [];
                            return Object.keys(e).forEach(function (n) {
                                if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                                    var o = e[n] = "object" == typeof e[n] ? e[n] : {ideal: e[n]};
                                    if ((void 0 !== o.min || void 0 !== o.max || void 0 !== o.exact) && t.push(n), void 0 !== o.exact && ("number" == typeof o.exact ? o.min = o.max = o.exact : e[n] = o.exact, delete o.exact), void 0 !== o.ideal) {
                                        e.advanced = e.advanced || [];
                                        var i = {};
                                        i[n] = "number" == typeof o.ideal ? {
                                            min: o.ideal,
                                            max: o.ideal
                                        } : o.ideal, e.advanced.push(i), delete o.ideal, Object.keys(o).length || delete e[n]
                                    }
                                }
                            }), t.length && (e.require = t), e
                        };
                        return 38 > s && (u.log("spec: " + JSON.stringify(e)), e.audio && (e.audio = o(e.audio)), e.video && (e.video = o(e.video)), u.log("ff37: " + JSON.stringify(e))), navigator.mozGetUserMedia(e, t, n)
                    }, navigator.getUserMedia = o, navigator.mediaDevices || (navigator.mediaDevices = {
                        getUserMedia: n,
                        addEventListener: function () {
                        },
                        removeEventListener: function () {
                        }
                    }), navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function () {
                            return new Promise(function (e) {
                                var t = [{
                                    kind: "audioinput",
                                    deviceId: "default",
                                    label: "",
                                    groupId: ""
                                }, {kind: "videoinput", deviceId: "default", label: "", groupId: ""}];
                                e(t)
                            })
                        }, 41 > s) {
                    var d = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                    navigator.mediaDevices.enumerateDevices = function () {
                        return d().catch(function (e) {
                            if ("NotFoundError" === e.name)return [];
                            throw e
                        })
                    }
                }
            } else if (navigator.webkitGetUserMedia && window.chrome) {
                u.log("This appears to be Chrome"), a = "chrome", s = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10), c = 38, window.RTCPeerConnection = function (e, t) {
                    e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy);
                    var n = new webkitRTCPeerConnection(e, t), o = n.getStats.bind(n);
                    return n.getStats = function (e, t) {
                        var n = this, i = arguments;
                        if (arguments.length > 0 && "function" == typeof e)return o(e, t);
                        var r = function (e) {
                            var t = {}, n = e.result();
                            return n.forEach(function (e) {
                                var n = {id: e.id, timestamp: e.timestamp, type: e.type};
                                e.names().forEach(function (t) {
                                    n[t] = e.stat(t)
                                }), t[n.id] = n
                            }), t
                        };
                        if (arguments.length >= 2) {
                            var a = function (e) {
                                i[1](r(e))
                            };
                            return o.apply(this, [a, arguments[0]])
                        }
                        return new Promise(function (t, a) {
                            1 === i.length && null === e ? o.apply(n, [function (e) {
                                t.apply(null, [r(e)])
                            }, a]) : o.apply(n, [t, a])
                        })
                    }, n
                }, ["createOffer", "createAnswer"].forEach(function (e) {
                    var t = webkitRTCPeerConnection.prototype[e];
                    webkitRTCPeerConnection.prototype[e] = function () {
                        var e = this;
                        if (arguments.length < 1 || 1 === arguments.length && "object" == typeof arguments[0]) {
                            var n = 1 === arguments.length ? arguments[0] : void 0;
                            return new Promise(function (o, i) {
                                t.apply(e, [o, i, n])
                            })
                        }
                        return t.apply(this, arguments)
                    }
                }), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                    var t = webkitRTCPeerConnection.prototype[e];
                    webkitRTCPeerConnection.prototype[e] = function () {
                        var e = arguments, n = this;
                        return new Promise(function (o, i) {
                            t.apply(n, [e[0], function () {
                                o(), e.length >= 2 && e[1].apply(null, [])
                            }, function (t) {
                                i(t), e.length >= 3 && e[2].apply(null, [t])
                            }])
                        })
                    }
                });
                var p = function (e) {
                    if ("object" != typeof e || e.mandatory || e.optional)return e;
                    var t = {};
                    return Object.keys(e).forEach(function (n) {
                        if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                            var o = "object" == typeof e[n] ? e[n] : {ideal: e[n]};
                            void 0 !== o.exact && "number" == typeof o.exact && (o.min = o.max = o.exact);
                            var i = function (e, t) {
                                return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                            };
                            if (void 0 !== o.ideal) {
                                t.optional = t.optional || [];
                                var r = {};
                                "number" == typeof o.ideal ? (r[i("min", n)] = o.ideal, t.optional.push(r), r = {}, r[i("max", n)] = o.ideal, t.optional.push(r)) : (r[i("", n)] = o.ideal, t.optional.push(r))
                            }
                            void 0 !== o.exact && "number" != typeof o.exact ? (t.mandatory = t.mandatory || {}, t.mandatory[i("", n)] = o.exact) : ["min", "max"].forEach(function (e) {
                                void 0 !== o[e] && (t.mandatory = t.mandatory || {}, t.mandatory[i(e, n)] = o[e])
                            })
                        }
                    }), e.advanced && (t.optional = (t.optional || []).concat(e.advanced)), t
                };
                if (o = function (e, t, n) {
                        return e.audio && (e.audio = p(e.audio)), e.video && (e.video = p(e.video)), u.log("chrome: " + JSON.stringify(e)), navigator.webkitGetUserMedia(e, t, n)
                    }, navigator.getUserMedia = o, navigator.mediaDevices || (navigator.mediaDevices = {
                        getUserMedia: n,
                        enumerateDevices: function () {
                            return new Promise(function (e) {
                                var t = {audio: "audioinput", video: "videoinput"};
                                return MediaStreamTrack.getSources(function (n) {
                                    e(n.map(function (e) {
                                        return {label: e.label, kind: t[e.kind], deviceId: e.id, groupId: ""}
                                    }))
                                })
                            })
                        }
                    }), navigator.mediaDevices.getUserMedia) {
                    var l = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function (e) {
                        return u.log("spec:   " + JSON.stringify(e)), e.audio = p(e.audio), e.video = p(e.video), u.log("chrome: " + JSON.stringify(e)), l(e)
                    }
                } else navigator.mediaDevices.getUserMedia = function (e) {
                    return n(e)
                };
                "undefined" == typeof navigator.mediaDevices.addEventListener && (navigator.mediaDevices.addEventListener = function () {
                    u.log("Dummy mediaDevices.addEventListener called.")
                }), "undefined" == typeof navigator.mediaDevices.removeEventListener && (navigator.mediaDevices.removeEventListener = function () {
                    u.log("Dummy mediaDevices.removeEventListener called.")
                }), i = function (e, t) {
                    s >= 43 ? e.srcObject = t : "undefined" != typeof e.src ? e.src = URL.createObjectURL(t) : u.log("Error attaching stream to element.")
                }, r = function (e, t) {
                    s >= 43 ? e.srcObject = t.srcObject : e.src = t.src
                }
            } else navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) ? (u.log("This appears to be Edge"), a = "edge", s = parseInt(navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)[2], 10), c = 12) : u.log("Browser does not appear to be WebRTC-capable"); else u.log("This does not appear to be a browser"), a = "not a browser";
            var f = {};
            if (Object.defineProperty(f, "version", {
                    set: function (e) {
                        s = e
                    }
                }), "undefined" != typeof t) {
                var h;
                "undefined" != typeof window && (h = window.RTCPeerConnection), t.exports = {
                    RTCPeerConnection: h,
                    getUserMedia: o,
                    attachMediaStream: i,
                    reattachMediaStream: r,
                    webrtcDetectedBrowser: a,
                    webrtcDetectedVersion: s,
                    webrtcMinimumVersion: c,
                    webrtcTesting: f
                }
            } else"function" == typeof e && "function" == typeof define && define([], function () {
                return {
                    RTCPeerConnection: window.RTCPeerConnection,
                    getUserMedia: o,
                    attachMediaStream: i,
                    reattachMediaStream: r,
                    webrtcDetectedBrowser: a,
                    webrtcDetectedVersion: s,
                    webrtcMinimumVersion: c,
                    webrtcTesting: f
                }
            })
        }, {}],
        15: [function (e, t) {
            function n(e, t) {
                var n, o = this;
                s.call(this), e = e || {}, e.iceServers = e.iceServers || [], this.enableChromeNativeSimulcast = !1, t && t.optional && "chrome" === u.webrtcDetectedBrowser && null === navigator.appVersion.match(/Chromium\//) && t.optional.forEach(function (e) {
                    e.enableChromeNativeSimulcast && (o.enableChromeNativeSimulcast = !0)
                }), this.enableMultiStreamHacks = !1, t && t.optional && "chrome" === u.webrtcDetectedBrowser && t.optional.forEach(function (e) {
                    e.enableMultiStreamHacks && (o.enableMultiStreamHacks = !0)
                }), this.restrictBandwidth = 0, t && t.optional && t.optional.forEach(function (e) {
                    e.andyetRestrictBandwidth && (o.restrictBandwidth = e.andyetRestrictBandwidth)
                }), this.batchIceCandidates = 0, t && t.optional && t.optional.forEach(function (e) {
                    e.andyetBatchIce && (o.batchIceCandidates = e.andyetBatchIce)
                }), this.batchedIceCandidates = [], t && t.optional && "chrome" === u.webrtcDetectedBrowser && t.optional.forEach(function (e) {
                    e.andyetFasterICE && (o.eliminateDuplicateCandidates = e.andyetFasterICE)
                }), t && t.optional && t.optional.forEach(function (e) {
                    e.andyetDontSignalCandidates && (o.dontSignalCandidates = e.andyetDontSignalCandidates)
                }), this.assumeSetLocalSuccess = !1, t && t.optional && t.optional.forEach(function (e) {
                    e.andyetAssumeSetLocalSuccess && (o.assumeSetLocalSuccess = e.andyetAssumeSetLocalSuccess)
                }), "firefox" === u.webrtcDetectedBrowser && t && t.optional && (this.wtFirefox = 0, t.optional.forEach(function (e) {
                    e.andyetFirefoxMakesMeSad && (o.wtFirefox = e.andyetFirefoxMakesMeSad, o.wtFirefox > 0 && (o.firefoxcandidatebuffer = []))
                })), this.pc = new c(e, t), this.getLocalStreams = this.pc.getLocalStreams.bind(this.pc), this.getRemoteStreams = this.pc.getRemoteStreams.bind(this.pc), this.addStream = this.pc.addStream.bind(this.pc), this.removeStream = this.pc.removeStream.bind(this.pc), this.pc.on("*", function () {
                    o.emit.apply(o, arguments)
                }), this.pc.onremovestream = this.emit.bind(this, "removeStream"), this.pc.onaddstream = this.emit.bind(this, "addStream"), this.pc.onnegotiationneeded = this.emit.bind(this, "negotiationNeeded"), this.pc.oniceconnectionstatechange = this.emit.bind(this, "iceConnectionStateChange"), this.pc.onsignalingstatechange = this.emit.bind(this, "signalingStateChange"), this.pc.onicecandidate = this._onIce.bind(this), this.pc.ondatachannel = this._onDataChannel.bind(this), this.localDescription = {contents: []}, this.remoteDescription = {contents: []}, this.config = {
                    debug: !1,
                    ice: {},
                    sid: "",
                    isInitiator: !0,
                    sdpSessionID: Date.now(),
                    useJingle: !1
                };
                for (n in e)this.config[n] = e[n];
                this.config.debug && this.on("*", function () {
                    var t = e.logger || console;
                    t.log("PeerConnection event:", arguments)
                }), this.hadLocalStunCandidate = !1, this.hadRemoteStunCandidate = !1, this.hadLocalRelayCandidate = !1, this.hadRemoteRelayCandidate = !1, this.hadLocalIPv6Candidate = !1, this.hadRemoteIPv6Candidate = !1, this._remoteDataChannels = [], this._localDataChannels = [], this._candidateBuffer = []
            }

            var o = e("util"), i = e("lodash.foreach"), r = e("lodash.pluck"), a = e("sdp-jingle-json"), s = e("wildemitter"), c = e("traceablepeerconnection"), u = e("webrtc-adapter-test");
            o.inherits(n, s), Object.defineProperty(n.prototype, "signalingState", {
                get: function () {
                    return this.pc.signalingState
                }
            }), Object.defineProperty(n.prototype, "iceConnectionState", {
                get: function () {
                    return this.pc.iceConnectionState
                }
            }), n.prototype._role = function () {
                return this.isInitiator ? "initiator" : "responder"
            }, n.prototype.addStream = function (e) {
                this.localStream = e, this.pc.addStream(e)
            }, n.prototype._checkLocalCandidate = function (e) {
                var t = a.toCandidateJSON(e);
                "srflx" == t.type ? this.hadLocalStunCandidate = !0 : "relay" == t.type && (this.hadLocalRelayCandidate = !0), -1 != t.ip.indexOf(":") && (this.hadLocalIPv6Candidate = !0)
            }, n.prototype._checkRemoteCandidate = function (e) {
                var t = a.toCandidateJSON(e);
                "srflx" == t.type ? this.hadRemoteStunCandidate = !0 : "relay" == t.type && (this.hadRemoteRelayCandidate = !0), -1 != t.ip.indexOf(":") && (this.hadRemoteIPv6Candidate = !0)
            }, n.prototype.processIce = function (e, t) {
                t = t || function () {
                    };
                var n = this;
                if ("closed" === this.pc.signalingState)return t();
                if (e.contents || e.jingle && e.jingle.contents) {
                    var o = r(this.remoteDescription.contents, "name"), i = e.contents || e.jingle.contents;
                    i.forEach(function (e) {
                        var t = e.transport || {}, i = t.candidates || [], r = o.indexOf(e.name), s = e.name;
                        i.forEach(function (e) {
                            var t = a.toCandidateSDP(e) + "\r\n";
                            n.pc.addIceCandidate(new RTCIceCandidate({
                                candidate: t,
                                sdpMLineIndex: r,
                                sdpMid: s
                            }), function () {
                            }, function (e) {
                                n.emit("error", e)
                            }), n._checkRemoteCandidate(t)
                        })
                    })
                } else {
                    if (e.candidate && 0 !== e.candidate.candidate.indexOf("a=") && (e.candidate.candidate = "a=" + e.candidate.candidate), this.wtFirefox && null !== this.firefoxcandidatebuffer && this.pc.localDescription && "offer" === this.pc.localDescription.type)return this.firefoxcandidatebuffer.push(e.candidate), t();
                    n.pc.addIceCandidate(new RTCIceCandidate(e.candidate), function () {
                    }, function (e) {
                        n.emit("error", e)
                    }), n._checkRemoteCandidate(e.candidate.candidate)
                }
                t()
            }, n.prototype.offer = function (e, t) {
                var n = this, o = 2 === arguments.length, r = o && e ? e : {
                    mandatory: {
                        OfferToReceiveAudio: !0,
                        OfferToReceiveVideo: !0
                    }
                };
                return t = o ? t : e, t = t || function () {
                    }, "closed" === this.pc.signalingState ? t("Already closed") : (this.pc.createOffer(function (e) {
                    var o = {type: "offer", sdp: e.sdp};
                    n.assumeSetLocalSuccess && (n.emit("offer", o), t(null, o)), n._candidateBuffer = [], n.pc.setLocalDescription(e, function () {
                        var r;
                        n.config.useJingle && (r = a.toSessionJSON(e.sdp, {
                            role: n._role(),
                            direction: "outgoing"
                        }), r.sid = n.config.sid, n.localDescription = r, i(r.contents, function (e) {
                            var t = e.transport || {};
                            t.ufrag && (n.config.ice[e.name] = {ufrag: t.ufrag, pwd: t.pwd})
                        }), o.jingle = r), o.sdp.split("\r\n").forEach(function (e) {
                            0 === e.indexOf("a=candidate:") && n._checkLocalCandidate(e)
                        }), n.assumeSetLocalSuccess || (n.emit("offer", o), t(null, o))
                    }, function (e) {
                        n.emit("error", e), t(e)
                    })
                }, function (e) {
                    n.emit("error", e), t(e)
                }, r), void 0)
            }, n.prototype.handleOffer = function (e, t) {
                t = t || function () {
                    };
                var n = this;
                if (e.type = "offer", e.jingle) {
                    if (this.enableChromeNativeSimulcast && e.jingle.contents.forEach(function (e) {
                            "video" === e.name && (e.description.googConferenceFlag = !0)
                        }), this.enableMultiStreamHacks && e.jingle.contents.forEach(function (e) {
                            if ("video" === e.name) {
                                var t = e.description.sources || [];
                                (0 === t.length || "3735928559" !== t[0].ssrc) && (t.unshift({
                                    ssrc: "3735928559",
                                    parameters: [{key: "cname", value: "deadbeef"}, {
                                        key: "msid",
                                        value: "mixyourfecintothis please"
                                    }]
                                }), e.description.sources = t)
                            }
                        }), n.restrictBandwidth > 0 && e.jingle.contents.length >= 2 && "video" === e.jingle.contents[1].name) {
                        var o = e.jingle.contents[1], i = o.description && o.description.bandwidth;
                        i || (e.jingle.contents[1].description.bandwidth = {
                            type: "AS",
                            bandwidth: n.restrictBandwidth.toString()
                        }, e.sdp = a.toSessionSDP(e.jingle, {
                            sid: n.config.sdpSessionID,
                            role: n._role(),
                            direction: "outgoing"
                        }))
                    }
                    e.sdp = a.toSessionSDP(e.jingle, {
                        sid: n.config.sdpSessionID,
                        role: n._role(),
                        direction: "incoming"
                    }), n.remoteDescription = e.jingle
                }
                e.sdp.split("\r\n").forEach(function (e) {
                    0 === e.indexOf("a=candidate:") && n._checkRemoteCandidate(e)
                }), n.pc.setRemoteDescription(new RTCSessionDescription(e), function () {
                    t()
                }, t)
            }, n.prototype.answerAudioOnly = function (e) {
                var t = {mandatory: {OfferToReceiveAudio: !0, OfferToReceiveVideo: !1}};
                this._answer(t, e)
            }, n.prototype.answerBroadcastOnly = function (e) {
                var t = {mandatory: {OfferToReceiveAudio: !1, OfferToReceiveVideo: !1}};
                this._answer(t, e)
            }, n.prototype.answer = function (e, t) {
                var n = 2 === arguments.length, o = n ? t : e, i = n && e ? e : {
                    mandatory: {
                        OfferToReceiveAudio: !0,
                        OfferToReceiveVideo: !0
                    }
                };
                this._answer(i, o)
            }, n.prototype.handleAnswer = function (e, t) {
                t = t || function () {
                    };
                var n = this;
                e.jingle && (e.sdp = a.toSessionSDP(e.jingle, {
                    sid: n.config.sdpSessionID,
                    role: n._role(),
                    direction: "incoming"
                }), n.remoteDescription = e.jingle), e.sdp.split("\r\n").forEach(function (e) {
                    0 === e.indexOf("a=candidate:") && n._checkRemoteCandidate(e)
                }), n.pc.setRemoteDescription(new RTCSessionDescription(e), function () {
                    n.wtFirefox && window.setTimeout(function () {
                        n.firefoxcandidatebuffer.forEach(function (e) {
                            n.pc.addIceCandidate(new RTCIceCandidate(e), function () {
                            }, function (e) {
                                n.emit("error", e)
                            }), n._checkRemoteCandidate(e.candidate)
                        }), n.firefoxcandidatebuffer = null
                    }, n.wtFirefox), t(null)
                }, t)
            }, n.prototype.close = function () {
                this.pc.close(), this._localDataChannels = [], this._remoteDataChannels = [], this.emit("close")
            }, n.prototype._answer = function (e, t) {
                t = t || function () {
                    };
                var n = this;
                if (!this.pc.remoteDescription)throw new Error("remoteDescription not set");
                return "closed" === this.pc.signalingState ? t("Already closed") : (n.pc.createAnswer(function (e) {
                    var o = [];
                    if (n.enableChromeNativeSimulcast && (e.jingle = a.toSessionJSON(e.sdp, {
                            role: n._role(),
                            direction: "outgoing"
                        }), e.jingle.contents.length >= 2 && "video" === e.jingle.contents[1].name)) {
                        var i = e.jingle.contents[1].description.sourceGroups || [], r = !1;
                        if (i.forEach(function (e) {
                                "SIM" == e.semantics && (r = !0)
                            }), !r && e.jingle.contents[1].description.sources.length) {
                            var s = JSON.parse(JSON.stringify(e.jingle.contents[1].description.sources[0]));
                            s.ssrc = "" + Math.floor(4294967295 * Math.random()), e.jingle.contents[1].description.sources.push(s), o.push(e.jingle.contents[1].description.sources[0].ssrc), o.push(s.ssrc), i.push({
                                semantics: "SIM",
                                sources: o
                            });
                            var c = JSON.parse(JSON.stringify(s));
                            c.ssrc = "" + Math.floor(4294967295 * Math.random()), e.jingle.contents[1].description.sources.push(c), i.push({
                                semantics: "FID",
                                sources: [s.ssrc, c.ssrc]
                            }), e.jingle.contents[1].description.sourceGroups = i, e.sdp = a.toSessionSDP(e.jingle, {
                                sid: n.config.sdpSessionID,
                                role: n._role(),
                                direction: "outgoing"
                            })
                        }
                    }
                    var u = {type: "answer", sdp: e.sdp};
                    n.assumeSetLocalSuccess && (n.emit("answer", u), t(null, u)), n._candidateBuffer = [], n.pc.setLocalDescription(e, function () {
                        if (n.config.useJingle) {
                            var o = a.toSessionJSON(e.sdp, {role: n._role(), direction: "outgoing"});
                            o.sid = n.config.sid, n.localDescription = o, u.jingle = o
                        }
                        n.enableChromeNativeSimulcast && (u.jingle || (u.jingle = a.toSessionJSON(e.sdp, {
                            role: n._role(),
                            direction: "outgoing"
                        })), u.jingle.contents[1].description.sources.forEach(function (e, t) {
                            e.parameters = e.parameters.map(function (e) {
                                return "msid" === e.key && (e.value += "-" + Math.floor(t / 2)), e
                            })
                        }), u.sdp = a.toSessionSDP(u.jingle, {
                            sid: n.sdpSessionID,
                            role: n._role(),
                            direction: "outgoing"
                        })), u.sdp.split("\r\n").forEach(function (e) {
                            0 === e.indexOf("a=candidate:") && n._checkLocalCandidate(e)
                        }), n.assumeSetLocalSuccess || (n.emit("answer", u), t(null, u))
                    }, function (e) {
                        n.emit("error", e), t(e)
                    })
                }, function (e) {
                    n.emit("error", e), t(e)
                }, e), void 0)
            }, n.prototype._onIce = function (e) {
                var t = this;
                if (e.candidate) {
                    if (this.dontSignalCandidates)return;
                    var n = e.candidate, o = {
                        candidate: {
                            candidate: n.candidate,
                            sdpMid: n.sdpMid,
                            sdpMLineIndex: n.sdpMLineIndex
                        }
                    };
                    this._checkLocalCandidate(n.candidate);
                    var r, s, c = a.toCandidateJSON(n.candidate);
                    if (this.eliminateDuplicateCandidates && "relay" === c.type && (r = this._candidateBuffer.filter(function (e) {
                            return "relay" === e.type
                        }).map(function (e) {
                            return e.foundation + ":" + e.component
                        }), s = r.indexOf(c.foundation + ":" + c.component), s > -1 && c.priority >> 24 >= r[s].priority >> 24))return;
                    if ("max-bundle" === this.config.bundlePolicy && (r = this._candidateBuffer.filter(function (e) {
                            return c.type === e.type
                        }).map(function (e) {
                            return e.address + ":" + e.port
                        }), s = r.indexOf(c.address + ":" + c.port), s > -1))return;
                    if ("require" === this.config.rtcpMuxPolicy && "2" === c.component)return;
                    if (this._candidateBuffer.push(c), t.config.useJingle) {
                        if (n.sdpMid || (n.sdpMid = t.pc.remoteDescription && "offer" === t.pc.remoteDescription.type ? t.remoteDescription.contents[n.sdpMLineIndex].name : t.localDescription.contents[n.sdpMLineIndex].name), !t.config.ice[n.sdpMid]) {
                            var u = a.toSessionJSON(t.pc.localDescription.sdp, {
                                role: t._role(),
                                direction: "outgoing"
                            });
                            i(u.contents, function (e) {
                                var n = e.transport || {};
                                n.ufrag && (t.config.ice[e.name] = {ufrag: n.ufrag, pwd: n.pwd})
                            })
                        }
                        if (o.jingle = {
                                contents: [{
                                    name: n.sdpMid,
                                    creator: t._role(),
                                    transport: {
                                        transType: "iceUdp",
                                        ufrag: t.config.ice[n.sdpMid].ufrag,
                                        pwd: t.config.ice[n.sdpMid].pwd,
                                        candidates: [c]
                                    }
                                }]
                            }, t.batchIceCandidates > 0)return 0 === t.batchedIceCandidates.length && window.setTimeout(function () {
                            var e = {};
                            t.batchedIceCandidates.forEach(function (t) {
                                t = t.contents[0], e[t.name] || (e[t.name] = t), e[t.name].transport.candidates.push(t.transport.candidates[0])
                            });
                            var n = {jingle: {contents: []}};
                            Object.keys(e).forEach(function (t) {
                                n.jingle.contents.push(e[t])
                            }), t.batchedIceCandidates = [], t.emit("ice", n)
                        }, t.batchIceCandidates), t.batchedIceCandidates.push(o.jingle), void 0
                    }
                    this.emit("ice", o)
                } else this.emit("endOfCandidates")
            }, n.prototype._onDataChannel = function (e) {
                var t = e.channel;
                this._remoteDataChannels.push(t), this.emit("addChannel", t)
            }, n.prototype.createDataChannel = function (e, t) {
                var n = this.pc.createDataChannel(e, t);
                return this._localDataChannels.push(n), n
            }, n.prototype.getStats = function (e) {
                "firefox" === u.webrtcDetectedBrowser ? this.pc.getStats(function (t) {
                    var n = [];
                    for (var o in t)"object" == typeof t[o] && n.push(t[o]);
                    e(null, n)
                }, e) : this.pc.getStats(function (t) {
                    var n = [];
                    t.result().forEach(function (e) {
                        var t = {};
                        e.names().forEach(function (n) {
                            t[n] = e.stat(n)
                        }), t.id = e.id, t.type = e.type, t.timestamp = e.timestamp, n.push(t)
                    }), e(null, n)
                })
            }, t.exports = n
        }, {
            "lodash.foreach": 23,
            "lodash.pluck": 24,
            "sdp-jingle-json": 21,
            traceablepeerconnection: 22,
            util: 9,
            "webrtc-adapter-test": 20,
            wildemitter: 4
        }],
        14: [function (e, t) {
            function n(e) {
                i.call(this);
                var t = e || {};
                this.config = {chunksize: 16384, pacing: 0};
                var n;
                for (n in t)this.config[n] = t[n];
                this.file = null, this.channel = null
            }

            function o() {
                i.call(this), this.receiveBuffer = [], this.received = 0, this.metadata = {}, this.channel = null
            }

            var i = e("wildemitter"), r = e("util");
            r.inherits(n, i), n.prototype.send = function (e, t) {
                var n = this;
                this.file = e, this.channel = t;
                var o = function (t) {
                    var i = new window.FileReader;
                    i.onload = function () {
                        return function (i) {
                            n.channel.send(i.target.result), n.emit("progress", t, e.size, i.target.result), e.size > t + i.target.result.byteLength ? window.setTimeout(o, n.config.pacing, t + n.config.chunksize) : (n.emit("progress", e.size, e.size, null), n.emit("sentFile"))
                        }
                    }(e);
                    var r = e.slice(t, t + n.config.chunksize);
                    i.readAsArrayBuffer(r)
                };
                window.setTimeout(o, 0, 0)
            }, r.inherits(o, i), o.prototype.receive = function (e, t) {
                var n = this;
                e && (this.metadata = e), this.channel = t, t.binaryType = "arraybuffer", this.channel.onmessage = function (e) {
                    var t = e.data.byteLength;
                    n.received += t, n.receiveBuffer.push(e.data), n.emit("progress", n.received, n.metadata.size, e.data), n.received === n.metadata.size ? (n.emit("receivedFile", new window.Blob(n.receiveBuffer), n.metadata), n.receiveBuffer = []) : n.received > n.metadata.size && (console.error("received more than expected, discarding..."), n.receiveBuffer = [])
                }
            }, t.exports = {}, t.exports.support = "undefined" != typeof window && window && window.File && window.FileReader && window.Blob, t.exports.Sender = n, t.exports.Receiver = o
        }, {util: 9, wildemitter: 4}],
        16: [function (e, t) {
            function n(e, t) {
                var n = -1 / 0;
                e.getFloatFrequencyData(t);
                for (var o = 4, i = t.length; i > o; o++)t[o] > n && t[o] < 0 && (n = t[o]);
                return n
            }

            var o = e("wildemitter"), i = window.AudioContext || window.webkitAudioContext, r = null;
            t.exports = function (e, t) {
                var a = new o;
                if (!i)return a;
                var t = t || {}, s = t.smoothing || .1, c = t.interval || 50, u = t.threshold, d = t.play, p = t.history || 10, l = !0;
                r || (r = new i);
                var f, h, m;
                m = r.createAnalyser(), m.fftSize = 512, m.smoothingTimeConstant = s, h = new Float32Array(m.fftSize), e.jquery && (e = e[0]), e instanceof HTMLAudioElement || e instanceof HTMLVideoElement ? (f = r.createMediaElementSource(e), "undefined" == typeof d && (d = !0), u = u || -50) : (f = r.createMediaStreamSource(e), u = u || -50), f.connect(m), d && m.connect(r.destination), a.speaking = !1, a.setThreshold = function (e) {
                    u = e
                }, a.setInterval = function (e) {
                    c = e
                }, a.stop = function () {
                    l = !1, a.emit("volume_change", -100, u), a.speaking && (a.speaking = !1, a.emit("stopped_speaking"))
                }, a.speakingHistory = [];
                for (var g = 0; p > g; g++)a.speakingHistory.push(0);
                var v = function () {
                    setTimeout(function () {
                        if (l) {
                            var e = n(m, h);
                            a.emit("volume_change", e, u);
                            var t = 0;
                            if (e > u && !a.speaking) {
                                for (var o = a.speakingHistory.length - 3; o < a.speakingHistory.length; o++)t += a.speakingHistory[o];
                                t >= 2 && (a.speaking = !0, a.emit("speaking"))
                            } else if (u > e && a.speaking) {
                                for (var o = 0; o < a.speakingHistory.length; o++)t += a.speakingHistory[o];
                                0 == t && (a.speaking = !1, a.emit("stopped_speaking"))
                            }
                            a.speakingHistory.shift(), a.speakingHistory.push(0 + (e > u)), v()
                        }
                    }, c)
                };
                return v(), a
            }
        }, {wildemitter: 25}],
        18: [function (e, t) {
            e("webrtc-adapter-test"), t.exports = function (e, t) {
                var n, o = 2 === arguments.length, i = {
                    video: !0,
                    audio: !0
                }, r = "PermissionDeniedError", a = "PERMISSION_DENIED", s = "ConstraintNotSatisfiedError";
                return o || (t = e, e = i), navigator.getUserMedia ? e.audio || e.video ? (localStorage && "true" === localStorage.useFirefoxFakeDevice && (e.fake = !0), navigator.getUserMedia(e, function (e) {
                    t(null, e)
                }, function (e) {
                    var n;
                    "string" == typeof e ? (n = new Error("MediaStreamError"), n.name = e === r || e === a ? r : s) : (n = e, n.name || (e.name = n[r] ? r : s)), t(n)
                }), void 0) : (n = new Error("MediaStreamError"), n.name = "NoMediaRequestedError", window.setTimeout(function () {
                    t(n)
                }, 0)) : (n = new Error("MediaStreamError"), n.name = "NotSupportedError", window.setTimeout(function () {
                    t(n)
                }, 0))
            }
        }, {"webrtc-adapter-test": 26}],
        25: [function (e, t) {
            function n() {
                this.callbacks = {}
            }

            t.exports = n, n.prototype.on = function (e) {
                var t = 3 === arguments.length, n = t ? arguments[1] : void 0, o = t ? arguments[2] : arguments[1];
                return o._groupName = n, (this.callbacks[e] = this.callbacks[e] || []).push(o), this
            }, n.prototype.once = function (e) {
                function t() {
                    n.off(e, t), r.apply(this, arguments)
                }

                var n = this, o = 3 === arguments.length, i = o ? arguments[1] : void 0, r = o ? arguments[2] : arguments[1];
                return this.on(e, i, t), this
            }, n.prototype.releaseGroup = function (e) {
                var t, n, o, i;
                for (t in this.callbacks)for (i = this.callbacks[t], n = 0, o = i.length; o > n; n++)i[n]._groupName === e && (i.splice(n, 1), n--, o--);
                return this
            }, n.prototype.off = function (e, t) {
                var n, o = this.callbacks[e];
                return o ? 1 === arguments.length ? (delete this.callbacks[e], this) : (n = o.indexOf(t), o.splice(n, 1), 0 === o.length && delete this.callbacks[e], this) : this
            }, n.prototype.emit = function (e) {
                var t, n, o, i = [].slice.call(arguments, 1), r = this.callbacks[e], a = this.getWildcardCallbacks(e);
                if (r)for (o = r.slice(), t = 0, n = o.length; n > t && o[t]; ++t)o[t].apply(this, i);
                if (a)for (n = a.length, o = a.slice(), t = 0, n = o.length; n > t && o[t]; ++t)o[t].apply(this, [e].concat(i));
                return this
            }, n.prototype.getWildcardCallbacks = function (e) {
                var t, n, o = [];
                for (t in this.callbacks)n = t.split("*"), ("*" === t || 2 === n.length && e.slice(0, n[0].length) === n[0]) && (o = o.concat(this.callbacks[t]));
                return o
            }
        }, {}],
        26: [function (e, t) {
            "use strict";
            function n(e) {
                return new Promise(function (t, n) {
                    o(e, t, n)
                })
            }

            var o = null, i = null, r = null, a = null, s = null, c = null, u = {
                log: function () {
                    "undefined" != typeof t || "function" == typeof e && "function" == typeof define || console.log.apply(console, arguments)
                }
            };
            if ("object" == typeof window && (!window.HTMLMediaElement || "srcObject" in window.HTMLMediaElement.prototype || Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", {
                    get: function () {
                        return "mozSrcObject" in this ? this.mozSrcObject : this._srcObject
                    }, set: function (e) {
                        "mozSrcObject" in this ? this.mozSrcObject = e : (this._srcObject = e, this.src = URL.createObjectURL(e))
                    }
                }), o = window.navigator && window.navigator.getUserMedia), i = function (e, t) {
                    e.srcObject = t
                }, r = function (e, t) {
                    e.srcObject = t.srcObject
                }, "undefined" != typeof window && window.navigator)if (navigator.mozGetUserMedia && window.mozRTCPeerConnection) {
                if (u.log("This appears to be Firefox"), a = "firefox", s = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10), c = 31, window.RTCPeerConnection = function (e, t) {
                        if (38 > s && e && e.iceServers) {
                            for (var n = [], o = 0; o < e.iceServers.length; o++) {
                                var i = e.iceServers[o];
                                if (i.hasOwnProperty("urls"))for (var r = 0; r < i.urls.length; r++) {
                                    var a = {url: i.urls[r]};
                                    0 === i.urls[r].indexOf("turn") && (a.username = i.username, a.credential = i.credential), n.push(a)
                                } else n.push(e.iceServers[o])
                            }
                            e.iceServers = n
                        }
                        return new mozRTCPeerConnection(e, t)
                    }, window.RTCSessionDescription = mozRTCSessionDescription, window.RTCIceCandidate = mozRTCIceCandidate, o = function (e, t, n) {
                        var o = function (e) {
                            if ("object" != typeof e || e.require)return e;
                            var t = [];
                            return Object.keys(e).forEach(function (n) {
                                if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                                    var o = e[n] = "object" == typeof e[n] ? e[n] : {ideal: e[n]};
                                    if ((void 0 !== o.min || void 0 !== o.max || void 0 !== o.exact) && t.push(n), void 0 !== o.exact && ("number" == typeof o.exact ? o.min = o.max = o.exact : e[n] = o.exact, delete o.exact), void 0 !== o.ideal) {
                                        e.advanced = e.advanced || [];
                                        var i = {};
                                        i[n] = "number" == typeof o.ideal ? {
                                            min: o.ideal,
                                            max: o.ideal
                                        } : o.ideal, e.advanced.push(i), delete o.ideal, Object.keys(o).length || delete e[n]
                                    }
                                }
                            }), t.length && (e.require = t), e
                        };
                        return 38 > s && (u.log("spec: " + JSON.stringify(e)), e.audio && (e.audio = o(e.audio)), e.video && (e.video = o(e.video)), u.log("ff37: " + JSON.stringify(e))), navigator.mozGetUserMedia(e, t, n)
                    }, navigator.getUserMedia = o, navigator.mediaDevices || (navigator.mediaDevices = {
                        getUserMedia: n,
                        addEventListener: function () {
                        },
                        removeEventListener: function () {
                        }
                    }), navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function () {
                            return new Promise(function (e) {
                                var t = [{
                                    kind: "audioinput",
                                    deviceId: "default",
                                    label: "",
                                    groupId: ""
                                }, {kind: "videoinput", deviceId: "default", label: "", groupId: ""}];
                                e(t)
                            })
                        }, 41 > s) {
                    var d = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                    navigator.mediaDevices.enumerateDevices = function () {
                        return d().catch(function (e) {
                            if ("NotFoundError" === e.name)return [];
                            throw e
                        })
                    }
                }
            } else if (navigator.webkitGetUserMedia && window.chrome) {
                u.log("This appears to be Chrome"), a = "chrome", s = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10), c = 38, window.RTCPeerConnection = function (e, t) {
                    e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy);
                    var n = new webkitRTCPeerConnection(e, t), o = n.getStats.bind(n);
                    return n.getStats = function (e, t) {
                        var n = this, i = arguments;
                        if (arguments.length > 0 && "function" == typeof e)return o(e, t);
                        var r = function (e) {
                            var t = {}, n = e.result();
                            return n.forEach(function (e) {
                                var n = {id: e.id, timestamp: e.timestamp, type: e.type};
                                e.names().forEach(function (t) {
                                    n[t] = e.stat(t)
                                }), t[n.id] = n
                            }), t
                        };
                        if (arguments.length >= 2) {
                            var a = function (e) {
                                i[1](r(e))
                            };
                            return o.apply(this, [a, arguments[0]])
                        }
                        return new Promise(function (t, a) {
                            1 === i.length && null === e ? o.apply(n, [function (e) {
                                t.apply(null, [r(e)])
                            }, a]) : o.apply(n, [t, a])
                        })
                    }, n
                }, ["createOffer", "createAnswer"].forEach(function (e) {
                    var t = webkitRTCPeerConnection.prototype[e];
                    webkitRTCPeerConnection.prototype[e] = function () {
                        var e = this;
                        if (arguments.length < 1 || 1 === arguments.length && "object" == typeof arguments[0]) {
                            var n = 1 === arguments.length ? arguments[0] : void 0;
                            return new Promise(function (o, i) {
                                t.apply(e, [o, i, n])
                            })
                        }
                        return t.apply(this, arguments)
                    }
                }), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                    var t = webkitRTCPeerConnection.prototype[e];
                    webkitRTCPeerConnection.prototype[e] = function () {
                        var e = arguments, n = this;
                        return new Promise(function (o, i) {
                            t.apply(n, [e[0], function () {
                                o(), e.length >= 2 && e[1].apply(null, [])
                            }, function (t) {
                                i(t), e.length >= 3 && e[2].apply(null, [t])
                            }])
                        })
                    }
                });
                var p = function (e) {
                    if ("object" != typeof e || e.mandatory || e.optional)return e;
                    var t = {};
                    return Object.keys(e).forEach(function (n) {
                        if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                            var o = "object" == typeof e[n] ? e[n] : {ideal: e[n]};
                            void 0 !== o.exact && "number" == typeof o.exact && (o.min = o.max = o.exact);
                            var i = function (e, t) {
                                return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                            };
                            if (void 0 !== o.ideal) {
                                t.optional = t.optional || [];
                                var r = {};
                                "number" == typeof o.ideal ? (r[i("min", n)] = o.ideal, t.optional.push(r), r = {}, r[i("max", n)] = o.ideal, t.optional.push(r)) : (r[i("", n)] = o.ideal, t.optional.push(r))
                            }
                            void 0 !== o.exact && "number" != typeof o.exact ? (t.mandatory = t.mandatory || {}, t.mandatory[i("", n)] = o.exact) : ["min", "max"].forEach(function (e) {
                                void 0 !== o[e] && (t.mandatory = t.mandatory || {}, t.mandatory[i(e, n)] = o[e])
                            })
                        }
                    }), e.advanced && (t.optional = (t.optional || []).concat(e.advanced)), t
                };
                if (o = function (e, t, n) {
                        return e.audio && (e.audio = p(e.audio)), e.video && (e.video = p(e.video)), u.log("chrome: " + JSON.stringify(e)), navigator.webkitGetUserMedia(e, t, n)
                    }, navigator.getUserMedia = o, navigator.mediaDevices || (navigator.mediaDevices = {
                        getUserMedia: n,
                        enumerateDevices: function () {
                            return new Promise(function (e) {
                                var t = {audio: "audioinput", video: "videoinput"};
                                return MediaStreamTrack.getSources(function (n) {
                                    e(n.map(function (e) {
                                        return {label: e.label, kind: t[e.kind], deviceId: e.id, groupId: ""}
                                    }))
                                })
                            })
                        }
                    }), navigator.mediaDevices.getUserMedia) {
                    var l = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function (e) {
                        return u.log("spec:   " + JSON.stringify(e)), e.audio = p(e.audio), e.video = p(e.video), u.log("chrome: " + JSON.stringify(e)), l(e)
                    }
                } else navigator.mediaDevices.getUserMedia = function (e) {
                    return n(e)
                };
                "undefined" == typeof navigator.mediaDevices.addEventListener && (navigator.mediaDevices.addEventListener = function () {
                    u.log("Dummy mediaDevices.addEventListener called.")
                }), "undefined" == typeof navigator.mediaDevices.removeEventListener && (navigator.mediaDevices.removeEventListener = function () {
                    u.log("Dummy mediaDevices.removeEventListener called.")
                }), i = function (e, t) {
                    s >= 43 ? e.srcObject = t : "undefined" != typeof e.src ? e.src = URL.createObjectURL(t) : u.log("Error attaching stream to element.")
                }, r = function (e, t) {
                    s >= 43 ? e.srcObject = t.srcObject : e.src = t.src
                }
            } else navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) ? (u.log("This appears to be Edge"), a = "edge", s = parseInt(navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)[2], 10), c = 12) : u.log("Browser does not appear to be WebRTC-capable"); else u.log("This does not appear to be a browser"), a = "not a browser";
            var f = {};
            if (Object.defineProperty(f, "version", {
                    set: function (e) {
                        s = e
                    }
                }), "undefined" != typeof t) {
                var h;
                "undefined" != typeof window && (h = window.RTCPeerConnection), t.exports = {
                    RTCPeerConnection: h,
                    getUserMedia: o,
                    attachMediaStream: i,
                    reattachMediaStream: r,
                    webrtcDetectedBrowser: a,
                    webrtcDetectedVersion: s,
                    webrtcMinimumVersion: c,
                    webrtcTesting: f
                }
            } else"function" == typeof e && "function" == typeof define && define([], function () {
                return {
                    RTCPeerConnection: window.RTCPeerConnection,
                    getUserMedia: o,
                    attachMediaStream: i,
                    reattachMediaStream: r,
                    webrtcDetectedBrowser: a,
                    webrtcDetectedVersion: s,
                    webrtcMinimumVersion: c,
                    webrtcTesting: f
                }
            })
        }, {}],
        21: [function (e, t, n) {
            var o = e("./lib/tosdp"), i = e("./lib/tojson");
            n.toIncomingSDPOffer = function (e) {
                return o.toSessionSDP(e, {role: "responder", direction: "incoming"})
            }, n.toOutgoingSDPOffer = function (e) {
                return o.toSessionSDP(e, {role: "initiator", direction: "outgoing"})
            }, n.toIncomingSDPAnswer = function (e) {
                return o.toSessionSDP(e, {role: "initiator", direction: "incoming"})
            }, n.toOutgoingSDPAnswer = function (e) {
                return o.toSessionSDP(e, {role: "responder", direction: "outgoing"})
            }, n.toIncomingMediaSDPOffer = function (e) {
                return o.toMediaSDP(e, {role: "responder", direction: "incoming"})
            }, n.toOutgoingMediaSDPOffer = function (e) {
                return o.toMediaSDP(e, {role: "initiator", direction: "outgoing"})
            }, n.toIncomingMediaSDPAnswer = function (e) {
                return o.toMediaSDP(e, {role: "initiator", direction: "incoming"})
            }, n.toOutgoingMediaSDPAnswer = function (e) {
                return o.toMediaSDP(e, {role: "responder", direction: "outgoing"})
            }, n.toCandidateSDP = o.toCandidateSDP, n.toMediaSDP = o.toMediaSDP, n.toSessionSDP = o.toSessionSDP, n.toIncomingJSONOffer = function (e, t) {
                return i.toSessionJSON(e, {role: "responder", direction: "incoming", creators: t})
            }, n.toOutgoingJSONOffer = function (e, t) {
                return i.toSessionJSON(e, {role: "initiator", direction: "outgoing", creators: t})
            }, n.toIncomingJSONAnswer = function (e, t) {
                return i.toSessionJSON(e, {role: "initiator", direction: "incoming", creators: t})
            }, n.toOutgoingJSONAnswer = function (e, t) {
                return i.toSessionJSON(e, {role: "responder", direction: "outgoing", creators: t})
            }, n.toIncomingMediaJSONOffer = function (e, t) {
                return i.toMediaJSON(e, {role: "responder", direction: "incoming", creator: t})
            }, n.toOutgoingMediaJSONOffer = function (e, t) {
                return i.toMediaJSON(e, {role: "initiator", direction: "outgoing", creator: t})
            }, n.toIncomingMediaJSONAnswer = function (e, t) {
                return i.toMediaJSON(e, {role: "initiator", direction: "incoming", creator: t})
            }, n.toOutgoingMediaJSONAnswer = function (e, t) {
                return i.toMediaJSON(e, {role: "responder", direction: "outgoing", creator: t})
            }, n.toCandidateJSON = i.toCandidateJSON, n.toMediaJSON = i.toMediaJSON, n.toSessionJSON = i.toSessionJSON
        }, {"./lib/tojson": 28, "./lib/tosdp": 27}],
        17: [function (e, t) {
            var n = e("getusermedia"), o = {};
            t.exports = function (e, t) {
                var i, r = 2 === arguments.length, a = r ? t : e;
                if ("undefined" == typeof window || "http:" === window.location.protocol)return i = new Error("NavigatorUserMediaError"), i.name = "HTTPS_REQUIRED", a(i);
                if (window.navigator.userAgent.match("Chrome")) {
                    var s = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10), c = 33, u = !window.chrome.webstore;
                    if (window.navigator.userAgent.match("Linux") && (c = 35), sessionStorage.getScreenMediaJSExtensionId)chrome.runtime.sendMessage(sessionStorage.getScreenMediaJSExtensionId, {
                        type: "getScreen",
                        id: 1
                    }, null, function (t) {
                        if ("" === t.sourceId) {
                            var o = new Error("NavigatorUserMediaError");
                            o.name = "PERMISSION_DENIED", a(o)
                        } else e = r && e || {
                                audio: !1,
                                video: {
                                    mandatory: {
                                        chromeMediaSource: "desktop",
                                        maxWidth: window.screen.width,
                                        maxHeight: window.screen.height,
                                        maxFrameRate: 3
                                    }, optional: [{googLeakyBucket: !0}, {googTemporalLayeredScreencast: !0}]
                                }
                            }, e.video.mandatory.chromeMediaSourceId = t.sourceId, n(e, a)
                    }); else if (window.cefGetScreenMedia)window.cefGetScreenMedia(function (t) {
                        if (t)e = r && e || {
                                audio: !1,
                                video: {
                                    mandatory: {
                                        chromeMediaSource: "desktop",
                                        maxWidth: window.screen.width,
                                        maxHeight: window.screen.height,
                                        maxFrameRate: 3
                                    }, optional: [{googLeakyBucket: !0}, {googTemporalLayeredScreencast: !0}]
                                }
                            }, e.video.mandatory.chromeMediaSourceId = t, n(e, a); else {
                            var o = new Error("cefGetScreenMediaError");
                            o.name = "CEF_GETSCREENMEDIA_CANCELED", a(o)
                        }
                    }); else if (u || s >= 26 && c >= s)e = r && e || {
                            video: {
                                mandatory: {
                                    googLeakyBucket: !0,
                                    maxWidth: window.screen.width,
                                    maxHeight: window.screen.height,
                                    maxFrameRate: 3,
                                    chromeMediaSource: "screen"
                                }
                            }
                        }, n(e, a); else {
                        var d = window.setTimeout(function () {
                            return i = new Error("NavigatorUserMediaError"), i.name = "EXTENSION_UNAVAILABLE", a(i)
                        }, 1e3);
                        o[d] = [a, r ? constraint : null], window.postMessage({type: "getScreen", id: d}, "*")
                    }
                } else if (window.navigator.userAgent.match("Firefox")) {
                    var p = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
                    p >= 33 ? (e = r && e || {
                            video: {
                                mozMediaSource: "window",
                                mediaSource: "window"
                            }
                        }, n(e, function (e, t) {
                        if (a(e, t), !e)var n = t.currentTime, o = window.setInterval(function () {
                            t || window.clearInterval(o), t.currentTime == n && (window.clearInterval(o), t.onended && t.onended()), n = t.currentTime
                        }, 500)
                    })) : (i = new Error("NavigatorUserMediaError"), i.name = "EXTENSION_UNAVAILABLE")
                }
            }, window.addEventListener("message", function (e) {
                if (e.origin == window.location.origin)if ("gotScreen" == e.data.type && o[e.data.id]) {
                    var t = o[e.data.id], i = t[1], r = t[0];
                    if (delete o[e.data.id], "" === e.data.sourceId) {
                        var a = new Error("NavigatorUserMediaError");
                        a.name = "PERMISSION_DENIED", r(a)
                    } else i = i || {
                            audio: !1,
                            video: {
                                mandatory: {
                                    chromeMediaSource: "desktop",
                                    maxWidth: window.screen.width,
                                    maxHeight: window.screen.height,
                                    maxFrameRate: 3
                                }, optional: [{googLeakyBucket: !0}, {googTemporalLayeredScreencast: !0}]
                            }
                        }, i.video.mandatory.chromeMediaSourceId = e.data.sourceId, n(i, r)
                } else"getScreenPending" == e.data.type && window.clearTimeout(e.data.id)
            })
        }, {getusermedia: 18}],
        19: [function (e, t) {
            function n(e) {
                if (this.support = o.webAudio && o.mediaStream, this.gain = 1, this.support) {
                    var t = this.context = new o.AudioContext;
                    this.microphone = t.createMediaStreamSource(e), this.gainFilter = t.createGain(), this.destination = t.createMediaStreamDestination(), this.outputStream = this.destination.stream, this.microphone.connect(this.gainFilter), this.gainFilter.connect(this.destination), e.addTrack(this.outputStream.getAudioTracks()[0]), e.removeTrack(e.getAudioTracks()[0])
                }
                this.stream = e
            }

            var o = e("webrtcsupport");
            n.prototype.setGain = function (e) {
                this.support && (this.gainFilter.gain.value = e, this.gain = e)
            }, n.prototype.getGain = function () {
                return this.gain
            }, n.prototype.off = function () {
                return this.setGain(0)
            }, n.prototype.on = function () {
                this.setGain(1)
            }, t.exports = n
        }, {webrtcsupport: 6}],
        23: [function (e, t) {
            function n(e, t) {
                return function (n, o, i) {
                    return "function" == typeof o && void 0 === i && a(n) ? e(n, o) : t(n, r(o, i, 3))
                }
            }

            var o = e("lodash._arrayeach"), i = e("lodash._baseeach"), r = e("lodash._bindcallback"), a = e("lodash.isarray"), s = n(o, i);
            t.exports = s
        }, {"lodash._arrayeach": 29, "lodash._baseeach": 32, "lodash._bindcallback": 30, "lodash.isarray": 31}],
        24: [function (e, t) {
            function n(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function o(e) {
                var t = e + "";
                return e = d(e), function (n) {
                    return u(n, e, t)
                }
            }

            function i(e, t) {
                var n = typeof e;
                if ("string" == n && h.test(e) || "number" == n)return !0;
                if (p(e))return !1;
                var o = !f.test(e);
                return o || null != t && e in r(t)
            }

            function r(e) {
                return s(e) ? e : Object(e)
            }

            function a(e, t) {
                return l(e, c(t))
            }

            function s(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function c(e) {
                return i(e) ? n(e) : o(e)
            }

            var u = e("lodash._baseget"), d = e("lodash._topath"), p = e("lodash.isarray"), l = e("lodash.map"), f = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/, h = /^\w*$/;
            t.exports = a
        }, {"lodash._baseget": 33, "lodash._topath": 34, "lodash.isarray": 35, "lodash.map": 36}],
        27: [function (e, t, n) {
            var o = e("./senders");
            n.toSessionSDP = function (e, t) {
                t.role || "initiator", t.direction || "outgoing";
                var o = t.sid || e.sid || Date.now(), i = t.time || Date.now(), r = ["v=0", "o=- " + o + " " + i + " IN IP4 0.0.0.0", "s=-", "t=0 0", "a=msid-semantic: WMS *"], a = e.groups || [];
                a.forEach(function (e) {
                    r.push("a=group:" + e.semantics + " " + e.contents.join(" "))
                });
                var s = e.contents || [];
                return s.forEach(function (e) {
                    r.push(n.toMediaSDP(e, t))
                }), r.join("\r\n") + "\r\n"
            }, n.toMediaSDP = function (e, t) {
                var i = [], r = t.role || "initiator", a = t.direction || "outgoing", s = e.description, c = e.transport, u = s.payloads || [], d = c && c.fingerprints || [], p = [];
                if ("datachannel" == s.descType ? (p.push("application"), p.push("1"), p.push("DTLS/SCTP"), c.sctp && c.sctp.forEach(function (e) {
                        p.push(e.number)
                    })) : (p.push(s.media), p.push("1"), s.encryption && s.encryption.length > 0 || d.length > 0 ? p.push("RTP/SAVPF") : p.push("RTP/AVPF"), u.forEach(function (e) {
                        p.push(e.id)
                    })), i.push("m=" + p.join(" ")), i.push("c=IN IP4 0.0.0.0"), s.bandwidth && s.bandwidth.type && s.bandwidth.bandwidth && i.push("b=" + s.bandwidth.type + ":" + s.bandwidth.bandwidth), "rtp" == s.descType && i.push("a=rtcp:1 IN IP4 0.0.0.0"), c) {
                    c.ufrag && i.push("a=ice-ufrag:" + c.ufrag), c.pwd && i.push("a=ice-pwd:" + c.pwd);
                    var l = !1;
                    d.forEach(function (e) {
                        i.push("a=fingerprint:" + e.hash + " " + e.value), e.setup && !l && i.push("a=setup:" + e.setup)
                    }), c.sctp && c.sctp.forEach(function (e) {
                        i.push("a=sctpmap:" + e.number + " " + e.protocol + " " + e.streams)
                    })
                }
                "rtp" == s.descType && i.push("a=" + (o[r][a][e.senders] || "sendrecv")), i.push("a=mid:" + e.name), s.sources && s.sources.length && (s.sources[0].parameters || []).forEach(function (e) {
                    "msid" === e.key && i.push("a=msid:" + e.value)
                }), s.mux && i.push("a=rtcp-mux");
                var f = s.encryption || [];
                f.forEach(function (e) {
                    i.push("a=crypto:" + e.tag + " " + e.cipherSuite + " " + e.keyParams + (e.sessionParams ? " " + e.sessionParams : ""))
                }), s.googConferenceFlag && i.push("a=x-google-flag:conference"), u.forEach(function (e) {
                    var t = "a=rtpmap:" + e.id + " " + e.name + "/" + e.clockrate;
                    if (e.channels && "1" != e.channels && (t += "/" + e.channels), i.push(t), e.parameters && e.parameters.length) {
                        var n = ["a=fmtp:" + e.id], o = [];
                        e.parameters.forEach(function (e) {
                            o.push((e.key ? e.key + "=" : "") + e.value)
                        }), n.push(o.join(";")), i.push(n.join(" "))
                    }
                    e.feedback && e.feedback.forEach(function (t) {
                        "trr-int" === t.type ? i.push("a=rtcp-fb:" + e.id + " trr-int " + (t.value ? t.value : "0")) : i.push("a=rtcp-fb:" + e.id + " " + t.type + (t.subtype ? " " + t.subtype : ""))
                    })
                }), s.feedback && s.feedback.forEach(function (e) {
                    "trr-int" === e.type ? i.push("a=rtcp-fb:* trr-int " + (e.value ? e.value : "0")) : i.push("a=rtcp-fb:* " + e.type + (e.subtype ? " " + e.subtype : ""))
                });
                var h = s.headerExtensions || [];
                h.forEach(function (e) {
                    i.push("a=extmap:" + e.id + (e.senders ? "/" + o[r][a][e.senders] : "") + " " + e.uri)
                });
                var m = s.sourceGroups || [];
                m.forEach(function (e) {
                    i.push("a=ssrc-group:" + e.semantics + " " + e.sources.join(" "))
                });
                var g = s.sources || [];
                g.forEach(function (e) {
                    for (var t = 0; t < e.parameters.length; t++) {
                        var n = e.parameters[t];
                        i.push("a=ssrc:" + (e.ssrc || s.ssrc) + " " + n.key + (n.value ? ":" + n.value : ""))
                    }
                });
                var v = c.candidates || [];
                return v.forEach(function (e) {
                    i.push(n.toCandidateSDP(e))
                }), i.join("\r\n")
            }, n.toCandidateSDP = function (e) {
                var t = [];
                t.push(e.foundation), t.push(e.component), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.ip), t.push(e.port);
                var n = e.type;
                return t.push("typ"), t.push(n), ("srflx" === n || "prflx" === n || "relay" === n) && e.relAddr && e.relPort && (t.push("raddr"), t.push(e.relAddr), t.push("rport"), t.push(e.relPort)), e.tcpType && "TCP" == e.protocol.toUpperCase() && (t.push("tcptype"), t.push(e.tcpType)), t.push("generation"), t.push(e.generation || "0"), "a=candidate:" + t.join(" ")
            }
        }, {"./senders": 37}],
        28: [function (e, t, n) {
            var o = e("./senders"), i = e("./parsers"), r = Math.random();
            n._setIdCounter = function (e) {
                r = e
            }, n.toSessionJSON = function (e, t) {
                var o, r = t.creators || [], a = t.role || "initiator", s = t.direction || "outgoing", c = e.split("\r\nm=");
                for (o = 1; o < c.length; o++)c[o] = "m=" + c[o], o !== c.length - 1 && (c[o] += "\r\n");
                var u = c.shift() + "\r\n", d = i.lines(u), p = {}, l = [];
                for (o = 0; o < c.length; o++)l.push(n.toMediaJSON(c[o], u, {
                    role: a,
                    direction: s,
                    creator: r[o] || "initiator"
                }));
                p.contents = l;
                var f = i.findLines("a=group:", d);
                return f.length && (p.groups = i.groups(f)), p
            }, n.toMediaJSON = function (e, t, r) {
                var a = r.creator || "initiator", s = r.role || "initiator", c = r.direction || "outgoing", u = i.lines(e), d = i.lines(t), p = i.mline(u[0]), l = {
                    creator: a,
                    name: p.media,
                    description: {
                        descType: "rtp",
                        media: p.media,
                        payloads: [],
                        encryption: [],
                        feedback: [],
                        headerExtensions: []
                    },
                    transport: {transType: "iceUdp", candidates: [], fingerprints: []}
                };
                "application" == p.media && (l.description = {descType: "datachannel"}, l.transport.sctp = []);
                var f = l.description, h = l.transport, m = i.findLine("a=mid:", u);
                if (m && (l.name = m.substr(6)), i.findLine("a=sendrecv", u, d) ? l.senders = "both" : i.findLine("a=sendonly", u, d) ? l.senders = o[s][c].sendonly : i.findLine("a=recvonly", u, d) ? l.senders = o[s][c].recvonly : i.findLine("a=inactive", u, d) && (l.senders = "none"), "rtp" == f.descType) {
                    var g = i.findLine("b=", u);
                    g && (f.bandwidth = i.bandwidth(g));
                    var v = i.findLine("a=ssrc:", u);
                    v && (f.ssrc = v.substr(7).split(" ")[0]);
                    var y = i.findLines("a=rtpmap:", u);
                    y.forEach(function (e) {
                        var t = i.rtpmap(e);
                        t.parameters = [], t.feedback = [];
                        var n = i.findLines("a=fmtp:" + t.id, u);
                        n.forEach(function (e) {
                            t.parameters = i.fmtp(e)
                        });
                        var o = i.findLines("a=rtcp-fb:" + t.id, u);
                        o.forEach(function (e) {
                            t.feedback.push(i.rtcpfb(e))
                        }), f.payloads.push(t)
                    });
                    var b = i.findLines("a=crypto:", u, d);
                    b.forEach(function (e) {
                        f.encryption.push(i.crypto(e))
                    }), i.findLine("a=rtcp-mux", u) && (f.mux = !0);
                    var w = i.findLines("a=rtcp-fb:*", u);
                    w.forEach(function (e) {
                        f.feedback.push(i.rtcpfb(e))
                    });
                    var S = i.findLines("a=extmap:", u);
                    S.forEach(function (e) {
                        var t = i.extmap(e);
                        t.senders = o[s][c][t.senders], f.headerExtensions.push(t)
                    });
                    var k = i.findLines("a=ssrc-group:", u);
                    f.sourceGroups = i.sourceGroups(k || []);
                    var C = i.findLines("a=ssrc:", u), E = f.sources = i.sources(C || []), T = i.findLine("a=msid:", u);
                    if (T) {
                        var O = i.msid(T);
                        ["msid", "mslabel", "label"].forEach(function (e) {
                            for (var t = 0; t < E.length; t++) {
                                for (var n = !1, o = 0; o < E[t].parameters.length; o++)E[t].parameters[o].key === e && (n = !0);
                                n || E[t].parameters.push({key: e, value: O[e]})
                            }
                        })
                    }
                    i.findLine("a=x-google-flag:conference", u, d) && (f.googConferenceFlag = !0)
                }
                var _ = i.findLines("a=fingerprint:", u, d), x = i.findLine("a=setup:", u, d);
                _.forEach(function (e) {
                    var t = i.fingerprint(e);
                    x && (t.setup = x.substr(8)), h.fingerprints.push(t)
                });
                var j = i.findLine("a=ice-ufrag:", u, d), D = i.findLine("a=ice-pwd:", u, d);
                if (j && D) {
                    h.ufrag = j.substr(12), h.pwd = D.substr(10), h.candidates = [];
                    var M = i.findLines("a=candidate:", u, d);
                    M.forEach(function (e) {
                        h.candidates.push(n.toCandidateJSON(e))
                    })
                }
                if ("datachannel" == f.descType) {
                    var A = i.findLines("a=sctpmap:", u);
                    A.forEach(function (e) {
                        var t = i.sctpmap(e);
                        h.sctp.push(t)
                    })
                }
                return l
            }, n.toCandidateJSON = function (e) {
                var t = i.candidate(e.split("\r\n")[0]);
                return t.id = (r++).toString(36).substr(0, 12), t
            }
        }, {"./parsers": 38, "./senders": 37}],
        29: [function (e, t) {
            function n(e, t) {
                for (var n = -1, o = e.length; ++n < o && t(e[n], n, e) !== !1;);
                return e
            }

            t.exports = n
        }, {}],
        30: [function (e, t) {
            function n(e, t, n) {
                if ("function" != typeof e)return o;
                if (void 0 === t)return e;
                switch (n) {
                    case 1:
                        return function (n) {
                            return e.call(t, n)
                        };
                    case 3:
                        return function (n, o, i) {
                            return e.call(t, n, o, i)
                        };
                    case 4:
                        return function (n, o, i, r) {
                            return e.call(t, n, o, i, r)
                        };
                    case 5:
                        return function (n, o, i, r, a) {
                            return e.call(t, n, o, i, r, a)
                        }
                }
                return function () {
                    return e.apply(t, arguments)
                }
            }

            function o(e) {
                return e
            }

            t.exports = n
        }, {}],
        31: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e, t) {
                var n = null == e ? void 0 : e[t];
                return s(n) ? n : void 0
            }

            function i(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && v >= e
            }

            function r(e) {
                return a(e) && h.call(e) == u
            }

            function a(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function s(e) {
                return null == e ? !1 : r(e) ? m.test(l.call(e)) : n(e) && d.test(e)
            }

            var c = "[object Array]", u = "[object Function]", d = /^\[object .+?Constructor\]$/, p = Object.prototype, l = Function.prototype.toString, f = p.hasOwnProperty, h = p.toString, m = RegExp("^" + l.call(f).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), g = o(Array, "isArray"), v = 9007199254740991, y = g || function (e) {
                    return n(e) && i(e.length) && h.call(e) == c
                };
            t.exports = y
        }, {}],
        33: [function (e, t) {
            function n(e, t, n) {
                if (null != e) {
                    void 0 !== n && n in o(e) && (t = [n]);
                    for (var i = 0, r = t.length; null != e && r > i;)e = e[t[i++]];
                    return i && i == r ? e : void 0
                }
            }

            function o(e) {
                return i(e) ? e : Object(e)
            }

            function i(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            t.exports = n
        }, {}],
        35: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e, t) {
                var n = null == e ? void 0 : e[t];
                return s(n) ? n : void 0
            }

            function i(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && v >= e
            }

            function r(e) {
                return a(e) && h.call(e) == u
            }

            function a(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function s(e) {
                return null == e ? !1 : r(e) ? m.test(l.call(e)) : n(e) && d.test(e)
            }

            var c = "[object Array]", u = "[object Function]", d = /^\[object .+?Constructor\]$/, p = Object.prototype, l = Function.prototype.toString, f = p.hasOwnProperty, h = p.toString, m = RegExp("^" + l.call(f).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), g = o(Array, "isArray"), v = 9007199254740991, y = g || function (e) {
                    return n(e) && i(e.length) && h.call(e) == c
                };
            t.exports = y
        }, {}],
        37: [function (e, t) {
            t.exports = {
                initiator: {
                    incoming: {
                        initiator: "recvonly",
                        responder: "sendonly",
                        both: "sendrecv",
                        none: "inactive",
                        recvonly: "initiator",
                        sendonly: "responder",
                        sendrecv: "both",
                        inactive: "none"
                    },
                    outgoing: {
                        initiator: "sendonly",
                        responder: "recvonly",
                        both: "sendrecv",
                        none: "inactive",
                        recvonly: "responder",
                        sendonly: "initiator",
                        sendrecv: "both",
                        inactive: "none"
                    }
                },
                responder: {
                    incoming: {
                        initiator: "sendonly",
                        responder: "recvonly",
                        both: "sendrecv",
                        none: "inactive",
                        recvonly: "responder",
                        sendonly: "initiator",
                        sendrecv: "both",
                        inactive: "none"
                    },
                    outgoing: {
                        initiator: "recvonly",
                        responder: "sendonly",
                        both: "sendrecv",
                        none: "inactive",
                        recvonly: "initiator",
                        sendonly: "responder",
                        sendrecv: "both",
                        inactive: "none"
                    }
                }
            }
        }, {}],
        38: [function (e, t, n) {
            n.lines = function (e) {
                return e.split("\r\n").filter(function (e) {
                    return e.length > 0
                })
            }, n.findLine = function (e, t, n) {
                for (var o = e.length, i = 0; i < t.length; i++)if (t[i].substr(0, o) === e)return t[i];
                if (!n)return !1;
                for (var r = 0; r < n.length; r++)if (n[r].substr(0, o) === e)return n[r];
                return !1
            }, n.findLines = function (e, t, n) {
                for (var o = [], i = e.length, r = 0; r < t.length; r++)t[r].substr(0, i) === e && o.push(t[r]);
                if (o.length || !n)return o;
                for (var a = 0; a < n.length; a++)n[a].substr(0, i) === e && o.push(n[a]);
                return o
            }, n.mline = function (e) {
                for (var t = e.substr(2).split(" "), n = {
                    media: t[0],
                    port: t[1],
                    proto: t[2],
                    formats: []
                }, o = 3; o < t.length; o++)t[o] && n.formats.push(t[o]);
                return n
            }, n.rtpmap = function (e) {
                var t = e.substr(9).split(" "), n = {id: t.shift()};
                return t = t[0].split("/"), n.name = t[0], n.clockrate = t[1], n.channels = 3 == t.length ? t[2] : "1", n
            }, n.sctpmap = function (e) {
                var t = e.substr(10).split(" "), n = {number: t.shift(), protocol: t.shift(), streams: t.shift()};
                return n
            }, n.fmtp = function (e) {
                for (var t, n, o, i = e.substr(e.indexOf(" ") + 1).split(";"), r = [], a = 0; a < i.length; a++)t = i[a].split("="), n = t[0].trim(), o = t[1], n && o ? r.push({
                    key: n,
                    value: o
                }) : n && r.push({key: "", value: n});
                return r
            }, n.crypto = function (e) {
                var t = e.substr(9).split(" "), n = {
                    tag: t[0],
                    cipherSuite: t[1],
                    keyParams: t[2],
                    sessionParams: t.slice(3).join(" ")
                };
                return n
            }, n.fingerprint = function (e) {
                var t = e.substr(14).split(" ");
                return {hash: t[0], value: t[1]}
            }, n.extmap = function (e) {
                var t = e.substr(9).split(" "), n = {}, o = t.shift(), i = o.indexOf("/");
                return i >= 0 ? (n.id = o.substr(0, i), n.senders = o.substr(i + 1)) : (n.id = o, n.senders = "sendrecv"), n.uri = t.shift() || "", n
            }, n.rtcpfb = function (e) {
                var t = e.substr(10).split(" "), n = {};
                return n.id = t.shift(), n.type = t.shift(), "trr-int" === n.type ? n.value = t.shift() : n.subtype = t.shift() || "", n.parameters = t, n
            }, n.candidate = function (e) {
                var t;
                t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" ");
                for (var n = {
                    foundation: t[0],
                    component: t[1],
                    protocol: t[2].toLowerCase(),
                    priority: t[3],
                    ip: t[4],
                    port: t[5],
                    type: t[7],
                    generation: "0"
                }, o = 8; o < t.length; o += 2)"raddr" === t[o] ? n.relAddr = t[o + 1] : "rport" === t[o] ? n.relPort = t[o + 1] : "generation" === t[o] ? n.generation = t[o + 1] : "tcptype" === t[o] && (n.tcpType = t[o + 1]);
                return n.network = "1", n
            }, n.sourceGroups = function (e) {
                for (var t = [], n = 0; n < e.length; n++) {
                    var o = e[n].substr(13).split(" ");
                    t.push({semantics: o.shift(), sources: o})
                }
                return t
            }, n.sources = function (e) {
                for (var t = [], n = {}, o = 0; o < e.length; o++) {
                    var i = e[o].substr(7).split(" "), r = i.shift();
                    if (!n[r]) {
                        var a = {ssrc: r, parameters: []};
                        t.push(a), n[r] = a
                    }
                    i = i.join(" ").split(":");
                    var s = i.shift(), c = i.join(":") || null;
                    n[r].parameters.push({key: s, value: c})
                }
                return t
            }, n.groups = function (e) {
                for (var t, n = [], o = 0; o < e.length; o++)t = e[o].substr(8).split(" "), n.push({
                    semantics: t.shift(),
                    contents: t
                });
                return n
            }, n.bandwidth = function (e) {
                var t = e.substr(2).split(":"), n = {};
                return n.type = t.shift(), n.bandwidth = t.shift(), n
            }, n.msid = function (e) {
                var t = e.substr(7), n = t.split(" ");
                return {msid: t, mslabel: n[0], label: n[1]}
            }
        }, {}],
        22: [function (e, t) {
            function n(e) {
                return {type: e.type, sdp: e.sdp}
            }

            function o(e) {
                var t = {label: e.id};
                return e.getAudioTracks().length && (t.audio = e.getAudioTracks().map(function (e) {
                    return e.id
                })), e.getVideoTracks().length && (t.video = e.getVideoTracks().map(function (e) {
                    return e.id
                })), t
            }

            function i(e, t) {
                var n = this;
                a.call(this), this.peerconnection = new window.RTCPeerConnection(e, t), this.trace = function (e, t) {
                    n.emit("PeerConnectionTrace", {time: new Date, type: e, value: t || ""})
                }, this.onicecandidate = null, this.peerconnection.onicecandidate = function (e) {
                    n.trace("onicecandidate", e.candidate), null !== n.onicecandidate && n.onicecandidate(e)
                }, this.onaddstream = null, this.peerconnection.onaddstream = function (e) {
                    n.trace("onaddstream", o(e.stream)), null !== n.onaddstream && n.onaddstream(e)
                }, this.onremovestream = null, this.peerconnection.onremovestream = function (e) {
                    n.trace("onremovestream", o(e.stream)), null !== n.onremovestream && n.onremovestream(e)
                }, this.onsignalingstatechange = null, this.peerconnection.onsignalingstatechange = function (e) {
                    n.trace("onsignalingstatechange", n.signalingState), null !== n.onsignalingstatechange && n.onsignalingstatechange(e)
                }, this.oniceconnectionstatechange = null, this.peerconnection.oniceconnectionstatechange = function (e) {
                    n.trace("oniceconnectionstatechange", n.iceConnectionState), null !== n.oniceconnectionstatechange && n.oniceconnectionstatechange(e)
                }, this.onnegotiationneeded = null, this.peerconnection.onnegotiationneeded = function (e) {
                    n.trace("onnegotiationneeded"), null !== n.onnegotiationneeded && n.onnegotiationneeded(e)
                }, n.ondatachannel = null, this.peerconnection.ondatachannel = function (e) {
                    n.trace("ondatachannel", e), null !== n.ondatachannel && n.ondatachannel(e)
                }, this.getLocalStreams = this.peerconnection.getLocalStreams.bind(this.peerconnection), this.getRemoteStreams = this.peerconnection.getRemoteStreams.bind(this.peerconnection)
            }

            var r = e("util");
            e("webrtc-adapter-test");
            var a = e("wildemitter");
            r.inherits(i, a), ["signalingState", "iceConnectionState", "localDescription", "remoteDescription"].forEach(function (e) {
                Object.defineProperty(i.prototype, e, {
                    get: function () {
                        return this.peerconnection[e]
                    }
                })
            }), i.prototype.addStream = function (e) {
                this.trace("addStream", o(e)), this.peerconnection.addStream(e)
            }, i.prototype.removeStream = function (e) {
                this.trace("removeStream", o(e)), this.peerconnection.removeStream(e)
            }, i.prototype.createDataChannel = function (e, t) {
                return this.trace("createDataChannel", e, t), this.peerconnection.createDataChannel(e, t)
            }, i.prototype.setLocalDescription = function (e, t, o) {
                var i = this;
                this.trace("setLocalDescription", n(e)), this.peerconnection.setLocalDescription(e, function () {
                    i.trace("setLocalDescriptionOnSuccess"), t && t()
                }, function (e) {
                    i.trace("setLocalDescriptionOnFailure", e), o && o(e)
                })
            }, i.prototype.setRemoteDescription = function (e, t, o) {
                var i = this;
                this.trace("setRemoteDescription", n(e)), this.peerconnection.setRemoteDescription(e, function () {
                    i.trace("setRemoteDescriptionOnSuccess"), t && t()
                }, function (e) {
                    i.trace("setRemoteDescriptionOnFailure", e), o && o(e)
                })
            }, i.prototype.close = function () {
                this.trace("stop"), "closed" != this.peerconnection.signalingState && this.peerconnection.close()
            }, i.prototype.createOffer = function (e, t, o) {
                var i = this;
                this.trace("createOffer", o), this.peerconnection.createOffer(function (t) {
                    i.trace("createOfferOnSuccess", n(t)), e && e(t)
                }, function (e) {
                    i.trace("createOfferOnFailure", e), t && t(e)
                }, o)
            }, i.prototype.createAnswer = function (e, t, o) {
                var i = this;
                this.trace("createAnswer", o), this.peerconnection.createAnswer(function (t) {
                    i.trace("createAnswerOnSuccess", n(t)), e && e(t)
                }, function (e) {
                    i.trace("createAnswerOnFailure", e), t && t(e)
                }, o)
            }, i.prototype.addIceCandidate = function (e, t, n) {
                var o = this;
                this.trace("addIceCandidate", e), this.peerconnection.addIceCandidate(e, function () {
                    t && t()
                }, function (e) {
                    o.trace("addIceCandidateOnFailure", e), n && n(e)
                })
            }, i.prototype.getStats = function () {
                this.peerconnection.getStats.apply(this.peerconnection, arguments)
            }, t.exports = i
        }, {util: 9, "webrtc-adapter-test": 20, wildemitter: 4}],
        32: [function (e, t) {
            function n(e, t) {
                return l(e, t, u)
            }

            function o(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function i(e, t) {
                return function (n, o) {
                    var i = n ? f(n) : 0;
                    if (!a(i))return e(n, o);
                    for (var r = t ? i : -1, c = s(n); (t ? r-- : ++r < i) && o(c[r], r, c) !== !1;);
                    return n
                }
            }

            function r(e) {
                return function (t, n, o) {
                    for (var i = s(t), r = o(t), a = r.length, c = e ? a : -1; e ? c-- : ++c < a;) {
                        var u = r[c];
                        if (n(i[u], u, i) === !1)break
                    }
                    return t
                }
            }

            function a(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && d >= e
            }

            function s(e) {
                return c(e) ? e : Object(e)
            }

            function c(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            var u = e("lodash.keys"), d = 9007199254740991, p = i(n), l = r(), f = o("length");
            t.exports = p
        }, {"lodash.keys": 39}],
        40: [function (e, t) {
            function n(e, t) {
                for (var n = -1, o = e.length, i = Array(o); ++n < o;)i[n] = t(e[n], n, e);
                return i
            }

            t.exports = n
        }, {}],
        34: [function (e, t) {
            function n(e) {
                return null == e ? "" : e + ""
            }

            function o(e) {
                if (i(e))return e;
                var t = [];
                return n(e).replace(r, function (e, n, o, i) {
                    t.push(o ? i.replace(a, "$1") : n || e)
                }), t
            }

            var i = e("lodash.isarray"), r = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g, a = /\\(\\)?/g;
            t.exports = o
        }, {"lodash.isarray": 35}],
        36: [function (e, t) {
            function n(e, t) {
                var n = -1, o = i(e) ? Array(e.length) : [];
                return u(e, function (e, i, r) {
                    o[++n] = t(e, i, r)
                }), o
            }

            function o(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function i(e) {
                return null != e && r(l(e))
            }

            function r(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && p >= e
            }

            function a(e, t, o) {
                var i = d(e) ? s : n;
                return t = c(t, o, 3), i(e, t)
            }

            var s = e("lodash._arraymap"), c = e("lodash._basecallback"), u = e("lodash._baseeach"), d = e("lodash.isarray"), p = 9007199254740991, l = o("length");
            t.exports = a
        }, {"lodash._arraymap": 40, "lodash._basecallback": 42, "lodash._baseeach": 41, "lodash.isarray": 35}],
        43: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e, t) {
                var n = null == e ? void 0 : e[t];
                return a(n) ? n : void 0
            }

            function i(e) {
                return r(e) && l.call(e) == s
            }

            function r(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function a(e) {
                return null == e ? !1 : i(e) ? f.test(d.call(e)) : n(e) && c.test(e)
            }

            var s = "[object Function]", c = /^\[object .+?Constructor\]$/, u = Object.prototype, d = Function.prototype.toString, p = u.hasOwnProperty, l = u.toString, f = RegExp("^" + d.call(p).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            t.exports = o
        }, {}],
        44: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function i(e) {
                return null != e && r(p(e))
            }

            function r(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && d >= e
            }

            function a(e) {
                return n(e) && i(e) && c.call(e, "callee") && !u.call(e, "callee")
            }

            var s = Object.prototype, c = s.hasOwnProperty, u = s.propertyIsEnumerable, d = 9007199254740991, p = o("length");
            t.exports = a
        }, {}],
        45: [function (e, t) {
            function n(e, t, n) {
                if ("function" != typeof e)return o;
                if (void 0 === t)return e;
                switch (n) {
                    case 1:
                        return function (n) {
                            return e.call(t, n)
                        };
                    case 3:
                        return function (n, o, i) {
                            return e.call(t, n, o, i)
                        };
                    case 4:
                        return function (n, o, i, r) {
                            return e.call(t, n, o, i, r)
                        };
                    case 5:
                        return function (n, o, i, r, a) {
                            return e.call(t, n, o, i, r, a)
                        }
                }
                return function () {
                    return e.apply(t, arguments)
                }
            }

            function o(e) {
                return e
            }

            t.exports = n
        }, {}],
        41: [function (e, t) {
            function n(e, t) {
                return l(e, t, u)
            }

            function o(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function i(e, t) {
                return function (n, o) {
                    var i = n ? f(n) : 0;
                    if (!a(i))return e(n, o);
                    for (var r = t ? i : -1, c = s(n); (t ? r-- : ++r < i) && o(c[r], r, c) !== !1;);
                    return n
                }
            }

            function r(e) {
                return function (t, n, o) {
                    for (var i = s(t), r = o(t), a = r.length, c = e ? a : -1; e ? c-- : ++c < a;) {
                        var u = r[c];
                        if (n(i[u], u, i) === !1)break
                    }
                    return t
                }
            }

            function a(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && d >= e
            }

            function s(e) {
                return c(e) ? e : Object(e)
            }

            function c(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            var u = e("lodash.keys"), d = 9007199254740991, p = i(n), l = r(), f = o("length");
            t.exports = p
        }, {"lodash.keys": 46}],
        39: [function (e, t) {
            function n(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function o(e) {
                return null != e && r(v(e))
            }

            function i(e, t) {
                return e = "number" == typeof e || l.test(e) ? +e : -1, t = null == t ? g : t, e > -1 && 0 == e % 1 && t > e
            }

            function r(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && g >= e
            }

            function a(e) {
                for (var t = c(e), n = t.length, o = n && e.length, a = !!o && r(o) && (p(e) || d(e)), s = -1, u = []; ++s < n;) {
                    var l = t[s];
                    (a && i(l, o) || h.call(e, l)) && u.push(l)
                }
                return u
            }

            function s(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function c(e) {
                if (null == e)return [];
                s(e) || (e = Object(e));
                var t = e.length;
                t = t && r(t) && (p(e) || d(e)) && t || 0;
                for (var n = e.constructor, o = -1, a = "function" == typeof n && n.prototype === e, c = Array(t), u = t > 0; ++o < t;)c[o] = o + "";
                for (var l in e)u && i(l, t) || "constructor" == l && (a || !h.call(e, l)) || c.push(l);
                return c
            }

            var u = e("lodash._getnative"), d = e("lodash.isarguments"), p = e("lodash.isarray"), l = /^\d+$/, f = Object.prototype, h = f.hasOwnProperty, m = u(Object, "keys"), g = 9007199254740991, v = n("length"), y = m ? function (e) {
                var t = null == e ? void 0 : e.constructor;
                return "function" == typeof t && t.prototype === e || "function" != typeof e && o(e) ? a(e) : s(e) ? m(e) : []
            } : a;
            t.exports = y
        }, {"lodash._getnative": 43, "lodash.isarguments": 44, "lodash.isarray": 31}],
        42: [function (e, t) {
            function n(e) {
                return null == e ? "" : e + ""
            }

            function o(e, t, n) {
                var o = typeof e;
                return "function" == o ? void 0 === t ? e : S(e, t, n) : null == e ? y : "object" == o ? a(e) : void 0 === t ? b(e) : s(e, t)
            }

            function i(e, t, n) {
                if (null != e) {
                    void 0 !== n && n in h(e) && (t = [n]);
                    for (var o = 0, i = t.length; null != e && i > o;)e = e[t[o++]];
                    return o && o == i ? e : void 0
                }
            }

            function r(e, t, n) {
                var o = t.length, i = o, r = !n;
                if (null == e)return !i;
                for (e = h(e); o--;) {
                    var a = t[o];
                    if (r && a[2] ? a[1] !== e[a[0]] : !(a[0] in e))return !1
                }
                for (; ++o < i;) {
                    a = t[o];
                    var s = a[0], c = e[s], u = a[1];
                    if (r && a[2]) {
                        if (void 0 === c && !(s in e))return !1
                    } else {
                        var d = n ? n(c, u, s) : void 0;
                        if (!(void 0 === d ? w(u, c, n, !0) : d))return !1
                    }
                }
                return !0
            }

            function a(e) {
                var t = p(e);
                if (1 == t.length && t[0][2]) {
                    var n = t[0][0], o = t[0][1];
                    return function (e) {
                        return null == e ? !1 : e[n] === o && (void 0 !== o || n in h(e))
                    }
                }
                return function (e) {
                    return r(e, t)
                }
            }

            function s(e, t) {
                var n = k(e), o = l(e) && f(t), r = e + "";
                return e = m(e), function (a) {
                    if (null == a)return !1;
                    var s = r;
                    if (a = h(a), !(!n && o || s in a)) {
                        if (a = 1 == e.length ? a : i(a, d(e, 0, -1)), null == a)return !1;
                        s = g(e), a = h(a)
                    }
                    return a[s] === t ? void 0 !== t || s in a : w(t, a[s], void 0, !0)
                }
            }

            function c(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function u(e) {
                var t = e + "";
                return e = m(e), function (n) {
                    return i(n, e, t)
                }
            }

            function d(e, t, n) {
                var o = -1, i = e.length;
                t = null == t ? 0 : +t || 0, 0 > t && (t = -t > i ? 0 : i + t), n = void 0 === n || n > i ? i : +n || 0, 0 > n && (n += i), i = t > n ? 0 : n - t >>> 0, t >>>= 0;
                for (var r = Array(i); ++o < i;)r[o] = e[o + t];
                return r
            }

            function p(e) {
                for (var t = C(e), n = t.length; n--;)t[n][2] = f(t[n][1]);
                return t
            }

            function l(e, t) {
                var n = typeof e;
                if ("string" == n && T.test(e) || "number" == n)return !0;
                if (k(e))return !1;
                var o = !E.test(e);
                return o || null != t && e in h(t)
            }

            function f(e) {
                return e === e && !v(e)
            }

            function h(e) {
                return v(e) ? e : Object(e)
            }

            function m(e) {
                if (k(e))return e;
                var t = [];
                return n(e).replace(O, function (e, n, o, i) {
                    t.push(o ? i.replace(_, "$1") : n || e)
                }), t
            }

            function g(e) {
                var t = e ? e.length : 0;
                return t ? e[t - 1] : void 0
            }

            function v(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function y(e) {
                return e
            }

            function b(e) {
                return l(e) ? c(e) : u(e)
            }

            var w = e("lodash._baseisequal"), S = e("lodash._bindcallback"), k = e("lodash.isarray"), C = e("lodash.pairs"), E = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/, T = /^\w*$/, O = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g, _ = /\\(\\)?/g;
            t.exports = o
        }, {"lodash._baseisequal": 47, "lodash._bindcallback": 45, "lodash.isarray": 35, "lodash.pairs": 48}],
        49: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && M >= e
            }

            function i(e) {
                return n(e) && o(e.length) && !!x[D.call(e)]
            }

            var r = "[object Arguments]", a = "[object Array]", s = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", p = "[object Map]", l = "[object Number]", f = "[object Object]", h = "[object RegExp]", m = "[object Set]", g = "[object String]", v = "[object WeakMap]", y = "[object ArrayBuffer]", b = "[object Float32Array]", w = "[object Float64Array]", S = "[object Int8Array]", k = "[object Int16Array]", C = "[object Int32Array]", E = "[object Uint8Array]", T = "[object Uint8ClampedArray]", O = "[object Uint16Array]", _ = "[object Uint32Array]", x = {};
            x[b] = x[w] = x[S] = x[k] = x[C] = x[E] = x[T] = x[O] = x[_] = !0, x[r] = x[a] = x[y] = x[s] = x[c] = x[u] = x[d] = x[p] = x[l] = x[f] = x[h] = x[m] = x[g] = x[v] = !1;
            var j = Object.prototype, D = j.toString, M = 9007199254740991;
            t.exports = i
        }, {}],
        50: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e, t) {
                var n = null == e ? void 0 : e[t];
                return a(n) ? n : void 0
            }

            function i(e) {
                return r(e) && l.call(e) == s
            }

            function r(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function a(e) {
                return null == e ? !1 : i(e) ? f.test(d.call(e)) : n(e) && c.test(e)
            }

            var s = "[object Function]", c = /^\[object .+?Constructor\]$/, u = Object.prototype, d = Function.prototype.toString, p = u.hasOwnProperty, l = u.toString, f = RegExp("^" + d.call(p).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            t.exports = o
        }, {}],
        51: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function i(e) {
                return null != e && r(p(e))
            }

            function r(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && d >= e
            }

            function a(e) {
                return n(e) && i(e) && c.call(e, "callee") && !u.call(e, "callee")
            }

            var s = Object.prototype, c = s.hasOwnProperty, u = s.propertyIsEnumerable, d = 9007199254740991, p = o("length");
            t.exports = a
        }, {}],
        48: [function (e, t) {
            function n(e) {
                return o(e) ? e : Object(e)
            }

            function o(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function i(e) {
                e = n(e);
                for (var t = -1, o = r(e), i = o.length, a = Array(i); ++t < i;) {
                    var s = o[t];
                    a[t] = [s, e[s]]
                }
                return a
            }

            var r = e("lodash.keys");
            t.exports = i
        }, {"lodash.keys": 46}],
        47: [function (e, t) {
            function n(e) {
                return !!e && "object" == typeof e
            }

            function o(e, t) {
                for (var n = -1, o = e.length; ++n < o;)if (t(e[n], n, e))return !0;
                return !1
            }

            function i(e, t, o, a, s, c) {
                return e === t ? !0 : null == e || null == t || !u(e) && !n(t) ? e !== e && t !== t : r(e, t, i, o, a, s, c)
            }

            function r(e, t, n, o, i, r, u) {
                var l = d(e), m = d(t), g = h, v = h;
                l || (g = E.call(e), g == f ? g = b : g != b && (l = p(e))), m || (v = E.call(t), v == f ? v = b : v != b && (m = p(t)));
                var y = g == b, w = v == b, S = g == v;
                if (S && !l && !y)return s(e, t, g);
                if (!i) {
                    var k = y && C.call(e, "__wrapped__"), T = w && C.call(t, "__wrapped__");
                    if (k || T)return n(k ? e.value() : e, T ? t.value() : t, o, i, r, u)
                }
                if (!S)return !1;
                r || (r = []), u || (u = []);
                for (var O = r.length; O--;)if (r[O] == e)return u[O] == t;
                r.push(e), u.push(t);
                var _ = (l ? a : c)(e, t, n, o, i, r, u);
                return r.pop(), u.pop(), _
            }

            function a(e, t, n, i, r, a, s) {
                var c = -1, u = e.length, d = t.length;
                if (u != d && !(r && d > u))return !1;
                for (; ++c < u;) {
                    var p = e[c], l = t[c], f = i ? i(r ? l : p, r ? p : l, c) : void 0;
                    if (void 0 !== f) {
                        if (f)continue;
                        return !1
                    }
                    if (r) {
                        if (!o(t, function (e) {
                                return p === e || n(p, e, i, r, a, s)
                            }))return !1
                    } else if (p !== l && !n(p, l, i, r, a, s))return !1
                }
                return !0
            }

            function s(e, t, n) {
                switch (n) {
                    case m:
                    case g:
                        return +e == +t;
                    case v:
                        return e.name == t.name && e.message == t.message;
                    case y:
                        return e != +e ? t != +t : e == +t;
                    case w:
                    case S:
                        return e == t + ""
                }
                return !1
            }

            function c(e, t, n, o, i, r, a) {
                var s = l(e), c = s.length, u = l(t), d = u.length;
                if (c != d && !i)return !1;
                for (var p = c; p--;) {
                    var f = s[p];
                    if (!(i ? f in t : C.call(t, f)))return !1
                }
                for (var h = i; ++p < c;) {
                    f = s[p];
                    var m = e[f], g = t[f], v = o ? o(i ? g : m, i ? m : g, f) : void 0;
                    if (!(void 0 === v ? n(m, g, o, i, r, a) : v))return !1;
                    h || (h = "constructor" == f)
                }
                if (!h) {
                    var y = e.constructor, b = t.constructor;
                    if (y != b && "constructor" in e && "constructor" in t && !("function" == typeof y && y instanceof y && "function" == typeof b && b instanceof b))return !1
                }
                return !0
            }

            function u(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            var d = e("lodash.isarray"), p = e("lodash.istypedarray"), l = e("lodash.keys"), f = "[object Arguments]", h = "[object Array]", m = "[object Boolean]", g = "[object Date]", v = "[object Error]", y = "[object Number]", b = "[object Object]", w = "[object RegExp]", S = "[object String]", k = Object.prototype, C = k.hasOwnProperty, E = k.toString;
            t.exports = i
        }, {"lodash.isarray": 35, "lodash.istypedarray": 49, "lodash.keys": 46}],
        46: [function (e, t) {
            function n(e) {
                return function (t) {
                    return null == t ? void 0 : t[e]
                }
            }

            function o(e) {
                return null != e && r(v(e))
            }

            function i(e, t) {
                return e = "number" == typeof e || l.test(e) ? +e : -1, t = null == t ? g : t, e > -1 && 0 == e % 1 && t > e
            }

            function r(e) {
                return "number" == typeof e && e > -1 && 0 == e % 1 && g >= e
            }

            function a(e) {
                for (var t = c(e), n = t.length, o = n && e.length, a = !!o && r(o) && (p(e) || d(e)), s = -1, u = []; ++s < n;) {
                    var l = t[s];
                    (a && i(l, o) || h.call(e, l)) && u.push(l)
                }
                return u
            }

            function s(e) {
                var t = typeof e;
                return !!e && ("object" == t || "function" == t)
            }

            function c(e) {
                if (null == e)return [];
                s(e) || (e = Object(e));
                var t = e.length;
                t = t && r(t) && (p(e) || d(e)) && t || 0;
                for (var n = e.constructor, o = -1, a = "function" == typeof n && n.prototype === e, c = Array(t), u = t > 0; ++o < t;)c[o] = o + "";
                for (var l in e)u && i(l, t) || "constructor" == l && (a || !h.call(e, l)) || c.push(l);
                return c
            }

            var u = e("lodash._getnative"), d = e("lodash.isarguments"), p = e("lodash.isarray"), l = /^\d+$/, f = Object.prototype, h = f.hasOwnProperty, m = u(Object, "keys"), g = 9007199254740991, v = n("length"), y = m ? function (e) {
                var t = null == e ? void 0 : e.constructor;
                return "function" == typeof t && t.prototype === e || "function" != typeof e && o(e) ? a(e) : s(e) ? m(e) : []
            } : a;
            t.exports = y
        }, {"lodash._getnative": 50, "lodash.isarguments": 51, "lodash.isarray": 35}]
    }, {}, [1])(1)
});
