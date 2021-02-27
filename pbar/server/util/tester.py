def test_solution(solution, test_data):
  result = {
    'pass': False,
  }
  for data_point in test_data:
    got = solution.solve(data_point['input'])
    if got != data_point['want']:
      data_point['got'] = got
      result['type'] = 'FailedTestPoint'
      result['error'] = data_point
      return result
  result['pass'] = True
  return result

