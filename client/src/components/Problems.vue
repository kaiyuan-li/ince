<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Problems</h1>
        <hr><br><br>
        <button type="button" class="btn btn-success btn-sm" v-b-modal.book-modal>Pick One</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Title</th>
              <th scope="col">Difficulty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(problem, index) in problems" :key="index">
              <td>{{ problem.index }}</td>
              <td>{{ problem.title }}</td>
              <td>{{ problem.difficulty }}</td>
              <td>
                  <router-link :to="{ name: 'Code', params: {id: index }}">
                      Try
                  </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      problems: [],
    };
  },
  methods: {
    getProblems() {
      const path = 'http://localhost:5000/problems';
      axios.get(path)
        .then((res) => {
          this.problems = res.data.problems;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
  },
  created() {
    this.getProblems()
  },
};
</script>
