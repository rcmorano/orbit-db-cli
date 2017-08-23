
'use strict'

const assert = require('assert')
const CLI = require('./cli')

describe('OrbitDB CLI - Counter Database', function () {
  this.timeout(5000)

  const dbname = '/testdb'

  const checkValueCommand = `get ${dbname}`
  const getCounterValue = () => parseInt(CLI(checkValueCommand).toString())
  const contains = (str, match) => str.indexOf(match) > -1

  before(() => {
    // Make sure we don't have an existing database
    CLI(`drop ${dbname} yes`)
    CLI(`create ${dbname} counter`)
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${dbname} yes`)
  })

  it('returns the counter value', () => {
    assert.equal(getCounterValue(), 0)
  })

  it('increases a counter by 1', () => {
    CLI(`inc ${dbname}`)
    assert.equal(getCounterValue(), 1)
  })

  it('increases a counter by 33', () => {
    CLI(`increase ${dbname} 33`)
    assert.equal(getCounterValue(), 34)
  })

  it('is persisted', () => {
    assert.equal(getCounterValue(), 34)
  })

  it('can\'t decrease the counter', () => {
    let err
    try {
      CLI(`increase ${dbname} -33`)
    } catch (e) {
      err = e.toString()
    }
    assert.equal(contains(err, 'Invalid input value -33. Input must be greater than 0.'), true)
    assert.equal(getCounterValue(), 34)
  })

})