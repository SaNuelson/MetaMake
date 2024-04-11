import { strict as assert } from 'assert'
import { pickMin } from '../array'

describe('pickMin', () => {
  it('should pick minimal element using identity', () => {
    const arr = [10, 4, 12, 5]

    const min = pickMin(arr)

    assert.equal(min, 4)
  })

  it('should pick minimal element using provided selector', () => {
    const expectedMinA = { a: 4, b: 12 }
    const expectedMinB = { a: 10, b: 5 }
    const expectedMinSum = { a: 6, b: 6 }
    const arr = [expectedMinA, expectedMinB, expectedMinSum]

    const minA = pickMin(arr, (item) => item.a)
    assert.deepEqual(minA, expectedMinA)

    const minB = pickMin(arr, (item) => item.b)
    assert.deepEqual(minB, expectedMinB)

    const minSum = pickMin(arr, (item) => item.a + item.b)
    assert.deepEqual(minSum, expectedMinSum)
  })
})
