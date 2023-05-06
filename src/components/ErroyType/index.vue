<template>
  <div class="pop-fixed jiucuo-pop">
    <div class="pop-wrap error-pop" @click="hideSelect">
      <div class="pop-title">
        <h1 class="pop-t">文献纠错</h1>
        <a href="javascript:;" class="pop-x" @click="close"></a>
      </div>
      <div class="pop-con">
        <div class="pop-form">
          <!-- <formItem :data="errorTypeListArr" @handleChangeStatus="handleChangeStatus"></formItem> -->
          <div class="form-m">
            <label class="form-l">
              <!-- <span class="form-must">*</span> -->
              错误类型
            </label>
            <div class="form-input form-error">
              <div class="form-input-m clearfix">
                <div class="select-box sw1">
                  <div @click.stop="showinput1()">
                    <input
                      class="input-text"
                      name="input-text"
                      readonly
                      v-model="errorTypeOppotion"
                    />
                    <!-- <select  id="itemlist" @change="clickErrorType()" v-model="indexId"  style='width:50%'>
                          <option  v-for="item in errorTypeListArr"  :key="item.ID"  v-bind:id="item.ID"   :value="item.ErrorTypeName">{{item.ErrorTypeName}}</option>
                    </select>-->
                    <span class="select-down" @click.stop="showinput1()">
                      <svg aria-hidden="true" class="icon">
                        <use xlink:href="#icon-jc-down" />
                      </svg>
                    </span>
                  </div>
                  <ul class="option-box1" v-show="optionbox1">
                    <li
                      v-for="item in errorTypeListArr"
                      :key="item.ID"
                      @click.stop="getErrorChildList(item)"
                    >
                      <a href="javascript:void(0);">{{ item.ErrorTypeName }}</a>
                    </li>
                  </ul>
                </div>
                <div class="select-box sw2">
                  <div @click.stop="showinput2">
                    <input
                      class="input-text"
                      readonly
                      v-model="errorTypeChildrenOppotion"
                      placeholder="请选择"
                    />
                    <!-- <select  id="itemchildrenlist"  v-model="indexId2"  @change="getSelectId"  style="height:20px;weight:100px">
                          <option  v-for="item in errorTypechildrenList"  :key="item.ID"  v-bind:id="item.ID"  >{{item.ErrorTypeName}}</option>
                    </select>-->
                    <span class="select-down" @click.stop="showinput2">
                      <svg aria-hidden="true" class="icon">
                        <use xlink:href="#icon-jc-down" />
                      </svg>
                    </span>
                  </div>
                  <ul class="option-box2" v-show="optionbox2">
                    <li
                      v-for="item in errorTypechildrenList"
                      :key="item.ID"
                      @click="getErrorChildoption(item)"
                    >
                      <a href="javascript:void(0);">{{ item.ErrorTypeName }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- <div class="form-tip form-tip-error">错误提示位置</div> -->
            </div>
          </div>
          <div class="form-m" @click="hideSelect">
            <label class="form-l">
              <span class="form-must">*</span>错误描述
            </label>
            <div class="form-input ovide">
              <!-- <textarea  autofocus
                class="input-text"
                name="content"
                id="content"
                maxlength="500"
                @input="descInput"
                v-model="desc"
              >
              </textarea>-->
              <div class="input-text input-textarea">
                <img
                  :src="descImg"
                  alt
                  @click.stop="bigImge(descImg)"
                  v-show="descImg !== undefined && descImg !== ''"
                /><!-- input-upload-img -->
                <textarea
                  name="content"
                  id="jiucuocontent"
                  ref="getFocus"
                  maxlength="500"
                  @click.stop="copyAndSelect($event)"
                  @input.stop="descInput($event)"
                  v-model="desc"
                ></textarea>
              </div>
              <div class="form-textarea-tip">
                <span>{{ remnant }}</span
                >/500
              </div>
              <!-- <div class="form-tip form-tip-error">错误提示</div> -->
            </div>
          </div>
          <div class="form-m" @click="hideSelect">
            <label class="form-l form-l-mt0">上传图片</label>
            <div class="form-input ovide">
              <p class="upload-c9p">
                (
                <b>截图并圈画做标注;</b
                >上传大小不超过5M的JPEG、PNG图片，最多可上传4张)
              </p>
              <div class="input-upload" id="uploadImgBtn">
                <input
                  class="input-upload"
                  :type="fileType"
                  name="file"
                  multiple
                  ref="upload"
                  id="file"
                  @change="handleUploadFile"
                />
              </div>
              <div
                class="input-upload-img"
                v-for="(item, index) in imageList"
                :key="index"
                @click.stop="bigImge(item)"
              >
                <img :src="item" />
                <a
                  href="javascript:;"
                  class="input-upload-del"
                  @click.stop="deleteImage(item, index)"
                >
                  <svg aria-hidden="true" class="icon">
                    <use xlink:href="#icon-jc-delete" />
                  </svg>
                </a>
              </div>
              <div class="input-upload-img btn-upload-sl">
                <span @click.stop="bigImge($event)">截图示例</span>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAAFbCAIAAADX2ikqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCQjBCQjE5MEQ1RUMxMUVBQUNGREY2MTdDRTYwMzhCRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCQjBCQjE5MUQ1RUMxMUVBQUNGREY2MTdDRTYwMzhCRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJCMEJCMThFRDVFQzExRUFBQ0ZERjYxN0NFNjAzOEJGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJCMEJCMThGRDVFQzExRUFBQ0ZERjYxN0NFNjAzOEJGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+htQWsgAAg1dJREFUeNrsvQm8VVXd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"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="pop-bottom">
          <a href="javascript:;" class="btn btn-blue" @click="GetCorrectMeasure"
            >提交</a
          >
          <a href="javascript:;" class="btn btn-line-blue" @click="close"
            >取消</a
          >
        </div>
        <div class="error-img-pop" v-show="slshow" @click="slClose">
          <a href="javascript:;" class="error-pop-x">
            <svg aria-hidden="true" class="icon">
              <use xlink:href="#icon-jc-shanchu" />
            </svg>
          </a>
          <img :src="imgSrclist" alt />
        </div>
      </div>
    </div>
    <div class="shaw"></div>
    <div class="tip-pop" v-show="tipShow">
      <div class="tip-box">
        <span class="tip-con">{{ tipShowContent }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import "./assets/iconfont.js";
export default {
  name: "errorType",
  components: {},
  props: ["parameter", "type", "cutObj"],
  data() {
    return {
      errorTypeListArr: [],
      file: Object,
      fileCode: [],
      imgSrc: "",
      imageList: [],
      checkedRadioValue: [],
      addOriginalText: "",
      slshow: false,
      errorTypechildrenList: [],
      indexId: "",
      indexId2: "",
      errorTypeid: "",
      imgSrclist: "",
      remnant: 0,
      desc: "", //texteare中的字的字数
      descImg: "", //图片内容
      optionbox1: false,
      optionbox2: false,
      errorTypeOppotion: "正文",
      errorTypeChildrenOppotion: "",
      url: "",
      uniqueFileName: "",
      originalFileName: "",
      extensionName: "",
      order: [],
      attachmentsArr: [],
      attachments: "",
      result: [],
      order: 1,
      fileType: "file",
      tipShow: false,
      tipShowContent: "",
      originalImg: "",
      inputContent: "", //输入框内容
      timer: null,
      imgCutImage: []
    };
  },
  watch: {
    cutObj: {
      handler(val) {
        if (!!val) {
          console.log("图片");
          console.log(val);
        }
      },
      deep: true
    }
  },
  mounted() {
    console.log(this.parameter); //加参数方便找到问题
    //初始化texteara的最小高度
    //纠错图片的高度
    var textarea = $("textarea");
    if (!!$(".input-textarea img").css("height")) {
      var minHeight =
        parseInt(197 + "px") -
        parseInt($(".input-textarea img").css("height")) +
        "px";
      $("textarea").css("min-height", minHeight);
    } else {
      $("textarea").css("min-height", 197 + "px");
    }
  },
  created() {
    //找问题的思路需要加上
    console.log(this.parameter);
    this.initErrorType();
    //划词内容渲染进入框
    let imgReg = /<img.*?(?:>|\/>)/gi;
    if (
      this.parameter !== undefined &&
      this.parameter.originalText !== undefined &&
      this.parameter.originalText !== ""
    ) {
      if (this.parameter.originalText.match(imgReg)) {
        this.descImg = this.imgUrl(this.parameter.originalText);
      } else {
        if (
          this.parameter.originalText !== undefined &&
          this.parameter !== undefined &&
          this.parameter.originalText.length > 500
        ) {
          this.desc =
            "【纠错原文内容：" +
            this.parameter.originalText.substring(0, 491) +
            "】";
          this.remnant = this.desc.length;
        } else {
          this.desc =
            this.parameter !== undefined &&
            this.parameter.originalText !== "" &&
            this.parameter.originalText !== undefined
              ? "【纠错原文内容：" + this.parameter.originalText + "】"
              : "";
          this.remnant =
            this.parameter !== undefined &&
            this.parameter.originalText !== "" &&
            this.parameter.originalText !== undefined
              ? this.parameter.originalText.length
              : 0;
        }
      }
    }

    //初始化进来能够进入点击事件
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.$refs.getFocus.focus();
    }, 100);
  },
  watch: {
    desc(val) {
      var textarea = $("textarea");
      textarea[0].style.height = textarea[0].scrollHeight + "px";
      console.log(textarea[0].style.height);
    }
  },
  methods: {
    initErrorType() {
      let _this = this;
      $.ajax({
        type: "get",
        contentType: "multipart/form-data",
        dataType: "json",
        url: "/read/Correction/GetBussinessErrortype?BusinessCode=Read",
        async: true
      }).done(function(res) {
        if (res.Code == 200) {
          //赋值参数
          _this.errorTypeList = res.Data.BussinessErrortype.ErrortypesList;
          _this.errorTypeListArr = _this.setTreeData(_this.errorTypeList);
          _this.errorTypeOppotion = _this.errorTypeListArr[0].ErrorTypeName;
          _this.errorTypeChildrenOppotion =
            _this.errorTypeListArr[0].children[0].ErrorTypeName;
          _this.errorTypechildrenList = _this.errorTypeListArr[0].children;
          _this.errorTypeid = _this.errorTypechildrenList[0].ID;
        }
        // else {
        //   //弹出气泡提示
        //   _this.tipShow = true;
        //   _this.tipShowContent = "下拉框数据展示不了，请联系工作人员";
        //   $(".tip-box").addClass("tip-error");
        //   setTimeout(() => {
        //     _this.tipShow = false;
        //   }, 2000);
        // }
      });
    },

    //拷贝还有复制
    copyAndSelect(e) {
      var inp = window.getSelection();
      if (inp && inp.select) {
        inp.select();
        try {
          document.execCommand("copy");
          console.log("复制成功");
          inp.blur();
        } catch (err) {
          console.log("有复制异常");
        }
      }
    },
    setTreeData(params) {
      //删除所有children以防多次调用
      params.forEach(element => {
        delete element.children;
      });
      let map = {}; //构建map
      params.forEach(i => {
        map[i.ID] = i;
      });
      let treeData = [];
      params.forEach(child => {
        //判断当前数据的parentId是否存在map中
        const mapItem = map[child.ParentId];
        if (mapItem) {
          (mapItem.children || (mapItem.children = [])).push(child);
        } else {
          treeData.push(child);
        }
      });
      return treeData;
    },

    reset() {
      this.errorTypeList1Arr = [].concat(this.errorTypeList1);
    },
    // handleGetUrlParams(url) {
    //   const keyValueArr = url.split("?")[1].split("&");
    //   let paramObj = {};
    //   keyValueArr.forEach(item => {
    //     const keyValue = item.split("=");
    //     paramObj[keyValue[0]] = decodeURIComponent(keyValue[1]);
    //   });
    //   return paramObj;
    // },
    handleUploadFile(e) {
      debugger;
      console.log(e);
      var _this = this;
      if (_this.imageList.length == 4) {
        //弹出气泡提示
        _this.tipShow = true;
        _this.tipShowContent = "上传图片不能超过4张";
        $(".tip-box").addClass("tip-warn");
        setTimeout(() => {
          _this.tipShow = false;
        }, 2000);
      }
      if (
        !!e &&
        e.target !== undefined &&
        e.target !== "" &&
        e.target !== null
      ) {
        _this.file = e.target.files[0];
        //判断上传文献大小不能超过5M,并且图片格式为.png  .jpeg
        let data = new FormData();
        const action = "uploadimage";
        data.append("action", action);
        data.append("upfile", _this.file);
        $.ajax({
          type: "post",
          dataType: "json",
          data: data,
          url: "/read/File/UploadAppendix",
          processData: false,
          contentType: false,
          async: true
        }).done(function(res) {
          _this.$refs.upload.value = ""; //
          _this.imageList.push(res.url);
          if (_this.imageList.length >= 4) {
            _this.imageList = _this.imageList.slice(0, 4);
            var inputType = $("input[type='file']");
            inputType.attr("type", "text");
          }

          if (!!(res && res.url)) {
            var uniCode = res.url
              .split("?")[1]
              .split("&")[1]
              .split("=")[1];
          }

          let attachment = {
            Url: res.url,
            UniqueFileName: uniCode,
            OriginalFileName: res.original,
            ExtensionName: uniCode ? uniCode.split(".")[1] : null,
            Order: _this.order
          };
          _this.order = _this.order + 1;
          _this.attachmentsArr.push(attachment);
        });
        if (_this.file.size > 5242880) {
          //弹出气泡提示
          _this.tipShow = true;
          _this.tipShowContent = "上传图片大小不能超过5M";
          $(".tip-box").addClass("tip-warn");
          setTimeout(() => {
            _this.tipShow = false;
          }, 2000);
          _this.$refs.upload.value = ""; //
        }
      }
    },

    //url
    //显示第一个下拉框
    showinput1() {
      var _this = this;
      _this.optionbox1 = !_this.optionbox1;
      _this.optionbox2 = false;
    },
    //显示第二个下拉框
    showinput2() {
      var _this = this;
      _this.optionbox2 = !_this.optionbox2;
      _this.optionbox1 = false;
    },

    //点击第一个下拉列表级联到第二个下拉列表
    getErrorChildList(e) {
      var _this = this;
      _this.errorTypeOppotion = e.ErrorTypeName;
      _this.errorTypeChildrenOppotion = "";
      _this.optionbox1 = false;
      _this.optionbox2 = false;
      _this.errorTypeListArr.forEach(function(item, index) {
        if (item.ErrorTypeName == e.ErrorTypeName) {
          _this.errorTypechildrenList = item.children;
        }
      });
      if (
        _this.errorTypechildrenList !== undefined &&
        _this.errorTypechildrenList !== ""
      ) {
        _this.errorTypeChildrenOppotion =
          _this.errorTypechildrenList[0].ErrorTypeName;
        _this.errorTypeid = _this.errorTypechildrenList[0].ID;
      }
    },

    //点击获取某一个确定的errorType
    getErrorChildoption(e) {
      var _this = this;
      _this.errorTypeChildrenOppotion = e.ErrorTypeName;
      _this.errorTypeid = e.ID;
      _this.optionbox1 = false;
      _this.optionbox2 = false;
    },
    //删除图片
    deleteImage(item, index) {
      var _this = this;
      var inputText = $("input[type='text']");
      inputText.attr("type", "file");
      this.imageList.splice(index, 1);
      //删除图片后下发图片参数删除
      _this.attachmentsArr.forEach(function(e, i) {
        if (e.Url == item) {
          _this.attachmentsArr.splice(i, 1);
        }
      });
    },

    //新增纠错
    GetCorrectMeasure() {
      debugger;
      var _this = this;
      //伪代码：排除法，无图片就是添加然后依旧看有无信息/如果不是没有，那就按照以前的方式走就行啦
      if (_this.imageList.length == 0) {
        const returnImageData = new Promise((resolve, reject) => {
          debugger;
          _this.$emit("handleUploadFile", function(val) {
            debugger;
            resolve(val);
            //返回ture其实就是判定返回了数据再往下走，不如直接走promise
            //_this.imagFlag=true;
          });
        });

        returnImageData
          .then(val => {
            console.log(val);
            _this.imgCutImage = val;
            _this.imageList = [];
            _this.imageList.push(_this.imgCutImage.url);
            if (!!(_this.imgCutImage && _this.imgCutImage.url)) {
              var uniCode = _this.imgCutImage.url
                .split("?")[1]
                .split("&")[1]
                .split("=")[1];
            }

            let attachment = {
              Url: _this.imgCutImage.url,
              UniqueFileName: uniCode,
              OriginalFileName: _this.imgCutImage.original,
              ExtensionName: uniCode ? uniCode.split(".")[1] : null,
              Order: 1
            };
          })
          .catch(val => {
            console.log("添加失败，请上传图片");
          });
      }
      let data = {
        subject: {
          ErrorTypeIds: _this.errorTypeid, //
          BussinessId: "1", //
          FreeBackInfo:
            encodeURIComponent(_this.parameter.originalText) +
            encodeURIComponent(_this.inputContent), //划词内容+输入内容，//解决estudy取不到问题
          WebInformation: encodeURIComponent(_this.parameter.webInformation)
        },
        Attachments: _this.attachmentsArr,
        ExtendInfo: {
          FileName: _this.parameter.fileName, //
          DbCode: _this.parameter.dbCode, //
          TableName: _this.parameter.tableName, //
          Url: _this.parameter.url, //
          OriginalText: encodeURIComponent(_this.parameter.originalText), //
          Title: encodeURIComponent(_this.parameter.title), //
          FileSourceType: _this.parameter.fileSourceType,
          AppId: _this.parameter.appId
        }
      };
      if (
        (_this.inputContent == "" &&
          _this.parameter.originalText == undefined) ||
        (_this.inputContent == "" && _this.parameter.originalText !== "") ||
        (_this.inputContent == "" && _this.parameter.originalText == "")
      ) {
        _this.tipShow = true;
        _this.tipShowContent = "请填写完整信息";
        $(".tip-box").addClass("tip-warn");
        setTimeout(() => {
          _this.tipShow = false;
        }, 2000);
      } else {
        if (
          _this.parameter.fileName !== "" &&
          _this.parameter.dbCode !== "" &&
          _this.parameter.tableName !== "" &&
          _this.parameter.url !== "" &&
          _this.parameter.fileSourceType !== "" &&
          _this.parameter.appId !== "" &&
          _this.desc !== "" &&
          _this.errorTypeid !== ""
        ) {
          $.ajax({
            type: "post",
            data: data,
            dataType: "json",
            url: "/read/Correction/AddSubject",
            async: true
          }).done(function(res) {
            _this.order = 1;
            if (res.Code == 200) {
              //弹出气泡提示
              _this.tipShow = true;
              _this.tipShowContent = "提交成功，感谢您的使用";
              $(".tip-box").addClass("tip-success");
              setTimeout(() => {
                _this.tipShow = false;
                _this.close();
              }, 1800);
            } else {
              //弹出气泡提示
              _this.tipShow = true;
              _this.tipShowContent = "提交失败";
              $(".tip-box").addClass("tip-error");
              setTimeout(() => {
                _this.tipShow = false;
                _this.close();
              }, 1800);
            }
          });
        }
      }
    },

    // GetCorrectMeasure() {
    //   debugger
    //   var _this = this;
    //   _this.$emit("handleUploadFile",function(val){
    //     debugger
    //        _this.imgCutImage=val;
    //        _this.imagFlag=true;
    //   });
    //   debugger
    //    console.log(_this.imgCutImage.url);
    //    if(_this.imageList.length==0&&_this.imagFlag==true){
    //      debugger
    //      _this.imagFlag=false;
    //      _this.imageList=[];
    //      _this.imageList.push(_this.imgCutImage.url);
    //       if(!!(_this.imgCutImage&&_this.imgCutImage.url)){
    //            var  uniCode = _this.imgCutImage.url
    //           .split("?")[1]
    //           .split("&")[1]
    //           .split("=")[1];
    //         }

    //         let attachment = {
    //           Url: _this.imgCutImage.url,
    //           UniqueFileName: uniCode,
    //           OriginalFileName: _this.imgCutImage.original,
    //           ExtensionName: uniCode
    //             ? uniCode.split(".")[1]
    //             : null,
    //           Order: 1
    //         };
    //    }else{
    //      return false;
    //      //加上提示语
    //    }

    //   let data = {
    //     subject: {
    //       ErrorTypeIds: _this.errorTypeid, //
    //       BussinessId: "1", //
    //       FreeBackInfo:encodeURIComponent(_this.parameter.originalText)+ encodeURIComponent(_this.inputContent), //划词内容+输入内容，//解决estudy取不到问题
    //       WebInformation: encodeURIComponent(_this.parameter.webInformation)
    //     },
    //     Attachments: _this.attachmentsArr,
    //     ExtendInfo: {
    //       FileName: _this.parameter.fileName, //
    //       DbCode: _this.parameter.dbCode, //
    //       TableName: _this.parameter.tableName, //
    //       Url: _this.parameter.url, //
    //       OriginalText: encodeURIComponent(_this.parameter.originalText), //
    //       Title: encodeURIComponent(_this.parameter.title), //
    //       FileSourceType: _this.parameter.fileSourceType,
    //       AppId: _this.parameter.appId
    //     }
    //   };
    //   if ((_this.inputContent==''&&_this.parameter.originalText==undefined)||(_this.inputContent==''&&_this.parameter.originalText!=='')||(_this.inputContent==''&&_this.parameter.originalText=='')) {
    //         _this.tipShow = true;
    //         _this.tipShowContent = "请填写完整信息";
    //        $(".tip-box").addClass("tip-warn");
    //        setTimeout(() => {
    //         _this.tipShow = false;
    //         }, 2000);
    //   }else{
    //     if (
    //       _this.parameter.fileName !== "" &&
    //       _this.parameter.dbCode !== "" &&
    //       _this.parameter.tableName !== "" &&
    //       _this.parameter.url !== "" &&
    //       _this.parameter.fileSourceType !== "" &&
    //       _this.parameter.appId !== "" &&
    //       _this.desc !== "" &&
    //       _this.errorTypeid !== ""
    //     ) {
    //       $.ajax({
    //         type: "post",
    //         data: data,
    //         dataType: "json",
    //         url: "/read/Correction/AddSubject",
    //         async: true
    //       }).done(function(res) {
    //         _this.order = 1;
    //         if (res.Code == 200) {
    //           //弹出气泡提示
    //           _this.tipShow = true;
    //           _this.tipShowContent = "提交成功，感谢您的使用";
    //           $(".tip-box").addClass("tip-success");
    //           setTimeout(() => {
    //             _this.tipShow = false;
    //             _this.close();
    //           }, 1800);
    //         } else {
    //           //弹出气泡提示
    //           _this.tipShow = true;
    //           _this.tipShowContent = "提交失败";
    //           $(".tip-box").addClass("tip-error");
    //           setTimeout(() => {
    //             _this.tipShow = false;
    //             _this.close();
    //           }, 1800);
    //         }
    //       });
    //     }
    //   }
    // },
    handleChangeStatus(data) {
      let _this = this;
      _this.checkedRadioValue = data;
    },
    //关闭遮盖栏
    close() {
      this.$emit("close", false);
    },
    //下拉框二级联动
    clickErrorType() {
      var _this = this;
      _this.errorTypeListArr.forEach(function(item, index) {
        if (item.ErrorTypeName == _this.indexId) {
          _this.errorTypechildrenList = item.children;
        }
      });
    },
    //获取点击按钮ID
    getSelectId() {
      var _this = this;
      _this.errorTypechildrenList.forEach(function(item, index) {
        if (item.ErrorTypeName == _this.indexId2) {
          _this.errorTypeid = item.ID;
        }
      });
    },
    //图片放大
    bigImge(e) {
      var _this = this;
      if (
        e !== undefined &&
        e.target !== undefined &&
        $(e.target)[0].innerHTML == "截图示例"
      ) {
        _this.imgSrclist =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAAFbCAIAAADX2ikqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCQjBCQjE5MEQ1RUMxMUVBQUNGREY2MTdDRTYwMzhCRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCQjBCQjE5MUQ1RUMxMUVBQUNGREY2MTdDRTYwMzhCRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJCMEJCMThFRDVFQzExRUFBQ0ZERjYxN0NFNjAzOEJGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJCMEJCMThGRDVFQzExRUFBQ0ZERjYxN0NFNjAzOEJGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+htQWsgAAg1dJREFUeNrsvQm8VVXd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";
      } else {
        _this.imgSrclist = e;
      }
      _this.slshow = true;
    },
    slClose() {
      var _this = this;
      _this.slshow = false;
    },

    descInput(e) {
      let _this = this;
      var textVal = e.target.value.length;
      //console.log(e.target.innerText);
      if (textVal > 500) {
        e.target.value = e.target.value.substring(0, 500);
        _this.inputContent = e.target.value;
      } else {
        _this.inputContent = e.target.value;
      }
      _this.remnant = e.target.value.length;
    },

    //图片纠错内容渲染出来
    imgUrl(string) {
      var a = string;
      var arrimg = [];
      a.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
        arrimg.push(capture);
      });
      if (arrimg != null && arrimg.length > 0) {
        return arrimg;
      }
    },

    //点击其他地方隐藏下拉框
    hideSelect() {
      //方法写在每一个区域上
      let _this = this;
      _this.optionbox1 = false;
      _this.optionbox2 = false;
    }
  }
};
</script>
<style>
/* 纠错弹层组件*/
/* copycommon.css无改动*/
* {
  -webkit-overflow-scrolling: touch;
}
:focus {
  outline: 0;
}
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
dl,
dd {
  margin: 0;
  padding: 0;
}
ul,
dl {
  list-style: none;
}
input,
button,
textarea {
  box-sizing: border-box;
  padding: 0;
  outline: none;
  vertical-align: middle;
}
body {
  color: #333;
  font-size: 14px;
  line-height: 1.7;
  font-family: Arial, Helvetica, "\5FAE\8F6F\96C5\9ED1", sans-serif;
}
a {
  text-decoration: none;
  color: inherit;
}
img {
  border: none;
  outline: 0;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.clearfix:after {
  content: "\200B";
  display: block;
  height: 0;
  clear: both;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #fff inset;
}
input[type="password"]::-ms-reveal {
  display: none;
}

.co {
  color: #f80;
}
.shaw {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
}
/* 登录*/
.pop-x {
  top: 10px;
  right: 10px;
}
.pop-x:after,
.pop-x:before {
  content: "";
  display: block;
  width: 1px;
  height: 16px;
  top: 8px;
  left: 16px;
  background: #707070;
  position: absolute;
}
.pop-x:before {
  transform: rotate(45deg);
}
.pop-x:after {
  transform: rotate(-45deg);
}
.pop-x:hover:after,
.pop-x:hover:before {
  background: #3594ff;
}
.pop-x {
  position: absolute;
  width: 32px;
  height: 32px;
}
/*意见反馈*/
.btn {
  display: inline-block; /*border:1px solid transparent;*/
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: 0.3s;
}
/*按钮*/
body .btn-blue {
  color: #fff;
  border: 1px solid #3594ff;
  background: #3594ff;
}
body .btn-line-blue {
  background: #fff;
  border: 1px solid #3594ff;
  color: #3594ff;
}
body .btn-blue:hover,
.btn-line-blue:hover {
  color: #fff;
  background: #3474d8;
  border-color: #3474d8;
}

.pop-wrap {
  position: relative;
  margin: 15vh auto 0;
  color: #333;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(204, 204, 204, 0.32);
  z-index: 101;
}
.pop-fixed {
  position: fixed;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  top: 0 !important;
  z-index: 101;
  overflow-y: auto;
}
.pop-title {
  height: 48px;
  line-height: 48px;
  padding: 0 20px;
  border-bottom: 1px solid #ececec;
}
.pop-t {
  font-size: 14px;
  font-weight: 400;
}
.pop-body {
  padding: 24px;
}
.pop-bottom {
  padding: 24px 0 0;
  text-align: center;
}
.pop-bottom .btn {
  padding: 10px 21px;
  line-height: 1;
  border-radius: 4px;
  min-width: 1px;
}
.pop-bottom .btn + .btn {
  margin-left: 25px;
}

@media (max-width: 1440px) {
  .pop-wrap {
    margin-top: 5vh;
  }
}
/* copy意见反馈 */
.error-pop .btn-line-blue:hover,
.error-pop .btn-blue:hover,
.error-pop .btn-blue {
  color: #fff;
}
body .error-pop {
  width: 680px;
  font-size: 14px;
}
.error-pop .pop-x {
  right: 10px;
  top: 7px;
}
.error-pop img {
  max-width: 100%;
}
.error-pop input[type="checkbox"] {
  padding: 0;
  margin: 0;
}
.error-pop .input-check {
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin-right: 24px;
}
.error-pop .input-check input[type="checkbox"] {
  opacity: 0;
  position: relative;
  z-index: 1;
  cursor: pointer;
  margin-right: 3px;
}
.error-pop .check {
  position: absolute;
  top: 4px;
  left: 0;
  box-sizing: border-box;
  display: inline-block;
  width: 14px;
  height: 14px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.error-pop .check:after {
  content: "";
  display: block;
  width: 9px;
  height: 4px;
  margin: 2px 0 0 1px;
  border-bottom: 1px solid #fff;
  border-left: 1px solid #fff;
  transform: rotate(-45deg);
}
.error-pop .input-check input[type="checkbox"]:checked + .check {
  background-color: #409eff;
  border-color: #409eff;
}

.error-pop .input-textarea textarea {
  width: 100%;
  display: block;
  padding: 0;
  border: none;
  min-height: 100%;
}
.error-pop .input-check input[type="checkbox"]:hover + .check {
  border-color: #409eff;
}
.error-pop .radio-f {
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin-right: 24px;
}
.error-pop .radio-f input[type="radio"] {
  opacity: 0;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.error-pop .radio:before {
  content: "";
  position: absolute;
  top: 3px;
  left: 0;
  box-sizing: border-box;
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: #fff;
}
.error-pop .radio-f input[type="radio"]:checked + .radio:before {
  border: 5px solid #409eff;
}
.error-pop .input-upload,
.input-upload-img {
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 60px;
  margin-right: 13px;
  vertical-align: top;
  text-align: center;
  line-height: 59px;
  font-size: 20px;
  color: #ccc;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error-pop .input-upload input {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  cursor: pointer;
}
.error-pop .input-upload:after,
.input-upload:before {
  content: "";
  display: block;
  background: #ccc;
}
.error-pop .input-upload:before {
  width: 20px;
  height: 1px;
  margin: 29px auto 0;
}
.error-pop .input-upload:after {
  width: 1px;
  height: 20px;
  margin: -11px auto;
}
.error-pop .input-upload-img {
  vertical-align: top;
}
.error-pop .input-upload-img img {
  width: 58px;
  height: 58px;
  object-fit: cover;
  cursor: zoom-in;
}
.error-pop .input-upload-img:hover .input-upload-del {
  height: 26px;
}
.error-pop .input-upload-loading {
  background-size: 80%;
}
.error-pop .input-upload-del {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  overflow: hidden;
  line-height: 26px;
  text-align: center;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  transition: 0.3s;
}
.upload-c9p {
  color: #999;
  margin-bottom: 13px;
}
.error-pop .pop-form {
  padding: 0 15px 0 24px; /* height:404px;overflow-y:auto */
}
.error-pop .form-m {
  margin-bottom: 22px;
  clear: both;
  position: relative;
}
.error-pop .form-m:last-child {
  margin-bottom: 12px;
}
.error-pop .form-must {
  color: #ff3b30;
  position: absolute;
  left: -9px;
}
.error-pop .form-l {
  float: left;
  margin-right: 10px;
  text-align: right;
  width: 80px;
  margin-top: 6px;
  position: relative;
}
.error-pop .form-l-mt0 {
  margin-top: 0;
}
.error-pop .form-l:after {
  content: "\ff1a";
  letter-spacing: 0;
}
.error-pop .form-input {
  display: table-cell;
  width: 1200px;
  /* overflow:hidden;*/
  position: relative;
  cursor: pointer;
}
.error-pop .ovide {
  overflow: hidden;
  width: auto;
  display: block;
}
.error-pop .input-text {
  box-sizing: border-box;
  padding: 8px 12px;
  display: block;
  width: 100%;
  height: 36px;
  line-height: 36px;
  margin: 0;
  white-space: normal;
  text-align: left;
  border-radius: 4px;
  border: 1px solid #ccc;
  font: 14px/1.7 Arial, Helvetica, "\5FAE\8F6F\96C5\9ED1";
  cursor: pointer;
}
.error-pop .input-textarea {
  width: 503px;
  height: 215px;
  resize: none;
  overflow-y: auto;
  white-space: normal;
}

.error-pop .form-tip {
  position: absolute;
  bottom: -24px;
  font-size: 14px;
  left: 6.5em;
}
.error-pop .form-tip-error {
  color: #f44c4c;
}
.error-pop .form-textarea-tip {
  position: absolute;
  right: 8px;
  bottom: 18px;
  color: #999;
  position: absolute;
  bottom: 4px;
  line-height: 1;
  right: 17px;
  padding: 10px 0 0 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0,
    #fff 30%,
    #fff 80%,
    #fff 100%
  );
}
/* .error-pop .input-text:focus{border-color:#007aff} */
/* .error-pop .form-error .input-text{border-color:#f44c4c} */
.error-pop .pop-con {
  padding: 24px;
}
.error-pop .form-w1 {
  display: inline-block;
  width: 240px;
  vertical-align: top;
}
.error-pop .form-w2 {
  width: 395px;
  vertical-align: top;
  float: right;
}
.error-pop .form-w1 .form-l,
.error-pop .form-w2 .form-l {
  margin-top: 6px;
}
.error-pop .select-box {
  position: relative;
  display: inline-block;
}
.error-pop .select-down {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  font-size: 12px;
  display: block;
  padding: 12px 6px;
  line-height: 1;
  right: 3px;
  color: #999;
}
.error-pop .option-box1 {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  opacity: 1;
  border-radius: 4px;
  top: 46px;
}
.error-pop .option-box1 li {
  line-height: 36px;
  padding: 0 12px;
}
.error-pop .option-box1 li:hover {
  background: #f5f7fa;
}
/* 第二个下拉框 */
.error-pop .option-box2 {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  opacity: 1;
  border-radius: 4px;
  top: 38px;
}
.error-pop .option-box2 li {
  line-height: 36px;
  padding: 0 12px;
  cursor: pointer;
}
.error-pop .option-box2 li:hover {
  background: #f5f7fa;
}
.error-pop .btn-upload-sl:before,
.btn-upload:hover:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
}
.error-pop .btn-upload-sl span {
  position: absolute;
  z-index: 1;
  width: 2em;
  top: 0;
  bottom: 0;
  left: 16px;
  white-space: normal;
  font-size: 14px;
  line-height: 1.45;
  color: #fff;
  cursor: pointer;
  box-sizing: border-box;
  padding-top: 9px;
}
.error-img-pop {
  /* position: absolute; */
  position: fixed;
  z-index: 10;
  top: -1px;
  right: -1px;
  bottom: -1px;
  left: -1px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
}
.error-img-pop img {
  /* width: 460px;
  height: 347px;
  margin: 0 auto;
  display: block;
  margin-top: -173px;
  top: 50%;
  position: relative; */
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  cursor: zoom-out;
}
.error-pop .input-textarea img[unknown] {
  display: none;
}
.error-pop-x {
  display: none;
  position: absolute;
  right: 83px;
  top: 94px;
  font-size: 24px;
  line-height: 1;
  z-index: 1;
  color: rgb(255, 255, 255, 0.6);
}
.sw1 {
  width: 30%;
}
.sw2 {
  width: 66%;
  float: right;
}
.error-pop .input-disable {
  background: #f4f4f4;
  color: #999;
  cursor: text;
}

.error-pop .input-disable.input-upload input {
  cursor: text;
}

/* .error-set-a{display:inline-block;font-size:16px;color:#ccc;position:absolute;right:-40px;top:10px;right:-31px;top:9px;line-height:1}
.error-set-a:hover{color:#3594ff}
.error-pop .form-input-m{position:relative;margin-bottom:12px} */
.error-pop-x:hover {
  color: rgb(255, 255, 255, 1);
}
.error-pop .form-error {
  position: relative;
}
.c-primary {
  color: #3594ff;
}

.tip-pop {
  position: absolute;
  top: 15vh;
  left: 0;
  right: 0;
  z-index: 101;
  text-align: center;
  border-radius: 6px;
  box-sizing: border-box;
  z-index: 102;
}
.tip-box {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  min-width: 200px;
  min-height: 51px;
  max-width: 400px;
  padding: 15px 30px;
  font-size: 14px;
  background: #fff;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 6px;
  box-shadow: 0px 0px 10px 1px rgba(125, 125, 125, 0.32);
  -webkit-box-shadow: 0px 0px 10px 1px rgba(125, 125, 125, 0.32);
  -moz-box-shadow: 0px 0px 10px 1px rgba(125, 125, 125, 0.32);
}
.tip-warn {
  color: #f80;
  background: #fff9ec;
  border: 1px solid rgb(255, 220, 201);
  box-shadow: 0px 0px 10px 1px rgba(255, 185, 121, 0.32);
  -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 185, 121, 0.32);
  -moz-box-shadow: 0px 0px 10px 1px rgba(255, 185, 121, 0.32);
}
.tip-success {
  color: #29b049;
  background: #e3fde4;
  border: 1px solid rgb(198, 232, 200);
  box-shadow: 0px 0px 10px 1px rgba(131, 239, 125, 0.32);
  -webkit-box-shadow: 0px 0px 10px 1px rgba(131, 239, 125, 0.32);
  -moz-box-shadow: 0px 0px 10px 1px rgba(131, 239, 125, 0.32);
}
.tip-error {
  color: #f44c4c;
  background: #ffe4e4;
  border: 1px solid rgb(245, 208, 208);
  box-shadow: 0px 0px 10px 1px rgba(255, 145, 145, 0.32);
  -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 145, 145, 0.32);
  -moz-box-shadow: 0px 0px 10px 1px rgba(255, 145, 145, 0.32);
}
@media (max-width: 1440px) {
  .tip-box {
    max-width: 100%;
    margin: 0 20px;
  }
}

@media (max-width: 1440px) {
  body .error-pop {
    margin-top: 5vh;
  }
}
</style>
