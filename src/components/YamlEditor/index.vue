<template>
  <div class="yaml-editor">
    <textarea ref="editor" />
  </div>
</template>

<script lang="ts" setup name="YamlEditor">
// 引入全局实例
import _CodeMirror from "codemirror/lib/codemirror.js";
// 核心样式
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/matchesonscrollbar.css";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/fold/xml-fold.js";
import "codemirror/addon/edit/matchtags.js";
import "codemirror/addon/display/fullscreen.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/jump-to-line.js";
import "codemirror/addon/scroll/simplescrollbars.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/css/css.js";
import {ref, nextTick, watch, toRefs, Ref} from "vue";
import "codemirror/mode/javascript/javascript.js";

import yaml, {dump, load} from "js-yaml"

let props = defineProps({
  mode: {
    type: String,
    required: false,
    default: 'text/x-yaml'
  },
  content: {
    type: String,
    required: false,
    default: ''
  }
})

const editor = ref();

let coder;

nextTick(() => {
  coder = _CodeMirror.fromTextArea(editor.value, {
    mode: props.mode, // 不设置的话，默认使用第一个引用
    // 缩进格式
    tabSize: 4,
    // 显示行号
    lineNumbers: true,
    lineWrapping: true,
    theme: "monorail", // 编辑器主题
    matchTags: { bothTags: true },
    foldGutter: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    scrollbarStyle: "simple",
    extraKeys: {
      "Alt-F": "findPersistent",
    },
    lint: true, // 开启语法检查
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"] // 语法检查器
  });
  console.log(props.content)
  coder.setValue(props.content);
});

/**
 * 对外提供赋值
 */
const setValue = (val: Ref<String | undefined> | undefined) => {
  // 将对象装换为yaml字符串
  const data = { name: 'Vue', framework: true };
  const yamlString = yaml.dump(data);

  nextTick(() => {coder.setValue(val);})
};

/**
 * 设置模式
 */
const setMode = (mode: string | undefined) => {
  console.info(mode)
  coder.setOption("mode", mode);
}

/**
 * 对外提供取值
 */
const getValue = () => {

  // 将yaml转换为js
  try {
    const data = yaml.load(coder.getValue());
    console.log("yaml-json",data);
  } catch (err) {
    console.error(err);
  }

  return coder.getValue();
};

defineExpose({
  getValue,
  setValue,
})

/*
// watch监视props属性
const content = toRefs(props).content
watch(content, value => {
  console.log(value)
  const editorValue = getValue()
  if (value !== editorValue) {
    setValue(value)
  }
})*/
watch(props.mode, value => {
  setMode(value)
})

</script>

<style scoped>
.yaml-editor{
    height: 100%;
    position: relative;
}
.yaml-editor >>> .CodeMirror {
    height: auto;
    min-height: 300px;
}
.yaml-editor >>> .CodeMirror-scroll{
    min-height: 300px;
}
.yaml-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
}
</style>