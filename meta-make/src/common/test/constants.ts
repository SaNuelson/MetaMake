import { strict as assert } from 'assert'
import { createMetaUrl, MetaUrl, parseMetaUrl } from '../constants'

describe('createMetaUrl', () => {
  it('should leave parameterless URL untouched', () => {
    const url = createMetaUrl(MetaUrl.KnowledgeBaseCreate)

    assert.strictEqual(url, MetaUrl.KnowledgeBaseCreate)
  })

  it('should fill URL with parameters', () => {
    const url = createMetaUrl(MetaUrl.KnowledgeBase, 'test_kb')

    assert.strictEqual(url, '/kb/test_kb')
  })

  it('should leave empty parameter for URL when not provided', () => {
    const url = createMetaUrl(MetaUrl.KnowledgeBase)

    assert.strictEqual(url, '/kb/')
  })
})

describe('parseMetaUrl', () => {
  it('should leave parameterless URL untouched', () => {
    const parsed = parseMetaUrl("http://metamake.com" + MetaUrl.KnowledgeBaseCreate)

    assert.deepStrictEqual(parsed, [MetaUrl.KnowledgeBaseCreate])
  })

  it('should extract parameters from URL if exist', () => {
    const parsed = parseMetaUrl("http://metamake.com/kb/test_kb")

    assert.deepStrictEqual(parsed, [MetaUrl.KnowledgeBase, "test_kb"])
  })

  it("should throw if URL can't be parsed", () => {
    assert.throws(() => parseMetaUrl("http://metamake.com/unknown/"))
  })
})
