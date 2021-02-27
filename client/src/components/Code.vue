<template>
<div>
  <router-link to="/">All Problems</router-link>
  <br>
  <p>{{ problem.description }}</p>
  <codemirror
    ref="cmEditor"
    :value="problem.template"
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
  <div v-if="hasError">
    <button v-if="!showHint" @click="showHint=true">Hint</button>
    <div v-else>
      <div v-if="hint.type=='SyntaxError'">
        {{ hint.error }}
      </div>
      <div v-else>
        <p> input: {{ hint.error.input }} </p>
        <p> want: {{ hint.error.want }} </p>
        <p> got: {{ hint.error.got }} </p>
      </div>
    </div>
  </div>
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
      problem: undefined,
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
      this.showHint = false
      let payload = {'code': this.codemirror.getValue()}
      console.log('running code: ', payload)
      const path = `http://localhost:5000/code?id=${this.$props.id}`;
      axios.post(path, payload)
        .then((res) => {
          this.hasError = true
          let data = res.data
          // data: {
          //   run_test: boolean // if test's been run
          //   message: {
          //     pass: boolean // if test passed
          //     type: type of failure // SyntaxError or FailedTestPoint
          //     error: error message: string for SyntaxError, dict for FailedTestPoint
          //   }
          // }
          if (data.run_test == false) {
            this.result = 'Syntax error(s) in the code!'
            this.hint = {
              'type': 'SyntaxError',
              'error': data['message']['error']
            }
            return
          }
          let test_result = data
          console.log(test_result)
          if (!test_result['pass']) {
            this.result = 'Bug(s) detected in your code!'
            this.hint = {
              'type': test_result['type'],
              'error': test_result['error'],
            }
            return
          }
          this.result = 'Congrats! All tests passed!'
          this.hint = null
          this.hasError = false
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getProblemWithId(id) {
      const path = `http://localhost:5000/problem?id=${id}`;
      axios.get(path)
        .then((res) => {
          this.problem = res.data.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
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
    this.getProblemWithId(this.$props.id)
  }
}
</script>