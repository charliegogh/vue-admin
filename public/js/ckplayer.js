/* 2.1 */
!(function() {
    var ckplayerPath = "";
    !(function() {
        var scriptList = document.scripts,
            thisPath = scriptList[scriptList.length - 1].src;
        for (var i = 0; i < scriptList.length; i++) {
            var scriptName =
                scriptList[i].getAttribute("name") ||
                scriptList[i].getAttribute("data-name");
            if (scriptName && scriptName == "ckplayer") {
                thisPath = scriptList[i].src;
            }
        }
        ckplayerPath = thisPath.substring(0, thisPath.lastIndexOf("/") + 1);
    })();
    var ckplayer = function(obj) {
        console.log(obj,'~~~~~~~~~~~~')
        this.varsDefault = {
            playerID: "",
            container: "",
            variable: "ckplayer",
            volume: 0.8,
            poster: "",
            autoplay: false,
            loop: false,
            live: false,
            duration: 0,
            forceduration: 0,
            seek: 0,
            drag: "",
            front: "",
            next: "",
            loaded: "",
            flashplayer: false,
            html5m3u8: false,
            track: null,
            cktrack: null,
            cktrackdelay: 0,
            preview: null,
            prompt: null,
            video: null,
            config: "",
            type: "",
            crossorigin: "",
            crossdomain: "",
            unescape: false,
            mobileCkControls: false,
            mobileAutoFull: true,
            playbackrate: 1,
            h5container: "",
            debug: false,
            overspread: true,
            language: "",
            style: "",
            adfront: "",
            adfronttime: "",
            adfrontlink: "",
            adpause: "",
            adpausetime: "",
            adpauselink: "",
            adinsert: "",
            adinserttime: "",
            adinsertlink: "",
            inserttime: "",
            adend: "",
            adendtime: "",
            adendlink: "",
            advertisements: ""
        };
        this.vars = {};
        this.ckConfig = {};
        this.jsonConfig = {};
        this.ckLanguage = {};
        this.jsonLanguage = {};
        this.ckStyle = {};
        this.jsonStyle = {};
        this.contextMenu = [];
        this.errorList = [
            ["000", "Object does not exist"],
            ["001", "Variables type is not a object"],
            ["002", "Video object does not exist"],
            ["003", "Video object format error"],
            ["004", "Video object format error"],
            ["005", "Video object format error"],
            ["006", "[error] does not exist"],
            ["007", "Ajax error"],
            ["008", "Ajax error"],
            ["009", "Ajax object format error"],
            ["010", "Ajax.status:[error]"],
            ["011", "[error] File loading failed or error"],
            ["012", "[error]"]
        ];
        this.playbackRateArr = [
            [0.5, "0.5X"],
            [1, "1X"],
            [1.25, "1.25X"],
            [1.5, "1.5X"],
            [2, "2X"],
            [4, "4X"]
        ];
        this.playbackRateTemp = 1;
        this.playbackRateDefault = 1;
        this.subtitlesTemp = -1;
        this.logo = "";
        this.loaded = false;
        this.timerError = null;
        this.error = false;
        this.errorUrl = [];
        this.timerFull = null;
        this.full = false;
        this.timerTime = null;
        this.timerBuffer = null;
        this.isTimeButtonMove = true;
        this.isTimeButtonDown = false;
        this.timeButtonOver = null;
        this.buttonHide = false;
        this.isClick = false;
        this.timerClick = null;
        this.timerCBar = null;
        this.needSeek = 0;
        this.volume = 0;
        this.volumeTemp = 0;
        this.time = 0;
        this.isFirst = true;
        this.html5Video = true;
        this.pdCoor = {
            x: 0,
            y: 0
        };
        this.playerType = "html5video";
        this.loadTime = 0;
        this.body = document.body || document.documentElement;
        this.V = null;
        this.listenerJsArr = [];
        this.buttonLen = 0;
        this.buttonArr = [];
        this.elementArr = [];
        this.elementTempArr = [];
        this.track = [];
        this.trackIndex = 0;
        this.nowTrackShow = {
            sn: ""
        };
        this.trackElement = [];
        this.timerVCanvas = null;
        this.animateArray = [];
        this.animateElementArray = [];
        this.animatePauseArray = [];
        this.previewStart = 0;
        this.previewDiv = null;
        this.previewTop = null;
        this.previewWidth = 120;
        this.previewTween = null;
        this.isM3u8 = false;
        this.promptArr = [];
        this.promptElement = null;
        this.conBarShow = true;
        this.errorAdd = false;
        this.errorSend = false;
        this.controlBarIsShow = true;
        this.videoScale = 1;
        (this.fontFamily = ""), (this.timeSliderLeftTemp = 0);
        this.durationSendJS = false;
        this.adAnalysisEnd = false;
        this.advertisements = {};
        this.isFirstTimePlay = true;
        this.adType = "";
        this.adI = 0;
        this.videoTemp = {
            src: "",
            source: "",
            currentSrc: "",
            loop: false
        };
        this.adTimeAllTotal = 0;
        this.adTimeTotal = 0;
        this.adCountDownObj = null;
        this.adPlayStart = false;
        this.adPlayerPlay = false;
        this.adIsPause = false;
        this.adVideoMute = false;
        this.adIsVideoTime = false;
        this.endAdPlay = false;
        this.adPauseShow = false;
        this.adReset = false;
        this.videoClickXy = {
            x: 0,
            y: 0
        };
        this.adVideoPlay = false;
        this.loadTimeTemp = 0;
        this.hlsAutoPlay = true;
        this.loadingShow = false;
        this.videoString = "";
        this.customeElement = [];
        this.cdWH = {
            w: 0,
            h: 0
        };
        this.CB = {};
        if (obj && this.isSupportPlay(obj)) {
            var _this = this;
            this.viewingPermission(function(auth, msg) {
                if (auth) {
                    _this.embed(obj);
                    _this.commonStyle();
                    if (obj["html5m3u8"] && window.MediaSource && obj["poster"]) {
                        _this.setPoster();
                    }
                } else {
                    _this.setErrorText(obj, msg);
                }
            }, obj);
        } else {
            this.noSupportText(obj);
        }
    };
    ckplayer.prototype = {
        /* 是否支持m3u8文件 */
        isSupportPlay: function(obj) {
            //   console.log(window.MediaSource, "window.MediaSource");
            //   console.log(window.WebKitMediaSource, "window.WebKitMediaSource");
            this.mobileTrue = this.isMobile();
            this.CurrentBrowser = this.GetCurrentBrowser();
            if (this.CurrentBrowser == "IE") {
                //PC端
                return window.MediaSource && obj["html5m3u8"];
            } else {
                return true;
            }
        },
        /* PC不支持提示语  */
        noSupportText: function(obj) {
            if (this.CurrentBrowser == "IE") {
                this.setErrorText(obj, "请更新版本或使用其他浏览器！");
            }
            /* else if (this.CurrentBrowser == "QQ") {
        this.setErrorText(obj, "当前浏览器不支持播放！");
      } */
        },
        /* 提示语 */
        setErrorText: function(obj, text) {
            var dom = window.document.querySelector(obj["container"]);
            dom.innerHTML = text;
            dom.style.background = "#000";
            dom.style.color = "#fff";
            dom.style.fontSize = "16px";
            dom.style.textAlign = "center";
            dom.style.lineHeight = dom.clientHeight + "px";
        },
        commonStyle: function() {
            var content =
                "video::-webkit-media-controls-panel { width: calc(100% + 50px) !important;} video::-internal-media-controls-download-button {display:none !important;} video {display: block !important;}video::-webkit-media-controls {display: none !important;}video::-webkit-media-controls-enclosure {display: none !important;}";
            var style = document.createElement("style");
            style.innerHTML = content;
            document.getElementsByTagName("head")[0].appendChild(style);
        },
        setPoster: function(src) {
            var posterImg = document.getElementById("posterImg");
            var dom = posterImg ? posterImg : document.createElement("img");
            dom.src = src ? src : this.vars["poster"];
            dom.id = "posterImg";
            dom.style = "position: absolute;top: 0;left: 0;width: 100%;height: 100%;";
            this.getByElement(this.vars["container"]).appendChild(dom);
        },
        embed: function(c) {
            if (window.location.href.substr(0, 7) == "file://") {
                alert("Please use the HTTP protocol to open the page");
                return;
            }
            if (this.isUndefined(c)) {
                this.eject(this.errorList[0]);
                return;
            }
            if (this.varType(c) != "object") {
                this.eject(this.errorList[1]);
            }
            this.vars = this.standardization(this.varsDefault, c);
            if (!this.vars["mobileCkControls"] && this.mobileTrue) {
                this.vars["flashplayer"] = false;
                this.conBarShow = false;
            }
            var videoStringTemp = this.vars["video"];
            if (!videoStringTemp) {
                this.eject(this.errorList[2]);
                return;
            }
            if (this.varType(videoStringTemp) == "string") {
                if (
                    videoStringTemp.substr(0, 3) == "CK:" ||
                    videoStringTemp.substr(0, 3) == "CE:" ||
                    videoStringTemp.substr(8, 3) == "CK:" ||
                    videoStringTemp.substr(8, 3) == "CE:"
                ) {
                    this.vars["flashplayer"] = true;
                }
            }
            if (this.varType(videoStringTemp) == "object") {
                if (videoStringTemp.length > 1) {
                    if (
                        videoStringTemp[0][0].substr(0, 3) == "CK:" ||
                        videoStringTemp[0][0].substr(0, 3) == "CE:" ||
                        videoStringTemp[0][0].substr(8, 3) == "CK:" ||
                        videoStringTemp[0][0].substr(8, 3) == "CE:"
                    ) {
                        this.vars["flashplayer"] = true;
                    }
                }
            }
            this.videoString = videoStringTemp;
            this.checkUpConfig();
        },
        checkUpConfig: function() {
            var thisTemp = this;
            var jsTemp = null;
            if (this.vars["config"]) {
                if (this.vars["config"].substr(0, 8) != "website:") {
                    jsTemp = eval(this.vars["config"] + "()");
                    if (!this.isUndefined(jsTemp)) {
                        this.ckConfig = this.newObj(jsTemp);
                        this.jsonConfig = this.newObj(jsTemp);
                        this.loadConfig(null);
                    } else {
                        this.loadConfig(ckplayerPath + this.vars["config"]);
                    }
                } else {
                    this.loadConfig(ckplayerPath + this.vars["config"].substr(8));
                }
            } else {
                try {
                    var isFun = false;
                    try {
                        if (typeof ckplayerConfig === "function") {
                            isFun = true;
                        }
                    } catch (e) {}
                    if (isFun) {
                        jsTemp = ckplayerConfig();
                        if (jsTemp) {
                            this.ckConfig = this.newObj(jsTemp);
                            this.jsonConfig = this.newObj(jsTemp);
                            this.loadConfig(null);
                        } else {
                            this.loadConfig(ckplayerPath + "ckplayer.json");
                        }
                    } else {
                        this.loadConfig(ckplayerPath + "ckplayer.json");
                    }
                } catch (e) {
                    thisTemp.sysError(thisTemp.errorList[12], e);
                }
            }
        },
        loadConfig: function(file) {
            var thisTemp = this;
            if (file) {
                this.ajax({
                    url: file,
                    success: function(data) {
                        if (data) {
                            thisTemp.ckConfig = data;
                            thisTemp.jsonConfig = thisTemp.newObj(data);
                            if (!thisTemp.isUndefined(data["flashvars"])) {
                                thisTemp.vars = thisTemp.objectAssign(
                                    data["flashvars"],
                                    thisTemp.vars
                                );
                            }
                            thisTemp.checkUpLanguage();
                        } else {
                            thisTemp.sysError(thisTemp.errorList[11], "Config");
                        }
                    },
                    error: function(data) {
                        thisTemp.sysError(thisTemp.errorList[12], data);
                    }
                });
            } else {
                this.checkUpLanguage();
            }
        },
        checkUpLanguage: function() {
            var thisTemp = this;
            var languagePath = "";
            var jsTemp = null;
            if (this.vars["language"]) {
                languagePath = this.vars["language"];
            } else {
                if (this.ckConfig["languagePath"]) {
                    languagePath = this.ckConfig["languagePath"];
                }
            }
            if (languagePath) {
                if (languagePath.substr(0, 8) != "website:") {
                    jsTemp = eval(languagePath + "()");
                    if (jsTemp) {
                        this.ckLanguage = this.newObj(jsTemp);
                        this.jsonLanguage = this.newObj(jsTemp);
                        this.loadLanguage(null);
                    } else {
                        this.loadLanguage(ckplayerPath + languagePath);
                    }
                } else {
                    this.loadLanguage(ckplayerPath + languagePath.substr(8));
                }
            } else {
                try {
                    var isFun = false;
                    try {
                        if (typeof ckplayerLanguage === "function") {
                            isFun = true;
                        }
                    } catch (e) {}
                    if (isFun) {
                        jsTemp = ckplayerLanguage();
                        if (jsTemp) {
                            this.ckLanguage = this.newObj(jsTemp);
                            this.jsonLanguage = this.newObj(jsTemp);
                            this.loadLanguage(null);
                        } else {
                            this.loadLanguage(ckplayerPath + "language.json");
                        }
                    } else {
                        this.loadLanguage(ckplayerPath + "language.json");
                    }
                } catch (e) {
                    thisTemp.sysError(thisTemp.errorList[12], e);
                }
            }
        },
        loadLanguage: function(file) {
            var thisTemp = this;
            if (file) {
                this.ajax({
                    url: file,
                    success: function(data) {
                        if (data) {
                            thisTemp.ckLanguage = data;
                            thisTemp.jsonLanguage = thisTemp.newObj(data);
                            thisTemp.checkUpStyle();
                        } else {
                            thisTemp.sysError(thisTemp.errorList[11], "language.json");
                        }
                    },
                    error: function(data) {
                        thisTemp.sysError(thisTemp.errorList[12], data);
                    }
                });
            } else {
                this.checkUpStyle();
            }
        },
        checkUpStyle: function() {
            var stylePath = "";
            var jsTemp = null;
            var configJs = this.newObj(this.ckConfig);
            if (this.vars["style"]) {
                stylePath = this.vars["style"];
            } else {
                if (this.ckConfig["stylePath"]) {
                    stylePath = "" + this.ckConfig["stylePath"];
                }
            }
            if (stylePath) {
                if (stylePath.substr(0, 8) != "website:") {
                    jsTemp = eval(stylePath + "()");
                    if (!this.isUndefined(jsTemp)) {
                        this.jsonStyle = this.newObj(jsTemp);
                        this.ckStyle = this.newObj(jsTemp);
                        this.ckStyle["advertisement"] = this.objectAssign(
                            configJs["style"]["advertisement"],
                            this.ckStyle["advertisement"]
                        );
                        this.ckStyle = this.objectAssign(configJs["style"], this.ckStyle);
                        this.loadStyle(null);
                    } else {
                        this.loadStyle(ckplayerPath + stylePath);
                    }
                } else {
                    this.loadStyle(ckplayerPath + stylePath.substr(8));
                }
            } else {
                try {
                    var isFun = false;
                    try {
                        if (typeof ckplayerStyle === "function") {
                            isFun = true;
                        }
                    } catch (e) {
                        isFun = false;
                    }
                    if (isFun) {
                        jsTemp = ckplayerStyle();
                        if (!this.isUndefined(jsTemp)) {
                            this.jsonStyle = this.newObj(jsTemp);
                            this.ckStyle = this.newObj(jsTemp);
                            this.ckStyle["advertisement"] = this.objectAssign(
                                configJs["style"]["advertisement"],
                                this.ckStyle["advertisement"]
                            );
                            this.ckStyle = this.objectAssign(configJs["style"], this.ckStyle);
                            this.loadStyle(null);
                        } else {
                            if (this.mobileTrue) {
                                this.loadStyle(ckplayerPath + "style.mobile.json");
                                return;
                            }
                            this.loadStyle(ckplayerPath + "style.json");
                        }
                    } else {
                        if (this.mobileTrue) {
                            this.loadStyle(ckplayerPath + "style.mobile.json");
                            return;
                        }
                        this.loadStyle(ckplayerPath + "style.json");
                    }
                } catch (e) {}
            }
        },
        loadStyle: function(file) {
            var thisTemp = this;
            if (file) {
                var configJs = this.newObj(this.ckConfig);
                this.ajax({
                    url: file,
                    success: function(data) {
                        if (data) {
                            thisTemp.jsonStyle = thisTemp.newObj(data);
                            thisTemp.ckStyle = thisTemp.newObj(data);
                            thisTemp.ckStyle["advertisement"] = thisTemp.objectAssign(
                                configJs["style"]["advertisement"],
                                thisTemp.ckStyle["advertisement"]
                            );
                            thisTemp.ckStyle = thisTemp.objectAssign(
                                configJs["style"],
                                thisTemp.ckStyle
                            );
                            thisTemp.loadConfigHandler();
                        } else {
                            thisTemp.sysError(thisTemp.errorList[11], "Style");
                        }
                    },
                    error: function(data) {
                        thisTemp.sysError(thisTemp.errorList[12], data);
                    }
                });
            } else {
                this.loadConfigHandler();
            }
        },
        loadConfigHandler: function() {
            if (
                (!this.supportVideo() && this.vars["flashplayer"] != "") ||
                (this.vars["flashplayer"] && this.uploadFlash()) ||
                !this.isMsie()
            ) {
                this.html5Video = false;
                this.getVideo();
            } else if (this.videoString) {
                this.analysedVideoUrl(this.videoString);
            } else {
                this.eject(this.errorList[2]);
            }
        },
        changeM3u8Url: function(url) {
            if (
                url.slice(url.length - 5, url.length) == ".m3u8" &&
                url.indexOf("_0.m3u8") == -1
            ) {
                url = url.slice(0, url.length - 5) + "_0.m3u8";
            }
            return url;
        },
        hasMediaSource: function() {
            window.MediaSource = window.MediaSource || window.WebKitMediaSource;
            return (
                window.MediaSource &&
                typeof window.MediaSource.isTypeSupported === "function" &&
                window.MediaSource.isTypeSupported(
                    'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
                )
            );
        },
        isSupportedMediaSource: function(video) {
            if (!this.hasMediaSource()) {
                var url = null;
                switch (this.varType(video)) {
                    case "string":
                        url = video;
                        url = this.changeM3u8Url(url);
                        video = url;
                        break;
                    case "array":
                        for (var i = 0; i < video.length; i++) {
                            if (this.varType(video[0]) == "array") {
                                url = video[i][0];
                                url = this.changeM3u8Url(url);
                                video[i][0] = url;
                            } else {
                                url = video[i];
                                url = this.changeM3u8Url(url);
                                video[i] = url;
                            }
                        }
                        break;
                }
            }
            return video;
        },
        analysedVideoUrl: function(video, isChange, time) {
            if (time || time === 0) this.vars["seek"] = time;
            window.playerOnce = false;
            var videoType = this.varType(video);
            var fileExt = null;
            if (videoType == "string") {
                fileExt = this.getFileExt(video);
            } else {
                fileExt = video[0][1];
            }
            if (isChange) {
                if (videoType == "string") {
                    this.html5m3u8 = fileExt == ".m3u8" ? true : false;
                } else {
                    this.html5m3u8 = fileExt == "video/m3u8" ? true : false;
                }
                this.vars["html5m3u8"] = this.html5m3u8;
            }
            video = this.isSupportedMediaSource(video);
            var thisTemp = this;
            this.VA = [];
            if (videoType == "string") {
                if (video.substr(0, 8) != "website:") {
                    this.VA = [[video, "", "", 0]];
                    switch (fileExt) {
                        case ".mp4":
                            this.VA[0][1] = "video/mp4";
                            break;
                        case ".m3u8":
                            this.VA[0][1] = "video/m3u8";
                            break;
                        case ".ogg":
                            this.VA[0][1] = "video/ogg";
                            break;
                        case ".webm":
                            this.VA[0][1] = "video/webm";
                            break;
                        default:
                            break;
                    }
                    this.getVideo();
                } else {
                    if (this.html5Video) {
                        var ajaxObj = {
                            url: video.substr(8),
                            success: function(data) {
                                if (data) {
                                    thisTemp.analysedUrl(data);
                                } else {
                                    thisTemp.eject(thisTemp.errorList[5]);
                                    this.VA = video;
                                    thisTemp.getVideo();
                                }
                            },
                            error: function(data) {
                                thisTemp.eject(thisTemp.errorList[12], data);
                            }
                        };
                        this.ajax(ajaxObj);
                    } else {
                        this.VA = video;
                        this.getVideo();
                    }
                }
            } else if (videoType == "array") {
                if (this.varType(video[0]) == "array") {
                    this.VA = video;
                }
                this.getVideo();
            } else if (videoType == "object") {
                if (!this.isUndefined(video["type"])) {
                    this.VA.push([video["file"], video["type"], "", 0]);
                    this.getVideo();
                } else {
                    this.eject(this.errorList[5]);
                }
            } else {
                this.eject(this.errorList[4]);
            }
        },
        analysedUrl: function(data) {
            this.vars = this.standardization(this.vars, data);
            if (!this.isUndefined(data["video"])) {
                this.vars["video"] = data["video"];
            }
            this.analysedVideoUrl(this.vars["video"]);
        },
        getHtml5Video: function() {
            var va = this.VA;
            var nva = [];
            var mobile = this.mobileTrue;
            var video = document.createElement("video");
            var codecs = function(type) {
                var cod = "";
                switch (type) {
                    case "video/mp4":
                        cod = "avc1.4D401E, mp4a.40.2";
                        break;
                    case "video/ogg":
                        cod = "theora, vorbis";
                        break;
                    case "video/webm":
                        cod = "vp8.0, vorbis";
                        break;
                    default:
                        break;
                }
                return cod;
            };
            var supportType = function(vidType, codType) {
                if (!video.canPlayType) {
                    this.html5Video = false;
                    return;
                }
                var isSupp = video.canPlayType(vidType + ';codecs="' + codType + '"');
                if (isSupp == "") {
                    return false;
                }
                return true;
            };
            if (!this.isMsie()) {
                this.html5Video = false;
                return;
            }
            for (var i = 0; i < va.length; i++) {
                var v = va[i];
                if (v) {
                    if (
                        v[1] != "" &&
                        !mobile &&
                        supportType(v[1], codecs(v[1])) &&
                        v[0].substr(0, 4) != "rtmp"
                    ) {
                        nva.push(v);
                    }
                    if (
                        (this.getFileExt(v[0]) == ".m3u8" ||
                            this.vars["type"] == "video/m3u8" ||
                            this.vars["type"] == "m3u8" ||
                            v[1] == "video/m3u8" ||
                            v[1] == "m3u8") &&
                        this.vars["html5m3u8"] &&
                        !mobile
                    ) {
                        nva.push(v);
                    }
                }
            }
            if (nva.length > 0) {
                this.VA = nva;
            } else {
                if (!mobile) {
                    this.html5Video = false;
                }
            }
            if (!this.hasMediaSource()) {
                this.isM3u8 = false;
            } else {
                this.isM3u8 = this.vars["html5m3u8"];
            }
        },
        getVideo: function() {
            var thisTemp = this;
            var v = this.vars;
            if (
                !this.adAnalysisEnd &&
                (v["adfront"] != "" ||
                    v["adpause"] != "" ||
                    v["adinsert"] != "" ||
                    v["adend"] != "" ||
                    v["advertisements"] != "")
            ) {
                this.adAnalysisEnd = true;
                this.adAnalysis();
                return;
            }
            if (this.V && window.Hls) {
                this.changeVideo();
                return;
            }
            if (this.vars["cktrack"]) {
                this.loadTrack();
            }
            if (this.supportVideo()) {
                this.getHtml5Video();
            }
            var src = "",
                isModel = this.mobileTrue,
                source = "",
                poster = "",
                loop = "",
                autoplay = "",
                muted = "",
                track = "",
                crossorigin = "";
            var i = 0;
            var vBg = this.ckStyle["background"]["backgroundColor"].replace(
                "0x",
                "#"
            );
            this.CD = this.getByElement(v["container"]);
            for (var k in this.ckStyle["container"]) {
                this.CD.style[k] = this.ckStyle["container"][k];
            }
            var volume = v["volume"];
            if (this.isUndefined(this.CD)) {
                this.eject(this.errorList[6], v["container"]);
                return false;
            }
            this.V = undefined;
            var thisPd = null;
            if (v["h5container"] != "") {
                thisPd = this.getByElement(v["h5container"]);
                if (this.isUndefined(thisPd)) {
                    thisPd = null;
                }
            }
            var isVideoH5 = null;
            if (v["playerID"] != "") {
                isVideoH5 = this.getByElement("#" + v["playerID"]);
                if (this.isUndefined(isVideoH5)) {
                    isVideoH5 = null;
                }
            }
            if (thisPd != null && isVideoH5 != null) {
                this.PD = thisPd;
            } else {
                var playerID = "ckplayer-" + this.randomString();
                var playerDiv = document.createElement("div");
                playerDiv.className = playerID;
                this.CD.innerHTML = "";
                this.CD.appendChild(playerDiv);
                this.PD = playerDiv;
            }
            this.css(this.CD, {
                backgroundColor: vBg,
                overflow: "hidden",
                position: "relative"
            });
            this.css(this.PD, {
                backgroundColor: vBg,
                width: "100%",
                height: "100%",
                fontFamily: this.fontFamily,
                position: "relative"
            });
            this.PD.onselectstart = this.PD.ondrag = function() {
                return false;
            };
            if (this.VA.length == 1) {
                this.videoTemp["src"] = decodeURIComponent(this.VA[0][0]);
                src = ' src="' + this.videoTemp["src"] + '"';
            } else {
                var videoArr = this.VA.slice(0);
                videoArr = this.arrSort(videoArr);
                for (i = 0; i < videoArr.length; i++) {
                    var type = "";
                    var va = videoArr[i];
                    if (va[1]) {
                        type = ' type="' + va[1] + '"';
                        if (type == ' type="video/m3u8"' || type == ' type="m3u8"') {
                            type = "";
                        }
                    }
                    source +=
                        '<source src="' + decodeURIComponent(va[0]) + '"' + type + ">";
                }
                this.videoTemp["source"] = source;
            }
            if (v["autoplay"]) {
                autoplay = ' autoplay="autoplay"';
                muted = "muted";
            }
            if (v["poster"]) {
                poster = ' poster="' + v["poster"] + '"';
            }
            if (v["loop"]) {
                loop = ' loop="loop"';
            }
            if (v["seek"] > 0) {
                this.needSeek = v["seek"];
            }
            if (v["track"] != null && v["cktrack"] == null) {
                var trackArr = v["track"];
                var trackDefault = "";
                var defaultHave = false;
                for (i = 0; i < trackArr.length; i++) {
                    var trackObj = trackArr[i];
                    if (trackObj["default"] && !defaultHave) {
                        trackDefault = " default";
                        defaultHave = true;
                    } else {
                        trackDefault = "";
                    }
                    track +=
                        '<track kind="' +
                        trackObj["kind"] +
                        '" src="' +
                        trackObj["src"] +
                        '" srclang="' +
                        trackObj["srclang"] +
                        '" label="' +
                        trackObj["label"] +
                        '"' +
                        trackDefault +
                        ">";
                }
            }
            if (v["crossorigin"]) {
                crossorigin = ' crossorigin="' + v["crossorigin"] + '"';
            }
            var autoLoad = this.ckConfig["config"]["autoLoad"];
            var preload = "";
            if (!autoLoad) {
                preload = ' preload="meta"';
            }
            var vid = this.randomString();
            var controls = "";
            var mobileAutoFull = v["mobileAutoFull"];
            var mobileautofull = "";
            if (!mobileAutoFull) {
                mobileautofull =
                    ' x-webkit-airplay="true" playsinline  webkit-playsinline="true"  x5-video-player-type="h5"';
            }
            if (isModel) {
                controls = ' controls="false"';
            }
            if (isVideoH5 != null && thisPd != null) {
                this.V = isVideoH5;
                if (v["poster"]) {
                    this.V.poster = v["poster"];
                }
            } else {
                var html = "";
                if (!this.isM3u8) {
                    html =
                        "<video " +
                        muted +
                        ' id="' +
                        vid +
                        '"' +
                        src +
                        ' width="100%" height="100%"' +
                        autoplay +
                        poster +
                        loop +
                        preload +
                        controls +
                        mobileautofull +
                        track +
                        crossorigin +
                        ">" +
                        source +
                        "</video>";
                } else {
                    html =
                        "<video " +
                        muted +
                        ' data-setup="{}" id="' +
                        vid +
                        '" type="' +
                        this.VA[0][2] +
                        '" width="100%" height="100%"' +
                        poster +
                        loop +
                        preload +
                        controls +
                        mobileautofull +
                        track +
                        crossorigin +
                        "></video>";
                }
                this.PD.innerHTML = html;
                this.V = this.getByElement("#" + vid);
                for (var k in this.ckStyle["video"]["h5Video"]) {
                    this.V.style[k] = this.ckStyle["video"]["h5Video"][k];
                }
            }
            try {
                this.V.volume = volume;
                if (this.playbackRateArr && this.vars["playbackrate"] > -1) {
                    if (this.vars["playbackrate"] < this.playbackRateArr.length) {
                        this.playbackRateDefault = this.vars["playbackrate"];
                    }
                    this.V.playbackRate = this.playbackRateArr[
                        this.playbackRateDefault
                        ][0];
                }
            } catch (error) {}
            this.css(this.V, {
                backgroundColor: vBg,
                width: "100%",
                height: "100%"
            });
            if (this.isM3u8) {
                var currentPlayI = 0;
                /* if (isModel) {
            currentPlayI = 1;
          } */
                var loadJsHandler = function() {
                    var url = thisTemp.VA[currentPlayI][0];
                    thisTemp.embedHls(url, v["autoplay"]);
                };
                if (window.Hls) {
                    loadJsHandler();
                } else {
                    var _this = this;
                    _this.loadJs(ckplayerPath + "/crypto-js.js", function() {
                        _this.loadJs(ckplayerPath + "/Base64.js", function() {
                            _this.loadJs(ckplayerPath + "/hls.js", loadJsHandler);
                        });
                    });
                }
            }
            this.css(this.V, "backgroundColor", vBg);
            if (this.ckConfig["config"]["videoDrawImage"]) {
                var canvasDiv = document.createElement("div");
                this.PD.appendChild(canvasDiv);
                this.MD = canvasDiv;
                this.css(this.MD, {
                    backgroundColor: vBg,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    display: "none",
                    cursor: "pointer",
                    left: "0px",
                    top: "0px",
                    zIndex: "10"
                });
                var cvid = "ccanvas" + this.randomString();
                this.MD.innerHTML = this.newCanvas(
                    cvid,
                    this.MD.offsetWidth,
                    this.MD.offsetHeight
                );
                this.MDC = this.getByElement(cvid + "-canvas");
                this.MDCX = this.MDC.getContext("2d");
            }
            this.addVEvent();
            if (this.conBarShow) {
                this.definition();
                if (
                    !this.vars["live"] &&
                    this.vars["canPlaybackRate"] &&
                    this.playbackRateArr &&
                    this.vars["playbackrate"] > -1
                ) {
                    this.playbackRate();
                }
                if (v["autoplay"]) {
                    this.loadingStart(true);
                }
                this.subtitleSwitch();
            }
            this.playerLoad();
        },
        adAnalysis: function() {
            var thisTemp = this;
            var v = this.vars;
            var isAdvShow = [];
            var i = 0;
            if (
                v["advertisements"] != "" &&
                v["advertisements"].substr(0, 8) == "website:"
            ) {
                var ajaxObj = {
                    url: v["advertisements"].substr(8),
                    success: function(data) {
                        if (data) {
                            var newData = {};
                            var val = null;
                            try {
                                if (
                                    !thisTemp.isUndefined(data["front"]) ||
                                    !thisTemp.isUndefined(data["pause"]) ||
                                    !thisTemp.isUndefined(data["end"]) ||
                                    !thisTemp.isUndefined(data["insert"]) ||
                                    !thisTemp.isUndefined(data["other"])
                                ) {
                                    val = thisTemp.arrayDel(data["front"]);
                                    if (!thisTemp.isUndefined(val)) {
                                        newData["front"] = val;
                                    }
                                    val = thisTemp.arrayDel(data["pause"]);
                                    if (!thisTemp.isUndefined(val)) {
                                        newData["pause"] = val;
                                    }
                                    val = thisTemp.arrayDel(data["insert"]);
                                    if (!thisTemp.isUndefined(val)) {
                                        newData["insert"] = val;
                                        if (!thisTemp.isUndefined(data["inserttime"])) {
                                            newData["inserttime"] = thisTemp.arrayInt(
                                                data["inserttime"]
                                            );
                                            isAdvShow = [];
                                            for (i = 0; i < newData["inserttime"].length; i++) {
                                                isAdvShow.push(false);
                                            }
                                            newData["insertPlay"] = isAdvShow;
                                        }
                                    }
                                    val = thisTemp.arrayDel(data["end"]);
                                    if (!thisTemp.isUndefined(val)) {
                                        newData["end"] = val;
                                    }
                                    val = thisTemp.arrayDel(data["other"]);
                                    if (!thisTemp.isUndefined(val)) {
                                        newData["other"] = val;
                                        isAdvShow = [];
                                        var arrTemp = [];
                                        for (i = 0; i < val.length; i++) {
                                            isAdvShow.push(false);
                                            arrTemp.push(parseInt("0" + val[i]["startTime"]));
                                        }
                                        newData["othertime"] = arrTemp;
                                        newData["otherPlay"] = isAdvShow;
                                    }
                                }
                            } catch (event) {
                                thisTemp.log(event);
                            }
                            thisTemp.advertisements = newData;
                        }
                        thisTemp.getVideo();
                    },
                    error: function() {}
                };
                this.ajax(ajaxObj);
            } else {
                this.adAnalysisOne(
                    "front",
                    "adfront",
                    "adfronttime",
                    "adfrontlink",
                    "adfronttype"
                );
                this.adAnalysisOne(
                    "pause",
                    "adpause",
                    "adpausetime",
                    "adpauselink",
                    "adpausetype"
                );
                this.adAnalysisOne(
                    "insert",
                    "adinsert",
                    "adinserttime",
                    "adinsertlink",
                    "adinserttype"
                );
                this.adAnalysisOne(
                    "end",
                    "adend",
                    "adendtime",
                    "adendlink",
                    "adendtype"
                );
                if (!this.isUndefined(this.advertisements["insert"])) {
                    if (!this.isUndefined(v["inserttime"])) {
                        thisTemp.advertisements["inserttime"] = v["inserttime"];
                    }
                }
                if (!this.isUndefined(thisTemp.advertisements["inserttime"])) {
                    thisTemp.advertisements["inserttime"] = thisTemp.arrayInt(
                        thisTemp.advertisements["inserttime"]
                    );
                    var isInsert = [];
                    for (i = 0; i < thisTemp.advertisements["inserttime"].length; i++) {
                        isInsert.push(false);
                    }
                    thisTemp.advertisements["insertPlay"] = isInsert;
                }
                thisTemp.getVideo();
            }
        },
        arrayDel: function(arr) {
            if (this.isUndefined(arr)) {
                return arr;
            }
            if (arr.length == 0) {
                return null;
            }
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                var type = arr[i]["type"];
                if (type == "mp4" || type == "mov" || this.isStrImage(type)) {
                    newArr.push(arr[i]);
                }
            }
            if (newArr.length > 0) {
                return newArr;
            }
            return null;
        },
        adAnalysisOne: function(adType, adName, adTime, adLink, adStype) {
            var v = this.vars;
            if (this.isUndefined(v[adName])) {
                v[adName] = "";
            }
            if (this.isUndefined(v[adTime])) {
                v[adTime] = "";
            }
            if (this.isUndefined(v[adLink])) {
                v[adLink] = "";
            }
            if (this.isUndefined(v[adStype])) {
                v[adStype] = "";
            }
            if (v[adName] != "") {
                var adList = [];
                var ad = v[adName].split(",");
                var adtime = v[adTime].split(",");
                var adlink = v[adLink].split(",");
                var adstype = v[adStype].split(",");
                var i = 0;
                if (ad.length > 0) {
                    var adLinkLen = adlink.length,
                        adTimeLen = adtime.length;
                    if (v[adLink] == "") {
                        adLinkLen = 0;
                        adlink = [];
                    }
                    if (v[adTime] == "") {
                        adTimeLen = 0;
                        adtime = [];
                    }
                    if (adLinkLen < ad.length) {
                        for (i = adLinkLen; i < ad.length; i++) {
                            adlink.push("");
                        }
                    }
                    if (adTimeLen < ad.length) {
                        for (i = adTimeLen; i < ad.length; i++) {
                            adtime.push("");
                        }
                    }
                    var adstypeLen = adstype.length;
                    if (v[adStype] == "") {
                        adstypeLen = 0;
                        adstype = [];
                    }
                    if (adstypeLen < ad.length) {
                        for (i = adstypeLen; i < ad.length; i++) {
                            adstype.push(this.getFileExt(ad[i]).replace(".", ""));
                        }
                    }
                    for (i = 0; i < ad.length; i++) {
                        var type = adstype[i];
                        if (type == "mp4" || type == "mov" || this.isStrImage(type)) {
                            var obj = {
                                file: ad[i],
                                type: type,
                                time:
                                    parseInt(adtime[i]) > 0
                                        ? parseInt(adtime[i])
                                        : this.ckStyle["advertisement"]["time"],
                                link: adlink[i]
                            };
                            adList.push(obj);
                        }
                    }
                    if (this.isUndefined(this.advertisements)) {
                        this.advertisements = {};
                    }
                    if (adList.length > 0) {
                        this.advertisements[adType] = adList;
                    }
                }
            }
        },
        playerLoad: function() {
            var thisTemp = this;
            if (this.isFirst) {
                this.isFirst = false;
                setTimeout(function() {
                    thisTemp.loadedHandler();
                }, 1);
            }
        },
        addVEvent: function() {
            var thisTemp = this;
            var duration = 0;
            var eventVideoClick = function(event) {
                thisTemp.videoClickXy = {
                    x: event.clientX,
                    y: event.clientY
                };
                thisTemp.videoClick();
            };
            this.addListenerInside("click", eventVideoClick);
            this.addListenerInside("click", eventVideoClick, this.MDC);
            this.timerErrorFun();
            var eventJudgeIsLive = function() {
                thisTemp.sendJS("loadedmetadata");
                if (
                    thisTemp.varType(thisTemp.V.duration) == "number" &&
                    thisTemp.V.duration > 1
                ) {
                    duration = thisTemp.V.duration;
                    if (!duration) {
                        if (thisTemp.vars["duration"] > 0) {
                            duration = thisTemp.vars["duration"];
                        }
                    }
                    if (thisTemp.vars["forceduration"] > 0) {
                        duration = thisTemp.vars["forceduration"];
                    }
                    thisTemp.sendJS("duration", duration);
                    thisTemp.formatInserttime(duration);
                    if (thisTemp.adPlayerPlay) {
                        thisTemp.advertisementsTime(duration + 1);
                    }
                    thisTemp.durationSendJS = true;
                }
                if (thisTemp.conBarShow) {
                    thisTemp.V.controls = null;
                    thisTemp.videoCss();
                }
                thisTemp.judgeIsLive();
            };
            var eventPlaying = function(event) {
                thisTemp.playingHandler();
                thisTemp.sendJS("play");
                thisTemp.sendJS("paused", false);
                if (
                    !thisTemp.durationSendJS &&
                    thisTemp.varType(thisTemp.V.duration) == "number" &&
                    thisTemp.V.duration > 0
                ) {
                    duration = thisTemp.V.duration;
                    if (!duration) {
                        if (thisTemp.vars["duration"] > 0) {
                            duration = thisTemp.vars["duration"];
                        }
                    }
                    if (thisTemp.vars["forceduration"] > 0) {
                        duration = thisTemp.vars["forceduration"];
                    }
                    thisTemp.durationSendJS = true;
                    thisTemp.sendJS("duration", duration);
                    thisTemp.formatInserttime(duration);
                }
                if (document.getElementById("posterImg"))
                    document.getElementById("posterImg").style.display = "none";
            };
            this.addListenerInside("playing", eventPlaying);
            var eventPause = function(event) {
                thisTemp.pauseHandler();
                thisTemp.sendJS("pause");
                thisTemp.sendJS("paused", true);
            };
            this.addListenerInside("pause", eventPause);
            var eventEnded = function(event) {
                thisTemp.endedHandler();
            };
            this.addListenerInside("ended", eventEnded);
            var eventTimeupdate = function(event) {
                if (thisTemp.loadingShow) {
                    thisTemp.loadingStart(false);
                }
                if (thisTemp.time) {
                    if (!thisTemp.adPlayerPlay) {
                        thisTemp.sendJS("time", thisTemp.time);
                        if (!thisTemp.isUndefined(thisTemp.advertisements["insert"])) {
                            thisTemp.checkAdInsert(thisTemp.time);
                        }
                        if (!thisTemp.isUndefined(thisTemp.advertisements["other"])) {
                            thisTemp.checkAdOther(thisTemp.time);
                        }
                        if (thisTemp.time < 3 && thisTemp.adReset) {
                            thisTemp.adReset = false;
                            thisTemp.endedAdReset();
                        }
                    } else {
                        thisTemp.adPlayerTimeHandler(thisTemp.time);
                    }
                }
            };
            this.addListenerInside("timeupdate", eventTimeupdate);
            var eventWaiting = function(event) {
                thisTemp.loadingStart(true);
            };
            this.addListenerInside("waiting", eventWaiting);
            var eventSeeking = function(event) {
                thisTemp.sendJS("seek", "start");
            };
            this.addListenerInside("seeking", eventSeeking);
            var eventSeeked = function(event) {
                thisTemp.seekedHandler();
                thisTemp.sendJS("seek", "ended");
            };
            this.addListenerInside("seeked", eventSeeked);
            var eventVolumeChange = function(event) {
                try {
                    thisTemp.volumechangeHandler();
                    thisTemp.sendJS("volume", thisTemp.volume || thisTemp.V.volume);
                } catch (event) {}
            };
            this.addListenerInside("volumechange", eventVolumeChange);
            var eventFullChange = function(event) {
                var fullState =
                    document.fullScreen ||
                    document.mozFullScreen ||
                    document.webkitIsFullScreen;
                thisTemp.sendJS("full", fullState);
            };
            this.addListenerInside("fullscreenchange", eventFullChange);
            this.addListenerInside("webkitfullscreenchange", eventFullChange);
            this.addListenerInside("mozfullscreenchange", eventFullChange);
            if (this.conBarShow) {
                this.interFace();
            }
            this.addListenerInside("loadedmetadata", eventJudgeIsLive);
        },
        resetPlayer: function() {
            this.timeTextHandler();
            if (this.conBarShow) {
                this.timeProgress(0, 1);
                this.changeLoad(0);
                this.initPlayPause();
                this.definition();
                this.deletePrompt();
                this.deletePreview();
                this.trackHide();
                this.resetTrack();
                this.trackElement = [];
                this.track = [];
            }
        },
        interFace: function() {
            this.conBarShow = true;
            var thisTemp = this;
            var thisStyle = this.ckStyle;
            var styleC = thisStyle["controlBar"];
            var styleCB = styleC["button"];
            var styleAS = thisStyle["advertisement"];
            var timeInto = this.formatTime(
                0,
                this.vars["duration"],
                this.ckLanguage["vod"]
            );
            this.CB = {
                menu: null
            };
            var divEle = {
                controlBarBg: null,
                controlBar: null,
                pauseCenter: null,
                errorText: null,
                promptBg: null,
                prompt: null,
                promptTriangle: null,
                definitionP: null,
                playbackrateP: null,
                subtitlesP: null,
                loading: null,
                logo: null,
                adBackground: null,
                adElement: null,
                adLink: null,
                adPauseClose: null,
                adTime: null,
                adTimeText: null,
                adMute: null,
                adEscMute: null,
                adSkip: null,
                adSkipText: null,
                adSkipButton: null
            };
            var k = "";
            for (k in divEle) {
                this.CB[k] = divEle[k];
                this.CB[k] = document.createElement("div");
                this.PD.appendChild(this.CB[k]);
            }
            this.CB["menu"] = document.createElement("div");
            this.body.appendChild(this.CB["menu"]);
            if (this.vars["live"]) {
                timeInto = this.formatTime(0, 0, this.ckLanguage["live"]);
            }
            divEle = {
                play: null,
                pause: null,
                mute: null,
                escMute: null,
                full: null,
                escFull: null,
                definition: null,
                playbackrate: null,
                subtitles: null
            };
            for (k in divEle) {
                this.CB[k] = divEle[k];
                this.CB[k] = document.createElement("div");
                if (!this.isUndefined(this.ckLanguage["buttonOver"][k])) {
                    this.CB[k].dataset.title = this.ckLanguage["buttonOver"][k];
                }
                this.CB["controlBar"].appendChild(this.CB[k]);
            }
            divEle = {
                timeProgressBg: null,
                timeBoBg: null,
                volume: null,
                timeText: null
            };
            for (k in divEle) {
                this.CB[k] = divEle[k];
                this.CB[k] = document.createElement("div");
                if (k == "volume") {
                    var bgDom = document.createElement("span");
                    if (this.vars["live"]) {
                        var volumeLiveDom = document.createElement("span");
                        volumeLiveDom.style["position"] = "absolute";
                        volumeLiveDom.style["bottom"] = "8px";
                        volumeLiveDom.style["left"] = "-17px";
                        volumeLiveDom.style["transform"] = " rotate(90deg)";
                        volumeLiveDom.style["display"] = "inline-block";
                        volumeLiveDom.style["width"] = "38px";
                        volumeLiveDom.style["height"] = "5px";
                        volumeLiveDom.style["background-color"] = "#ff000000";
                        bgDom.appendChild(volumeLiveDom);
                    }
                    var volumeNum = document.createElement("span");
                    volumeNum.id = "volumeNum";
                    volumeNum.style["position"] = "absolute";
                    volumeNum.style["top"] = "8px";
                    volumeNum.style["right"] = "-5px";
                    volumeNum.style["padding-bottom"] = "5px";
                    volumeNum.style["color"] = "#fff";
                    volumeNum.style["font-size"] = "12px";
                    volumeNum.style["transform"] = " rotate(90deg)";
                    volumeNum.style["display"] = "inline-block";
                    volumeNum.style["width"] = "38px";
                    volumeNum.style["text-align"] = "center";
                    bgDom.appendChild(volumeNum);

                    bgDom.style["display"] = "block";
                    bgDom.style["width"] = "132%";
                    bgDom.style["height"] = "38px";
                    bgDom.style["position"] = "absolute";
                    bgDom.style["top"] = "-4px";
                    bgDom.style["left"] = "-5px";
                    bgDom.style["background-color"] = "rgba(0, 0, 0, 0.5)";
                    bgDom.style["border-radius"] = "4px";
                    bgDom.id = "volumBg";
                    this.CB[k].appendChild(bgDom);
                    this.css(this.CB["volume"], "display", "none");
                }
                this.CB["controlBar"].appendChild(this.CB[k]);
            }
            this.CB["timeText"].innerHTML = timeInto;
            divEle = {
                loadProgress: null,
                timeProgress: null
            };
            for (k in divEle) {
                this.CB[k] = divEle[k];
                this.CB[k] = document.createElement("div");
                this.CB["timeProgressBg"].appendChild(this.CB[k]);
            }
            this.CB["timeButton"] = document.createElement("div");
            this.CB["timeBoBg"].appendChild(this.CB["timeButton"]);
            divEle = {
                volumeBg: null,
                volumeBO: null
            };
            for (k in divEle) {
                this.CB[k] = divEle[k];
                this.CB[k] = document.createElement("div");
                this.CB["volume"].appendChild(this.CB[k]);
            }
            this.CB["volumeUp"] = document.createElement("div");
            this.CB["volumeBg"].appendChild(this.CB["volumeUp"]);
            var imgTemp = null;
            var imgFile = thisStyle["loading"]["file"];
            if (!this.isUndefined(thisStyle["loading"]["fileH5"])) {
                imgFile = thisStyle["loading"]["fileH5"];
            }
            if (imgFile) {
                imgTemp = document.createElement("img");
                imgTemp.src = imgFile;
                imgTemp.border = 0;
                this.CB["loading"].appendChild(imgTemp);
            }
            imgFile = thisStyle["logo"]["file"];
            if (!this.isUndefined(thisStyle["logo"]["fileH5"])) {
                imgFile = thisStyle["logo"]["fileH5"];
            }
            if (imgFile) {
                imgTemp = document.createElement("img");
                imgTemp.src = imgFile;
                imgTemp.border = 0;
                this.CB["logo"].appendChild(imgTemp);
            }
            if (this.ckConfig["config"]["buttonMode"]["player"]) {
                this.css(this.PD, {
                    cursor: "pointer"
                });
            }
            this.controlBar();
            var cssTemp = null;
            var promptCss = thisStyle["prompt"];
            cssTemp = this.getEleCss(promptCss, {
                overflow: "hidden",
                zIndex: 900,
                display: "none"
            });
            this.css(this.CB["promptBg"], cssTemp);
            this.css(this.CB["promptBg"], "padding", "0px");
            cssTemp["backgroundColor"] = "";
            cssTemp["border"] = "";
            cssTemp["borderRadius"] = "";
            cssTemp["whiteSpace"] = "nowrap";
            this.css(this.CB["prompt"], cssTemp);
            cssTemp = {
                width: 0,
                height: 0,
                borderLeft: promptCss["triangleWidth"] * 0.5 + "px solid transparent",
                borderRight: promptCss["triangleWidth"] * 0.5 + "px solid transparent",
                borderTop:
                    promptCss["triangleHeight"] +
                    "px solid " +
                    promptCss["triangleBackgroundColor"].replace("0x", "#"),
                overflow: "hidden",
                opacity: promptCss["triangleAlpha"],
                filter: "alpha(opacity:" + promptCss["triangleAlpha"] + ")",
                position: "absolute",
                left: "0px",
                top: "0px",
                zIndex: 900,
                display: "none"
            };
            this.css(this.CB["promptTriangle"], cssTemp);
            this.elementCoordinate();
            this.css(
                [this.CB["pauseCenter"], this.CB["loading"], this.CB["errorText"]],
                "display",
                "none"
            );
            this.carbarButton();
            this.playerCustom();
            this.carbarCustom();
            this.timeProgressDefault();
            this.videoCss();
            this.initPlayPause();
            if (this.vars["volume"] > 0) {
                this.css(this.CB["escMute"], "display", "none");
            } else {
                this.css(this.CB["mute"], "display", "none");
            }
            if (!this.ckConfig["config"]["mobileVolumeBarShow"] && this.mobileTrue) {
                this.css([this.CB["mute"], this.CB["escMute"], this.CB["volume"]], {
                    display: "none"
                });
            }
            this.css(this.CB["escFull"], "display", "none");
            var cssObj = {
                align: "top",
                vAlign: "left",
                width: "100%",
                height: "100%",
                offsetX: 0,
                offsetY: 0,
                zIndex: 910,
                display: "none"
            };
            cssTemp = this.getEleCss(styleAS["background"], cssObj);
            this.css(this.CB["adBackground"], cssTemp);
            this.css(this.CB["adElement"], {
                position: "absolute",
                overflow: "hidden",
                top: "0px",
                zIndex: 911,
                float: "center",
                display: "none"
            });
            this.advertisementStyle();
            this.css(
                [
                    this.CB["adTime"],
                    this.CB["adTimeText"],
                    this.CB["adMute"],
                    this.CB["adEscMute"],
                    this.CB["adSkip"],
                    this.CB["adSkipText"],
                    this.CB["adSkipButton"],
                    this.CB["adLink"],
                    this.CB["adPauseClose"]
                ],
                "display",
                "none"
            );
            var timeProgressOut = function(event) {
                thisTemp.timeProgressMouseOut();
            };
            this.addListenerInside("mouseout", timeProgressOut, this.CB["timeBoBg"]);
            var timeProgressOver = function(event) {
                thisTemp.timeProgressDefault();
            };
            this.addListenerInside(
                "mouseover",
                timeProgressOver,
                this.CB["controlBar"]
            );
            this.buttonEventFun(this.CB["play"], styleCB["play"]);
            this.buttonEventFun(this.CB["pause"], styleCB["pause"]);
            this.buttonEventFun(this.CB["mute"], styleCB["mute"], "mute");
            this.buttonEventFun(this.CB["escMute"], styleCB["escMute"], "mute");
            this.buttonEventFun(this.CB["full"], styleCB["full"]);
            this.buttonEventFun(this.CB["escFull"], styleCB["escFull"]);
            this.buttonEventFun(this.CB["adMute"], styleAS["muteButton"]);
            this.buttonEventFun(this.CB["adEscMute"], styleAS["escMuteButton"]);
            this.buttonEventFun(this.CB["adSkipButton"], styleAS["skipAdButton"]);
            this.buttonEventFun(this.CB["adLink"], styleAS["adLinkButton"]);
            this.buttonEventFun(this.CB["adPauseClose"], styleAS["closeButton"]);
            this.buttonEventFun(this.CB["pauseCenter"], thisStyle["centerPlay"]);
            this.buttonEventFun(
                this.CB["volumeBO"],
                styleC["volumeSchedule"]["button"],
                "volumeBO"
            );
            if (!this.vars["live"]) {
                this.buttonEventFun(
                    this.CB["timeButton"],
                    styleC["timeSchedule"]["button"]
                );
            }
            this.buttonEventFun(this.CB["volume"], null, "volume");
            this.addButtonEvent();
            this.controlBarHide();
            this.newMenu();
            this.keypress();
            this.changeVolume(this.vars["volume"]);
            setTimeout(function() {
                thisTemp.elementCoordinate();
            }, 100);
            this.checkBarWidth();
            var resize = function() {
                thisTemp.log("window.resize");
                thisTemp.playerResize();
            };
            var MutationObserver =
                window.MutationObserver ||
                window.WebKitMutationObserver ||
                window.MozMutationObserver;
            var observer = new MutationObserver(function() {
                thisTemp.log("video.resize");
                var cdW = parseInt(thisTemp.css(thisTemp.CD, "width")),
                    cdH = parseInt(thisTemp.css(thisTemp.CD, "height"));
                if (cdW != thisTemp.cdWH["w"] || cdH != thisTemp.cdWH["h"]) {
                    thisTemp.cdWH = {
                        w: cdW,
                        h: cdH
                    };
                    thisTemp.changeSize(cdW, cdH);
                }
            });
            observer.observe(this.CD, {
                attributes: true,
                attributeFilter: ["style"],
                attributeOldValue: true
            });
            this.addListenerInside("resize", resize, window);
        },
        timeProgressDefault: function() {
            if (this.vars["live"]) {
                return;
            }
            var styleCT = this.ckStyle["controlBar"]["timeSchedule"];
            var cssObj = this.newObj(styleCT["default"]);
            var loadBackImg = cssObj["loadProgressImg"],
                playBackImg = cssObj["playProgressImg"];
            var cssTemp = null;
            this.css(this.CB["timeBoBg"], "display", "block");
            cssTemp = this.getEleCss(
                this.newObj(cssObj),
                {
                    overflow: "hidden",
                    zIndex: 2
                },
                this.CB["controlBarBg"]
            );
            this.css(this.CB["timeProgressBg"], cssTemp);
            cssObj = {
                align: "left",
                vAlign: "top",
                width: 1,
                height: cssObj["height"],
                backgroundImg: loadBackImg
            };
            if (this.CB["loadProgress"].offsetWidth > 1) {
                cssObj["width"] = this.CB["loadProgress"].offsetWidth;
            }
            cssTemp = this.getEleCss(
                this.newObj(cssObj),
                {
                    overflow: "hidden",
                    zIndex: 1
                },
                this.CB["timeProgressBg"]
            );
            this.css(this.CB["loadProgress"], cssTemp);
            cssObj["width"] = 0;
            if (
                this.CB["timeProgress"].offsetWidth > 1 &&
                parseInt(this.css(this.CB["timeButton"], "left")) > 0
            ) {
                cssObj["width"] = this.CB["timeProgress"].offsetWidth;
            }
            cssObj["backgroundImg"] = playBackImg;
            cssTemp = this.getEleCss(cssObj, {
                overflow: "hidden",
                zIndex: 2
            });
            this.css(this.CB["timeProgress"], cssTemp);
            cssTemp = this.getEleCss(
                styleCT["buttonContainer"],
                {
                    position: "absolute",
                    overflow: "hidden",
                    zIndex: 3
                },
                this.CB["controlBar"]
            );
            if (this.ckConfig["config"]["buttonMode"]["timeSchedule"]) {
                cssTemp["cursor"] = "pointer";
            }
            this.css(this.CB["timeBoBg"], cssTemp);
            cssTemp = this.getEleCss(
                styleCT["button"],
                {
                    cursor: "pointer",
                    overflow: "hidden",
                    zIndex: 4
                },
                this.CB["timeBoBg"]
            );
            this.css(this.CB["timeButton"], cssTemp);
        },
        timeProgressMouseOut: function() {
            var styleCT = this.ckStyle["controlBar"]["timeSchedule"];
            var cssObj = this.newObj(styleCT["mouseOut"]);
            var loadBackImg = cssObj["loadProgressImg"],
                playBackImg = cssObj["playProgressImg"];
            var cssTemp = null;
            this.css(this.CB["timeBoBg"], "display", "block");
            cssTemp = this.getEleCss(
                this.newObj(cssObj),
                {
                    overflow: "hidden",
                    zIndex: 2
                },
                this.CB["controlBarBg"]
            );
            this.css(this.CB["timeProgressBg"], cssTemp);
            cssObj = {
                align: "left",
                vAlign: "top",
                width: 1,
                height: cssObj["height"],
                backgroundImg: loadBackImg
            };
            if (this.CB["loadProgress"].offsetWidth > 1) {
                cssObj["width"] = this.CB["loadProgress"].offsetWidth;
            }
            cssTemp = this.getEleCss(
                this.newObj(cssObj),
                {
                    overflow: "hidden",
                    zIndex: 1
                },
                this.CB["timeProgressBg"]
            );
            this.css(this.CB["loadProgress"], cssTemp);
            cssObj["width"] = 1;
            if (
                this.CB["timeProgress"].offsetWidth > 1 &&
                parseInt(this.css(this.CB["timeButton"], "left")) > 0
            ) {
                cssObj["width"] = this.CB["timeProgress"].offsetWidth;
                cssObj["backgroundImg"] = playBackImg;
            }
            cssTemp = this.getEleCss(cssObj, {
                overflow: "hidden",
                zIndex: 2
            });
            this.css(this.CB["timeProgress"], cssTemp);
            this.css(this.CB["timeBoBg"], "display", "none");
        },
        buttonEventFun: function (ele, cssEle, type) {
            // debugger
            var thisTemp = this;
            var overFun = function() {
                if (cssEle) {
                    thisTemp.css(ele, {
                        backgroundImage: "url(" + cssEle["mouseOver"] + ")",
                        backgroundSize: "cover"
                    });
                }
                if (type == "mute") {
                    thisTemp.css(thisTemp.CB["volume"], "display", "block");
                    if (
                        document.getElementById("volumeNum").innerHTML ==
                        thisTemp.vars["volume"] * 100 + "%"
                    ) {
                        thisTemp.changeVolume(thisTemp.vars["volume"]);
                    }
                } else {
                    thisTemp.promptShow(ele);
                }
            };
            var outFun = function () {
                if (cssEle) {
                    thisTemp.css(ele, {
                        backgroundImage: "url(" + cssEle["mouseOut"] + ")",
                        backgroundSize: "cover"
                    });
                }
                thisTemp.promptShow(false);
            };
            outFun();
            this.addListenerInside("mouseover", overFun, ele);
            this.addListenerInside("mouseout", outFun, ele);
            this.addListenerInside(
                "mouseout",
                function(e) {
                    if (e.target.id == "volumBg") {
                        thisTemp.css(thisTemp.CB["volume"], "display", "none");
                    }
                },
                document.getElementById("volumBg")
            );
            this.addListenerInside(
                "mouseover",
                function(e) {
                    thisTemp.css(thisTemp.CB["volume"], "display", "none");
                },
                this.CB["definition"]
            );
            this.addListenerInside(
                "mouseover",
                function(e) {
                    thisTemp.css(thisTemp.CB["volume"], "display", "none");
                },
                this.CB["full"]
            );
            this.addListenerInside(
                "mouseover",
                function(e) {
                    thisTemp.css(thisTemp.CB["volume"], "display", "none");
                },
                this.CB["escFull"]
            );
            if (cssEle) {
                if (!this.isUndefined(cssEle["clickEvent"])) {
                    var clickFun = function() {
                        thisTemp.runFunction(cssEle["clickEvent"]);
                    };
                    this.addListenerInside("click", clickFun, ele);
                }
            }
        },
        formatNumPx: function(str, z) {
            if (!str) {
                return 0;
            }
            if (str.toString().indexOf("%") > -1) {
                if (!this.isUndefined(z)) {
                    return parseInt(str) * z * 0.01 + "px";
                }
                return str;
            } else {
                return str + "px";
            }
        },
        formatZToNum: function(str, z) {
            if (!str) {
                return 0;
            }
            if (str.toString().indexOf("%") > -1) {
                if (!this.isUndefined(z)) {
                    return parseInt(str) * z * 0.01;
                }
                return str;
            } else {
                return str;
            }
        },
        //观看权限
        viewingPermission: function(callBack, obj) {
            if (!obj["platformId"]) {
                callBack(true);
                return;
            }

            var ajaxObj = {
                url:
                    obj["authApi"] +
                    "/kuser/pub/player/auth?key=" +
                    obj["platformId"] +
                    "&domain=" +
                    window.location.host,
                method: "get",
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function(res) {
                    callBack(res.success, res.msg);
                },
                error: function() {
                    callBack(false);
                }
            };
            this.ajax(ajaxObj);
        },
        //点击量统计
        statisticsApi: function() {
            if (this.VA.length == 0 || !this.vars["platformId"]) return;
            var mediaId = this.VA[0][0];
            if (this.VA[0][1] == "video/m3u8") {
                var arr = mediaId.split("/");
                mediaId = arr[arr.length - 1];
                mediaId = mediaId.split("_")[0];
            }
            var ajaxObj = {
                url: this.vars["logApi"] + "/log/video/click",
                method: "post",
                async: true,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    browserName: this.GetCurrentBrowser().toLocaleLowerCase(),
                    mediaId: mediaId,
                    orgId: this.vars["platformId"],
                    terminalName: this.mobileTrue ? "phone" : "pc"
                })
            };
            this.ajax(ajaxObj);
        },
        //视频流量统计
        statistics_flowApi: function() {
            if (this.VA.length == 0 || !this.vars["platformId"]) return;
            var mediaId = this.VA[0][0];
            if (this.VA[0][1] == "video/m3u8") {
                var arr = mediaId.split("/");
                mediaId = arr[arr.length - 1];
                mediaId = mediaId.split("_")[0];
            }
            var ajaxObj = {
                url: this.vars["logApi"] + "/log/video/flow",
                method: "post",
                async: true,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    mediaId: mediaId,
                    orgId: this.vars["platformId"],
                    second: 60 * this.playbackRateTemp
                })
            };
            var _this = this;
            _this.timer_flow = setInterval(function() {
                _this.ajax(ajaxObj);
            }, 60000);

            _this.addListener("ended", function() {
                if (_this.timer_flow) {
                    clearInterval(_this.timer_flow);
                }
            }); //监听播放结束
        },
        //停止流量统计
        statistics_flowClose: function() {
            var _this = this;
            if (_this.timer_flow) clearInterval(_this.timer_flow);
        },
        newObj: function(obj) {
            if (this.isUndefined(obj)) {
                return obj;
            }
            var newobj = {};
            if (this.varType(obj) != "object") {
                return obj;
            } else {
                for (var k in obj) {
                    if (this.isUndefined(obj[k])) {
                        newobj[k] = obj[k];
                    } else {
                        if (this.varType(obj[k]) == "object") {
                            newobj[k] = this.newObj(obj[k]);
                        } else {
                            newobj[k] = obj[k];
                        }
                    }
                }
            }
            return newobj;
        },
        loadImgBg: function(eleid, obj) {
            this.css(this.getByElement(eleid), {
                backgroundImage: "url(" + obj + ")",
                backgroundSize: "cover"
            });
        },
        getEleCss: function(eleObj, supplement, rrEle) {
            var eleName = null;
            var pdW = this.PD.offsetWidth,
                pdH = this.PD.offsetHeight;
            if (rrEle) {
                pdW = rrEle.offsetWidth;
                pdH = rrEle.offsetHeight;
            }
            if (this.isUndefined(eleObj)) {
                return null;
            }
            eleName = this.newObj(eleObj);
            var cssObject = {};
            if (!this.isUndefined(eleName["width"])) {
                cssObject["width"] = this.formatZToNum(eleName["width"], pdW) + "px";
            }
            if (!this.isUndefined(eleName["height"])) {
                cssObject["height"] = this.formatZToNum(eleName["height"], pdH) + "px";
            }
            if (!this.isUndefined(eleName["background"])) {
                var bg = eleName["background"];
                if (!this.isUndefined(bg["backgroundColor"])) {
                    cssObject["backgroundColor"] = bg["backgroundColor"].replace(
                        "0x",
                        "#"
                    );
                }
                if (!this.isUndefined(bg["backgroundImg"])) {
                    cssObject["backgroundImage"] = "url(" + bg["backgroundImg"] + ")";
                    cssObject["backgroundSize"] = "cover";
                }
                if (!this.isUndefined(bg["alpha"])) {
                    cssObject["filter"] = "alpha(opacity:" + bg["alpha"] + ")";
                    cssObject["opacity"] = bg["alpha"];
                }
            }
            if (!this.isUndefined(eleName["backgroundColor"])) {
                cssObject["backgroundColor"] = eleName["backgroundColor"].replace(
                    "0x",
                    "#"
                );
            }
            if (!this.isUndefined(eleName["backgroundImg"])) {
                cssObject["backgroundImage"] = "url(" + eleName["backgroundImg"] + ")";
                cssObject["backgroundSize"] = "cover";
            }
            if (!this.isUndefined(eleName["color"])) {
                cssObject["color"] = eleName["color"].replace("0x", "#");
            }
            if (!this.isUndefined(eleName["font"])) {
                cssObject["fontFamily"] = eleName["font"];
            }
            if (!this.isUndefined(eleName["size"])) {
                cssObject["fontSize"] = eleName["size"] + "px";
            }
            if (!this.isUndefined(eleName["alpha"])) {
                cssObject["filter"] = "alpha(opacity:" + eleName["alpha"] + ")";
                cssObject["opacity"] = eleName["alpha"];
            }
            if (!this.isUndefined(eleName["lineHeight"])) {
                cssObject["lineHeight"] = eleName["lineHeight"] + "px";
            }
            if (!this.isUndefined(eleName["textAlign"])) {
                cssObject["textAlign"] = eleName["textAlign"];
            }
            if (!this.isUndefined(eleName["borderRadius"])) {
                cssObject["borderRadius"] = eleName["borderRadius"] + "px";
            }
            if (!this.isUndefined(eleName["radius"])) {
                cssObject["borderRadius"] = eleName["radius"] + "px";
            }
            if (!this.isUndefined(eleName["padding"])) {
                cssObject["padding"] = eleName["padding"] + "px";
            }
            if (!this.isUndefined(eleName["paddingLeft"])) {
                cssObject["paddingLeft"] = eleName["paddingLeft"] + "px";
            }
            if (!this.isUndefined(eleName["paddingRight"])) {
                cssObject["paddingRight"] = eleName["paddingRight"] + "px";
            }
            if (!this.isUndefined(eleName["paddingTop"])) {
                cssObject["paddingTop"] = eleName["paddingTop"] + "px";
            }
            if (!this.isUndefined(eleName["paddingBottom"])) {
                cssObject["paddingBottom"] = eleName["paddingBottom"] + "px";
            }
            if (!this.isUndefined(eleName["margin"])) {
                cssObject["margin"] = eleName["margin"] + "px";
            }
            if (!this.isUndefined(eleName["marginLeft"])) {
                cssObject["marginLeft"] = eleName["marginLeft"] + "px";
            }
            if (!this.isUndefined(eleName["marginRight"])) {
                cssObject["marginRight"] = eleName["marginRight"] + "px";
            }
            if (!this.isUndefined(eleName["marginTop"])) {
                cssObject["marginTop"] = eleName["marginTop"] + "px";
            }
            if (!this.isUndefined(eleName["marginBottom"])) {
                cssObject["marginBottom"] = eleName["marginBottom"] + "px";
            }
            if (
                !this.isUndefined(eleName["border"]) &&
                !this.isUndefined(eleName["borderColor"])
            ) {
                cssObject["border"] =
                    eleName["border"] +
                    "px solid " +
                    eleName["borderColor"].replace("0x", "#");
            }
            if (
                !this.isUndefined(eleName["borderLeft"]) &&
                !this.isUndefined(eleName["borderLeftColor"])
            ) {
                cssObject["borderLeft"] =
                    eleName["borderLeft"] +
                    "px solid " +
                    eleName["borderLeftColor"].replace("0x", "#");
            }
            if (
                !this.isUndefined(eleName["borderRight"]) &&
                !this.isUndefined(eleName["borderRightColor"])
            ) {
                cssObject["borderRight"] =
                    eleName["borderRight"] +
                    "px solid " +
                    eleName["borderRightColor"].replace("0x", "#");
            }
            if (
                !this.isUndefined(eleName["borderTop"]) &&
                !this.isUndefined(eleName["borderTopColor"])
            ) {
                cssObject["borderTop"] =
                    eleName["borderTop"] +
                    "px solid " +
                    eleName["borderTopColor"].replace("0x", "#");
            }
            if (
                !this.isUndefined(eleName["borderBottom"]) &&
                !this.isUndefined(eleName["borderBottomColor"])
            ) {
                cssObject["borderBottom"] =
                    eleName["borderBottom"] +
                    "px solid " +
                    eleName["borderBottomColor"].replace("0x", "#");
            }
            if (!this.isUndefined(supplement)) {
                for (var k in supplement) {
                    cssObject[k] = supplement[k];
                }
            }
            cssObject["position"] = "absolute";
            var left = -10000,
                top = -10000,
                right = -10000,
                bottom = -10000;
            var offsetX = 0,
                offsetY = 0;
            if (!this.isUndefined(eleName["offsetX"])) {
                offsetX = eleName["offsetX"];
            }
            if (!this.isUndefined(eleName["marginX"])) {
                offsetX = eleName["marginX"];
            }
            if (!this.isUndefined(eleName["offsetY"])) {
                offsetY = eleName["offsetY"];
            }
            if (!this.isUndefined(eleName["marginY"])) {
                offsetY = eleName["marginY"];
            }
            offsetX = this.formatZToNum(offsetX, pdW);
            offsetY = this.formatZToNum(offsetY, pdH);
            if (!this.isUndefined(eleName["align"])) {
                left = 0;
                switch (eleName["align"]) {
                    case "left":
                        left = offsetX;
                        break;
                    case "center":
                        left = pdW * 0.5 + offsetX;
                        break;
                    case "right":
                        left = pdW + offsetX;
                        break;
                    case "right2":
                        left = -10000;
                        right = offsetX;
                        break;
                }
            }
            if (!this.isUndefined(eleName["vAlign"])) {
                top = 0;
                switch (eleName["vAlign"]) {
                    case "top":
                        top = offsetY;
                        break;
                    case "middle":
                        top = pdH * 0.5 + offsetY;
                        break;
                    case "bottom":
                        top = pdH + offsetY;
                        break;
                    case "bottom2":
                        top = -10000;
                        bottom = offsetY;
                        break;
                }
            }
            if (left > -10000) {
                cssObject["left"] = left + "px";
            }
            if (right > -10000) {
                cssObject["right"] = right + "px";
            }
            if (top > -10000) {
                cssObject["top"] = top + "px";
            }
            if (bottom > -10000) {
                cssObject["bottom"] = bottom + "px";
            }
            return cssObject;
        },
        newCanvas: function(id, width, height) {
            return (
                '<canvas class="' +
                id +
                '-canvas" width="' +
                width +
                '" height="' +
                height +
                '"></canvas>'
            );
        },
        addButtonEvent: function() {
            var thisTemp = this;
            var promptHide = function() {
                thisTemp.promptShow(false);
            };
            var definitionOver = function() {
                thisTemp.promptShow(thisTemp.CB["definition"]);
            };
            this.addListenerInside(
                "mouseover",
                definitionOver,
                this.CB["definition"]
            );
            this.addListenerInside("mouseout", promptHide, this.CB["definition"]);
            var playbackrateOver = function() {
                thisTemp.promptShow(thisTemp.CB["playbackrate"]);
            };
            this.addListenerInside(
                "mouseover",
                playbackrateOver,
                this.CB["playbackrate"]
            );
            this.addListenerInside("mouseout", promptHide, this.CB["playbackrate"]);
            var subtitlesOver = function() {
                thisTemp.promptShow(thisTemp.CB["subtitles"]);
            };
            this.addListenerInside("mouseover", subtitlesOver, this.CB["subtitles"]);
            this.addListenerInside("mouseout", promptHide, this.CB["subtitles"]);
            var volumeObj = {
                slider: this.CB["volumeBO"],
                follow: this.CB["volumeUp"],
                refer: this.CB["volumeBg"],
                grossValue: "volume",
                pd: true,
                startFun: function() {},
                monitorFun: function(vol) {
                    thisTemp.changeVolume(vol * 0.01, false, false);
                },
                endFun: function() {},
                overFun: function() {}
            };
            this.slider(volumeObj);
            var volumeClickObj = {
                refer: this.CB["volumeBg"],
                grossValue: "volume",
                fun: function(vol) {
                    thisTemp.changeVolume(vol * 0.01, true, true);
                }
            };
            this.progressClick(volumeClickObj);
            this.timeButtonMouseDown();
            this.addDefListener();
            this.addPlaybackrate();
            this.addSubtitles();
        },
        videoClick: function() {
            var thisTemp = this;
            var clearTimerClick = function() {
                if (thisTemp.timerClick != null) {
                    if (thisTemp.timerClick.runing) {
                        thisTemp.timerClick.stop();
                    }
                    thisTemp.timerClick = null;
                }
            };
            var timerClickFun = function() {
                clearTimerClick();
                thisTemp.isClick = false;
                thisTemp.sendJS("videoClick", thisTemp.videoClickXy);
                if (thisTemp.adPlayerPlay) {
                    var ad = thisTemp.getNowAdvertisements();
                    try {
                        if (ad["link"] != "") {
                            window.open(ad["link"]);
                        }
                        thisTemp.ajaxSuccessNull(ad["clickMonitor"]);
                    } catch (event) {}
                } else {
                    if (thisTemp.ckConfig["config"]["click"]) {
                        thisTemp.playOrPause();
                    }
                }
            };
            clearTimerClick();
            if (this.isClick) {
                this.isClick = false;
                thisTemp.sendJS("videoDoubleClick", thisTemp.videoClickXy);
                if (thisTemp.ckConfig["config"]["doubleClick"]) {
                    if (!this.full) {
                        thisTemp.fullScreen();
                    } else {
                        thisTemp.quitFullScreen();
                    }
                }
            } else {
                this.isClick = true;
                this.timerClick = new this.timer(300, timerClickFun, 1);
            }
        },
        timeButtonMouseDown: function() {
            var thisTemp = this;
            var timePrompt = function(time) {
                if (isNaN(time)) {
                    time = 0;
                }
                var timeButtonXY = thisTemp.getCoor(thisTemp.CB["timeButton"]);
                var promptObj = {
                    title: thisTemp.formatTime(
                        time,
                        0,
                        thisTemp.ckLanguage["timeSliderOver"]
                    ),
                    x:
                        timeButtonXY["x"] -
                        thisTemp.pdCoor["x"] +
                        thisTemp.CB["timeButton"].offsetWidth * 0.5,
                    y: timeButtonXY["y"] - thisTemp.pdCoor["y"]
                };
                thisTemp.promptShow(false, promptObj);
            };
            var timeObj = {
                slider: this.CB["timeButton"],
                follow: this.CB["timeProgress"],
                refer: this.CB["timeBoBg"],
                grossValue: "time",
                pd: false,
                startFun: function(time) {
                    thisTemp.isTimeButtonMove = false;
                },
                monitorFun: function(time) {},
                endFun: function(time) {
                    if (thisTemp.V) {
                        if (thisTemp.V.duration > 0) {
                            thisTemp.needSeek = 0;
                            thisTemp.videoSeek(parseInt(time));
                        }
                    }
                },
                overFun: function(time) {
                    timePrompt(time);
                }
            };
            var timeClickObj = {
                refer: this.CB["timeBoBg"],
                grossValue: "time",
                fun: function(time) {
                    if (thisTemp.V) {
                        if (thisTemp.V.duration > 0) {
                            thisTemp.needSeek = 0;
                            thisTemp.videoSeek(parseInt(time));
                        }
                    }
                }
            };
            var timeBoBgmousemove = function(event) {
                var timeBoBgXY = thisTemp.getCoor(thisTemp.CB["timeBoBg"]);
                var eventX = thisTemp.client(event)["x"];
                var duration = thisTemp.V.duration;
                if (isNaN(duration) || parseInt(duration) < 0.2) {
                    duration = thisTemp.vars["duration"];
                }
                if (thisTemp.vars["forceduration"] > 0) {
                    duration = thisTemp.vars["forceduration"];
                }
                var eventTime = parseInt(
                    ((eventX - timeBoBgXY["x"]) * duration) /
                    thisTemp.CB["timeBoBg"].offsetWidth
                );
                var buttonPromptObj = {
                    title: thisTemp.formatTime(
                        eventTime,
                        0,
                        thisTemp.ckLanguage["timeSliderOver"]
                    ),
                    x: eventX,
                    y: timeBoBgXY["y"]
                };
                thisTemp.promptShow(false, buttonPromptObj);
                var def = false;
                if (!thisTemp.isUndefined(thisTemp.CB["definitionP"])) {
                    if (thisTemp.css(thisTemp.CB["definitionP"], "display") != "block") {
                        def = true;
                    }
                }
                if (thisTemp.vars["preview"] != null && def) {
                    buttonPromptObj["time"] = eventTime;
                    thisTemp.preview(buttonPromptObj);
                }
            };
            var promptHide = function(event) {
                thisTemp.promptShow(false);
                if (thisTemp.previewDiv != null) {
                    thisTemp.css(
                        [thisTemp.previewDiv, thisTemp.previewTop],
                        "display",
                        "none"
                    );
                }
            };
            if (!this.vars["live"]) {
                this.isTimeButtonDown = true;
                this.addListenerInside(
                    "mousemove",
                    timeBoBgmousemove,
                    this.CB["timeBoBg"]
                );
                this.addListenerInside("mouseout", promptHide, this.CB["timeBoBg"]);
            } else {
                this.isTimeButtonDown = false;
                timeObj["removeListenerInside"] = true;
                timeClickObj["removeListenerInside"] = true;
            }
            this.slider(timeObj);
            this.progressClick(timeClickObj);
        },
        progressClick: function(obj) {
            var thisTemp = this;
            var referMouseClick = function(event) {
                var moveDirection = "x";
                if (obj.grossValue == "volume") {
                    moveDirection = "y";
                }
                var referX =
                    thisTemp.client(event)[moveDirection] -
                    thisTemp.getCoor(obj["refer"])[moveDirection];
                var rWidth = obj["refer"].offsetWidth;
                var grossValue = 0;
                if (obj["grossValue"] == "volume") {
                    grossValue = 100;
                } else {
                    if (thisTemp.V) {
                        grossValue = thisTemp.V.duration;
                        if (isNaN(grossValue) || parseInt(grossValue) < 0.2) {
                            grossValue = thisTemp.vars["duration"];
                        }
                        if (thisTemp.vars["forceduration"] > 0) {
                            grossValue = thisTemp.vars["forceduration"];
                        }
                    }
                }
                if (obj["grossValue"] == "volume") {
                    var a = thisTemp.client(event)[moveDirection];
                    var b = thisTemp.getCoor(obj["refer"])[moveDirection] - 30;
                    if (a > b) {
                        referX = a - b;
                    } else {
                        referX = b - a;
                    }
                    referX = 80 - referX;
                }
                var nowZ = parseInt((referX * grossValue) / rWidth);
                if (obj["fun"]) {
                    if (obj["grossValue"] === "time") {
                        var sliderXY = thisTemp.getCoor(thisTemp.CB["timeButton"]);
                        if (!thisTemp.checkSlideLeft(referX, sliderXY["x"], rWidth)) {
                            return;
                        }
                        var bimeButtonWB = thisTemp.CB["timeButton"].offsetWidth * 0.5;
                        thisTemp.css(
                            thisTemp.CB["timeButton"],
                            "left",
                            referX - bimeButtonWB + "px"
                        );
                        thisTemp.css(thisTemp.CB["timeProgress"], "width", referX + "px");
                    }
                    obj["fun"](nowZ);
                }
            };
            if (this.isUndefined(obj["removeListenerInside"])) {
                this.addListenerInside("click", referMouseClick, obj["refer"]);
            } else {
                this.removeListenerInside("click", referMouseClick, obj["refer"]);
            }
        },
        slider: function(obj) {
            var moveDirection = "x";
            if (obj.grossValue == "volume") {
                moveDirection = "y";
            }
            var thisTemp = this;
            var clientX = 0,
                criterionWidth = 0,
                sliderLeft = 0,
                referLeft = 0;
            var calculation = function() {
                var sLeft = parseInt(thisTemp.css(obj["slider"], "left"));
                var rWidth = obj["refer"].offsetWidth - obj["slider"].offsetWidth;
                var grossValue = 0;
                if (thisTemp.isUndefined(sLeft) || isNaN(sLeft)) {
                    sLeft = 0;
                }
                if (obj["grossValue"] == "volume") {
                    grossValue = 100;
                } else {
                    if (thisTemp.V) {
                        grossValue = thisTemp.V.duration;
                    }
                }
                return parseInt((sLeft * grossValue) / rWidth);
            };
            var mDown = function(event) {
                thisTemp.addListenerInside("mousemove", mMove, document);
                thisTemp.addListenerInside("mouseup", mUp, document);
                var referXY = thisTemp.getCoor(obj["refer"]);
                var sliderXY = thisTemp.getCoor(obj["slider"]);
                clientX = thisTemp.client(event)[moveDirection];
                referLeft = referXY[moveDirection];
                sliderLeft = sliderXY[moveDirection];
                criterionWidth = clientX - sliderLeft;
                if (obj.grossValue == "volume") {
                    criterionWidth = 50;
                }
                if (obj["startFun"]) {
                    obj["startFun"](calculation());
                }
            };
            var mMove = function(event) {
                clientX = thisTemp.client(event)[moveDirection];
                var newX = clientX - criterionWidth - referLeft;
                if (obj.grossValue == "volume") {
                    newX = criterionWidth - clientX + referLeft;
                }
                if (newX < 0) {
                    newX = 0;
                }
                if (newX > obj["refer"].offsetWidth - obj["slider"].offsetWidth) {
                    newX = obj["refer"].offsetWidth - obj["slider"].offsetWidth;
                }
                if (obj["slider"] === thisTemp.CB["timeButton"]) {
                    if (
                        !thisTemp.checkSlideLeft(newX, sliderLeft, obj["refer"].offsetWidth)
                    ) {
                        return;
                    }
                }
                thisTemp.css(obj["slider"], "left", newX + "px");
                thisTemp.css(
                    obj["follow"],
                    "width",
                    newX + obj["slider"].offsetWidth * 0.5 + "px"
                );
                var nowZ = calculation();
                if (obj["monitorFun"]) {
                    obj["monitorFun"](nowZ);
                }
            };
            var mUp = function(event) {
                thisTemp.removeListenerInside("mousemove", mMove, document);
                thisTemp.removeListenerInside("mouseup", mUp, document);
                if (obj["endFun"]) {
                    obj["endFun"](calculation());
                }
            };
            var mOver = function(event) {
                if (obj["overFun"]) {
                    obj["overFun"](calculation());
                }
            };
            if (this.isUndefined(obj["removeListenerInside"])) {
                this.addListenerInside("mousedown", mDown, obj["slider"]);
                this.addListenerInside("mouseover", mOver, obj["slider"]);
            } else {
                this.removeListenerInside("mousedown", mDown, obj["slider"]);
                this.removeListenerInside("mouseover", mOver, obj["slider"]);
            }
        },
        checkSlideLeft: function(newX, sliderLeft, refer) {
            var timeSA = this.ckConfig["config"]["timeScheduleAdjust"];
            switch (timeSA) {
                case 0:
                    return false;
                    break;
                case 2:
                    if (newX < sliderLeft) {
                        return false;
                    }
                    break;
                case 3:
                    if (newX > sliderLeft) {
                        return false;
                    }
                    break;
                case 4:
                    if (!this.timeSliderLeftTemp) {
                        this.timeSliderLeftTemp = sliderLeft / refer;
                    }
                    if (newX < this.timeSliderLeftTemp * refer) {
                        return false;
                    }
                    break;
                case 5:
                    if (!this.timeSliderLeftTemp) {
                        this.timeSliderLeftTemp = sliderLeft / refer;
                    } else {
                        var timeSliderMax = sliderLeft / refer;
                        if (timeSliderMax > this.timeSliderLeftTemp) {
                            this.timeSliderLeftTemp = timeSliderMax;
                        }
                    }
                    if (newX > this.timeSliderLeftTemp * refer) {
                        return false;
                    }
                    break;
                default:
                    return true;
            }
            return true;
        },
        loadingStart: function(rot) {
            var thisTemp = this;
            if (this.isUndefined(rot)) {
                rot = true;
            }
            if (this.conBarShow) {
                this.css(thisTemp.CB["loading"], "display", "none");
                this.loadingShow = false;
            }
            if (rot) {
                if (this.conBarShow) {
                    this.css(thisTemp.CB["loading"], "display", "block");
                    this.loadingShow = true;
                }
            } else {
                thisTemp.sendJS("buffer", 100);
            }
        },
        promptShow: function(ele, data) {
            if (!this.conBarShow) {
                return;
            }
            var obj = {};
            var eleTitle = "";
            if (!this.isUndefined(ele)) {
                eleTitle = this.getDataset(ele, "title");
                if (this.isUndefined(eleTitle)) {
                    ele = null;
                }
            }
            if (ele || data) {
                if (!this.isUndefined(data)) {
                    obj = data;
                } else {
                    var offsetCoor = this.getCoor(ele);
                    obj = {
                        title: eleTitle,
                        x: offsetCoor["x"] + ele.offsetWidth * 0.5,
                        y: offsetCoor["y"]
                    };
                }
                this.CB["prompt"].innerHTML = obj["title"];
                this.css(this.CB["prompt"], "display", "block");
                var promptStye = this.ckStyle["prompt"];
                var promoptWidth = this.CB["prompt"].offsetWidth,
                    promoptHeight = this.CB["prompt"].offsetHeight;
                this.css(this.CB["promptBg"], {
                    width: promoptWidth + "px",
                    height: promoptHeight + "px"
                });
                var x = obj["x"] - promoptWidth * 0.5;
                var y =
                    obj["y"] -
                    this.CB["prompt"].offsetHeight -
                    promptStye["marginBottom"] -
                    promptStye["triangleHeight"];
                if (x < 0) {
                    x = 0;
                }
                if (x > this.PD.offsetWidth - promoptWidth) {
                    x = this.PD.offsetWidth - promoptWidth;
                }
                this.css([this.CB["promptBg"], this.CB["prompt"]], {
                    display: "block",
                    left: x + "px",
                    top: y + "px"
                });
                this.css(this.CB["promptTriangle"], {
                    display: "block",
                    left:
                        x +
                        (promoptWidth - promptStye["triangleWidth"]) * 0.5 +
                        parseInt(promptStye["triangleDeviationX"]) +
                        "px",
                    top: y + promoptHeight + "px"
                });
            } else {
                this.css(
                    [this.CB["promptBg"], this.CB["prompt"], this.CB["promptTriangle"]],
                    {
                        display: "none"
                    }
                );
            }
        },
        timerErrorFun: function() {
            var thisTemp = this;
            this.errorSend = false;
            var clearIntervalError = function() {
                if (thisTemp.timerError != null) {
                    if (thisTemp.timerError.runing) {
                        thisTemp.timerError.stop();
                    }
                    thisTemp.timerError = null;
                }
            };
            var errorFun = function() {
                clearIntervalError();
                thisTemp.error = true;
                thisTemp.errorUrl = thisTemp.getVideoUrl();
                if (!thisTemp.errorSend) {
                    thisTemp.errorSend = true;
                    thisTemp.sendJS("error");
                }
                if (thisTemp.conBarShow) {
                    thisTemp.CB["errorText"].innerHTML =
                        thisTemp.ckLanguage["error"]["streamNotFound"];
                    thisTemp.css(thisTemp.CB["errorText"], "display", "block");
                    thisTemp.css(
                        [thisTemp.CB["pauseCenter"], thisTemp.CB["loading"]],
                        "display",
                        "none"
                    );
                }
                thisTemp.V.removeAttribute("poster");
                thisTemp.resetPlayer();
            };
            var errorListenerFun = function(event) {
                setTimeout(function() {
                    if (isNaN(thisTemp.V.duration)) {
                        errorFun(event);
                    }
                }, 5000);
            };
            if (!this.errorAdd) {
                this.errorAdd = true;
                this.addListenerInside("error", errorListenerFun);
            }
            clearIntervalError();
            var timerErrorFun = function() {
                if (
                    thisTemp.V &&
                    parseInt(thisTemp.V.networkState) == 3 &&
                    thisTemp.GetCurrentBrowser() != "Safari"
                ) {
                    errorFun();
                }
            };
            this.timerError = new this.timer(
                this.ckConfig["config"]["errorTime"],
                timerErrorFun
            );
        },
        _mime: function(option, value) {
            var mimeTypes = navigator.mimeTypes;
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] === value) {
                    return true;
                }
            }
            return false;
        },
        GetCurrentBrowser: function() {
            var _this = this;
            var ua = navigator.userAgent.toLocaleLowerCase();
            var browserType = null;
            if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
                browserType = "IE";
            } else if (ua.match(/firefox/) != null) {
                browserType = "firefox";
            } else if (ua.match(/ucbrowser/) != null) {
                browserType = "UC";
            } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
                browserType = "opera";
            } else if (ua.match(/bidubrowser/) != null) {
                browserType = "baidu";
            } else if (ua.match(/metasr/) != null) {
                browserType = "sougou";
            } else if (
                ua.match(/tencenttraveler/) != null ||
                ua.match(/qqbrowse/) != null
            ) {
                browserType = "QQ";
            } else if (ua.match(/maxthon/) != null) {
                browserType = "maxthon";
            } else if (ua.match(/chrome/) != null) {
                var is360 = _this._mime(
                    "type",
                    "application/vnd.chromium.remoting-viewer"
                );
                if (is360) {
                    browserType = "360";
                } else {
                    browserType = "chrome";
                }
            } else if (ua.match(/safari/) != null) {
                browserType = "Safari";
            } else {
                browserType = "others";
            }
            return browserType;
        },
        judgeFullScreen: function() {
            var thisTemp = this;
            if (this.timerFull != null) {
                if (this.timerFull.runing) {
                    this.timerFull.stop();
                }
                this.timerFull = null;
            }
            var fullFun = function() {
                thisTemp.isFullScreen();
            };
            this.timerFull = new this.timer(20, fullFun);
        },
        isFullScreen: function() {
            if (!this.conBarShow) {
                return;
            }
            var fullState =
                document.fullScreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen ||
                document.msFullscreenElement;
            if (fullState && !this.full) {
                this.full = true;
                this.sendJS("full", true);
                this.elementCoordinate();
                this.carbarButton();
                this.customCoor();
                this.css(this.CB["full"], "display", "none");
                this.css(this.CB["escFull"], "display", "block");
                if (this.vars["live"] == 0) {
                    this.timeUpdateHandler();
                }
                this.PD.appendChild(this.CB["menu"]);
            }
            if (!fullState && this.full) {
                this.full = false;
                this.sendJS("full", false);
                this.elementCoordinate();
                this.carbarButton();
                this.customCoor();
                this.css(this.CB["full"], "display", "block");
                this.css(this.CB["escFull"], "display", "none");
                if (this.timerFull != null) {
                    if (this.timerFull.runing) {
                        this.timerFull.stop();
                    }
                    this.timerFull = null;
                }
                if (this.vars["live"] == 0) {
                    this.timeUpdateHandler();
                }
                this.body.appendChild(this.CB["menu"]);
            }
        },
        newMenu: function() {
            var thisTemp = this;
            var i = 0;
            this.css(this.CB["menu"], {
                backgroundColor: "#FFFFFF",
                padding: "5px",
                position: "absolute",
                left: "10px",
                top: "20px",
                display: "none",
                zIndex: "999",
                color: "#A1A9BE",
                boxShadow: "2px 2px 3px #AAAAAA"
            });
            var mArr = this.contextMenu;
            var cMenu = this.ckConfig["menu"];
            if (cMenu["name"]) {
                if (cMenu["link"]) {
                    mArr[0] = [cMenu["name"], "link", cMenu["link"]];
                } else {
                    mArr[0] = [cMenu["name"], "default"];
                }
            }
            if (cMenu["version"]) {
                mArr[1] = [cMenu["version"], "default", "line"];
            }
            if (cMenu["more"]) {
                if (this.varType(cMenu["more"]) == "array") {
                    if (cMenu["more"].length > 0) {
                        var moreArr = cMenu["more"];
                        for (i = 0; i < moreArr.length; i++) {
                            var mTemp = moreArr[i];
                            var arrTemp = [];
                            if (mTemp["name"]) {
                                arrTemp.push(mTemp["name"]);
                            }
                            if (mTemp["clickEvent"] && mTemp["clickEvent"] != "none") {
                                var eveObj = this.clickEvent(mTemp["clickEvent"]);
                                arrTemp.push(eveObj["type"]);
                                if (eveObj["fun"]) {
                                    arrTemp.push(eveObj["fun"]);
                                }
                                if (eveObj["link"]) {
                                    arrTemp.push(eveObj["link"]);
                                }
                                if (eveObj["target"]) {
                                    arrTemp.push(' target="' + eveObj["target"] + '"');
                                }
                            }
                            if (mTemp["separatorBefore"]) {
                                arrTemp.push("line");
                            }
                            mArr.push(arrTemp);
                        }
                    }
                }
            }
            var html = "";
            for (i = 0; i < mArr.length; i++) {
                var me = mArr[i];
                switch (me[1]) {
                    case "default":
                        html += "<p>" + me[0] + "</p>";
                        break;
                    case "link":
                        if (me[3]) {
                            me[3] = 'target="' + me[3] + '"';
                        }
                        html +=
                            '<p><a href="' + me[2] + '"' + me[3] + ">" + me[0] + "</a></p>";
                        break;
                    case "javaScript":
                        html +=
                            '<p><a href="javascript:' + me[2] + '">' + me[0] + "</a></p>";
                        break;
                    case "actionScript":
                        html +=
                            '<p><a href="javascript:' +
                            this.vars["variable"] +
                            me[2].replace("thisTemp", "") +
                            '">' +
                            me[0] +
                            "</a></p>";
                        break;
                    default:
                        break;
                }
            }
            this.CB["menu"].innerHTML = html;
            var pArr = this.CB["menu"].childNodes;
            for (i = 0; i < pArr.length; i++) {
                this.css(pArr[i], {
                    height: "30px",
                    lineHeight: "30px",
                    margin: "0px",
                    fontFamily: this.fontFamily,
                    fontSize: "12px",
                    paddingLeft: "10px",
                    paddingRight: "30px"
                });
                if (mArr[i][mArr[i].length - 1] == "line") {
                    this.css(pArr[i], "borderBottom", "1px solid #e9e9e9");
                }
                var aArr = pArr[i].childNodes;
                for (var n = 0; n < aArr.length; n++) {
                    if (aArr[n].localName == "a") {
                        this.css(aArr[n], {
                            color: "#000000",
                            textDecoration: "none"
                        });
                    }
                }
            }
            this.PD.oncontextmenu = function(event) {
                var eve = event || window.event;
                var client = thisTemp.client(event);
                if (eve.button == 2) {
                    eve.returnvalue = false;
                    var x = client["x"] + thisTemp.pdCoor["x"] - 2;
                    var y = client["y"] + thisTemp.pdCoor["y"] - 2;
                    thisTemp.css(thisTemp.CB["menu"], {
                        display: "block",
                        left: x + "px",
                        top: y + "px"
                    });
                    return false;
                }
                return true;
            };
            var setTimeOutPClose = function() {
                if (setTimeOutP) {
                    window.clearTimeout(setTimeOutP);
                    setTimeOutP = null;
                }
            };
            var setTimeOutP = null;
            var mouseOut = function(event) {
                setTimeOutPClose();
                setTimeOutP = setTimeout(function(event) {
                    thisTemp.css(thisTemp.CB["menu"], "display", "none");
                }, 500);
            };
            this.addListenerInside("mouseout", mouseOut, thisTemp.CB["menu"]);
            var mouseOver = function(event) {
                setTimeOutPClose();
            };
            this.addListenerInside("mouseover", mouseOver, thisTemp.CB["menu"]);
        },
        controlBarHide: function(hide) {
            var thisTemp = this;
            var client = {
                    x: 0,
                    y: 0
                },
                oldClient = {
                    x: 0,
                    y: 0
                };
            var cShow = true,
                force = false;
            var controlBarShow = function(show) {
                if (show && !cShow && thisTemp.controlBarIsShow) {
                    cShow = true;
                    thisTemp.sendJS("controlBar", true);
                    thisTemp.css(thisTemp.CB["controlBarBg"], "display", "block");
                    thisTemp.css(thisTemp.CB["controlBar"], "display", "block");
                    thisTemp.timeProgressDefault();
                    thisTemp.changeLoad();
                    if (!thisTemp.timerBuffer) {
                        thisTemp.bufferEdHandler();
                    }
                } else {
                    if (cShow) {
                        cShow = false;
                        var paused = thisTemp.getMetaDate()["paused"];
                        if (force) {
                            paused = false;
                        }
                        if (!paused) {
                            thisTemp.sendJS("controlBar", false);
                            thisTemp.css(thisTemp.CB["controlBarBg"], "display", "none");
                            thisTemp.css(thisTemp.CB["controlBar"], "display", "none");
                            thisTemp.css(thisTemp.CB["volume"], "display", "none");
                            thisTemp.promptShow(false);
                        }
                    }
                }
                thisTemp.videoCss();
            };
            var cbarFun = function(event) {
                if (client["x"] == oldClient["x"] && client["y"] == oldClient["y"]) {
                    var cdH = parseInt(thisTemp.CD.offsetHeight);
                    if (
                        (client["y"] < cdH - 50 || client["y"] > cdH - 2) &&
                        cShow &&
                        !thisTemp.getMetaDate()["paused"]
                    ) {
                        controlBarShow(false);
                    }
                } else {
                    if (!cShow) {
                        controlBarShow(true);
                    }
                }
                oldClient = {
                    x: client["x"],
                    y: client["y"]
                };
            };
            this.timerCBar = new this.timer(2000, cbarFun);
            var cdMove = function(event) {
                var getClient = thisTemp.client(event);
                client["x"] = getClient["x"];
                client["y"] = getClient["y"];
                if (!cShow) {
                    controlBarShow(true);
                }
                thisTemp.sendJS("mouse", client);
            };
            this.addListenerInside("mousemove", cdMove, thisTemp.CD);
            this.addListenerInside("ended", cdMove);
            this.addListenerInside("resize", cdMove, window);
            if (hide === true) {
                cShow = true;
                force = true;
                controlBarShow(false);
            }
            if (hide === false) {
                cShow = false;
                force = true;
                controlBarShow(true);
            }
        },
        keypress: function() {
            var thisTemp = this;
            var now = null;
            var keyDown = function(eve) {
                var keycode = eve.keyCode || eve.which;
                if (thisTemp.adPlayerPlay) {
                    return;
                }
                switch (keycode) {
                    case 32:
                        thisTemp.playOrPause();
                        break;
                    case 37:
                        thisTemp.fastBack();
                        break;
                    case 39:
                        thisTemp.fastNext();
                        break;
                    case 38:
                        now = thisTemp.volume + thisTemp.ckConfig["config"]["volumeJump"];
                        thisTemp.changeVolume(now > 1 ? 1 : now);
                        break;
                    case 40:
                        now = thisTemp.volume - thisTemp.ckConfig["config"]["volumeJump"];
                        thisTemp.changeVolume(now < 0 ? 0 : now);
                        break;
                    default:
                        break;
                }
            };
            this.addListenerInside("keydown", keyDown, window || document);
        },
        playbackRate: function() {
            if (!this.conBarShow || !this.ckConfig["config"]["playbackRate"]) {
                return;
            }
            var styleCD = this.ckStyle["controlBar"]["playbackrate"];
            var cssSup = {
                overflow: "hidden",
                display: "none",
                zIndex: 995
            };
            var cssSup2 = {
                overflow: "hidden",
                align: "top",
                vAlign: "left",
                offsetX: 0,
                offsetY: 0,
                zIndex: 1
            };
            var thisTemp = this;
            var dArr = this.playbackRateArr;
            var nowD = dArr[this.playbackRateDefault][1];
            var nowI = this.playbackRateDefault;
            this.removeChildAll(this.CB["playbackrateP"]);
            if (dArr.length > 1) {
                this.CB["playbackratePB"] = document.createElement("div");
                this.CB["playbackratePC"] = document.createElement("div");
                this.CB["playbackrateP"]
                    .appendChild(this.CB["playbackratePB"])
                    .appendChild(this.CB["playbackratePC"]);
                var bgCss = this.newObj(styleCD["background"]);
                bgCss["backgroundColor"] = "";
                cssTemp = this.getEleCss(bgCss, cssSup2);
                this.css(this.CB["playbackratePC"], cssTemp);
                bgCss["padding"] = 0;
                bgCss["paddingLeft"] = 0;
                bgCss["paddingTop"] = 0;
                bgCss["paddingRight"] = 0;
                bgCss["paddingBottom"] = 0;
                cssTemp = this.getEleCss(
                    this.objectAssign(bgCss, styleCD["backgroundCoorH5"]),
                    cssSup
                );
                this.css(this.CB["playbackrateP"], cssTemp);
                bgCss = this.newObj(styleCD["background"]);
                bgCss["alpha"] = bgCss["backgroundAlpha"];
                bgCss["padding"] = 0;
                bgCss["paddingLeft"] = 0;
                bgCss["paddingTop"] = 0;
                bgCss["paddingRight"] = 0;
                bgCss["paddingBottom"] = 0;
                cssTemp = this.getEleCss(bgCss, cssSup2);
                this.css(this.CB["playbackratePB"], cssTemp);
                for (var i = 0; i < dArr.length; i++) {
                    var buttonDiv = document.createElement("div");
                    buttonDiv.dataset.title = dArr[i][1];
                    if (nowI != i) {
                        this.textButton(
                            buttonDiv,
                            styleCD["button"],
                            null,
                            this.CB["playbackrateP"],
                            dArr[i][1],
                            ""
                        );
                    } else {
                        this.textButton(
                            buttonDiv,
                            styleCD["buttonHighlight"],
                            null,
                            this.CB["playbackrateP"],
                            dArr[i][1],
                            ""
                        );
                    }
                    this.css(buttonDiv, "position", "static");
                    this.CB["playbackratePC"].appendChild(buttonDiv);
                    if (i < dArr.length - 1) {
                        var separate = styleCD["separate"];
                        separate["borderTop"] = separate["border"];
                        separate["borderTopColor"] = separate["color"];
                        var separateDiv = document.createElement("div");
                        this.CB["playbackratePC"].appendChild(separateDiv);
                        var cssTemp = this.getEleCss(separate, {
                            width: "100%"
                        });
                        cssTemp["position"] = "static";
                        this.css(separateDiv, cssTemp);
                    }
                    var subClick = function() {
                        var dName = thisTemp.getDataset(this, "title");
                        if (nowD != dName) {
                            thisTemp.css(thisTemp.CB["playbackrateP"], "display", "none");
                            thisTemp.newPlaybackrate(dName);
                        }
                    };
                    this.addListenerInside("click", subClick, buttonDiv);
                }
                this.CB["playbackrateTriangle"] = document.createElement("div");
                this.CB["playbackrateP"].appendChild(this.CB["playbackrateTriangle"]);
                var tbCss = styleCD["background"];
                cssTemp = {
                    width: 0,
                    height: 0,
                    borderLeft: tbCss["triangleWidth"] * 0.5 + "px solid transparent",
                    borderRight: tbCss["triangleWidth"] * 0.5 + "px solid transparent",
                    borderTop:
                        tbCss["triangleHeight"] +
                        "px solid " +
                        tbCss["triangleBackgroundColor"].replace("0x", "#"),
                    overflow: "hidden",
                    opacity: tbCss["triangleAlpha"],
                    filter: "alpha(opacity:" + tbCss["triangleAlpha"] + ")",
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    zIndex: 2
                };
                this.css(this.CB["playbackrateTriangle"], cssTemp);
                this.CB["playbackrateButtonText"].innerHTML = nowD;
            } else {
                this.CB["playbackrateButtonText"].innerHTML = this.vars.canPlaybackRate
                    ? this.ckLanguage["playbackrate"]
                    : "";
            }
        },
        addPlaybackrate: function() {
            var thisTemp = this;
            var setTimeOutP = null;
            var defClick = function(event) {
                if (
                    thisTemp.css(thisTemp.CB["playbackrateP"], "display") != "block" &&
                    !thisTemp.isUndefined(thisTemp.CB["playbackratePC"])
                ) {
                    thisTemp.css(thisTemp.CB["playbackrateP"], "display", "block");
                    var tbCss =
                        thisTemp.ckStyle["controlBar"]["playbackrate"]["background"];
                    thisTemp.css(thisTemp.CB["playbackratePB"], {
                        width: thisTemp.CB["playbackratePC"].offsetWidth + "px",
                        height: thisTemp.CB["playbackratePC"].offsetHeight + "px"
                    });
                    thisTemp.css(thisTemp.CB["playbackrateP"], {
                        width:
                            thisTemp.CB["playbackratePC"].offsetWidth +
                            tbCss["triangleDeviationX"] +
                            tbCss["triangleWidth"] +
                            "px",
                        height:
                            thisTemp.CB["playbackratePC"].offsetHeight +
                            tbCss["triangleDeviationY"] +
                            tbCss["triangleHeight"] +
                            "px"
                    });
                    thisTemp.promptShow(false);
                    var tempELe = thisTemp.CB["playbackratePB"];
                    var tempWidth = tempELe.offsetWidth;
                    //    var tempHeight = tempELe.offsetHeight;
                    var x =
                        (tempWidth - tbCss["triangleWidth"]) * 0.5 +
                        tbCss["triangleDeviationX"];
                    var y = tempELe.offsetHeight + tbCss["triangleDeviationY"];
                    var cssTemp = {
                        left: x + "px",
                        top: y + "px"
                    };
                    thisTemp.css(thisTemp.CB["playbackrateTriangle"], cssTemp);
                } else {
                    thisTemp.css(thisTemp.CB["playbackrateP"], "display", "none");
                }
            };
            this.addListenerInside("click", defClick, this.CB["playbackrate"]);
            var defMouseOut = function(event) {
                if (setTimeOutP) {
                    window.clearTimeout(setTimeOutP);
                    setTimeOutP = null;
                }
                setTimeOutP = setTimeout(function(event) {
                    thisTemp.css(thisTemp.CB["playbackrateP"], "display", "none");
                }, 500);
            };
            this.addListenerInside(
                "mouseout",
                defMouseOut,
                thisTemp.CB["playbackrateP"]
            );
            var defMouseOver = function(event) {
                if (setTimeOutP) {
                    thisTemp.buttonHide = false;
                    window.clearTimeout(setTimeOutP);
                    setTimeOutP = null;
                }
            };
            this.addListenerInside(
                "mouseover",
                defMouseOver,
                thisTemp.CB["playbackrateP"]
            );
        },
        newPlaybackrate: function(title) {
            var vArr = this.playbackRateArr;
            var i = 0;
            for (i = 0; i < vArr.length; i++) {
                var v = vArr[i];
                if (v[1] == title) {
                    this.playbackRateDefault = i;
                    this.V.playbackRate = v[0];
                    if (this.conBarShow) {
                        this.CB["playbackrateButtonText"].innerHTML = v[1];
                        this.playbackRate();
                    }
                    this.sendJS("playbackRate", v);
                    this.playbackRateTemp = v[0];
                    this.statistics_flowClose();
                    this.statistics_flowApi();
                }
            }
        },
        subtitleSwitch: function() {
            if (!this.conBarShow || !this.ckConfig["config"]["subtitle"]) {
                return;
            }
            var thisTemp = this;
            var dArr = this.vars["cktrack"];
            if (this.varType(dArr) != "array") {
                return;
            }
            if (dArr[0][1] == "") {
                return;
            }
            var styleCD = this.ckStyle["controlBar"]["subtitle"];
            var cssSup = {
                overflow: "hidden",
                display: "none",
                zIndex: 995
            };
            var cssSup2 = {
                overflow: "hidden",
                align: "top",
                vAlign: "left",
                offsetX: 0,
                offsetY: 0,
                zIndex: 1
            };
            var nowD = "";
            var i = 0,
                nowI = 0;
            if (this.subtitlesTemp == -1 && dArr.length > 0) {
                this.subtitlesTemp = dArr.length - 1;
            }
            for (i = 0; i < dArr.length; i++) {
                if (this.subtitlesTemp == i) {
                    nowD = dArr[i][1];
                    nowI = i;
                }
            }
            if (!nowD) {
                nowD = dArr[0][1];
            }
            this.removeChildAll(this.CB["subtitlesP"]);
            if (dArr.length > 1) {
                (this.CB["subtitlesPB"] = document.createElement("div")),
                    (this.CB["subtitlesPC"] = document.createElement("div"));
                this.CB["subtitlesP"].appendChild(this.CB["subtitlesPB"]);
                this.CB["subtitlesP"].appendChild(this.CB["subtitlesPC"]);
                var bgCss = this.newObj(styleCD["background"]);
                bgCss["backgroundColor"] = "";
                cssTemp = this.getEleCss(bgCss, cssSup2);
                this.css(this.CB["subtitlesPC"], cssTemp);
                bgCss["padding"] = 0;
                bgCss["paddingLeft"] = 0;
                bgCss["paddingTop"] = 0;
                bgCss["paddingRight"] = 0;
                bgCss["paddingBottom"] = 0;
                cssTemp = this.getEleCss(
                    this.objectAssign(bgCss, styleCD["backgroundCoorH5"]),
                    cssSup
                );
                this.css(this.CB["subtitlesP"], cssTemp);
                bgCss = this.newObj(styleCD["background"]);
                bgCss["alpha"] = bgCss["backgroundAlpha"];
                bgCss["padding"] = 0;
                bgCss["paddingLeft"] = 0;
                bgCss["paddingTop"] = 0;
                bgCss["paddingRight"] = 0;
                bgCss["paddingBottom"] = 0;
                cssTemp = this.getEleCss(bgCss, cssSup2);
                this.css(this.CB["subtitlesPB"], cssTemp);
                for (i = 0; i < dArr.length; i++) {
                    var buttonDiv = document.createElement("div");
                    buttonDiv.dataset.title = dArr[i][1];
                    if (nowI != i) {
                        this.textButton(
                            buttonDiv,
                            styleCD["button"],
                            null,
                            this.CB["subtitlesP"],
                            dArr[i][1],
                            ""
                        );
                    } else {
                        this.textButton(
                            buttonDiv,
                            styleCD["buttonHighlight"],
                            null,
                            this.CB["subtitlesP"],
                            dArr[i][1],
                            ""
                        );
                    }
                    this.css(buttonDiv, "position", "static");
                    this.CB["subtitlesPC"].appendChild(buttonDiv);
                    if (i < dArr.length - 1) {
                        var separate = styleCD["separate"];
                        separate["borderTop"] = separate["border"];
                        separate["borderTopColor"] = separate["color"];
                        var separateDiv = document.createElement("div");
                        this.CB["subtitlesPC"].appendChild(separateDiv);
                        var cssTemp = this.getEleCss(separate, {
                            width: "100%"
                        });
                        cssTemp["position"] = "static";
                        this.css(separateDiv, cssTemp);
                    }
                    var subClick = function() {
                        var dName = thisTemp.getDataset(this, "title");
                        if (nowD != dName) {
                            thisTemp.css(thisTemp.CB["subtitlesP"], "display", "none");
                            thisTemp.newSubtitles(dName);
                        }
                    };
                    this.addListenerInside("click", subClick, buttonDiv);
                }
                this.CB["subtitlesTriangle"] = document.createElement("div");
                this.CB["subtitlesP"].appendChild(this.CB["subtitlesTriangle"]);
                var tbCss = styleCD["background"];
                cssTemp = {
                    width: 0,
                    height: 0,
                    borderLeft: tbCss["triangleWidth"] * 0.5 + "px solid transparent",
                    borderRight: tbCss["triangleWidth"] * 0.5 + "px solid transparent",
                    borderTop:
                        tbCss["triangleHeight"] +
                        "px solid " +
                        tbCss["triangleBackgroundColor"].replace("0x", "#"),
                    overflow: "hidden",
                    opacity: tbCss["triangleAlpha"],
                    filter: "alpha(opacity:" + tbCss["triangleAlpha"] + ")",
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    zIndex: 2
                };
                this.css(this.CB["subtitlesTriangle"], cssTemp);
                this.CB["subtitleButtonText"].innerHTML = nowD;
            } else {
                this.CB["subtitleButtonText"].innerHTML = this.ckLanguage["subtitle"];
            }
        },
        addSubtitles: function() {
            var thisTemp = this;
            var setTimeOutP = null;
            var defClick = function() {
                if (
                    thisTemp.css(thisTemp.CB["subtitlesP"], "display") != "block" &&
                    !thisTemp.isUndefined(thisTemp.CB["subtitlesPC"])
                ) {
                    var tbCss = thisTemp.ckStyle["controlBar"]["subtitle"]["background"];
                    thisTemp.css(thisTemp.CB["subtitlesP"], "display", "block");
                    thisTemp.css(thisTemp.CB["subtitlesPB"], {
                        width: thisTemp.CB["subtitlesPC"].offsetWidth + "px",
                        height: thisTemp.CB["subtitlesPC"].offsetHeight + "px"
                    });
                    thisTemp.css(thisTemp.CB["subtitlesP"], {
                        width:
                            thisTemp.CB["subtitlesPC"].offsetWidth +
                            tbCss["triangleDeviationX"] +
                            tbCss["triangleWidth"] +
                            "px",
                        height:
                            thisTemp.CB["subtitlesPC"].offsetHeight +
                            tbCss["triangleDeviationY"] +
                            tbCss["triangleHeight"] +
                            "px"
                    });
                    thisTemp.promptShow(false);
                    var tempELe = thisTemp.CB["subtitlesPB"];
                    var tempWidth = tempELe.offsetWidth;
                    //   var tempHeight = tempELe.offsetHeight;
                    var x =
                        (tempWidth - tbCss["triangleWidth"]) * 0.5 +
                        tbCss["triangleDeviationX"];
                    var y = tempELe.offsetHeight + tbCss["triangleDeviationY"];
                    var cssTemp = {
                        left: x + "px",
                        top: y + "px"
                    };
                    thisTemp.css(thisTemp.CB["subtitlesTriangle"], cssTemp);
                } else {
                    thisTemp.css(thisTemp.CB["subtitlesP"], "display", "none");
                }
            };
            this.addListenerInside("click", defClick, this.CB["subtitles"]);
            var defMouseOut = function() {
                if (setTimeOutP) {
                    window.clearTimeout(setTimeOutP);
                    setTimeOutP = null;
                }
                setTimeOutP = setTimeout(function() {
                    thisTemp.css(thisTemp.CB["subtitlesP"], "display", "none");
                }, 500);
            };
            this.addListenerInside(
                "mouseout",
                defMouseOut,
                thisTemp.CB["subtitlesP"]
            );
            var defMouseOver = function() {
                thisTemp.buttonHide = false;
                if (setTimeOutP) {
                    window.clearTimeout(setTimeOutP);
                    setTimeOutP = null;
                }
            };
            this.addListenerInside(
                "mouseover",
                defMouseOver,
                thisTemp.CB["subtitlesP"]
            );
        },
        changeSubtitles: function(n) {
            if (!this.loaded || n < 0) {
                return;
            }
            var vArr = this.vars["cktrack"];
            if (this.varType(vArr) != "array") {
                return;
            }

            if (vArr.length > n) {
                var arr = vArr[n];
                if (arr.length > 2) {
                    var title = arr[1];
                    if (title) {
                        this.newSubtitles(title);
                    }
                }
            }
        },
        changeSubtitlesSize: function(n, m) {
            if (!this.loaded || n < 0) {
                return;
            }

            this.ckStyle["cktrack"]["size"] = n;
            if (!this.isUndefined(m)) {
                this.ckStyle["cktrack"]["leading"] = m;
            }
            this.trackShowAgain();
        },
        newSubtitles: function(title) {
            var vArr = this.vars["cktrack"];
            var i = 0;
            for (i = 0; i < vArr.length; i++) {
                var v = vArr[i];
                if (v[1] == title) {
                    this.subtitlesTemp = i;
                    if (this.conBarShow) {
                        this.CB["subtitleButtonText"].innerHTML = v[1];
                        this.subtitleSwitch();
                        this.loadTrack(i);
                    }
                    this.sendJS("subtitles", v);
                }
            }
        },
        definition: function() {
            if (!this.conBarShow || !this.ckConfig["config"]["definition"]) {
                return;
            }
            var styleCD = this.ckStyle["controlBar"]["definition"];
            var cssSup = {
                overflow: "hidden",
                display: "none",
                zIndex: 995
            };
            var cssSup2 = {
                overflow: "hidden",
                align: "top",
                vAlign: "left",
                offsetX: 0,
                offsetY: 0,
                zIndex: 1
            };
            var thisTemp = this;
            var vArr = this.VA;
            var dArr = [];
            var nowD = "";
            var i = 0,
                nowI = 0;
            /*  if (this.mobileTrue) {
        nowI = 1;
      } */
            for (i = 0; i < vArr.length; i++) {
                var d = vArr[i][2];
                if (dArr.indexOf(d) == -1) {
                    dArr.push(d);
                }
                if (this.V) {
                    if (this.isM3u8) {
                        if (vArr[i][2] == this.V.getAttribute("type")) {
                            nowD = d;
                            nowI = i;
                        }
                    } else {
                        if (vArr[i][0] == this.V.currentSrc) {
                            nowD = d;
                            nowI = i;
                        }
                    }
                }
            }
            if (!nowD) {
                nowD = dArr[nowI];
            }
            this.removeChildAll(this.CB["definitionP"]);
            if (dArr.length > 1) {
                (this.CB["definitionPB"] = document.createElement("div")),
                    (this.CB["definitionPC"] = document.createElement("div"));
                this.CB["definitionP"].appendChild(this.CB["definitionPB"]);
                this.CB["definitionP"].appendChild(this.CB["definitionPC"]);
                var bgCss = this.newObj(styleCD["background"]);
                bgCss["backgroundColor"] = "";
                cssTemp = this.getEleCss(bgCss, cssSup2);
                this.css(this.CB["definitionPC"], cssTemp);
                bgCss["padding"] = 0;
                bgCss["paddingLeft"] = 0;
                bgCss["paddingTop"] = 0;
                bgCss["paddingRight"] = 0;
                bgCss["paddingBottom"] = 0;
                cssTemp = this.getEleCss(
                    this.objectAssign(bgCss, styleCD["backgroundCoorH5"]),
                    cssSup
                );
                this.css(this.CB["definitionP"], cssTemp);
                bgCss = this.newObj(styleCD["background"]);
                bgCss["alpha"] = bgCss["backgroundAlpha"];
                bgCss["padding"] = 0;
                bgCss["paddingLeft"] = 0;
                bgCss["paddingTop"] = 0;
                bgCss["paddingRight"] = 0;
                bgCss["paddingBottom"] = 0;
                cssTemp = this.getEleCss(bgCss, cssSup2);
                this.css(this.CB["definitionPB"], cssTemp);
                for (i = 0; i < dArr.length; i++) {
                    var buttonDiv = document.createElement("div");
                    buttonDiv.dataset.title = dArr[i];
                    if (nowI != i) {
                        this.textButton(
                            buttonDiv,
                            styleCD["button"],
                            null,
                            this.CB["definitionP"],
                            dArr[i],
                            ""
                        );
                    } else {
                        this.textButton(
                            buttonDiv,
                            styleCD["buttonHighlight"],
                            null,
                            this.CB["definitionP"],
                            dArr[i],
                            ""
                        );
                    }
                    this.css(buttonDiv, "position", "static");
                    this.CB["definitionPC"].appendChild(buttonDiv);
                    if (i < dArr.length - 1) {
                        var separate = styleCD["separate"];
                        separate["borderTop"] = separate["border"];
                        separate["borderTopColor"] = separate["color"];
                        var separateDiv = document.createElement("div");
                        this.CB["definitionPC"].appendChild(separateDiv);
                        var cssTemp = this.getEleCss(separate, {
                            width: "100%"
                        });
                        cssTemp["position"] = "static";
                        this.css(separateDiv, cssTemp);
                    }
                    var defClick = function() {
                        var dName = thisTemp.getDataset(this, "title");
                        if (nowD != dName) {
                            thisTemp.css(thisTemp.CB["definitionP"], "display", "none");
                            thisTemp.newDefinition(dName);
                        }
                    };
                    this.addListenerInside("click", defClick, buttonDiv);
                }
                this.CB["definitionTriangle"] = document.createElement("div");
                this.CB["definitionP"].appendChild(this.CB["definitionTriangle"]);
                var tbCss = styleCD["background"];
                cssTemp = {
                    width: 0,
                    height: 0,
                    borderLeft: tbCss["triangleWidth"] * 0.5 + "px solid transparent",
                    borderRight: tbCss["triangleWidth"] * 0.5 + "px solid transparent",
                    borderTop:
                        tbCss["triangleHeight"] +
                        "px solid " +
                        tbCss["triangleBackgroundColor"].replace("0x", "#"),
                    overflow: "hidden",
                    opacity: tbCss["triangleAlpha"],
                    filter: "alpha(opacity:" + tbCss["triangleAlpha"] + ")",
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    zIndex: 2
                };
                this.css(this.CB["definitionTriangle"], cssTemp);
                this.CB["defaultButtonText"].innerHTML = nowD;
                this.css(this.CB["definition"], "display", "block");
            } else {
                this.CB["defaultButtonText"].innerHTML = this.ckLanguage["definition"];
            }
        },
        removeChildAll: function(ele) {
            for (var i = ele.childNodes.length - 1; i >= 0; i--) {
                var childNode = ele.childNodes[i];
                ele.removeChild(childNode);
            }
        },
        addDefListener: function() {
            var thisTemp = this;
            var setTimeOutP = null;
            var defClick = function() {
                if (
                    thisTemp.css(thisTemp.CB["definitionP"], "display") != "block" &&
                    !thisTemp.isUndefined(thisTemp.CB["definitionPC"])
                ) {
                    thisTemp.css(thisTemp.CB["definitionP"], "display", "block");
                    var tbCss =
                        thisTemp.ckStyle["controlBar"]["definition"]["background"];
                    thisTemp.css(thisTemp.CB["definitionPB"], {
                        width: thisTemp.CB["definitionPC"].offsetWidth + "px",
                        height: thisTemp.CB["definitionPC"].offsetHeight + "px"
                    });
                    thisTemp.css(thisTemp.CB["definitionP"], {
                        width:
                            thisTemp.CB["definitionPC"].offsetWidth +
                            tbCss["triangleDeviationX"] +
                            tbCss["triangleWidth"] +
                            "px",
                        height:
                            thisTemp.CB["definitionPC"].offsetHeight +
                            tbCss["triangleDeviationY"] +
                            tbCss["triangleHeight"] +
                            "px"
                    });
                    thisTemp.promptShow(false);
                    var tempELe = thisTemp.CB["definitionPB"];
                    var tempWidth = tempELe.offsetWidth;
                    var x =
                        (tempWidth - tbCss["triangleWidth"]) * 0.5 +
                        tbCss["triangleDeviationX"];
                    var y = tempELe.offsetHeight + tbCss["triangleDeviationY"];
                    var cssTemp = {
                        left: x + "px",
                        top: y + "px"
                    };
                    thisTemp.css(thisTemp.CB["definitionTriangle"], cssTemp);
                } else {
                    thisTemp.css(thisTemp.CB["definitionP"], "display", "none");
                }
            };
            this.addListenerInside("click", defClick, this.CB["definition"]);
            var defMouseOut = function() {
                if (setTimeOutP) {
                    window.clearTimeout(setTimeOutP);
                    setTimeOutP = null;
                }
                setTimeOutP = setTimeout(function() {
                    thisTemp.css(thisTemp.CB["definitionP"], "display", "none");
                }, 500);
            };
            this.addListenerInside(
                "mouseout",
                defMouseOut,
                thisTemp.CB["definitionP"]
            );
            var defMouseOver = function() {
                thisTemp.buttonHide = false;
                if (setTimeOutP) {
                    window.clearTimeout(setTimeOutP);
                    setTimeOutP = null;
                }
            };
            this.addListenerInside(
                "mouseover",
                defMouseOver,
                thisTemp.CB["definitionP"]
            );
        },
        changeDefinition: function(n) {
            if (!this.loaded || n < 0) {
                return;
            }

            if (this.VA.length > n) {
                var arr = this.VA[n];
                if (arr.length > 3) {
                    var title = arr[2];
                    if (title) {
                        this.newDefinition(title);
                    }
                }
            }
        },
        newDefinition: function(title) {
            this.videoPause();
            this.playShow(false);
            var vArr = this.VA;
            var nVArr = [];
            var i = 0;
            for (i = 0; i < vArr.length; i++) {
                var v = vArr[i];
                if (v[2] == title) {
                    nVArr.push(v);
                    this.sendJS("definitionChange", i + "");
                }
            }
            if (nVArr.length < 1) {
                return;
            }
            if (this.V != null && this.needSeek == 0) {
                this.needSeek = this.V.currentTime;
            }
            if (this.getFileExt(nVArr[0][0]) != ".m3u8") {
                this.isM3u8 = false;
            }

            if (!this.isM3u8) {
                if (nVArr.length == 1) {
                    this.V.innerHTML = "";
                    this.V.src = nVArr[0][0];
                    this.V.currentSrc = nVArr[0][0];
                } else {
                    var source = "";
                    nVArr = this.arrSort(nVArr);
                    for (i = 0; i < nVArr.length; i++) {
                        var type = "";
                        var va = nVArr[i];
                        if (va[1]) {
                            type = ' type="' + va[1] + '"';
                        }
                        source += '<source src="' + va[0] + '"' + type + ">";
                    }
                    this.V.removeAttribute("src");
                    this.V.innerHTML = source;
                    this.V.currentSrc = nVArr[0][0];
                }
            } else {
                if (nVArr.length == 1) {
                    this.embedHls(nVArr[0][0], this.vars["autoplay"]);
                }
            }
            this.V.setAttribute("type", nVArr[0][2]);
            //   this.V.autoplay = "autoplay";
            this.V.load();
            if (this.playbackRateTemp != 1) {
                this.V.playbackRate = this.playbackRateTemp;
            }
            this.timerErrorFun();
        },
        embedHls: function(url, autoplay) {
            // console.log(Hls.isSupported(),'Hls.isSupported()')
            var thisTemp = this;
            thisTemp.hlsAutoPlay = autoplay;
            if (Hls.isSupported()) {
                var hls = new Hls({
                    debug: false
                });
                hls.loadSource(url);
                hls.attachMedia(this.V);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    thisTemp.playerLoad();
                    if (autoplay) {
                        thisTemp.videoPlay();
                    }
                });
                hls.on(Hls.Events.MEDIA_ATTACHED, function() {
                    if (autoplay) {
                        thisTemp.videoPlay();
                    }
                });
            }
        },
        prompt: function() {
            if (!this.conBarShow) {
                return;
            }
            var thisTemp = this;
            var prompt = this.vars["promptSpot"];
            if (prompt == null || this.promptArr.length > 0) {
                return;
            }
            var showPrompt = function(event) {
                if (thisTemp.promptElement == null) {
                    var random2 = "prompte-" + thisTemp.randomString(5);
                    var ele2 = document.createElement("div");
                    ele2.className = random2;
                    thisTemp.PD.appendChild(ele2);
                    thisTemp.promptElement = thisTemp.getByElement(random2);
                    thisTemp.css(thisTemp.promptElement, {
                        overflowX: "hidden",
                        lineHeight: thisTemp.ckStyle["previewPrompt"]["lineHeight"] + "px",
                        fontFamily: thisTemp.ckStyle["previewPrompt"]["font"],
                        fontSize: thisTemp.ckStyle["previewPrompt"]["size"] + "px",
                        color: thisTemp.ckStyle["previewPrompt"]["color"].replace(
                            "0x",
                            "#"
                        ),
                        position: "absolute",
                        display: "block",
                        zIndex: "90"
                    });
                }
                var pcon = thisTemp.getPromptTest();
                var pW = pcon["pW"],
                    pT = pcon["pT"],
                    pL = parseInt(thisTemp.css(this, "left")) - parseInt(pW * 0.5);
                if (pcon["pL"] > 10) {
                    pL = pcon["pL"];
                }
                if (pL < 0) {
                    pL = 0;
                }
                thisTemp.css(thisTemp.promptElement, {
                    width: pW + "px",
                    left: -pW - 10 + "px",
                    display: "block"
                });
                thisTemp.promptElement.innerHTML = thisTemp.getDataset(this, "words");
                thisTemp.css(thisTemp.promptElement, {
                    left: pL + "px",
                    top:
                        pT -
                        thisTemp.promptElement.offsetHeight -
                        thisTemp.ckStyle["previewPrompt"]["marginBottom"] +
                        "px"
                });
            };
            var hidePrompt = function(event) {
                if (thisTemp.promptElement != null) {
                    thisTemp.css(thisTemp.promptElement, {
                        display: "none"
                    });
                }
            };
            var i = 0;
            for (i = 0; i < prompt.length; i++) {
                var pr = prompt[i];
                var words = pr["words"];
                var time = pr["time"];
                var random = "prompttitle-" + this.randomString(5);
                var ele = document.createElement("div");
                ele.className = random;
                this.CB["timeBoBg"].appendChild(ele);
                var div = this.getByElement(random);
                try {
                    div.setAttribute("data-time", time);
                    if (this.ckConfig["config"]["promptSpotTime"]) {
                        words =
                            this.formatTime(time, 0, this.ckLanguage["timeSliderOver"]) +
                            " " +
                            words;
                    }
                    div.setAttribute("data-words", words);
                } catch (event) {}
                var pCss = this.getEleCss(this.ckStyle["promptSpotH5"], {
                    marginY: -10000,
                    zIndex: 1
                });
                try {
                    this.css(div, pCss);
                } catch (event) {}
                this.addListenerInside("mouseover", showPrompt, div);
                this.addListenerInside("mouseout", hidePrompt, div);
                this.promptArr.push(div);
            }
            this.changePrompt();
        },
        getPromptTest: function() {
            var pW = this.previewWidth,
                pT = this.getCoor(this.CB["timeProgressBg"])["y"],
                pL = 0;
            if (this.previewTop != null) {
                pT = parseInt(this.css(this.previewTop, "top"));
                pL = parseInt(this.css(this.previewTop, "left"));
            } else {
                pT -= 35;
            }
            pL += 2;
            if (pL < 0) {
                pL = 0;
            }
            if (pL > this.PD.offsetWidth - pW) {
                pL = this.PD.offsetWidth - pW;
            }
            return {
                pW: pW,
                pT: pT,
                pL: pL
            };
        },
        deletePrompt: function() {
            var arr = this.promptArr;
            if (arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]) {
                        this.deleteChild(arr[i]);
                    }
                }
            }
            this.promptArr = [];
        },
        changePrompt: function() {
            if (this.promptArr.length == 0) {
                return;
            }
            var arr = this.promptArr;
            var duration = this.getMetaDate()["duration"];
            var bw = this.CB["timeBoBg"].offsetWidth;
            for (var i = 0; i < arr.length; i++) {
                var time = parseInt(this.getDataset(arr[i], "time"));
                var left =
                    parseInt((time * bw) / duration) - parseInt(arr[i].offsetWidth * 0.5);
                if (left < 0) {
                    left = 0;
                }
                if (left > bw - parseInt(arr[i].offsetWidth * 0.5)) {
                    left = bw - parseInt(arr[i].offsetWidth * 0.5);
                }
                this.css(arr[i], {
                    left: left + "px",
                    display: "block"
                });
            }
        },
        preview: function(obj) {
            var thisTemp = this;
            var preview = {
                file: null,
                scale: 0
            };
            preview = this.standardization(preview, this.vars["preview"]);
            if (preview["file"] == null || preview["scale"] <= 0) {
                return;
            }
            var srcArr = preview["file"];
            if (this.previewStart == 0) {
                this.previewStart = 1;
                if (srcArr.length > 0) {
                    var i = 0;
                    var imgW = 0,
                        imgH = 0;
                    var random = "preview-" + thisTemp.randomString(10);
                    var loadNum = 0;
                    var loadImg = function(i) {
                        srcArr[i] = thisTemp.getNewUrl(srcArr[i]);
                        var n = 0;
                        var img = new Image();
                        img.src = srcArr[i];
                        img.className = random + i;
                        img.onload = function(event) {
                            loadNum++;
                            if (thisTemp.previewDiv == null) {
                                imgW = img.width;
                                imgH = img.height;
                                thisTemp.previewWidth = parseInt(imgW * 0.1);
                                var ele = document.createElement("div");
                                ele.className = random;
                                thisTemp.PD.appendChild(ele);
                                thisTemp.previewDiv = thisTemp.getByElement(random);
                                var eleTop = 0;
                                eleTop =
                                    thisTemp.PD.offsetHeight -
                                    thisTemp.ckStyle["preview"]["bottom"];
                                thisTemp.css(thisTemp.previewDiv, {
                                    width: srcArr.length * imgW * 10 + "px",
                                    height: parseInt(imgH * 0.1) + "px",
                                    backgroundColor: "#000000",
                                    position: "absolute",
                                    left: "0px",
                                    top: eleTop + "px",
                                    display: "none",
                                    zIndex: "80"
                                });
                                ele.setAttribute("data-x", "0");
                                ele.setAttribute("data-y", eleTop);
                                var ele2 = document.createElement("div");
                                ele2.className = random + "d2";
                                thisTemp.PD.appendChild(ele2);
                                thisTemp.previewTop = thisTemp.getByElement(ele2.className);
                                thisTemp.css(thisTemp.previewTop, {
                                    width: parseInt(imgW * 0.1) + "px",
                                    height: parseInt(imgH * 0.1) + "px",
                                    position: "absolute",
                                    border:
                                        thisTemp.ckStyle["preview"]["border"] +
                                        "px solid " +
                                        thisTemp.ckStyle["preview"]["borderColor"].replace(
                                            "0x",
                                            "#"
                                        ),
                                    left: "0px",
                                    top: eleTop + "px",
                                    display: "none",
                                    zIndex: "81"
                                });
                                var html = "";
                                for (n = 0; n < srcArr.length; n++) {
                                    html += thisTemp.newCanvas(
                                        random + n,
                                        imgW * 10,
                                        parseInt(imgH * 0.1)
                                    );
                                }
                                thisTemp.previewDiv.innerHTML = html;
                            }
                            thisTemp.previewDiv.appendChild(img);
                            var cimg = thisTemp.getByElement(img.className);

                            var canvas = thisTemp.getByElement(img.className + "-canvas");
                            var context = canvas.getContext("2d");
                            var sx = 0,
                                sy = 0,
                                x = 0,
                                h = parseInt(imgH * 0.1);
                            for (n = 0; n < 100; n++) {
                                x = parseInt(n * imgW * 0.1);
                                context.drawImage(
                                    cimg,
                                    sx,
                                    sy,
                                    parseInt(imgW * 0.1),
                                    h,
                                    x,
                                    0,
                                    parseInt(imgW * 0.1),
                                    h
                                );
                                sx += parseInt(imgW * 0.1);
                                if (sx >= imgW) {
                                    sx = 0;
                                    sy += h;
                                }
                                thisTemp.css(cimg, "display", "none");
                            }
                            if (loadNum == srcArr.length) {
                                thisTemp.previewStart = 2;
                            } else {
                                i++;
                                loadImg(i);
                            }
                        };
                    };
                }
                loadImg(i);
                return;
            }
            if (this.previewStart == 2) {
                var isTween = true;
                var nowNum = parseInt(obj["time"] / this.vars["preview"]["scale"]);
                var numTotal = parseInt(
                    thisTemp.getMetaDate()["duration"] / this.vars["preview"]["scale"]
                );
                if (thisTemp.css(thisTemp.previewDiv, "display") == "none") {
                    isTween = false;
                }
                thisTemp.css(thisTemp.previewDiv, "display", "block");
                var imgWidth = (thisTemp.previewDiv.offsetWidth * 0.01) / srcArr.length;
                var left = imgWidth * nowNum - obj["x"] + parseInt(imgWidth * 0.5),
                    top =
                        thisTemp.PD.offsetHeight -
                        thisTemp.previewDiv.offsetHeight -
                        thisTemp.ckStyle["preview"]["bottom"];
                thisTemp.css(thisTemp.previewDiv, "top", top + 2 + "px");
                var topLeft = obj["x"] - parseInt(imgWidth * 0.5);
                var timepieces = 0;
                if (topLeft < 0) {
                    topLeft = 0;
                    timepieces = obj["x"] - topLeft - imgWidth * 0.5;
                }
                if (topLeft > thisTemp.PD.offsetWidth - imgWidth) {
                    topLeft = thisTemp.PD.offsetWidth - imgWidth;
                    timepieces = obj["x"] - topLeft - imgWidth * 0.5;
                }
                if (left < 0) {
                    left = 0;
                }
                if (left > numTotal * imgWidth - thisTemp.PD.offsetWidth) {
                    left = numTotal * imgWidth - thisTemp.PD.offsetWidth;
                }
                thisTemp.css(thisTemp.previewTop, {
                    left: topLeft + "px",
                    top: top + 2 + "px",
                    display: "block"
                });
                if (
                    thisTemp.previewTop.offsetHeight > thisTemp.previewDiv.offsetHeight
                ) {
                    thisTemp.css(thisTemp.previewTop, {
                        height:
                            thisTemp.previewDiv.offsetHeight -
                            (thisTemp.previewTop.offsetHeight -
                                thisTemp.previewDiv.offsetHeight) +
                            "px"
                    });
                }
                if (this.previewTween != null) {
                    this.animatePause(this.previewTween);
                    this.previewTween = null;
                }
                var nowLeft = parseInt(thisTemp.css(thisTemp.previewDiv, "left"));
                var leftC = nowLeft + left;
                if (nowLeft == -(left + timepieces)) {
                    return;
                }
                if (isTween) {
                    var obj = {
                        element: thisTemp.previewDiv,
                        start: null,
                        end: -(left + timepieces),
                        speed: 0.3
                    };
                    this.previewTween = this.animate(obj);
                } else {
                    thisTemp.css(
                        thisTemp.previewDiv,
                        "left",
                        -(left + timepieces) + "px"
                    );
                }
            }
        },
        deletePreview: function() {
            if (this.previewDiv != null) {
                this.deleteChild(this.previewDiv);
                this.previewDiv = null;
                this.previewStart = 0;
            }
        },
        changeVideo: function() {
            if (!this.html5Video) {
                this.getVarsObject();
                this.V.newVideo(this.vars);
                return;
            }
            var vArr = this.VA;
            var v = this.vars;
            var i = 0;
            if (vArr.length < 1) {
                return;
            }
            if (this.V != null && this.needSeek == 0) {
                this.needSeek = this.V.currentTime;
            }
            if (v["poster"]) {
                this.V.poster = v["poster"];
            } else {
                this.V.removeAttribute("poster");
            }
            if (v["loop"]) {
                this.V.loop = "loop";
            } else {
                this.V.removeAttribute("loop");
            }
            if (v["seek"] > 0) {
                this.needSeek = v["seek"];
            } else {
                this.needSeek = 0;
            }
            if (this.getFileExt(vArr[0][0]) != ".m3u8") {
                this.isM3u8 = false;
            }
            if (!this.isM3u8) {
                if (vArr.length == 1) {
                    this.V.innerHTML = "";
                    this.V.src = vArr[0][0];
                } else {
                    var source = "";
                    vArr = this.arrSort(vArr);
                    for (i = 0; i < vArr.length; i++) {
                        var type = "";
                        var va = vArr[i];
                        if (va[1]) {
                            type = ' type="' + va[1] + '"';
                        }
                        source += '<source src="' + va[0] + '"' + type + ">";
                    }
                    this.V.removeAttribute("src");
                    this.V.innerHTML = source;
                }
                if (v["autoplay"]) {
                    this.V.autoplay = "autoplay";
                } else {
                    this.V.removeAttribute("autoplay");
                }
                this.V.load();
            } else {
                this.embedHls(vArr[0][0], v["autoplay"]);
            }
            if (!this.isUndefined(v["volume"])) {
                this.changeVolume(v["volume"]);
            }
            this.resetPlayer();
            this.timerErrorFun();
            if (this.vars["cktrack"]) {
                this.loadTrack();
            }
        },
        elementCoordinate: function() {
            this.pdCoor = this.getXY(this.PD);
            var cssTemp = null;
            var zIndex = 2;
            try {
                var style = {
                    cursor: "pointer"
                };
                if (this.vars["html5m3u8"] && window.MediaSource) {
                    style = {
                        cursor: "pointer",
                        zIndex: zIndex
                    };
                }
                cssTemp = this.getEleCss(this.ckStyle["centerPlay"], style);
                this.css(this.CB["pauseCenter"], cssTemp);
            } catch (event) {
                this.log(event);
            }
            try {
                var style = {};
                if (this.vars["html5m3u8"] && window.MediaSource) {
                    style = {
                        zIndex: zIndex
                    };
                }
                cssTemp = this.getEleCss(this.ckStyle["loading"], style);
                this.css(this.CB["loading"], cssTemp);
            } catch (event) {
                this.log(event);
            }
            try {
                var style = {};
                if (this.vars["html5m3u8"] && window.MediaSource) {
                    style = {
                        zIndex: zIndex
                    };
                }
                cssTemp = this.getEleCss(this.ckStyle["error"], style);
                this.css(this.CB["errorText"], cssTemp);
            } catch (event) {
                this.log(event);
            }
            try {
                var style = {};
                if (this.vars["html5m3u8"] && window.MediaSource) {
                    style = {
                        zIndex: zIndex
                    };
                }
                cssTemp = this.getEleCss(this.ckStyle["logo"], style);
                this.css(this.CB["logo"], cssTemp);
            } catch (event) {
                this.log(event);
            }
            this.checkBarWidth();
        },
        carbarButton: function() {
            var styleC = this.ckStyle["controlBar"];
            var styleCB = styleC["button"];
            var cssTemp = null;
            var cssSup = {
                overflow: "hidden",
                cursor: "pointer",
                zIndex: 1,
                "background-size": "cover"
            };
            var cssSup2 = {
                overflow: "hidden",
                cursor: "default",
                zIndex: 1,
                "background-size": "cover"
            };
            var cssSup4 = {
                overflow: "hidden",
                cursor: "pointer",
                display: "none",
                zIndex: 995
            };
            cssTemp = this.getEleCss(
                styleCB["play"],
                cssSup,
                this.CB["controlBarBg"]
            );
            this.css(this.CB["play"], cssTemp);
            cssTemp = this.getEleCss(
                styleCB["pause"],
                cssSup,
                this.CB["controlBarBg"]
            );
            this.css(this.CB["pause"], cssTemp);
            cssTemp = this.getEleCss(
                styleCB["mute"],
                cssSup,
                this.CB["controlBarBg"]
            );
            this.css(this.CB["mute"], cssTemp);
            cssTemp = this.getEleCss(
                styleCB["escMute"],
                cssSup,
                this.CB["controlBarBg"]
            );
            this.css(this.CB["escMute"], cssTemp);
            cssTemp = this.getEleCss(
                styleCB["full"],
                cssSup,
                this.CB["controlBarBg"]
            );
            this.css(this.CB["full"], cssTemp);
            cssTemp = this.getEleCss(
                styleCB["escFull"],
                cssSup,
                this.CB["controlBarBg"]
            );
            this.css(this.CB["escFull"], cssTemp);
            if (this.vars["live"]) {
                cssTemp = this.getEleCss(
                    styleC["timeText"]["live"],
                    cssSup2,
                    this.CB["controlBarBg"]
                );
            } else {
                cssTemp = this.getEleCss(
                    styleC["timeText"]["vod"],
                    cssSup2,
                    this.CB["controlBarBg"]
                );
            }
            this.css(this.CB["timeText"], cssTemp);
            var volumeSchedule = this.newObj(styleC["volumeSchedule"]);
            volumeSchedule["backgroundImg"] = "";
            cssTemp = this.getEleCss(
                volumeSchedule,
                cssSup2,
                this.CB["controlBarBg"]
            );
            cssTemp.transform = "rotate(" + volumeSchedule["rotate"] + ")";
            cssTemp.overflow = "inherit";
            this.css(this.CB["volume"], cssTemp);
            cssTemp = {
                width: cssTemp["width"],
                height: volumeSchedule["backgroundHeight"] + "px",
                overflow: "hidden",
                backgroundRepeat: "no-repeat",
                left: 0,
                top: 0,
                backgroundPosition: "left center",
                backgroundSize: volumeSchedule["backGroundSize"]
            };
            if (this.ckConfig["config"]["buttonMode"]["volumeSchedule"]) {
                cssTemp["cursor"] = "pointer";
            }
            this.css(this.CB["volumeBg"], cssTemp);
            this.css(this.CB["volumeBg"], {
                position: "absolute"
            });
            cssTemp["width"] =
                this.CB["volumeBO"].offsetWidth * 0.5 +
                parseInt(this.css(this.CB["volumeBO"], "left")) +
                "px";
            this.css(this.CB["volumeUp"], cssTemp);
            this.css(
                this.CB["volumeBg"],
                "backgroundImage",
                "url(" + styleC["volumeSchedule"]["backgroundImg"] + ")"
            );
            this.css(
                this.CB["volumeUp"],
                "backgroundImage",
                "url(" + styleC["volumeSchedule"]["maskImg"] + ")"
            );
            this.css(this.CB["volumeUp"], "display", "inline-block");
            cssTemp = this.getEleCss(styleC["volumeSchedule"]["button"], {
                overflow: "hidden",
                cursor: "pointer",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                "background-size": "cover"
            });
            this.css(this.CB["volumeBO"], cssTemp);
            if (this.ckConfig["config"]["playbackRate"]) {
                var playbackrateButtonText = this.vars.canPlaybackRate
                    ? this.ckLanguage["playbackrate"]
                    : "";
                if (!this.CB["playbackrateButtonText"]) {
                    this.textButton(
                        this.CB["playbackrate"],
                        styleC["playbackrate"]["defaultButton"],
                        this.objectAssign(
                            {
                                overflow: "hidden",
                                cursor: "pointer",
                                zIndex: 1
                            },
                            styleC["playbackrate"]["defaultButtonCoor"]
                        ),
                        this.CB["controlBarBg"],
                        playbackrateButtonText,
                        "playbackrateButtonText"
                    );
                }
                cssTemp = this.getEleCss(
                    styleC["playbackrate"]["defaultButtonCoor"],
                    cssSup,
                    this.CB["controlBarBg"]
                );
                this.css(this.CB["playbackrate"], {
                    left: cssTemp["left"],
                    top: cssTemp["top"]
                });
                this.css(this.CB["playbackrateP"], "display", "none");
                cssTemp = this.getEleCss(
                    styleC["playbackrate"]["backgroundCoorH5"],
                    cssSup4
                );
                this.css(this.CB["playbackrateP"], cssTemp);
            }
            if (this.ckConfig["config"]["definition"]) {
                if (!this.CB["defaultButtonText"]) {
                    this.textButton(
                        this.CB["definition"],
                        styleC["definition"]["defaultButton"],
                        this.objectAssign(
                            {
                                overflow: "hidden",
                                cursor: "pointer",
                                zIndex: 1
                            },
                            styleC["definition"]["defaultButtonCoor"]
                        ),
                        this.CB["controlBarBg"],
                        this.ckLanguage["definition"],
                        "defaultButtonText"
                    );
                }
                cssTemp = this.getEleCss(
                    styleC["definition"]["defaultButtonCoor"],
                    cssSup,
                    this.CB["controlBarBg"]
                );
                this.css(this.CB["definition"], {
                    left: cssTemp["left"],
                    top: cssTemp["top"]
                });
                this.css(this.CB["definitionP"], "display", "none");
                cssTemp = this.getEleCss(
                    styleC["definition"]["backgroundCoorH5"],
                    cssSup4
                );
                this.css(this.CB["definitionP"], cssTemp);
            }
            if (this.ckConfig["config"]["subtitle"]) {
                if (!this.CB["subtitleButtonText"]) {
                    this.textButton(
                        this.CB["subtitles"],
                        styleC["subtitle"]["defaultButton"],
                        this.objectAssign(
                            {
                                overflow: "hidden",
                                cursor: "pointer",
                                zIndex: 1
                            },
                            styleC["subtitle"]["defaultButtonCoor"]
                        ),
                        this.CB["controlBarBg"],
                        this.ckLanguage["subtitle"],
                        "subtitleButtonText"
                    );
                }
                cssTemp = this.getEleCss(
                    styleC["subtitle"]["defaultButtonCoor"],
                    cssSup,
                    this.CB["controlBarBg"]
                );
                this.css(this.CB["subtitles"], {
                    left: cssTemp["left"],
                    top: cssTemp["top"]
                });
                this.css(this.CB["subtitlesP"], "display", "none");
                cssTemp = this.getEleCss(
                    styleC["subtitle"]["backgroundCoorH5"],
                    cssSup4
                );
                this.css(this.CB["subtitlesP"], cssTemp);
            }
        },
        textButton: function(ele, css, cssSup, upEle, text, newName) {
            if (!text) return;
            var thisTemp = this;
            var bgCss = {
                width: css["width"],
                height: css["height"]
            };
            if (cssSup) {
                bgCss = {
                    width: css["width"],
                    height: css["height"],
                    align: cssSup["align"],
                    vAlign: cssSup["vAlign"],
                    marginX: cssSup["marginX"],
                    marginY: cssSup["marginY"],
                    offsetX: cssSup["offsetX"],
                    offsetY: cssSup["offsetY"],
                    zIndex: 2
                };
            }
            cssTemp = this.getEleCss(bgCss, null, upEle);
            thisTemp.css(ele, cssTemp);
            var outCss = this.newObj(css);
            var overCss = this.newObj(css);
            var textOutCss = this.newObj(css);
            var textOverCss = this.newObj(css);
            var cssTemp = null;
            outCss["alpha"] = css["backgroundAlpha"];
            overCss["backgroundColor"] = css["overBackgroundColor"];
            overCss["alpha"] = css["backgroundAlpha"];
            textOutCss["color"] = css["textColor"];
            textOverCss["color"] = css["overTextColor"];
            textOutCss["textAlign"] = css["align"];
            textOverCss["textAlign"] = css["align"];
            textOutCss["backgroundColor"] = textOverCss["backgroundColor"] = "";
            var bgEle = document.createElement("div");
            this.removeChildAll(ele);
            ele.appendChild(bgEle);
            if (newName) {
                this.CB[newName] = document.createElement("div");
                ele.appendChild(this.CB[newName]);
                this.CB[newName].innerHTML = text;
            } else {
                var newEle = document.createElement("div");
                ele.appendChild(newEle);
                newEle.innerHTML = text;
            }
            var outFun = function() {
                cssTemp = thisTemp.getEleCss(
                    outCss,
                    {
                        cursor: "pointer",
                        zIndex: 1
                    },
                    bgEle
                );
                cssTemp["left"] = "";
                cssTemp["top"] = "";
                thisTemp.css(bgEle, cssTemp);
                cssTemp = thisTemp.getEleCss(
                    textOutCss,
                    {
                        cursor: "pointer",
                        zIndex: 2
                    },
                    bgEle
                );
                cssTemp["left"] = "";
                cssTemp["top"] = "";
                if (newName) {
                    thisTemp.css(thisTemp.CB[newName], cssTemp, bgEle);
                } else {
                    thisTemp.css(newEle, cssTemp, bgEle);
                }
                thisTemp.buttonHide = true;
                if (thisTemp.timeButtonOver) {
                    window.clearTimeout(thisTemp.timeButtonOver);
                    thisTemp.timeButtonOver = null;
                }
                thisTemp.timeButtonOver = window.setTimeout(function() {
                    thisTemp.buttonListHide();
                }, 1000);
            };
            var overFun = function() {
                cssTemp = thisTemp.getEleCss(
                    overCss,
                    {
                        zIndex: 1
                    },
                    bgEle
                );
                cssTemp["left"] = "";
                cssTemp["top"] = "";
                thisTemp.css(bgEle, cssTemp);
                cssTemp = thisTemp.getEleCss(
                    textOverCss,
                    {
                        zIndex: 2
                    },
                    bgEle
                );
                cssTemp["left"] = "";
                cssTemp["top"] = "";
                if (newName) {
                    thisTemp.css(thisTemp.CB[newName], cssTemp);
                } else {
                    thisTemp.css(newEle, cssTemp);
                }
            };
            outFun();
            this.addListenerInside("mouseout", outFun, ele);
            this.addListenerInside("mouseover", overFun, ele);
        },
        buttonListHide: function() {
            if (this.buttonHide) {
                this.css(
                    [
                        this.CB["definitionP"],
                        this.CB["subtitlesP"],
                        this.CB["playbackrateP"]
                    ],
                    "display",
                    "none"
                );
            }
            if (this.timeButtonOver) {
                window.clearTimeout(this.timeButtonOver);
                this.timeButtonOver = null;
            }
            this.buttonHide = false;
        },
        videoCss: function() {
            var cssTemp = {};
            if (this.css(this.CB["controlBar"], "display") == "none") {
                cssTemp = this.ckStyle["video"]["controlBarHideReserve"];
            } else {
                cssTemp = this.ckStyle["video"]["reserve"];
            }
            var spacingBottom = cssTemp["spacingBottom"];
            if (this.V.controls && this.mobileTrue) {
                spacingBottom -= 40;
            }
            var pW = this.PD.offsetWidth,
                pH = this.PD.offsetHeight;
            var vW = pW - cssTemp["spacingLeft"] - cssTemp["spacingRight"];
            var vH = pH - cssTemp["spacingTop"] - spacingBottom;
            if (!this.MD) {
                this.css(this.V, {
                    width: vW + "px",
                    height: vH + "px",
                    marginLeft: cssTemp["spacingLeft"] + "px",
                    marginTop: cssTemp["spacingTop"] + "px"
                });
            } else {
                this.css([this.MD, this.MDC], {
                    width: vW + "px",
                    height: vH + "px",
                    marginLeft: cssTemp["spacingLeft"] + "px",
                    marginTop: cssTemp["spacingTop"] + "px"
                });
            }
        },
        playerCustom: function() {
            var custom = this.ckStyle["custom"];
            var button = custom["button"];
            var images = custom["images"];
            var cssTemp = null;
            var cssSup = null;
            var k = "",
                tempID = "";
            var b = {};
            var tempDiv;
            var i = 0;
            for (var k in button) {
                b = button[k];
                cssSup = {
                    overflow: "hidden",
                    cursor: "pointer",
                    zIndex: 1
                };
                cssTemp = this.getEleCss(b, cssSup);
                tempDiv = document.createElement("div");
                this.css(tempDiv, cssTemp);
                this.customeElement.push({
                    ele: tempDiv,
                    css: b,
                    cssSup: cssSup,
                    type: "player-button",
                    name: k
                });
                this.PD.appendChild(tempDiv);
                if (!this.isUndefined(this.ckLanguage["buttonOver"][k])) {
                    tempDiv.dataset.title = this.ckLanguage["buttonOver"][k];
                }
                i++;
                this.buttonEventFun(tempDiv, b);
            }
            for (k in images) {
                if (!images[k]["img"]) return;
                b = images[k];
                cssSup = {
                    overflow: "hidden",
                    zIndex: 1
                };
                cssTemp = this.getEleCss(b, cssSup);
                tempDiv = document.createElement("div");
                this.css(tempDiv, cssTemp);
                this.customeElement.push({
                    ele: tempDiv,
                    css: b,
                    cssSup: cssSup,
                    type: "player-images",
                    name: k
                });
                this.PD.appendChild(tempDiv);
                var img = new Image();
                img.src = images[k]["img"];
                tempDiv.appendChild(img);
                i++;
            }
        },
        carbarCustom: function() {
            var custom = this.ckStyle["controlBar"]["custom"];
            var button = custom["button"];
            var images = custom["images"];
            var cssTemp = null;
            var cssSup = null;
            var k = "";
            var b = {};
            var tempDiv = null;
            var i = 0;
            for (k in button) {
                if (
                    (this.vars["live"] && k != "back15" && k != "go15") ||
                    (!this.vars["live"] && k != "living")
                ) {
                    b = button[k];
                    cssSup = {
                        overflow: "hidden",
                        cursor: "pointer",
                        zIndex: 11
                    };
                    cssTemp = this.getEleCss(b, cssSup, this.CB["controlBarBg"]);
                    tempDiv = document.createElement("div");
                    this.css(tempDiv, cssTemp);
                    this.customeElement.push({
                        ele: tempDiv,
                        css: b,
                        cssSup: cssSup,
                        type: "controlBar-button",
                        name: k
                    });
                    this.CB["controlBar"].appendChild(tempDiv);
                    if (!this.isUndefined(this.ckLanguage["buttonOver"][k])) {
                        if (k === "barLogo") {
                            tempDiv.innerHTML = this.ckLanguage["buttonOver"][k];
                        } else {
                            tempDiv.dataset.title = this.ckLanguage["buttonOver"][k];
                        }
                    }
                    i++;
                    this.buttonEventFun(tempDiv, b);
                }
            }
            for (k in images) {
                b = images[k];
                cssSup = {
                    overflow: "hidden",
                    zIndex: 1
                };
                cssTemp = this.getEleCss(b, cssSup, this.CB["controlBarBg"]);
                tempDiv = document.createElement("div");
                this.css(tempDiv, cssTemp);
                this.customeElement.push({
                    ele: tempDiv,
                    css: b,
                    cssSup: cssSup,
                    type: "controlBar-images",
                    name: k
                });
                this.CB["controlBar"].appendChild(tempDiv);
                var img = new Image();
                img.src = images[k]["img"];
                tempDiv.appendChild(img);
                i++;
            }
        },
        customCoor: function() {
            var cssTemp = null;
            if (this.customeElement.length > 0) {
                for (var i = 0; i < this.customeElement.length; i++) {
                    if (this.customeElement[i]["type"] == "controlBar") {
                        cssTemp = this.getEleCss(
                            this.customeElement[i]["css"],
                            this.customeElement[i]["cssSup"],
                            this.CB["controlBarBg"]
                        );
                    } else {
                        cssTemp = this.getEleCss(
                            this.customeElement[i]["css"],
                            this.customeElement[i]["cssSup"]
                        );
                    }
                    this.css(this.customeElement[i]["ele"], cssTemp);
                }
            }
        },
        customShow: function(show) {
            if (this.customeElement.length > 0) {
                for (var i = 0; i < this.customeElement.length; i++) {
                    if (this.customeElement[i]["type"] == "player") {
                        this.css(
                            this.customeElement[i]["ele"],
                            "display",
                            show ? "block" : "none"
                        );
                    }
                }
            }
        },
        advertisementStyle: function() {
            var asArr = [
                "muteButton",
                "escMuteButton",
                "adLinkButton",
                "closeButton",
                "skipAdButton",
                "countDown",
                "countDownText",
                "skipDelay",
                "skipDelayText"
            ];
            var eleArr = [
                "adMute",
                "adEscMute",
                "adLink",
                "adPauseClose",
                "adSkipButton",
                "adTime",
                "adTimeText",
                "adSkip",
                "adSkipText"
            ];
            for (var i = 0; i < eleArr.length; i++) {
                var cssUp = {
                    overflow: "hidden",
                    zIndex: 999
                };
                if (i < 5) {
                    cssUp["cursor"] = "pointer";
                }
                var cssTemp = this.getEleCss(
                    this.ckStyle["advertisement"][asArr[i]],
                    cssUp
                );
                this.css(this.CB[eleArr[i]], cssTemp);
            }
        },
        checkBarWidth: function() {
            if (!this.conBarShow) {
                return;
            }
        },
        initPlayPause: function() {
            if (!this.conBarShow) {
                return;
            }
            if (this.vars["autoplay"]) {
                this.css([this.CB["play"], this.CB["pauseCenter"]], "display", "none");
                this.css(this.CB["pause"], "display", "block");
            } else {
                this.css(this.CB["play"], "display", "block");
                if (this.css(this.CB["errorText"], "display") == "none") {
                    this.css(this.CB["pauseCenter"], "display", "block");
                }
                this.css(this.CB["pause"], "display", "none");
            }
        },
        loadedHandler: function() {
            this.loaded = true;
            if (this.vars["loaded"] != "") {
                try {
                    eval(this.vars["loaded"] + "('" + this.vars["variable"] + "')");
                } catch (event) {
                    this.log(event);
                }
            }
        },
        playingHandler: function() {
            this.playShow(true);
            if (
                this.isFirstTimePlay &&
                !this.isUndefined(this.advertisements["front"])
            ) {
                this.isFirstTimePlay = false;
                this.adI = 0;
                this.adType = "front";
                this.adMuteInto();
                this.adIsVideoTime = true;
                this.adPlayStart = true;
                this.adVideoPlay = false;
                this.videoPause();
                this.advertisementsTime();
                this.advertisementsPlay();
                this.adSkipButtonShow();
                return;
            }
            if (this.adPlayerPlay) {
                return;
            }
            if (this.needSeek > 0) {
                this.videoSeek(this.needSeek);
                this.needSeek = 0;
            }
            if (this.animatePauseArray.length > 0) {
                this.animateResume("pause");
            }
            if (this.V != null && this.ckConfig["config"]["videoDrawImage"]) {
                this.sendVCanvas();
            }
            if (
                !this.isUndefined(this.advertisements["pause"]) &&
                !this.adPlayStart
            ) {
                this.closePauseAd();
            }
        },
        adPausePlayer: function() {
            this.adI = 0;
            this.adType = "pause";
            this.adPauseShow = true;
            this.loadAdPause();
            this.sendJS("pauseAd", "play");
        },
        loadAdPause: function() {
            var ad = this.getNowAdvertisements();
            var type = ad["type"];
            var thisTemp = this;
            if (this.isStrImage(type) && this.adPauseShow) {
                this.css(this.CB["adElement"], "display", "block");
                var imgClass = "adimg" + this.randomString(10);
                var imgHtml = '<img src="' + ad["file"] + '" class="' + imgClass + '">';
                if (ad["link"]) {
                    imgHtml =
                        '<a href="' + ad["link"] + '" target="_blank">' + imgHtml + "</a>";
                }
                this.CB["adElement"].innerHTML = imgHtml;
                this.addListenerInside(
                    "load",
                    function() {
                        var imgObj = new Image();
                        imgObj.src = this.src;
                        var imgWH = thisTemp.adjustmentWH(imgObj.width, imgObj.height);
                        thisTemp.css(
                            [thisTemp.getByElement(imgClass), thisTemp.CB["adElement"]],
                            {
                                width: imgWH["width"] + "px",
                                height: imgWH["height"] + "px",
                                border: "0px"
                            }
                        );
                        if (
                            thisTemp.ckStyle["advertisement"]["closeButtonShow"] &&
                            thisTemp.adPauseShow
                        ) {
                            thisTemp.css(thisTemp.CB["adPauseClose"], {
                                display: "block"
                            });
                        }
                        thisTemp.ajaxSuccessNull(ad["exhibitionMonitor"]);
                        thisTemp.adPauseCoor();
                    },
                    this.getByElement(imgClass)
                );
                this.addListenerInside(
                    "click",
                    function() {
                        thisTemp.ajaxSuccessNull(ad["clickMonitor"]);
                    },
                    this.CB["adElement"]
                );
                var newI = this.adI;
                if (this.adI < this.advertisements["pause"].length - 1) {
                    newI++;
                } else {
                    newI = 0;
                }
                if (ad["time"] > 0) {
                    setTimeout(function() {
                        if (thisTemp.adPauseShow) {
                            thisTemp.adI = newI;
                            thisTemp.loadAdPause();
                        }
                    }, ad["time"] * 1000);
                }
            }
        },
        adPauseCoor: function() {
            if (this.css(this.CB["adElement"], "display") == "block") {
                var w = this.CB["adElement"].offsetWidth,
                    h = this.CB["adElement"].offsetHeight;
                var pw = this.PD.offsetWidth,
                    ph = this.PD.offsetHeight;
                this.css(this.CB["adElement"], {
                    top: (ph - h) * 0.5 + "px",
                    left: (pw - w) * 0.5 + "px"
                });
                if (this.css(this.CB["adPauseClose"], "display") == "block") {
                    var rr = this.ckStyle["advertisement"]["closeButton"];
                    var cxy = this.getPosition(rr, this.CB["adElement"]);
                    this.css(this.CB["adPauseClose"], {
                        top: cxy["y"] + "px",
                        left: cxy["x"] + "px"
                    });
                }
            }
        },
        closePauseAd: function() {
            this.CB["adElement"].innerHTML = "";
            this.css(
                [this.CB["adElement"], this.CB["adPauseClose"]],
                "display",
                "none"
            );
            this.adPauseShow = false;
            this.sendJS("pauseAd", "ended");
        },
        advertisementsTime: function(nt) {
            if (this.isUndefined(nt)) {
                nt = 0;
            }
            var ad = this.advertisements[this.adType];
            if (nt > 0) {
                ad[this.adI]["time"] = Math.ceil(nt);
            }
            this.adTimeAllTotal = 0;
            for (var i = this.adI; i < ad.length; i++) {
                if (!this.isUndefined(ad[i]["time"])) {
                    this.adTimeAllTotal += Math.ceil(ad[i]["time"]);
                }
            }
            if (this.adTimeAllTotal > 0) {
                this.CB["adTimeText"].innerHTML = this.ckLanguage["adCountdown"]
                    .replace("[$second]", this.adTimeAllTotal)
                    .replace(
                        "[$Second]",
                        this.adTimeAllTotal > 9
                            ? this.adTimeAllTotal
                            : "0" + this.adTimeAllTotal
                    );
            }
            if (this.adPauseShow) {
                this.closePauseAd();
            }
            this.adOtherCloseAll();
            this.adTimeTotal = -1;
        },
        adSkipButtonShow: function() {
            var thisTemp = this;
            var skipConfig = this.ckStyle["advertisement"];
            var delayTimeTemp = skipConfig[this.adType + "SkipButtonDelay"];
            var timeFun = function() {
                if (delayTimeTemp >= 0) {
                    thisTemp.CB["adSkipText"].innerHTML = thisTemp.ckLanguage["skipDelay"]
                        .replace("[$second]", delayTimeTemp)
                        .replace(
                            "[$Second]",
                            delayTimeTemp > 9 ? delayTimeTemp : "0" + delayTimeTemp
                        );
                    thisTemp.css(
                        [thisTemp.CB["adSkip"], thisTemp.CB["adSkipText"]],
                        "display",
                        "block"
                    );
                    thisTemp.css(thisTemp.CB["adSkipButton"], "display", "none");
                    setTimeout(timeFun, 1000);
                } else {
                    thisTemp.css(
                        [thisTemp.CB["adSkip"], thisTemp.CB["adSkipText"]],
                        "display",
                        "none"
                    );
                    if (thisTemp.css(thisTemp.CB["adTime"], "display") == "block") {
                        thisTemp.css(thisTemp.CB["adSkipButton"], "display", "block");
                    }
                }
                delayTimeTemp--;
            };
            if (skipConfig["skipButtonShow"]) {
                if (
                    skipConfig[this.adType + "SkipButtonDelay"] > 0 &&
                    this.isUndefined(this.adSkipButtonTime)
                ) {
                    thisTemp.css(
                        [thisTemp.CB["adSkip"], thisTemp.CB["adSkipText"]],
                        "display",
                        "block"
                    );
                    timeFun();
                } else {
                    thisTemp.css(
                        [thisTemp.CB["adSkip"], thisTemp.CB["adSkipText"]],
                        "display",
                        "none"
                    );
                    thisTemp.css(thisTemp.CB["adSkipButton"], "display", "block");
                }
            }
        },
        advertisementsPlay: function() {
            this.css(
                [
                    this.CB["adBackground"],
                    this.CB["adElement"],
                    this.CB["adTime"],
                    this.CB["adTimeText"],
                    this.CB["adSkip"],
                    this.CB["adSkipText"],
                    this.CB["adSkipButton"],
                    this.CB["adLink"]
                ],
                "display",
                "none"
            );
            this.adPlayerPlay = false;
            var ad = this.advertisements[this.adType];
            if (
                this.adI == 0 &&
                (this.adType == "front" ||
                    this.adType == "insert" ||
                    this.adType == "end")
            ) {
                this.sendJS("process", this.adType + " ad play");
                this.sendJS(this.adType + "Ad", "play");
            }
            this.trackHide();
            if (this.adI < ad.length) {
                if (!this.isUndefined(ad[this.adI]["time"])) {
                    this.adTimeTotal = parseInt(ad[this.adI]["time"]);
                }
                this.loadAdvertisements();
            } else {
                this.adEnded();
            }
        },
        eliminateAd: function() {
            if (this.adType) {
                var ad = this.advertisements[this.adType];
                this.adI = ad.length;
                this.advertisementsPlay();
            }
        },
        adEnded: function() {
            this.adPlayStart = false;
            if (this.adType == "front") {
                this.time = 0;
            }
            this.adPlayerPlay = false;
            if (this.adVideoPlay) {
                if (this.videoTemp["src"] != "") {
                    this.V.src = this.videoTemp["src"];
                } else {
                    if (this.V.src) {
                        this.V.removeAttribute("src");
                    }
                }
                if (this.videoTemp["source"] != "") {
                    this.V.innerHTML = this.videoTemp["source"];
                }
                if (this.videoTemp["currentSrc"] != "") {
                    this.V.src = this.videoTemp["currentSrc"];
                    this.V.currentSrc = this.videoTemp["currentSrc"];
                }
                if (this.videoTemp["loop"]) {
                    this.V.loop = true;
                    this.videoTemp["loop"] = false;
                }
                if (this.adType == "end") {
                    this.endedHandler();
                } else {
                    this.videoPlay();
                }
            } else {
                this.videoPlay();
            }
            this.changeVolume(this.vars["volume"]);
            this.sendJS("process", this.adType + " ad ended");
            this.sendJS(this.adType + "Ad", "ended");
            this.changeControlBarShow(true);
            this.css(this.CB["logo"], "display", "block");
            this.customShow(true);
            this.css(
                [
                    this.CB["adBackground"],
                    this.CB["adElement"],
                    this.CB["adTime"],
                    this.CB["adTimeText"],
                    this.CB["adSkip"],
                    this.CB["adSkipText"],
                    this.CB["adSkipButton"],
                    this.CB["adLink"],
                    this.CB["adMute"],
                    this.CB["adEscMute"]
                ],
                "display",
                "none"
            );
        },
        loadAdvertisements: function() {
            var ad = this.getNowAdvertisements();
            var type = ad["type"];
            var thisTemp = this;
            var width = this.PD.offsetWidth,
                height = this.PD.offsetHeight;
            this.changeControlBarShow(false);
            this.adPlayerPlay = true;
            this.css(this.CB["logo"], "display", "none");
            this.customShow(false);
            if (this.isStrImage(type)) {
                this.css(
                    [
                        this.CB["adBackground"],
                        this.CB["adElement"],
                        this.CB["adTime"],
                        this.CB["adTimeText"]
                    ],
                    "display",
                    "block"
                );
                this.css([this.CB["adMute"], this.CB["adEscMute"]], "display", "none");
                var imgClass = "adimg" + this.randomString(10);
                var imgHtml = '<img src="' + ad["file"] + '" class="' + imgClass + '">';
                if (ad["link"]) {
                    imgHtml =
                        '<a href="' + ad["link"] + '" target="_blank">' + imgHtml + "</a>";
                }
                this.CB["adElement"].innerHTML = imgHtml;
                this.addListenerInside(
                    "load",
                    function() {
                        var imgObj = new Image();
                        imgObj.src = this.src;
                        var imgWH = thisTemp.adjustmentWH(imgObj.width, imgObj.height);
                        thisTemp.css(thisTemp.getByElement(imgClass), {
                            width: imgWH["width"] + "px",
                            height: imgWH["height"] + "px",
                            border: "0px"
                        });
                        thisTemp.css(thisTemp.CB["adElement"], {
                            width: imgWH["width"] + "px",
                            height: imgWH["height"] + "px",
                            top: (height - imgWH["height"]) * 0.5 + "px",
                            left: (width - imgWH["width"]) * 0.5 + "px"
                        });
                        thisTemp.ajaxSuccessNull(ad["exhibitionMonitor"]);
                    },
                    this.getByElement(imgClass)
                );
                this.addListenerInside(
                    "click",
                    function() {
                        thisTemp.ajaxSuccessNull(ad["clickMonitor"]);
                    },
                    this.CB["adElement"]
                );
                if (!this.isUndefined(ad["time"])) {
                    this.adCountDown();
                }
            } else {
                this.css(
                    [this.CB["adTime"], this.CB["adTimeText"]],
                    "display",
                    "block"
                );
                if (this.adVideoMute) {
                    this.css(this.CB["adEscMute"], "display", "block");
                    this.css(this.CB["adMute"], "display", "none");
                } else {
                    this.css(this.CB["adEscMute"], "display", "none");
                    this.css(this.CB["adMute"], "display", "block");
                }
                this.CB["adElement"].innerHTML = "";
                if (this.videoTemp["currentSrc"] == "") {
                    this.videoTemp["currentSrc"] = this.getCurrentSrc();
                }
                if (this.V.loop) {
                    this.videoTemp["loop"] = true;
                    this.V.loop = false;
                }
                if (
                    this.V != null &&
                    this.V.currentTime > 0 &&
                    this.adIsVideoTime &&
                    this.adType != "front"
                ) {
                    this.adIsVideoTime = false;
                    this.needSeek = this.V.currentTime;
                }
                this.V.src = ad["file"];
                this.V.currentSrc = ad["file"];
                this.V.innerHTML = "";
                this.V.play();
                this.adVideoPlay = true;
                this.ajaxSuccessNull(ad["exhibitionMonitor"]);
                if (!this.adVideoMute) {
                    this.escAdMute();
                }
            }
            if (ad["link"]) {
                this.css(this.CB["adLink"], "display", "block");
                var adLinkClick = function(event) {
                    thisTemp.sendJS("clickEvent", "javaScript->adLinkClick");
                };
                this.addListenerInside("click", adLinkClick, this.CB["adLink"]);
                this.adLinkTemp = ad["link"];
                var linkTemp =
                    '<a href="' +
                    ad["link"] +
                    '" target="_blank" class="ckadmorelink"><img src="' +
                    this.ckStyle["png-1-1"] +
                    '" width="' +
                    this.ckStyle["advertisement"]["adLinkButton"]["width"] +
                    '" height="' +
                    this.ckStyle["advertisement"]["adLinkButton"]["height"] +
                    '"></a>';
                this.CB["adLink"].innerHTML = linkTemp;
                this.css(this.getByElement("ckadmorelink"), {
                    color: "#FFFFFF",
                    textDecoration: "none"
                });
                this.addListenerInside(
                    "click",
                    function() {
                        thisTemp.ajaxSuccessNull(ad["clickMonitor"]);
                    },
                    this.CB["adLink"]
                );
            } else {
                this.css(this.CB["adLink"], "display", "none");
            }
        },
        adCountDown: function() {
            var thisTemp = this;
            if (this.adTimeTotal > 0) {
                if (!this.adIsPause) {
                    this.adTimeTotal--;
                    this.showAdTime();
                    this.adCountDownObj = null;
                    this.adCountDownObj = setTimeout(function() {
                        thisTemp.adCountDown();
                    }, 1000);
                }
            } else {
                this.adI++;
                this.advertisementsPlay();
            }
        },
        adPlayerTimeHandler: function(time) {
            var ad = this.getNowAdvertisements();
            var type = ad["type"];
            if (this.isStrImage(type)) {
                return;
            }
            if (this.adTimeTotal != parseInt(time)) {
                this.adTimeTotal = parseInt(time);
                this.showAdTime();
            }
        },
        showAdTime: function() {
            this.adTimeAllTotal--;
            var n = this.adTimeAllTotal;
            if (n < 0) {
                n = 0;
            }
            this.CB["adTimeText"].innerHTML = this.ckLanguage["adCountdown"]
                .replace("[$second]", n)
                .replace("[$Second]", n < 10 ? "0" + n : n);
        },
        checkAdOther: function(t) {
            if (this.adPlayerPlay) {
                return;
            }
            var adTime = this.advertisements["othertime"];
            var adPlay = this.advertisements["otherPlay"];
            for (var i = 0; i < adTime.length; i++) {
                if (t >= adTime[i] && !adPlay[i]) {
                    adPlay[i] = true;
                    this.newAdOther(i);
                }
            }
        },
        newAdOther: function(i) {
            var thisTemp = this;
            var ad = this.advertisements["other"][i];
            var randomS = this.randomString(10);
            var adDivID = "adother" + randomS;
            var imgClassName = "adimgother" + randomS;
            var adDiv = document.createElement("div");
            adDiv.className = adDivID;
            this.PD.appendChild(adDiv);
            ad["div"] = adDivID;
            ad["element"] = imgClassName;
            var adHtml =
                '<img src="' + ad["file"] + '" class="' + imgClassName + '">';
            if (ad["link"]) {
                adHtml =
                    '<a href="' + ad["link"] + '" target="blank">' + adHtml + "</a>";
            }
            this.getByElement(adDivID).innerHTML = adHtml;
            this.css(adDivID, {
                position: "absolute",
                overflow: "hidden",
                zIndex: "996",
                top: "-600px",
                left: "-600px",
                cursor: "pointer"
            });
            if (this.ckStyle["advertisement"]["closeOtherButtonShow"]) {
                var closeAdDivID = "adotherclose-" + randomS;
                var closeAdDiv = document.createElement("div");
                closeAdDiv.className = closeAdDivID;
                this.PD.appendChild(closeAdDiv);
                ad["closeDiv"] = closeAdDivID;
                ad["close"] = false;
                var closeAdDivCss = this.getEleCss(
                    this.ckStyle["advertisement"]["closeOtherButton"],
                    {
                        offsetX: -10000,
                        offsetY: -10000,
                        cursor: "pointer",
                        zIndex: 997
                    }
                );
                this.css(closeAdDivID, closeAdDivCss);
                var adOtherCloseOver = function() {
                    thisTemp.loadImgBg(
                        closeAdDivID,
                        thisTemp.ckStyle["advertisement"]["closeOtherButton"]["mouseOver"]
                    );
                };
                var adOtherCloseOut = function() {
                    thisTemp.loadImgBg(
                        closeAdDivID,
                        thisTemp.ckStyle["advertisement"]["closeOtherButton"]["mouseOut"]
                    );
                };
                adOtherCloseOut();
                this.addListenerInside(
                    "mouseover",
                    adOtherCloseOver,
                    this.getByElement(closeAdDivID)
                );
                this.addListenerInside(
                    "mouseout",
                    adOtherCloseOut,
                    this.getByElement(closeAdDivID)
                );
            }
            this.addListenerInside(
                "load",
                function() {
                    var imgObj = new Image();
                    imgObj.src = this.src;
                    var imgWH = thisTemp.adjustmentWH(imgObj.width, imgObj.height);
                    thisTemp.css(
                        [
                            thisTemp.getByElement(imgClassName),
                            thisTemp.getByElement(adDivID)
                        ],
                        {
                            width: imgWH["width"] + "px",
                            height: imgWH["height"] + "px",
                            border: "0px"
                        }
                    );
                    thisTemp.advertisements["other"][i] = ad;
                    thisTemp.ajaxSuccessNull(ad["exhibitionMonitor"]);
                    thisTemp.adOtherCoor();
                },
                this.getByElement(imgClassName)
            );
            this.addListenerInside(
                "click",
                function() {
                    thisTemp.adOtherClose(i);
                },
                this.getByElement(closeAdDivID)
            );
            this.addListenerInside(
                "click",
                function() {
                    thisTemp.ajaxSuccessNull(ad["clickMonitor"]);
                },
                this.getByElement(imgClassName)
            );
            if (ad["time"] > 0) {
                setTimeout(function() {
                    thisTemp.adOtherClose(i);
                }, ad["time"] * 1000);
            }
        },
        adOtherClose: function(i) {
            var ad = this.advertisements["other"][i];
            if (!this.isUndefined(ad["close"])) {
                if (!ad["close"]) {
                    ad["close"] = true;
                    this.PD.removeChild(this.getByElement(ad["div"]));
                    this.PD.removeChild(this.getByElement(ad["closeDiv"]));
                }
            }
        },
        adOtherCloseAll: function() {
            if (!this.isUndefined(this.advertisements["other"])) {
                var ad = this.advertisements["other"];
                for (var i = 0; i < ad.length; i++) {
                    this.adOtherClose(i);
                }
            }
        },
        adOtherCoor: function() {
            if (!this.isUndefined(this.advertisements["other"])) {
                var arr = this.advertisements["other"];
                for (var i = 0; i < arr.length; i++) {
                    var ad = arr[i];
                    if (!this.isUndefined(ad["close"])) {
                        if (!ad["close"]) {
                            var rr = this.ckStyle["advertisement"]["closeOtherButton"];
                            var coor = this.getPosition(ad);
                            var x = coor["x"],
                                y = coor["y"];
                            this.css(this.getByElement(ad["div"]), {
                                left: x + "px",
                                top: y + "px"
                            });
                            var cxy = this.getPosition(rr, this.getByElement(ad["div"]));
                            if (!this.isUndefined(ad["closeDiv"])) {
                                this.css(this.getByElement(ad["closeDiv"]), {
                                    left: cxy["x"] + "px",
                                    top: cxy["y"] + "px"
                                });
                            }
                        }
                    }
                }
            }
        },
        checkAdInsert: function(t) {
            if (this.adPlayerPlay) {
                return;
            }
            var adTime = this.advertisements["inserttime"];
            var adPlay = this.advertisements["insertPlay"];
            var duration = this.getMetaDate()["duration"];
            for (var i = adTime.length - 1; i > -1; i--) {
                if (t >= adTime[i] && t < duration - 2 && t > 1 && !adPlay[i]) {
                    this.adI = 0;
                    this.adType = "insert";
                    this.adMuteInto();
                    this.adIsVideoTime = true;
                    this.adPlayStart = true;
                    this.adVideoPlay = false;
                    this.videoPause();
                    this.advertisementsTime();
                    this.advertisementsPlay();
                    this.adSkipButtonShow();
                    adPlay[i] = true;
                    for (var n = 0; n < i + 1; n++) {
                        adPlay[n] = true;
                    }
                    break;
                }
            }
        },
        formatInserttime: function(duration) {
            if (!this.isUndefined(this.advertisements["inserttime"])) {
                var arr = this.advertisements["inserttime"];
                var newArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].toString().substr(-1) == "%") {
                        newArr.push(parseInt(duration * parseInt(arr[i]) * 0.01));
                    } else {
                        newArr.push(parseInt(arr[i]));
                    }
                }
                this.advertisements["inserttime"] = newArr;
            }
        },
        getNowAdvertisements: function() {
            if (this.adI == -1) {
                return {
                    file: "",
                    time: 0,
                    link: ""
                };
            }
            return this.advertisements[this.adType][this.adI];
        },
        adjustmentWH: function(w, h) {
            var width = this.PD.offsetWidth,
                height = this.PD.offsetHeight;
            var nw = 0,
                nh = 0;
            if (w >= width || h >= height) {
                if (width / w > height / h) {
                    nh = height - 20;
                    nw = (w * nh) / h;
                } else {
                    nw = width - 20;
                    nh = (h * nw) / w;
                }
            } else {
                nw = w;
                nh = h;
            }
            return {
                width: nw,
                height: nh
            };
        },
        ajaxSuccessNull: function(url) {
            if (!this.isUndefined(url)) {
                var ajaxObj = {
                    url: url,
                    success: function(data) {}
                };
                this.ajax(ajaxObj);
            }
        },
        runFunction: function(s) {
            try {
                var arr = s.split("->");
                if (arr.length == 2) {
                    switch (arr[0]) {
                        case "javaScript":
                            if (arr[1].substr(0, 11) != "[flashvars]") {
                                eval(arr[1] + "()");
                            } else {
                                eval(this.vars[arr[1].substr(11)] + "()");
                            }
                            break;
                        case "actionScript":
                            eval("this." + arr[1] + "()");
                            break;
                    }
                }
                this.sendJS("clickEvent", s);
            } catch (event) {}
        },
        sendVCanvas: function() {
            if (this.timerVCanvas == null) {
                this.css(this.V, "display", "none");
                this.css(this.MD, "display", "block");
                var thisTemp = this;
                var videoCanvas = function() {
                    if (thisTemp.MDCX.width != thisTemp.MD.offsetWidth) {
                        thisTemp.MDC.width = thisTemp.MD.offsetWidth;
                    }
                    if (thisTemp.MDCX.height != thisTemp.MD.offsetHeight) {
                        thisTemp.MDC.height = thisTemp.MD.offsetHeight;
                    }
                    thisTemp.MDCX.clearRect(
                        0,
                        0,
                        thisTemp.MDCX.width,
                        thisTemp.MDCX.height
                    );
                    var coor = thisTemp.getProportionCoor(
                        thisTemp.PD.offsetWidth,
                        thisTemp.PD.offsetHeight,
                        thisTemp.V.videoWidth,
                        thisTemp.V.videoHeight
                    );
                    thisTemp.MDCX.drawImage(
                        thisTemp.V,
                        0,
                        0,
                        thisTemp.V.videoWidth,
                        thisTemp.V.videoHeight,
                        coor["x"],
                        coor["y"],
                        coor["width"],
                        coor["height"]
                    );
                };
                this.timerVCanvas = new this.timer(0, videoCanvas);
            }
        },
        pauseHandler: function() {
            var thisTemp = this;
            this.playShow(false);
            if (this.animatePauseArray.length > 0) {
                this.animatePause("pause");
            }
            if (this.V != null && this.ckConfig["config"]["videoDrawImage"]) {
                this.stopVCanvas();
            }
            if (
                !this.isUndefined(this.advertisements["pause"]) &&
                !this.adPlayStart &&
                !this.adPauseShow
            ) {
                setTimeout(function() {
                    if (
                        !thisTemp.isUndefined(thisTemp.advertisements["pause"]) &&
                        !thisTemp.adPlayStart &&
                        !thisTemp.adPauseShow &&
                        thisTemp.time > 1
                    ) {
                        thisTemp.adPausePlayer();
                    }
                }, 300);
            }
        },
        stopVCanvas: function() {
            if (this.timerVCanvas != null) {
                this.css(this.V, "display", "block");
                this.css(this.MD, "display", "none");
                if (this.timerVCanvas.runing) {
                    this.timerVCanvas.stop();
                }
                this.timerVCanvas = null;
            }
        },
        playShow: function(b) {
            if (!this.conBarShow) {
                return;
            }
            if (b) {
                this.css(this.CB["play"], "display", "none");
                this.css(this.CB["pauseCenter"], "display", "none");
                this.css(this.CB["pause"], "display", "block");
            } else {
                this.css(this.CB["play"], "display", "block");
                if (this.css(this.CB["errorText"], "display") == "none") {
                    if (!this.adPlayerPlay) {
                        this.css(this.CB["pauseCenter"], "display", "block");
                    }
                } else {
                    this.css(this.CB["pauseCenter"], "display", "none");
                }
                this.css(this.CB["pause"], "display", "none");
            }
        },
        seekedHandler: function() {
            this.resetTrack();
            this.isTimeButtonMove = true;
            if (this.V.paused) {
                if (this.hlsAutoPlay) {
                    this.videoPlay();
                } else {
                    this.hlsAutoPlay = true;
                }
            }
        },
        endedHandler: function() {
            this.sendJS("ended");
            if (this.adPlayerPlay) {
                this.adI++;
                this.advertisementsPlay();
                return;
            }
            if (!this.endAdPlay && !this.isUndefined(this.advertisements["end"])) {
                this.endAdPlay = true;
                this.adI = 0;
                this.adType = "end";
                this.adMuteInto();
                this.adIsVideoTime = true;
                this.adPlayStart = true;
                this.adVideoPlay = false;
                this.videoPause();
                this.advertisementsTime();
                this.advertisementsPlay();
                this.adSkipButtonShow();
                this.adReset = true;
                return;
            }
            this.endedAdReset();
            if (this.vars["loop"]) {
                this.videoSeek(0);
            }
        },
        endedAdReset: function() {
            var arr = [];
            var i = 0;
            if (!this.isUndefined(this.advertisements["insertPlay"])) {
                arr = this.advertisements["insertPlay"];
                for (i = 0; i < arr.length; i++) {
                    this.advertisements["insertPlay"][i] = false;
                }
            }
            if (!this.isUndefined(this.advertisements["otherPlay"])) {
                arr = this.advertisements["otherPlay"];
                for (i = 0; i < arr.length; i++) {
                    this.advertisements["otherPlay"][i] = false;
                }
            }
        },
        volumechangeHandler: function() {
            if (!this.conBarShow) {
                return;
            }
            if (this.vars["autoplay"] && document.getElementById(this.V.id).muted) {
                this.css(this.CB["mute"], "display", "none");
                this.css(this.CB["escMute"], "display", "block");
            }
            if (
                (this.ckConfig["config"]["mobileVolumeBarShow"] || !this.mobileTrue) &&
                this.css(this.CB["volume"], "display") != "none"
            ) {
                try {
                    var volume = this.volume || this.V.volume;
                    if (volume == undefined) volume = 0;
                    if (volume > 0) {
                        this.css(this.CB["mute"], "display", "block");
                        this.css(this.CB["escMute"], "display", "none");
                    } else {
                        this.css(this.CB["mute"], "display", "none");
                        this.css(this.CB["escMute"], "display", "block");
                    }
                } catch (event) {}
            }
        },
        timeUpdateHandler: function() {
            var duration = 0;
            try {
                duration = this.V.duration;
            } catch (event) {}
            if (isNaN(duration) || parseInt(duration) < 0.2) {
                duration = this.vars["duration"];
            }
            if (this.vars["forceduration"] > 0) {
                duration = this.vars["forceduration"];
            }
            if (duration > 0) {
                this.time = this.V.currentTime;
                this.timeTextHandler();
                this.trackShowHandler();
                if (this.isTimeButtonMove) {
                    this.timeProgress(this.time, duration);
                }
            }
        },
        controlBar: function() {
            var cb = this.ckStyle["controlBar"];
            var cssObjTemp = {
                align: cb["align"],
                vAlign: cb["vAlign"],
                width: cb["width"],
                height: cb["height"],
                offsetX: cb["offsetX"],
                offsetY: cb["offsetY"]
            };
            var bgCss = {
                backgroundColor: cb["background"]["backgroundColor"],
                backgroundImg: cb["background"]["backgroundImg"],
                alpha: cb["background"]["alpha"]
            };
            var cssTemp = this.getEleCss(this.objectAssign(cssObjTemp, bgCss), {
                zIndex: 888
            });
            this.css(this.CB["controlBarBg"], cssTemp);
            cssTemp = this.getEleCss(cssObjTemp, {
                zIndex: 889
            });
            this.css(this.CB["controlBar"], cssTemp);
        },
        timeProgress: function(time, duration) {
            if (!this.conBarShow) {
                return;
            }
            var timeProgressBgW = this.CB["timeProgressBg"].offsetWidth;
            var timeBOW = parseInt(
                (time * timeProgressBgW) / duration -
                this.CB["timeButton"].offsetWidth * 0.5
            );
            if (timeBOW > timeProgressBgW - this.CB["timeButton"].offsetWidth) {
                timeBOW = timeProgressBgW - this.CB["timeButton"].offsetWidth;
            }
            if (timeBOW < 0) {
                timeBOW = 0;
            }
            this.css(this.CB["timeProgress"], "width", timeBOW + "px");
            this.css(this.CB["timeButton"], "left", parseInt(timeBOW) + "px");
        },
        timeTextHandler: function() {
            if (!this.conBarShow) {
                return;
            }
            var duration = this.V.duration;
            var time = this.V.currentTime;
            if (isNaN(duration) || parseInt(duration) < 0.2) {
                duration = this.vars["duration"];
            }
            if (this.vars["forceduration"] > 0) {
                duration = this.vars["forceduration"];
            }
            this.CB["timeText"].innerHTML = this.formatTime(
                time,
                duration,
                this.ckLanguage["vod"]
            );
        },
        bufferEdHandler: function() {
            if (!this.conBarShow) {
                return;
            }
            var thisTemp = this;
            var clearTimerBuffer = function() {
                if (thisTemp.timerBuffer != null) {
                    if (thisTemp.timerBuffer.runing) {
                        thisTemp.sendJS("buffer", 100);
                        thisTemp.timerBuffer.stop();
                    }
                    thisTemp.timerBuffer = null;
                }
            };
            clearTimerBuffer();
            var bufferFun = function() {
                if (
                    !thisTemp.isUndefined(thisTemp.V) &&
                    thisTemp.V.buffered.length > 0
                ) {
                    var duration = thisTemp.V.duration;
                    var len = thisTemp.V.buffered.length;
                    var bufferStart = thisTemp.V.buffered.start(len - 1);
                    var bufferEnd = thisTemp.V.buffered.end(len - 1);
                    var loadTime = bufferStart + bufferEnd;
                    var loadProgressBgW = thisTemp.CB["timeProgressBg"].offsetWidth;
                    var timeButtonW = thisTemp.CB["timeButton"].offsetWidth;
                    var loadW = parseInt(
                        (loadTime * loadProgressBgW) / duration + timeButtonW
                    );
                    if (loadW >= loadProgressBgW) {
                        loadW = loadProgressBgW;
                        clearTimerBuffer();
                    }
                    thisTemp.changeLoad(loadTime);
                }
            };
            this.timerBuffer = new this.timer(200, bufferFun);
        },
        changeLoad: function(loadTime) {
            if (this.V == null) {
                return;
            }
            if (!this.conBarShow) {
                return;
            }
            var loadProgressBgW = this.CB["timeProgressBg"].offsetWidth;
            var timeButtonW = this.CB["timeButton"].offsetWidth;
            var duration = this.V.duration;
            if (isNaN(duration) || parseInt(duration) < 0.2) {
                duration = this.vars["duration"];
            }
            if (this.vars["forceduration"] > 0) {
                duration = this.vars["forceduration"];
            }
            if (this.isUndefined(loadTime)) {
                loadTime = this.loadTime;
            } else {
                this.loadTime = loadTime;
            }
            var loadW = parseInt(
                (loadTime * loadProgressBgW) / duration + timeButtonW
            );
            this.css(this.CB["loadProgress"], "width", loadW + "px");
            this.sendJS("loadTime", loadTime);
            this.loadTimeTemp = loadTime;
        },
        judgeIsLive: function() {
            var thisTemp = this;
            if (this.timerError != null) {
                if (this.timerError.runing) {
                    this.timerError.stop();
                }
                this.timerError = null;
            }
            this.error = false;
            if (this.conBarShow) {
                this.css(this.CB["errorText"], "display", "none");
            }
            var timeupdate = function(event) {
                thisTemp.timeUpdateHandler();
            };
            if (!this.vars["live"]) {
                if (this.V != null) {
                    this.addListenerInside("timeupdate", timeupdate);
                    thisTemp.timeTextHandler();
                    thisTemp.prompt();
                    setTimeout(function() {
                        thisTemp.bufferEdHandler();
                    }, 200);
                }
            } else {
                this.removeListenerInside("timeupdate", timeupdate);
                if (this.timerTime != null) {
                    window.clearInterval(this.timerTime);
                    timerTime = null;
                }
                if (this.timerTime != null) {
                    if (this.timerTime.runing) {
                        this.timerTime.stop();
                    }
                    this.timerTime = null;
                }
                var timeFun = function() {
                    if (thisTemp.V != null && !thisTemp.V.paused && thisTemp.conBarShow) {
                        thisTemp.CB["timeText"].innerHTML = thisTemp.formatTime(
                            0,
                            0,
                            thisTemp.ckLanguage["live"]
                        );
                    }
                };
                this.timerTime = new this.timer(1000, timeFun);
            }
            this.definition();
        },
        loadTrack: function(def) {
            if (this.isUndefined(def)) {
                def = -1;
            }
            var track = this.vars["cktrack"];
            var loadTrackUrl = "";
            var type = this.varType(track);
            var thisTemp = this;
            if (type == "array") {
                if (def == -1) {
                    var index = 0;
                    var indexN = 0;
                    for (var i = 0; i < track.length; i++) {
                        var li = track[i];
                        if (li.length == 3 && li[2] > indexN) {
                            indexN = li[2];
                            index = i;
                        }
                    }
                } else {
                    index = def;
                }
                loadTrackUrl = track[index][0];
            } else {
                loadTrackUrl = track;
            }
            var obj = {
                method: "get",
                dataType: "text",
                url: loadTrackUrl,
                charset: "utf-8",
                success: function(data) {
                    if (data) {
                        thisTemp.track = thisTemp.parseSrtSubtitles(data);
                        thisTemp.trackIndex = 0;
                        thisTemp.nowTrackShow = {
                            sn: ""
                        };
                    }
                }
            };
            this.ajax(obj);
        },
        resetTrack: function() {
            this.trackIndex = 0;
            this.nowTrackShow = {
                sn: ""
            };
        },
        trackShowHandler: function() {
            if (!this.conBarShow || this.adPlayerPlay) {
                return;
            }
            if (this.track.length < 1) {
                return;
            }
            if (this.trackIndex >= this.track.length) {
                this.trackIndex = 0;
            }
            var nowTrack = this.track[this.trackIndex];
            if (
                this.time >= nowTrack["startTime"] &&
                this.time <= nowTrack["endTime"]
            ) {
                var nowShow = this.nowTrackShow;
                if (nowShow["sn"] != nowTrack["sn"]) {
                    this.trackHide();
                    this.trackShow(nowTrack);
                    this.nowTrackTemp = nowTrack;
                }
            } else {
                this.trackHide();
                this.checkTrack();
            }
        },
        trackShowAgain: function() {
            this.trackHide();
            this.trackShow(this.nowTrackTemp);
        },
        trackShow: function(track) {
            this.nowTrackShow = track;
            var arr = track["content"];
            for (var i = 0; i < arr.length; i++) {
                var obj = {
                    list: [
                        {
                            type: "text",
                            text: arr[i],
                            color: this.ckStyle["cktrack"]["color"],
                            size: this.ckStyle["cktrack"]["size"],
                            fontFamily: this.ckStyle["cktrack"]["font"],
                            lineHeight: this.ckStyle["cktrack"]["leading"] + "px"
                        }
                    ],
                    position: [
                        1,
                        2,
                        null,
                        -(arr.length - i) * this.ckStyle["cktrack"]["leading"] -
                        this.ckStyle["cktrack"]["marginBottom"]
                    ]
                };
                var ele = this.addElement(obj);
                this.trackElement.push(ele);
            }
        },
        trackHide: function() {
            for (var i = 0; i < this.trackElement.length; i++) {
                this.deleteElement(this.trackElement[i]);
            }
            this.trackElement = [];
        },
        checkTrack: function() {
            var num = this.trackIndex;
            var arr = this.track;
            var i = 0;
            for (i = num; i < arr.length; i++) {
                if (
                    this.time >= arr[i]["startTime"] &&
                    this.time <= arr[i]["endTime"]
                ) {
                    this.trackIndex = i;
                    break;
                }
            }
        },
        playOrPause: function() {
            if (!this.loaded) {
                return;
            }
            if (this.V == null) {
                return;
            }

            if (this.V.paused) {
                this.videoPlay();
            } else {
                this.videoPause();
            }
        },
        videoPlay: function() {
            if (!this.loaded) {
                return;
            }
            if (this.adPlayerPlay) {
                this.eliminateAd(); //清除广告
                return;
            }
            try {
                if (this.V.currentSrc) {
                    this.V.play();
                } else {
                    this.V.currentSrc = this.VA[0][0];
                    this.V.play();
                }
            } catch (event) {}
            //点播统计
            if (this.vars["live"]) return;
            this.statistics_flowApi();
            if (window.playerOnce) return;
            this.statisticsApi();
            window.playerOnce = true;
        },
        videoPause: function() {
            this.statistics_flowClose();
            if (!this.loaded) {
                return;
            }
            try {
                this.V.pause();
            } catch (event) {}
        },
        videoSeek: function(time) {
            if (!this.loaded) {
                return;
            }
            var duration =
                this.V.duration > 0.2
                    ? this.V.duration
                    : this.getMetaDate()["duration"];
            if (duration > 0 && time > duration) {
                if (this.vars["forceduration"] > 0) {
                    time = 0;
                    this.sendJS("ended");
                } else {
                    time = duration - 0.1;
                }
            }
            if (time >= 0) {
                this.V.currentTime = time;
                this.sendJS("seekTime", time);
            }
        },
        setVolumeNum: function(vol) {
            vol = parseInt(vol);
            var volumeNum = document.getElementById("volumeNum");
            volumeNum.innerHTML = vol + "%";
        },
        changeVolume: function(vol, bg, button) {
            if (isNaN(vol) || this.isUndefined(vol)) {
                vol = 0;
            }
            if (!this.loaded) {
                this.vars["volume"] = vol;
            }
            if (!this.html5Video) {
                this.V.changeVolume(vol);
                return;
            }
            try {
                if (this.isUndefined(bg)) {
                    bg = true;
                }
            } catch (e) {}
            try {
                if (this.isUndefined(button)) {
                    button = true;
                }
            } catch (e) {}
            if (!vol) {
                vol = 0;
            }
            if (vol < 0) {
                vol = 0;
            }
            if (vol > 1) {
                vol = 1;
            }
            try {
                this.V.volume = vol;
            } catch (error) {}
            this.volume = vol;
            if (bg && this.conBarShow) {
                var bgW = vol * this.CB["volumeBg"].offsetWidth;
                if (bgW < 0) {
                    bgW = 0;
                }
                if (bgW > this.CB["volumeBg"].offsetWidth) {
                    bgW = this.CB["volumeBg"].offsetWidth;
                }
                this.css(this.CB["volumeUp"], "width", bgW + "px");
            }
            if (button && this.conBarShow) {
                var buLeft = parseInt(
                    this.CB["volumeUp"].offsetWidth -
                    this.CB["volumeBO"].offsetWidth * 0.5
                );
                if (
                    buLeft >
                    this.CB["volumeBg"].offsetWidth - this.CB["volumeBO"].offsetWidth
                ) {
                    buLeft =
                        this.CB["volumeBg"].offsetWidth - this.CB["volumeBO"].offsetWidth;
                }
                if (buLeft < 0) {
                    buLeft = 0;
                }
                this.css(this.CB["volumeBO"], "left", buLeft + "px");
            }
            this.setVolumeNum(vol * 100);
        },
        videoMute: function() {
            if (!this.loaded) {
                return;
            }
            this.volumeTemp = this.V
                ? this.V.volume > 0
                    ? this.V.volume
                    : this.vars["volume"]
                : this.vars["volume"];
            this.changeVolume(0);
        },
        videoEscMute: function() {
            if (this.vars["autoplay"] && document.getElementById(this.V.id).muted) {
                document.getElementById(this.V.id).muted = false;
            }
            if (!this.loaded) {
                return;
            }
            this.changeVolume(
                this.volumeTemp > 0 ? this.volumeTemp : this.vars["volume"]
            );
        },
        adMute: function() {
            if (!this.loaded) {
                return;
            }
            this.changeVolume(0);
            this.adVideoMute = true;
            this.css(this.CB["adEscMute"], "display", "block");
            this.css(this.CB["adMute"], "display", "none");
        },
        escAdMute: function() {
            if (!this.loaded) {
                return;
            }
            var v = this.ckStyle["advertisement"]["videoVolume"];
            this.changeVolume(v);
            this.adMuteInto();
        },
        adMuteInto: function() {
            this.adVideoMute = false;
            this.css(this.CB["adEscMute"], "display", "none");
            this.css(this.CB["adMute"], "display", "block");
        },
        fastBack: function() {
            if (!this.loaded) {
                return;
            }
            var time = this.time - this.ckConfig["config"]["timeJump"];
            if (time < 0) {
                time = 0;
            }
            this.videoSeek(time);
        },
        fastNext: function() {
            if (!this.loaded) {
                return;
            }
            var time = this.time + this.ckConfig["config"]["timeJump"];
            if (time > this.V.duration) {
                time = this.V.duration;
            }
            this.videoSeek(time);
        },
        getCurrentSrc: function() {
            if (!this.loaded) {
                return;
            }
            return this.V.currentSrc;
        },
        switchFull: function() {
            if (this.full) {
                this.quitFullScreen();
            } else {
                this.fullScreen();
            }
        },
        isSupportedFullScreen: function() {
            return (
                this.PD.requestFullscreen ||
                this.PD.mozRequestFullScreen ||
                this.PD.webkitRequestFullscreen ||
                this.PD.msRequestFullscreen ||
                this.PD.oRequestFullscreen
            );
        },
        fullScreen: function() {
            if (this.html5Video) {
                var element = this.PD;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.oRequestFullscreen) {
                    element.oRequestFullscreen();
                } else if (element.webkitEnterFullscreen) {
                    element.webkitEnterFullscreen();
                } else if (this.V.webkitEnterFullscreen) {
                    this.V.webkitEnterFullscreen();
                }
                this.judgeFullScreen();
            } else {
            }
        },
        quitFullScreen: function() {
            if (this.html5Video) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.oRequestFullscreen) {
                    document.oCancelFullScreen();
                } else if (document.requestFullscreen) {
                    document.requestFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else {
                    this.css(document.documentElement, "cssText", "");
                    this.css(document.document.body, "cssText", "");
                    this.css(this.PD, "cssText", "");
                }
                this.judgeFullScreen();
            }
        },
        videoRotation: function(n) {
            if (!this.loaded) {
                return;
            }
            if (this.isUndefined(n)) {
                n = 0;
            }
            var tf = this.css(this.V, "transform");
            if (this.isUndefined(tf) && !tf) {
                tf = "rotate(0deg)";
            }
            var reg = tf.match(/rotate\([^)]+\)/);
            reg = reg ? reg[0].replace("rotate(", "").replace("deg)", "") : "";
            if (reg == "") {
                reg = 0;
            } else {
                reg = parseInt(reg);
            }
            if (n == -1) {
                reg -= 90;
            } else if (n == 1) {
                reg += 90;
            } else {
                if (
                    n != 90 &&
                    n != 180 &&
                    n != 270 &&
                    n != -90 &&
                    n != -180 &&
                    n != -270
                ) {
                    reg = 0;
                } else {
                    reg = n;
                }
            }
            n = reg;
            var y90 = n % 90,
                y180 = n % 180,
                y270 = n % 270;
            var ys = false;
            if (y90 == 0 && y180 == 90 && y270 == 90) {
                ys = true;
            }
            if (y90 == 0 && y180 == 90 && y270 == 0) {
                ys = true;
            }
            if (y90 == -0 && y180 == -90 && y270 == -90) {
                ys = true;
            }
            if (y90 == -0 && y180 == -90 && y270 == -0) {
                ys = true;
            }
            tf =
                tf.replace(/rotate\([^)]+\)/, "").replace(/scale\([^)]+\)/, "") +
                " rotate(" +
                n +
                "deg)";
            var cdW = this.CD.offsetWidth,
                cdH = this.CD.offsetHeight,
                vW = this.V.videoWidth,
                vH = this.V.videoHeight;
            if (vW > 0 && vH > 0) {
                if (ys) {
                    if (cdW / cdH > vH / vW) {
                        nH = cdH;
                        nW = (vH * nH) / vW;
                    } else {
                        nW = cdW;
                        nH = (vW * nW) / vH;
                    }
                    this.css(this.V, "transform", "rotate(0deg)");
                    this.css(
                        this.V,
                        "transform",
                        "scale(" + nH / cdW + "," + nW / cdH + ")" + tf
                    );
                } else {
                    this.css(this.V, "transform", tf);
                }
            } else {
                this.css(this.V, "transform", tf);
            }
            return;
        },
        videoBrightness: function(n) {
            if (!this.loaded) {
                return;
            }
        },
        videoContrast: function(n) {
            if (!this.loaded) {
                return;
            }
        },
        videoSaturation: function(n) {
            if (!this.loaded) {
                return;
            }
        },
        videoHue: function(n) {
            if (!this.loaded) {
                return;
            }
        },
        videoZoom: function(n) {
            if (!this.loaded) {
                return;
            }
            if (this.isUndefined(n)) {
                n = 1;
            }
            if (n < 0) {
                n = 0;
            }
            if (n > 2) {
                n = 2;
            }
            var tf = this.css(this.V, "transform");
            tf = tf.replace(/scale\([^)]+\)/, "") + " scale(" + n + ")";
            this.videoScale = n;
            this.css(this.V, "transform", tf);
            return;
        },
        videoProportion: function(w, h) {
            if (!this.loaded) {
                return;
            }
        },
        adPlay: function() {
            if (!this.loaded) {
                return;
            }
            if (this.adPlayerPlay) {
                this.adIsPause = false;
                var ad = this.getNowAdvertisements();
                var type = ad["type"];
                if (this.isStrImage(type)) {
                    this.adCountDown();
                } else {
                    this.V.play();
                }
            }
        },
        adPause: function() {
            if (!this.loaded) {
                return;
            }
            if (this.adPlayerPlay) {
                this.adIsPause = true;
                var ad = this.getNowAdvertisements();
                var type = ad["type"];
                if (
                    type != "jpg" &&
                    type != "jpeg" &&
                    type != "png" &&
                    type != "svg" &&
                    type != "gif"
                ) {
                    this.videoPause();
                }
            }
        },
        videoError: function(n) {
            if (!this.loaded) {
                return;
            }
        },
        changeConfig: function() {
            if (!this.loaded) {
                return;
            }
            var obj = this.ckConfig;
            var arg = arguments;
            for (var i = 0; i < arg.length - 1; i++) {
                if (obj.hasOwnProperty(arg[i])) {
                    obj = obj[arg[i]];
                } else {
                    return;
                }
            }
            var val = arg[arg.length - 1];
            switch (arg.length) {
                case 2:
                    this.ckConfig[arg[0]] = val;
                    break;
                case 3:
                    this.ckConfig[arg[0]][arg[1]] = val;
                    break;
                case 4:
                    this.ckConfig[arg[0]][arg[1]][arg[2]] = val;
                    break;
                case 5:
                    this.ckConfig[arg[0]][arg[1]][arg[2]][arg[3]] = val;
                    break;
                case 6:
                    this.ckConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]] = val;
                    break;
                case 7:
                    this.ckConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]] = val;
                    break;
                case 8:
                    this.ckConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]][
                        arg[6]
                        ] = val;
                    break;
                case 9:
                    this.ckConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]][arg[6]][
                        arg[7]
                        ] = val;
                    break;
                case 10:
                    this.ckConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]][arg[6]][
                        arg[7]
                        ][arg[8]] = val;
                    break;
                default:
                    break;
            }
            this.sendJS("configChange", this.ckConfig);
        },
        custom: function() {
            if (!this.loaded) {
                return;
            }
            if (this.isUndefined(arguments)) {
                return;
            }
            var type = "",
                name = "",
                display = "";
            if (arguments.length == 4) {
                type = "controlBar-" + arguments[1];
                name = arguments[2];
                display = arguments[3] ? "block" : "none";
            } else if (arguments.length == 3) {
                type = "player-" + arguments[0];
                name = arguments[1];
                display = arguments[2] ? "block" : "none";
            } else {
                return;
            }
            for (var k in this.customeElement) {
                var obj = this.customeElement[k];
                if (obj["type"] == type && obj["name"] == name) {
                    this.css(obj["ele"], "display", display);
                }
            }
        },
        getConfig: function() {
            if (!this.loaded) {
                return null;
            }
            var temp = this.ckConfig;
            for (var index in arguments) {
                try {
                    temp = temp[arguments[index]];
                } catch (error) {
                    temp = null;
                }
            }
            return temp;
        },
        openUrl: function(n) {
            if (!this.loaded) {
                return;
            }
        },
        videoClear: function() {
            if (!this.loaded) {
                return;
            }
            this.V.innerHTML = "";
            this.V.src = "";
        },
        newVideo: function(c) {
            this.embed(c);
        },
        screenshot: function(obj, save, name) {
            if (!this.loaded) {
                return;
            }
            if (obj == "video") {
                var newCanvas = document.createElement("canvas");
                newCanvas.width = this.V.videoWidth;
                newCanvas.height = this.V.videoHeight;
                newCanvas
                    .getContext("2d")
                    .drawImage(this.V, 0, 0, this.V.videoWidth, this.V.videoHeight);
                try {
                    var base64 = newCanvas.toDataURL("image/jpeg");
                    return base64;
                } catch (error) {
                    this.log(error);
                }
            }
        },
        changeSize: function(w, h) {
            if (this.isUndefined(w)) {
                w = 0;
            }
            if (this.isUndefined(h)) {
                h = 0;
            }
            if (w > 0) {
                this.css(this.CD, "width", w + "px");
            }
            if (h > 0) {
                this.css(this.CD, "height", h + "px");
            }
            if (this.html5Video) {
                this.playerResize();
            }
        },
        playerResize: function() {
            this.controlBar();
            this.elementCoordinate();
            this.carbarButton();
            this.customCoor();
            this.timeProgressDefault();
            this.videoCss();
            this.timeUpdateHandler();
            this.changeElementCoor();
            this.changePrompt();
            this.advertisementStyle();
            this.adPauseCoor();
            this.adOtherCoor();
            this.changeLoad();
            this.sendJS("resize");
        },
        changePlaybackRate: function(n) {
            if (this.html5Video) {
                var arr = this.playbackRateArr;
                n = parseInt(n);
                if (n < arr.length) {
                    this.newPlaybackrate(arr[n][1]);
                }
            }
        },
        changeControlBarShow: function(show) {
            if (!this.loaded) {
                return;
            }
            if (show) {
                this.controlBarIsShow = true;
                this.controlBarHide(false);
            } else {
                this.controlBarIsShow = false;
                this.controlBarHide(true);
            }
        },
        checkShockwaveFlash: function() {
            if (window.ActiveXObject) {
                try {
                    var s = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    if (s) {
                        return true;
                    }
                } catch (e) {}
            } else {
                try {
                    var s = navigator.plugins["Shockwave Flash"];
                    if (s) {
                        return true;
                    }
                } catch (e) {}
            }
            return false;
        },
        getFlashVars: function() {
            this.getVarsObject();
            var v = this.vars;
            var z = "";
            for (k in v) {
                if (k != "flashplayer" && k != "container" && v[k] != "") {
                    if (z != "") {
                        z += "&";
                    }
                    var vk = v[k];
                    if (vk == true) {
                        vk = 1;
                    }
                    if (vk == false) {
                        vk = 0;
                    }
                    z += k + "=" + vk;
                }
            }
            if (!v.hasOwnProperty("volume") || !v["volume"]) {
                if (z != "") {
                    z += "&";
                }
                z += "volume=0";
            }
            return z;
        },
        isStrImage: function(s) {
            if (s == "jpg" || s == "jpeg" || s == "png" || s == "svg" || s == "gif") {
                return true;
            }
            return false;
        },
        getVarsObject: function() {
            var v = this.vars;
            var f = "",
                d = "",
                w = "";
            var arr = this.VA;
            var prompt = v["promptSpot"];
            var i = 0;
            var video = this.vars["video"];
            if (this.varType(video) == "array") {
                arr = video;
                for (i = 0; i < arr.length; i++) {
                    var arr2 = arr[i];
                    if (arr2) {
                        if (f != "") {
                            f += this.ckConfig["config"]["split"];
                            d += ",";
                            w += ",";
                            v["type"] += this.ckConfig["config"]["split"];
                        }
                        f += encodeURIComponent(decodeURIComponent(arr2[0]));
                        d += arr2[2];
                        w += arr2[3];
                        v["type"] += arr2[1].replace("video/", "");
                    }
                }
            } else if (this.varType(video) == "object") {
                f = encodeURIComponent(decodeURIComponent(video["file"]));
                if (!this.isUndefined(video["type"])) {
                    v["type"] = video["type"];
                }
                d = "";
                w = "";
            } else {
                f = encodeURIComponent(decodeURIComponent(video));
            }
            if (v["preview"] != null) {
                v["previewscale"] = v["preview"]["scale"];
                v["preview"] = v["preview"]["file"].join(",");
            }
            if (prompt != null) {
                v["promptspot"] = "";
                v["promptspottime"] = "";
                for (i = 0; i < prompt.length; i++) {
                    if (v["promptspot"] != "") {
                        v["promptspot"] += ",";
                        v["promptspottime"] += ",";
                    }
                    v["promptspot"] += prompt[i]["words"];
                    v["promptspottime"] += prompt[i]["time"];
                }
            }
            if (f != "") {
                v["video"] = f;
                v["definition"] = d;
                v["weight"] = w;
            }
            if (!v["volume"]) {
                v["volume"] = 0;
            }
            var newV = {};
            for (var k in v) {
                if (v[k] != null) {
                    newV[k] = v[k];
                }
                if (k == "type") {
                    newV[k] = v[k].replace("video/m3u8", "m3u8");
                }
            }
            this.vars = newV;
        },
        getMetaDate: function() {
            if (!this.loaded || this.V == null) {
                return false;
            }
            if (this.playerType == "html5video") {
                var duration = 0;
                try {
                    duration = !isNaN(this.V.duration) ? this.V.duration : 0;
                    if (isNaN(duration) || parseInt(duration) < 0.2) {
                        if (this.vars["duration"] > 0) {
                            duration = this.vars["duration"];
                        }
                    }
                    if (this.vars["forceduration"] > 0) {
                        duration = this.vars["forceduration"];
                    }
                } catch (event) {
                    this.log(event);
                }
                var data = {
                    duration: duration,
                    volume: this.V.volume,
                    playbackRate: this.V.playbackRate,
                    width: this.PD.offsetWidth || this.V.offsetWidth || this.V.width,
                    height: this.PD.offsetHeight || this.V.offsetHeight || this.V.height,
                    streamWidth: this.V.videoWidth,
                    streamHeight: this.V.videoHeight,
                    videoWidth: this.V.offsetWidth,
                    videoHeight: this.V.offsetHeight,
                    paused: this.V.paused,
                    loadTime: this.loadTimeTemp
                };
                return data;
            } else {
                try {
                    return this.V.getMetaDate();
                } catch (event) {
                    this.log(event);
                }
            }
            return false;
        },
        getVideoUrl: function() {
            var arr = [];
            if (this.V.src) {
                arr.push(this.V.src);
            } else {
                var uArr = this.V.childNodes;
                for (var i = 0; i < uArr.length; i++) {
                    arr.push(uArr[i].src);
                }
            }
            return arr;
        },
        clickEvent: function(call) {
            if (call == "none" || call == "" || call == null) {
                return {
                    type: "none"
                };
            }
            var callArr = call.split("->");
            var type = "",
                fun = "",
                link = "",
                target = "";
            if (callArr.length == 2) {
                var callM = callArr[0];
                var callE = callArr[1];
                if (!callE) {
                    return {
                        type: "none"
                    };
                }
                var val = "";
                var eArr = [];
                type = callM;
                switch (callM) {
                    case "actionScript":
                        if (callE.indexOf("(") > -1) {
                            eArr = callE.split("(");
                            callE = eArr[0];
                            val = eArr[1].replace(")", "");
                        }
                        if (val == "") {
                            fun = "thisTemp." + callE + "()";
                        } else {
                            fun = "thisTemp." + callE + "(" + val + ")";
                        }
                        break;
                    case "javaScript":
                        if (callE.substr(0, 11) == "[flashvars]") {
                            callE = callE.substr(11);
                            if (this.vars.hasOwnProperty(callE)) {
                                callE = this.vars[callE];
                            } else {
                                break;
                            }
                        }
                        if (callE.indexOf("(") > -1) {
                            eArr = callE.split("(");
                            callE = eArr[0];
                            val = eArr[1].replace(")", "");
                        }
                        if (val == "") {
                            fun = callE + "()";
                        } else {
                            fun = callE + "(" + val + ")";
                        }
                        break;
                    case "link":
                        var callLink = (callE + ",").split(",");
                        if (callLink[0].substr(0, 11) == "[flashvars]") {
                            var fl = callLink[0].replace("[flashvars]", "");
                            if (this.vars.hasOwnProperty(fl)) {
                                callLink[0] = this.vars[fl];
                            } else {
                                break;
                            }
                        }
                        if (!callLink[1]) {
                            callLink[1] = "_blank";
                        }
                        link = callLink[0];
                        target = callLink[1];
                        break;
                }
            }
            return {
                type: type,
                fun: fun,
                link: link,
                target: target
            };
        },
        getPosition: function(obj, rEle) {
            var pw = this.PD.offsetWidth,
                ph = this.PD.offsetHeight;
            var x = 0,
                y = 0;
            var left = 0,
                top = 0,
                rw = 0,
                rh = 0;
            if (!this.isUndefined(rEle)) {
                (left = parseInt(this.css(rEle, "left"))),
                    (top = parseInt(this.css(rEle, "top"))),
                    (rw = rEle.offsetWidth),
                    (rh = rEle.offsetHeight);
            }
            switch (obj["align"]) {
                case "left":
                    x = obj["offsetX"] + left;
                    break;
                case "center":
                    x = pw * 0.5 + obj["offsetX"];
                    if (left) {
                        x -= pw * 0.5 - rw * 0.5 - left;
                    }
                    break;
                case "right":
                    x = pw + obj["offsetX"];
                    if (left) {
                        x -= pw - left - rw;
                    }
                    break;
            }
            switch (obj["vAlign"]) {
                case "top":
                    y = obj["offsetY"] + top;
                    break;
                case "middle":
                    y = ph * 0.5 + obj["offsetY"] - top - rh * 0.5;
                    if (top) {
                        x -= ph * 0.5 - rh * 0.5 - top;
                    }
                    break;
                case "bottom":
                    y = ph + obj["offsetY"];
                    if (top) {
                        y -= ph - top - rh;
                    }
                    break;
            }
            return {
                x: x,
                y: y
            };
        },
        addElement: function(attribute) {
            var thisTemp = this;
            var i = 0;
            var obj = {
                list: null,
                x: "100%",
                y: "50%",
                position: null,
                alpha: 1,
                backgroundColor: "",
                backAlpha: 1,
                backRadius: 0,
                clickEvent: ""
            };
            obj = this.standardization(obj, attribute);
            var list = obj["list"];
            if (list == null) {
                return "";
            }
            var id = "element-" + this.randomString(10);
            var ele = document.createElement("div");
            ele.className = id;
            if (obj["x"]) {
                ele.setAttribute("data-x", obj["x"]);
            }
            if (obj["y"]) {
                ele.setAttribute("data-y", obj["y"]);
            }
            if (obj["position"] != null) {
                ele.setAttribute("data-position", obj["position"].join(","));
            }
            this.PD.appendChild(ele);
            this.css(ele, {
                position: "absolute",
                filter: "alpha(opacity:" + obj["alpha"] + ")",
                opacity: obj["alpha"].toString(),
                width: "800px",
                zIndex: "20"
            });
            var bgid = "elementbg" + this.randomString(10);
            var bgAlpha = obj["alpha"].toString();
            var bgColor = obj["backgroundColor"].replace("0x", "#");
            var html = "";
            var idArr = [];
            var clickArr = [];
            if (!this.isUndefined(list) && list.length > 0) {
                var textObj, returnObj, clickEvent;
                for (i = 0; i < list.length; i++) {
                    var newEleid = "elementnew" + this.randomString(10);
                    switch (list[i]["type"]) {
                        case "image":
                        case "png":
                        case "jpg":
                        case "jpeg":
                        case "gif":
                            textObj = {
                                type: "image",
                                file: "",
                                radius: 0,
                                width: 30,
                                height: 30,
                                alpha: 1,
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                backgroundColor: "",
                                clickEvent: ""
                            };
                            list[i] = this.standardization(textObj, list[i]);
                            clickEvent = this.clickEvent(list[i]["clickEvent"]);
                            clickArr.push(clickEvent);
                            if (clickEvent["type"] == "link") {
                                html +=
                                    '<div class="' +
                                    newEleid +
                                    '" data-i="' +
                                    i +
                                    '"><a href="' +
                                    clickEvent["link"] +
                                    '" target="' +
                                    clickEvent["target"] +
                                    '"><img class="' +
                                    newEleid +
                                    '_image" src="' +
                                    list[i]["file"] +
                                    '" style="border:0;"></a></div>';
                            } else {
                                html +=
                                    '<div class="' +
                                    newEleid +
                                    '" data-i="' +
                                    i +
                                    '"><img class="' +
                                    newEleid +
                                    '_image" src="' +
                                    list[i]["file"] +
                                    '" style="border:0;"></div>';
                            }
                            break;
                        case "text":
                            textObj = {
                                type: "text",
                                text: "",
                                color: "0xFFFFFF",
                                size: 14,
                                fontFamily: this.fontFamily,
                                leading: 0,
                                alpha: 1,
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                backgroundColor: "",
                                backAlpha: 1,
                                backRadius: 0,
                                clickEvent: ""
                            };
                            list[i] = this.standardization(textObj, list[i]);
                            clickEvent = this.clickEvent(list[i]["clickEvent"]);
                            clickArr.push(clickEvent);
                            if (clickEvent["type"] == "link") {
                                html +=
                                    '<div class="' +
                                    newEleid +
                                    '" data-i="' +
                                    i +
                                    '"><div class="' +
                                    newEleid +
                                    '_bg"></div><div class="' +
                                    newEleid +
                                    '_text"><a href="' +
                                    clickEvent["link"] +
                                    '" target="' +
                                    clickEvent["target"] +
                                    '">' +
                                    list[i]["text"] +
                                    "</a></div></div>";
                            } else {
                                html +=
                                    '<div  class="' +
                                    newEleid +
                                    '" data-i="' +
                                    i +
                                    '"><div class="' +
                                    newEleid +
                                    '_bg"></div><div class="' +
                                    newEleid +
                                    '_text">' +
                                    list[i]["text"] +
                                    "</div></div>";
                            }
                            break;
                        default:
                            break;
                    }
                    idArr.push(newEleid);
                }
            }
            var objClickEvent = this.clickEvent(obj["clickEvent"]);
            ele.innerHTML =
                '<div class="' +
                bgid +
                '"></div><div class="' +
                bgid +
                '_c">' +
                html +
                "</div>";
            if (
                objClickEvent["type"] == "javaScript" ||
                objClickEvent["type"] == "actionScript"
            ) {
                var objClickHandler = function() {
                    eval(objClickEvent["fun"]);
                    thisTemp.sendJS(
                        "clickEvent",
                        clk["type"] +
                        "->" +
                        clk["fun"].replace("thisTemp.", "").replace("()", "")
                    );
                };
                this.addListenerInside(
                    "click",
                    objClickHandler,
                    this.getByElement(bgid + "_c")
                );
            }
            this.css(bgid + "_c", {
                position: "absolute",
                zIndex: "2"
            });
            for (i = 0; i < idArr.length; i++) {
                var clk = clickArr[i];
                if (clk["type"] == "javaScript" || clk["type"] == "actionScript") {
                    var clickHandler = function() {
                        clk = clickArr[thisTemp.getDataset(this, "i")];
                        eval(clk["fun"]);
                        thisTemp.sendJS(
                            "clickEvent",
                            clk["type"] +
                            "->" +
                            clk["fun"].replace("thisTemp.", "").replace("()", "")
                        );
                    };
                    this.addListenerInside(
                        "click",
                        clickHandler,
                        this.getByElement(idArr[i])
                    );
                }
                switch (list[i]["type"]) {
                    case "image":
                    case "png":
                    case "jpg":
                    case "jpeg":
                    case "gif":
                        this.css(idArr[i], {
                            float: "left",
                            width: list[i]["width"] + "px",
                            height: list[i]["height"] + "px",
                            filter: "alpha(opacity:" + list[i]["alpha"] + ")",
                            opacity: list[i]["alpha"].toString(),
                            marginLeft: list[i]["marginLeft"] + "px",
                            marginRight: list[i]["marginRight"] + "px",
                            marginTop: list[i]["marginTop"] + "px",
                            marginBottom: list[i]["marginBottom"] + "px",
                            borderRadius: list[i]["radius"] + "px",
                            cursor: "pointer"
                        });
                        this.css(idArr[i] + "_image", {
                            width: list[i]["width"] + "px",
                            height: list[i]["height"] + "px",
                            borderRadius: list[i]["radius"] + "px"
                        });
                        break;
                    case "text":
                        this.css(idArr[i] + "_text", {
                            filter: "alpha(opacity:" + list[i]["alpha"] + ")",
                            opacity: list[i]["alpha"].toString(),
                            borderRadius: list[i]["radius"] + "px",
                            fontFamily: list[i]["font"],
                            fontSize: list[i]["size"] + "px",
                            color: list[i]["color"].replace("0x", "#"),
                            lineHeight:
                                list[i]["leading"] > 0 ? list[i]["leading"] + "px" : "",
                            paddingLeft: list[i]["paddingLeft"] + "px",
                            paddingRight: list[i]["paddingRight"] + "px",
                            paddingTop: list[i]["paddingTop"] + "px",
                            paddingBottom: list[i]["paddingBottom"] + "px",
                            whiteSpace: "nowrap",
                            position: "absolute",
                            zIndex: "3",
                            cursor: "pointer"
                        });
                        this.css(idArr[i], {
                            float: "left",
                            width: this.getByElement(idArr[i] + "_text").offsetWidth + "px",
                            height: this.getByElement(idArr[i] + "_text").offsetHeight + "px",
                            marginLeft: list[i]["marginLeft"] + "px",
                            marginRight: list[i]["marginRight"] + "px",
                            marginTop: list[i]["marginTop"] + "px",
                            marginBottom: list[i]["marginBottom"] + "px"
                        });
                        this.css(idArr[i] + "_bg", {
                            width: this.getByElement(idArr[i] + "_text").offsetWidth + "px",
                            height: this.getByElement(idArr[i] + "_text").offsetHeight + "px",
                            filter: "alpha(opacity:" + list[i]["backAlpha"] + ")",
                            opacity: list[i]["backAlpha"].toString(),
                            borderRadius: list[i]["backRadius"] + "px",
                            backgroundColor: list[i]["backgroundColor"].replace("0x", "#"),
                            position: "absolute",
                            zIndex: "2"
                        });
                        break;
                    default:
                        break;
                }
            }
            this.css(bgid, {
                width: this.getByElement(bgid + "_c").offsetWidth + "px",
                height: this.getByElement(bgid + "_c").offsetHeight + "px",
                position: "absolute",
                filter: "alpha(opacity:" + bgAlpha + ")",
                opacity: bgAlpha,
                backgroundColor: bgColor.replace("0x", "#"),
                borderRadius: obj["backRadius"] + "px",
                zIndex: "1"
            });
            this.css(ele, {
                width: this.getByElement(bgid).offsetWidth + "px",
                height: this.getByElement(bgid).offsetHeight + "px"
            });
            var eidCoor = this.calculationCoor(ele);
            this.css(ele, {
                left: eidCoor["x"] + "px",
                top: eidCoor["y"] + "px"
            });
            this.elementArr.push(ele.className);
            return ele;
        },
        getElement: function(element) {
            var ele = element;
            if (this.varType(element) == "string") {
                ele = this.getByElement(element);
            }
            var coor = this.getCoor(ele);
            return {
                x: coor["x"],
                y: coor["y"],
                width: ele.offsetWidth,
                height: ele.offsetHeight,
                alpha: !this.isUndefined(this.css(ele, "opacity"))
                    ? parseFloat(this.css(ele, "opacity"))
                    : 1,
                show: this.css(ele, "display") == "none" ? false : true
            };
        },
        elementShow: function(element, show) {
            if (this.varType(element) == "string") {
                if (element) {
                    this.css(ele, "display", show == true ? "block" : "none");
                } else {
                    var arr = this.elementTempArr;
                    for (var i = 0; i < arr.length; i++) {
                        this.css(arr[i], "display", show == true ? "block" : "none");
                    }
                }
            }
        },
        calculationCoor: function(ele) {
            if (this.isUndefined(ele)) {
                return;
            }
            if (ele == []) {
                return;
            }
            var x,
                y,
                position = [];
            var w = this.PD.offsetWidth,
                h = this.PD.offsetHeight;
            var ew = ele.offsetWidth,
                eh = ele.offsetHeight;
            if (!this.isUndefined(this.getDataset(ele, "x"))) {
                x = this.getDataset(ele, "x");
            }
            if (!this.isUndefined(this.getDataset(ele, "y"))) {
                y = this.getDataset(ele, "y");
            }
            if (!this.isUndefined(this.getDataset(ele, "position"))) {
                try {
                    position = this.getDataset(ele, "position")
                        .toString()
                        .split(",");
                } catch (event) {}
            }
            if (position.length > 0) {
                position.push(null, null, null, null);
                var i = 0;
                for (i = 0; i < position.length; i++) {
                    if (
                        this.isUndefined(position[i]) ||
                        position[i] == null ||
                        position[i] == "null" ||
                        position[i] == ""
                    ) {
                        position[i] = null;
                    } else {
                        position[i] = parseFloat(position[i]);
                    }
                }
                if (position[2] == null) {
                    switch (position[0]) {
                        case 0:
                            x = 0;
                            break;
                        case 1:
                            x = parseInt((w - ew) * 0.5);
                            break;
                        default:
                            x = w - ew;
                            break;
                    }
                } else {
                    switch (position[0]) {
                        case 0:
                            x = position[2];
                            break;
                        case 1:
                            x = parseInt(w * 0.5) + position[2];
                            break;
                        default:
                            x = w + position[2];
                            break;
                    }
                }
                if (position[3] == null) {
                    switch (position[1]) {
                        case 0:
                            y = 0;
                            break;
                        case 1:
                            y = parseInt((h - eh) * 0.5);
                            break;
                        default:
                            y = h - eh;
                            break;
                    }
                } else {
                    switch (position[1]) {
                        case 0:
                            y = position[3];
                            break;
                        case 1:
                            y = parseInt(h * 0.5) + position[3];
                            break;
                        default:
                            y = h + position[3];
                            break;
                    }
                }
            } else {
                if (x.substring(x.length - 1, x.length) == "%") {
                    x = Math.floor(parseInt(x.substring(0, x.length - 1)) * w * 0.01);
                }
                if (y.substring(y.length - 1, y.length) == "%") {
                    y = Math.floor(parseInt(y.substring(0, y.length - 1)) * h * 0.01);
                }
            }
            return {
                x: x,
                y: y
            };
        },
        changeElementCoor: function() {
            for (var i = 0; i < this.elementArr.length; i++) {
                if (!this.isUndefined(this.getByElement(this.elementArr[i]))) {
                    if (this.getByElement(this.elementArr[i]) != []) {
                        var c = this.calculationCoor(this.getByElement(this.elementArr[i]));
                        if (c["x"] && c["y"]) {
                            this.css(this.elementArr[i], {
                                top: c["y"] + "px",
                                left: c["x"] + "px"
                            });
                        }
                    }
                }
            }
        },
        tween: function() {
            var Tween = {
                None: {
                    easeIn: function(t, b, c, d) {
                        return (c * t) / d + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return (c * t) / d + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        return (c * t) / d + b;
                    }
                },
                Quadratic: {
                    easeIn: function(t, b, c, d) {
                        return c * (t /= d) * t + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return -c * (t /= d) * (t - 2) + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
                        return (-c / 2) * (--t * (t - 2) - 1) + b;
                    }
                },
                Cubic: {
                    easeIn: function(t, b, c, d) {
                        return c * (t /= d) * t * t + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return c * ((t = t / d - 1) * t * t + 1) + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
                        return (c / 2) * ((t -= 2) * t * t + 2) + b;
                    }
                },
                Quartic: {
                    easeIn: function(t, b, c, d) {
                        return c * (t /= d) * t * t * t + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
                        return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
                    }
                },
                Quintic: {
                    easeIn: function(t, b, c, d) {
                        return c * (t /= d) * t * t * t * t + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
                        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
                    }
                },
                Sine: {
                    easeIn: function(t, b, c, d) {
                        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return c * Math.sin((t / d) * (Math.PI / 2)) + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
                    }
                },
                Exponential: {
                    easeIn: function(t, b, c, d) {
                        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        if (t == 0) return b;
                        if (t == d) return b + c;
                        if ((t /= d / 2) < 1)
                            return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
                        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
                    }
                },
                Circular: {
                    easeIn: function(t, b, c, d) {
                        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                    },
                    easeOut: function(t, b, c, d) {
                        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                    },
                    easeInOut: function(t, b, c, d) {
                        if ((t /= d / 2) < 1)
                            return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
                        return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                    }
                },
                Elastic: {
                    easeIn: function(t, b, c, d, a, p) {
                        if (t == 0) return b;
                        if ((t /= d) == 1) return b + c;
                        if (!p) p = d * 0.3;
                        if (!a || a < Math.abs(c)) {
                            a = c;
                            var s = p / 4;
                        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
                        return (
                            -(
                                a *
                                Math.pow(2, 10 * (t -= 1)) *
                                Math.sin(((t * d - s) * (2 * Math.PI)) / p)
                            ) + b
                        );
                    },
                    easeOut: function(t, b, c, d, a, p) {
                        if (t == 0) return b;
                        if ((t /= d) == 1) return b + c;
                        if (!p) p = d * 0.3;
                        if (!a || a < Math.abs(c)) {
                            a = c;
                            var s = p / 4;
                        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
                        return (
                            a *
                            Math.pow(2, -10 * t) *
                            Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
                            c +
                            b
                        );
                    },
                    easeInOut: function(t, b, c, d, a, p) {
                        if (t == 0) return b;
                        if ((t /= d / 2) == 2) return b + c;
                        if (!p) p = d * (0.3 * 1.5);
                        if (!a || a < Math.abs(c)) {
                            a = c;
                            var s = p / 4;
                        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
                        if (t < 1)
                            return (
                                -0.5 *
                                (a *
                                    Math.pow(2, 10 * (t -= 1)) *
                                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                                b
                            );
                        return (
                            a *
                            Math.pow(2, -10 * (t -= 1)) *
                            Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
                            0.5 +
                            c +
                            b
                        );
                    }
                },
                Back: {
                    easeIn: function(t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        return c * (t /= d) * t * ((s + 1) * t - s) + b;
                    },
                    easeOut: function(t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                    },
                    easeInOut: function(t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        if ((t /= d / 2) < 1)
                            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
                        return (
                            (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
                        );
                    }
                },
                Bounce: {
                    easeIn: function(t, b, c, d) {
                        return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
                    },
                    easeOut: function(t, b, c, d) {
                        if ((t /= d) < 1 / 2.75) {
                            return c * (7.5625 * t * t) + b;
                        } else if (t < 2 / 2.75) {
                            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
                        } else if (t < 2.5 / 2.75) {
                            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
                        } else {
                            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
                        }
                    },
                    easeInOut: function(t, b, c, d) {
                        if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
                        else
                            return (
                                Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
                            );
                    }
                }
            };
            return Tween;
        },
        animate: function(attribute) {
            var thisTemp = this;
            var animateId = "animate_" + this.randomString();
            var obj = {
                element: null,
                parameter: "x",
                static: false,
                effect: "None.easeIn",
                start: null,
                end: null,
                speed: 0,
                overStop: false,
                pauseStop: false,
                callBack: null
            };
            obj = this.standardization(obj, attribute);
            if (obj["element"] == null || obj["speed"] == 0) {
                return false;
            }
            var w = this.PD.offsetWidth,
                h = this.PD.offsetHeight;
            var effArr = (obj["effect"] + ".").split(".");
            var tweenFun = this.tween()[effArr[0]][effArr[1]];
            var eleCoor = {
                x: 0,
                y: 0
            };
            if (this.isUndefined(tweenFun)) {
                return false;
            }
            var def = this.arrIndexOf(this.elementArr, obj["element"].className);
            if (def > -1) {
                this.elementTempArr.push(obj["element"].className);
                this.elementArr.splice(def, 1);
            }
            var css = {};
            var pm = this.getElement(obj["element"]);
            var t = 0;
            var b = 0;
            var c = 0;
            var d = obj["speed"] * 1000;
            var timerTween = null;
            var tweenObj = null;
            var start = obj["start"] == null ? "" : obj["start"].toString();
            var end = obj["end"] == null ? "" : obj["end"].toString();
            switch (obj["parameter"]) {
                case "x":
                    if (obj["start"] == null) {
                        b = pm["x"];
                    } else {
                        if (start.substring(start.length - 1, start.length) == "%") {
                            b = parseInt(start) * w * 0.01;
                        } else {
                            b = parseInt(start);
                        }
                    }
                    if (obj["end"] == null) {
                        c = pm["x"] - b;
                    } else {
                        if (end.substring(end.length - 1, end.length) == "%") {
                            c = parseInt(end) * w * 0.01 - b;
                        } else if (
                            end.substring(0, 1) == "-" ||
                            end.substring(0, 1) == "+"
                        ) {
                            if (this.varType(obj["end"]) == "number") {
                                c = parseInt(obj["end"]) - b;
                            } else {
                                c = parseInt(end);
                            }
                        } else {
                            c = parseInt(end) - b;
                        }
                    }
                    break;
                case "y":
                    if (obj["start"] == null) {
                        b = pm["y"];
                    } else {
                        if (start.substring(start.length - 1, start.length) == "%") {
                            b = parseInt(start) * h * 0.01;
                        } else {
                            b = parseInt(start);
                        }
                    }
                    if (obj["end"] == null) {
                        c = pm["y"] - b;
                    } else {
                        if (end.substring(end.length - 1, end.length) == "%") {
                            c = parseInt(end) * h * 0.01 - b;
                        } else if (
                            end.substring(0, 1) == "-" ||
                            end.substring(0, 1) == "+"
                        ) {
                            if (this.varType(obj["end"]) == "number") {
                                c = parseInt(obj["end"]) - b;
                            } else {
                                c = parseInt(end);
                            }
                        } else {
                            c = parseInt(end) - b;
                        }
                    }
                    break;
                case "alpha":
                    if (obj["start"] == null) {
                        b = pm["alpha"] * 100;
                    } else {
                        if (start.substring(start.length - 1, start.length) == "%") {
                            b = parseInt(obj["start"]);
                        } else {
                            b = parseInt(obj["start"] * 100);
                        }
                    }
                    if (obj["end"] == null) {
                        c = pm["alpha"] * 100 - b;
                    } else {
                        if (end.substring(end.length - 1, end.length) == "%") {
                            c = parseInt(end) - b;
                        } else if (
                            end.substring(0, 1) == "-" ||
                            end.substring(0, 1) == "+"
                        ) {
                            if (this.varType(obj["end"]) == "number") {
                                c = parseInt(obj["end"]) * 100 - b;
                            } else {
                                c = parseInt(obj["end"]) * 100;
                            }
                        } else {
                            c = parseInt(obj["end"]) * 100 - b;
                        }
                    }
                    break;
            }
            var callBack = function() {
                var index = thisTemp.arrIndexOf(
                    thisTemp.animateElementArray,
                    animateId
                );
                if (index > -1) {
                    thisTemp.animateArray.splice(index, 1);
                    thisTemp.animateElementArray.splice(index, 1);
                }
                index = thisTemp.arrIndexOf(thisTemp.animatePauseArray, animateId);
                if (index > -1) {
                    thisTemp.animatePauseArray.splice(index, 1);
                }
                if (
                    obj["callBack"] != null &&
                    obj["element"] &&
                    obj["callBack"] != "callBack" &&
                    obj["callBack"] != "tweenX" &&
                    obj["tweenY"] != "callBack" &&
                    obj["callBack"] != "tweenAlpha"
                ) {
                    var cb = eval(obj["callBack"]);
                    cb(obj["element"]);
                    obj["callBack"] = null;
                }
            };
            var stopTween = function() {
                if (timerTween != null) {
                    if (timerTween.runing) {
                        timerTween.stop();
                    }
                    timerTween = null;
                }
            };
            var tweenX = function() {
                if (t < d) {
                    t += 10;
                    css = {
                        left: Math.ceil(tweenFun(t, b, c, d)) + "px"
                    };
                    if (obj["static"]) {
                        eleCoor = thisTemp.calculationCoor(obj["element"]);
                        css["top"] = eleCoor["y"] + "px";
                    }
                    thisTemp.css(obj["element"], css);
                } else {
                    stopTween();
                    try {
                        var defX = this.arrIndexOf(
                            this.elementTempArr,
                            obj["element"].className
                        );
                        if (defX > -1) {
                            this.elementTempArr.splice(defX, 1);
                        }
                    } catch (event) {}
                    thisTemp.elementArr.push(obj["element"].className);
                    callBack();
                }
            };
            var tweenY = function() {
                if (t < d) {
                    t += 10;
                    css = {
                        top: Math.ceil(tweenFun(t, b, c, d)) + "px"
                    };
                    if (obj["static"]) {
                        eleCoor = thisTemp.calculationCoor(obj["element"]);
                        css["left"] = eleCoor["x"] + "px";
                    }
                    thisTemp.css(obj["element"], css);
                } else {
                    stopTween();
                    try {
                        var defY = this.arrIndexOf(
                            this.elementTempArr,
                            obj["element"].className
                        );
                        if (defY > -1) {
                            this.elementTempArr.splice(defY, 1);
                        }
                    } catch (event) {}
                    thisTemp.elementArr.push(obj["element"].className);
                    callBack();
                }
            };
            var tweenAlpha = function() {
                if (t < d) {
                    t += 10;
                    eleCoor = thisTemp.calculationCoor(obj["element"]);
                    var ap = Math.ceil(tweenFun(t, b, c, d)) * 0.01;
                    css = {
                        filter: "alpha(opacity:" + ap + ")",
                        opacity: ap.toString()
                    };
                    if (obj["static"]) {
                        eleCoor = thisTemp.calculationCoor(obj["element"]);
                        css["top"] = eleCoor["y"] + "px";
                        css["left"] = eleCoor["x"] + "px";
                    }
                    thisTemp.css(obj["element"], css);
                } else {
                    stopTween();
                    try {
                        var defA = this.arrIndexOf(
                            this.elementTempArr,
                            obj["element"].className
                        );
                        if (defA > -1) {
                            this.elementTempArr.splice(defA, 1);
                        }
                    } catch (event) {}
                    thisTemp.elementArr.push(obj["element"].className);
                    callBack();
                }
            };
            switch (obj["parameter"]) {
                case "x":
                    tweenObj = tweenX;
                    break;
                case "y":
                    tweenObj = tweenY;
                    break;
                case "alpha":
                    tweenObj = tweenAlpha;
                    break;
                default:
                    break;
            }
            timerTween = new thisTemp.timer(10, tweenObj);
            timerTween.callBackFunction = callBack;
            if (obj["overStop"]) {
                var mouseOver = function() {
                    if (timerTween != null && timerTween.runing) {
                        timerTween.stop();
                    }
                };
                this.addListenerInside("mouseover", mouseOver, obj["element"]);
                var mouseOut = function() {
                    var start = true;
                    if (obj["pauseStop"] && thisTemp.getMetaDate()["paused"]) {
                        start = false;
                    }
                    if (timerTween != null && !timerTween.runing && start) {
                        timerTween.start();
                    }
                };
                this.addListenerInside("mouseout", mouseOut, obj["element"]);
            }
            this.animateArray.push(timerTween);
            this.animateElementArray.push(animateId);
            if (obj["pauseStop"]) {
                this.animatePauseArray.push(animateId);
            }
            return animateId;
        },
        animateResume: function(id) {
            var arr = [];
            if (id != "" && !this.isUndefined(id) && id != "pause") {
                arr.push(id);
            } else {
                if (id === "pause") {
                    arr = this.animatePauseArray;
                } else {
                    arr = this.animateElementArray;
                }
            }
            for (var i = 0; i < arr.length; i++) {
                var index = this.arrIndexOf(this.animateElementArray, arr[i]);
                if (index > -1) {
                    this.animateArray[index].start();
                }
            }
        },
        animatePause: function(id) {
            var arr = [];
            if (id != "" && !this.isUndefined(id) && id != "pause") {
                arr.push(id);
            } else {
                if (id === "pause") {
                    arr = this.animatePauseArray;
                } else {
                    arr = this.animateElementArray;
                }
            }
            for (var i = 0; i < arr.length; i++) {
                var index = this.arrIndexOf(this.animateElementArray, arr[i]);
                if (index > -1) {
                    this.animateArray[index].stop();
                }
            }
        },
        deleteAnimate: function(id) {
            var index = this.arrIndexOf(this.animateElementArray, id);
            if (index > -1) {
                this.animateArray[index].callBackFunction();
                this.animateArray.splice(index, 1);
                this.animateElementArray.splice(index, 1);
            }
        },
        deleteElement: function(ele) {
            var def = this.arrIndexOf(this.elementArr, ele.className);
            if (def > -1) {
                this.elementArr.splice(def, 1);
            }
            try {
                def = this.arrIndexOf(this.elementTempArr, ele.className);
                if (def > -1) {
                    this.elementTempArr.splice(def, 1);
                }
            } catch (event) {}
            this.deleteAnimate(ele.className);
            this.deleteChild(ele);
        },
        getByElement: function(obj, parent) {
            if (this.isUndefined(parent)) {
                parent = document;
            }
            var num = obj.substr(0, 1);
            var res = [];
            if (num != "#") {
                if (num == ".") {
                    obj = obj.substr(1, obj.length);
                }
                if (parent.getElementsByClassName) {
                    res = parent.getElementsByClassName(obj);
                    if (!res.length) {
                        return null;
                    }
                } else {
                    var reg = new RegExp(" " + obj + " ", "i");
                    var ele = parent.getElementsByTagName("*");
                    for (var i = 0; i < ele.length; i++) {
                        if (reg.test(" " + ele[i].className + " ")) {
                            res.push(ele[i]);
                        }
                    }
                }
                if (res.length > 0) {
                    res = res[0];
                } else {
                    res = null;
                }
            } else {
                if (num == "#") {
                    obj = obj.substr(1, obj.length);
                }
                try {
                    res = document.getElementById(obj);
                } catch (event) {
                    res = null;
                }
            }
            return res;
        },
        css: function (elem, attribute, value) {
            //为了解决控制台undefined问题
            if (attribute.backgroundImage == "url(undefined)") return;
            var i = 0;
            var k = "";
            if (this.varType(elem) == "array") {
                for (i = 0; i < elem.length; i++) {
                    var el;
                    if (typeof elem[i] == "string") {
                        el = this.getByElement(elem[i]);
                    } else {
                        el = elem[i];
                    }
                    if (typeof attribute != "object") {
                        if (!this.isUndefined(value)) {
                            el.style[attribute] = value;
                        }
                    } else {
                        for (k in attribute) {
                            if (!this.isUndefined(attribute[k])) {
                                try {
                                    el.style[k] = attribute[k];
                                } catch (event) {
                                    this.log(event);
                                }
                            }
                        }
                    }
                }
                return;
            }
            if (this.varType(elem) == "string") {
                elem = this.getByElement(elem);
            }
            if (this.varType(attribute) != "object") {
                if (!this.isUndefined(value)) {
                    elem.style[attribute] = value;
                } else {
                    if (!this.isUndefined(this.getStyle(elem, attribute))) {
                        return this.getStyle(elem, attribute);
                    } else {
                        return false;
                    }
                }
            } else {
                for (k in attribute) {
                    if (!this.isUndefined(attribute[k])) {
                        elem.style[k] = attribute[k];
                    }
                }
            }
        },
        getStyle: function(obj, attr) {
            if (!this.isUndefined(obj.style[attr])) {
                return obj.style[attr];
            } else {
                if (obj.currentStyle) {
                    return obj.currentStyle[attr];
                } else {
                    return getComputedStyle(obj, false)[attr];
                }
            }
        },
        isUndefined: function(value) {
            try {
                if (
                    value === "undefined" ||
                    value === undefined ||
                    value === null ||
                    value === "NaN" ||
                    value === NaN
                ) {
                    return true;
                }
            } catch (event) {
                this.log(event);
                return true;
            }
            return false;
        },
        addListener: function(name, funName) {
            if (name && funName) {
                var have = false;
                for (var i = 0; i < this.listenerJsArr.length; i++) {
                    var arr = this.listenerJsArr[i];
                    if (arr[0] == name && arr[1] == funName) {
                        have = true;
                        break;
                    }
                }
                if (!have) {
                    this.listenerJsArr.push([name, funName]);
                }
            }
        },
        removeListener: function(name, funName) {
            if (name && funName) {
                for (var i = 0; i < this.listenerJsArr.length; i++) {
                    var arr = this.listenerJsArr[i];
                    if (arr[0] == name && arr[1] == funName) {
                        this.listenerJsArr.splice(i, 1);
                        break;
                    }
                }
            }
        },
        addListenerInside: function(e, f, d, t) {
            if (this.isUndefined(t)) {
                t = false;
            }
            var o = this.V;
            if (!this.isUndefined(d)) {
                o = d;
            }
            if (o.addEventListener) {
                try {
                    o.addEventListener(e, f, t);
                } catch (event) {
                    this.log(event);
                }
            } else if (o.attachEvent) {
                try {
                    o.attachEvent("on" + e, f);
                } catch (event) {
                    this.log(event);
                }
            } else {
                o["on" + e] = f;
            }
        },
        removeListenerInside: function(e, f, d, t) {
            if (this.isUndefined(t)) {
                t = false;
            }
            var o = this.V;
            if (!this.isUndefined(d)) {
                o = d;
            }
            if (o.removeEventListener) {
                try {
                    this.addNum--;
                    o.removeEventListener(e, f, t);
                } catch (e) {}
            } else if (o.detachEvent) {
                try {
                    o.detachEvent("on" + e, f);
                } catch (e) {}
            } else {
                o["on" + e] = null;
            }
        },
        sendJS: function(name, val) {
            if (this.adPlayerPlay && name.substr(-2) != "Ad") {
                return;
            }
            if (this.isUndefined(name)) {
                return;
            }
            var list = this.listenerJsArr;
            var obj = this.vars["variable"];
            if (this.vars["debug"]) {
                this.log(name + ":" + val);
            }
            for (var i = 0; i < list.length; i++) {
                var arr = list[i];
                if (arr[0] == name) {
                    if (!this.isUndefined(val)) {
                        switch (arr[1].length) {
                            case 1:
                                arr[1](val);
                                break;
                            case 2:
                                arr[1](val, obj);
                                break;
                            default:
                                arr[1]();
                                break;
                        }
                    } else {
                        arr[1](obj);
                    }
                }
            }
        },
        getParameterNames: function(fn) {
            if (this.varType(fn) !== "function") {
                return false;
            }
            var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
            var code = fn.toString().replace(COMMENTS, "");
            var result = code.slice(code.indexOf(" ") + 1, code.indexOf("("));
            return result === null ? false : result;
        },
        replaceTime: function(str, obj) {
            for (var k in obj) {
                str = str.replace("[$" + k + "]", obj[k]);
            }
            return str;
        },
        formatTime: function(t, dt, str) {
            if (this.isUndefined(t) || isNaN(t)) {
                seconds = 0;
            }
            if (this.isUndefined(dt) || isNaN(dt) || dt == "Infinity") {
                dt = 0;
            }
            var minuteS = Math.floor(t / 60);
            var minute = minuteS;
            var hourS = Math.floor(t / 3600);
            var second = t % 60;
            if (minuteS >= 60) {
                minute = Math.floor(minuteS % 60);
            }
            var hminuteS = Math.floor(dt / 60);
            var hminute = hminuteS;
            var hhourS = Math.floor(dt / 3600);
            var hsecond = dt % 60;
            if (hminuteS >= 60) {
                hminute = Math.floor(hminuteS % 60);
            }
            var nowDate = new Date();
            var obj = {
                timeh: hourS,
                timei: minute,
                timeI: minuteS,
                times: second,
                timeS: t,
                durationh: hhourS,
                durationi: hminute,
                durationI: hminuteS,
                durations: hsecond,
                durationS: dt,
                liveTimey: nowDate.getYear(),
                liveTimeY: nowDate.getFullYear(),
                liveTimem: nowDate.getMonth() + 1,
                liveTimed: nowDate.getDate(),
                liveTimeh: nowDate.getHours(),
                liveTimei: nowDate.getMinutes(),
                liveTimes: nowDate.getSeconds()
            };
            for (var k in obj) {
                if (obj[k] < 10) {
                    obj[k] = "0" + Math.floor(obj[k]);
                } else {
                    obj[k] = Math.floor(obj[k]).toString();
                }
            }
            return this.replaceTime(str, obj);
        },
        randomString: function(len) {
            len = len || 16;
            var chars = "abcdefghijklmnopqrstuvwxyz";
            var maxPos = chars.length;
            var val = "";
            for (i = 0; i < len; i++) {
                val += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return "ch" + val;
        },
        getStringLen: function(str) {
            if (this.isUndefined(str)) {
                return 0;
            }
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                    len += 2;
                } else {
                    len++;
                }
            }
            return len;
        },
        createXHR: function() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (event) {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (event) {
                        this.eject(this.errorList[7]);
                    }
                }
            } else {
                this.eject(this.errorList[8]);
            }
        },
        ajax: function(cObj) {
            var thisTemp = this;
            var callback = null;
            var obj = {
                method: "get",
                dataType: "json",
                charset: "utf-8",
                async: false,
                url: "",
                data: null,
                success: null,
                error: null,
                contentType: "application/x-www-form-urlencoded"
            };
            if (this.varType(cObj) != "object") {
                this.eject(this.errorList[9]);
                return;
            }
            obj = this.standardization(obj, cObj);
            if (
                obj.dataType === "json" ||
                obj.dataType === "text" ||
                obj.dataType === "html" ||
                obj.dataType === "xml"
            ) {
                var xhr = this.createXHR();
                callback = function() {
                    if (xhr.status == 200) {
                        if (thisTemp.isUndefined(obj.success)) {
                            return;
                        }
                        if (obj.dataType === "json") {
                            try {
                                obj.success(eval("(" + xhr.responseText + ")"));
                            } catch (event) {
                                if (!thisTemp.isUndefined(obj["error"])) {
                                    obj.error(event);
                                }
                            }
                        } else {
                            obj.success(xhr.responseText);
                        }
                    } else {
                        obj.success(null);
                        thisTemp.eject(thisTemp.errorList[10], "Ajax.status:" + xhr.status);
                    }
                };
                //obj.url =
                //obj.url.indexOf("?") == -1
                //  ? obj.url + "?rand=" + this.randomString(6)
                // : obj.url;
                if (obj.contentType != "application/json;charset=UTF-8") {
                    obj.data = this.formatParams(obj.data);
                }
                if (obj.method === "get" && !this.isUndefined(obj.data)) {
                    if (obj.data != "") {
                        if (obj.url.indexOf("?") == -1) {
                            obj.url += "?" + obj.data;
                        } else {
                            obj.url += "&" + obj.data;
                        }
                    }
                }
                if (obj.async === true) {
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && callback != null) {
                            callback();
                        }
                    };
                }
                xhr.open(obj.method, obj.url, obj.async);
                if (obj.method === "post") {
                    try {
                        xhr.setRequestHeader("Content-Type", obj.contentType);
                        xhr.setRequestHeader("charset", obj["charset"]);
                        xhr.send(obj.data);
                    } catch (event) {
                        callback();
                    }
                } else {
                    try {
                        xhr.send(null);
                    } catch (event) {
                        callback();
                    }
                }
                if (obj.async === false) {
                    callback();
                }
            } else if (obj.dataType === "jsonp") {
                var oHead = document.getElementsByTagName("head")[0];
                var oScript = document.createElement("script");
                var callbackName = "callback" + new Date().getTime();
                var params = this.formatParams(obj.data) + "&callback=" + callbackName;
                callback = obj.success;
                oScript.src = obj.url.split("?") + "?" + params;
                oHead.insertBefore(oScript, oHead.firstChild);
                window[callbackName] = function(json) {
                    callback(json);
                    oHead.removeChild(oScript);
                };
            }
        },
        loadJs: function(path, success) {
            var oHead = document.getElementsByTagName("HEAD").item(0);
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = this.getNewUrl(path);
            oHead.appendChild(oScript);
            oScript.onload = function() {
                success();
            };
        },
        isMsie: function() {
            var browser = navigator.appName;
            var b_version = navigator.appVersion;
            var version = b_version.split(";");
            var trim_Version = "";
            if (version.length > 1) {
                trim_Version = version[1].replace(/[ ]/g, "");
            }
            if (
                browser == "Microsoft Internet Explorer" &&
                (trim_Version == "MSIE6.0" ||
                    trim_Version == "MSIE7.0" ||
                    trim_Version == "MSIE8.0" ||
                    trim_Version == "MSIE9.0" ||
                    trim_Version == "MSIE10.0")
            ) {
                return false;
            }
            return true;
        },
        uploadFlash: function() {
            var swf;
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                try {
                    var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    return true;
                } catch (e) {
                    return false;
                }
            }
            if (navigator.userAgent.indexOf("Firefox") > 0) {
                swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        supportVideo: function() {
            if (!this.isMsie()) {
                return false;
            }
            if (document.createElement("video").canPlayType) {
                var vidTest = document.createElement("video");
                var oggTest;
                try {
                    oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
                } catch (error) {
                    oggTest = false;
                }
                if (!oggTest) {
                    var h264Test;
                    try {
                        h264Test = vidTest.canPlayType(
                            'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                        );
                    } catch (error) {
                        h264Test = false;
                    }
                    if (!h264Test) {
                        return false;
                    } else {
                        if (h264Test == "probably") {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    if (oggTest == "probably") {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        },
        getDataset: function(ele, z) {
            try {
                return ele.dataset[z];
            } catch (error) {
                try {
                    return ele.getAttribute("data-" + z);
                } catch (error) {
                    return false;
                }
            }
        },
        getObjectById: function(id) {
            var x = null;
            var y = this.getByElement("#" + id);
            var r = "embed";
            if (y && y.nodeName == "OBJECT") {
                if (this.varType(y.SetVariable) != "undefined") {
                    x = y;
                } else {
                    var z = y.getElementsByTagName(r)[0];
                    if (z) {
                        x = z;
                    }
                }
            }
            return x;
        },
        formatParams: function(data) {
            var arr = [];
            for (var i in data) {
                arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
            }
            return arr.join("&");
        },
        arrSort: function(arr) {
            var temp = [];
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr.length - i; j++) {
                    if (!this.isUndefined(arr[j + 1]) && arr[j][3] < arr[j + 1][3]) {
                        temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;
        },
        getFileName: function(filepath) {
            if (!filepath) return "";
            return filepath.replace(/(.*\/)*([^.]+).*/gi, "$2");
        },
        getFileExt: function(filepath) {
            if (filepath != "" && !this.isUndefined(filepath)) {
                if (filepath.indexOf("?") > -1) {
                    filepath = filepath.split("?")[0];
                }
                var pos = "." + filepath.replace(/.+\./, "");
                return pos.toLowerCase();
            }
            return "";
        },
        isMobile: function() {
            if (
                navigator.userAgent
                    .toLowerCase()
                    .match(
                        /(iphone|ipad|ipod|android|ios|midp|windows mobile|windows ce|rv:1.2.3.4|ucweb)/i
                    )
            ) {
                return true;
            }
            return false;
        },
        isContains: function(str, key) {
            return str.indexOf(key) > -1;
        },
        getNewUrl: function(url) {
            if (this.isContains(url, "?")) {
                return (url += "&" + this.randomString(8) + "=" + this.randomString(8));
            } else {
                return (url += "?" + this.randomString(8) + "=" + this.randomString(8));
            }
        },
        client: function(event) {
            var eve = event || window.event;
            if (this.isUndefined(eve)) {
                eve = {
                    clientX: 0,
                    clientY: 0
                };
            }
            var scrollTop = 0;
            if (document.getElementById("ckplayerEl_scroll")) {
                scrollTop = document.getElementById("ckplayerEl_scroll").scrollTop;
            } else {
                scrollTop = document.documentElement.scrollTop || this.body.scrollTop;
            }
            return {
                x:
                    eve.clientX +
                    (document.documentElement.scrollLeft || this.body.scrollLeft) -
                    this.pdCoor["x"],
                y: eve.clientY + scrollTop - this.pdCoor["y"]
            };
        },
        getCoor: function(obj) {
            var coor = this.getXY(obj);
            return {
                x: coor["x"] - this.pdCoor["x"],
                y: coor["y"] - this.pdCoor["y"]
            };
        },
        getXY: function(obj) {
            var parObj = obj;
            var left = obj.offsetLeft;
            var top = obj.offsetTop;
            while ((parObj = parObj.offsetParent)) {
                left += parObj.offsetLeft;
                top += parObj.offsetTop;
            }
            return {
                x: left,
                y: top
            };
        },
        removeChild: function() {
            var i = 0;
            var timerArr = [
                this.timerError,
                this.timerFull,
                this.timerTime,
                this.timerBuffer,
                this.timerClick,
                this.timerCBar,
                this.timerVCanvas
            ];
            for (i = 0; i < timerArr.length; i++) {
                if (timerArr[i] != null) {
                    if (timerArr[i].runing) {
                        timerArr[i].stop();
                    }
                    timerArr[i] = null;
                }
            }
            var ltArr = this.listenerJsArr;
            for (i = 0; i < ltArr.length; i++) {
                this.removeListener(ltArr[i][0], ltArr[i][1]);
            }
            this.V = null;
            if (this.conBarShow) {
                this.deleteChild(this.CB["menu"]);
            }
            this.deleteChild(this.PD);
            this.CD.innerHTML = "";
        },
        canvasFill: function(name, path) {
            name.beginPath();
            for (var i = 0; i < path.length; i++) {
                var d = path[i];
                if (i > 0) {
                    name.lineTo(d[0], d[1]);
                } else {
                    name.moveTo(d[0], d[1]);
                }
            }
            name.closePath();
            name.fill();
        },
        canvasFillRect: function(name, path) {
            for (var i = 0; i < path.length; i++) {
                var d = path[i];
                name.fillRect(d[0], d[1], d[2], d[3]);
            }
        },
        deleteChild: function(f) {
            var def = this.arrIndexOf(this.elementArr, f.className);
            if (def > -1) {
                this.elementArr.splice(def, 1);
            }
            var childs = f.childNodes;
            for (var i = childs.length - 1; i >= 0; i--) {
                f.removeChild(childs[i]);
            }
            if (f && f != null && f.parentNode) {
                try {
                    if (f.parentNode) {
                        f.parentNode.removeChild(f);
                    }
                } catch (event) {}
            }
        },
        getProportionCoor: function(stageW, stageH, vw, vh) {
            var w = 0,
                h = 0,
                x = 0,
                y = 0;
            if (stageW / stageH < vw / vh) {
                w = stageW;
                h = (w * vh) / vw;
            } else {
                h = stageH;
                w = (h * vw) / vh;
            }
            x = (stageW - w) * 0.5;
            y = (stageH - h) * 0.5;
            return {
                width: parseInt(w),
                height: parseInt(h),
                x: parseInt(x),
                y: parseInt(y)
            };
        },
        parseSrtSubtitles: function(srt) {
            var subtitlesArr = [];
            var textSubtitles = [];
            var i = 0;
            var arrs = srt.split("\n");
            var arr = [];
            var delHtmlTag = function(str) {
                return str.replace(/<[^>]+>/g, "");
            };
            for (i = 0; i < arrs.length; i++) {
                if (arrs[i].replace(/\s/g, "").length > 0) {
                    arr.push(arrs[i]);
                } else {
                    if (arr.length > 0) {
                        textSubtitles.push(arr);
                    }
                    arr = [];
                }
            }
            for (i = 0; i < textSubtitles.length; ++i) {
                var textSubtitle = textSubtitles[i];
                if (textSubtitle.length >= 2) {
                    var sn = textSubtitle[0];
                    var startTime = this.toSeconds(
                        this.trim(textSubtitle[1].split(" --> ")[0])
                    );
                    var endTime = this.toSeconds(
                        this.trim(textSubtitle[1].split(" --> ")[1])
                    );
                    var content = [delHtmlTag(textSubtitle[2])];
                    var cktrackdelay = this.vars["cktrackdelay"];
                    if (cktrackdelay != 0) {
                        startTime += cktrackdelay;
                        endTime += cktrackdelay;
                    }
                    if (textSubtitle.length > 2) {
                        for (var j = 3; j < textSubtitle.length; j++) {
                            content.push(delHtmlTag(textSubtitle[j]));
                        }
                    }
                    var subtitle = {
                        sn: sn,
                        startTime: startTime,
                        endTime: endTime,
                        content: content
                    };
                    subtitlesArr.push(subtitle);
                }
            }
            return subtitlesArr;
        },
        timer: function(time, fun, number) {
            var thisTemp = this;
            this.time = 10;
            this.fun = null;
            this.timeObj = null;
            this.number = 0;
            this.numberTotal = null;
            this.runing = false;
            this.startFun = function() {
                thisTemp.number++;
                thisTemp.fun();
                if (
                    thisTemp.numberTotal != null &&
                    thisTemp.number >= thisTemp.numberTotal
                ) {
                    thisTemp.stop();
                }
            };
            this.start = function() {
                if (!thisTemp.runing) {
                    thisTemp.runing = true;
                    thisTemp.timeObj = window.setInterval(thisTemp.startFun, time);
                }
            };
            this.stop = function() {
                if (thisTemp.runing) {
                    thisTemp.runing = false;
                    window.clearInterval(thisTemp.timeObj);
                    thisTemp.timeObj = null;
                }
            };
            if (time) {
                this.time = time;
            }
            if (fun) {
                this.fun = fun;
            }
            if (number) {
                this.numberTotal = number;
            }
            this.start();
        },
        toSeconds: function(t) {
            var s = 0.0;
            if (t) {
                var p = t.split(":");
                for (i = 0; i < p.length; i++) {
                    s = s * 60 + parseFloat(p[i].replace(",", "."));
                }
            }
            return s;
        },
        arrayInt: function(str) {
            var a = str.split(",");
            var b = [];
            for (var i = 0; i < a.length; i++) {
                if (this.isUndefined(a[i])) {
                    a[i] = 0;
                }
                if (a[i].substr(-1) != "%") {
                    a[i] = parseInt(a[i]);
                }
                b.push(a[i]);
            }
            return b;
        },
        standardization: function(o, n) {
            var h = {};
            var k;
            for (k in o) {
                h[k] = o[k];
            }
            for (k in n) {
                var type = "";
                if (h[k]) {
                    type = this.varType(h[k]);
                }
                switch (type) {
                    case "number":
                        h[k] = parseFloat(n[k]);
                        break;
                    default:
                        h[k] = n[k];
                        break;
                }
            }
            return h;
        },
        objectAssign: function(o, n) {
            if (this.varType(o) != "object" || this.varType(n) != "object") {
                return null;
            }
            var obj1 = this.newObj(o),
                obj2 = this.newObj(n);
            for (var k in obj2) {
                if (this.varType(obj2[k]) == "object") {
                    if (this.varType(obj1[k]) != "object") {
                        obj1[k] = {};
                    }
                    obj1[k] = this.objectAssign(obj1[k], obj2[k]);
                } else {
                    obj1[k] = obj2[k];
                }
            }
            return obj1;
        },
        arrIndexOf: function(arr, key) {
            if (this.isUndefined(arr) || this.isUndefined(key)) {
                return -1;
            }
            var re = new RegExp(key, [""]);
            return arr
                .toString()
                .replace(re, "┢")
                .replace(/[^,┢]/g, "")
                .indexOf("┢");
        },
        trim: function(str) {
            if (str != "") {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }
            return "";
        },
        log: function(val) {
            try {
            } catch (e) {}
        },
        eject: function(er, val) {
            if (!this.vars["debug"]) {
                return;
            }
            var errorVal = er[1];
            if (!this.isUndefined(val)) {
                errorVal = errorVal.replace("[error]", val);
            }
            var value = "error " + er[0] + ":" + errorVal;
            try {
                this.log(value);
            } catch (e) {}
        },
        sysError: function(er, val) {
            var ele = this.getByElement(this.vars["container"]);
            var errorVal = er[1];
            if (!this.isUndefined(val)) {
                errorVal = errorVal.replace("[error]", val);
            }
            var value = "error " + er[0] + ":" + errorVal;
            ele.innerHTML = value;
            this.css(ele, {
                backgroundColor: "#000",
                color: "#FFF",
                textAlign: "center",
                lineHeight: ele.offsetHeight + "px"
            });
        },
        varType: function(val) {
            if (val === null) {
                return "string";
            }
            var type = typeof val;
            switch (type) {
                case "string":
                    return "string";
                    break;
                case "number":
                    return "number";
                    break;
                case "boolean":
                    return "boolean";
                    break;
                case "function":
                    return "function";
                    break;
                case "symbol":
                    return "symbol";
                    break;
                case "object":
                    if (!this.isUndefined(typeof val.length)) {
                        return "array";
                    }
                    return "object";
                    break;
                case "undefined":
                    return "undefined";
                    break;
                default:
                    return typeof val;
                    break;
            }
        },
        getConfigObject: function() {
            return this.jsonConfig;
        },
        getStyleObject: function() {
            return this.jsonStyle;
        },
        getLanguageObject: function() {
            return this.jsongLanguage;
        },
        back15Handle: function() {
            if (this.time > 15) this.videoSeek(this.time - 15);
            else this.videoSeek(0);
        },
        go15Handle: function() {
            if (this.time + 15 < this.V.duration) this.videoSeek(this.time + 15);
            else this.videoSeek(this.V.duration - 1);
        }
    };
    window.ckplayer = ckplayer;
})();
