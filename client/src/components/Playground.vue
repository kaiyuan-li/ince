<template>
<div>
  <h2>Coding Playground</h2>
  <br>
  <codemirror
    ref="cmEditor"
    :options="cmOptions"
    @ready="onCmReady"
    @focus="onCmFocus"
    @input="onCmCodeChange"
  />

  <button
          type="button"
          class="btn btn-warning btn-sm"
          @click="runCode()">
      Run
  </button>
  <p> {{ result }} </p>
</div>
</template>

<script>
// import language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/python/python.js'


// import theme style
import 'codemirror/theme/3024-day.css'

import axios from 'axios'
// import more 'codemirror/some-resource...'

export default {
  props: ['id'],
  data () {
    return {
      code: '',
      cmOptions: {
        tabSize: 2,
        mode: 'python',
        theme: '3024-day',
        lineNumbers: true,
        line: true,
        // more CodeMirror options...
      },
      result: '',
      hasError: false,  // There are errors in the solution
      hint: {
        'type': '',
        'error': null,
      },
      showHint: false,
    }
  },
  methods: {
    onCmReady(cm) {
      console.log('the editor is readied!', cm)
    },
    onCmFocus(cm) {
      console.log('the editor is focused!', cm)
    },
    onCmCodeChange(newCode) {
      console.log('this is new code', newCode)
      this.code = newCode
    },
    runCode() {
      let code = this.codemirror.getValue()
      const timeoutMs = 5000
      let payload = {code, timeoutMs}
      console.log('running code: ', payload)
      const path = 'http://localhost:3000/';
      axios.post(path, payload)
        .then((res) => {
          let data = res.data.stdout
          this.result = data
          // if (data.run_test == false) {
          //   this.result = 'Syntax error(s) in the code!'
          //   this.hint = {
          //     'type': 'SyntaxError',
          //     'error': data['message']['error']
          //   }
          //   return
          // }
          // let test_result = data
          // console.log(test_result)
          // if (!test_result['pass']) {
          //   this.result = 'Bug(s) detected in your code!'
          //   this.hint = {
          //     'type': test_result['type'],
          //     'error': test_result['error'],
          //   }
          //   return
          // }
          // this.result = 'Congrats! All tests passed!'
          // this.hint = null
          // this.hasError = false
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
  },
  computed: {
    codemirror() {
      return this.$refs.cmEditor.codemirror
    }
  },
  mounted() {
    console.log('the current CodeMirror instance object:', this.codemirror)
    // you can use this.codemirror to do something...
  },
  created() {
  }
}
</script>